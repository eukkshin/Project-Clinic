const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "ToneSetting",
  tableName: "TONE_SETTING",
  columns: {
    ID: { primary: true, type: "number" },
    PRIMARY_TONE: { type: "varchar2", length: 20, default: "'BLUE'" },
    IS_DARKMODE: { type: "char", length: 1, default: "'N'" },
  },
});
