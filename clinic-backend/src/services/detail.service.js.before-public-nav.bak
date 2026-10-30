"use strict";

const oracledb = require("oracledb");
const { HttpError } = require("../utils/detail.validation");

// Query strings use Oracle bind placeholders :1, :2 ...; never interpolate user input.
function createDetailService(dataSource) {
  if (
    !dataSource ||
    typeof dataSource.query !== "function" ||
    typeof dataSource.transaction !== "function"
  ) {
    throw new Error("TypeORM DataSource 인스턴스가 필요합니다.");
  }
  const query = (sql, bind = [], manager = dataSource) =>
    manager.query(sql, bind);
  const first = async (sql, bind = [], manager) =>
    (await query(sql, bind, manager))[0] ?? null;
  const must = (v, entity = "데이터") => {
    if (!v) throw new HttpError(404, `${entity}를 찾을 수 없습니다.`);
    return v;
  };
  const seq = async (name, manager) =>
    Number(
      (await first(`SELECT ${name}.NEXTVAL AS ID FROM DUAL`, [], manager)).ID,
    );
  const clobBind = (content) => ({
    val: content,
    dir: oracledb.BIND_IN,
    type: oracledb.CLOB,
  });
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
      `SELECT ${sectionCols} FROM DETAIL_SECTION WHERE PAGE_ID = :1
      ${onlyVisible ? "AND IS_VISIBLE = 'Y'" : ""} ORDER BY SORT_ORDER, SECTION_ID`,
      [pageId],
      manager,
    );
    return Promise.all(rows.map(mappedSection));
  };
  const existsPage = async (pageId, manager) =>
    must(
      await first(
        `SELECT PAGE_ID FROM DETAIL_PAGE WHERE PAGE_ID = :1`,
        [pageId],
        manager,
      ),
      "상세페이지",
    );
  const existsCategory = async (categoryId, manager) =>
    must(
      await first(
        `SELECT CATEGORY_ID FROM DETAIL_CATEGORY WHERE CATEGORY_ID = :1`,
        [categoryId],
        manager,
      ),
      "카테고리",
    );
  async function getPage(id, manager) {
    const row = must(
      await first(
        `SELECT ${pageCols}${pageFrom} WHERE P.PAGE_ID = :1`,
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
    async publicCategories() {
      return (
        await query(`SELECT CATEGORY_ID, SLUG, NAME, DESCRIPTION, SORT_ORDER, IS_VISIBLE
      FROM DETAIL_CATEGORY WHERE IS_VISIBLE = 'Y' ORDER BY SORT_ORDER, CATEGORY_ID`)
      ).map(mapCategory);
    },
    async publicPage(category, slug) {
      const row = must(
        await first(
          `SELECT ${pageCols}${pageFrom} WHERE C.SLUG = :1
        AND P.SLUG = :2 AND C.IS_VISIBLE = 'Y' AND P.STATUS = 'PUBLISHED'`,
          [category, slug],
        ),
        "공개 상세페이지",
      );
      const p = mapPage(row);
      return {
        category: p.category,
        slug: p.slug,
        title: p.title,
        hero: p.hero,
        seo: p.seo,
        sections: (await readSections(p.pageId, true)).map(
          ({ id, type, title, eyebrow, content }) => ({
            id,
            type,
            title,
            eyebrow,
            content,
          }),
        ),
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
        VALUES (:1,:2,:3,:4,:5,:6)`,
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
          `UPDATE DETAIL_CATEGORY SET SLUG=:1, NAME=:2, DESCRIPTION=:3,
        SORT_ORDER=:4, IS_VISIBLE=:5 WHERE CATEGORY_ID=:6`,
          [p.slug, p.name, p.description, p.sortOrder, p.isVisible, id],
          m,
        );
        return { categoryId: id };
      });
    },
    async deleteCategory(id) {
      return dataSource.transaction(async (m) => {
        await existsCategory(id, m);
        await query(
          `DELETE FROM DETAIL_CATEGORY WHERE CATEGORY_ID=:1`,
          [id],
          m,
        );
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
        VALUES (:1,:2,:3,:4,'DRAFT',:5,:6,:7,:8,:9,:10,:11,:12,:13)`,
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
          `UPDATE DETAIL_PAGE SET CATEGORY_ID=:1, SLUG=:2, TITLE=:3, SORT_ORDER=:4,
        HERO_EYEBROW=:5, HERO_TITLE=:6, HERO_DESCRIPTION=:7, HERO_IMAGE_URL=:8,
        HERO_IMAGE_ALT=:9, HERO_IMAGE_POSITION=:10, SEO_TITLE=:11, SEO_DESCRIPTION=:12
        WHERE PAGE_ID=:13`,
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
          `UPDATE DETAIL_PAGE SET STATUS=:1 WHERE PAGE_ID=:2`,
          [status, id],
          m,
        );
        return { pageId: id, status };
      });
    },
    async deletePage(id) {
      return dataSource.transaction(async (m) => {
        await existsPage(id, m);
        await query(`DELETE FROM DETAIL_PAGE WHERE PAGE_ID=:1`, [id], m);
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
        CONTENT_JSON,SORT_ORDER,IS_VISIBLE) VALUES(:1,:2,:3,:4,:5,:6,:7,:8,:9)`,
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
            `SELECT SECTION_ID FROM DETAIL_SECTION WHERE SECTION_ID=:1`,
            [id],
            m,
          ),
          "섹션",
        );
        await query(
          `UPDATE DETAIL_SECTION SET SECTION_KEY=:1,SECTION_TYPE=:2,TITLE=:3,EYEBROW=:4,
        CONTENT_JSON=:5,SORT_ORDER=:6,IS_VISIBLE=:7 WHERE SECTION_ID=:8`,
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
            `SELECT SECTION_ID FROM DETAIL_SECTION WHERE SECTION_ID=:1`,
            [id],
            m,
          ),
          "섹션",
        );
        await query(
          `UPDATE DETAIL_SECTION SET IS_VISIBLE=:1 WHERE SECTION_ID=:2`,
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
            `SELECT SECTION_ID FROM DETAIL_SECTION WHERE SECTION_ID=:1`,
            [id],
            m,
          ),
          "섹션",
        );
        await query(`DELETE FROM DETAIL_SECTION WHERE SECTION_ID=:1`, [id], m);
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
    const where = pageId == null ? "" : " WHERE PAGE_ID=:1";
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
        `UPDATE ${table} SET SORT_ORDER=:1 WHERE ${pk}=:2${pageId == null ? "" : " AND PAGE_ID=:3"}`,
        pageId == null ? [i + 1, ids[i]] : [i + 1, ids[i], pageId],
        manager,
      );
    }
    return { orderedIds: ids };
  }
}
module.exports = { createDetailService };
