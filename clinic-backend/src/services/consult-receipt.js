"use strict";
const crypto = require("node:crypto");
function tokenHash(token) {
  return crypto.createHash("sha256").update(token, "utf8").digest("hex");
}
function kstDate() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
}
async function issueReceipt(manager) {
  const rows = await manager.query(
    "SELECT CONSULT_RECEIPT_SEQ.NEXTVAL AS N FROM DUAL",
  );
  const value = Number(rows[0]?.N);
  if (!Number.isSafeInteger(value) || value < 1)
    throw new Error("상담 접수번호 시퀀스 오류");
  return `AHNS-${kstDate()}-${String(value).padStart(6, "0")}`;
}
function issueAccessKey() {
  return crypto.randomBytes(24).toString("base64url");
}
function isValidReceipt(value) {
  return typeof value === "string" && /^AHNS-\d{8}-\d{6,12}$/.test(value);
}
module.exports = { tokenHash, issueReceipt, issueAccessKey, isValidReceipt };
