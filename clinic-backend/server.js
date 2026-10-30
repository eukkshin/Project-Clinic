require("dotenv").config();
const { Like, TreeRepository } = require("typeorm");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const AppDataSource = require("./db");
const {
  createPasswordRecoveryRouter,
} = require("./src/routes/password-recovery.routes");

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



const { createAdminSession } = require("./src/auth/adminSession");
const { createDetailRouters } = require("./src/routes/detail.routes");
const { createDetailImageRouter } = require("./src/routes/detail-image.routes");

const nodemailer = require("nodemailer");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {
  COOKIE_NAME,
  JWT_ISSUER,
  JWT_AUDIENCE,
} = require("./src/middleware/authenticateMember");
const mypageRouter = require("./src/routes/mypage.routes");
const {
  router: reservationRouter,
} = require("./src/routes/reservations.routes");

const {
  createAdminReservationRouter,
} = require("./src/routes/admin-reservations.routes");

// 1. CORS 설정 (프론트엔드 3000번 포트의 접근만 안전하게 허용)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
// 비밀번호 재설정 API
app.use("/api", createPasswordRecoveryRouter({ AppDataSource }));

app.use("/images", express.static(path.join(__dirname, "public/images")));
const uploadDir = path.join(__dirname, "public/images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage: storage });

app.post("/api/admin/upload", upload.single("logoImage"), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "이미지 업로드 실패" });
  }
  res.status(200).json({
    success: true,
    fileName: req.file.filename,
    message: "이미지 업로드 성공",
  });
});

// 2. TypeORM 오라클 DB 연결
AppDataSource.initialize()
  .then(() => {
    console.log("✅ 오라클 DB가 성공적으로 연결되었습니다.");
  })
  .catch((error) => {
    console.error("❌ DB 연결 실패:", error);
  });

// 3. 헬스 체크 API (서버 상태 확인용)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "성형외과 백엔드 서버가 정상 작동 중입니다.",
  });
});

// 4. 회원가입 API
app.post("/api/register", async (req, res) => {
  try {
    // 프론트엔드에서 보낸 데이터 분해
    const {
      userName,
      userId,
      userPw,
      email,
      isMailAgreed,
      phone,
      isSnsAgreed,
      gender,
      residentNum,
      zipcode,
      address1,
      address2,
    } = req.body;

    // 🎯 [추가됨] 필수값 검증 로직: 하나라도 없으면 DB까지 안 가고 서버에서 바로 차단
    if (!userName || !userId || !userPw || !email || !phone || !residentNum) {
      return res.status(400).json({
        success: false,
        message:
          "필수 입력값이 누락되었습니다. (이름, 아이디, 비밀번호, 이메일, 휴대폰번호, 주민등록번호)",
      });
    }

    // 비밀번호 암호화 (소금 뿌리기)
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(userPw, salt);

    // DB 저장을 위한 레포지토리 가져오기
    const memberRepository = AppDataSource.getRepository(Member);

    // 💡 회원가입 시점에 고유 차트번호(CHART_NO) 자동 생성
    // 예시: 'C' + 연월일 + 랜덤숫자 또는 타임스탬프 뒷자리 조합 (예: C202610261234)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4자리 랜덤 숫자
    const generatedChartNo = `C${year}${month}${day}-${randomNum}`;

    // DB 컬럼에 맞게 데이터 조립 (IS_ADMIN은 DB 기본값 0으로 자동 세팅됨)
    const newMember = {
      CHART_NO: generatedChartNo, //chartNo 추가
      USER_NAME: userName,
      USER_ID: userId,
      USER_PW: hashedPw,
      EMAIL: email,
      IS_MAIL_AGREED: isMailAgreed ? "Y" : "N", // 💡 DB에 IS_MAIL_AGREED 컬럼 필수!
      PHONE: phone,
      IS_SNS_AGREED: isSnsAgreed ? "Y" : "N",
      GENDER: gender,
      RESIDENT_NUM: residentNum,
      ZIPCODE: zipcode,
      ADDRESS1: address1,
      ADDRESS2: address2,
    };

    // DB에 저장 실행
    await memberRepository.save(newMember);

    // 성공 응답
    res
      .status(201)
      .json({ success: true, message: "회원가입이 완료되었습니다." });
  } catch (error) {
    // 🎯 오라클 UNIQUE 제약조건 위배 에러 (아이디 중복 처리)
    if (error.message && error.message.includes("ORA-00001")) {
      console.error("회원가입 에러: 중복된 아이디입니다.");
      return res
        .status(409)
        .json({ success: false, message: "이미 사용 중인 아이디입니다." });
    }

    // 그 외 서버 에러 처리
    console.error("회원가입 에러:", error);
    res.status(500).json({
      success: false,
      message: "회원가입 중 서버 오류가 발생했습니다.",
    });
  }
});

