"use strict";
const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "ReservationMessagePolicy",
  tableName: "RESERVATION_MESSAGE_POLICY_TB",
  columns: {
    ID: { primary: true, type: "number" },
    ENABLED: { type: "number", default: 0 },
    CHANNEL: { type: "varchar2", length: 10, default: "'SMS'" },
    SEND_CREATED: { type: "number", default: 1 },
    SEND_RESCHEDULED: { type: "number", default: 1 },
    SEND_CANCELLED: { type: "number", default: 1 },
    SEND_REMINDER: { type: "number", default: 1 },
    REMINDER_HOURS: { type: "number", default: 24 },
    START_HOUR: { type: "number", default: 9 },
    END_HOUR: { type: "number", default: 20 },
    UPDATED_AT: {
      type: "timestamp",
      updateDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});
