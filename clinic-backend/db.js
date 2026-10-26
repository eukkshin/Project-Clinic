require("dotenv").config();
require("reflect-metadata");
const { DataSource } = require("typeorm");
const Member = require("./src/entity/Member");
const FooterSettings = require("./src/entity/FooterSettings");
const Consult = require("./src/entity/Consult");
const NavSetting = require("./src/entity/NavSetting");
const MainVisual = require("./src/entity/MainVisual");
const ToneSetting = require("./src/entity/ToneSetting");
const Popup = require("./src/entity/Popup");
const PopupSetting = require("./src/entity/PopupSetting");
const Category = require("./src/entity/Category");
const Safety = require("./src/entity/Safety");
const Selfie = require("./src/entity/Selfie");
const EventRanking = require("./src/entity/EventRanking");
const Vlog = require("./src/entity/Vlog");
const Board = require("./src/entity/Board");
const Qna = require("./src/entity/Qna");
const Reservation = require("./src/entity/Reservation");
const Treatment = require("./src/entity/Treatment");

const AppDataSource = new DataSource({
  type: "oracle",
  host: "localhost",
  port: 1521,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING,
  database: "XEPDB1",
  synchronize: false,
  //로깅 최적화 (운영환경이 아닐때만 true)
  logging: process.env.NODE_ENV !== "production",
  entities: [
    Member,
    FooterSettings,
    Consult,
    NavSetting,
    MainVisual,
    ToneSetting,
    Popup,
    PopupSetting,
    Category,
    Safety,
    Selfie,
    EventRanking,
    Vlog,
    Board,
    Qna,
    Reservation,
    Treatment,
  ],
  extra: {
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 1,
  },
});

module.exports = AppDataSource;
