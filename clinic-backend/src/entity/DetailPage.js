"use strict";
const { EntitySchema } = require("typeorm");

// Oracle DETAIL_* tables already exist. synchronize:false; primary IDs come from SEQ_* triggers.
// SQL service uses raw parameterized queries; these schemas are registered for repository use and metadata.
module.exports = new EntitySchema({
  name: "DetailPage",
  tableName: "DETAIL_PAGE",
  columns: {
    PAGE_ID: { primary: true, type: "number" },
    CATEGORY_ID: { type: "number" },
    SLUG: { type: "varchar2", length: 120 },
    TITLE: { type: "varchar2", length: 200 },
    STATUS: { type: "varchar2", length: 20, default: "DRAFT" },
    SORT_ORDER: { type: "number", default: 0 },
    HERO_EYEBROW: { type: "varchar2", length: 180, nullable: true },
    HERO_TITLE: { type: "varchar2", length: 300 },
    HERO_DESCRIPTION: { type: "varchar2", length: 900, nullable: true },
    HERO_IMAGE_URL: { type: "varchar2", length: 1000, nullable: true },
    HERO_IMAGE_ALT: { type: "varchar2", length: 300, nullable: true },
    HERO_IMAGE_POSITION: { type: "varchar2", length: 60, default: "center" },
    SEO_TITLE: { type: "varchar2", length: 200, nullable: true },
    SEO_DESCRIPTION: { type: "varchar2", length: 500, nullable: true },
    CREATED_AT: { type: "date", default: () => "SYSDATE" },
    UPDATED_AT: { type: "date", default: () => "SYSDATE" },
  },
});
