
"use strict";

const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "AdminReservation",
  tableName: "ADMIN_RESERVATION_TB",

  columns: {
    // 예약 고유 번호
    RESERVATION_IDX: {
      primary: true,
      type: "number",
      generated: "increment",
    },

    // 환자 차트 번호
    CHART_NO: {
      type: "varchar2",
      length: 20,
      nullable: false,
    },

    // 연결된 시술권 번호
    TREATMENT_IDX: {
      type: "number",
      nullable: true,
    },

    // 예약 날짜
    RESERVATION_DATE: {
      type: "date",
      nullable: false,
    },

    // 예약 시간
    RESERVATION_TIME: {
      type: "varchar2",
      length: 10,
      nullable: false,
    },

    // 예약 상태
    STATUS: {
      type: "varchar2",
      length: 20,
      default: "'RESERVED'",
      nullable: false,
    },

    // 실제 병원 도착 시간
    ARRIVED_AT: {
      type: "date",
      nullable: true,
    },

    // 실제 상담 시작 시간
    CONSULTING_STARTED_AT: {
      type: "date",
      nullable: true,
    },

    // 실제 시술 시작 시간
    TREATMENT_STARTED_AT: {
      type: "date",
      nullable: true,
    },

    // 실제 시술 완료 시간
    COMPLETED_AT: {
      type: "date",
      nullable: true,
    },

    // 예약 메모
    MEMO: {
      type: "varchar2",
      length: 255,
      nullable: true,
    },

    // 예약 데이터 생성 시간
    CREATED_AT: {
      type: "date",
      createDate: true,
      nullable: false,
    },

    // 예약 데이터 마지막 수정 시간
    UPDATED_AT: {
      type: "date",
      updateDate: true,
      nullable: false,
    },
  },

  relations: {
    // 환자 정보
    member: {
      type: "many-to-one",
      target: "Member",
      joinColumn: {
        name: "CHART_NO",
        referencedColumnName: "CHART_NO",
      },
      onDelete: "CASCADE",
    },

    // 시술권 정보
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
