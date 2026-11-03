"use strict";

// 예시 운영 시간표입니다. 실제 병원 운영 시간과 상담 간격에 맞춰 반드시 변경하세요.
// getUTCDay(): 일요일=0, 월요일=1, ... 토요일=6
const WEEKLY_SLOTS = Object.freeze({
  0: [],
  1: [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ],
  2: [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ],
  3: [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ],
  4: [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ],
  5: [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ],
  6: ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30"],
});

const DEPARTMENTS = Object.freeze([
  "눈 성형",
  "코 성형",
  "리프팅",
  "피부·쁘띠",
  "기타 상담",
]);
const ACTIVE_STATUSES = ["예약대기", "예약확정"];
const MIN_NOTICE_MS = 2 * 60 * 60 * 1000;
const MAX_ADVANCE_DAYS = 90;
const KST_OFFSET = 9 * 60 * 60 * 1000;

function isValidDate(date) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date))
    return false;
  const d = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === date;
}
function isValidMonth(month) {
  return (
    typeof month === "string" &&
    /^\d{4}-(0[1-9]|1[0-2])$/.test(month) &&
    Number(month.slice(0, 4)) >= 2000 &&
    Number(month.slice(0, 4)) <= 2100
  );
}
function kstToday() {
  return new Date(Date.now() + KST_OFFSET).toISOString().slice(0, 10);
}
function dateForSlot(date, time) {
  if (
    !isValidDate(date) ||
    typeof time !== "string" ||
    !/^\d{2}:\d{2}$/.test(time)
  )
    return null;
  const instant = new Date(`${date}T${time}:00.000+09:00`);
  if (Number.isNaN(instant.getTime())) return null;
  const roundTrip = new Date(instant.getTime() + KST_OFFSET)
    .toISOString()
    .slice(0, 16);
  return roundTrip === `${date}T${time}` ? instant : null;
}
function timesForDate(date) {
  if (!isValidDate(date)) return [];
  const day = new Date(`${date}T00:00:00.000Z`).getUTCDay();
  return WEEKLY_SLOTS[day] || [];
}
function canBook(date, time, minNoticeMs = MIN_NOTICE_MS) {
  const instant = dateForSlot(date, time);
  if (!instant || !timesForDate(date).includes(time)) return false;
  const difference = instant.getTime() - Date.now();
  return difference >= minNoticeMs && difference <= MAX_ADVANCE_DAYS * 86400000;
}
function monthRange(month) {
  if (!isValidMonth(month)) return null;
  const [year, mm] = month.split("-").map(Number);
  const last = new Date(Date.UTC(year, mm, 0)).getUTCDate();
  const startDate = `${month}-01`;
  const endDate = `${month}-${String(last).padStart(2, "0")}`;
  const nextMonth = new Date(Date.UTC(year, mm, 1)).toISOString().slice(0, 7);
  return {
    startDate,
    endDate,
    first: dateForSlot(startDate, "00:00"),
    after: dateForSlot(`${nextMonth}-01`, "00:00"),
    last,
  };
}
function validateBookingInput(input, { manual = false } = {}) {
  const department = input?.department;
  const date = input?.date;
  const time = input?.time;
  const memo = input?.memo ?? "";
  if (!DEPARTMENTS.includes(department))
    return "올바른 상담 분야를 선택해 주세요.";
  if (!canBook(date, time, manual ? 0 : MIN_NOTICE_MS))
    return "선택한 날짜·시간은 예약할 수 없습니다.";
  if (typeof memo !== "string" || memo.length > 1000)
    return "요청사항은 1000자 이하여야 합니다.";
  return null;
}
module.exports = {
  WEEKLY_SLOTS,
  DEPARTMENTS,
  ACTIVE_STATUSES,
  KST_OFFSET,
  isValidDate,
  isValidMonth,
  kstToday,
  dateForSlot,
  timesForDate,
  canBook,
  monthRange,
  validateBookingInput,
};
