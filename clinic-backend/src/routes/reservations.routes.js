"use strict";
const express = require("express");
const { authenticateMember } = require("../middleware/authenticateMember");
const AppDataSource = require("../../db");
const Reservation = require("../entity/Reservation");
const {
  isValidMonth,
  kstToday,
  dateForSlot,
  validateBookingInput,
} = require("../reservations/config");
const {
  BookingError,
  lockCalendar,
  insertConfirmed,
  monthAvailability,
} = require("../reservations/service");
const router = express.Router();

function trustedOrigin(req, res, next) {
  const configured = process.env.FRONTEND_ORIGIN;
  const allowed = (
    configured
      ? configured.split(",")
      : [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:3002",
          "http://127.0.0.1:3000",
          "http://127.0.0.1:3001",
        ]
  )
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (!allowed.includes(req.get("origin"))) {
    return res
      .status(403)
      .json({ success: false, message: "허용되지 않은 출처입니다." });
  }
  next();
}
function sendError(res, error, context) {
  if (error instanceof BookingError)
    return res
      .status(error.status)
      .json({ success: false, message: error.message });
  if (String(error?.message).includes("ORA-00001"))
    return res
      .status(409)
      .json({
        success: false,
        message: "이미 예약되었거나 차단된 시간입니다.",
      });
  console.error(context, error);
  return res
    .status(500)
    .json({
      success: false,
      message: "예약 처리 중 서버 오류가 발생했습니다.",
    });
}

// 공개 조회. 회원 정보는 응답하지 않습니다.
router.get("/availability", async (req, res) => {
  const month = String(req.query.month || kstToday().slice(0, 7));
  if (!isValidMonth(month))
    return res
      .status(400)
      .json({ success: false, message: "월 형식은 YYYY-MM입니다." });
  try {
    const data = await monthAvailability(AppDataSource, month);
    res.set("Cache-Control", "no-store");
    return res.json({ success: true, data });
  } catch (error) {
    return sendError(res, error, "예약 가능 시간 조회 오류:");
  }
});

router.post("/", authenticateMember, trustedOrigin, async (req, res) => {
  const message = validateBookingInput(req.body);
  if (message) return res.status(400).json({ success: false, message });
  try {
    const row = await AppDataSource.transaction(async (manager) => {
      await lockCalendar(manager);
      return insertConfirmed(manager, {
        userIdx: req.user.userIdx,
        department: req.body.department,
        date: req.body.date,
        time: req.body.time,
        memo: req.body.memo,
        name: req.member.USER_NAME,
        phone: req.member.PHONE,
        source: "MEMBER",
      });
    });
    res.set("Cache-Control", "no-store");
    return res.status(201).json({
      success: true,
      message: "상담 방문 예약이 즉시 확정되었습니다.",
      data: {
        id: row.ID,
        status: row.STATUS,
        department: row.DEPARTMENT,
        scheduledAt: row.SCHEDULED_AT,
      },
    });
  } catch (error) {
    return sendError(res, error, "회원 예약 등록 오류:");
  }
});

router.patch(
  "/:id/cancel",
  authenticateMember,
  trustedOrigin,
  async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0)
      return res
        .status(400)
        .json({ success: false, message: "예약 번호가 올바르지 않습니다." });
    try {
      await AppDataSource.transaction(async (manager) => {
        await lockCalendar(manager);
        const repo = manager.getRepository(Reservation);
        const row = await repo.findOne({
          where: { ID: id, USER_IDX: req.user.userIdx },
        });
        if (!row) throw new BookingError(404, "내 예약을 찾지 못했습니다.");
        if (!["예약대기", "예약확정"].includes(row.STATUS))
          throw new BookingError(409, "이미 종료되었거나 취소된 예약입니다.");
        if (dateForSlot(row.SLOT_DATE, row.SLOT_TIME).getTime() <= Date.now())
          throw new BookingError(
            409,
            "지난 예약은 온라인 취소가 불가능합니다.",
          );
        await repo.update(
          { ID: id, USER_IDX: req.user.userIdx, STATUS: row.STATUS },
          { STATUS: "취소" },
        );
      });
      return res.json({ success: true, message: "예약이 취소되었습니다." });
    } catch (error) {
      return sendError(res, error, "회원 예약 취소 오류:");
    }
  },
);
module.exports = { router, trustedOrigin, sendError };
