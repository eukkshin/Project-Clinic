"use strict";
const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "ReservationMessage",
  tableName: "RESERVATION_MESSAGE_TB",
  columns: {
    ID: { primary: true, type: "number", generated: "increment" },
    RESERVATION_ID: { type: "number", nullable: false },
    EVENT_TYPE: { type: "varchar2", length: 20 },
    SLOT_KEY: { type: "varchar2", length: 16 },
    DEDUPE_KEY: { type: "varchar2", length: 120, unique: true },
    DUE_AT_KST: { type: "varchar2", length: 16 },
    CHANNEL: { type: "varchar2", length: 10 },
    STATE: { type: "varchar2", length: 20, default: "'QUEUED'" },
    ATTEMPTS: { type: "number", default: 0 },
    LAST_ERROR: { type: "varchar2", length: 400, nullable: true },
    PROVIDER_REF: { type: "varchar2", length: 100, nullable: true },
    ACCEPTED_AT: { type: "timestamp", nullable: true },
    CREATED_AT: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    UPDATED_AT: {
      type: "timestamp",
      updateDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});
