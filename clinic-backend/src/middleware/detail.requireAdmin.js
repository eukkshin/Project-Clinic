"use strict";
// SECURITY: Do not use req.body.isAdmin, req.headers.isAdmin, or frontend localStorage.
// Existing /api/login only returns isAdmin and userName; no signed server-verified session/token.
// Replace this handler only after integrating server-verified session/JWT and rechecking IS_ADMIN in DB.
module.exports = function requireDetailAdmin(_req, res) {
  return res.status(503).json({
    success: false,
    message:
      "관리자 인증이 연결되기 전에는 상세페이지 수정 API를 사용할 수 없습니다.",
  });
};
