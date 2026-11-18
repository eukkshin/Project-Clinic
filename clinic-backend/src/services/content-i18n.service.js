"use strict";

const { createHash } = require("node:crypto");

const DEFAULT_LOCALE = "ko";
const TRANSLATION_LOCALES = Object.freeze(["en", "ja", "zh-CN", "zh-TW"]);
const ALLOWED_LOCALES = Object.freeze([DEFAULT_LOCALE, ...TRANSLATION_LOCALES]);

// SQL 식별자는 외부 입력으로 만들지 않습니다. 이 고정 매핑만 사용합니다.
const TYPES = Object.freeze({
  EVENT: {
    table: "EVENT_RANKING_TB",
    id: "EVENT_IDX",
    fields: ["title", "price"],
  },
  VLOG: { table: "VLOG_TB", id: "VLOG_IDX", fields: ["title"] },
  MAIN_VISUAL: { table: "MAIN_VISUAL", id: "ID", fields: ["content"] },
  CATEGORY: { table: "CATEGORY_TB", id: "CATEGORY_IDX", fields: ["title"] },
  NAV_SETTING: { table: "NAV_SETTING", id: "ID", fields: ["content"] },
  SAFETY: {
    table: "SAFETY_TB",
    id: "SAFETY_IDX",
    fields: ["title", "description"],
  },
  FOOTER: {
    table: "FOOTER_SETTINGS",
    id: "ID",
    fields: ["name", "address", "clinicName", "content"],
  },
  FAQ: {
    table: "QNA_TB",
    id: "QNA_IDX",
    fields: ["categoryName", "question", "answer"],
  },
  DETAIL_CATEGORY: {
    table: "DETAIL_CATEGORY",
    id: "CATEGORY_ID",
    fields: ["name", "description"],
  },
  DETAIL_PAGE: {
    table: "DETAIL_PAGE",
    id: "PAGE_ID",
    fields: [
      "title",
      "heroEyebrow",
      "heroTitle",
      "heroDescription",
      "heroImageAlt",
      "seoTitle",
      "seoDescription",
    ],
  },
  DETAIL_SECTION: {
    table: "DETAIL_SECTION",
    id: "SECTION_ID",
    fields: ["title", "eyebrow", "content"],
  },
});

class ContentI18nError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ContentI18nError";
    this.status = status;
  }
}

function kind(value) {
  const type = typeof value === "string" ? value.toUpperCase() : "";
  if (!Object.hasOwn(TYPES, type))
    throw new ContentI18nError(400, "지원하지 않는 콘텐츠 종류입니다.");
  return type;
}
function locale(value, { translationOnly = false } = {}) {
  const lang = typeof value === "string" ? value : DEFAULT_LOCALE;
  if (!ALLOWED_LOCALES.includes(lang) || (translationOnly && lang === "ko")) {
    throw new ContentI18nError(400, "지원하지 않는 언어 코드입니다.");
  }
  return lang;
}
function id(value) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > 999999999999) {
    throw new ContentI18nError(400, "올바른 게시물 ID가 아닙니다.");
  }
  return parsed;
}
async function clobText(value) {
  if (value == null) return null;
  if (typeof value === "string") return value;
  if (Buffer.isBuffer(value)) return value.toString("utf8");
  if (typeof value.getData === "function") return String(await value.getData());
  if (typeof value[Symbol.asyncIterator] === "function") {
    let result = "";
    for await (const chunk of value) result += String(chunk);
    return result;
  }
  throw new Error("CLOB 데이터를 읽을 수 없습니다.");
}
function clobBind(value) {
  return value;
}
function parsePayload(value) {
  const obj = JSON.parse(value);
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    throw new Error("저장된 번역 JSON이 객체가 아닙니다.");
  }
  return obj;
}
function plainString(value, name, max = 10000) {
  if (typeof value !== "string")
    throw new ContentI18nError(400, `${name}은 문자열이어야 합니다.`);
  if (value.length > max)
    throw new ContentI18nError(400, `${name}은 ${max}자 이하로 입력해 주세요.`);
  return value.trim();
}

