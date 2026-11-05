"use strict";
const express = require("express");
const ReservationMessage = require("../entity/ReservationMessage");
const ReservationMessagePolicy = require("../entity/ReservationMessagePolicy");
const { providerReady } = require("../messaging/provider");
const { getPolicy } = require("../messaging/message-service");
const { trustedOrigin } = require("./reservations.routes");
const BOOLEAN_FIELDS = [
  "ENABLED",
  "SEND_CREATED",
  "SEND_RESCHEDULED",
  "SEND_CANCELLED",
  "SEND_REMINDER",
];
function outPolicy(p) {
  return {
    enabled: !!Number(p.ENABLED),
    channel: p.CHANNEL,
    sendCreated: !!Number(p.SEND_CREATED),
    sendRescheduled: !!Number(p.SEND_RESCHEDULED),
    sendCancelled: !!Number(p.SEND_CANCELLED),
    sendReminder: !!Number(p.SEND_REMINDER),
    reminderHours: Number(p.REMINDER_HOURS),
    startHour: Number(p.START_HOUR),
    endHour: Number(p.END_HOUR),
    providerReady: providerReady(p.CHANNEL),
    transport: (
      process.env.RESERVATION_MESSAGE_TRANSPORT || "disabled"
    ).toLowerCase(),
  };
}
function createAdminReservationMessagesRouter({ dataSource }) {
  const router = express.Router();
  router.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  router.get("/settings", async (req, res) => {
    try {
      const p = await getPolicy(dataSource);
      return res.json({ success: true, data: outPolicy(p) });
    } catch (error) {
      console.error("안내 설정 조회 오류:", error);
      return res
        .status(500)
        .json({ success: false, message: "설정을 불러오지 못했습니다." });
    }
  });
  router.put("/settings", trustedOrigin, async (req, res) => {
    const input = req.body || {};
    const bools = [
      "enabled",
      "sendCreated",
      "sendRescheduled",
      "sendCancelled",
      "sendReminder",
    ];
    if (
      bools.some((key) => typeof input[key] !== "boolean") ||
      !["SMS", "KAKAO"].includes(input.channel) ||
      ![12, 24, 48, 72].includes(input.reminderHours) ||
      !Number.isInteger(input.startHour) ||
      input.startHour < 0 ||
      input.startHour > 22 ||
      !Number.isInteger(input.endHour) ||
      input.endHour <= input.startHour ||
      input.endHour > 24
    )
      return res
        .status(400)
        .json({ success: false, message: "알림 설정값이 올바르지 않습니다." });
    if (input.enabled && !providerReady(input.channel))
      return res
        .status(409)
        .json({
          success: false,
          message:
            "SOLAPI 계정·발신번호 또는 승인된 알림톡 템플릿 설정이 필요합니다.",
        });
    try {
      const repo = dataSource.getRepository(ReservationMessagePolicy);
      await repo.update(
        { ID: 1 },
        {
          ENABLED: Number(input.enabled),
          CHANNEL: input.channel,
          SEND_CREATED: Number(input.sendCreated),
          SEND_RESCHEDULED: Number(input.sendRescheduled),
          SEND_CANCELLED: Number(input.sendCancelled),
          SEND_REMINDER: Number(input.sendReminder),
          REMINDER_HOURS: input.reminderHours,
          START_HOUR: input.startHour,
          END_HOUR: input.endHour,
        },
      );
      return res.json({
        success: true,
        data: outPolicy(await getPolicy(dataSource)),
      });
    } catch (error) {
      console.error("안내 설정 저장 오류:", error);
      return res
        .status(500)
        .json({ success: false, message: "설정 저장에 실패했습니다." });
    }
  });
  router.get("/", async (req, res) => {
    try {
      const take = Math.min(100, Math.max(1, Number(req.query.limit) || 40));
      const rows = await dataSource
        .getRepository(ReservationMessage)
        .find({ order: { ID: "DESC" }, take });
      return res.json({
        success: true,
        data: rows.map((row) => ({
          id: row.ID,
          reservationId: row.RESERVATION_ID,
          eventType: row.EVENT_TYPE,
          slotKey: row.SLOT_KEY,
          dueAtKst: row.DUE_AT_KST,
          channel: row.CHANNEL,
          state: row.STATE,
          attempts: Number(row.ATTEMPTS),
          error: row.LAST_ERROR,
          acceptedAt: row.ACCEPTED_AT,
          createdAt: row.CREATED_AT,
        })),
      });
    } catch (error) {
      console.error("안내 발송이력 조회 오류:", error);
      return res
        .status(500)
        .json({ success: false, message: "발송 이력을 불러오지 못했습니다." });
    }
  });
  router.post("/:id/retry", trustedOrigin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0)
      return res
        .status(400)
        .json({
          success: false,
          message: "발송 이력 번호가 올바르지 않습니다.",
        });
    try {
      const changed = await dataSource.transaction(async (manager) => {
        await manager.query(
          "SELECT ID FROM RESERVATION_MESSAGE_TB WHERE ID=:1 FOR UPDATE",
          [id],
        );
        const repo = manager.getRepository(ReservationMessage);
        const row = await repo.findOne({ where: { ID: id } });
        if (!row) return "NOT_FOUND";
        if (!["FAILED", "UNKNOWN"].includes(row.STATE)) return "BAD_STATUS";
        if (
          row.STATE === "UNKNOWN" &&
          req.body?.confirmedProviderCheck !== true
        )
          return "NEEDS_CHECK";
        if (Number(row.ATTEMPTS) >= 3) return "LIMIT";
        const policy = await getPolicy(manager);
        if (
          !policy ||
          Number(policy.ENABLED) !== 1 ||
          !providerReady(row.CHANNEL)
        )
          return "CONFIG";
        await repo.update(
          { ID: id, STATE: row.STATE },
          { STATE: "QUEUED", LAST_ERROR: null },
        );
        return "OK";
      });
      if (changed === "OK")
        return res.json({
          success: true,
          message: "재시도 대기열에 등록했습니다.",
        });
      const statuses = {
        NOT_FOUND: 404,
        BAD_STATUS: 409,
        NEEDS_CHECK: 409,
        LIMIT: 409,
        CONFIG: 409,
      };
      const messages = {
        NOT_FOUND: "발송 이력이 없습니다.",
        BAD_STATUS: "실패/확인 필요 상태에서만 재시도할 수 있습니다.",
        NEEDS_CHECK:
          "공급자 측 발송 여부를 확인한 뒤 중복 발송 위험에 동의해야 합니다.",
        LIMIT: "재시도 제한 횟수를 초과했습니다.",
        CONFIG: "발송 설정과 공급자 인증 정보를 확인해 주세요.",
      };
      return res
        .status(statuses[changed] || 409)
        .json({
          success: false,
          message: messages[changed] || "재시도할 수 없습니다.",
        });
    } catch (error) {
      console.error("안내 발송 재시도 오류:", error);
      return res
        .status(500)
        .json({ success: false, message: "재시도 처리에 실패했습니다." });
    }
  });
  return router;
}
module.exports = { createAdminReservationMessagesRouter, outPolicy };
