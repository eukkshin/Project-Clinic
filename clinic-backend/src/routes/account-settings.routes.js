"use strict";

/**
 * AHNS 회원 계정 설정 (Express + OracleDB + TypeORM)
 * 마운트: app.use('/api/mypage/account', require('./src/routes/account-settings.routes'));
 * 인증은 기존 authenticateMember 미들웨어를 그대로 재사용합니다.
 */
const express = require("express");
const crypto = require("node:crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const AppDataSource = require("../../db");
const {
  authenticateMember,
  COOKIE_NAME,
} = require("../middleware/authenticateMember");
const {
  buildEmailChangeMessage,
} = require("../templates/account-email-change-email");

const router = express.Router();
const EMAIL_TOKEN_MINUTES = 15;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requests = new Map();

function tooMany(key, max, duration) {
  const now = Date.now();
  if (requests.size > 3000) {
    for (const [k, state] of requests)
      if (state.expires <= now) requests.delete(k);
  }
  const item = requests.get(key);
  if (!item || item.expires <= now) {
    requests.set(key, { count: 1, expires: now + duration });
    return false;
  }
  item.count += 1;
  return item.count > max;
}
function validPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 10 &&
    Buffer.byteLength(password, "utf8") <= 72
  );
}
function validEmail(v) {
  return typeof v === "string" && v.length <= 100 && EMAIL_PATTERN.test(v);
}
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
function emailTransport() {
  if (
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD ||
    !process.env.FRONTEND_ORIGIN
  ) {
    throw new Error("SMTP 또는 FRONTEND_ORIGIN 설정 누락");
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
}
function noCache(_req, res, next) {
  res.setHeader("Cache-Control", "no-store");
  next();
}
function checkMutationOrigin(req, res, next) {
  const configured = process.env.FRONTEND_ORIGIN;
  if (!configured)
    return res
      .status(503)
      .json({ success: false, message: "서버 보안 설정이 누락되었습니다." });
  let allowed;
  try {
    allowed = new URL(configured).origin;
  } catch {
    return res
      .status(503)
      .json({ success: false, message: "서버 보안 설정이 올바르지 않습니다." });
  }
  // 브라우저 fetch(credentials:include)로 보내는 POST/PATCH의 Origin 검증.
  // curl로 직접 테스트할 때는 -H "Origin: http://localhost:3000"을 지정합니다.
  if (req.get("Origin") !== allowed) {
    return res
      .status(403)
      .json({ success: false, message: "허용되지 않은 요청입니다." });
  }
  next();
}

router.use(noCache);
router.use(authenticateMember);
router.use((req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method))
    return checkMutationOrigin(req, res, next);
  next();
});

// 실제 계정 상태에 저장된 가입 시 수신 동의 컬럼을 조회합니다.
router.get("/preferences", async (req, res) => {
  try {
    const rows = await AppDataSource.query(
      "SELECT IS_MAIL_AGREED, IS_SNS_AGREED FROM MEMBER_TB WHERE USER_IDX = :1",
      [req.user.userIdx],
    );
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "회원이 존재하지 않습니다." });
    return res.json({
      success: true,
      data: {
        mailAgreed: rows[0].IS_MAIL_AGREED === "Y",
        snsAgreed: rows[0].IS_SNS_AGREED === "Y",
      },
    });
  } catch (error) {
    console.error("[account] 수신 설정 조회 실패:", error);
    return res
      .status(500)
      .json({ success: false, message: "수신 설정을 불러오지 못했습니다." });
  }
});

