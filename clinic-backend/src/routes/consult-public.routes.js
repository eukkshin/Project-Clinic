"use strict";
const express = require("express");
const bcrypt = require("bcrypt");
const { randomBytes, timingSafeEqual } = require("node:crypto");
const Consult = require("../entity/Consult");
const {
  recordNotification,
  broadcastNotification,
} = require("../services/admin-notifications");
const {
  limitConsultRequest,
  limitLookup,
} = require("../services/consult-guard");
const {
  tokenHash,
  issueReceipt,
  issueAccessKey,
} = require("../services/consult-receipt");
const DEPARTMENTS = new Set([
  "눈성형",
  "코성형",
  "안면윤곽",
  "동안성형",
  "리프팅",
  "쁘띠시술",
  "기타 상담",
]);
function originCheck(req, res, next) {
  const origins = (
    process.env.FRONTEND_ORIGIN ||
    (process.env.NODE_ENV === "production"
      ? ""
      : "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://127.0.0.1:3000")
  )
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  if (!origins.includes(req.get("origin")))
    return res
      .status(403)
      .json({ success: false, message: "허용되지 않은 요청입니다." });
  return next();
}
async function readClob(value) {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (typeof value[Symbol.asyncIterator] === "function") {
    let result = "";
    for await (const chunk of value)
      result += Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
    return result;
  }
  return String(value);
}
function normalize(req, quick) {
  const body = req.body || {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone =
    typeof body.phone === "string" ? body.phone.replace(/[\s-]/g, "") : "";
  const department =
    typeof body.department === "string" ? body.department.trim() : "";
  const title = quick
    ? `[빠른상담] ${department} 문의입니다`
    : typeof body.title === "string"
      ? body.title.trim()
      : "";
  const content = quick
    ? "빠른 전화 상담 신청입니다. 담당자가 연락해 주세요."
    : typeof body.content === "string"
      ? body.content.trim()
      : "";
  if (
    !/^[가-힣a-zA-Z\s]{2,50}$/.test(name) ||
    !/^01[016789]\d{7,8}$/.test(phone) ||
    !department ||
    department.length > 50 ||
    (!quick && !DEPARTMENTS.has(department)) ||
    title.length < 4 ||
    title.length > 120 ||
    content.length < 10 ||
    content.length > 3000 ||
    body.privacyConsent !== true
  )
    return null;
  return { name, phone, department, title, content };
}
async function verifyChallenge(req) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  const responseToken = req.body?.captchaToken;
  if (
    typeof responseToken !== "string" ||
    !responseToken ||
    responseToken.length > 2048
  )
    return false;
  try {
    const params = new URLSearchParams({
      secret,
      response: responseToken,
      remoteip: req.ip || "",
    });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    try {
      const resp = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
          signal: controller.signal,
        },
      );
      if (!resp.ok) return false;
      const body = await resp.json();
      return body.success === true;
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return false;
  }
}
function createPublicConsultRouter({ dataSource }) {
  const router = express.Router();
  async function submit(req, res, quick) {
    const input = normalize(req, quick);
    if (!input)
      return res
        .status(400)
        .json({
          success: false,
          message: "상담 정보 및 개인정보 동의를 확인해 주세요.",
        });
    if (
      !quick &&
      typeof req.body?.website === "string" &&
      req.body.website.trim()
    ) {
      // Honeypot: 저장하지 않고 정상처럼 보이는 응답을 반환합니다.
      return res
        .status(202)
        .json({
          success: true,
          data: { id: 0, receiptNo: null, accessKey: null },
        });
    }
    if (!(await verifyChallenge(req)))
      return res
        .status(403)
        .json({
          success: false,
          message: "자동 신청 방지 인증을 완료해 주세요.",
        });
    // 유효성·챌린지 검사 후에 횟수를 소진합니다. (미검증 타인 전화번호로 차단 공격 방지)
    if (!limitConsultRequest(req, res, () => {})) return;
    try {
      const accessKey = quick ? null : issueAccessKey();
      const passwordHash = await bcrypt.hash(
        randomBytes(32).toString("hex"),
        10,
      );
      const result = await dataSource.transaction(async (manager) => {
        const receiptNo = await issueReceipt(manager);
        const repo = manager.getRepository(Consult);
        const consult = await repo.save(
          repo.create({
            NAME: input.name,
            PHONE: input.phone,
            DEPARTMENT: input.department,
            TITLE: input.title,
            CONTENT: input.content,
            USER_ID: "비회원",
            PASSWORD: passwordHash,
            STATUS: "대기중",
            RECEIPT_NO: receiptNo,
            LOOKUP_HASH: accessKey ? tokenHash(accessKey) : null,
          }),
        );
        const notification = await recordNotification(
          manager,
          "CONSULT",
          Number(consult.ID),
          quick
            ? "새 빠른 상담이 접수되었습니다."
            : "새 일반 상담이 접수되었습니다.",
        );
        return { id: Number(consult.ID), receiptNo, notification };
      });
      broadcastNotification(result.notification);
      res.set("Cache-Control", "no-store");
      return res
        .status(201)
        .json({
          success: true,
          data: { id: result.id, receiptNo: result.receiptNo, accessKey },
          message: "상담 신청이 접수되었습니다.",
        });
    } catch (err) {
      console.error("상담 접수 실패:", err);
      return res
        .status(500)
        .json({ success: false, message: "상담 저장 중 오류가 발생했습니다." });
    }
  }
  router.post("/", originCheck, (req, res) => submit(req, res, false));
  router.post("/quick", originCheck, (req, res) => submit(req, res, true));
  // 조회코드 자체를 비회원 상담 조회의 인증정보로 사용합니다.
  // 접수번호는 API 응답에만 포함하며, 입력으로 요구하지 않습니다.
  router.post("/lookup", originCheck, limitLookup, async (req, res) => {
    const accessKey =
      typeof req.body?.accessKey === "string" ? req.body.accessKey.trim() : "";
    if (!/^[A-Za-z0-9_-]{16,128}$/.test(accessKey))
      return res
        .status(400)
        .json({ success: false, message: "조회코드를 확인해 주세요." });
    try {
      const lookupHash = tokenHash(accessKey);
      const repo = dataSource.getRepository(Consult);
      const record = await repo.findOne({
        where: { LOOKUP_HASH: lookupHash },
        select: {
          RECEIPT_NO: true,
          LOOKUP_HASH: true,
          STATUS: true,
          ANSWER_TEXT: true,
          ANSWERED_AT: true,
        },
      });
      // 조회 실패 원인을 구분해 공개하지 않습니다.
      const actual = Buffer.from(lookupHash, "hex");
      const stored = Buffer.from(
        record?.LOOKUP_HASH && /^[a-f0-9]{64}$/i.test(record.LOOKUP_HASH)
          ? record.LOOKUP_HASH
          : "0".repeat(64),
        "hex",
      );
      if (!record?.LOOKUP_HASH || !timingSafeEqual(actual, stored))
        return res
          .status(404)
          .json({
            success: false,
            message: "조회할 수 없는 상담입니다. 조회코드를 확인해 주세요.",
          });
      res.set("Cache-Control", "no-store");
      return res.json({
        success: true,
        data: {
          receiptNo: record.RECEIPT_NO,
          status: record.STATUS,
          answer: await readClob(record.ANSWER_TEXT),
          answeredAt: record.ANSWERED_AT || null,
        },
      });
    } catch (err) {
      console.error("상담 답변 조회 실패:", err);
      return res
        .status(500)
        .json({ success: false, message: "상담 답변 조회 실패" });
    }
  });
  return router;
}
module.exports = { createPublicConsultRouter };
