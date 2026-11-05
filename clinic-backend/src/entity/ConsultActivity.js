"use strict";
const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "ConsultActivity",
  tableName: "CONSULT_ACTIVITY_TB",
  columns: {
    ID: { primary: true, type: "number", generated: "increment" },
    CONSULT_ID: { type: "number", nullable: false },
    KIND: { type: "varchar2", length: 30, nullable: false },
    NOTE_TEXT: { type: "clob", nullable: true },
    ADMIN_USER_ID: { type: "varchar2", length: 50, nullable: false },
    CREATED_AT: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});
