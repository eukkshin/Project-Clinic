"use strict";
const AdminNotification = require("../entity/AdminNotification");
const subscribers = new Set();
const MAX_CLIENTS = 100;

function format(row) {
  return {
    id: Number(row.ID),
    category: row.CATEGORY,
    referenceId: Number(row.REFERENCE_ID),
    message: row.MESSAGE,
    isRead: Number(row.IS_READ) === 1,
    createdAt: row.CREATED_AT,
  };
}
async function recordNotification(manager, category, referenceId, message) {
  const repo = manager.getRepository(AdminNotification);
  return repo.save(
    repo.create({
      CATEGORY: category,
      REFERENCE_ID: referenceId,
      MESSAGE: message,
      IS_READ: 0,
    }),
  );
}
function broadcastNotification(row) {
  const payload = `event: notification\ndata: ${JSON.stringify(format(row))}\n\n`;
  for (const response of [...subscribers]) {
    try {
      response.write(payload);
    } catch {
      subscribers.delete(response);
    }
  }
}
function createAdminNotificationRouter({ dataSource }) {
  const express = require("express");
  const router = express.Router();
  router.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  router.get("/", async (req, res) => {
    try {
      const rows = await dataSource.getRepository(AdminNotification).find({
        order: { ID: "DESC" },
        take: 50,
      });
      const unread = await dataSource
        .getRepository(AdminNotification)
        .count({ where: { IS_READ: 0 } });
      return res.json({
        success: true,
        data: { notifications: rows.map(format), unread },
      });
    } catch (err) {
      console.error("알림 조회 오류:", err);
      return res
        .status(500)
        .json({ success: false, message: "알림을 불러오지 못했습니다." });
    }
  });
  router.patch("/:id/read", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1)
      return res
        .status(400)
        .json({ success: false, message: "잘못된 알림 번호입니다." });
    try {
      const repo = dataSource.getRepository(AdminNotification);
      const result = await repo.update({ ID: id }, { IS_READ: 1 });
      if (!result.affected)
        return res
          .status(404)
          .json({ success: false, message: "알림을 찾을 수 없습니다." });
      return res.json({ success: true });
    } catch (err) {
      console.error("알림 읽음 처리 오류:", err);
      return res
        .status(500)
        .json({ success: false, message: "알림을 변경하지 못했습니다." });
    }
  });
  router.get("/stream", (req, res) => {
    if (subscribers.size >= MAX_CLIENTS)
      return res
        .status(503)
        .json({ success: false, message: "알림 접속 수가 많습니다." });
    res.status(200);
    res.set({
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    res.flushHeaders?.();
    res.write("event: ready\ndata: {}\n\n");
    subscribers.add(res);
    const heartbeat = setInterval(() => {
      try {
        res.write(": keepalive\n\n");
      } catch {
        subscribers.delete(res);
        clearInterval(heartbeat);
      }
    }, 20000);
    // SSE 연결은 인증 시점에만 검증되므로, 3분마다 종료하여 재접속 때 세션을 재검증합니다.
    const reconnectTimer = setTimeout(() => res.end(), 3 * 60 * 1000);
    req.on("close", () => {
      clearInterval(heartbeat);
      clearTimeout(reconnectTimer);
      subscribers.delete(res);
    });
  });
  return router;
}
module.exports = {
  recordNotification,
  broadcastNotification,
  createAdminNotificationRouter,
};
