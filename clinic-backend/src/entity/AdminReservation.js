
"use strict";

const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "AdminReservation",
  tableName: "ADMIN_RESERVATION_TB",

  columns: {
    RESERVATION_IDX: {
      primary: true,
      type: "number",
      generated: "increment",
    },

    CHART_NO: {
      type: "varchar2",
      length: 20,
      nullable: false,
    },

    TREATMENT_IDX: {
      type: "number",
      nullable: true,
    },

    RESERVATION_DATE: {
      type: "date",
      nullable: false,
    },

    RESERVATION_TIME: {
      type: "varchar2",
      length: 10,
      nullable: false,
    },

    STATUS: {
      type: "varchar2",
      length: 20,
      default: "'RESERVED'",
      nullable: false,
    },

    MEMO: {
      type: "varchar2",
      length: 255,
      nullable: true,
    },

    CREATED_AT: {
      type: "date",
      createDate: true,
      nullable: false,
    },

    UPDATED_AT: {
      type: "date",
      updateDate: true,
      nullable: false,
    },
  },

  relations: {
    member: {
      type: "many-to-one",
      target: "Member",
      joinColumn: {
        name: "CHART_NO",
        referencedColumnName: "CHART_NO",
      },
      onDelete: "CASCADE",
    },

    treatment: {
      type: "many-to-one",
      target: "Treatment",
      joinColumn: {
        name: "TREATMENT_IDX",
        referencedColumnName: "TREATMENT_IDX",
      },
      onDelete: "SET NULL",
      nullable: true,
    },
  },
});