router.patch("/preferences", async (req, res) => {
  const { mailAgreed, snsAgreed } = req.body || {};
  if (typeof mailAgreed !== "boolean" || typeof snsAgreed !== "boolean") {
    return res
      .status(400)
      .json({ success: false, message: "동의 여부를 올바르게 선택해 주세요." });
  }
  try {
    const result = await AppDataSource.transaction(async (manager) => {
      const rows = await manager.query(
        "SELECT IS_MAIL_AGREED, IS_SNS_AGREED FROM MEMBER_TB WHERE USER_IDX = :1 FOR UPDATE",
        [req.user.userIdx],
      );
      if (!rows.length) {
        const err = new Error("MEMBER_MISSING");
        err.status = 404;
        throw err;
      }
      const before = rows[0];
      const nextMail = mailAgreed ? "Y" : "N";
      const nextSns = snsAgreed ? "Y" : "N";
      if (
        before.IS_MAIL_AGREED !== nextMail ||
        before.IS_SNS_AGREED !== nextSns
      ) {
        await manager.query(
          "UPDATE MEMBER_TB SET IS_MAIL_AGREED = :1, IS_SNS_AGREED = :2 WHERE USER_IDX = :3",
          [nextMail, nextSns, req.user.userIdx],
        );
      }
      for (const [channel, previous, value] of [
        ["MAIL", before.IS_MAIL_AGREED, nextMail],
        ["SNS", before.IS_SNS_AGREED, nextSns],
      ]) {
        if (previous !== value) {
          await manager.query(
            `INSERT INTO ACCOUNT_CONSENT_HISTORY (USER_IDX, CHANNEL, PREVIOUS_VALUE, NEW_VALUE)
             VALUES (:1, :2, :3, :4)`,
            [req.user.userIdx, channel, previous, value],
          );
        }
      }
      return { mailAgreed, snsAgreed };
    });
    return res.json({
      success: true,
      message: "수신 동의 설정이 저장되었습니다.",
      data: result,
    });
  } catch (error) {
    console.error("[account] 수신 설정 변경 실패:", error);
    return res
      .status(error.status || 500)
      .json({ success: false, message: "설정을 저장하지 못했습니다." });
  }
});

router.post("/change-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (typeof currentPassword !== "string" || !validPassword(newPassword)) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "새 비밀번호는 10자 이상, UTF-8 기준 72바이트 이하로 입력해 주세요.",
      });
  }
  if (tooMany(`pw:${req.user.userIdx}:${req.ip}`, 6, 15 * 60_000)) {
    return res
      .status(429)
      .json({
        success: false,
        message: "요청이 많습니다. 15분 후 다시 시도해 주세요.",
      });
  }
  class WrongPassword extends Error {}
  try {
    const newHash = await bcrypt.hash(newPassword, 12);
    await AppDataSource.transaction(async (manager) => {
      const rows = await manager.query(
        "SELECT USER_PW FROM MEMBER_TB WHERE USER_IDX = :1 FOR UPDATE",
        [req.user.userIdx],
      );
      if (!rows.length) throw new WrongPassword();
      const matches = await bcrypt.compare(currentPassword, rows[0].USER_PW);
      if (!matches) throw new WrongPassword();
      if (await bcrypt.compare(newPassword, rows[0].USER_PW)) {
        const e = new Error("SAME_PASSWORD");
        e.status = 400;
        throw e;
      }
      await manager.query(
        "UPDATE MEMBER_TB SET USER_PW = :1, SESSION_VERSION = SESSION_VERSION + 1 WHERE USER_IDX = :2",
        [newHash, req.user.userIdx],
      );
      // 비밀번호 찾기로 발급된 기존 미사용 링크도 무효화합니다.
      await manager.query(
        "UPDATE PASSWORD_RESET_TOKEN SET USED_AT = LOCALTIMESTAMP WHERE USER_IDX = :1 AND USED_AT IS NULL",
        [req.user.userIdx],
      );
    });
    // 비밀번호 변경으로 세션 버전이 증가하여 다른 기기 JWT도 즉시 거부됩니다.
    res.clearCookie(COOKIE_NAME, { path: "/", httpOnly: true });
    return res.json({
      success: true,
      message: "비밀번호가 변경되었습니다. 다시 로그인해 주세요.",
    });
  } catch (error) {
    if (error instanceof WrongPassword)
      return res
        .status(401)
        .json({
          success: false,
          message: "현재 비밀번호가 올바르지 않습니다.",
        });
    if (error.message === "SAME_PASSWORD")
      return res
        .status(400)
        .json({
          success: false,
          message: "기존 비밀번호와 다른 비밀번호를 입력해 주세요.",
        });
    console.error("[account] 비밀번호 변경 실패:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "비밀번호 변경 중 오류가 발생했습니다.",
      });
  }
});

