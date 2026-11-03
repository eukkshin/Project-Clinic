"use strict";
const ALLOWED = (process.env.FRONTEND_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

// CORS만으로는 쿠키 인증 API의 CSRF를 막을 수 없으므로 상태 변경 요청에서 Origin 검증.
module.exports = function consultOrigin(req, res, next) {
  const origin = req.get("origin");
  if (!origin || !ALLOWED.includes(origin)) {
    return res
      .status(403)
      .json({ success: false, message: "허용되지 않은 요청 출처입니다." });
  }
  return next();
};
