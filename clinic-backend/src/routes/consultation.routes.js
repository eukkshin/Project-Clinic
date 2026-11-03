"use strict";
const express = require("express");
const crypto = require("node:crypto");
const bcrypt = require("bcrypt");
const { rateLimit } = require("express-rate-limit");
const consultOrigin = require("../middleware/consultOrigin");
const Consult = require("../entity/Consult");

const DEPARTMENTS = new Set([
  "눈성형",
  "코성형",
  "안면윤곽",
  "동안성형",
  "리프팅",
  "쁘띠시술",
  "기타 상담",
]);

function createConsultationRouter({ dataSource }) {
  if (!dataSource) throw new Error("dataSource is required");
  const router = express.Router();
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      success: false,
      message: "신청이 많습니다. 잠시 후 다시 시도해 주세요.",
    },
  });

  async function createConsult(req, res, quick = false) {
    const payload = req.body || {};
    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    const phone =
      typeof payload.phone === "string"
        ? payload.phone.replace(/\s/g, "").trim()
        : "";
    const department =
      typeof payload.department === "string" ? payload.department.trim() : "";
    const title = quick
      ? `[빠른상담] ${department} 문의입니다`
      : typeof payload.title === "string"
        ? payload.title.trim()
        : "";
    const content = quick
      ? `${name}님의 빠른 상담 신청입니다. 연락 부탁드립니다.`
      : typeof payload.content === "string"
        ? payload.content.trim()
        : "";
    const honeypot =
      typeof payload.website === "string" ? payload.website.trim() : "";

    if (honeypot)
      return res.status(200).json({ success: true, data: { id: 0 } });
    if (
      !/^[가-힣a-zA-Z\s]{2,50}$/.test(name) ||
      !/^01[016789]-?\d{3,4}-?\d{4}$/.test(phone) ||
      (!quick && !DEPARTMENTS.has(department)) ||
      (quick && (!department || department.length > 50)) ||
      title.length < 4 ||
      title.length > 120 ||
      content.length < 10 ||
      content.length > 3000 ||
      (!quick && payload.privacyConsent !== true)
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "입력값과 개인정보 수집 동의를 확인해 주세요.",
        });
    }

    try {
      // 기존 CONSULT.PASSWORD가 NOT NULL이어서 사용하지 않는 임의 비밀값의 해시를 저장.
      // 고정 '0000'이나 사용자가 입력한 평문 비밀번호를 저장하지 않는다.
      const randomSecret = crypto.randomBytes(32).toString("hex");
      const passwordHash = await bcrypt.hash(randomSecret, 10);
      const repo = dataSource.getRepository(Consult);
      const row = repo.create({
        NAME: name,
        PHONE: phone,
        DEPARTMENT: department,
        TITLE: title,
        CONTENT: content,
        USER_ID: "비회원",
        PASSWORD: passwordHash,
        STATUS: "대기중",
      });
      const saved = await repo.save(row);
      res.set("Cache-Control", "no-store");
      return res
        .status(201)
        .json({
          success: true,
          data: { id: Number(saved.ID) },
          message: "상담이 접수되었습니다.",
        });
    } catch (error) {
      console.error("상담 저장 실패:", error);
      return res
        .status(500)
        .json({ success: false, message: "상담 접수 중 오류가 발생했습니다." });
    }
  }

  router.post("/", consultOrigin, limiter, (req, res) =>
    createConsult(req, res, false),
  );
  // 기존 빠른 상담 폼 호환: POST /api/consult/quick. 이 페이지도 개인정보 동의 UI를 갖춰야 한다.
  router.post("/quick", consultOrigin, limiter, (req, res) =>
    createConsult(req, res, true),
  );
  return router;
}
module.exports = { createConsultationRouter };