router.post("/email/request", async (req, res) => {
  const newEmail =
    typeof req.body?.newEmail === "string"
      ? req.body.newEmail.trim().toLowerCase()
      : "";
  const currentPassword = req.body?.currentPassword;
  if (
    !validEmail(newEmail) ||
    typeof currentPassword !== "string" ||
    currentPassword.length === 0
  ) {
    return res
      .status(400)
      .json({
        success: false,
        message: "새 이메일과 현재 비밀번호를 입력해 주세요.",
      });
  }
  if (
    tooMany(`email-ip:${req.ip}`, 10, 15 * 60_000) ||
    tooMany(`email-member:${req.user.userIdx}`, 3, 15 * 60_000)
  ) {
    return res
      .status(429)
      .json({
        success: false,
        message: "인증 요청이 많습니다. 잠시 후 다시 시도해 주세요.",
      });
  }
  let tokenHash;
  try {
    const rows = await AppDataSource.query(
      "SELECT USER_PW, EMAIL FROM MEMBER_TB WHERE USER_IDX = :1",
      [req.user.userIdx],
    );
    if (
      !rows.length ||
      !(await bcrypt.compare(currentPassword, rows[0].USER_PW))
    ) {
      return res
        .status(401)
        .json({
          success: false,
          message: "현재 비밀번호가 올바르지 않습니다.",
        });
    }
    const previousEmail = String(rows[0].EMAIL || "").trim();
    if (previousEmail.toLowerCase() === newEmail) {
      return res
        .status(400)
        .json({ success: false, message: "현재 사용 중인 이메일입니다." });
    }
    const duplicates = await AppDataSource.query(
      "SELECT USER_IDX FROM MEMBER_TB WHERE LOWER(EMAIL) = :1 AND USER_IDX <> :2",
      [newEmail, req.user.userIdx],
    );
    if (duplicates.length)
      return res
        .status(409)
        .json({
          success: false,
          message: "다른 회원이 사용 중인 이메일입니다.",
        });
    const token = crypto.randomBytes(32).toString("base64url");
    tokenHash = hashToken(token);
    await AppDataSource.query(
      `INSERT INTO ACCOUNT_EMAIL_CHANGE_TOKEN (USER_IDX, TOKEN_HASH, OLD_EMAIL, NEW_EMAIL, EXPIRES_AT)
       VALUES (:1, :2, :3, :4, LOCALTIMESTAMP + NUMTODSINTERVAL(${EMAIL_TOKEN_MINUTES}, 'MINUTE'))`,
      [req.user.userIdx, tokenHash, previousEmail, newEmail],
    );
    const base = process.env.FRONTEND_ORIGIN;
    if (!base) throw new Error("FRONTEND_ORIGIN 누락");
    const link = new URL(
      "/mypage/accountsettings",
      `${base.replace(/\/$/, "")}/`,
    );
    link.searchParams.set("emailToken", token);
    const email = buildEmailChangeMessage({ confirmUrl: link });
    await emailTransport().sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: newEmail,
      ...email,
    });
    // 실제 메일 발송이 성공한 뒤에만 기존 발급 링크 무효화.
    await AppDataSource.query(
      "UPDATE ACCOUNT_EMAIL_CHANGE_TOKEN SET USED_AT = LOCALTIMESTAMP WHERE USER_IDX = :1 AND TOKEN_HASH <> :2 AND USED_AT IS NULL",
      [req.user.userIdx, tokenHash],
    );
    return res
      .status(202)
      .json({
        success: true,
        message:
          "새 이메일 주소로 인증 링크를 보냈습니다. 15분 이내에 확인해 주세요.",
      });
  } catch (error) {
    console.error("[account] 이메일 변경 요청 실패:", error);
    if (tokenHash) {
      try {
        await AppDataSource.query(
          "UPDATE ACCOUNT_EMAIL_CHANGE_TOKEN SET USED_AT = LOCALTIMESTAMP WHERE TOKEN_HASH = :1 AND USED_AT IS NULL",
          [tokenHash],
        );
      } catch (rollbackError) {
        console.error("[account] 이메일 토큰 폐기 실패:", rollbackError);
      }
    }
    return res
      .status(500)
      .json({
        success: false,
        message: "인증 메일을 보내지 못했습니다. 잠시 후 다시 시도해 주세요.",
      });
  }
});

