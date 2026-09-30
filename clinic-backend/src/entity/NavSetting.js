const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "NavSetting",
  tableName: "NAV_SETTING",
  columns: {
    ID: { primary: true, type: "int" },
    LOGO_TYPE: { type: "varchar2", length: 20, default: "'TEXT'" },
    LOGO_TEXT: { type: "varchar2", length: 100, nullable: true },
    LOGO_FILE: { type: "varchar2", length: 255, nullable: true },
    MENUS: { type: "clob", nullable: true },
  },
});
