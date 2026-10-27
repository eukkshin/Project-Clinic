"use strict";

const express = require("express");
const { createDetailService } = require("../services/detail.service");
const V = require("../utils/detail.validation");
const { allowOriginForWrite } = require("../auth/adminSession");

/**
 * Factory pattern: reuse existing TypeORM DataSource and the existing authenticated admin guard.
 * NEVER call this factory without a real administrator authorization middleware.
 */
function createDetailRouters({ dataSource, requireAdmin }) {
  if (typeof requireAdmin !== "function") {
    throw new Error(
      "requireAdmin 관리자 권한 검사 미들웨어가 반드시 필요합니다.",
    );
  }
  const service = createDetailService(dataSource);
  const publicRouter = express.Router();
  const adminRouter = express.Router();
  adminRouter.use(requireAdmin);
  adminRouter.use(allowOriginForWrite);
  const wrap = (handler) => (req, res, next) =>
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(next);
  const ok = (res, data, code = 200) =>
    res.status(code).json({ success: true, data });
  const paramId = (req) => V.id(req.params.id);

  // Visitor endpoints (never expose drafts/hidden pages or sections)
  publicRouter.get(
    "/categories",
    wrap(async (_req, res) => ok(res, await service.publicCategories())),
  );
  publicRouter.get(
    "/:category/:slug",
    wrap(async (req, res) => {
      const category = V.slug(req.params.category, "category", 80);
      const slug = V.slug(req.params.slug, "slug", 120);
      return ok(res, await service.publicPage(category, slug));
    }),
  );

  // Categories
  adminRouter.get(
    "/categories",
    wrap(async (_req, res) => ok(res, await service.categories())),
  );
  adminRouter.post(
    "/categories",
    wrap(async (req, res) =>
      ok(res, await service.addCategory(V.category(req.body)), 201),
    ),
  );
  adminRouter.put(
    "/categories/order",
    wrap(async (req, res) =>
      ok(res, await service.reorderCategories(V.orderedIds(req.body))),
    ),
  );
  adminRouter.put(
    "/categories/:id",
    wrap(async (req, res) =>
      ok(res, await service.editCategory(paramId(req), V.category(req.body))),
    ),
  );
  adminRouter.delete(
    "/categories/:id",
    wrap(async (req, res) =>
      ok(res, await service.deleteCategory(paramId(req))),
    ),
  );

  // Pages
  adminRouter.get(
    "/pages",
    wrap(async (_req, res) => ok(res, await service.pages())),
  );
  adminRouter.post(
    "/pages",
    wrap(async (req, res) =>
      ok(res, await service.addPage(V.page(req.body)), 201),
    ),
  );
  adminRouter.put(
    "/pages/order",
    wrap(async (req, res) =>
      ok(res, await service.reorderPages(V.orderedIds(req.body))),
    ),
  );
  adminRouter.get(
    "/pages/:id",
    wrap(async (req, res) => ok(res, await service.getPage(paramId(req)))),
  );
  adminRouter.put(
    "/pages/:id",
    wrap(async (req, res) =>
      ok(res, await service.editPage(paramId(req), V.page(req.body))),
    ),
  );
  adminRouter.patch(
    "/pages/:id/status",
    wrap(async (req, res) => {
      const status = V.enumerated(
        req.body?.status,
        ["DRAFT", "PUBLISHED", "HIDDEN"],
        "status",
      );
      return ok(res, await service.setPageStatus(paramId(req), status));
    }),
  );
  adminRouter.delete(
    "/pages/:id",
    wrap(async (req, res) => ok(res, await service.deletePage(paramId(req)))),
  );

  // Sections
  adminRouter.get(
    "/pages/:id/sections",
    wrap(async (req, res) => ok(res, await service.sections(paramId(req)))),
  );
  adminRouter.post(
    "/pages/:id/sections",
    wrap(async (req, res) =>
      ok(res, await service.addSection(paramId(req), V.section(req.body)), 201),
    ),
  );
  adminRouter.put(
    "/pages/:id/sections/order",
    wrap(async (req, res) =>
      ok(
        res,
        await service.reorderSections(paramId(req), V.orderedIds(req.body)),
      ),
    ),
  );
  adminRouter.put(
    "/sections/:id",
    wrap(async (req, res) =>
      ok(res, await service.editSection(paramId(req), V.section(req.body))),
    ),
  );
  adminRouter.patch(
    "/sections/:id/visibility",
    wrap(async (req, res) =>
      ok(
        res,
        await service.sectionVisible(
          paramId(req),
          V.yesNo(req.body?.isVisible, "isVisible", null),
        ),
      ),
    ),
  );
  adminRouter.delete(
    "/sections/:id",
    wrap(async (req, res) =>
      ok(res, await service.deleteSection(paramId(req))),
    ),
  );

  // Scoped error handling. Existing global error middleware can still handle unrelated routes.
  const errors = (error, _req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof V.HttpError)
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
    const ora = `${error.code || ""} ${error.message || ""}`;
    if (/ORA-00001/.test(ora))
      return res
        .status(409)
        .json({
          success: false,
          message: "동일한 slug 또는 섹션 키가 이미 존재합니다.",
        });
    if (/ORA-02292/.test(ora))
      return res
        .status(409)
        .json({
          success: false,
          message: "연결된 상세페이지가 있어 카테고리를 삭제할 수 없습니다.",
        });
    if (/ORA-02291/.test(ora))
      return res
        .status(400)
        .json({
          success: false,
          message: "존재하지 않는 상위 항목을 참조했습니다.",
        });
    if (/ORA-12899|ORA-01400|ORA-02290/.test(ora))
      return res
        .status(400)
        .json({
          success: false,
          message: "입력 필드의 형식이나 길이가 DB 제약조건과 맞지 않습니다.",
        });
    console.error("[Detail CMS]", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "상세페이지 처리 중 서버 오류가 발생했습니다.",
      });
  };
  publicRouter.use(errors);
  adminRouter.use(errors);
  return { publicRouter, adminRouter };
}
module.exports = { createDetailRouters };