//로그인 api 코드 추가하기
app.post("/api/login", async (req, res) => {
  try {
    // 프론트 앤드에서 보낸 아이디와 비밀번호 받기
    const { userId, userPw } = req.body;
    // 비워진 것에 대한 방어
    if (!userId || !userPw) {
      return res.status(400).json({
        success: false,
        message: "아이디와 패스워드를 모두 입력해 주세요",
      });
    }

    //db 리파지토리 가져오기
    const memberRepository = AppDataSource.getRepository(Member);

    //db에서 해당 아이디를 가진 회원 찾기
    const user = await memberRepository.findOne({
      where: { USER_ID: userId },
    });

    //가입된 아이디가 없는 경우
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "존재하지 않는 아이디입니다",
      });
    }
    //비밀번호 검증(프론트에서 온 평문 비밀번호 vs DB의 암호화된 비밀번호)
    const isMatch = await bcrypt.compare(userPw, user.USER_PW);

    //비밀번호가 틀린경우
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "비밀번호가 일치하지 않습니다",
      });
    }

    //4 로그인 성공! (프론트앤드에서 라우팅을 위해 isAdmin값을 같이 넘겨줍니다)
    // 4. 회원 계정 상태 확인
    if (user.STATUS !== "정상") {
      return res.status(403).json({
        success: false,
        message: "이용할 수 없는 계정입니다.",
      });
    }

    // 5. JWT 환경변수 확인
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET이 설정되지 않았습니다.");

      return res.status(500).json({
        success: false,
        message: "로그인 인증 설정 오류입니다.",
      });
    }

    // 6. JWT 생성
    const token = jwt.sign({}, process.env.JWT_SECRET, {
      algorithm: "HS256",
      subject: String(user.USER_IDX),
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      expiresIn: "8h",
    });

    // 7. 인증 쿠키 발급
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60 * 1000,
    });

    // 8. 기존 로그인 응답 유지
    return res.status(200).json({
      success: true,
      message: "로그인에 성공했습니다",
      isAdmin: user.IS_ADMIN,
      userName: user.USER_NAME,
    });
  } catch (error) {
    console.error("로그인 에러:", error);
    res.status(500).json({
      success: false,
      message: "로그인 처리중 서버 오류가 발생했습니다",
    });
  }
});

// ============================================================================
// 푸터 설정 관리
// ============================================================================
app.get("/api/admin/footer", async (req, res) => {
  try {
    // 테이블 데이터를 다룰수 있는 권한(저장소)를 가져 옵니다
    const footerRepo = AppDataSource.getRepository(FooterSettings);
    // 푸터 설정은 여러개가 필요 없습니다 무조건 고유번호가 1번인 데이터 딱 하나만 찾습니다
    const footer = await footerRepo.findOne({ where: { id: 1 } });
    // 만약 테이블을 방금 만들어서 아직 한번도 저장한 적이 없다면
    if (!footer) {
      //에러가 아니기에 프론트앤드가 뻗지 않게 빈 껍데기를 성공 상태로 보냅니다
      return res.status(200).json({ success: true, data: null });
    }
    // db에서 찾은 데이터를 프론트엔드의 3가지 상태(state)구조에 완벽히 맞춰서 조립
    res.status(200).json({
      success: true,
      data: {
        companyInfo: {
          name: footer.name || "",
          address: footer.address || "",
          clinicName: footer.clinicName || "",
          phone: footer.phone || "",
          email: footer.email || "",
          locationUrl: footer.locationUrl || "",
        },
        schedules: footer.schedules || [],
        familySites: footer.familySites || [],
      },
    });
  } catch (error) {
    console.error("푸터 조회 에러:", error);
    res.status(500).json({
      success: false,
      message: "푸터 데이터를 불러오지 못했습니다",
    });
  }
});
//footer post
app.post("/api/admin/footer", async (req, res) => {
  try {
    //1) 프론트에서 post로 보낸 데이터(req.body)를 3개의 덩어리로 분해
    const { companyInfo, schedules, familySites } = req.body;
    //2) 테이블 저장소를 가지고 옵니다
    const footerRepo = AppDataSource.getRepository(FooterSettings);
    /*3) 덮어쓰기를 하기 위해 기존에 저장된 설정(id가 1번인 데이터)이 
있는지 먼저 찾아봅니다.*/
    let footer = await footerRepo.findOne({ where: { id: 1 } });

    //4. 만약 최초 저장이라 기존 데이터가 없다면?
    if (!footer) {
      //db에 새롭게 넣을 준비를 합니다 이때 고유번호(id)는 무조건 1로 강제 고정합니다!
      footer = footerRepo.create({ id: 1 });
    }

    footer.name = companyInfo.name;
    footer.address = companyInfo.address;
    footer.clinicName = companyInfo.clinicName;
    footer.phone = companyInfo.phone;
    footer.email = companyInfo.email;
    footer.locationUrl = companyInfo.locationUrl;
    footer.schedules = schedules;
    footer.familySites = familySites;

    //footer객체를 최종적으로 저장
    await footerRepo.save(footer);

    //
    res.status(200).json({
      success: true,
      message: "푸터설정이 성공적으로 저장되었습니다",
    });
  } catch (error) {
    console.error("푸터 저장 에러: ", error);
    res.status(500).json({
      success: false,
      message: "푸터 저장 중 서버 오류가 발생했습니다.",
    });
  }
});

