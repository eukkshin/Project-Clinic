require("dotenv").config();
require("reflect-metadata");

const { DataSource } = require("typeorm");

// 회원 및 기본 설정
const Member = require("./src/entity/Member");
const FooterSettings = require("./src/entity/FooterSettings");
const Consult = require("./src/entity/Consult");
const NavSetting = require("./src/entity/NavSetting");
const MainVisual = require("./src/entity/MainVisual");
const ToneSetting = require("./src/entity/ToneSetting");

// 콘텐츠 관리
const Popup = require("./src/entity/Popup");
const PopupSetting = require("./src/entity/PopupSetting");
const Category = require("./src/entity/Category");
const Safety = require("./src/entity/Safety");
const Selfie = require("./src/entity/Selfie");
const EventRanking = require("./src/entity/EventRanking");
const Vlog = require("./src/entity/Vlog");
const Board = require("./src/entity/Board");
const Qna = require("./src/entity/Qna");

// 예약 및 시술
const Reservation = require("./src/entity/Reservation");
const Treatment = require("./src/entity/Treatment");
const DetailCategory = require("./src/entity/DetailCategory");
const DetailPage = require("./src/entity/DetailPage");
const DetailSection = require("./src/entity/DetailSection");
const ReservationBlock = require("./src/entity/ReservationBlock");
const AdminReservation = require("./src/entity/AdminReservation");

// 알림 및 기록
const AdminNotification = require("./src/entity/AdminNotification");
const ConsultActivity = require("./src/entity/ConsultActivity");
const ReservationStatusAudit = require("./src/entity/ReservationStatusAudit");
const ReservationReminder = require("./src/entity/ReservationReminder");
const ReservationMessage = require("./src/entity/ReservationMessage");
const ReservationMessagePolicy = require("./src/entity/ReservationMessagePolicy");

// OracleDB 연결 설정
const AppDataSource = new DataSource({
  type: "oracle",

  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING,

  // 운영 DB 스키마 자동 수정 방지
  synchronize: false,

  // 개발 환경에서만 SQL 로깅
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

  // OracleDB 연결 풀 설정
  extra: {
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 1,
  },
});

module.exports = AppDataSource;
