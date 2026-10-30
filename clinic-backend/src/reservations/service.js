"use strict";
const { Between, In } = require("typeorm");
const Reservation = require("../entity/Reservation");
const ReservationBlock = require("../entity/ReservationBlock");
const {
  ACTIVE_STATUSES,
  canBook,
  dateForSlot,
  monthRange,
  timesForDate,
} = require("./config");

class BookingError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// 락 테이블의 하나뿐인 행을 잡습니다. 모든 예약/차단/취소 쓰기 작업에서 동일 락을 사용합니다.
// 두 고객이 동시에 마지막 자리를 누르거나 관리자가 동시에 차단하는 경합을 직렬화합니다.
async function lockCalendar(manager) {
  await manager.query(
    "SELECT LOCK_ID FROM RESERVATION_BOOKING_LOCK_TB WHERE LOCK_ID = 1 FOR UPDATE",
  );
}

async function activeReservationsForDate(manager, date) {
  return manager.getRepository(Reservation).find({
    where: { SLOT_DATE: date, STATUS: In(ACTIVE_STATUSES) },
    select: { ID: true, SLOT_DATE: true, SLOT_TIME: true, STATUS: true },
  });
}
async function isBlocked(manager, date, time) {
  const blocks = await manager.getRepository(ReservationBlock).find({
    where: { BLOCK_DATE: date, BLOCK_TIME: In(["ALL", time]) },
    select: { ID: true },
  });
  return blocks.length > 0;
}
async function insertConfirmed(
  manager,
  {
    userIdx,
    department,
    date,
    time,
    memo,
    name,
    phone,
    source,
    manual = false,
  },
) {
  const when = dateForSlot(date, time);
  if (!canBook(date, time, manual ? 0 : undefined))
    throw new BookingError(400, "현재 예약할 수 없는 시간입니다.");
  if (await isBlocked(manager, date, time))
    throw new BookingError(409, "관리자가 예약을 제한한 시간입니다.");
  const active = await manager.getRepository(Reservation).findOne({
    where: { SLOT_DATE: date, SLOT_TIME: time, STATUS: In(ACTIVE_STATUSES) },
    select: { ID: true },
  });
  if (active)
    throw new BookingError(
      409,
      "이미 예약된 시간입니다. 다른 시간을 선택해 주세요.",
    );
  const repository = manager.getRepository(Reservation);
  return repository.save(
    repository.create({
      USER_IDX: userIdx ?? null,
      DEPARTMENT: department,
      SCHEDULED_AT: when,
      SLOT_DATE: date,
      SLOT_TIME: time,
      STATUS: "예약확정",
      MEMO: memo?.trim() || null,
      CONTACT_NAME: name ?? null,
      CONTACT_PHONE: phone ?? null,
      SOURCE: source || "MEMBER",
    }),
  );
}
async function monthAvailability(dataSource, month) {
  const range = monthRange(month);
  if (!range) throw new BookingError(400, "올바른 월 형식이 아닙니다.");
  const [reservations, blocks] = await Promise.all([
    dataSource.getRepository(Reservation).find({
      where: {
        SLOT_DATE: Between(range.startDate, range.endDate),
        STATUS: In(ACTIVE_STATUSES),
      },
      select: { ID: true, SLOT_DATE: true, SLOT_TIME: true },
    }),
    dataSource.getRepository(ReservationBlock).find({
      where: { BLOCK_DATE: Between(range.startDate, range.endDate) },
      select: { ID: true, BLOCK_DATE: true, BLOCK_TIME: true },
    }),
  ]);
  const occupied = new Set(
    reservations.map((r) => `${r.SLOT_DATE}|${r.SLOT_TIME}`),
  );
  const blocked = new Set(blocks.map((b) => `${b.BLOCK_DATE}|${b.BLOCK_TIME}`));
  const days = Array.from({ length: range.last }, (_, i) => {
    const date = `${month}-${String(i + 1).padStart(2, "0")}`;
    const slots = timesForDate(date).map((time) => {
      const unavailableByTime = !canBook(date, time);
      const unavailableByBlock =
        blocked.has(`${date}|ALL`) || blocked.has(`${date}|${time}`);
      const unavailableByReservation = occupied.has(`${date}|${time}`);
      return {
        time,
        available:
          !unavailableByTime &&
          !unavailableByBlock &&
          !unavailableByReservation,
        reason: unavailableByBlock
          ? "blocked"
          : unavailableByReservation
            ? "booked"
            : unavailableByTime
              ? "closed"
              : null,
      };
    });
    return {
      date,
      availableCount: slots.filter((slot) => slot.available).length,
      slots,
    };
  });
  return { month, days };
}
module.exports = {
  BookingError,
  lockCalendar,
  activeReservationsForDate,
  insertConfirmed,
  monthAvailability,
};
