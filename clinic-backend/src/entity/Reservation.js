const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Reservation",
  tableName: "RESERVATION_TB",
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
      nullable: true, // 일반 예약일 수도 있으므로 null 허용
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
  // 외래키(FK) 및 관계 설정
  relations: {
    member: {
      type: "many-to-one",
      target: "Member", // Member Entity와 연결
      joinColumn: {
        name: "CHART_NO", // RESERVATION_TB의 컬럼
        referencedColumnName: "CHART_NO", // MEMBER_TB의 참조 컬럼
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