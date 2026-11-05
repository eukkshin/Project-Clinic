"use strict";
const { randomUUID } = require("crypto");
const { LessThanOrEqual } = require("typeorm");
const Reservation = require("../entity/Reservation");
const ReservationMessage = require("../entity/ReservationMessage");
const ReservationMessagePolicy = require("../entity/ReservationMessagePolicy");
const {
  dateForSlot,
  ACTIVE_STATUSES,
  KST_OFFSET,
} = require("../reservations/config");
const { providerReady, sendMessage } = require("./provider");

const ACTIVE_EVENTS = new Set(["CREATED", "RESCHEDULED", "REMINDER"]);
const EVENTS = {
  CREATED: "SEND_CREATED",
  RESCHEDULED: "SEND_RESCHEDULED",
  CANCELLED: "SEND_CANCELLED",
  REMINDER: "SEND_REMINDER",
};
const stamp = (ms) =>
  new Date(ms + KST_OFFSET).toISOString().slice(0, 16).replace("T", " ");
const currentHour = (ms) =>
  Number(new Date(ms + KST_OFFSET).toISOString().slice(11, 13));
function slotKey(row) {
  return `${row.SLOT_DATE} ${row.SLOT_TIME}`;
}
async function getPolicy(manager) {
  return manager
    .getRepository(ReservationMessagePolicy)
    .findOne({ where: { ID: 1 } });
}
async function cancelQueued(manager, id) {
  const repo = manager.getRepository(ReservationMessage);
  await repo.update(
    { RESERVATION_ID: id, STATE: "QUEUED" },
    { STATE: "CANCELLED" },
  );
}
// 예약 생성/변경과 같은 트랜잭션에서 호출. 설정이 비활성화되었을 때는 소급 발송을 위해 쌓아두지 않습니다.
async function queueEvent(
  manager,
  reservation,
  event,
  { nowMs = Date.now() } = {},
) {
  if (!Object.hasOwn(EVENTS, event)) throw new Error("잘못된 예약 알림 이벤트");
  const policy = await getPolicy(manager);
  if (
    !policy ||
    Number(policy.ENABLED) !== 1 ||
    Number(policy[EVENTS[event]]) !== 1
  )
    return null;
  const when = dateForSlot(reservation.SLOT_DATE, reservation.SLOT_TIME);
  if (!when) throw new Error("예약 슬롯 정보를 확인할 수 없습니다.");
  const dueAt =
    event === "REMINDER"
      ? when.getTime() - Number(policy.REMINDER_HOURS) * 3600000
      : nowMs;
  // 이미 지나간 예약에 방문 전 안내를 발송하지 않습니다.
  if (event === "REMINDER" && when.getTime() <= nowMs) return null;
  const repository = manager.getRepository(ReservationMessage);
  const suffix = event === "RESCHEDULED" ? `:${randomUUID()}` : "";
  const key = `RES:${reservation.ID}:${event}:${slotKey(reservation)}${suffix}`;
  const exists = await repository.findOne({ where: { DEDUPE_KEY: key } });
  if (exists) {
    // A -> B -> A 처럼 과거 슬롯으로 돌아오면, 취소했던 REMINDER를 새 일정으로 다시 대기시킵니다.
    if (
      event === "REMINDER" &&
      ["CANCELLED", "SKIPPED"].includes(exists.STATE)
    ) {
      await repository.update(
        { ID: exists.ID, STATE: exists.STATE },
        {
          STATE: "QUEUED",
          DUE_AT_KST: stamp(dueAt),
          CHANNEL: policy.CHANNEL,
          ATTEMPTS: 0,
          LAST_ERROR: null,
          PROVIDER_REF: null,
          ACCEPTED_AT: null,
        },
      );
      return repository.findOne({ where: { ID: exists.ID } });
    }
    return exists;
  }
  return repository.save(
    repository.create({
      RESERVATION_ID: reservation.ID,
      EVENT_TYPE: event,
      SLOT_KEY: slotKey(reservation),
      DEDUPE_KEY: key,
      DUE_AT_KST: stamp(dueAt),
      CHANNEL: policy.CHANNEL,
      STATE: "QUEUED",
      ATTEMPTS: 0,
    }),
  );
}
async function queueCreated(manager, row) {
  await queueEvent(manager, row, "CREATED");
  await queueEvent(manager, row, "REMINDER");
}
async function queueRescheduled(manager, row) {
  await cancelQueued(manager, row.ID);
  await queueEvent(manager, row, "RESCHEDULED");
  await queueEvent(manager, row, "REMINDER");
}
async function queueCancelled(manager, row) {
  await cancelQueued(manager, row.ID);
  await queueEvent(manager, row, "CANCELLED");
}
function validForDispatch(message, reservation, nowMs) {
  if (!reservation) return false;
  if (message.SLOT_KEY !== slotKey(reservation)) return false;
  if (message.EVENT_TYPE === "CANCELLED") return reservation.STATUS === "취소";
  if (
    !ACTIVE_EVENTS.has(message.EVENT_TYPE) ||
    !ACTIVE_STATUSES.includes(reservation.STATUS)
  )
    return false;
  const time = dateForSlot(reservation.SLOT_DATE, reservation.SLOT_TIME);
  // 예약일이 이미 지난 생성/일정변경/리마인더는 발송하지 않습니다.
  return !!time && time.getTime() > nowMs;
}
// 1건씩 DB에서 원자적 점유 후 네트워크를 호출합니다. 모호한 오류는 UNKNOWN으로 남겨 자동 중복 발송하지 않습니다.
async function dispatchQueued(
  dataSource,
  { nowMs = Date.now(), deliver = sendMessage } = {},
) {
  const policy = await getPolicy(dataSource);
  if (!policy || Number(policy.ENABLED) !== 1 || !providerReady(policy.CHANNEL))
    return { processed: 0, reason: "DISABLED_OR_UNCONFIGURED" };
  const hour = currentHour(nowMs);
  if (hour < Number(policy.START_HOUR) || hour >= Number(policy.END_HOUR))
    return { processed: 0, reason: "OUTSIDE_SEND_WINDOW" };
  const queue = await dataSource.getRepository(ReservationMessage).find({
    where: { STATE: "QUEUED", DUE_AT_KST: LessThanOrEqual(stamp(nowMs)) },
    order: { DUE_AT_KST: "ASC", ID: "ASC" },
    take: 40,
  });
  let processed = 0;
  for (const queued of queue) {
    const job = await dataSource.transaction(async (manager) => {
      await manager.query(
        "SELECT ID FROM RESERVATION_MESSAGE_TB WHERE ID = :1 FOR UPDATE",
        [queued.ID],
      );
      const repo = manager.getRepository(ReservationMessage);
      const message = await repo.findOne({ where: { ID: queued.ID } });
      if (
        !message ||
        message.STATE !== "QUEUED" ||
        message.DUE_AT_KST > stamp(nowMs)
      )
        return null;
      if (
        message.CHANNEL !== policy.CHANNEL ||
        Number(policy[EVENTS[message.EVENT_TYPE]]) !== 1
      ) {
        await repo.update(
          { ID: message.ID, STATE: "QUEUED" },
          {
            STATE: "SKIPPED",
            LAST_ERROR: "발송 채널 또는 알림 유형 설정 변경",
          },
        );
        return null;
      }
      const reservation = await manager
        .getRepository(Reservation)
        .findOne({ where: { ID: message.RESERVATION_ID } });
      if (!validForDispatch(message, reservation, nowMs)) {
        await repo.update(
          { ID: message.ID, STATE: "QUEUED" },
          { STATE: "SKIPPED", LAST_ERROR: "예약 일정 또는 상태가 변경됨" },
        );
        return null;
      }
      // 수신 가능한 전화번호가 없는 건 실패로 기록하고 재전송하지 않습니다.
      if (
        !/^01[016789][0-9]{7,8}$/.test(
          String(reservation.CONTACT_PHONE || "").replace(/\D/g, ""),
        )
      ) {
        await repo.update(
          { ID: message.ID, STATE: "QUEUED" },
          { STATE: "FAILED", LAST_ERROR: "수신 가능한 휴대전화 번호가 없음" },
        );
        return null;
      }
      await repo.update(
        { ID: message.ID, STATE: "QUEUED" },
        {
          STATE: "PROCESSING",
          ATTEMPTS: Number(message.ATTEMPTS) + 1,
          LAST_ERROR: null,
        },
      );
      return { message, reservation };
    });
    if (!job) continue;
    processed++;
    try {
      const reference = await deliver(job.message, job.reservation);
      await dataSource.getRepository(ReservationMessage).update(
        { ID: job.message.ID, STATE: "PROCESSING" },
        {
          STATE: "ACCEPTED",
          PROVIDER_REF: reference,
          ACCEPTED_AT: new Date(),
          LAST_ERROR: null,
        },
      );
    } catch (error) {
      const deterministic = [
        "CONFIG_MISSING",
        "INVALID_PHONE",
        "REJECTED",
      ].includes(error?.code);
      await dataSource.getRepository(ReservationMessage).update(
        { ID: job.message.ID, STATE: "PROCESSING" },
        {
          STATE: deterministic ? "FAILED" : "UNKNOWN",
          LAST_ERROR: deterministic
            ? String(error.message).slice(0, 400)
            : "발송 결과 확인 필요: 공급자 요청이 실패하거나 응답 불명확",
        },
      );
      console.error("[예약 안내] 발송 접수 오류:", error?.code || "UNKNOWN");
    }
  }
  return { processed };
}
let timer = null;
let running = false;
function startMessageWorker(dataSource, { intervalMs = 60_000 } = {}) {
  if (timer) return;
  async function tick() {
    if (running || !dataSource.isInitialized) return;
    running = true;
    try {
      await dispatchQueued(dataSource);
    } catch (error) {
      console.error("[예약 안내] 발송 대기열 처리 실패:", error);
    } finally {
      running = false;
    }
  }
  void tick();
  timer = setInterval(() => void tick(), intervalMs);
  timer.unref?.();
}
module.exports = {
  stamp,
  slotKey,
  getPolicy,
  cancelQueued,
  queueEvent,
  queueCreated,
  queueRescheduled,
  queueCancelled,
  validForDispatch,
  dispatchQueued,
  startMessageWorker,
};