// ============================================================================
// 퀵상담 관리
// ============================================================================
app.post("/api/consult/quick", async (req, res) => {
  try {
    const { name, phone, department } = req.body;
    //필수값 검증
    if (!name || !phone || !department) {
      return res.status(400).json({
        success: false,
        message: "이름, 연락처, 상담분야를 모두 입력해 주세요",
      });
    }
    const consultRepo = AppDataSource.getRepository(Consult);

    const newConsult = consultRepo.create({
      NAME: name,
      PHONE: phone,
      DEPARTMENT: department,
      PASSWORD: "0000",
      USER_ID: "비회원",
      TITLE: `[빠른상담] ${department} 문의입니다`,
      CONTENT: `${name}님의 빠른 상담 신청입니다. 빠른 시일내에 연락바랍니다`,
      STATUS: "대기중",
    });
    //3.DB저장
    await consultRepo.save(newConsult);
    res.status(200).json({
      success: true,
      message: "빠른 상담 신청이 완료되었습니다",
    });
  } catch (error) {
    console.error("빠른 상담 신청 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "상담 신청중 오류가 발생했습니다" });
  }
});

//상담내역 전체 조회
app.get("/api/admin/consult", async (req, res) => {
  try {
    const consultRepo = AppDataSource.getRepository(Consult);
    const list = await consultRepo.find({ order: { CREATED_AT: "DESC" } });
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    console.error("상담 내역 조회 에러:", error);
    res.status(500).json({ success: false });
  }
});
//상담 상태 토글
app.put("/api/admin/consult/:id/status", async (req, res) => {
  try {
    const consultRepo = AppDataSource.getRepository(Consult);
    const consult = await consultRepo.findOne({ where: { ID: req.params.id } });
    if (!consult)
      return res
        .status(404)
        .json({ success: false, message: "데이터가 없습니다" });
    consult.STATUS = consult.STATUS === "대기중" ? "상담완료" : "대기중";
    await consultRepo.save(consult);
    res.status(200).json({ success: true, message: "상태가 변경되었습니다" });
  } catch (error) {
    res.status(500).json({ success: false, message: "상태가 변경 실패" });
  }
});
//상담 내역 삭제
app.delete("/api/admin/consult/:id", async (req, res) => {
  try {
    const consultRepo = AppDataSource.getRepository(Consult);
    await consultRepo.delete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("상담 삭제 에러:", error);
    res.status(500).json({ success: false });
  }
});

// ============================================================================
// 네비게이션 설정
// ============================================================================
app.get("/api/admin/nav", async (req, res) => {
  try {
    const navRepo = AppDataSource.getRepository(NavSetting);
    let setting = await navRepo.findOne({ where: { ID: 1 } });
    //처음 세팅이라 DB에 값이 없다면 기본값을 내려줍니다.
    if (!setting) {
      return res.status(200).json({
        success: true,
        data: {
          LOGO_TYPE: "TEXT",
          LOGO_TEXT: "안호범안스성형외과",
          LOGO_FILE: "",
          MENUS: "[]",
        },
      });
    }
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    console.error("내비게이션 조회 에러:", error);
    res.status(500).json({ success: false });
  }
});

//최초저장이거나 변경
app.put("/api/admin/nav", async (req, res) => {
  try {
    const { logo, menus } = req.body;

    const logoType = logo?.type || "TEXT";
    const logoText = logo?.text || "";
    const logoFileName = logo?.fileName || "";

    const navRepo = AppDataSource.getRepository(NavSetting);
    let setting = await navRepo.findOne({ where: { ID: 1 } });
    if (!setting) {
      setting = navRepo.create({ ID: 1 });
    }

    setting.LOGO_TYPE = logoType;
    setting.LOGO_TEXT = logoText;
    setting.LOGO_FILE = logoFileName;
    setting.MENUS = JSON.stringify(menus);

    await navRepo.save(setting);

    return res
      .status(200)
      .json({ success: true, message: "네비게이션 수정 성공" });
  } catch (error) {
    console.error("네비게이션 수정 에러: ", error);
    return res
      .status(500)
      .json({ success: false, message: "네비게이션 수정 에러" });
  }
});

// ============================================================================
// 캐러셀 관리 Main Visual 저장
// ============================================================================
app.get("/api/admin/visual", async (req, res) => {
  try {
    const visualRepo = AppDataSource.getRepository(MainVisual);
    let setting = await visualRepo.findOne({ where: { ID: 1 } });
    if (!setting) {
      return res.status(200).json({ success: true, data: { SLIDES: "[]" } });
    }
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    console.error("비주얼 설정 로드 실패:", error);
  }
});

app.put("/api/admin/visual", async (req, res) => {
  try {
    const { slides } = req.body;
    const visualRepo = AppDataSource.getRepository(MainVisual);
    let setting = await visualRepo.findOne({ where: { ID: 1 } });
    if (!setting) {
      setting = visualRepo.create({ ID: 1 });
    }
    setting.SLIDES = JSON.stringify(slides);
    await visualRepo.save(setting);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("비주얼 설정 저장 실패:", error);
    res.status(500).json({ success: false });
  }
});

// ============================================================================
// 톤 설정 관리
// ============================================================================
app.get("/api/admin/tone", async (req, res) => {
  try {
    const toneRepo = AppDataSource.getRepository(ToneSetting);
    let setting = await toneRepo.findOne({ where: { ID: 1 } });
    if (!setting) {
      return res.status(200).json({
        success: true,
        data: { PRIMARY_TONE: "BLUE", IS_DARKMODE: "N" },
      });
    }
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    console.error("테마 설정 로드 실패: ", error);
    res.status(500).json({
      success: false,
      message: "테마 설정 로드 실패",
    });
  }
});

app.put("/api/admin/tone", async (req, res) => {
  try {
    const toneRepo = AppDataSource.getRepository(ToneSetting);
    const { primaryTone, isDarkMode } = req.body;
    let setting = await toneRepo.findOne({ where: { ID: 1 } });
    if (!setting) {
      setting = toneRepo.create({ ID: 1 });
    }
    setting.PRIMARY_TONE = primaryTone;
    setting.IS_DARKMODE = isDarkMode;
    await toneRepo.save(setting);

    res.status(200).json({
      success: true,
      message: "테마 설정 저장 성공",
    });
  } catch (error) {
    console.error("테마 설정 저장 실패: ", error);
    res.status(500).json({
      success: false,
      message: "테마 설정 저장 실패",
    });
  }
});

// ============================================================================
// 회원목록전체조회
// ============================================================================
app.get("/api/admin/users", async (req, res) => {
  try {
    const memberRepo = AppDataSource.getRepository(Member);
    //프론트에서 보낸 파라미터 받기(기본값 설정)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    //데이터베이스에게 건너뛸 갯수 계산
    const skip = (page - 1) * limit;
    //검색어가 있으면 이름(USER_NAME)으로 필터링
    const whereClause = search
      ? [
          { USER_NAME: Like(`%${search}%`) },
          { USER_ID: Like(`%${search}%`) },
          { PHONE: Like(`%${search}%`) },
        ]
      : {};
    //데이터 검색 및 전체개수(totalCount)같이 가져오기
    const [users, totalCount] = await memberRepo.findAndCount({
      where: whereClause,
      order: { USER_IDX: "DESC" },
      skip: skip,
      take: limit,
    });
    //총 페이지 수 계산
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: users,
      pagination: { totalCount, totalPages, currentPage: page, limit },
    });
  } catch (error) {
    console.error("회원목록 조회 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다" });
  }
});

