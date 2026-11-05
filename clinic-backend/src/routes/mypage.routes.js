const express = require("express");
const AppDataSource = require("../../db");
const Consult = require("../entity/Consult");
const Reservation = require("../entity/Reservation");
const ReservationReminder = require("../entity/ReservationReminder");
const { In } = require("typeorm");
const { authenticateMember } = require("../middleware/authenticateMember");

const router = express.Router();

// 모든 /api/mypage/* 요청 전에 인증 + 계정 상태를 검증합니다.
router.use(authenticateMember);

const iso = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

// GET /api/mypage/me
router.get("/me", (req, res) => {
  const member = req.member;
  return res.json({
    success: true,
    data: {
      userId: member.USER_ID,
      name: member.USER_NAME,
      email: member.EMAIL || null,
      phone: member.PHONE || null,
      joinedAt: iso(member.REG_DATE),
    },
  });
});

// GET /api/mypage/consultations
router.get("/consultations", async (req, res) => {
  try {
    const rows = await AppDataSource.getRepository(Consult).find({
      select: {
        ID: true,
        TITLE: true,
        DEPARTMENT: true,
        CONTENT: true,
        STATUS: true,
        CREATED_AT: true,
      },
      where: { USER_ID: req.user.userId },
      order: { CREATED_AT: "DESC" },
      take: 100,
    });

    const data = rows.map((row) => ({
      id: row.ID,
      title: row.TITLE,
      department: row.DEPARTMENT ?? null,
      status: ["대기중", "상담중", "상담완료"].includes(row.STATUS)
        ? row.STATUS
        : "대기중",
      createdAt: iso(row.CREATED_AT),
      content: row.CONTENT ?? "",
      // 기존 CONSULT 테이블에 답변 컬럼이 없어 null로 전달합니다.
      response: null,
    }));

    return res.json({ success: true, data });
  } catch (error) {
    console.error("내 상담 내역 조회 오류:", error);
    return res
      .status(500)
      .json({ success: false, message: "상담 내역을 불러오지 못했습니다." });
  }
});

// GET /api/mypage/reservations
// 주의: sql/01_reservation_tb.sql 실행 + db.js Entity 등록 후 사용 가능합니다.
// GET /api/mypage/reservations
router.get("/reservations", async (req, res) => {
  try {
    const userIdx = Number(req.user?.userIdx);

    if (!Number.isSafeInteger(userIdx) || userIdx <= 0) {
      return res.status(401).json({
        success: false,
        message: "로그인이 필요합니다.",
      });
    }

    const reservationRepository = AppDataSource.getRepository(Reservation);

    const rows = await reservationRepository.find({
      where: {
        USER_IDX: userIdx,
      },
      select: {
        ID: true,
        DEPARTMENT: true,
        SCHEDULED_AT: true,
        STATUS: true,
        CREATED_AT: true,
        MEMO: true,
        SLOT_DATE: true,
        SLOT_TIME: true,
        VISIT_CONFIRMED_AT: true,
      },
      order: {
        SCHEDULED_AT: "DESC",
      },
      take: 100,
    });

    const reminders = rows.length
      ? await AppDataSource.getRepository(ReservationReminder).find({
          where: { RESERVATION_ID: In(rows.map((r) => r.ID)) },
        })
      : [];
    const reminderMap = new Map(
      reminders.map((r) => [Number(r.RESERVATION_ID), r]),
    );
    const data = rows.map((row) => ({
      id: row.ID,
      department: row.DEPARTMENT,
      scheduledAt: iso(row.SCHEDULED_AT),
      status: row.STATUS,
      createdAt: iso(row.CREATED_AT),
      memo: row.MEMO ?? null,
      slotDate: row.SLOT_DATE,
      slotTime: row.SLOT_TIME,
      visitConfirmedAt: iso(row.VISIT_CONFIRMED_AT),
      reminderState: reminderMap.get(Number(row.ID))?.STATE || null,
      reminderDueAtKst: reminderMap.get(Number(row.ID))?.DUE_AT_KST || null,
    }));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("내 예약 내역 조회 오류:", error);

    return res.status(500).json({
      success: false,
      message: "예약 내역을 불러오지 못했습니다.",
    });
  }
});

module.exports = router;