// 콘텐츠 JSON에 들어가는 이미지·링크·레이아웃·상태 등은 절대 번역값으로 덮어쓰지 않습니다.
const TEXT_KEYS = new Set([
  "description",
  "title",
  "eyebrow",
  "heading",
  "subheading",
  "subtitle",
  "lead",
  "text",
  "body",
  "label",
  "caption",
  "question",
  "answer",
  "buttonLabel",
  "compareLeftTitle",
  "compareLeftBody",
  "compareRightTitle",
  "compareRightBody",
  "note",
  "summary",
  "alt",
  "quote",
  "name",
  "department",
  "content",
  "highlight",
  "footer",
]);
const TEXT_ARRAY_KEYS = new Set([
  "items",
  "bullets",
  "lines",
  "paragraphs",
  "highlights",
  "steps",
]);

function isRecord(v) {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

// Translation payload는 원문의 구조/배열 길이를 유지해야 합니다.
// 불가한 키나 구조 변경은 거절합니다. 텍스트만 새 객체에 반영합니다.
function mergeContentTree(original, translated, key = "content", depth = 0) {
  if (depth > 15)
    throw new ContentI18nError(400, "콘텐츠 구조가 너무 깊습니다.");
  if (typeof original === "string") {
    if (!(TEXT_KEYS.has(key) || TEXT_ARRAY_KEYS.has(key))) {
      if (original !== translated)
        throw new ContentI18nError(
          400,
          `${key} 값은 번역으로 변경할 수 없습니다.`,
        );
      return original;
    }
    const next = plainString(translated, key, 12000);
    return next || original;
  }
  if (Array.isArray(original)) {
    if (!Array.isArray(translated) || original.length !== translated.length) {
      throw new ContentI18nError(
        400,
        "번역 JSON의 배열 구조가 원문과 다릅니다.",
      );
    }
    return original.map((value, index) =>
      mergeContentTree(value, translated[index], key, depth + 1),
    );
  }
  if (isRecord(original)) {
    if (
      !isRecord(translated) ||
      Object.keys(original).length !== Object.keys(translated).length ||
      Object.keys(original).some((field) => !Object.hasOwn(translated, field))
    ) {
      throw new ContentI18nError(
        400,
        "번역 JSON의 필드 구조가 원문과 다릅니다.",
      );
    }
    const result = {};
    for (const field of Object.keys(original)) {
      result[field] = mergeContentTree(
        original[field],
        translated[field],
        field,
        depth + 1,
      );
    }
    return result;
  }
  if (translated !== original) {
    throw new ContentI18nError(
      400,
      `${key}의 원본 구조 또는 설정값을 변경할 수 없습니다.`,
    );
  }
  return original;
}

function validatePayload(type, raw, source) {
  if (!isRecord(raw))
    throw new ContentI18nError(400, "번역 데이터는 JSON 객체여야 합니다.");
  const fields = TYPES[type].fields;
  if (Object.keys(raw).some((key) => !fields.includes(key))) {
    throw new ContentI18nError(400, "번역할 수 없는 필드가 포함되어 있습니다.");
  }
  const result = {};
  for (const [field, value] of Object.entries(raw)) {
    if (field === "content") {
      if (!isRecord(source.content) || !isRecord(value)) {
        throw new ContentI18nError(
          400,
          "섹션 content는 원본 JSON과 같은 객체 구조여야 합니다.",
        );
      }
      result.content = mergeContentTree(source.content, value);
    } else {
      result[field] = plainString(
        value,
        field,
        field === "answer" ? 30000 : 12000,
      );
    }
  }
  if (Buffer.byteLength(JSON.stringify(result), "utf8") > 100000) {
    throw new ContentI18nError(400, "번역 데이터 크기가 너무 큽니다.");
  }
  return result;
}
// Fingerprint only translatable source fields. The JSON payload holds metadata
// so existing Oracle tables and CHECK constraints do not need a migration.
function sourceHash(type, source) {
  const textFields = {};
  for (const field of TYPES[type].fields)
    textFields[field] = source[field] ?? null;
  return createHash("sha256").update(JSON.stringify(textFields)).digest("hex");
}
function unpackStoredPayload(stored) {
  if (!stored) return { payload: {}, sourceHash: null };
  const { __sourceHash, ...payload } = stored;
  return {
    payload,
    sourceHash: typeof __sourceHash === "string" ? __sourceHash : null,
  };
}

function applyTranslation(source, type, payload) {
  const copy = { ...source };
  for (const field of TYPES[type].fields) {
    const translated = payload?.[field];
    if (field === "content") {
      if (isRecord(translated) && isRecord(copy.content)) {
        // 원문 수정 후 예전 번역 JSON 구조가 달라졌다면 원문만 사용 (안전한 fallback).
        try {
          copy.content = mergeContentTree(copy.content, translated);
        } catch {
          /* 원문 유지 */
        }
      }
    } else if (typeof translated === "string" && translated.trim())
      copy[field] = translated;
  }
  return copy;
}

function createContentI18nService(dataSource) {
  if (
    !dataSource ||
    typeof dataSource.query !== "function" ||
    typeof dataSource.transaction !== "function"
  ) {
    throw new Error("TypeORM DataSource가 필요합니다.");
  }
  async function original(type, itemId, manager = dataSource) {
    const info = TYPES[type];
    let sql;
    switch (type) {
      case "EVENT":
        sql =
          "SELECT TITLE, PRICE, FILE_NAME FROM EVENT_RANKING_TB WHERE EVENT_IDX=?";
        break;
      case "VLOG":
        sql =
          "SELECT TITLE, VIDEO_URL, FILE_NAME, SORT_ORDER FROM VLOG_TB WHERE VLOG_IDX=?";
        break;
      case "CATEGORY":
        sql =
          "SELECT TITLE, FILE_NAME, LINK, SORT_ORDER FROM CATEGORY_TB WHERE CATEGORY_IDX=?";
        break;
      case "MAIN_VISUAL":
        sql = "SELECT SLIDES FROM MAIN_VISUAL WHERE ID=?";
        break;
      case "NAV_SETTING":
        sql = "SELECT MENUS FROM NAV_SETTING WHERE ID=?";
        break;
      case "FOOTER":
        break;
      case "SAFETY":
        sql =
          "SELECT TITLE, DESCRIPTION, FILE_NAME, SORT_ORDER FROM SAFETY_TB WHERE SAFETY_IDX=?";
        break;
      case "FAQ":
        sql =
          "SELECT CATEGORY, CATEGORY_NAME, QUESTION, ANSWER FROM QNA_TB WHERE QNA_IDX=?";
        break;
      case "DETAIL_CATEGORY":
        sql =
          "SELECT SLUG, NAME, DESCRIPTION FROM DETAIL_CATEGORY WHERE CATEGORY_ID=?";
        break;
      case "DETAIL_PAGE":
        sql = `SELECT SLUG, STATUS, TITLE, HERO_EYEBROW, HERO_TITLE, HERO_DESCRIPTION, HERO_IMAGE_ALT,
        SEO_TITLE, SEO_DESCRIPTION FROM DETAIL_PAGE WHERE PAGE_ID=?`;
        break;
      case "DETAIL_SECTION":
        sql = `SELECT S.SECTION_KEY, S.SECTION_TYPE, S.TITLE, S.EYEBROW, S.CONTENT_JSON,
        S.PAGE_ID, P.STATUS AS PAGE_STATUS FROM DETAIL_SECTION S
        JOIN DETAIL_PAGE P ON S.PAGE_ID=P.PAGE_ID WHERE S.SECTION_ID=?`;
        break;
      default:
        throw new ContentI18nError(400, "지원하지 않는 종류입니다.");
    }
    if (type === "FOOTER") {
      // Footer is stored as a TypeORM simple-json entity. Use the repository so
      // Oracle column case and JSON serialization remain consistent.
      const footer = await manager
        .getRepository("FooterSettings")
        .findOne({ where: { id: itemId } });
      if (!footer)
        throw new ContentI18nError(404, "푸터 설정을 찾을 수 없습니다.");
      const schedules = Array.isArray(footer.schedules) ? footer.schedules : [];
      const familySites = Array.isArray(footer.familySites)
        ? footer.familySites
        : [];
      return {
        name: footer.name ?? "",
        address: footer.address ?? "",
        clinicName: footer.clinicName ?? "",
        content: {
          schedules: Object.fromEntries(
            schedules
              .filter((v) => v && v.id != null)
              .map((v) => [
                String(v.id),
                { department: String(v.department ?? v.departments ?? "") },
              ]),
          ),
          familySites: Object.fromEntries(
            familySites
              .filter((v) => v && v.id != null)
              .map((v) => [String(v.id), { name: String(v.name ?? "") }]),
          ),
        },
      };
    }
    const row = (await manager.query(sql, [itemId]))[0];
    if (!row)
      throw new ContentI18nError(404, "원본 콘텐츠를 찾을 수 없습니다.");
    if (type === "EVENT")
      return { title: row.TITLE, price: row.PRICE, imageFile: row.FILE_NAME };
    if (type === "VLOG")
      return {
        title: row.TITLE,
        videoUrl: row.VIDEO_URL,
        imageFile: row.FILE_NAME,
        sortOrder: row.SORT_ORDER,
      };
    if (type === "CATEGORY")
      return {
        title: row.TITLE,
        imageFile: row.FILE_NAME,
        link: row.LINK,
        sortOrder: row.SORT_ORDER,
      };
    if (type === "NAV_SETTING") {
      const raw = await clobText(row.MENUS);
      let menus;
      try {
        menus = raw ? JSON.parse(raw) : [];
      } catch {
        throw new Error("헤더 메뉴 JSON이 올바르지 않습니다.");
      }
      if (!Array.isArray(menus))
        throw new Error("헤더 메뉴는 배열이어야 합니다.");
      // URLs, ids, menu order and structure are never editable in translation payload.
      return { content: { menus } };
    }
    if (type === "MAIN_VISUAL") {
      const slidesRaw = await clobText(row.SLIDES);
      let slides;
      try {
        slides = slidesRaw ? JSON.parse(slidesRaw) : [];
      } catch {
        throw new Error("메인 슬라이드 JSON이 올바르지 않습니다.");
      }
      if (!Array.isArray(slides))
        throw new Error("메인 슬라이드는 배열이어야 합니다.");
      // Stable ids are used as translation keys. Never change links/images in payload.
      const titles = {};
      for (const slide of slides) {
        const slideId = String(slide?.id ?? "");
        if (!/^\d+$/.test(slideId) || Object.hasOwn(titles, slideId)) continue;
        titles[slideId] = { title: String(slide.title ?? "") };
      }
      return { content: { slides: titles } };
    }
    if (type === "SAFETY")
      return {
        title: row.TITLE,
        description: row.DESCRIPTION,
        imageFile: row.FILE_NAME,
        sortOrder: row.SORT_ORDER,
      };
    if (type === "FAQ")
      return {
        category: row.CATEGORY,
        categoryName: row.CATEGORY_NAME,
        question: row.QUESTION,
        answer: await clobText(row.ANSWER),
      };
    if (type === "DETAIL_CATEGORY")
      return { slug: row.SLUG, name: row.NAME, description: row.DESCRIPTION };
    if (type === "DETAIL_PAGE")
      return {
        slug: row.SLUG,
        status: row.STATUS,
        title: row.TITLE,
        heroEyebrow: row.HERO_EYEBROW,
        heroTitle: row.HERO_TITLE,
        heroDescription: row.HERO_DESCRIPTION,
        heroImageAlt: row.HERO_IMAGE_ALT,
        seoTitle: row.SEO_TITLE,
        seoDescription: row.SEO_DESCRIPTION,
      };
    const raw = await clobText(row.CONTENT_JSON);
    let content;
    try {
      content = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error("원본 섹션 JSON이 올바르지 않습니다.");
    }
    return {
      sectionKey: row.SECTION_KEY,
      sectionType: row.SECTION_TYPE,
      pageId: Number(row.PAGE_ID),
      pageStatus: row.PAGE_STATUS,
      title: row.TITLE,
      eyebrow: row.EYEBROW,
      content,
    };
  }

  async function listSources(type, query = "") {
    const filter = String(query ?? "")
      .trim()
      .slice(0, 60);
    const binds = filter
      ? [
          `%${filter.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_")}%`,
        ]
      : [];
    // 독립적인 관리자 선택기: 신규 테이블의 PK만으로 원본을 가정하지 않습니다.
    const queries = {
      FOOTER: `SELECT "id" AS ID, "name" AS LABEL FROM FOOTER_SETTINGS ${filter ? `WHERE UPPER("name") LIKE UPPER(?) ESCAPE '\\'` : ""} ORDER BY "id" LIMIT 150`,
      NAV_SETTING: `SELECT ID, '헤더 메뉴' AS LABEL FROM NAV_SETTING WHERE ID=1 ${filter ? "AND '헤더 메뉴' LIKE ?" : ""} LIMIT 150`,
      MAIN_VISUAL: `SELECT ID, '메인 슬라이드' AS LABEL FROM MAIN_VISUAL WHERE ID=1 ${filter ? "AND '메인 슬라이드' LIKE ?" : ""} LIMIT 150`,
      CATEGORY: `SELECT CATEGORY_IDX AS ID, TITLE AS LABEL FROM CATEGORY_TB ${filter ? "WHERE UPPER(TITLE) LIKE UPPER(?) ESCAPE '\\'" : ""} ORDER BY SORT_ORDER ASC, CATEGORY_IDX DESC LIMIT 150`,
      VLOG: `SELECT VLOG_IDX AS ID, TITLE AS LABEL FROM VLOG_TB ${filter ? "WHERE UPPER(TITLE) LIKE UPPER(?) ESCAPE '\\'" : ""} ORDER BY SORT_ORDER ASC, VLOG_IDX DESC LIMIT 150`,
      SAFETY: `SELECT SAFETY_IDX AS ID, TITLE AS LABEL FROM SAFETY_TB ${filter ? "WHERE UPPER(TITLE) LIKE UPPER(?) ESCAPE '\\'" : ""} ORDER BY SORT_ORDER ASC, SAFETY_IDX DESC LIMIT 150`,
      EVENT: `SELECT EVENT_IDX AS ID, TITLE AS LABEL FROM EVENT_RANKING_TB ${filter ? "WHERE UPPER(TITLE) LIKE UPPER(?) ESCAPE '\\'" : ""} ORDER BY EVENT_IDX DESC LIMIT 150`,
      FAQ: `SELECT QNA_IDX AS ID, QUESTION AS LABEL FROM QNA_TB ${filter ? "WHERE UPPER(QUESTION) LIKE UPPER(?) ESCAPE '\\'" : ""} ORDER BY QNA_IDX DESC LIMIT 150`,
      DETAIL_CATEGORY: `SELECT CATEGORY_ID AS ID, NAME AS LABEL FROM DETAIL_CATEGORY ${filter ? "WHERE UPPER(NAME) LIKE UPPER(?) ESCAPE '\\'" : ""} ORDER BY CATEGORY_ID DESC LIMIT 150`,
      DETAIL_PAGE: `SELECT PAGE_ID AS ID, TITLE AS LABEL FROM DETAIL_PAGE ${filter ? "WHERE UPPER(TITLE) LIKE UPPER(?) ESCAPE '\\'" : ""} ORDER BY PAGE_ID DESC LIMIT 150`,
      DETAIL_SECTION: `SELECT SECTION_ID AS ID, TITLE AS LABEL FROM DETAIL_SECTION ${filter ? "WHERE UPPER(TITLE) LIKE UPPER(?) ESCAPE '\\'" : ""} ORDER BY SECTION_ID DESC LIMIT 150`,
    };
    return (await dataSource.query(queries[type], binds)).map((r) => ({
      id: Number(r.ID),
      label: r.LABEL,
    }));
  }

  async function getAdmin(type, itemId, lang) {
    const source = await original(type, itemId);
    if (lang === "ko")
      return {
        type,
        id: itemId,
        locale: lang,
        source,
        payload: {},
        status: "SOURCE",
        sourceHash: sourceHash(type, source),
        sourceChanged: false,
        sourceTrackingAvailable: true,
      };
    const row = (
      await dataSource.query(
        `SELECT STATUS, PAYLOAD_JSON, UPDATED_AT FROM CMS_CONTENT_I18N_TB
       WHERE ENTITY_TYPE=? AND ENTITY_ID=? AND LOCALE=?`,
        [type, itemId, lang],
      )
    )[0];
    const saved = row ? parsePayload(await clobText(row.PAYLOAD_JSON)) : null;
    const unpacked = unpackStoredPayload(saved);
    const currentHash = sourceHash(type, source);
    return {
      type,
      id: itemId,
      locale: lang,
      source,
      payload: unpacked.payload,
      status: row?.STATUS ?? "MISSING",
      updatedAt: row?.UPDATED_AT ?? null,
      sourceHash: currentHash,
      sourceTrackingAvailable: Boolean(unpacked.sourceHash),
      sourceChanged: Boolean(
        unpacked.sourceHash && unpacked.sourceHash !== currentHash,
      ),
    };
  }

  async function save(
    type,
    itemId,
    lang,
    raw,
    status,
    updatedBy,
    expectedSourceHash,
  ) {
    if (!["DRAFT", "PUBLISHED"].includes(status))
      throw new ContentI18nError(400, "상태가 잘못되었습니다.");
    const source = await original(type, itemId);
    const currentHash = sourceHash(type, source);
    if (expectedSourceHash != null && expectedSourceHash !== currentHash) {
      throw new ContentI18nError(
        409,
        "원본 콘텐츠가 변경되었습니다. 번역 화면을 새로고침한 후 검토해 주세요.",
      );
    }
    const payload = validatePayload(type, raw, source);
    if (status === "PUBLISHED" && Object.keys(payload).length === 0) {
      throw new ContentI18nError(400, "공개할 번역을 하나 이상 입력해 주세요.");
    }
    await dataSource.transaction(async (manager) => {
      const exists = (
        await manager.query(
          `SELECT ENTITY_ID FROM CMS_CONTENT_I18N_TB
         WHERE ENTITY_TYPE=? AND ENTITY_ID=? AND LOCALE=?`,
          [type, itemId, lang],
        )
      )[0];
      const binds = [
        status,
        clobBind(JSON.stringify({ ...payload, __sourceHash: currentHash })),
        updatedBy ?? null,
        type,
        itemId,
        lang,
      ];
      if (exists) {
        await manager.query(
          `UPDATE CMS_CONTENT_I18N_TB SET STATUS=?, PAYLOAD_JSON=?,
          UPDATED_BY=?, UPDATED_AT=CURRENT_TIMESTAMP WHERE ENTITY_TYPE=? AND ENTITY_ID=? AND LOCALE=?`,
          binds,
        );
      } else {
        await manager.query(
          `INSERT INTO CMS_CONTENT_I18N_TB
          (ENTITY_TYPE, ENTITY_ID, LOCALE, STATUS, PAYLOAD_JSON, UPDATED_BY, UPDATED_AT)
          VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP)`,
          [
            type,
            itemId,
            lang,
            status,
            clobBind(JSON.stringify({ ...payload, __sourceHash: currentHash })),
            updatedBy ?? null,
          ],
        );
      }
    });
    return { type, id: itemId, locale: lang, status };
  }

  async function remove(type, itemId, lang) {
    await original(type, itemId);
    await dataSource.query(
      "DELETE FROM CMS_CONTENT_I18N_TB WHERE ENTITY_TYPE=? AND ENTITY_ID=? AND LOCALE=?",
      [type, itemId, lang],
    );
    return { type, id: itemId, locale: lang };
  }

  async function publishedMany(type, ids, lang) {
    if (lang === "ko" || ids.length === 0) return new Map();
    const uniqueIds = [
      ...new Set(ids.map(id).filter((v) => Number.isSafeInteger(v) && v > 0)),
    ];
    const map = new Map();
    for (let start = 0; start < uniqueIds.length; start += 100) {
      const part = uniqueIds.slice(start, start + 100);
      const slots = part.map((_, index) => "?").join(",");
      const rows = await dataSource.query(
        `SELECT ENTITY_ID, PAYLOAD_JSON FROM CMS_CONTENT_I18N_TB
        WHERE ENTITY_TYPE=? AND LOCALE=? AND STATUS='PUBLISHED' AND ENTITY_ID IN (${slots})`,
        [type, lang, ...part],
      );
      for (const row of rows) {
        try {
          map.set(
            Number(row.ENTITY_ID),
            parsePayload(await clobText(row.PAYLOAD_JSON)),
          );
        } catch (error) {
          console.error(
            "[CMS i18n] 번역 JSON 파싱 실패:",
            type,
            row.ENTITY_ID,
            error,
          );
        }
      }
    }
    return map;
  }

  return { original, listSources, getAdmin, save, remove, publishedMany };
}

module.exports = {
  TYPES,
  ContentI18nError,
  kind,
  locale,
  id,
  clobText,
  applyTranslation,
  createContentI18nService,
};
