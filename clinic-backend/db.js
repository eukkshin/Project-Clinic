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
const DetailCategory = require("./src/entity/DetailCategory");
const DetailPage = require("./src/entity/DetailPage");
const DetailSection = require("./src/entity/DetailSection");
const ReservationBlock = require("./src/entity/ReservationBlock");
const AdminReservation = require("./src/entity/AdminReservation");
const AdminNotification = require("./src/entity/AdminNotification");
const ConsultActivity = require("./src/entity/ConsultActivity");
const ReservationStatusAudit = require("./src/entity/ReservationStatusAudit");
const ReservationReminder = require("./src/entity/ReservationReminder");
const ReservationMessage = require("./src/entity/ReservationMessage");
const ReservationMessagePolicy = require("./src/entity/ReservationMessagePolicy");

const AppDataSource = new DataSource({
  type: "mysql",

  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),

  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "plastic_db",

  charset: "utf8mb4",

  synchronize: false,
  logging: process.env.NODE_ENV !== "production",

  poolSize: 10,

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
    DetailCategory,
    DetailPage,
    DetailSection,
    ReservationBlock,
    AdminReservation,
    AdminNotification,
    ConsultActivity,
    ReservationStatusAudit,
    ReservationReminder,
    ReservationMessage,
    ReservationMessagePolicy,
  ],
});

module.exports = AppDataSource;
