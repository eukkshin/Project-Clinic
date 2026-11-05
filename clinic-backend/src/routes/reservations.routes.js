"use strict";
const express = require("express");
const { authenticateMember } = require("../middleware/authenticateMember");
const AppDataSource = require("../../db");
const Reservation = require("../entity/Reservation");
const ReservationBlock = require("../entity/ReservationBlock");
const {In} = require("typeorm");
const {upsertReminder, cancelReminder} = require("../reservations/reminder-service");
const {queueCreated,queueRescheduled,queueCancelled} = require("../messaging/message-service");
const {recordNotification,broadcastNotification} = require("../services/admin-notifications");
const {
  isValidMonth,
  canBook,
  ACTIVE_STATUSES,
  kstToday,
  dateForSlot,
  validateBookingInput,
} = require("../reservations/config");
const {
  BookingError,
  lockCalendar,
  insertConfirmed,
  activeReservationsForDate,
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
    const result = await AppDataSource.transaction(async (manager) => {
      // 인증 직후 탈퇴된 계정이 예약을 생성하지 못하도록 DB 상태를 잠가 재검증합니다.
      const accounts = await manager.query(
        "SELECT STATUS FROM MEMBER_TB WHERE USER_IDX = :1 FOR UPDATE",
        [req.user.userIdx],
      );
      if (accounts[0]?.STATUS !== "정상") {
        throw new BookingError(403, "회원 상태를 확인한 후 다시 로그인해 주세요.");
      }
      await lockCalendar(manager);
      const row = await insertConfirmed(manager, {
        userIdx: req.user.userIdx,
        department: req.body.department,
        date: req.body.date,
        time: req.body.time,
        memo: req.body.memo,
        name: req.member.USER_NAME,
        phone: req.member.PHONE,
        source: "MEMBER",
      });
      await upsertReminder(manager, row);
      await queueCreated(manager,row);
      const notification=await recordNotification(manager,"RESERVATION",Number(row.ID),"새 방문예약이 접수되었습니다.");
      return {row,notification};
    });
    broadcastNotification(result.notification);
    const row=result.row;
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
        await cancelReminder(manager, id);
        await queueCancelled(manager,row);
      });
      return res.json({ success: true, message: "예약이 취소되었습니다." });
    } catch (error) {
      return sendError(res, error, "회원 예약 취소 오류:");
    }
  },
);
// 회원 본인만 '방문 예정' 여부를 확인할 수 있습니다.
router.patch("/:id/confirm", authenticateMember, trustedOrigin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0)
    return res.status(400).json({success:false,message:"예약 번호가 올바르지 않습니다."});
  try {
    const confirmedAt = await AppDataSource.transaction(async manager => {
      await lockCalendar(manager);
      const repo = manager.getRepository(Reservation);
      const row = await repo.findOne({where:{ID:id, USER_IDX:req.user.userIdx}});
      if (!row) throw new BookingError(404,"내 예약을 찾지 못했습니다.");
      if (!ACTIVE_STATUSES.includes(row.STATUS) ||
          dateForSlot(row.SLOT_DATE,row.SLOT_TIME).getTime() <= Date.now())
        throw new BookingError(409,"지난 예약 또는 종료된 예약은 확인할 수 없습니다.");
      if (row.VISIT_CONFIRMED_AT) return row.VISIT_CONFIRMED_AT;
      const now = new Date();
      await repo.update({ID:id, USER_IDX:req.user.userIdx}, {VISIT_CONFIRMED_AT:now});
      return now;
    });
    return res.json({success:true, data:{id,visitConfirmedAt:confirmedAt},
      message:"방문 예정으로 확인했습니다."});
  } catch (error) { return sendError(res,error,"방문 예정 확인 오류:"); }
});

// 기존 예약의 시간 변경. 새로운 시간은 현재 운영 규칙과 예약 차단을 모두 통과해야 합니다.
router.patch("/:id/reschedule", authenticateMember, trustedOrigin, async(req,res) => {
  const id = Number(req.params.id);
  const {date,time} = req.body || {};
  if (!Number.isSafeInteger(id) || id <= 0 || !canBook(date,time))
    return res.status(400).json({success:false,message:"변경 가능한 날짜·시간을 선택해 주세요."});
  try {
    const result = await AppDataSource.transaction(async manager => {
      await lockCalendar(manager);
      const repo = manager.getRepository(Reservation);
      const row = await repo.findOne({where:{ID:id, USER_IDX:req.user.userIdx}});
      if (!row) throw new BookingError(404,"내 예약을 찾지 못했습니다.");
      if (!ACTIVE_STATUSES.includes(row.STATUS) ||
          dateForSlot(row.SLOT_DATE,row.SLOT_TIME).getTime() <= Date.now())
        throw new BookingError(409,"이미 종료되거나 지난 예약입니다.");
      if (row.SLOT_DATE===date && row.SLOT_TIME===time)
        throw new BookingError(409,"현재 예약과 동일한 시간입니다.");
      const blocked = await manager.getRepository(ReservationBlock).findOne({
        where:{BLOCK_DATE:date,BLOCK_TIME:In(["ALL",time])},select:{ID:true},
      });
      if (blocked) throw new BookingError(409,"관리자가 예약을 제한한 시간입니다.");
      const occupied = await activeReservationsForDate(manager,date);
      if (occupied.some(x=>x.ID!==id && x.SLOT_TIME===time))
        throw new BookingError(409,"이미 예약된 시간입니다.");
      const scheduledAt = dateForSlot(date,time);
      await repo.update({ID:id, USER_IDX:req.user.userIdx, STATUS:row.STATUS},{
        SLOT_DATE:date, SLOT_TIME:time, SCHEDULED_AT:scheduledAt,
        VISIT_CONFIRMED_AT:null,
      });
      row.SLOT_DATE=date;row.SLOT_TIME=time;row.SCHEDULED_AT=scheduledAt;
      await queueRescheduled(manager,row);
      await upsertReminder(manager,row);
      const notification=await recordNotification(manager,"RESERVATION",id,"방문예약 일정이 변경되었습니다.");
      return {scheduledAt,notification};
    });
    broadcastNotification(result.notification);
    return res.json({success:true,data:{id,scheduledAt:result.scheduledAt},
      message:"예약 일정을 변경했습니다."});
  } catch(error){ return sendError(res,error,"회원 예약 변경 오류:"); }
});

module.exports = { router, trustedOrigin, sendError };
