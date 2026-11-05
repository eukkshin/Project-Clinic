"use strict";
const express = require("express");
const Reservation = require("../entity/Reservation");
const ReservationStatusAudit = require("../entity/ReservationStatusAudit");
const { lockCalendar } = require("../reservations/service");
const { cancelReminder } = require("../reservations/reminder-service");
const { cancelQueued } = require("../messaging/message-service");
const { dateForSlot } = require("../reservations/config");
const ACTIONS = {
  VISITED: "방문완료",
  NO_SHOW: "노쇼",
  REVOKE_NO_SHOW: "판정취소",
};
const RESTORABLE_STATUSES = new Set(["예약확정", "예약대기"]);
function idOf(s) {
  const n = Number(s);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}
function createAdminAttendanceRouter({ dataSource }) {
  const router = express.Router();
  router.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  router.patch("/:id/attendance", async (req, res) => {
    const id = idOf(req.params.id);
    const action = req.body?.action;
    const reason =
      typeof req.body?.reason === "string" ? req.body.reason.trim() : "";
    if (
      !id ||
      !Object.hasOwn(ACTIONS, action) ||
      reason.length > 500 ||
      ((action === "NO_SHOW" || action === "REVOKE_NO_SHOW") &&
        reason.length < 5)
    )
      return res
        .status(400)
        .json({
          success: false,
          message: "판정 종류와 사유(5~500자)를 확인하세요.",
        });
    try {
      const state = await dataSource.transaction(async (manager) => {
        await lockCalendar(manager);
        await manager.query(
          "SELECT ID FROM RESERVATION_TB WHERE ID = :1 FOR UPDATE",
          [id],
        );
        const repo = manager.getRepository(Reservation);
        const row = await repo.findOne({ where: { ID: id } });
        if (!row) {
          const err = new Error("NOT_FOUND");
          err.status = 404;
          throw err;
        }
        const previous = row.STATUS;
        const valid =
          action === "REVOKE_NO_SHOW"
            ? previous === "노쇼"
            : previous === "예약확정" || previous === "예약대기";
        if (!valid) {
          const err = new Error("INVALID_STATUS");
          err.status = 409;
          throw err;
        }
        const start = dateForSlot(row.SLOT_DATE, row.SLOT_TIME);
        const now = Date.now();
        if (!start) {
          const err = new Error("BAD_TIME");
          err.status = 409;
          throw err;
        }
        if (action === "NO_SHOW" && now < start.getTime() + 30 * 60 * 1000) {
          const err = new Error("TOO_EARLY");
          err.status = 409;
          throw err;
        }
        if (
          action === "VISITED" &&
          now < start.getTime() - 2 * 60 * 60 * 1000
        ) {
          const err = new Error("TOO_EARLY_VISIT");
          err.status = 409;
          throw err;
        }
        const audit = manager.getRepository(ReservationStatusAudit);
        // 판정 취소는 별도의 예약 상태가 아닙니다. 노쇼 직전의 정상 상태로 되돌립니다.
        let nextStatus = ACTIONS[action];
        if (action === "REVOKE_NO_SHOW") {
          const lastNoShow = await audit.findOne({
            where: { RESERVATION_ID: id, NEXT_STATUS: "노쇼" },
            order: { ID: "DESC" },
          });
          if (
            !lastNoShow ||
            !RESTORABLE_STATUSES.has(lastNoShow.PREVIOUS_STATUS)
          ) {
            const err = new Error("MISSING_PREVIOUS_STATUS");
            err.status = 409;
            throw err;
          }
          nextStatus = lastNoShow.PREVIOUS_STATUS;
        }
        row.STATUS = nextStatus;
        await repo.save(row);
        if (action !== "REVOKE_NO_SHOW") {
          await cancelReminder(manager, id);
          await cancelQueued(manager, id);
        }
        await audit.save(
          audit.create({
            RESERVATION_ID: id,
            PREVIOUS_STATUS: previous,
            NEXT_STATUS: nextStatus,
            REASON:
              action === "REVOKE_NO_SHOW"
                ? `[노쇼 판정 취소] ${reason}`
                : reason ||
                  (action === "VISITED" ? "관리자가 실제 방문을 확인함" : ""),
            ADMIN_USER_ID: req.admin.userId,
          }),
        );
        return nextStatus;
      });
      return res.json({
        success: true,
        data: { id, status: state },
        message: "예약 상태를 기록했습니다.",
      });
    } catch (err) {
      if (err.status === 404)
        return res
          .status(404)
          .json({ success: false, message: "예약 내역이 없습니다." });
      if (err.status === 409)
        return res
          .status(409)
          .json({
            success: false,
            message:
              err.message === "TOO_EARLY"
                ? "예약시간 30분 이후에 노쇼를 기록할 수 있습니다."
                : err.message === "TOO_EARLY_VISIT"
                  ? "방문확인은 예약시간 2시간 전부터 가능합니다."
                  : err.message === "MISSING_PREVIOUS_STATUS"
                    ? "이전 예약 상태를 확인할 수 없어 판정 취소할 수 없습니다."
                    : "현재 상태에서는 선택한 처리가 불가능합니다.",
          });
      console.error("방문/노쇼 처리 실패:", err);
      return res
        .status(500)
        .json({ success: false, message: "예약 상태 처리 실패" });
    }
  });
  router.get("/:id/history", async (req, res) => {
    const id = idOf(req.params.id);
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "예약번호를 확인해 주세요." });
    try {
      const rows = await dataSource
        .getRepository(ReservationStatusAudit)
        .find({
          where: { RESERVATION_ID: id },
          order: { ID: "DESC" },
          take: 50,
        });
      return res.json({
        success: true,
        data: rows.map((r) => ({
          id: r.ID,
          from: r.PREVIOUS_STATUS,
          to: r.NEXT_STATUS,
          reason: r.REASON,
          adminId: r.ADMIN_USER_ID,
          createdAt: r.CREATED_AT,
        })),
      });
    } catch (err) {
      console.error("예약 판정 이력 조회 실패:", err);
      return res
        .status(500)
        .json({ success: false, message: "기록을 조회하지 못했습니다." });
    }
  });
  return router;
}
module.exports = { createAdminAttendanceRouter };
