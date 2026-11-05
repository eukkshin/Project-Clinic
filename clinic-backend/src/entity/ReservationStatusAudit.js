"use strict";
const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "ReservationStatusAudit",
  tableName: "RESERVATION_STATUS_AUDIT_TB",
  columns: {
    ID: { primary: true, type: "number", generated: "increment" },
    RESERVATION_ID: { type: "number", nullable: false },
    PREVIOUS_STATUS: { type: "varchar2", length: 20, nullable: false },
    NEXT_STATUS: { type: "varchar2", length: 20, nullable: false },
    REASON: { type: "varchar2", length: 500, nullable: false },
    ADMIN_USER_ID: { type: "varchar2", length: 50, nullable: false },
    CREATED_AT: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});
