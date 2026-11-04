"use strict";

/**
 * 단일 Express 프로세스용 기본 로그인 시도 제한입니다.
 * 다중 인스턴스/서버리스 환경에서는 Redis 기반 공용 Rate Limiter로 대체해야 합니다.
 * req.ip는 운영 중 신뢰할 수 있는 프록시 구성에 맞춰 설정하세요.
 */
const crypto = require("node:crypto");
const WINDOW_MS = 15 * 60 * 1000;
const ACCOUNT_MAX_FAILURES = 10;
const IP_MAX_FAILURES = 50;
const failures = new Map();

function keysFor(req, userId) {
  const ip = typeof req.ip === "string" ? req.ip : "unknown";
  const accountHash = crypto
    .createHash("sha256")
    .update(`${ip}|${String(userId).toLowerCase()}`)
    .digest("hex");
  return ["ip:" + ip, "account:" + accountHash];
}

function recordFailure(key) {
  const now = Date.now();
  const existing = failures.get(key);
  if (!existing || existing.until <= now) {
    failures.set(key, { count: 1, until: now + WINDOW_MS });
  } else {
    existing.count += 1;
  }
  if (failures.size > 5000) {
    for (const [name, state] of failures) {
      if (state.until <= now) failures.delete(name);
    }
  }
}

function isRateLimited(req, userId) {
  const now = Date.now();
  const [ip, account] = keysFor(req, userId);
  const ipState = failures.get(ip);
  const accountState = failures.get(account);
  return (
    Boolean(
      ipState && ipState.until > now && ipState.count >= IP_MAX_FAILURES,
    ) ||
    Boolean(
      accountState &&
      accountState.until > now &&
      accountState.count >= ACCOUNT_MAX_FAILURES,
    )
  );
}

function recordLoginFailure(req, userId) {
  for (const key of keysFor(req, userId)) recordFailure(key);
}

function clearAccountFailures(req, userId) {
  const [, accountKey] = keysFor(req, userId);
  failures.delete(accountKey);
}

module.exports = {
  isRateLimited,
  recordLoginFailure,
  clearAccountFailures,
};
