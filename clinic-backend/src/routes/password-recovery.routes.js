"use strict";

/**
 * AHNS 비밀번호 복구: OracleDB / TypeORM / Express / Nodemailer
 * - 이 라우터는 /api 에 마운트합니다.
 * - 기존 /api/send-reset-email, /api/reset-password 핸들러는 반드시 제거해야 합니다.
 * - 비밀번호는 변경 후 로그인으로만 접근하도록 합니다. 일반 로그인 세션 무효화는
 *   현재 프로젝트의 세션/JWT 구조에 맞춰 별도 연결이 필요합니다.
 */
const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("node:crypto");

const GENERIC_MESSAGE =
  "입력하신 정보와 일치하는 계정이 있다면 재설정 이메일을 발송했습니다. 메일함을 확인해 주세요.";
const INVALID_LINK_MESSAGE =
  "링크가 만료되었거나 이미 사용되었습니다. 비밀번호 찾기를 다시 진행해 주세요.";
const TOKEN_LIFETIME_MIN = 30;

function validPassword(password) {
  return (
    typeof password === "string" &&
    password.trim().length >= 10 &&
    Buffer.byteLength(password, "utf8") <= 72
  );
}
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// 단일 서버에서 기본적인 과도한 요청을 제어합니다. 다중 인스턴스 운영 시 Redis 등으로 이전해야 합니다.
const attempts = new Map();
function limited(key, maxCount, windowMs) {
  const now = Date.now();
  if (attempts.size > 5000) {
    for (const [k, entry] of attempts)
      if (entry.resetAt <= now) attempts.delete(k);
  }
  const state = attempts.get(key);
  if (!state || state.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  state.count += 1;
  return state.count > maxCount;
}

function createPasswordRecoveryRouter({ AppDataSource }) {
  if (!AppDataSource) throw new Error("AppDataSource가 필요합니다.");
  const router = express.Router();
  router.use((_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  });

  router.post("/password-recovery/request", async (req, res) => {
    const userId =
      typeof req.body?.userId === "string" ? req.body.userId.trim() : "";
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    if (
      !userId ||
      userId.length > 50 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 100
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "아이디와 이메일을 올바르게 입력해 주세요.",
        });
    }
    if (
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASSWORD ||
      !process.env.FRONTEND_ORIGIN
    ) {
      return res
        .status(503)
        .json({
          success: false,
          message:
            "이메일 서비스를 이용할 수 없습니다. 관리자에게 문의해 주세요.",
        });
    }
    if (limited(`pw-ip:${req.ip}`, 8, 15 * 60_000)) {
      return res
        .status(429)
        .json({
          success: false,
          message: "요청이 많습니다. 잠시 후 다시 시도해 주세요.",
        });
    }
    const accountKey = hashToken(`${userId.toLowerCase()}|${email}`);
    if (limited(`pw-account:${accountKey}`, 2, 60_000)) {
      return res.status(202).json({ success: true, message: GENERIC_MESSAGE });
    }

    try {
      const users = await AppDataSource.query(
        "SELECT USER_IDX, EMAIL FROM MEMBER_TB WHERE USER_ID = :1 AND LOWER(EMAIL) = :2",
        [userId, email],
      );
      // 등록 여부는 방문자에게 공개하지 않습니다.
      if (!users.length)
        return res
          .status(202)
          .json({ success: true, message: GENERIC_MESSAGE });

      const user = users[0];
      const rawToken = crypto.randomBytes(32).toString("base64url");
      const tokenHash = hashToken(rawToken);
      // 메일 발송 실패 시 기존의 유효한 링크가 사라지지 않도록 먼저 새 토큰만 저장합니다.
      await AppDataSource.query(
        `INSERT INTO PASSWORD_RESET_TOKEN (USER_IDX, TOKEN_HASH, EXPIRES_AT)
         VALUES (:1, :2, LOCALTIMESTAMP + NUMTODSINTERVAL(${TOKEN_LIFETIME_MIN}, 'MINUTE'))`,
        [user.USER_IDX, tokenHash],
      );

      const baseUrl = process.env.FRONTEND_ORIGIN.replace(/\/$/, "");
      const resetUrl = new URL("/find/reset", `${baseUrl}/`);
      resetUrl.searchParams.set("token", rawToken);
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT || 465),
        secure: String(process.env.SMTP_SECURE || "true") === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.EMAIL,
          subject: "[AHNS 성형외과] 비밀번호 재설정 안내",
          text: `AHNS 비밀번호 재설정 링크입니다.\n\n${resetUrl.toString()}\n\n이 링크는 30분 동안 한 번만 사용 가능합니다. 본인이 요청하지 않았다면 이 메일을 무시해 주세요.`,
          html: `<!doctype html><html lang="ko"><body style="margin:0;padding:36px 16px;background:#f7f6f0;font-family:Arial,sans-serif;color:#233e32"><div style="max-width:540px;margin:auto;background:#fff;padding:40px;border:1px solid #e1e5dc"><div style="font-family:Georgia,serif;font-size:30px">AHNS.</div><p style="font-size:11px;letter-spacing:2px;color:#79877d">ACCOUNT RECOVERY</p><h1 style="font-size:24px;font-weight:normal">비밀번호 재설정</h1><p style="line-height:1.8;font-size:14px">아래 버튼을 눌러 새 비밀번호를 설정해 주세요. 링크는 30분 동안 한 번만 사용할 수 있습니다.</p><p style="margin:30px 0"><a href="${resetUrl.toString()}" style="display:inline-block;padding:16px 28px;background:#234337;color:#fff;text-decoration:none">비밀번호 재설정하기 ↗</a></p><p style="font-size:12px;color:#718276">본인이 요청하지 않았다면 이 메일을 무시해 주세요.</p></div></body></html>`,
        });
        // 새 링크가 실제 발송된 뒤 이전 미사용 링크를 무효화합니다.
        await AppDataSource.query(
          "UPDATE PASSWORD_RESET_TOKEN SET USED_AT = LOCALTIMESTAMP WHERE USER_IDX = :1 AND TOKEN_HASH <> :2 AND USED_AT IS NULL",
          [user.USER_IDX, tokenHash],
        );
      } catch (mailError) {
        // 계정 유무가 노출되지 않도록 동일한 응답을 사용하고, 문제는 서버 로그에만 기록합니다.
        console.error("[password-recovery] 이메일 전송 실패:", mailError);
        await AppDataSource.query(
          "UPDATE PASSWORD_RESET_TOKEN SET USED_AT = LOCALTIMESTAMP WHERE TOKEN_HASH = :1 AND USED_AT IS NULL",
          [tokenHash],
        );
      }
      return res.status(202).json({ success: true, message: GENERIC_MESSAGE });
    } catch (error) {
      console.error("[password-recovery] 복구 메일 요청 실패:", error);
      return res
        .status(500)
        .json({ success: false, message: "요청 처리 중 오류가 발생했습니다." });
    }
  });

  router.post("/password-recovery/reset", async (req, res) => {
    const token = req.body?.token;
    const newPassword = req.body?.newPassword;
    if (typeof token !== "string" || !/^[A-Za-z0-9_-]{40,100}$/.test(token)) {
      return res
        .status(400)
        .json({ success: false, message: INVALID_LINK_MESSAGE });
    }
    if (!validPassword(newPassword)) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "비밀번호는 10자 이상, UTF-8 기준 72바이트 이하로 입력해 주세요.",
        });
    }
    if (limited(`pw-reset:${req.ip}`, 20, 15 * 60_000)) {
      return res
        .status(429)
        .json({ success: false, message: "잠시 후 다시 시도해 주세요." });
    }

    class InvalidTokenError extends Error {}
    try {
      const newHash = await bcrypt.hash(newPassword, 12);
      const digest = hashToken(token);
      await AppDataSource.transaction(async (manager) => {
        const matches = await manager.query(
          `SELECT ID, USER_IDX FROM PASSWORD_RESET_TOKEN
           WHERE TOKEN_HASH = :1 AND USED_AT IS NULL AND EXPIRES_AT > LOCALTIMESTAMP
           FOR UPDATE`,
          [digest],
        );
        if (!matches.length) throw new InvalidTokenError();
        const memberId = matches[0].USER_IDX;
        await manager.query(
          "UPDATE MEMBER_TB SET USER_PW = :1 WHERE USER_IDX = :2",
          [newHash, memberId],
        );
        // 같은 회원의 기존 발급 링크까지 함께 무효화하여 재사용을 막습니다.
        await manager.query(
          "UPDATE PASSWORD_RESET_TOKEN SET USED_AT = LOCALTIMESTAMP WHERE USER_IDX = :1 AND USED_AT IS NULL",
          [memberId],
        );
      });
      return res.json({ success: true, message: "비밀번호가 변경되었습니다." });
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        return res
          .status(400)
          .json({ success: false, message: INVALID_LINK_MESSAGE });
      }
      console.error("[password-recovery] 비밀번호 변경 실패:", error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류가 발생했습니다." });
    }
  });

  return router;
}

module.exports = { createPasswordRecoveryRouter };
