require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const AppDataSource = require("./db"); // db.js 파일 경로 확인
const Member = require("./src/entity/Member"); // Member.js 파일 경로 확인
const nodemailer = require("nodemailer");

const app = express();

// 1. CORS 설정 (프론트엔드 3000번 포트의 접근만 안전하게 허용)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

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
      isAdmin,
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

    // DB 컬럼에 맞게 데이터 조립 (IS_ADMIN은 DB 기본값 0으로 자동 세팅됨)
    const newMember = {
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
      IS_ADMIN: isAdmin,
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

//로그인 API 코드 추가하기
app.post("/api/login", async (req, res) => {
  try {
    const { userId, userPw } = req.body;
    //비워진 것에 대한 방어
    if (!userId || !userPw) {
      return res.status(400).json({
        success: false,
        message: "아이디와 비밀번호를 모두 입력해 주세요.",
      });
    }
    //DB Repository 가져오기
    const memberRepository = AppDataSource.getRepository(Member);
    //DB에서 해당 아이디를 가진 회원 찾기
    const user = await memberRepository.findOne({
      where: { USER_ID: userId },
    });
    console.log("조회된 유저 결과:", user);
    //가입된 아이디가 없는 경우
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "존재하지 않는 아이디입니다.",
      });
    }
    console.log("-----------------------------------------");
    console.log("프론트 입력 비번 (평문):", userPw);
    console.log(
      "DB 저장 비번 (길이확인):",
      user.USER_PW,
      `[길이: ${user.USER_PW.length}]`,
    );
    console.log("-----------------------------------------");

    const isMatch = await bcrypt.compare(userPw, user.USER_PW);
    //비밀번호 검증(프론트에서 온 평문 비밀번호 vs DB의 암호화된 비밀번호)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
      });
    }
    //로그인 성공
    res.status(200).json({
      success: true,
      message: "로그인에 성공했습니다.",
      isAdmin: user.IS_ADMIN,
      //관리자면 1, 일반 회원이면 0
    });
  } catch (error) {
    console.error("로그인 에러: ", error);
    res.status(500).json({
      success: false,
      message: "로그인 중 서버 오류가 발생했습니다.",
    });
  }
});

//비밀번호 찾기
app.post("/api/send-reset-email", async (req, res) => {
  try {
    const { userId, userName, phone } = req.body;
    if (!userId || !userName || !phone) {
      return res.status(400).json({
        success: false,
        message: "인증 정보를 모두 입력해주세요.",
      });
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");

    // 2. 숫자를 010-XXXX-XXXX 형식의 하이픈 스타일로 변환
    const formattedPhone = cleanPhone.replace(
      /(\d{3})(\d{3,4})(\d{4})/,
      "$1-$2-$3",
    );
    const memberRepository = AppDataSource.getRepository(Member);
    const user = await memberRepository.findOne({
      where: { USER_ID: userId, USER_NAME: userName, PHONE: formattedPhone },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "입력하신 정보와 일치하는 회원이 없습니다.",
      });
    }
    //이메일 발송 세팅 (gmail 기준)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "eukkshin030101@gmail.com",
        pass: "dtbf eoak lvrw jbfm",
      },
    });

    const resetUrl = `http://localhost:3000/find/reset?userId=${user.USER_ID}`;

    const mailOptions = {
      from: '"성형외과 관리자" <plastic@surgery.com>',
      to: user.EMAIL,
      subject: "[성형외과] 비밀번호 재설정 링크",
      html: `
      <style>
        /* 이메일 클라이언트가 읽을 수 있도록 내부에 스타일 선언 */
        .reset-btn {
          transition: background-color 0.2s ease;
        }
        .reset-btn:hover {
          background-color: #2e59d9 !important; /* 마우스 올렸을 때 진한 파란색으로 변경 */
        }
      </style>
      
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h2>비밀번호 재설정</h2>
        <p><strong>${user.USER_NAME}</strong>님, 본인인증이 완료되었습니다.</p>
        <p>아래 버튼을 클릭하여 새로운 비밀번호를 설정해 주세요.</p>
        <a href="${resetUrl}" 
          class="reset-btn"
          style="display:inline-block; padding:10px 20px; background-color:#4e73df; color:#fff; text-decoration:none; border-radius:5px; margin-top:20px; font-weight:bold;"
        >
            새 비밀번호 설정하기
        </a>
      </div>
    `,
    };

    //이메일 전송
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: "이메일 발송이 완료되었습니다.",
    });
  } catch (error) {
    console.error("이메일 발송 에러:", error);
    res.status(500).json({
      success: false,
      message: "이메일 발송 중 오류가 발생했습니다.",
    });
  }
});

//비밀번호 변경 API
app.post("/api/reset-password", async (req, res) => {
  try {
    const { userId, newPw } = req.body;
    if (!userId || !newPw) {
      return res.status(400).json({
        success: false,
        message: "잘못된 요청입니다.",
      });
    }

    const memberRepository = AppDataSource.getRepository(Member);
    const user = await memberRepository.findOne({
      where: { USER_ID: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "회원을 찾을 수 없습니다.",
      });
    }

    //새 비밀번호 암호화
    const hashedPw = await bcrypt.hash(newPw, 10);

    user.USER_PW = hashedPw;

    await memberRepository.save(user);

    return res.status(200).json({
      success: true,
      message: "비밀번호가 성공적으로 변경되었습니다.",
    });
  } catch (error) {
    console.error("비밀번호 업데이트 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

// 5. 서버 실행
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// // 🚀 server.js 맨 밑에 임시로 붙여넣으세요! (admin 계정만 처리)
// async function makeSureAdminPassword() {
//   try {
//     // 1. 개발자님의 현재 Node.js 환경에서 직접 '1234'를 암호화합니다.
//     const securePassword = await bcrypt.hash("1234", 10);
//     console.log("[💡 치트키] 생성된 admin 전용 1234 암호문:", securePassword);

//     // 2. 오직 admin 계정의 비밀번호만 강제로 업데이트합니다. (user01은 건드리지 않음)
//     await memberRepository.update(
//       { USER_ID: "admin" },
//       { USER_PW: securePassword },
//     );

//     console.log(
//       "[✅ 성공] admin 계정의 비밀번호가 진짜 '1234'로 강제 주입되었습니다!",
//     );
//   } catch (err) {
//     console.error("[❌ 에러] admin 비밀번호 주입 실패:", err.message);
//   }
// }

// // 오라클 DB 연결 성공 메시지가 출력된 이후 실행되도록 처리합니다.
// setTimeout(makeSureAdminPassword, 2000); // 서버 켜지고 2초 뒤 실행
