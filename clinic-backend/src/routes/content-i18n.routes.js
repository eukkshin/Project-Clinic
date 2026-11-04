"use strict";

const express = require("express");
const {
  TYPES, ContentI18nError, kind, locale, id, clobText,
  applyTranslation, createContentI18nService,
} = require("../services/content-i18n.service");
const { allowOriginForWrite } = require("../auth/adminSession");

function createContentI18nRouters({ dataSource, requireAdmin }) {
  if (typeof requireAdmin !== "function") throw new Error("관리자 인증 미들웨어가 필요합니다.");
  const service = createContentI18nService(dataSource);
  const adminRouter = express.Router();
  const publicRouter = express.Router();
  const wrap = (handler) => (req, res, next) =>
    Promise.resolve().then(() => handler(req, res)).catch(next);
  const ok = (res, data, status = 200) => res.status(status).json({ success: true, data });

  adminRouter.use(requireAdmin, allowOriginForWrite);
  adminRouter.get("/types", (_req, res) => ok(res, Object.entries(TYPES).map(([type, cfg]) => ({ type, fields: cfg.fields }))));
  adminRouter.get("/sources/:type", wrap(async (req, res) => {
    ok(res, await service.listSources(kind(req.params.type), req.query.q));
  }));
  adminRouter.get("/:type/:id/:locale", wrap(async (req, res) => {
    const t = kind(req.params.type); const itemId = id(req.params.id);
    const lang = locale(req.params.locale);
    ok(res, await service.getAdmin(t, itemId, lang));
  }));
  adminRouter.put("/:type/:id/:locale", wrap(async (req, res) => {
    const t = kind(req.params.type); const itemId = id(req.params.id);
    const lang = locale(req.params.locale, { translationOnly: true });
    ok(res, await service.save(t, itemId, lang, req.body?.payload,
      req.body?.status, req.admin?.userId));
  }));
  adminRouter.delete("/:type/:id/:locale", wrap(async (req, res) => {
    const t = kind(req.params.type); const itemId = id(req.params.id);
    const lang = locale(req.params.locale, { translationOnly: true });
    ok(res, await service.remove(t, itemId, lang));
  }));

  // 익명 방문자에게는 관리 편집 데이터를 공개하지 않고, 게시(PUBLISHED)된 번역만 적용합니다.
  // 기존 프론트 CommunityEntry 정규화에 맞춰 칼럼명을 보존합니다.
  publicRouter.get("/events", wrap(async (req, res) => {
    const lang = locale(req.query.locale);
    const rows = await dataSource.query(`SELECT EVENT_IDX, TITLE, PRICE, FILE_NAME, SORT_ORDER
      FROM EVENT_RANKING_TB ORDER BY SORT_ORDER, EVENT_IDX`);
    const translations = await service.publishedMany("EVENT", rows.map((r) => Number(r.EVENT_IDX)), lang);
    const result = rows.map((row) => {
      const id = Number(row.EVENT_IDX);
      const translated = applyTranslation({ title: row.TITLE }, "EVENT", translations.get(id));
      return { ...row, TITLE: translated.title };
    });
    ok(res, result);
  }));
  publicRouter.get("/faq", wrap(async (req, res) => {
    const lang = locale(req.query.locale);
    const rows = await dataSource.query(`SELECT QNA_IDX, CATEGORY, CATEGORY_NAME, QUESTION,
      ANSWER, SORT_ORDER, REG_DATE FROM QNA_TB ORDER BY SORT_ORDER, QNA_IDX DESC`);
    const translations = await service.publishedMany("FAQ", rows.map((r) => Number(r.QNA_IDX)), lang);
    const result = await Promise.all(rows.map(async (row) => {
      const id = Number(row.QNA_IDX);
      const answer = await clobText(row.ANSWER);
      const translated = applyTranslation({ categoryName: row.CATEGORY_NAME, question: row.QUESTION, answer },
        "FAQ", translations.get(id));
      return { ...row, CATEGORY_NAME: translated.categoryName, QUESTION: translated.question,
        ANSWER: translated.answer };
    }));
    ok(res, result);
  }));

  function errors(error, _req, res, next) {
    if (res.headersSent) return next(error);
    if (error instanceof ContentI18nError) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    if (/ORA-00001/.test(`${error.code || ""} ${error.message || ""}`)) {
      return res.status(409).json({ success: false, message: "번역 저장 충돌입니다. 다시 시도해 주세요." });
    }
    console.error("[CMS i18n]", error);
    return res.status(500).json({ success: false, message: "다국어 콘텐츠 처리 중 오류가 발생했습니다." });
  }
  adminRouter.use(errors);
  publicRouter.use(errors);
  return { adminRouter, publicRouter };
}
module.exports = { createContentI18nRouters };
