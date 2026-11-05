"use strict";
const { createHash } = require("node:crypto");
// 단일 Node 프로세스 제한. 운영 시 Redis/엣지 WAF + CAPTCHA를 반드시 추가하세요.
const buckets = new Map();
const limits = {
  ip: { max: 5, ms: 15 * 60_000 },
  phone: { max: 3, ms: 24 * 60 * 60_000 },
  duplicate: { max: 1, ms: 10 * 60_000 },
  lookup: { max: 20, ms: 15 * 60_000 },
};
function fingerprint(value) {
  return createHash("sha256").update(String(value)).digest("hex");
}
function consume(key, rule, now = Date.now()) {
  const config = limits[rule];
  let bucket = buckets.get(key);
  if (!bucket || bucket.until <= now) {
    bucket = { count: 0, until: now + config.ms };
    buckets.set(key, bucket);
  }
  if (bucket.count >= config.max) return Math.ceil((bucket.until - now) / 1000);
  bucket.count++;
  if (buckets.size > 10000) {
    for (const [k, v] of buckets) if (v.until <= now) buckets.delete(k);
  }
  return 0;
}
function reject(res, seconds) {
  res.set("Retry-After", String(seconds));
  return res
    .status(429)
    .json({
      success: false,
      message: "요청이 많습니다. 잠시 후 다시 시도해 주세요.",
    });
}
function limitConsultRequest(req, res, next) {
  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  const phone =
    typeof req.body?.phone === "string"
      ? req.body.phone.replace(/\D/g, "")
      : "";
  // IP 기준 먼저 검사; 같은 전화번호로 /quick 과 일반 상담을 번갈아 반복해도 공통으로 제한.
  let seconds = consume(`ip:${fingerprint(ip)}`, "ip");
  if (seconds) {
    reject(res, seconds);
    return false;
  }
  if (phone.length >= 9) {
    seconds = consume(`phone:${fingerprint(phone)}`, "phone");
    if (seconds) {
      reject(res, seconds);
      return false;
    }
    const content = `${phone}:${req.body?.department || ""}:${req.body?.title || ""}:${req.body?.content || ""}`;
    seconds = consume(`duplicate:${fingerprint(content)}`, "duplicate");
    if (seconds) {
      reject(res, seconds);
      return false;
    }
  }
  next();
  return true;
}
function limitLookup(req, res, next) {
  const seconds = consume(
    `lookup:${fingerprint(req.ip || "unknown")}`,
    "lookup",
  );
  return seconds ? reject(res, seconds) : next();
}
module.exports = { limitConsultRequest, limitLookup };
