"use strict";
const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "AdminNotification",
  tableName: "ADMIN_NOTIFICATION_TB",
  columns: {
    ID: { primary: true, type: "number", generated: "increment" },
    CATEGORY: { type: "varchar2", length: 30, nullable: false },
    REFERENCE_ID: { type: "number", nullable: false },
    MESSAGE: { type: "varchar2", length: 200, nullable: false },
    IS_READ: { type: "number", default: 0, nullable: false },
    CREATED_AT: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});
