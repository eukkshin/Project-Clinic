const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Member",
  tableName: "MEMBER_TB",
  columns: {
    USER_IDX: {
      primary: true,
      type: "number",
      generated: "increment",
    },
    // 병원 환자 식별을 위한 차트 번호
    CHART_NO: {
      type: "varchar2",
      length: 20,
      unique: true,
      nullable: true, // 비회원 예약이나 현장 접수 후 가입하는 경우를 대비해 처음엔 null 허용 가능
    },
    USER_NAME: {
      type: "varchar2",
      length: 50,
      nullable: false,
    },
    USER_ID: {
      type: "varchar2",
      length: 50,
      unique: true,
      nullable: false,
    },
    USER_PW: {
      type: "varchar2",
      length: 100,
      nullable: false,
    },
    EMAIL: {
      type: "varchar2",
      length: 100,
      nullable: false,
    },
    IS_MAIL_AGREED: {
      type: "char",
      length: 1,
      default: "N",
      nullable: false,
    },
    PHONE: {
      type: "varchar2",
      length: 20,
      nullable: false,
    },
    RESIDENT_NUM: {
      type: "varchar2",
      length: 255,
      nullable: false,
    },
    ZIPCODE: {
      type: "varchar2",
      length: 10,
      nullable: true, //우편번호는 (다음주소 API연동용)
    },
    ADDRESS1: {
      type: "varchar2",
      length: 200,
      nullable: true,
    },
    ADDRESS2: {
      type: "varchar2",
      length: 200,
      nullable: true,
    },
    IS_SNS_AGREED: {
      type: "char",
      length: 1,
      default: "N",
      nullable: false,
    },
    GENDER: {
      type: "varchar2",
      length: 10,
      nullable: true,
    },
    IS_ADMIN: {
      type: "number",
      default: 0,
      nullable: false,
    },
    REG_DATE: {
      type: "date",
      createDate: true,
    },
    STATUS: {
      type: "varchar2",
      length: 20,
      default: "'정상'",
    },
  },
});