app.put("/api/admin/users/:idx/status", async (req, res) => {
  try {
    const memberRepo = AppDataSource.getRepository(Member);
    const users = await memberRepo.findOneBy({
      USER_IDX: req.params.idx,
    });
    if (!users)
      return res
        .status(404)
        .json({ success: false, message: "유저 정보가 없습니다" });
    users.STATUS = users.STATUS === "정지" ? "정상" : "정지";
    await memberRepo.save(users);
    res
      .status(200)
      .json({ success: true, message: "유저 상태가 변경되었습니다" });
  } catch (error) {
    console.error("유저 상태 변경 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다" });
  }
});

app.delete("/api/admin/users/:idx", async (req, res) => {
  try {
    const memberRepo = AppDataSource.getRepository(Member);
    await memberRepo.delete(req.params.idx);
    res.status(200).json({
      success: true,
      message: `${req.params.idx} 유저가 삭제되었습니다`,
    });
  } catch (error) {
    console.error("회원 삭제 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다" });
  }
});

// ============================================================================
// 팝업 관리
// ============================================================================
app.get("/api/admin/popups", async (req, res) => {
  try {
    const settingRepo = AppDataSource.getRepository(PopupSetting);
    const popupRepo = AppDataSource.getRepository(Popup);
    let setting = await settingRepo.findOne({ where: { ID: 1 } });
    const popups = await popupRepo.find({ order: { POPUP_IDX: "DESC" } });
    res.status(200).json({
      success: true,
      maxPopups: setting ? setting.MAX_POPUPS : 1,
      popups,
    });
  } catch (error) {
    console.error("팝업 목록 조회 실패: ", error);
    res.status(500).json({
      success: false,
      message: "팝업 목록 조회 실패",
    });
  }
});

//팝업 최대 노출 갯수 설정 저장
app.put("/api/admin/popups/setting", async (req, res) => {
  try {
    const { maxPopups } = req.body;
    const settingRepo = AppDataSource.getRepository(PopupSetting);
    let setting = await settingRepo.findOne({ where: { ID: 1 } });
    if (!setting) setting = settingRepo.create({ ID: 1 });
    setting.MAX_POPUPS = maxPopups;
    await settingRepo.save(setting);
    res.status(200).json({
      success: true,
      message: "팝업 설정 저장 성공",
    });
  } catch (error) {
    console.error("팝업 설정 저장 실패: ", error);
    res.status(500).json({
      success: false,
      message: "팝업 설정 저장 실패",
    });
  }
});

app.post("/api/admin/popups", upload.single("popupImage"), async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "이미지 업로드 실패" });
    const { title, link, startDate, endDate, useTodayClose } = req.body;
    const popupRepo = AppDataSource.getRepository(Popup);
    const newPopup = popupRepo.create({
      TITLE: title,
      LINK: link || "",
      FILE_NAME: req.file.filename,
      START_DATE: startDate,
      END_DATE: endDate,
      USE_TODAY_CLOSE: useTodayClose === "true" ? "Y" : "N",
    });
    await popupRepo.save(newPopup);
    res.status(200).json({
      success: true,
      message: "팝업 저장 성공",
    });
  } catch (error) {
    console.error("팝업 저장 실패: ", error);
    res.status(500).json({
      success: false,
      message: "팝업 저장 실패",
    });
  }
});

app.delete("/api/admin/popups/:idx", async (req, res) => {
  try {
    const popupRepo = AppDataSource.getRepository(Popup);
    await popupRepo.delete(req.params.idx);
    res.status(200).json({
      success: true,
      message: "팝업 삭제 성공",
    });
  } catch (error) {
    console.error("팝업 삭제 실패: ", error);
    res.status(500).json({
      success: false,
      message: "팝업 삭제 실패",
    });
  }
});

// ============================================================================
// 카테고리 관리 (News)
// ============================================================================
app.get("/api/admin/categories", async (req, res) => {
  try {
    const categoryRepo = AppDataSource.getRepository(Category);
    const categories = await categoryRepo.find({
      order: { SORT_ORDER: "ASC", CATEGORY_IDX: "ASC" },
    });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("카테고리 목록 조회 실패: ", error);
    res.status(500).json({
      success: false,
      message: "카테고리 목록 조회 실패",
    });
  }
});

app.post(
  "/api/admin/categories",
  upload.single("categoryImage"),
  async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "이미지가 존재하지 않습니다" });
      const { title, link } = req.body;
      const categoryRepo = AppDataSource.getRepository(Category);

      //데이터베이스의 category 테이블에서 SORT_ORDER(정렬 순서) 컬럼의 가장 큰 값(최댓값)을 한 행(Row)만 가져오는 TypeORM 비동기 쿼리
      const maxSort = await categoryRepo
        .createQueryBuilder("category") //SQL 명령어 만들기 별칭(category)
        .select("MAX(category.SORT_ORDER)", "max") //SELECT MAX(SORT_ORDER) AS max
        .getRawOne(); //순수 데이터 한 행 가져옴

      const nextOrder = (Number(maxSort.max) || 0) + 1;

      const newCategory = categoryRepo.create({
        TITLE: title,
        LINK: link || "",
        FILE_NAME: req.file.filename,
        SORT_ORDER: nextOrder,
      });

      await categoryRepo.save(newCategory);

      res.status(200).json({
        success: true,
        message: "카테고리 저장 성공",
      });
    } catch (error) {}
  },
);

app.delete("/api/admin/categories/:idx", async (req, res) => {
  try {
    const categoryRepo = AppDataSource.getRepository(Category);
    await categoryRepo.delete(req.params.idx);
    res.status(200).json({
      success: true,
      message: "카테고리 삭제 성공",
    });
  } catch (error) {
    console.error("카테고리 삭제 실패: ", error);
    res.status(500).json({
      success: false,
      message: "카테고리 삭제 실패",
    });
  }
});

