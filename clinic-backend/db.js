"use strict";
require("dotenv").config();
require("reflect-metadata");

const fs = require("fs");
const path = require("path");
const { DataSource, EntitySchema } = require("typeorm");

// Keep the existing Oracle entity source files unchanged.
const sources = [
  require("./src/entity/Member"),
  require("./src/entity/FooterSettings"),
  require("./src/entity/Consult"),
  require("./src/entity/NavSetting"),
  require("./src/entity/MainVisual"),
  require("./src/entity/ToneSetting"),
  require("./src/entity/Popup"),
  require("./src/entity/PopupSetting"),
  require("./src/entity/Category"),
  require("./src/entity/Safety"),
  require("./src/entity/Selfie"),
  require("./src/entity/EventRanking"),
  require("./src/entity/Vlog"),
  require("./src/entity/Board"),
  require("./src/entity/Qna"),
  require("./src/entity/Reservation"),
  require("./src/entity/Treatment"),
  require("./src/entity/DetailCategory"),
  require("./src/entity/DetailPage"),
  require("./src/entity/DetailSection"),
  require("./src/entity/ReservationBlock"),
  require("./src/entity/AdminReservation"),
  require("./src/entity/AdminNotification"),
  require("./src/entity/ConsultActivity"),
  require("./src/entity/ReservationStatusAudit"),
  require("./src/entity/ReservationReminder"),
  require("./src/entity/ReservationMessage"),
  require("./src/entity/ReservationMessagePolicy"),
];

// Convert Oracle-specific column metadata for a separate SQLite DataSource.
// Cloning avoids mutating the original imported EntitySchema definitions.
const entities = sources.map((schema) => {
  if (!schema?.options?.columns) {
    throw new Error(
      `Invalid EntitySchema: ${schema?.options?.name || "unknown"}`,
    );
  }
  const columns = {};
  for (const [name, definition] of Object.entries(schema.options.columns)) {
    const column = { ...definition };

    switch (String(column.type || "").toLowerCase()) {
      case "char":
      case "nchar":
      case "varchar2":
      case "nvarchar2":
      case "varchar":
        column.type = "varchar";
        break;

      case "number":
        column.type = "integer";
        break;

      case "clob":
      case "nclob":
        column.type = "text";
        break;

      case "timestamp":
      case "date":
        column.type = "datetime";
        break;

      default:
        break;
    }

    if (
      typeof column.default === "function" &&
      /SYSDATE/i.test(String(column.default))
    ) {
      column.default = () => "CURRENT_TIMESTAMP";
    }
    if (typeof column.default === "string" && /^'.*'$/.test(column.default)) {
      column.default = column.default.slice(1, -1);
    }
    columns[name] = column;
  }
  return new EntitySchema({ ...schema.options, columns });
});

const file = path.resolve(process.env.SQLITE_PATH || "./data/clinic.sqlite");
fs.mkdirSync(path.dirname(file), { recursive: true });

const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: file,
  entities,
  // Demo-only: creates missing tables. Never enable for real patient records.
  synchronize: process.env.SQLITE_AUTO_SCHEMA === "true",
  logging: process.env.NODE_ENV !== "production",
});

module.exports = AppDataSource;