router.post("/email/confirm", async (req, res) => {
  const token = req.body?.token;
  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{40,100}$/.test(token)) {
    return res
      .status(400)
      .json({ success: false, message: "인증 링크가 올바르지 않습니다." });
  }
  if (tooMany(`email-confirm:${req.user.userIdx}:${req.ip}`, 12, 15 * 60_000)) {
    return res
      .status(429)
      .json({
        success: false,
        message: "인증 요청이 많습니다. 잠시 후 다시 시도해 주세요.",
      });
  }
  class InvalidToken extends Error {}
  try {
    const { oldEmail, newEmail } = await AppDataSource.transaction(
      async (manager) => {
        const matches = await manager.query(
          `SELECT USER_IDX, OLD_EMAIL, NEW_EMAIL FROM ACCOUNT_EMAIL_CHANGE_TOKEN
         WHERE TOKEN_HASH = :1 AND USER_IDX = :2 AND USED_AT IS NULL AND EXPIRES_AT > LOCALTIMESTAMP
         FOR UPDATE`,
          [hashToken(token), req.user.userIdx],
        );
        if (!matches.length) throw new InvalidToken();
        const item = matches[0];
        const members = await manager.query(
          "SELECT EMAIL FROM MEMBER_TB WHERE USER_IDX = :1 FOR UPDATE",
          [req.user.userIdx],
        );
        if (
          !members.length ||
          String(members[0].EMAIL).toLowerCase() !==
            String(item.OLD_EMAIL).toLowerCase()
        ) {
          throw new InvalidToken();
        }
        const occupied = await manager.query(
          "SELECT USER_IDX FROM MEMBER_TB WHERE LOWER(EMAIL) = :1 AND USER_IDX <> :2",
          [String(item.NEW_EMAIL).toLowerCase(), req.user.userIdx],
        );
        if (occupied.length) {
          const e = new Error("EMAIL_OCCUPIED");
          e.status = 409;
          throw e;
        }
        await manager.query(
          "UPDATE MEMBER_TB SET EMAIL = :1 WHERE USER_IDX = :2",
          [item.NEW_EMAIL, req.user.userIdx],
        );
        await manager.query(
          "UPDATE ACCOUNT_EMAIL_CHANGE_TOKEN SET USED_AT = LOCALTIMESTAMP WHERE USER_IDX = :1 AND USED_AT IS NULL",
          [req.user.userIdx],
        );
        // 이전 이메일로 발급한 비밀번호 복구 링크를 더 이상 사용하지 못하게 합니다.
        await manager.query(
          "UPDATE PASSWORD_RESET_TOKEN SET USED_AT = LOCALTIMESTAMP WHERE USER_IDX = :1 AND USED_AT IS NULL",
          [req.user.userIdx],
        );
        return { oldEmail: item.OLD_EMAIL, newEmail: item.NEW_EMAIL };
      },
    );
    // 기존 이메일에 변경 알림. 실패하더라도 이메일 변경 완료 상태를 되돌리지 않습니다.
    try {
      await emailTransport().sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: oldEmail,
        subject: "[AHNS 성형외과] 계정 이메일 주소 변경 안내",
        text: "AHNS 계정에 등록된 이메일 주소가 변경되었습니다. 본인이 요청하지 않았다면 즉시 병원 고객지원에 문의해 주세요.",
        html: "<p>AHNS 계정에 등록된 이메일 주소가 변경되었습니다.</p><p>본인이 요청하지 않았다면 즉시 병원 고객지원에 문의해 주세요.</p>",
      });
    } catch (notifyError) {
      console.error("[account] 이전 이메일 변경 안내 발송 실패:", notifyError);
    }
    return res.json({
      success: true,
      message: "이메일이 변경되었습니다.",
      data: { email: newEmail },
    });
  } catch (error) {
    if (error instanceof InvalidToken) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "링크가 만료되었거나 이미 사용되었습니다. 다시 요청해 주세요.",
        });
    }
    if (error.message === "EMAIL_OCCUPIED") {
      return res
        .status(409)
        .json({
          success: false,
          message: "다른 회원이 사용 중인 이메일입니다.",
        });
    }
    console.error("[account] 이메일 변경 확정 실패:", error);
    return res
      .status(500)
      .json({ success: false, message: "이메일 변경 중 오류가 발생했습니다." });
  }
});