app.put("/api/admin/categories/order", async (req, res) => {
  try {
    const { orderedIds } = req.body;
    const categoryRepo = AppDataSource.getRepository(Category);
    for (let i = 0; i < orderedIds.length; i++) {
      await categoryRepo.update(orderedIds[i], { SORT_ORDER: i + 1 });
    }
    res.status(200).json({
      success: true,
      message: "카테고리 정렬 성공",
    });
  } catch (error) {
    console.error("카테고리 정렬 실패: ", error);
    res.status(500).json({
      success: false,
      message: "카테고리 정렬 실패",
    });
  }
});

// ============================================================================
// 안전마취 관리 (Safety)
// ============================================================================
app.get("/api/admin/safety", async (req, res) => {
  try {
    const safetyRepo = AppDataSource.getRepository(Safety);
    const items = await safetyRepo.find({
      order: { SAFETY_IDX: "ASC", SORT_ORDER: "ASC" },
    });

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("안전마취 목록 조회 실패: ", error);
    res.status(500).json({
      success: false,
      message: "안전마취 목록 조회 실패",
    });
  }
});

app.post(
  "/api/admin/safety",
  upload.single("safetyImage"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({
          success: false,
          message: "이미지가 존재하지 않습니다",
        });
      const { title, description } = req.body;
      const safetyRepo = AppDataSource.getRepository(Safety);
      const maxSort = await safetyRepo
        .createQueryBuilder("safety")
        .select("MAX(safety.SORT_ORDER)", "max")
        .getRawOne();

      const nextOrder = (Number(maxSort.max) || 0) + 1;

      const newSafety = safetyRepo.create({
        TITLE: title,
        DESCRIPTION: description,
        FILE_NAME: req.file.filename,
        SORT_ORDER: nextOrder,
      });
      await safetyRepo.save(newSafety);

      res.status(200).json({
        success: true,
        message: "안전마취 저장 성공",
      });
    } catch (error) {
      console.error("안전마취 저장 실패: ", error);
      res.status(500).json({
        success: false,
        message: "안전마취 저장 실패",
      });
    }
  },
);

app.delete("/api/admin/safety/:idx", async (req, res) => {
  try {
    const safetyRepo = AppDataSource.getRepository(Safety);
    await safetyRepo.delete(req.params.idx);
    res.status(200).json({
      success: true,
      message: "안전마취 삭제 성공",
    });
  } catch (error) {
    console.error("안전마취 삭제 실패: ", error);
    res.status(500).json({
      success: false,
      message: "안전마취 삭제 실패",
    });
  }
});

app.put("/api/admin/safety/order", async (req, res) => {
  try {
    const { orderedIds } = req.body;
    const safetyRepo = AppDataSource.getRepository(Safety);
    for (let i = 0; i < orderedIds.length; i++) {
      await safetyRepo.update(orderedIds[i], { SORT_ORDER: i + 1 });
    }
    res.status(200).json({
      success: true,
      message: "안전마취 정렬 성공",
    });
  } catch (error) {
    console.error("안전마취 정렬 실패: ", error);
    res.status(500).json({
      success: false,
      message: "안전마취 정렬 실패",
    });
  }
});

// ============================================================================
// 셀피 관리(Selfie)
// ============================================================================
app.get("/api/admin/selfies", async (req, res) => {
  try {
    const selfieRepo = AppDataSource.getRepository(Selfie);
    const items = await selfieRepo.find({ order: { SELFIE_IDX: "DESC" } });

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("셀피 데이터 로드 실패", error);
    res.status(500).json({
      success: false,
      message: "셀피 데이터 로드 실패",
    });
  }
});

app.post(
  "/api/admin/selfies",
  upload.single("selfieImage"),
  async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "이미지가 존재하지 않습니다" });
      const { likes, views } = req.body;
      const selfieRepo = AppDataSource.getRepository(Selfie);
      const newSelfie = selfieRepo.create({
        FILE_NAME: req.file.filename,
        LIKES: parseInt(likes) || 0,
        VIEWS: parseInt(views) || 0,
        IS_ACTIVE: "Y",
      });
      await selfieRepo.save(newSelfie);
      res.status(200).json({
        success: true,
        message: "셀피 저장 성공",
      });
    } catch (error) {
      console.error("셀피 저장 실패", error);
      res.status(500).json({
        success: false,
        message: "셀피 저장 실패",
      });
    }
  },
);

app.delete("/api/admin/selfies/:idx", async (req, res) => {
  try {
    const selfieRepo = AppDataSource.getRepository(Selfie);
    await selfieRepo.delete(req.params.idx);
    res.status(200).json({
      success: true,
      message: "셀피 삭제 성공",
    });
  } catch (error) {
    console.error("셀피 삭제 실패", error);
    res.status(500).json({
      success: false,
      message: "셀피 삭제 실패",
    });
  }
});

app.put("/api/admin/selfies/status", async (req, res) => {
  try {
    const { statuses } = req.body;
    const selfieRepo = AppDataSource.getRepository(Selfie);

    for (let item of statuses) {
      await selfieRepo.update(item.id, {
        IS_ACTIVE: item.isActive ? "Y" : "N",
      });
    }
    res.status(200).json({
      success: true,
      message: "셀피 정렬 성공",
    });
  } catch (error) {
    console.error("셀피 정렬 실패", error);
    res.status(500).json({
      success: false,
      message: "셀피 정렬 실패",
    });
  }
});

// ============================================================================
// 이벤트 관리(Event)
// ============================================================================
app.get("/api/admin/events", async (req, res) => {
  try {
    const eventRepo = AppDataSource.getRepository(EventRanking);
    const items = await eventRepo.find({
      order: { EVENT_IDX: "ASC", SORT_ORDER: "ASC" },
    });
    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("이벤트 데이터 로드 실패", error);
    res.status(500).json({
      success: false,
      message: "이벤트 데이터 로드 실패",
    });
  }
});

