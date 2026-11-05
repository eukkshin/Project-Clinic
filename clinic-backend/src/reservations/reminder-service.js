"use strict";
const { LessThanOrEqual } = require("typeorm");
const Reservation = require("../entity/Reservation");
const ReservationReminder = require("../entity/ReservationReminder");
const { ACTIVE_STATUSES, dateForSlot, KST_OFFSET } = require("./config");
const {
  recordNotification,
  broadcastNotification,
} = require("../services/admin-notifications");

const SLOT_MINUTES = 24 * 60;
const DEFAULT_INTERVAL_MS = 60_000;
function kstStamp(ms) {
  return new Date(ms + KST_OFFSET).toISOString().slice(0, 16).replace("T", " ");
}
function reminderForSlot(date, time) {
  const when = dateForSlot(date, time);
  if (!when) throw new Error("예약 날짜·시간이 올바르지 않습니다.");
  return {
    slotKey: `${date} ${time}`,
    dueAt: kstStamp(when.getTime() - SLOT_MINUTES * 60_000),
  };
}

// 반드시 예약 생성/변경과 같은 DB 트랜잭션 안에서 실행합니다.
async function upsertReminder(manager, reservation) {
  const { slotKey, dueAt } = reminderForSlot(
    reservation.SLOT_DATE,
    reservation.SLOT_TIME,
  );
  const repo = manager.getRepository(ReservationReminder);
  const existing = await repo.findOne({
    where: { RESERVATION_ID: reservation.ID },
  });
  if (existing) {
    await repo.update(
      { ID: existing.ID },
      {
        SLOT_KEY: slotKey,
        DUE_AT_KST: dueAt,
        STATE: "PENDING",
        READY_AT: null,
        CONTACTED_AT: null,
        CONTACTED_BY: null,
      },
    );
  } else {
    await repo.save(
      repo.create({
        RESERVATION_ID: reservation.ID,
        SLOT_KEY: slotKey,
        DUE_AT_KST: dueAt,
        STATE: "PENDING",
      }),
    );
  }
}
async function cancelReminder(manager, reservationId) {
  await manager
    .getRepository(ReservationReminder)
    .update({ RESERVATION_ID: reservationId }, { STATE: "CANCELLED" });
}

// 외부 SMS 서비스가 없으므로 READY는 '발송 완료'가 아니라 '안내 대기'입니다.
// 예약 상태와 슬롯을 다시 확인하고, 잠금으로 중복 처리도 방지합니다.
async function sweepReminders(dataSource, nowMs = Date.now()) {
  const repo = dataSource.getRepository(ReservationReminder);
  const due = await repo.find({
    where: { STATE: "PENDING", DUE_AT_KST: LessThanOrEqual(kstStamp(nowMs)) },
    order: { DUE_AT_KST: "ASC" },
    take: 100,
  });
  let ready = 0;
  for (const candidate of due) {
    const notification = await dataSource.transaction(async (manager) => {
      await manager.query(
        "SELECT ID FROM RESERVATION_REMINDER_TB WHERE ID = :1 FOR UPDATE",
        [candidate.ID],
      );
      const rRepo = manager.getRepository(ReservationReminder);
      const item = await rRepo.findOne({ where: { ID: candidate.ID } });
      if (
        !item ||
        item.STATE !== "PENDING" ||
        item.DUE_AT_KST > kstStamp(nowMs)
      )
        return;
      const reservation = await manager.getRepository(Reservation).findOne({
        where: { ID: item.RESERVATION_ID },
      });
      const currentSlot =
        reservation && `${reservation.SLOT_DATE} ${reservation.SLOT_TIME}`;
      if (
        !reservation ||
        !ACTIVE_STATUSES.includes(reservation.STATUS) ||
        currentSlot !== item.SLOT_KEY ||
        dateForSlot(reservation.SLOT_DATE, reservation.SLOT_TIME).getTime() <=
          nowMs
      ) {
        await rRepo.update(
          { ID: item.ID, STATE: "PENDING" },
          { STATE: "CANCELLED" },
        );
        return null;
      }
      const updated = await rRepo.update(
        { ID: item.ID, STATE: "PENDING" },
        {
          STATE: "READY",
          READY_AT: new Date(nowMs),
        },
      );
      if (updated.affected) {
        ready += 1;
        return recordNotification(
          manager,
          "RESERVATION",
          item.RESERVATION_ID,
          "방문예약 하루 전 안내 대기 건이 있습니다.",
        );
      }
      return null;
    });
    if (notification) broadcastNotification(notification);
  }
  return ready;
}

let running = false;
let timer = null;
function startReminderWorker(
  dataSource,
  { intervalMs = DEFAULT_INTERVAL_MS } = {},
) {
  if (timer) return;
  async function tick() {
    if (running || !dataSource.isInitialized) return;
    running = true;
    try {
      await sweepReminders(dataSource);
    } catch (error) {
      console.error("[예약 리마인더] 안내 대기 처리 실패:", error);
    } finally {
      running = false;
    }
  }
  void tick();
  timer = setInterval(() => {
    void tick();
  }, intervalMs);
  if (timer.unref) timer.unref();
}

module.exports = {
  kstStamp,
  reminderForSlot,
  upsertReminder,
  cancelReminder,
  sweepReminders,
  startReminderWorker,
};
