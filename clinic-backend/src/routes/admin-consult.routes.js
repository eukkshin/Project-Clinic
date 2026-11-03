"use strict";
const express = require("express");
const Consult = require("../entity/Consult");
const requireAdminConsult = require("../middleware/requireAdminConsult");
const consultOrigin = require("../middleware/consultOrigin");

const STATUSES = new Set(["대기중", "상담중", "상담완료"]);
function validId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
async function textFromClob(value) {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (typeof value[Symbol.asyncIterator] === "function") {
    let text = "";
    for await (const part of value)
      text += Buffer.isBuffer(part) ? part.toString("utf8") : String(part);
    return text;
  }
  return String(value);
}

function createAdminConsultRouter({ dataSource }) {
  if (!dataSource) throw new Error("dataSource is required");
  const router = express.Router();
  router.use(...requireAdminConsult);
  router.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  router.get("/", async (req, res) => {
    try {
      const rows = await dataSource.getRepository(Consult).find({
        select: [
          "ID",
          "NAME",
          "PHONE",
          "DEPARTMENT",
          "TITLE",
          "CONTENT",
          "STATUS",
          "CREATED_AT",
          "USER_ID",
        ],
        order: { CREATED_AT: "DESC" },
      });
      const data = await Promise.all(
        rows.map(async (r) => ({
          ID: r.ID,
          NAME: r.NAME,
          PHONE: r.PHONE,
          DEPARTMENT: r.DEPARTMENT,
          TITLE: r.TITLE,
          CONTENT: await textFromClob(r.CONTENT),
          STATUS: r.STATUS,
          CREATED_AT: r.CREATED_AT,
          USER_ID: r.USER_ID,
        })),
      );
      return res.json({ success: true, data });
    } catch (error) {
      console.error("관리자 상담 목록 오류:", error);
      return res
        .status(500)
        .json({ success: false, message: "상담 목록 조회 실패" });
    }
  });

  router.put("/:id/status", consultOrigin, async (req, res) => {
    const id = validId(req.params.id);
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "잘못된 접수번호입니다." });
    const submitted = req.body?.status;
    if (submitted !== undefined && !STATUSES.has(submitted))
      return res
        .status(400)
        .json({ success: false, message: "상담 상태가 올바르지 않습니다." });
    try {
      const repo = dataSource.getRepository(Consult);
      const row = await repo.findOne({ where: { ID: id } });
      if (!row)
        return res
          .status(404)
          .json({ success: false, message: "상담 내역이 없습니다." });
      // 구형 관리자 코드(요청 body 없는 토글)와 호환. 신형은 명시적 status 값 사용.
      const status =
        submitted || (row.STATUS === "대기중" ? "상담완료" : "대기중");
      row.STATUS = status;
      await repo.save(row);
      return res.json({
        success: true,
        data: { status },
        message: "상담 상태를 변경했습니다.",
      });
    } catch (error) {
      console.error("상담 상태 수정 오류:", error);
      return res
        .status(500)
        .json({ success: false, message: "상담 상태 변경 실패" });
    }
  });

  router.delete("/:id", consultOrigin, async (req, res) => {
    const id = validId(req.params.id);
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "잘못된 접수번호입니다." });
    try {
      const result = await dataSource.getRepository(Consult).delete({ ID: id });
      if (!result.affected)
        return res
          .status(404)
          .json({ success: false, message: "상담 내역이 없습니다." });
      return res.json({
        success: true,
        data: { id },
        message: "상담 내역이 삭제되었습니다.",
      });
    } catch (error) {
      console.error("관리자 상담 삭제 오류:", error);
      return res
        .status(500)
        .json({ success: false, message: "상담 삭제 실패" });
    }
  });
  return router;
}
module.exports = { createAdminConsultRouter };