app.post("/api/admin/events", upload.single("eventImage"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({
        success: false,
        message: "이미지가 존재하지 않습니다",
      });
    const { title, price } = req.body;
    const eventRepo = AppDataSource.getRepository(EventRanking);

    const maxSort = await eventRepo
      .createQueryBuilder("event")
      .select("MAX(event.SORT_ORDER)", "max")
      .getRawOne();

    const nextOrder = (Number(maxSort.max) || 0) + 1;

    const newEvent = eventRepo.create({
      TITLE: title,
      PRICE: price,
      FILE_NAME: req.file.filename,
      SORT_ORDER: nextOrder,
    });

    await eventRepo.save(newEvent);
    res.status(200).json({
      success: true,
      message: "이벤트 저장 성공",
    });
  } catch (error) {
    console.error("이벤트 저장 실패", error);
    res.status(500).json({
      success: false,
      message: "이벤트 저장 실패",
    });
  }
});

app.delete("/api/admin/events/:idx", async (req, res) => {
  try {
    const eventRepo = AppDataSource.getRepository(EventRanking);
    await eventRepo.delete(req.params.idx);
    res.status(200).json({
      success: true,
      message: "이벤트 삭제 성공",
    });
  } catch (error) {
    console.error("이벤트 삭제 실패", error);
    res.status(500).json({
      success: false,
      message: "이벤트 삭제 실패",
    });
  }
});

app.put("/api/admin/events/order", async (req, res) => {
  try {
    const { orderedIds } = req.body;
    const eventRepo = AppDataSource.getRepository(EventRanking);
    for (let i = 0; i < orderedIds.length; i++) {
      await eventRepo.update(orderedIds[i], { SORT_ORDER: i + 1 });
    }
    res.status(200).json({
      success: true,
      message: "이벤트 정렬 성공",
    });
  } catch (error) {
    console.error("이벤트 정렬 실패", error);
    res.status(500).json({
      success: false,
      message: "이벤트 정렬 실패",
    });
  }
});

// ============================================================================
// vlog 관리(Vlog)
// ============================================================================
app.get("/api/admin/vlogs", async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Vlog);
    const items = await repo.find({
      order: { SORT_ORDER: "ASC", VLOG_IDX: "ASC" },
    });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error("VLOG 조회 에러:", error);
    res.status(500).json({ success: false });
  }
});

// 2. 새 영상 등록 (이미지 업로드 포함)
app.post("/api/admin/vlogs", upload.single("vlogImage"), async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "이미지가 없습니다." });

    const { title, videoUrl } = req.body;
    const repo = AppDataSource.getRepository(Vlog);

    // 현재 가장 큰 순서 번호 찾기 (맨 뒤에 배치)
    const maxSort = await repo
      .createQueryBuilder("vlog")
      .select("MAX(vlog.SORT_ORDER)", "max")
      .getRawOne();
    const nextOrder = (maxSort.max || 0) + 1;

    const newItem = repo.create({
      TITLE: title,
      VIDEO_URL: videoUrl,
      FILE_NAME: req.file.filename,
      SORT_ORDER: nextOrder,
    });

    await repo.save(newItem);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("VLOG 등록 에러:", error);
    res.status(500).json({ success: false });
  }
});

// 3. 영상 삭제
app.delete("/api/admin/vlogs/:idx", async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Vlog);
    await repo.delete(req.params.idx);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("VLOG 삭제 에러:", error);
    res.status(500).json({ success: false });
  }
});

