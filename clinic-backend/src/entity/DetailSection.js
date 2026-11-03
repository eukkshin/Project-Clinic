"use strict";
const { EntitySchema } = require("typeorm");

// Oracle DETAIL_* tables already exist. synchronize:false; primary IDs come from SEQ_* triggers.
// SQL service uses raw parameterized queries; these schemas are registered for repository use and metadata.
module.exports = new EntitySchema({
  name: "DetailSection",
  tableName: "DETAIL_SECTION",
  columns: {
    SECTION_ID: { primary: true, type: "number" },
    PAGE_ID: { type: "number" },
    SECTION_KEY: { type: "varchar2", length: 100 },
    SECTION_TYPE: { type: "varchar2", length: 30 },
    TITLE: { type: "varchar2", length: 200 },
    EYEBROW: { type: "varchar2", length: 150, nullable: true },
    CONTENT_JSON: { type: "clob", nullable: true },
    SORT_ORDER: { type: "number", default: 0 },
    IS_VISIBLE: { type: "char", length: 1, default: "Y" },
    CREATED_AT: { type: "date", default: () => "SYSDATE" },
    UPDATED_AT: { type: "date", default: () => "SYSDATE" },
  },
});
