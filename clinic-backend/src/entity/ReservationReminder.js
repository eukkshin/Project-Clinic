"use strict";
const { EntitySchema } = require("typeorm");

// 예약당 하나의 리마인더 레코드. 일정 변경 시 같은 레코드를 갱신해
// 기존 일정으로 잘못 안내가 나가는 것을 방지합니다.
module.exports = new EntitySchema({
  name: "ReservationReminder",
  tableName: "RESERVATION_REMINDER_TB",
  columns: {
    ID: { primary: true, type: "number", generated: "increment" },
    RESERVATION_ID: { type: "number", nullable: false, unique: true },
    SLOT_KEY: { type: "varchar2", length: 16, nullable: false },
    DUE_AT_KST: { type: "varchar2", length: 16, nullable: false },
    STATE: {
      type: "varchar2",
      length: 20,
      nullable: false,
      default: "'PENDING'",
    },
    READY_AT: { type: "timestamp", nullable: true },
    CONTACTED_AT: { type: "timestamp", nullable: true },
    CONTACTED_BY: { type: "varchar2", length: 50, nullable: true },
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
