"use strict";

const { HttpError } = require("../utils/detail.validation");
const {
  createContentI18nService,
  applyTranslation,
} = require("./content-i18n.service");

// Query strings use Oracle bind placeholders ?, ? ...; never interpolate user input.
function createDetailService(dataSource) {
  if (
    !dataSource ||
    typeof dataSource.query !== "function" ||
    typeof dataSource.transaction !== "function"
  ) {
    throw new Error("TypeORM DataSource 인스턴스가 필요합니다.");
  }
  const i18n = createContentI18nService(dataSource);
  const query = (sql, bind = [], manager = dataSource) =>
    manager.query(sql, bind);
  const first = async (sql, bind = [], manager) =>
    (await query(sql, bind, manager))[0] ?? null;
  const must = (v, entity = "데이터") => {
    if (!v) throw new HttpError(404, `${entity}를 찾을 수 없습니다.`);
    return v;
  };
  // Sequence names are fixed internal constants, never user-supplied SQL identifiers.
  const sequenceTables = {
    SEQ_DETAIL_CATEGORY: ["DETAIL_CATEGORY", "CATEGORY_ID"],
    SEQ_DETAIL_PAGE: ["DETAIL_PAGE", "PAGE_ID"],
    SEQ_DETAIL_SECTION: ["DETAIL_SECTION", "SECTION_ID"],
  };
  const seq = async (name, manager) => {
    const target = sequenceTables[name];
    if (!target) throw new Error("Unsupported detail sequence");
    const row = await first(
      `SELECT COALESCE(MAX(${target[1]}), 0) + 1 AS ID FROM ${target[0]}`,
      [],
      manager,
    );
    return Number(row.ID);
  };
  const clobBind = (content) => content;
  async function clobText(value) {
    if (value == null) return null;
    if (typeof value === "string") return value;
    if (Buffer.isBuffer(value)) return value.toString("utf8");
    if (typeof value.getData === "function")
      return String(await value.getData());
    if (typeof value[Symbol.asyncIterator] === "function") {
      let text = "";
      for await (const chunk of value)
        text += Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
      return text;
    }
    throw new Error(
      "Oracle CLOB을 문자열로 읽을 수 없습니다. Oracle 드라이버 설정을 확인하세요.",
    );
  }
  async function mappedSection(row) {
    const raw = await clobText(row.CONTENT_JSON);
    return {
      id: row.SECTION_KEY,
      sectionId: Number(row.SECTION_ID),
      pageId: Number(row.PAGE_ID),
      type: row.SECTION_TYPE,
      title: row.TITLE,
      eyebrow: row.EYEBROW ?? undefined,
      content: raw ? JSON.parse(raw) : {},
      sortOrder: Number(row.SORT_ORDER),
      isVisible: row.IS_VISIBLE,
    };
  }
  const categorySelect = `SELECT CATEGORY_ID, SLUG, NAME, DESCRIPTION, SORT_ORDER, IS_VISIBLE
    FROM DETAIL_CATEGORY ORDER BY SORT_ORDER, CATEGORY_ID`;
  function mapCategory(r) {
    return {
      categoryId: Number(r.CATEGORY_ID),
      slug: r.SLUG,
      name: r.NAME,
      description: r.DESCRIPTION,
      sortOrder: Number(r.SORT_ORDER),
      isVisible: r.IS_VISIBLE,
    };
  }
  const pageCols = `P.PAGE_ID, P.CATEGORY_ID, C.SLUG AS CATEGORY_SLUG, P.SLUG, P.TITLE,
    P.STATUS, P.SORT_ORDER, P.HERO_EYEBROW, P.HERO_TITLE, P.HERO_DESCRIPTION,
    P.HERO_IMAGE_URL, P.HERO_IMAGE_ALT, P.HERO_IMAGE_POSITION, P.SEO_TITLE, P.SEO_DESCRIPTION,
    P.CREATED_AT, P.UPDATED_AT`;
  const pageFrom = ` FROM DETAIL_PAGE P JOIN DETAIL_CATEGORY C ON P.CATEGORY_ID = C.CATEGORY_ID`;
  function mapPage(r) {
    return {
      pageId: Number(r.PAGE_ID),
      categoryId: Number(r.CATEGORY_ID),
      category: r.CATEGORY_SLUG,
      slug: r.SLUG,
      title: r.TITLE,
      status: r.STATUS,
      sortOrder: Number(r.SORT_ORDER),
      hero: {
        eyebrow: r.HERO_EYEBROW ?? undefined,
        title: r.HERO_TITLE,
        description: r.HERO_DESCRIPTION ?? undefined,
        imageUrl: r.HERO_IMAGE_URL ?? undefined,
        imageAlt: r.HERO_IMAGE_ALT ?? undefined,
        imagePosition: r.HERO_IMAGE_POSITION,
      },
      seo: { title: r.SEO_TITLE, description: r.SEO_DESCRIPTION },
      createdAt: r.CREATED_AT,
      updatedAt: r.UPDATED_AT,
    };
  }
  const sectionCols = `SECTION_ID, PAGE_ID, SECTION_KEY, SECTION_TYPE, TITLE, EYEBROW,
    CONTENT_JSON, SORT_ORDER, IS_VISIBLE`;
  const readSections = async (pageId, onlyVisible = false, manager) => {
    const rows = await query(
      `SELECT ${sectionCols} FROM DETAIL_SECTION WHERE PAGE_ID = ?
      ${onlyVisible ? "AND IS_VISIBLE = 'Y'" : ""} ORDER BY SORT_ORDER, SECTION_ID`,
      [pageId],
      manager,
    );
    return Promise.all(rows.map(mappedSection));
  };
  const existsPage = async (pageId, manager) =>
    must(
      await first(
        `SELECT PAGE_ID FROM DETAIL_PAGE WHERE PAGE_ID = ?`,
        [pageId],
        manager,
      ),
      "상세페이지",
    );
  const existsCategory = async (categoryId, manager) =>
    must(
      await first(
        `SELECT CATEGORY_ID FROM DETAIL_CATEGORY WHERE CATEGORY_ID = ?`,
        [categoryId],
        manager,
      ),
      "카테고리",
    );
  async function getPage(id, manager) {
    const row = must(
      await first(
        `SELECT ${pageCols}${pageFrom} WHERE P.PAGE_ID = ?`,
        [id],
        manager,
      ),
      "상세페이지",
    );
    return {
      ...mapPage(row),
      sections: await readSections(id, false, manager),
    };
  }
  return {
    async publicNavigation(lang = "ko") {
      const rows =
        await query(`SELECT P.PAGE_ID, C.SLUG AS CATEGORY_SLUG, P.SLUG AS PAGE_SLUG, P.TITLE AS PAGE_TITLE
        FROM DETAIL_PAGE P JOIN DETAIL_CATEGORY C ON C.CATEGORY_ID = P.CATEGORY_ID
        WHERE C.IS_VISIBLE = 'Y' AND P.STATUS = 'PUBLISHED'
        ORDER BY C.SORT_ORDER, P.SORT_ORDER, P.PAGE_ID`);
      const translations = await i18n.publishedMany(
        "DETAIL_PAGE",
        rows.map((r) => Number(r.PAGE_ID)),
        lang,
      );
      return rows.map((r) => ({
        category: r.CATEGORY_SLUG,
        slug: r.PAGE_SLUG,
        name: applyTranslation(
          { title: r.PAGE_TITLE },
          "DETAIL_PAGE",
          translations.get(Number(r.PAGE_ID)),
        ).title,
        url: `/${encodeURIComponent(r.CATEGORY_SLUG)}/${encodeURIComponent(r.PAGE_SLUG)}`,
      }));
    },
    async publicCategories(lang = "ko") {
      const rows =
        await query(`SELECT CATEGORY_ID, SLUG, NAME, DESCRIPTION, SORT_ORDER, IS_VISIBLE
        FROM DETAIL_CATEGORY WHERE IS_VISIBLE = 'Y' ORDER BY SORT_ORDER, CATEGORY_ID`);
      const translations = await i18n.publishedMany(
        "DETAIL_CATEGORY",
        rows.map((r) => Number(r.CATEGORY_ID)),
        lang,
      );
      return rows.map((r) => {
        const item = mapCategory(r);
        const translated = applyTranslation(
          { name: item.name, description: item.description },
          "DETAIL_CATEGORY",
          translations.get(item.categoryId),
        );
        return {
          ...item,
          name: translated.name,
          description: translated.description,
        };
      });
    },
    async publicPage(category, slug, lang = "ko") {
      const row = must(
        await first(
          `SELECT ${pageCols}${pageFrom} WHERE C.SLUG = ?
        AND P.SLUG = ? AND C.IS_VISIBLE = 'Y' AND P.STATUS = 'PUBLISHED'`,
          [category, slug],
        ),
        "공개 상세페이지",
      );
      const p = mapPage(row);
      const pagePayloads = await i18n.publishedMany(
        "DETAIL_PAGE",
        [p.pageId],
        lang,
      );
      const flat = applyTranslation(
        {
          title: p.title,
          heroEyebrow: p.hero.eyebrow,
          heroTitle: p.hero.title,
          heroDescription: p.hero.description,
          heroImageAlt: p.hero.imageAlt,
          seoTitle: p.seo.title,
          seoDescription: p.seo.description,
        },
        "DETAIL_PAGE",
        pagePayloads.get(p.pageId),
      );
      const sections = await readSections(p.pageId, true);
      const sectionPayloads = await i18n.publishedMany(
        "DETAIL_SECTION",
        sections.map((s) => s.sectionId),
        lang,
      );
      return {
        category: p.category,
        slug: p.slug,
        title: flat.title,
        hero: {
          ...p.hero,
          eyebrow: flat.heroEyebrow,
          title: flat.heroTitle,
          description: flat.heroDescription,
          imageAlt: flat.heroImageAlt,
        },
        seo: { title: flat.seoTitle, description: flat.seoDescription },
        sections: sections.map((s) => {
          const translated = applyTranslation(
            { title: s.title, eyebrow: s.eyebrow, content: s.content },
            "DETAIL_SECTION",
            sectionPayloads.get(s.sectionId),
          );
          return { id: s.id, type: s.type, ...translated };
        }),
      };
    },
    async categories() {
      return (await query(categorySelect)).map(mapCategory);
    },
    async addCategory(p) {
      return dataSource.transaction(async (m) => {
        const id = await seq("SEQ_DETAIL_CATEGORY", m);
        await query(
          `INSERT INTO DETAIL_CATEGORY
        (CATEGORY_ID, SLUG, NAME, DESCRIPTION, SORT_ORDER, IS_VISIBLE)
        VALUES (?,?,?,?,?,?)`,
          [id, p.slug, p.name, p.description, p.sortOrder, p.isVisible],
          m,
        );
        return { categoryId: id };
      });
    },
    async editCategory(id, p) {
      return dataSource.transaction(async (m) => {
        await existsCategory(id, m);
        await query(
          `UPDATE DETAIL_CATEGORY SET SLUG=?, NAME=?, DESCRIPTION=?,
        SORT_ORDER=?, IS_VISIBLE=? WHERE CATEGORY_ID=?`,
          [p.slug, p.name, p.description, p.sortOrder, p.isVisible, id],
          m,
        );
        return { categoryId: id };
      });
    },
    async deleteCategory(id) {
      return dataSource.transaction(async (m) => {
        await existsCategory(id, m);
        await query(`DELETE FROM DETAIL_CATEGORY WHERE CATEGORY_ID=?`, [id], m);
        return { categoryId: id };
      });
    },
    async reorderCategories(ids) {
      return dataSource.transaction((m) =>
        reorder(m, "DETAIL_CATEGORY", "CATEGORY_ID", null, ids),
      );
    },
    async pages() {
      return (
        await query(`SELECT ${pageCols}${pageFrom}
      ORDER BY C.SORT_ORDER, P.SORT_ORDER, P.PAGE_ID`)
      ).map(mapPage);
    },
    getPage,
    async addPage(p) {
      return dataSource.transaction(async (m) => {
        await existsCategory(p.categoryId, m);
        const id = await seq("SEQ_DETAIL_PAGE", m);
        await query(
          `INSERT INTO DETAIL_PAGE (PAGE_ID, CATEGORY_ID, SLUG, TITLE, STATUS, SORT_ORDER,
        HERO_EYEBROW, HERO_TITLE, HERO_DESCRIPTION, HERO_IMAGE_URL, HERO_IMAGE_ALT,
        HERO_IMAGE_POSITION, SEO_TITLE, SEO_DESCRIPTION)
        VALUES (?,?,?,?,'DRAFT',?,?,?,?,?,?,?,?,?)`,
          [
            id,
            p.categoryId,
            p.slug,
            p.title,
            p.sortOrder,
            p.heroEyebrow,
            p.heroTitle,
            p.heroDescription,
            p.heroImageUrl,
            p.heroImageAlt,
            p.heroImagePosition,
            p.seoTitle,
            p.seoDescription,
          ],
          m,
        );
        return { pageId: id, status: "DRAFT" };
      });
    },
    async editPage(id, p) {
      return dataSource.transaction(async (m) => {
        await existsPage(id, m);
        await existsCategory(p.categoryId, m);
        await query(
          `UPDATE DETAIL_PAGE SET CATEGORY_ID=?, SLUG=?, TITLE=?, SORT_ORDER=?,
        HERO_EYEBROW=?, HERO_TITLE=?, HERO_DESCRIPTION=?, HERO_IMAGE_URL=?,
        HERO_IMAGE_ALT=?, HERO_IMAGE_POSITION=?, SEO_TITLE=?, SEO_DESCRIPTION=?
        WHERE PAGE_ID=?`,
          [
            p.categoryId,
            p.slug,
            p.title,
            p.sortOrder,
            p.heroEyebrow,
            p.heroTitle,
            p.heroDescription,
            p.heroImageUrl,
            p.heroImageAlt,
            p.heroImagePosition,
            p.seoTitle,
            p.seoDescription,
            id,
          ],
          m,
        );
        return { pageId: id };
      });
    },
    async setPageStatus(id, status) {
      return dataSource.transaction(async (m) => {
        await existsPage(id, m);
        await query(
          `UPDATE DETAIL_PAGE SET STATUS=? WHERE PAGE_ID=?`,
          [status, id],
          m,
        );
        return { pageId: id, status };
      });
    },
    async deletePage(id) {
      return dataSource.transaction(async (m) => {
        await existsPage(id, m);
        await query(`DELETE FROM DETAIL_PAGE WHERE PAGE_ID=?`, [id], m);
        return { pageId: id };
      });
    },
    async reorderPages(ids) {
      return dataSource.transaction((m) =>
        reorder(m, "DETAIL_PAGE", "PAGE_ID", null, ids),
      );
    },
    async sections(pageId) {
      await existsPage(pageId);
      return readSections(pageId);
    },
    async addSection(pageId, p) {
      return dataSource.transaction(async (m) => {
        await existsPage(pageId, m);
        const id = await seq("SEQ_DETAIL_SECTION", m);
        await query(
          `INSERT INTO DETAIL_SECTION (SECTION_ID,PAGE_ID,SECTION_KEY,SECTION_TYPE,TITLE,EYEBROW,
        CONTENT_JSON,SORT_ORDER,IS_VISIBLE) VALUES(?,?,?,?,?,?,?,?,?)`,
          [
            id,
            pageId,
            p.key,
            p.type,
            p.title,
            p.eyebrow,
            clobBind(p.contentJson),
            p.sortOrder,
            p.isVisible,
          ],
          m,
        );
        return { sectionId: id, pageId };
      });
    },
    async editSection(id, p) {
      return dataSource.transaction(async (m) => {
        must(
          await first(
            `SELECT SECTION_ID FROM DETAIL_SECTION WHERE SECTION_ID=?`,
            [id],
            m,
          ),
          "섹션",
        );
        await query(
          `UPDATE DETAIL_SECTION SET SECTION_KEY=?,SECTION_TYPE=?,TITLE=?,EYEBROW=?,
        CONTENT_JSON=?,SORT_ORDER=?,IS_VISIBLE=? WHERE SECTION_ID=?`,
          [
            p.key,
            p.type,
            p.title,
            p.eyebrow,
            clobBind(p.contentJson),
            p.sortOrder,
            p.isVisible,
            id,
          ],
          m,
        );
        return { sectionId: id };
      });
    },
    async sectionVisible(id, v) {
      return dataSource.transaction(async (m) => {
        must(
          await first(
            `SELECT SECTION_ID FROM DETAIL_SECTION WHERE SECTION_ID=?`,
            [id],
            m,
          ),
          "섹션",
        );
        await query(
          `UPDATE DETAIL_SECTION SET IS_VISIBLE=? WHERE SECTION_ID=?`,
          [v, id],
          m,
        );
        return { sectionId: id, isVisible: v };
      });
    },
    async deleteSection(id) {
      return dataSource.transaction(async (m) => {
        must(
          await first(
            `SELECT SECTION_ID FROM DETAIL_SECTION WHERE SECTION_ID=?`,
            [id],
            m,
          ),
          "섹션",
        );
        await query(`DELETE FROM DETAIL_SECTION WHERE SECTION_ID=?`, [id], m);
        return { sectionId: id };
      });
    },
    async reorderSections(pageId, ids) {
      return dataSource.transaction(async (m) => {
        await existsPage(pageId, m);
        return reorder(m, "DETAIL_SECTION", "SECTION_ID", pageId, ids);
      });
    },
  };

  // Fixed whitelist of table/column names only, never user-supplied identifier SQL.
  async function reorder(manager, table, pk, pageId, ids) {
    const where = pageId == null ? "" : " WHERE PAGE_ID=?";
    const old = (
      await query(
        `SELECT ${pk} AS ID FROM ${table}${where} ORDER BY SORT_ORDER, ${pk}`,
        pageId == null ? [] : [pageId],
        manager,
      )
    ).map((row) => Number(row.ID));
    if (old.length !== ids.length || old.some((id) => !ids.includes(id))) {
      throw new HttpError(
        400,
        "orderedIds는 현재 목록에 포함된 전체 ID와 정확히 일치해야 합니다.",
      );
    }
    for (let i = 0; i < ids.length; i++) {
      await query(
        `UPDATE ${table} SET SORT_ORDER=? WHERE ${pk}=?${pageId == null ? "" : " AND PAGE_ID=?"}`,
        pageId == null ? [i + 1, ids[i]] : [i + 1, ids[i], pageId],
        manager,
      );
    }
    return { orderedIds: ids };
  }
}
module.exports = { createDetailService };
