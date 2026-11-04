"use strict";

/**
 * 회원가입 API (Express / TypeORM / OracleDB)
 * - 가입 시 주민등록번호를 수집·저장하지 않습니다.
 * - 회원 생성 + 약관/고지/마케팅 동의 이력을 하나의 DB 트랜잭션으로 저장합니다.
 * - 회원가입 프론트엔드의 `consents` 요청 형태와 호환됩니다.
 *
 * 주의: 배포 전 sql/2026_11_member_registration_consent.sql을 실행해야 합니다.
 */
const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const Member = require("../entity/Member");

const POLICY_VERSION =
  process.env.REGISTRATION_POLICY_VERSION || "2026-11-04-draft";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hasOwn = (object, key) =>
  Object.prototype.hasOwnProperty.call(object, key);

function cleanString(value, maxLength) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  if (typeof value !== "string") return undefined;
  const cleaned = value.trim();
  if (!cleaned) return null;
  if (cleaned.length > maxLength) return undefined;
  return cleaned;
}

function validateRegistration(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "회원가입 정보를 확인해 주세요." };
  }
  // 이전 클라이언트가 보내더라도 민감한 식별번호를 저장하지 않도록 차단합니다.
  if (hasOwn(body, "residentNum") || hasOwn(body, "RESIDENT_NUM")) {
    return { error: "회원가입에는 주민등록번호가 필요하지 않습니다." };
  }

  const userName = cleanString(body.userName, 50);
  const userId = cleanString(body.userId, 50);
  const email = cleanString(body.email, 100);
  const phone = cleanString(body.phone, 20);
  const gender = cleanString(body.gender, 10);
  const zipcode = cleanString(body.zipcode, 10);
  const address1 = cleanString(body.address1, 200);
  const address2 = cleanString(body.address2, 200);
  const userPw = body.userPw;

  if (!userName || !userId || !email || userId.length < 3) {
    return { error: "이름, 아이디, 이메일을 올바르게 입력해 주세요." };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "이메일 주소를 올바르게 입력해 주세요." };
  }
  if (
    typeof userPw !== "string" ||
    userPw.length < 8 ||
    Buffer.byteLength(userPw, "utf8") > 72
  ) {
    return { error: "비밀번호는 8자 이상, 72바이트 이하로 입력해 주세요." };
  }
  if ([phone, gender, zipcode, address1, address2].includes(undefined)) {
    return { error: "선택 입력 항목의 형식이나 길이가 올바르지 않습니다." };
  }
  if (phone && !/^[0-9+()\-\s]{7,20}$/.test(phone)) {
    return { error: "휴대전화번호 형식을 확인해 주세요." };
  }
  if (gender && !["male", "female"].includes(gender)) {
    return { error: "성별 입력값을 확인해 주세요." };
  }

  const consents = body.consents;
  if (!consents || typeof consents !== "object" || Array.isArray(consents)) {
    return { error: "가입 약관의 동의 및 안내 확인이 필요합니다." };
  }
  if (
    consents.terms?.agreed !== true ||
    consents.privacyNotice?.acknowledged !== true
  ) {
    return {
      error: "필수 이용약관 동의 및 개인정보 처리 안내 확인이 필요합니다.",
    };
  }
  if (
    consents.terms.version !== POLICY_VERSION ||
    consents.privacyNotice.version !== POLICY_VERSION
  ) {
    return {
      error:
        "약관이 업데이트되었습니다. 페이지를 새로고침하고 다시 확인해 주세요.",
      status: 409,
    };
  }
  if (
    typeof consents.marketingEmail !== "boolean" ||
    typeof consents.marketingSms !== "boolean"
  ) {
    return { error: "마케팅 수신 여부를 확인해 주세요." };
  }
  if (
    (hasOwn(body, "isMailAgreed") &&
      body.isMailAgreed !== consents.marketingEmail) ||
    (hasOwn(body, "isSnsAgreed") && body.isSnsAgreed !== consents.marketingSms)
  ) {
    return { error: "마케팅 수신 동의 정보가 일치하지 않습니다." };
  }
  if (consents.marketingSms && !phone) {
    return { error: "문자 수신에 동의한 경우 연락처를 입력해 주세요." };
  }

  return {
    value: {
      userName,
      userId,
      userPw,
      email: email.toLowerCase(),
      phone,
      gender,
      zipcode,
      address1,
      address2,
      marketingEmail: consents.marketingEmail,
      marketingSms: consents.marketingSms,
    },
  };
}

function createRegistrationRouter({ AppDataSource }) {
  if (!AppDataSource) throw new Error("AppDataSource가 필요합니다.");
  const router = express.Router();
  router.use((_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  router.post("/register", async (req, res) => {
    const result = validateRegistration(req.body);
    if (result.error) {
      return res.status(result.status || 400).json({
        success: false,
        message: result.error,
      });
    }
    const input = result.value;
    try {
      const hashedPw = await bcrypt.hash(input.userPw, 12);
      const now = new Date();
      const dateKey = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("");
      // CHART_NO VARCHAR2(20): C(1) + YYYYMMDD(8) + 난수 HEX 10자리 = 19자
      const chartNo = `C${dateKey}${crypto.randomBytes(5).toString("hex").toUpperCase()}`;

      await AppDataSource.transaction(async (manager) => {
        const memberRepo = manager.getRepository(Member);
        const member = await memberRepo.save({
          CHART_NO: chartNo,
          USER_NAME: input.userName,
          USER_ID: input.userId,
          USER_PW: hashedPw,
          EMAIL: input.email,
          PHONE: input.phone,
          IS_MAIL_AGREED: input.marketingEmail ? "Y" : "N",
          IS_SNS_AGREED: input.marketingSms ? "Y" : "N",
          GENDER: input.gender,
          ZIPCODE: input.zipcode,
          ADDRESS1: input.address1,
          ADDRESS2: input.address2,
        });

        if (!member?.USER_IDX) {
          throw new Error("회원 ID 생성에 실패했습니다.");
        }
        for (const [type, agreed] of [
          ["TERMS", true],
          ["PRIVACY_NOTICE", true],
          ["MARKETING_EMAIL", input.marketingEmail],
          ["MARKETING_SMS", input.marketingSms],
        ]) {
          await manager.query(
            `INSERT INTO MEMBER_REGISTRATION_CONSENT
               (USER_IDX, CONSENT_TYPE, STATUS, POLICY_VERSION)
             VALUES (:1, :2, :3, :4)`,
            [member.USER_IDX, type, agreed ? "Y" : "N", POLICY_VERSION],
          );
        }
      });
      return res.status(201).json({
        success: true,
        message: "회원가입이 완료되었습니다.",
      });
    } catch (error) {
      if (error?.errorNum === 1 || /ORA-00001/.test(error?.message || "")) {
        return res.status(409).json({
          success: false,
          message: "이미 사용 중인 회원 정보입니다.",
        });
      }
      console.error("[register] 회원가입 저장 실패:", error);
      return res.status(500).json({
        success: false,
        message: "회원가입 중 서버 오류가 발생했습니다.",
      });
    }
  });

  return router;
}

module.exports = { createRegistrationRouter, validateRegistration };
