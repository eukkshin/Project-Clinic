const jwt = require("jsonwebtoken");
const AppDataSource = require("../../db");
const Member = require("../entity/Member");

// 반드시 로그인 성공 시 설정한 쿠키 이름과 일치시켜 주세요.
const COOKIE_NAME = "clinic_session";
const JWT_ISSUER = "ahns-clinic";
const JWT_AUDIENCE = "ahns-web";

async function authenticateMember(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "로그인이 필요합니다." });
  }

  let payload;
  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET 미설정");
    payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
  } catch (error) {
    if (error.message === "JWT_SECRET 미설정") {
      console.error("JWT_SECRET 환경변수가 필요합니다.");
      return res
        .status(500)
        .json({ success: false, message: "인증 설정 오류입니다." });
    }
    return res
      .status(401)
      .json({ success: false, message: "로그인 세션이 유효하지 않습니다." });
  }

  const userIdx = Number(payload?.sub);
  if (!Number.isSafeInteger(userIdx) || userIdx <= 0) {
    return res
      .status(401)
      .json({ success: false, message: "잘못된 회원 정보입니다." });
  }

  try {
    const memberRepo = AppDataSource.getRepository(Member);
    // 민감정보(USER_PW, RESIDENT_NUM, 주소 등)는 가져오지 않습니다.
    const member = await memberRepo.findOne({
      where: { USER_IDX: userIdx },
      select: {
        USER_IDX: true,
        USER_ID: true,
        USER_NAME: true,
        EMAIL: true,
        PHONE: true,
        REG_DATE: true,
        STATUS: true,
        IS_ADMIN: true,
      },
    });

    if (!member) {
      return res
        .status(401)
        .json({ success: false, message: "회원 정보를 찾을 수 없습니다." });
    }
    if (member.STATUS !== "정상") {
      return res
        .status(403)
        .json({ success: false, message: "이용할 수 없는 계정입니다." });
    }

    req.user = { userIdx: member.USER_IDX, userId: member.USER_ID };
    req.member = member;
    return next();
  } catch (error) {
    console.error("회원 인증 오류:", error);
    return res.status(500).json({
      success: false,
      message: "회원 인증 중 서버 오류가 발생했습니다.",
    });
  }
}

module.exports = { authenticateMember, COOKIE_NAME, JWT_ISSUER, JWT_AUDIENCE };