// POST /api/mypage/account/withdraw
// 진료기록·상담/예약 내역은 보존 기간과 의료법 검토 없이 삭제하지 않습니다.
// 여기서는 회원 서비스 이용을 종료하고 모든 로그인 토큰을 무효화합니다.
router.post("/withdraw", async (req, res) => {
  const password = req.body?.password;
  const confirmed = req.body?.confirmation === "WITHDRAW";
  if (typeof password !== "string" || !password || !confirmed) {
    return res.status(400).json({
      success: false,
      message: "현재 비밀번호와 탈퇴 확인을 입력해 주세요.",
    });
  }
  if (req.member.IS_ADMIN) {
    return res.status(403).json({
      success: false,
      message: "관리자 계정은 일반 회원탈퇴로 처리할 수 없습니다.",
    });
  }
  if (tooMany(`withdraw:${req.user.userIdx}:${req.ip}`, 5, 30 * 60_000)) {
    return res.status(429).json({
      success: false,
      message: "요청이 많습니다. 잠시 후 다시 시도해 주세요.",
    });
  }

  class InvalidPassword extends Error {}
  class ActiveReservation extends Error {}
  try {
    await AppDataSource.transaction(async (manager) => {
      const members = await manager.query(
        `SELECT USER_PW, STATUS, CHART_NO
           FROM MEMBER_TB WHERE USER_IDX = :1 FOR UPDATE`,
        [req.user.userIdx],
      );
      const member = members[0];
      if (!member || member.STATUS !== "정상") throw new InvalidPassword();
      if (!(await bcrypt.compare(password, member.USER_PW))) {
        throw new InvalidPassword();
      }
      // 예약을 자동 취소하지 않으며, 예약이 남아 있으면 사용자가 먼저 처리하도록 합니다.
      const active = await manager.query(
        `SELECT COUNT(*) AS CNT FROM RESERVATION_TB
          WHERE USER_IDX = :1
            AND STATUS IN ('예약확정', '예약대기')
            AND SCHEDULED_AT >= LOCALTIMESTAMP`,
        [req.user.userIdx],
      );
      if (Number(active[0]?.CNT || 0) > 0) throw new ActiveReservation();
      if (member.CHART_NO) {
        const adminActive = await manager.query(
          `SELECT COUNT(*) AS CNT FROM ADMIN_RESERVATION_TB
           WHERE CHART_NO = :1
             AND STATUS IN ('RESERVED', 'CONFIRMED', '예약확정')
             AND RESERVATION_DATE >= TRUNC(SYSDATE)`,
          [member.CHART_NO],
        );
        if (Number(adminActive[0]?.CNT || 0) > 0) throw new ActiveReservation();
      }
      await manager.query(
        `UPDATE MEMBER_TB
           SET STATUS = '탈퇴', WITHDRAWN_AT = LOCALTIMESTAMP,
               SESSION_VERSION = SESSION_VERSION + 1,
               IS_MAIL_AGREED = 'N', IS_SNS_AGREED = 'N'
         WHERE USER_IDX = :1 AND STATUS = '정상'`,
        [req.user.userIdx],
      );
      await manager.query(
        `UPDATE PASSWORD_RESET_TOKEN SET USED_AT = LOCALTIMESTAMP
           WHERE USER_IDX = :1 AND USED_AT IS NULL`,
        [req.user.userIdx],
      );
      await manager.query(
        `UPDATE ACCOUNT_EMAIL_CHANGE_TOKEN SET USED_AT = LOCALTIMESTAMP
           WHERE USER_IDX = :1 AND USED_AT IS NULL`,
        [req.user.userIdx],
      );
    });
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.json({
      success: true,
      message: "회원 서비스 탈퇴가 완료되었습니다.",
    });
  } catch (error) {
    if (error instanceof InvalidPassword) {
      return res.status(401).json({ success: false, message: "현재 비밀번호가 올바르지 않습니다." });
    }
    if (error instanceof ActiveReservation) {
      return res.status(409).json({
        success: false,
        message: "예정된 예약이 있습니다. 예약을 취소하거나 병원에 문의한 후 탈퇴해 주세요.",
      });
    }
    console.error("[account] 회원탈퇴 실패:", error);
    return res.status(500).json({
      success: false,
      message: "회원탈퇴를 처리하지 못했습니다. 병원에 문의해 주세요.",
    });
  }
});

module.exports = router;
