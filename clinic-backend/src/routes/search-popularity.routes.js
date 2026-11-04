"use strict";

const express = require("express");
const crypto = require("crypto");
const AppDataSource = require("../../db");

const router = express.Router();

// 실제 집계 기록이 없을 때만 화면에 '추천 검색어'로 표시됩니다.
const RECOMMENDED = ["눈성형", "코성형", "리프팅", "보톡스", "필러"];
const DEDUP_MS = 5 * 60 * 1000; // 동일 방문자 + 동일 키워드: 5분에 1번만 기록
const HOURLY_LIMIT = 60; // 동일 방문자: 시간당 최대 60건 기록
const FINGERPRINT_SALT = crypto.randomBytes(32);
const recentlyCounted = new Map();
const visitorBudgets = new Map();
let requestNumber = 0;

function normalizeKeyword(value) {
  if (typeof value !== "string") return "";
  return value.normalize("NFKC").replace(/\s+/g, " ").trim().toLowerCase();
}

function isPotentialPersonalInfo(value) {
  // 개인정보가 포함되기 쉬운 이메일/긴 숫자열은 순위용 DB에 저장하지 않음.
  return value.includes("@") || /(?:\d[\s().-]?){8,}/.test(value);
}

function fingerprint(req) {
  // 식별 원문은 DB에 저장되지 않으며 재시작 시 해시 키가 변경됩니다.
  const client = `${req.ip || req.socket.remoteAddress || "unknown"}|${req.get("user-agent") || ""}`;
  return crypto
    .createHmac("sha256", FINGERPRINT_SALT)
    .update(client)
    .digest("hex");
}

function prune(now) {
  requestNumber++;
  if (
    requestNumber % 100 !== 0 &&
    recentlyCounted.size < 10000 &&
    visitorBudgets.size < 10000
  )
    return;
  for (const [key, expiresAt] of recentlyCounted) {
    if (expiresAt <= now) recentlyCounted.delete(key);
  }
  for (const [key, entry] of visitorBudgets) {
    if (entry.expiresAt <= now) visitorBudgets.delete(key);
  }
  // 메모리 상한: 오래된 키를 먼저 제거 (서버 재시작 시 초기화되는 경량 보호 장치)
  while (recentlyCounted.size > 10000)
    recentlyCounted.delete(recentlyCounted.keys().next().value);
  while (visitorBudgets.size > 10000)
    visitorBudgets.delete(visitorBudgets.keys().next().value);
}

router.get("/popular", async (_req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    const rows = await AppDataSource.query(`
      SELECT KEYWORD, COUNT(*) AS SEARCH_COUNT
      FROM SEARCH_KEYWORD_LOG_TB
      WHERE SEARCHED_AT >= LOCALTIMESTAMP - INTERVAL '7' DAY
      GROUP BY KEYWORD
      ORDER BY SEARCH_COUNT DESC, KEYWORD ASC
      FETCH FIRST 5 ROWS ONLY
    `);

    if (rows.length === 0) {
      return res.json({
        success: true,
        mode: "recommended",
        periodDays: 7,
        items: RECOMMENDED.map((keyword, index) => ({
          rank: index + 1,
          keyword,
          count: null,
        })),
      });
    }

    return res.json({
      success: true,
      mode: "popular",
      periodDays: 7,
      items: rows.map((row, index) => ({
        rank: index + 1,
        keyword: String(row.KEYWORD),
        count: Number(row.SEARCH_COUNT),
      })),
    });
  } catch (error) {
    console.error("[search/popular] 인기 검색어 조회 실패:", error);
    return res
      .status(503)
      .json({ success: false, message: "인기 검색어를 조회하지 못했습니다." });
  }
});

// 검색어 입력/자동완성 API 호출이 아니라 '실제 검색 제출' 시에만 호출하세요.
// express.json은 이 라우터에만 적용하므로 기존 서버의 body parser 설정을 변경하지 않습니다.
router.post("/track", express.json({ limit: "2kb" }), async (req, res) => {
  res.set("Cache-Control", "no-store");
  const keyword = normalizeKeyword(req.body?.query);
  if (!keyword || keyword.length > 60) {
    return res
      .status(400)
      .json({ success: false, message: "검색어는 1~60자로 입력해 주세요." });
  }
  if (isPotentialPersonalInfo(keyword)) {
    return res.json({ success: true, counted: false, reason: "privacy" });
  }

  const now = Date.now();
  prune(now);
  const visitor = fingerprint(req);
  const dedupKey = `${visitor}:${keyword}`;
  if ((recentlyCounted.get(dedupKey) || 0) > now) {
    return res.json({ success: true, counted: false, reason: "duplicate" });
  }

  const previousBudget = visitorBudgets.get(visitor);
  const budget =
    previousBudget && previousBudget.expiresAt > now
      ? previousBudget
      : { count: 0, expiresAt: now + 60 * 60 * 1000 };
  if (budget.count >= HOURLY_LIMIT) {
    return res
      .status(429)
      .json({ success: false, message: "검색 요청이 너무 많습니다." });
  }

  // 동시 요청 중복을 줄이기 위해 INSERT 전에 메모리 보호 상태를 예약합니다.
  recentlyCounted.set(dedupKey, now + DEDUP_MS);
  budget.count++;
  visitorBudgets.set(visitor, budget);

  try {
    await AppDataSource.query(
      "INSERT INTO SEARCH_KEYWORD_LOG_TB (KEYWORD, SEARCHED_AT) VALUES (:1, LOCALTIMESTAMP)",
      [keyword],
    );
    return res.json({ success: true, counted: true });
  } catch (error) {
    recentlyCounted.delete(dedupKey);
    budget.count--;
    console.error("[search/track] 검색어 기록 실패:", error);
    return res
      .status(503)
      .json({ success: false, message: "검색어 기록에 실패했습니다." });
  }
});

module.exports = router;
