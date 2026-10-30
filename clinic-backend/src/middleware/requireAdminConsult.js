"use strict";
// AHNS_clinic_backend_mypage_API_patch.zip의 세션 미들웨어와 연동한다.
const { authenticateMember } = require("./authenticateMember");

function requireAdminRole(req, res, next) {
  const value = req.member?.IS_ADMIN;
  if (value !== 1 && value !== "1" && value !== true) {
    return res
      .status(403)
      .json({ success: false, message: "관리자만 이용할 수 있습니다." });
  }
  return next();
}

module.exports = [authenticateMember, requireAdminRole];
