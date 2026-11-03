"use strict";

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");

const COOKIE_NAME = "ahns_admin_session";
const MAX_AGE_MS = 4 * 60 * 60 * 1000; // 4시간
const JWT_ISSUER = "ahns-clinic-api";
const JWT_AUDIENCE = "ahns-admin";

// CSRF: 쿠키 인증을 사용하는 POST/PATCH/PUT/DELETE는 등록된 프론트 출처만 허용.
const DEFAULT_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
];

function allowOriginForWrite(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const allowed = process.env.ADMIN_FRONTEND_ORIGINS
    ? process.env.ADMIN_FRONTEND_ORIGINS.split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : DEFAULT_ORIGINS;
  const origin = req.get("origin");
  if (!origin || !allowed.includes(origin)) {
    return res
      .status(403)
      .json({ success: false, message: "허용되지 않은 요청 출처입니다." });
  }
  return next();
}

function jwtSecret() {
  const value = process.env.ADMIN_JWT_SECRET;
  if (!value || Buffer.byteLength(value, "utf8") < 32) {
    throw new Error("ADMIN_JWT_SECRET을 32바이트 이상으로 .env에 설정하세요.");
  }
  return value;
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // 운영 시 HTTPS 필수
    sameSite: "lax",
    path: "/", // Next.js /admin 라우트 검사에도 전송되도록 호스트 전체 경로
  };
}

function fingerprint(passwordHash) {
  return crypto.createHash("sha256").update(passwordHash).digest("hex");
}

// rate-limit (단일 프로세스 개발용). 다중 인스턴스 운영 시 Redis 기반 제한으로 교체.
const attempts = new Map();
function loginLimiter(req, res, next) {
  const key = `${req.ip || "unknown"}`;
  const now = Date.now();
  if (attempts.size > 5000) {
    for (const [k, v] of attempts) if (v.until <= now) attempts.delete(k);
  }
  const prev = attempts.get(key);
  if (!prev || prev.until <= now) {
    attempts.set(key, { count: 1, until: now + 15 * 60_000 });
    return next();
  }
  prev.count += 1;
  if (prev.count > 12) {
    return res.status(429).json({
      success: false,
      message: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도하세요.",
    });
  }
  next();
}

function createAdminSession({ dataSource }) {
  if (!dataSource || typeof dataSource.query !== "function")
    throw new Error("TypeORM DataSource가 필요합니다.");
  const secret = jwtSecret(); // 잘못된 비밀키면 서버 시작 전에 실패: fail closed
  const router = express.Router();
  const clearSession = (res) => res.clearCookie(COOKIE_NAME, cookieOptions());

  async function requireAdmin(req, res, next) {
    try {
      const token = req.cookies?.[COOKIE_NAME];
      if (typeof token !== "string" || token.length > 4096) {
        return res
          .status(401)
          .json({ success: false, message: "관리자 로그인이 필요합니다." });
      }
      const claims = jwt.verify(token, secret, {
        algorithms: ["HS256"],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });
      if (
        claims.kind !== "ADMIN" ||
        typeof claims.sub !== "string" ||
        !claims.sub ||
        typeof claims.pw !== "string"
      ) {
        clearSession(res);
        return res.status(401).json({
          success: false,
          message: "유효하지 않은 관리자 로그인입니다.",
        });
      }
      const rows = await dataSource.query(
        "SELECT USER_ID, USER_NAME, USER_PW, IS_ADMIN, STATUS FROM MEMBER_TB WHERE USER_ID = :1",
        [claims.sub],
      );
      const user = rows[0];
      if (
        !user ||
        Number(user.IS_ADMIN) !== 1 ||
        user.STATUS !== "정상" ||
        fingerprint(String(user.USER_PW)) !== claims.pw
      ) {
        clearSession(res);
        return res
          .status(403)
          .json({ success: false, message: "관리자 권한이 없습니다." });
      }
      req.admin = { userId: user.USER_ID, userName: user.USER_NAME };
      return next();
    } catch (error) {
      if (
        ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(
          error.name,
        )
      ) {
        clearSession(res);
        return res.status(401).json({
          success: false,
          message: "관리자 세션이 만료되었거나 유효하지 않습니다.",
        });
      }
      console.error("[Admin Auth] 세션 확인 실패:", error);
      return res
        .status(503)
        .json({ success: false, message: "관리자 인증 확인에 실패했습니다." });
    }
  }

  router.post("/login", allowOriginForWrite, loginLimiter, async (req, res) => {
    try {
      const { userId, userPw } = req.body || {};
      if (
        typeof userId !== "string" ||
        !userId.trim() ||
        userId.length > 50 ||
        typeof userPw !== "string" ||
        !userPw ||
        userPw.length > 200
      ) {
        return res.status(400).json({
          success: false,
          message: "아이디와 비밀번호를 올바르게 입력하세요.",
        });
      }
      const rows = await dataSource.query(
        "SELECT USER_ID, USER_NAME, USER_PW, IS_ADMIN, STATUS FROM MEMBER_TB WHERE USER_ID = :1",
        [userId.trim()],
      );
      const user = rows[0];
      const passwordCorrect =
        user && typeof user.USER_PW === "string"
          ? await bcrypt.compare(userPw, user.USER_PW)
          : false;
      if (
        !passwordCorrect ||
        Number(user.IS_ADMIN) !== 1 ||
        user.STATUS !== "정상"
      ) {
        return res.status(401).json({
          success: false,
          message: "관리자 계정 정보가 올바르지 않습니다.",
        });
      }
      const token = jwt.sign(
        { kind: "ADMIN", pw: fingerprint(user.USER_PW) },
        secret,
        {
          algorithm: "HS256",
          subject: user.USER_ID,
          issuer: JWT_ISSUER,
          audience: JWT_AUDIENCE,
          expiresIn: "4h",
        },
      );
      attempts.delete(req.ip || "unknown");
      res.cookie(COOKIE_NAME, token, {
        ...cookieOptions(),
        maxAge: MAX_AGE_MS,
      });
      return res.json({
        success: true,
        data: { userName: user.USER_NAME, isAdmin: 1 },
      });
    } catch (error) {
      console.error("[Admin Auth] 로그인 실패:", error);
      return res.status(503).json({
        success: false,
        message: "관리자 로그인 처리 중 서버 오류가 발생했습니다.",
      });
    }
  });
  router.get("/me", requireAdmin, (req, res) =>
    res.json({ success: true, data: req.admin }),
  );
  router.post("/logout", allowOriginForWrite, (_req, res) => {
    clearSession(res);
    return res.json({ success: true });
  });
  return { router, requireAdmin, allowOriginForWrite };
}

module.exports = { createAdminSession, allowOriginForWrite, COOKIE_NAME };
