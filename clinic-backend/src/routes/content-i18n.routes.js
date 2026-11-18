"use strict";

const express = require("express");
const {
  TYPES,
  ContentI18nError,
  kind,
  locale,
  id,
  clobText,
  applyTranslation,
  createContentI18nService,
} = require("../services/content-i18n.service");
const { allowOriginForWrite } = require("../auth/adminSession");

function createContentI18nRouters({ dataSource, requireAdmin }) {
  if (typeof requireAdmin !== "function")
    throw new Error("관리자 인증 미들웨어가 필요합니다.");
  const service = createContentI18nService(dataSource);
  const adminRouter = express.Router();
  const publicRouter = express.Router();
  const wrap = (handler) => (req, res, next) =>
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(next);
  const ok = (res, data, status = 200) =>
    res.status(status).json({ success: true, data });

  adminRouter.use(requireAdmin, allowOriginForWrite);
  adminRouter.get("/types", (_req, res) =>
    ok(
      res,
      Object.entries(TYPES).map(([type, cfg]) => ({
        type,
        fields: cfg.fields,
      })),
    ),
  );
  adminRouter.get(
    "/sources/:type",
    wrap(async (req, res) => {
      ok(res, await service.listSources(kind(req.params.type), req.query.q));
    }),
  );
  adminRouter.get(
    "/:type/:id/:locale",
    wrap(async (req, res) => {
      const t = kind(req.params.type);
      const itemId = id(req.params.id);
      const lang = locale(req.params.locale);
      ok(res, await service.getAdmin(t, itemId, lang));
    }),
  );
  adminRouter.put(
    "/:type/:id/:locale",
    wrap(async (req, res) => {
      const t = kind(req.params.type);
      const itemId = id(req.params.id);
      const lang = locale(req.params.locale, { translationOnly: true });
      ok(
        res,
        await service.save(
          t,
          itemId,
          lang,
          req.body?.payload,
          req.body?.status,
          req.admin?.userId,
        ),
      );
    }),
  );
  adminRouter.delete(
    "/:type/:id/:locale",
    wrap(async (req, res) => {
      const t = kind(req.params.type);
      const itemId = id(req.params.id);
      const lang = locale(req.params.locale, { translationOnly: true });
      ok(res, await service.remove(t, itemId, lang));
    }),
  );

  // 익명 방문자에게는 관리 편집 데이터를 공개하지 않고, 게시(PUBLISHED)된 번역만 적용합니다.
  // 기존 프론트 CommunityEntry 정규화에 맞춰 칼럼명을 보존합니다.
  publicRouter.get(
    "/events",
    wrap(async (req, res) => {
      const lang = locale(req.query.locale);
      const rows =
        await dataSource.query(`SELECT EVENT_IDX, TITLE, PRICE, FILE_NAME, SORT_ORDER
      FROM EVENT_RANKING_TB ORDER BY SORT_ORDER, EVENT_IDX`);
      const translations = await service.publishedMany(
        "EVENT",
        rows.map((r) => Number(r.EVENT_IDX)),
        lang,
      );
      const result = rows.map((row) => {
        const id = Number(row.EVENT_IDX);
        const translated = applyTranslation(
          { title: row.TITLE, price: row.PRICE },
          "EVENT",
          translations.get(id),
        );
        return { ...row, TITLE: translated.title, PRICE: translated.price };
      });
      ok(res, result);
    }),
  );
  // Header menus: keep operational links, identifiers and logo fields from DB original.
  publicRouter.get(
    "/nav",
    wrap(async (req, res) => {
      const lang = locale(req.query.locale);
      const rows = await dataSource.query(
        "SELECT ID, LOGO_TYPE, LOGO_TEXT, LOGO_FILE, MENUS FROM NAV_SETTING WHERE ID=1",
      );
      if (!rows.length) return ok(res, {});
      const row = rows[0];
      const raw = await clobText(row.MENUS);
      let menus;
      try {
        menus = raw ? JSON.parse(raw) : [];
      } catch {
        menus = [];
      }
      if (!Array.isArray(menus)) menus = [];
      const published = (
        await service.publishedMany("NAV_SETTING", [1], lang)
      ).get(1);
      const content = published?.content;
      if (content?.menus) {
        try {
          const merged = applyTranslation(
            { content: { menus } },
            "NAV_SETTING",
            published,
          );
          menus = merged.content.menus;
        } catch {
          /* keep original */
        }
      }
      ok(res, {
        ID: row.ID,
        LOGO_TYPE: row.LOGO_TYPE,
        LOGO_TEXT: row.LOGO_TEXT,
        LOGO_FILE: row.LOGO_FILE,
        MENUS: JSON.stringify(menus),
      });
    }),
  );
  // Main hero visual: title-only translation, stable slide identifiers, no media/link changes.
  publicRouter.get(
    "/visual",
    wrap(async (req, res) => {
      const lang = locale(req.query.locale);
      const rows = await dataSource.query(
        "SELECT ID, SLIDES FROM MAIN_VISUAL WHERE ID=1",
      );
      const raw = rows[0] ? await clobText(rows[0].SLIDES) : "[]";
      let slides;
      try {
        slides = JSON.parse(raw || "[]");
      } catch {
        slides = [];
      }
      if (!Array.isArray(slides)) slides = [];
      const translated = (
        await service.publishedMany("MAIN_VISUAL", [1], lang)
      ).get(1);
      const titles = translated?.content?.slides;
      if (titles && typeof titles === "object" && !Array.isArray(titles)) {
        slides = slides.map((slide) => {
          const title = titles[String(slide?.id)]?.title;
          return typeof title === "string" && title.trim()
            ? { ...slide, title }
            : slide;
        });
      }
      ok(res, { SLIDES: JSON.stringify(slides) });
    }),
  );
  // Main category tiles: translate titles only; preserve links/images/order.
  publicRouter.get(
    "/categories",
    wrap(async (req, res) => {
      const lang = locale(req.query.locale);
      const rows =
        await dataSource.query(`SELECT CATEGORY_IDX, TITLE, FILE_NAME, LINK, SORT_ORDER
      FROM CATEGORY_TB ORDER BY SORT_ORDER ASC, CATEGORY_IDX DESC`);
      const translated = await service.publishedMany(
        "CATEGORY",
        rows.map((r) => Number(r.CATEGORY_IDX)),
        lang,
      );
      ok(
        res,
        rows.map((r) => ({
          ...r,
          TITLE: applyTranslation(
            { title: r.TITLE },
            "CATEGORY",
            translated.get(Number(r.CATEGORY_IDX)),
          ).title,
        })),
      );
    }),
  );
  // 공개 VLOG: 번역은 제목에만 적용하며 영상 URL, 이미지 및 정렬 정보는 원본 그대로 반환합니다.
  publicRouter.get(
    "/vlogs",
    wrap(async (req, res) => {
      const lang = locale(req.query.locale);
      const rows =
        await dataSource.query(`SELECT VLOG_IDX, TITLE, VIDEO_URL, FILE_NAME, SORT_ORDER
      FROM VLOG_TB ORDER BY SORT_ORDER ASC, VLOG_IDX DESC`);
      const translations = await service.publishedMany(
        "VLOG",
        rows.map((r) => Number(r.VLOG_IDX)),
        lang,
      );
      ok(
        res,
        rows.map((row) => ({
          ...row,
          TITLE: applyTranslation(
            { title: row.TITLE },
            "VLOG",
            translations.get(Number(row.VLOG_IDX)),
          ).title,
        })),
      );
    }),
  );
  // 공개 Safety: 공개된 제목/설명 번역만 적용합니다. 이미지/정렬은 원본을 사용합니다.
  publicRouter.get(
    "/safety",
    wrap(async (req, res) => {
      const lang = locale(req.query.locale);
      const rows =
        await dataSource.query(`SELECT SAFETY_IDX, TITLE, DESCRIPTION, FILE_NAME, SORT_ORDER
      FROM SAFETY_TB ORDER BY SORT_ORDER ASC, SAFETY_IDX DESC`);
      const translations = await service.publishedMany(
        "SAFETY",
        rows.map((r) => Number(r.SAFETY_IDX)),
        lang,
      );
      const result = rows.map((row) => {
        const translated = applyTranslation(
          { title: row.TITLE, description: row.DESCRIPTION },
          "SAFETY",
          translations.get(Number(row.SAFETY_IDX)),
        );
        return {
          ...row,
          TITLE: translated.title,
          DESCRIPTION: translated.description,
        };
      });
      ok(res, result);
    }),
  );
  // Footer: only published translations. Keep identifiers, URLs, opening hours,
  // phone and other operational data from the original footer entity.
  publicRouter.get(
    "/footer",
    wrap(async (req, res) => {
      const lang = locale(req.query.locale);
      const footer = await dataSource
        .getRepository("FooterSettings")
        .findOne({ where: { id: 1 } });
      if (!footer)
        return ok(res, {
          companyInfo: null,
          schedules: [],
          familySites: [],
          mapAddress: "",
        });
      const translations = await service.publishedMany("FOOTER", [1], lang);
      const translated = applyTranslation(
        await service.original("FOOTER", 1),
        "FOOTER",
        translations.get(1),
      );
      const schedules = Array.isArray(footer.schedules) ? footer.schedules : [];
      const familySites = Array.isArray(footer.familySites)
        ? footer.familySites
        : [];
      const content = translated.content ?? {};
      ok(res, {
        companyInfo: {
          name: translated.name,
          clinicName: translated.clinicName,
          address: translated.address,
          phone: footer.phone,
          email: footer.email,
          locationUrl: footer.locationUrl,
        },
        schedules: schedules.map((item) => {
          const text = content.schedules?.[String(item.id)]?.department;
          return {
            ...item,
            department: text || item.department || item.departments || "",
          };
        }),
        familySites: familySites.map((item) => {
          const text = content.familySites?.[String(item.id)]?.name;
          return { ...item, name: text || item.name };
        }),
        mapAddress: footer.address,
      });
    }),
  );
  publicRouter.get(
    "/faq",
    wrap(async (req, res) => {
      const lang = locale(req.query.locale);
      const rows =
        await dataSource.query(`SELECT QNA_IDX, CATEGORY, CATEGORY_NAME, QUESTION,
      ANSWER, SORT_ORDER, REG_DATE FROM QNA_TB ORDER BY SORT_ORDER, QNA_IDX DESC`);
      const translations = await service.publishedMany(
        "FAQ",
        rows.map((r) => Number(r.QNA_IDX)),
        lang,
      );
      const result = await Promise.all(
        rows.map(async (row) => {
          const id = Number(row.QNA_IDX);
          const answer = await clobText(row.ANSWER);
          const translated = applyTranslation(
            { categoryName: row.CATEGORY_NAME, question: row.QUESTION, answer },
            "FAQ",
            translations.get(id),
          );
          return {
            ...row,
            CATEGORY_NAME: translated.categoryName,
            QUESTION: translated.question,
            ANSWER: translated.answer,
          };
        }),
      );
      ok(res, result);
    }),
  );

  function errors(error, _req, res, next) {
    if (res.headersSent) return next(error);
    if (error instanceof ContentI18nError) {
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
    }
    if (/ORA-00001/.test(`${error.code || ""} ${error.message || ""}`)) {
      return res
        .status(409)
        .json({
          success: false,
          message: "번역 저장 충돌입니다. 다시 시도해 주세요.",
        });
    }
    console.error("[CMS i18n]", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "다국어 콘텐츠 처리 중 오류가 발생했습니다.",
      });
  }
  adminRouter.use(errors);
  publicRouter.use(errors);
  return { adminRouter, publicRouter };
}
module.exports = { createContentI18nRouters };
