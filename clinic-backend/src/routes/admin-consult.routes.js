"use strict";
const express = require("express");
const Consult = require("../entity/Consult");
const ConsultActivity = require("../entity/ConsultActivity");
const { isValidReceipt } = require("../services/consult-receipt");
function validId(value) {
  const num = Number(value);
  return Number.isSafeInteger(num) && num > 0 ? num : null;
}
async function clobText(v) {
  if (typeof v === "string") return v;
  if (v == null) return "";
  if (typeof v[Symbol.asyncIterator] === "function") {
    let s = "";
    for await (const chunk of v)
      s += Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
    return s;
  }
  return String(v);
}
const STATUSES = new Set(["대기중", "상담중", "상담완료"]);
const KINDS = new Set(["CALL_ATTEMPT", "CALL_COMPLETED", "INTERNAL_NOTE"]);
function createAdminConsultRouter({ dataSource }) {
  const router = express.Router();
  router.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  router.get("/", async (req, res) => {
    try {
      const rows = await dataSource.getRepository(Consult).find({
        select: {
          ID: true,
          RECEIPT_NO: true,
          NAME: true,
          PHONE: true,
          DEPARTMENT: true,
          TITLE: true,
          CONTENT: true,
          STATUS: true,
          CREATED_AT: true,
          USER_ID: true,
          ANSWER_TEXT: true,
          ANSWERED_AT: true,
          ASSIGNED_TO: true,
        },
        order: { CREATED_AT: "DESC" },
        take: 300,
      });
      const data = await Promise.all(
        rows.map(async (row) => ({
          ID: row.ID,
          RECEIPT_NO: row.RECEIPT_NO,
          NAME: row.NAME,
          PHONE: row.PHONE,
          DEPARTMENT: row.DEPARTMENT,
          TITLE: row.TITLE,
          CONTENT: await clobText(row.CONTENT),
          STATUS: row.STATUS,
          CREATED_AT: row.CREATED_AT,
          USER_ID: row.USER_ID,
          ANSWER_TEXT: await clobText(row.ANSWER_TEXT),
          ANSWERED_AT: row.ANSWERED_AT,
          ASSIGNED_TO: row.ASSIGNED_TO,
        })),
      );
      return res.json({ success: true, data });
    } catch (err) {
      console.error("관리자 상담 목록 오류:", err);
      return res
        .status(500)
        .json({ success: false, message: "상담 목록을 불러오지 못했습니다." });
    }
  });
  router.get("/:id/history", async (req, res) => {
    const id = validId(req.params.id);
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "접수 ID를 확인하세요." });
    try {
      const exists = await dataSource
        .getRepository(Consult)
        .findOne({ where: { ID: id }, select: { ID: true } });
      if (!exists)
        return res
          .status(404)
          .json({ success: false, message: "상담 내역이 없습니다." });
      const actions = await dataSource
        .getRepository(ConsultActivity)
        .find({ where: { CONSULT_ID: id }, order: { ID: "DESC" }, take: 100 });
      const data = await Promise.all(
        actions.map(async (row) => ({
          id: row.ID,
          kind: row.KIND,
          text: await clobText(row.NOTE_TEXT),
          adminId: row.ADMIN_USER_ID,
          createdAt: row.CREATED_AT,
        })),
      );
      return res.json({ success: true, data });
    } catch (err) {
      console.error("상담 이력 조회 실패:", err);
      return res
        .status(500)
        .json({ success: false, message: "상담 이력을 불러오지 못했습니다." });
    }
  });
  router.put("/:id/status", async (req, res) => {
    const id = validId(req.params.id);
    const nextStatus = req.body?.status;
    if (!id || !STATUSES.has(nextStatus))
      return res
        .status(400)
        .json({ success: false, message: "상태와 접수 ID를 확인하세요." });
    try {
      await dataSource.transaction(async (manager) => {
        await manager.query("SELECT ID FROM CONSULT WHERE ID = :1 FOR UPDATE", [
          id,
        ]);
        const repo = manager.getRepository(Consult);
        const row = await repo.findOne({ where: { ID: id } });
        if (!row) {
          const err = new Error("NOT_FOUND");
          err.status = 404;
          throw err;
        }
        if (row.STATUS === nextStatus) return;
        const previous = row.STATUS;
        row.STATUS = nextStatus;
        await repo.save(row);
        const history = manager.getRepository(ConsultActivity);
        await history.save(
          history.create({
            CONSULT_ID: id,
            KIND: "STATUS_CHANGE",
            NOTE_TEXT: `${previous} → ${nextStatus}`,
            ADMIN_USER_ID: req.admin.userId,
          }),
        );
      });
      return res.json({ success: true, data: { status: nextStatus } });
    } catch (err) {
      if (err.status === 404)
        return res
          .status(404)
          .json({ success: false, message: "상담 내역이 없습니다." });
      console.error("상담 상태 수정 실패:", err);
      return res
        .status(500)
        .json({ success: false, message: "상담 상태를 변경하지 못했습니다." });
    }
  });
  router.post("/:id/reply", async (req, res) => {
    const id = validId(req.params.id);
    const reply =
      typeof req.body?.reply === "string" ? req.body.reply.trim() : "";
    if (!id || reply.length < 10 || reply.length > 3000)
      return res
        .status(400)
        .json({ success: false, message: "답변은 10~3000자로 작성해 주세요." });
    try {
      await dataSource.transaction(async (manager) => {
        await manager.query("SELECT ID FROM CONSULT WHERE ID = :1 FOR UPDATE", [
          id,
        ]);
        const repo = manager.getRepository(Consult);
        const row = await repo.findOne({ where: { ID: id } });
        if (!row) {
          const err = new Error("NOT_FOUND");
          err.status = 404;
          throw err;
        }
        row.ANSWER_TEXT = reply;
        row.ANSWERED_AT = new Date();
        row.STATUS = "상담완료";
        row.ASSIGNED_TO ||= req.admin.userId;
        await repo.save(row);
        const history = manager.getRepository(ConsultActivity);
        await history.save(
          history.create({
            CONSULT_ID: id,
            KIND: "REPLY",
            NOTE_TEXT: reply,
            ADMIN_USER_ID: req.admin.userId,
          }),
        );
      });
      return res.json({
        success: true,
        message: "상담 답변이 저장되었습니다.",
      });
    } catch (err) {
      if (err.status === 404)
        return res
          .status(404)
          .json({ success: false, message: "상담 내역이 없습니다." });
      console.error("상담 답변 저장 실패:", err);
      return res
        .status(500)
        .json({ success: false, message: "답변을 저장하지 못했습니다." });
    }
  });
  router.post("/:id/activity", async (req, res) => {
    const id = validId(req.params.id);
    const kind = req.body?.kind;
    const note = typeof req.body?.note === "string" ? req.body.note.trim() : "";
    if (!id || !KINDS.has(kind) || note.length < 2 || note.length > 1000)
      return res
        .status(400)
        .json({
          success: false,
          message: "연락 기록/내부 메모를 2~1000자로 작성해 주세요.",
        });
    try {
      await dataSource.transaction(async (manager) => {
        await manager.query("SELECT ID FROM CONSULT WHERE ID = :1 FOR UPDATE", [
          id,
        ]);
        const repo = manager.getRepository(Consult);
        const row = await repo.findOne({ where: { ID: id } });
        if (!row) {
          const err = new Error("NOT_FOUND");
          err.status = 404;
          throw err;
        }
        if (kind === "CALL_ATTEMPT" && row.STATUS === "대기중")
          row.STATUS = "상담중";
        if (kind === "CALL_COMPLETED") row.STATUS = "상담완료";
        row.ASSIGNED_TO ||= req.admin.userId;
        await repo.save(row);
        const history = manager.getRepository(ConsultActivity);
        await history.save(
          history.create({
            CONSULT_ID: id,
            KIND: kind,
            NOTE_TEXT: note,
            ADMIN_USER_ID: req.admin.userId,
          }),
        );
      });
      return res.json({ success: true, message: "연락 기록을 저장했습니다." });
    } catch (err) {
      if (err.status === 404)
        return res
          .status(404)
          .json({ success: false, message: "상담 내역이 없습니다." });
      console.error("상담 연락 기록 실패:", err);
      return res
        .status(500)
        .json({ success: false, message: "기록을 저장하지 못했습니다." });
    }
  });
  router.delete("/:id", async (req, res) => {
    const id = validId(req.params.id);
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "접수 ID를 확인하세요." });
    try {
      const result = await dataSource.getRepository(Consult).delete({ ID: id });
      if (!result.affected)
        return res
          .status(404)
          .json({ success: false, message: "상담 내역이 없습니다." });
      return res.json({ success: true, data: { id } });
    } catch (err) {
      console.error("상담 삭제 실패:", err);
      return res
        .status(500)
        .json({ success: false, message: "상담 삭제 실패" });
    }
  });
  return router;
}
module.exports = { createAdminConsultRouter };
