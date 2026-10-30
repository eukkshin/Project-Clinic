
"use strict";

const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "CustomerReservation",
  tableName: "CUSTOMER_RESERVATION_TB",

  columns: {
    ID: {
      primary: true,
      type: "number",
      generated: "increment",
    },

    USER_IDX: {
      type: "number",
      nullable: true,
    },

    DEPARTMENT: {
      type: "varchar2",
      length: 100,
      nullable: false,
    },

    SCHEDULED_AT: {
      type: "timestamp",
      nullable: false,
    },

    SLOT_DATE: {
      type: "varchar2",
      length: 10,
      nullable: false,
    },

    SLOT_TIME: {
      type: "varchar2",
      length: 5,
      nullable: false,
    },

    STATUS: {
      type: "varchar2",
      length: 20,
      default: "'예약확정'",
      nullable: false,
    },

    CREATED_AT: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },

    MEMO: {
      type: "varchar2",
      length: 1000,
      nullable: true,
    },

    CONTACT_NAME: {
      type: "varchar2",
      length: 80,
      nullable: true,
    },

    CONTACT_PHONE: {
      type: "varchar2",
      length: 30,
      nullable: true,
    },

    SOURCE: {
      type: "varchar2",
      length: 12,
      default: "'MEMBER'",
    },
  },
});
