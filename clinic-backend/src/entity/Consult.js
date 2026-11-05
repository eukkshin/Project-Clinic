const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Consult",
  tableName: "CONSULT",
  columns: {
    ID: { primary: true, type: "int", generated: true },
    RECEIPT_NO: { type: "varchar2", length: 40, nullable: true, unique: true },
    LOOKUP_HASH: { type: "varchar2", length: 64, nullable: true },
    ANSWER_TEXT: { type: "clob", nullable: true },
    ANSWERED_AT: { type: "timestamp", nullable: true },
    ASSIGNED_TO: { type: "varchar2", length: 50, nullable: true },
    NAME: { type: "varchar2", length: 50, nullable: false },
    PHONE: { type: "varchar2", length: 20, nullable: false },
    PASSWORD: { type: "varchar2", length: 255, nullable: false },
    USER_ID: { type: "varchar2", length: 50, nullable: false },
    DEPARTMENT: { type: "varchar2", length: 50, nullable: false },
    TITLE: { type: "varchar2", length: 200, nullable: false },
    CONTENT: { type: "clob", nullable: false },
    STATUS: { type: "varchar2", length: 20, default: "'대기중'" },
    CREATED_AT: { type: "timestamp", createDate: true },
  },
});
