"use strict";

const express = require("express");
const AppDataSource = require("../../db");
const router = express.Router();
const {
  createContentI18nService,
} = require("../services/content-i18n.service");
const contentI18n = createContentI18nService(AppDataSource);
const SUPPORTED_LOCALES = new Set(["ko", "en", "ja", "zh-CN", "zh-TW"]);
const CONTENT_TYPES = {
  procedures: "CATEGORY",
  faq: "FAQ",
  events: "EVENT",
  vlog: "VLOG",
};

// 공개 페이지 자료만 검색합니다. 회원/예약/상담/관리자 데이터는 검색하지 않습니다.
// Oracle LIKE의 와일드카드를 이스케이프하여 일반 검색어로 처리합니다.
function escapeLike(value) {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}
function safeInternalHref(value) {
  const href = String(value || "").trim();
  return href.startsWith("/") && !href.startsWith("//") ? href : null;
}
function plain(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
const SOURCES = [
  {
    section: "procedures",
    label: "시술·카테고리",
    sql: `SELECT CATEGORY_IDX AS ITEM_ID, TITLE AS TITLE, LINK AS ITEM_LINK
          FROM CATEGORY_TB
          WHERE UPPER(TITLE) LIKE UPPER(:1) ESCAPE '\\'
          ORDER BY SORT_ORDER ASC, CATEGORY_IDX DESC
          FETCH NEXT 8 ROWS ONLY`,
    map: (row) => ({
      id: `category-${row.ITEM_ID}`,
      type: "procedures",
      label: "시술·카테고리",
      title: plain(row.TITLE),
      description: "시술 카테고리",
      href: safeInternalHref(row.ITEM_LINK),
    }),
  },
  {
    section: "faq",
    label: "자주 묻는 질문",
    sql: `SELECT QNA_IDX AS ITEM_ID, QUESTION AS TITLE,
                 CATEGORY_NAME AS CATEGORY_NAME,
                 DBMS_LOB.SUBSTR(ANSWER, 320, 1) AS EXCERPT
          FROM QNA_TB
          WHERE UPPER(QUESTION) LIKE UPPER(:1) ESCAPE '\\'
             OR UPPER(DBMS_LOB.SUBSTR(ANSWER, 2000, 1)) LIKE UPPER(:2) ESCAPE '\\'
          ORDER BY SORT_ORDER ASC, QNA_IDX DESC
          FETCH NEXT 8 ROWS ONLY`,
    map: (row) => ({
      id: `faq-${row.ITEM_ID}`,
      type: "faq",
      label: "FAQ",
      title: plain(row.TITLE),
      description: `${plain(row.CATEGORY_NAME)} · ${plain(row.EXCERPT)}`.slice(
        0,
        260,
      ),
      href: null, // 실제 FAQ 공개 상세 경로 확인 후 연결
    }),
  },
  {
    section: "events",
    label: "이벤트",
    sql: `SELECT EVENT_IDX AS ITEM_ID, TITLE AS TITLE, PRICE AS PRICE
          FROM EVENT_RANKING_TB
          WHERE UPPER(TITLE) LIKE UPPER(:1) ESCAPE '\\'
          ORDER BY SORT_ORDER ASC, EVENT_IDX DESC
          FETCH NEXT 8 ROWS ONLY`,
    map: (row) => ({
      id: `event-${row.ITEM_ID}`,
      type: "events",
      label: "이벤트",
      title: plain(row.TITLE),
      description: plain(row.PRICE),
      href: null, // 실제 이벤트 상세 경로 확인 후 연결
    }),
  },
  {
    section: "vlog",
    label: "영상",
    sql: `SELECT VLOG_IDX AS ITEM_ID, TITLE AS TITLE
          FROM VLOG_TB
          WHERE UPPER(TITLE) LIKE UPPER(:1) ESCAPE '\\'
          ORDER BY SORT_ORDER ASC, VLOG_IDX DESC
          FETCH NEXT 8 ROWS ONLY`,
    map: (row) => ({
      id: `vlog-${row.ITEM_ID}`,
      type: "vlog",
      label: "영상",
      title: plain(row.TITLE),
      description: "AHNS VLOG",
      href: null, // 실제 영상 상세 경로 확인 후 연결
    }),
  },
];

router.get("/", async (req, res) => {
  const raw =
    typeof req.query.q === "string"
      ? req.query.q.trim().replace(/\s+/g, " ")
      : "";
  if (!raw || raw.length > 60) {
    return res
      .status(400)
      .json({ success: false, message: "검색어를 1~60자로 입력해 주세요." });
  }
  const keyword = `%${escapeLike(raw)}%`;
  const lang = typeof req.query.locale === "string" ? req.query.locale : "ko";
  if (!SUPPORTED_LOCALES.has(lang)) {
    return res
      .status(400)
      .json({ success: false, message: "지원하지 않는 언어 코드입니다." });
  }

  try {
    const results = await Promise.allSettled(
      SOURCES.map(async (source) => {
        const binds = source.section === "faq" ? [keyword, keyword] : [keyword];
        const rows = await AppDataSource.query(source.sql, binds);
        const items = rows.map(source.map);
        if (lang !== "ko" && rows.length) {
          // 검색 대상은 기존 원본 DB입니다. 검색 결과의 게시된 번역만 표시합니다.
          const entityType = CONTENT_TYPES[source.section];
          let translations = new Map();
          try {
            translations = await contentI18n.publishedMany(
              entityType,
              rows.map((row) => Number(row.ITEM_ID)),
              lang,
            );
          } catch (error) {
            // 검색 자료 조회 성공은 유지하고 번역 장애만 한국어 원본으로 대체합니다.
            console.error(
              `[public-search] ${source.section} 번역 조회 실패`,
              error,
            );
          }
          items.forEach((item, index) => {
            const row = rows[index];
            const translated = translations.get(Number(row.ITEM_ID));
            if (!translated) return;
            const title =
              source.section === "faq" ? translated.question : translated.title;
            if (typeof title === "string" && title.trim())
              item.title = plain(title);
            if (source.section === "faq") {
              const category =
                typeof translated.categoryName === "string" &&
                translated.categoryName.trim()
                  ? translated.categoryName
                  : row.CATEGORY_NAME;
              const excerpt =
                typeof translated.answer === "string" &&
                translated.answer.trim()
                  ? translated.answer
                  : row.EXCERPT;
              item.description = `${plain(category)} · ${plain(excerpt)}`.slice(
                0,
                260,
              );
            }
          });
        }
        return {
          section: source.section,
          label: source.label,
          items,
        };
      }),
    );

    const groups = [];
    let failed = 0;
    for (let i = 0; i < results.length; i++) {
      const current = results[i];
      if (current.status === "fulfilled") {
        groups.push(current.value);
      } else {
        failed++;
        // 팀 공동 DB에서 아직 없는 공개 테이블은 다른 분야의 검색까지 막지 않습니다.
        console.error(
          `[public-search] ${SOURCES[i].section} 조회 실패`,
          current.reason,
        );
      }
    }
    if (failed === SOURCES.length) {
      return res
        .status(503)
        .json({ success: false, message: "검색 데이터를 조회할 수 없습니다." });
    }
    return res.json({
      success: true,
      query: raw,
      groups,
      total: groups.reduce((sum, group) => sum + group.items.length, 0),
      partial: failed > 0,
    });
  } catch (error) {
    console.error("[public-search] 예기치 못한 오류", error);
    return res
      .status(500)
      .json({ success: false, message: "검색 처리 중 오류가 발생했습니다." });
  }
});

module.exports = router;
