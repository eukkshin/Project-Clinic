"use strict";
const { EntitySchema } = require("typeorm");

// Oracle DETAIL_* tables already exist. synchronize:false; primary IDs come from SEQ_* triggers.
// SQL service uses raw parameterized queries; these schemas are registered for repository use and metadata.
module.exports = new EntitySchema({
  name: "DetailCategory",
  tableName: "DETAIL_CATEGORY",
  columns: {
    CATEGORY_ID: { primary: true, type: "number" },
    SLUG: { type: "varchar2", length: 80 },
    NAME: { type: "varchar2", length: 120 },
    DESCRIPTION: { type: "varchar2", length: 500, nullable: true },
    SORT_ORDER: { type: "number", default: 0 },
    IS_VISIBLE: { type: "char", length: 1, default: "Y" },
    CREATED_AT: { type: "date", default: () => "SYSDATE" },
    UPDATED_AT: { type: "date", default: () => "SYSDATE" },
  },
});
