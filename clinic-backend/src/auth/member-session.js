"use strict";

const jwt = require("jsonwebtoken");
const {
  COOKIE_NAME,
  JWT_ISSUER,
  JWT_AUDIENCE,
} = require("../middleware/authenticateMember");

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function issueMemberSession(_req, res, member) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required to issue a member session");
  }

  const userIdx = Number(member?.USER_IDX);
  const version = Number(member?.SESSION_VERSION);
  if (
    !Number.isSafeInteger(userIdx) ||
    userIdx <= 0 ||
    !Number.isSafeInteger(version) ||
    version < 0
  ) {
    throw new Error("Invalid member session claims");
  }

  const token = jwt.sign({ sv: version }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    subject: String(userIdx),
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    expiresIn: "8h",
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS,
  });
}

module.exports = { issueMemberSession };
