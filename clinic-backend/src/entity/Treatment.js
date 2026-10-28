const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Treatment",
  tableName: "TREATMENT_TB",
  columns: {
    TREATMENT_IDX: {
      primary: true,
      type: "number",
      generated: "increment",
    },
    CHART_NO: {
      type: "varchar2",
      length: 20,
      nullable: false,
    },
    CATEGORY: {
      type: "varchar2",
      length: 30,
      nullable: true,
    },
    TREATMENT_NAME: {
      type: "varchar2",
      length: 100,
      nullable: false,
    },
    TOTAL_COUNT: {
      type: "number",
      nullable: false,
    },
    REMAINING_COUNT: {
      type: "number",
      nullable: false,
    },
    STATUS: {
      type: "varchar2",
      length: 20,
      default: "'ACTIVE'",
      nullable: false,
    },
    PRICE: {
      type: "number",
      nullable: false,
    },
    PAYMENT_METHOD: {
      type: "varchar2",
      length: 20,
      nullable: false,
    },
    EXPIRE_DATE: {
      type: "date",
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
  // 회원(Member)과의 다대일(N:1) 관계 설정
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
  },
});