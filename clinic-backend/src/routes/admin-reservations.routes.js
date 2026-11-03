"use strict";
const express = require("express");
const { Between, In } = require("typeorm");
const Reservation = require("../entity/Reservation");
const ReservationBlock = require("../entity/ReservationBlock");
const Member = require("../entity/Member");
const {
  ACTIVE_STATUSES,
  isValidDate,
  isValidMonth,
  timesForDate,
  validateBookingInput,
  monthRange,
} = require("../reservations/config");
const {
  BookingError,
  lockCalendar,
  activeReservationsForDate,
  insertConfirmed,
} = require("../reservations/service");
const { trustedOrigin, sendError } = require("./reservations.routes");

function createAdminReservationRouter({ dataSource, requireAdmin }) {
  if (typeof requireAdmin !== "function")
    throw new Error("관리자 인증 미들웨어가 필요합니다.");
  const router = express.Router();
  router.use(requireAdmin);

  router.get("/", async (req, res) => {
    const month = String(req.query.month || "").trim();
    const range = monthRange(month);
    if (!range)
      return res
        .status(400)
        .json({ success: false, message: "month=YYYY-MM 형식이 필요합니다." });
    try {
      const reservations = await dataSource.getRepository(Reservation).find({
        where: { SLOT_DATE: Between(range.startDate, range.endDate) },
        order: { SLOT_DATE: "ASC", SLOT_TIME: "ASC" },
      });
      const blocks = await dataSource.getRepository(ReservationBlock).find({
        where: { BLOCK_DATE: Between(range.startDate, range.endDate) },
        order: { BLOCK_DATE: "ASC", BLOCK_TIME: "ASC" },
      });
      const memberIds = [
        ...new Set(
          reservations.map((r) => r.USER_IDX).filter((v) => v != null),
        ),
      ];
      const members = memberIds.length
        ? await dataSource.getRepository(Member).find({
            where: { USER_IDX: In(memberIds) },
            select: {
              USER_IDX: true,
              USER_NAME: true,
              PHONE: true,
              USER_ID: true,
            },
          })
        : [];
      const memberMap = new Map(members.map((m) => [Number(m.USER_IDX), m]));
      const data = reservations.map((row) => {
        const member = memberMap.get(Number(row.USER_IDX));
        return {
          id: row.ID,
          userIdx: row.USER_IDX,
          department: row.DEPARTMENT,
          scheduledAt: row.SCHEDULED_AT,
          slotDate: row.SLOT_DATE,
          slotTime: row.SLOT_TIME,
          status: row.STATUS,
          memo: row.MEMO,
          name: row.CONTACT_NAME || member?.USER_NAME || "미등록",
          phone: row.CONTACT_PHONE || member?.PHONE || "",
          source: row.SOURCE || "MEMBER",
        };
      });
      res.set("Cache-Control", "no-store");
      return res.json({ success: true, data: { reservations: data, blocks } });
    } catch (error) {
      return sendError(res, error, "관리자 예약 목록 조회 오류:");
    }
  });

  // time='ALL'이면 하루 전체 차단. 기존 예약이 있다면 먼저 강제 취소해야 합니다.
  router.post("/blocks", trustedOrigin, async (req, res) => {
    const { date, time = "ALL", reason = "" } = req.body || {};
    if (
      !isValidDate(date) ||
      (time !== "ALL" && !timesForDate(date).includes(time)) ||
      typeof reason !== "string" ||
      reason.length > 200
    ) {
      return res.status(400).json({
        success: false,
        message: "차단 날짜·시간·사유를 확인해 주세요.",
      });
    }
    try {
      const block = await dataSource.transaction(async (manager) => {
        await lockCalendar(manager);
        const active = await activeReservationsForDate(manager, date);
        const overlaps =
          time === "ALL"
            ? active.length > 0
            : active.some((r) => r.SLOT_TIME === time);
        if (overlaps)
          throw new BookingError(
            409,
            "이미 확정된 예약이 있습니다. 먼저 강제 취소 후 차단해 주세요.",
          );
        const repo = manager.getRepository(ReservationBlock);
        const exists = await repo.findOne({
          where: { BLOCK_DATE: date, BLOCK_TIME: time },
          select: { ID: true },
        });
        if (exists) throw new BookingError(409, "이미 차단된 날짜·시간입니다.");
        return repo.save(
          repo.create({
            BLOCK_DATE: date,
            BLOCK_TIME: time,
            REASON: reason.trim() || null,
          }),
        );
      });
      return res.status(201).json({
        success: true,
        data: { id: block.ID },
        message: "예약 불가 설정을 저장했습니다.",
      });
    } catch (error) {
      return sendError(res, error, "예약 차단 오류:");
    }
  });

  router.delete("/blocks/:id", trustedOrigin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0)
      return res
        .status(400)
        .json({ success: false, message: "차단 번호가 올바르지 않습니다." });
    try {
      await dataSource.transaction(async (manager) => {
        await lockCalendar(manager);
        const result = await manager
          .getRepository(ReservationBlock)
          .delete({ ID: id });
        if (!result.affected)
          throw new BookingError(404, "차단 기록이 없습니다.");
      });
      return res.json({ success: true, message: "차단을 해제했습니다." });
    } catch (error) {
      return sendError(res, error, "차단 해제 오류:");
    }
  });

  // 관리자가 직접 고객 정보를 받아 예약자를 추가합니다. 선택한 시간은 다른 예약과 중복 불가.
  router.post("/", trustedOrigin, async (req, res) => {
    const issue = validateBookingInput(req.body, { manual: true });
    const { name, phone, userId } = req.body || {};
    if (issue) return res.status(400).json({ success: false, message: issue });
    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 80 ||
      typeof phone !== "string" ||
      !/^[0-9+()\-\s]{8,30}$/.test(phone.trim()) ||
      (userId !== undefined &&
        (typeof userId !== "string" || userId.length > 50))
    ) {
      return res.status(400).json({
        success: false,
        message: "예약자 이름·연락처·회원 아이디를 확인해 주세요.",
      });
    }
    try {
      const row = await dataSource.transaction(async (manager) => {
        await lockCalendar(manager);
        let userIdx = null;
        if (userId?.trim()) {
          const member = await manager.getRepository(Member).findOne({
            where: { USER_ID: userId.trim(), STATUS: "정상" },
            select: { USER_IDX: true },
          });
          if (!member)
            throw new BookingError(404, "해당 회원 아이디를 찾을 수 없습니다.");
          userIdx = member.USER_IDX;
        }
        return insertConfirmed(manager, {
          userIdx,
          department: req.body.department,
          date: req.body.date,
          time: req.body.time,
          memo: req.body.memo,
          name: name.trim(),
          phone: phone.trim(),
          source: "MANUAL",
          manual: true,
        });
      });
      return res.status(201).json({
        success: true,
        data: { id: row.ID },
        message: "예약자를 추가하고 바로 확정했습니다.",
      });
    } catch (error) {
      return sendError(res, error, "관리자 예약 수동 추가 오류:");
    }
  });

  router.patch("/:id/cancel", trustedOrigin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0)
      return res
        .status(400)
        .json({ success: false, message: "예약 번호가 올바르지 않습니다." });
    try {
      await dataSource.transaction(async (manager) => {
        await lockCalendar(manager);
        const repo = manager.getRepository(Reservation);
        const row = await repo.findOne({ where: { ID: id } });
        if (!row) throw new BookingError(404, "예약이 없습니다.");
        if (!ACTIVE_STATUSES.includes(row.STATUS))
          throw new BookingError(409, "이미 취소되었거나 종료된 예약입니다.");
        await repo.update({ ID: id, STATUS: row.STATUS }, { STATUS: "취소" });
      });
      return res.json({
        success: true,
        message: "관리자가 예약을 강제 취소했습니다.",
      });
    } catch (error) {
      return sendError(res, error, "관리자 예약 취소 오류:");
    }
  });

  return router;
}
module.exports = { createAdminReservationRouter };