// 4. 영상 순서 일괄 저장
app.put("/api/admin/vlogs/order", async (req, res) => {
  try {
    const { orderedIds } = req.body;
    const repo = AppDataSource.getRepository(Vlog);

    for (let i = 0; i < orderedIds.length; i++) {
      await repo.update(orderedIds[i], { SORT_ORDER: i + 1 });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("VLOG 순서 저장 에러:", error);
    res.status(500).json({ success: false });
  }
});

// ============================================================================
// board 관리(Board)
// ============================================================================
app.get("/api/admin/boards", async (req, res) => {
  try {
    const boardRepo = AppDataSource.getRepository(Board);
    const items = await boardRepo.find({ order: { BOARD_IDX: "DESC" } });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error("게시판 목록 조회 에러:", error);
    res.status(500).json({ success: false });
  }
});

app.post("/api/admin/boards", async (req, res) => {
  try {
    const { name, type, readAuth, writeAuth } = req.body;
    const boardRepo = AppDataSource.getRepository(Board);
    const newBoard = boardRepo.create({
      NAME: name,
      BOARD_TYPE: type,
      READ_AUTH: readAuth,
      WRITE_AUTH: writeAuth,
    });
    await boardRepo.save(newBoard);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("게시판 생성 에러:", error);
    res.status(500).json({ success: false });
  }
});

app.delete("/api/admin/boards/:idx", async (req, res) => {
  try {
    const boardRepo = AppDataSource.getRepository(Board);
    await boardRepo.delete(req.params.idx);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("게시판 삭제 에러:", error);
    res.status(500).json({ success: false });
  }
});

//특정 게시판 조회
app.get("/api/boards/:idx", async (req, res) => {
  try {
    const boardRepo = AppDataSource.getRepository(Board);
    const board = await boardRepo.findOne({
      where: {
        BOARD_IDX: Number(req.params.idx),
      },
    });
    if (!board) {
      return res
        .status(404)
        .json({ success: false, message: "게시판을 찾을 수 없습니다." });
    }
    res.status(200).json({ success: true, data: board });
  } catch (error) {
    console.error("게시판 조회 에러:", error);
    res.status(500).json({ success: false });
  }
});

const qnaRepository = AppDataSource.getRepository(Qna);
// ==========================================
//  Q&A 목록 조회 API
// ==========================================
app.get("/api/admin/qnas", async (req, res) => {
  try {
    const qnas = await qnaRepository.find({
      order: {
        SORT_ORDER: "ASC",
        QNA_IDX: "DESC",
      },
    });

    res.json({
      success: true,
      data: qnas,
    });
  } catch (err) {
    console.error("Q&A 목록 조회 실패:", err);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

// ==========================================
//  새 Q&A 등록 API
// ==========================================
app.post("/api/admin/qnas", async (req, res) => {
  const { category, categoryName, question, answer } = req.body;

  if (!category || !categoryName || !question || !answer) {
    return res
      .status(400)
      .json({ success: false, message: "모든 필드를 입력해주세요." });
  }

  try {
    const maxSort = await qnaRepository
      .createQueryBuilder("qna")
      .select("MAX(qna.SORT_ORDER)", "max")
      .getRawOne();

    const nextOrder = (Number(maxSort.max) || 0) + 1;

    const newQna = qnaRepository.create({
      CATEGORY: category,
      CATEGORY_NAME: categoryName,
      QUESTION: question,
      ANSWER: answer,
      SORT_ORDER: nextOrder,
    });

    await qnaRepository.save(newQna);

    res.json({ success: true, message: "Q&A가 성공적으로 등록되었습니다." });
  } catch (err) {
    console.error("Q&A 등록 실패:", err);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

// ==========================================
// Q&A 삭제 API
// ==========================================
app.delete("/api/admin/qnas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await qnaRepository.delete({ QNA_IDX: Number(id) });

    if (result.affected === 0) {
      return res
        .status(404)
        .json({ success: false, message: "해당 Q&A를 찾을 수 없습니다." });
    }

    res.json({ success: true, message: "Q&A가 삭제되었습니다." });
  } catch (err) {
    console.error("Q&A 삭제 실패:", err);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

// ==========================================
// Q&A 순서 변경 저장 API
// ==========================================
app.put("/api/admin/qnas/order", async (req, res) => {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res
      .status(400)
      .json({ success: false, message: "올바르지 않은 데이터 형식입니다." });
  }

  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const qnaRepo = transactionalEntityManager.getRepository(Qna);
      for (let i = 0; i < orderedIds.length; i++) {
        const id = Number(orderedIds[i]);

        if (isNaN(id)) {
          throw new Error("유효하지 않은 ID가 포함되어 있습니다.");
        }

        await qnaRepo.update(id, { SORT_ORDER: i + 1 });
      }
    });
    res.json({ success: true, message: "순서가 저장되었습니다." });
  } catch (err) {
    console.error("순서 저장 실패:", err);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

// ==========================================
//  Q&A 수정 API
// ==========================================
app.put("/api/admin/qnas/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ success: false, message: "유효하지 않은 Q&A ID입니다." });
  }

  const { category, categoryName, question, answer } = req.body;

  try {
    const qna = await qnaRepository.findOneBy({ QNA_IDX: Number(id) });

    if (!qna) {
      return res
        .status(404)
        .json({ success: false, message: "해당 Q&A를 찾을 수 없습니다." });
    }

    qna.CATEGORY = category;
    qna.CATEGORY_NAME = categoryName;
    qna.QUESTION = question;
    qna.ANSWER = answer;

    await qnaRepository.save(qna);

    res.json({ success: true, message: "Q&A가 수정되었습니다." });
  } catch (err) {
    console.error("Q&A 수정 실패:", err);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

// ==========================================
//  todayDashbord 대시보드  - 예약 시스템
// ==========================================
const memberRepo = AppDataSource.getRepository(Member);
const reservationRepo = AppDataSource.getRepository(AdminReservation);
const treatmentRepo = AppDataSource.getRepository(Treatment);

app.post('/api/admin/reservation', async (req, res) => {
    try {
        const { chartNo, treatmentIdx, reservationDate, reservationTime, memo } = req.body;
        
        if (!chartNo || !reservationDate || !reservationTime) {
            return res.status(400).json({ 
                success: false, 
                message: '필수 정보(차트번호, 예약일자, 예약시간)가 누락되었습니다.' 
            });
        }
        const memberRepo = AppDataSource.getRepository(Member);
        const treatmentRepo = AppDataSource.getRepository(Treatment);
        const reservationRepo = AppDataSource.getRepository(AdminReservation);

        //  환자 존재 여부 확인
        const existingMember = await memberRepo.findOne({ where: { CHART_NO: chartNo } });
        if (!existingMember) {
            return res.status(404).json({ success: false, message: '존재하지 않는 환자 차트번호입니다.' });
        }
        // 시술권을 선택한 경우, 잔여 횟수가 남아있는지 검사만 수행
        if (treatmentIdx) {
            const treatment = await treatmentRepo.findOne({
                where: { TREATMENT_IDX: treatmentIdx, CHART_NO: chartNo }
            });

            if (!treatment) {
                return res.status(404).json({ success: false, message: '유효하지 않은 시술권입니다.' });
            }
            
            if (treatment.REMAINING_COUNT <= 0) {
                return res.status(400).json({ success: false, message: '잔여 시술 횟수가 모두 소진되었습니다.' });
            }
        }
        const newReservation = reservationRepo.create({
            CHART_NO: chartNo,
            TREATMENT_IDX: treatmentIdx || null,
            RESERVATION_DATE: new Date(reservationDate),
            RESERVATION_TIME: reservationTime,
            STATUS: 'RESERVED',
            MEMO: memo || null
        });
        
        await reservationRepo.save(newReservation);

        return res.status(200).json({ 
            success: true, 
            message: '예약이 성공적으로 등록되었습니다.' 
        });

    } catch (error) {
        console.error('예약 등록 중 서버 에러 발생:', error);
        return res.status(500).json({ 
            success: false, 
            message: '서버 에러가 발생했습니다.',
            error: error.message 
        });
    }
});

app.post('/api/admin/reservation/today', async(req, res)=>{
  try{
    const { chartNo, memo } = req.body;

    // 시간을 "HH:MM" 형식(24시간제)으로 안전하게 생성
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`; // 14:30
    
    const newReservation = reservationRepo.create({
            chartNo: chartNo,
            reservationDate: new Date(),
            reservationTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'WAITING', 
            memo: memo || '빠른 현장 접수'
        });
    await reservationRepo.save(newReservation);
    res.status(200).json({ success: true, message: '오늘 대기 목록에 접수되었습니다.' });
  }catch(error){
      console.error('오늘 접수 실패:', error);
      res.status(500).json({ success: false, message: '서버 에러' });
  }
})

app.get('/api/admin/today', async(req, res)=>{
  try{
      const todayPatients = await reservationRepository
        .createQueryBuilder("r")
        .innerJoin("r.member", "m") // Reservation 엔티티에 정의한 relations 이름
        .select([
            'm.CHART_NO AS "chartNo"',
            'm.USER_NAME AS "name"',
            'm.PHONE AS "phone"',
            'SUBSTR(m.RESIDENT_NUM, 1, 6) AS "birthDate"',
            'm.GENDER AS "gender"',
            'r.RESERVATION_TIME AS "reservationTime"',
            'r.STATUS AS "status"',
            'r.MEMO AS "memo"'
        ])
        .where("TRUNC(r.RESERVATION_DATE) = TRUNC(SYSDATE)") // 오라클 오늘 날짜 조건
        .orderBy(`
            CASE r.STATUS 
                WHEN 'TREATING' THEN 1 
                WHEN 'WAITING' THEN 2 
                WHEN 'RESERVED' THEN 3 
                WHEN 'CONSULTING' THEN 4 
                WHEN 'COMPLETED' THEN 5 
                ELSE 6 
            END
        `, "ASC")
        .getRawMany(); // SQL 결과 형태(DTO)로 바로 가져오기
    
        res.status(200).json({
                success: true,
                data: todayPatients // 프론트엔드가 원하는 구조의 배열 데이터
            });
  }catch(error){
      console.error('오늘의 예약 목록 조회 실패:', error);
      res.status(500).json({ success: false, message: '서버 에러 발생' });  
  }
})

app.patch('/api/admin/reservation/:reservationId/status', async (req, res) => {
    const { reservationId } = req.params;
    const { status } = req.body; // 예: 'COMPLETED'로 들어옴

    try {
        await AppDataSource.transaction(async (transactionalEntityManager) => {
            const reservationRepo = transactionalEntityManager.getRepository(AdminReservation);
            const treatmentRepo = transactionalEntityManager.getRepository(Treatment);

            const reservation = await reservationRepo.findOne({ where: { id: reservationId } });
            if (!reservation) {
                throw new Error('NOT_FOUND_RESERVATION');
            }

            // 만약 상태를 'COMPLETED'(시술 완료)로 바꾸는 거라면?
            if (status === 'COMPLETED' && reservation.STATUS !== 'COMPLETED') {
                
                // 이 예약에 묶여있는 시술권이 있다면 이때 비로소 차감!
                if (reservation.TREATMENT_IDX) {
                    const treatment = await treatmentRepo.findOne({ where: { TREATMENT_IDX: reservation.TREATMENT_IDX } });
                    
                    if (treatment) {
                        if (treatment.REMAINING_COUNT > 0) {
                            treatment.REMAINING_COUNT -= 1;
                        }
                        // 남은 횟수가 0이 되면 그제야 시술권 자체를 COMPLETED 처리
                        if (treatment.REMAINING_COUNT === 0) {
                            treatment.STATUS = 'COMPLETED';
                        }
                        await treatmentRepo.save(treatment);
                    }
                }
            }

            reservation.STATUS = status;
            await reservationRepo.save(reservation);
        });

        return res.json({ success: true, message: '예약 상태가 변경되었습니다.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
// ==========================================
// 특정 환자의 정보 및 보유 시술권 목록 조회 API
// ==========================================
app.get('/api/patient/:chartNo', async(req, res)=>{
  
  try{
 
    const { chartNo }= req.params;

    const memberRepo = AppDataSource.getRepository(Member);
    const treatmentRepo = AppDataSource.getRepository(Treatment);

    const user = await memberRepo.findOne({
      where: { CHART_NO: chartNo }
    });

    if (!user) {
      return res.status(404).json({ 
          success: false, 
          message: '존재하지 않는 환자 차트번호입니다.' 
      });
    }
    const treatments = await treatmentRepo.find({
          where: { CHART_NO: chartNo },
          order: { CREATED_AT: 'DESC' } 
      });
    
    return res.status(200).json({
        success: true,
        user: {
        CHART_NO: user.CHART_NO,
        USER_NAME: user.USER_NAME || user.NAME,
        PHONE: user.PHONE,
        STATUS: user.STATUS || '정상'
        },
        treatments,
    });
  }catch(error){
    console.error('환자 정보 및 시술권 조회 에러:', error);
        return res.status(500).json({ 
            success: false, 
            message: '서버 에러가 발생했습니다.',
            error: error.message 
        });
  }

})


const { router: adminSessionRouter, requireAdmin } = createAdminSession({
  dataSource: AppDataSource,
});

const { publicRouter, adminRouter } = createDetailRouters({
  dataSource: AppDataSource,
  requireAdmin,
});

app.use("/api/admin/session", adminSessionRouter);
app.use("/api/details", publicRouter);
app.use("/api/admin/detail", adminRouter);
app.use("/api/admin/detail/images", createDetailImageRouter({ requireAdmin }));
// 마이페이지 API
app.use("/api/mypage", mypageRouter);
app.post("/api/logout", (req, res) => {
  res.clearCookie("clinic_session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "로그아웃되었습니다.",
  });
});
// 일반 회원 예약
app.use("/api/reservations", reservationRouter);

// 관리자 예약 관리
app.use(
  "/api/admin/reservations",
  createAdminReservationRouter({
    dataSource: AppDataSource,
    requireAdmin,
  }),
);

const PORT = process.env.PORT || 4000;
//포트폴리오로 고도화 아이디 확인하고 그사람에 가입 이메일을 판단하고..거기에 맞는 이메일 발송하겠끔..

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
