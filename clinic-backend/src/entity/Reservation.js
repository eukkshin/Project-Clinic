"use strict";
const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "Reservation",
  tableName: "RESERVATION_TB",
  columns: {
    ID: { primary: true, type: Number, generated: "increment" },
    USER_IDX: { type: Number, nullable: true },
    DEPARTMENT: { type: String, length: 100 },
    SCHEDULED_AT: { type: "timestamp" },
    SLOT_DATE: { type: String, length: 10 },
    SLOT_TIME: { type: String, length: 5 },
    STATUS: { type: String, length: 20, default: "예약확정" },
    CREATED_AT: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    MEMO: { type: String, length: 1000, nullable: true },
    CONTACT_NAME: { type: String, length: 80, nullable: true },
    CONTACT_PHONE: { type: String, length: 30, nullable: true },
    SOURCE: { type: String, length: 12, default: "MEMBER" },
  },
});
