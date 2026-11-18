"use strict";

const express = require("express");

const bcrypt = require("bcrypt");

const crypto = require("node:crypto");

const Member = require("../entity/Member");

const { validateRegistration } = require("./registration.routes");

const { authenticateMember } = require("../middleware/authenticateMember");

const {
  isRateLimited,

  recordLoginFailure,

  clearAccountFailures,
} = require("../middleware/loginRateLimit");

const {
  PROVIDERS,

  randomToken,

  hashToken,

  providerSettings,

  authorizationUrl,

  verifiedSubject,
} = require("../auth/social-oidc");

const LOCALES = new Set(["ko", "en", "ja", "zh-CN", "zh-TW"]);

const STATE_COOKIE = "ahns_social_state";

const SIGNUP_COOKIE = "ahns_social_signup";

const SIGNUP_TTL_MINUTES = 10;

function signupCookieOptions() {
  return { ...cookieOptions(), maxAge: SIGNUP_TTL_MINUTES * 60 * 1000 };
}

function invalidSignup(res) {
  return res

    .status(401)

    .json({ success: false, errorCode: "SOCIAL_SIGNUP_EXPIRED" });
}

// OAuth redirects use one trusted HTTPS frontend, independently of the API CORS list.
function socialFrontendOrigin() {
  const configured = process.env.SOCIAL_FRONTEND_ORIGIN;
  if (!configured) {
    throw new Error("SOCIAL_FRONTEND_ORIGIN is required");
  }

  const url = new URL(configured);
  if (
    (url.protocol !== "https:" &&
      !(
        process.env.NODE_ENV !== "production" &&
        url.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(url.hostname)
      )) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error("SOCIAL_FRONTEND_ORIGIN must be a valid HTTPS origin");
  }
  return url.origin;
}

function frontendUrl(locale, code, destination = "/register/login") {
  const url = new URL(socialFrontendOrigin());
  const basePath = (process.env.SOCIAL_FRONTEND_BASE_PATH || "")
    .trim()
    .replace(/\/+$/, "");
  if (
    basePath &&
    (!basePath.startsWith("/") ||
      basePath.includes("//") ||
      basePath.includes("..") ||
      basePath.includes("?") ||
      basePath.includes("#"))
  ) {
    throw new Error("SOCIAL_FRONTEND_BASE_PATH must be a safe path");
  }
  if (!destination.startsWith("/") || destination.startsWith("//")) {
    throw new Error("Invalid social redirect destination");
  }
  const localePath = locale !== "ko" && LOCALES.has(locale) ? `/${locale}` : "";
  url.pathname = `${basePath}${localePath}${destination}`;
  if (code) url.searchParams.set("social", code);
  return url.href;
}

function cookieOptions() {
  return {
    httpOnly: true,

    secure: process.env.NODE_ENV === "production",

    sameSite: "lax",

    path: "/api/auth/social",

    maxAge: 10 * 60 * 1000,
  };
}

function sameOrigin(req) {
  try {
    return req.get("Origin") === socialFrontendOrigin();
  } catch {
    return false;
  }
}

async function saveFlow(ds, flow) {
  await ds.query(
    `INSERT INTO SOCIAL_AUTH_FLOW_TB

       (STATE_HASH, PROVIDER, CODE_VERIFIER, NONCE, INTENT, USER_IDX, LOCALE, EXPIRES_AT)

     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7,

       datetime('now', '+10 minutes'))`,

    [
      hashToken(flow.state),

      flow.provider.toUpperCase(),

      flow.verifier,

      flow.nonce,

      flow.intent,

      flow.userIdx,

      flow.locale,
    ],
  );
}

async function consumeFlow(ds, state, provider) {
  return ds.transaction(async (manager) => {
    const rows = await manager.query(
      `SELECT PROVIDER, CODE_VERIFIER, NONCE, INTENT, USER_IDX, LOCALE

       FROM SOCIAL_AUTH_FLOW_TB

       WHERE STATE_HASH = ?1 AND USED_AT IS NULL AND EXPIRES_AT > CURRENT_TIMESTAMP`,

      [hashToken(state)],
    );

    const flow = rows[0];

    if (!flow || flow.PROVIDER !== provider.toUpperCase()) return null;

    await manager.query(
      `UPDATE SOCIAL_AUTH_FLOW_TB SET USED_AT = CURRENT_TIMESTAMP

       WHERE STATE_HASH = ?1`,

      [hashToken(state)],
    );

    return flow;
  });
}

/**

 * Mount at /api/auth/social (not elsewhere).

 * issueMemberSession MUST be the same session issuer used by the existing /api/login.

 * This router does not create new members; unlinked visitors are safely sent to normal signup.

 */

function createSocialAuthRouter({ AppDataSource, issueMemberSession }) {
  if (!AppDataSource || typeof issueMemberSession !== "function") {
    throw new Error(
      "AppDataSource and existing issueMemberSession are required",
    );
  }

  // Do not validate the API CORS allowlist here; it can contain HTTP origins.
  socialFrontendOrigin();

  const router = express.Router();

  router.use((_req, res, next) => {
    res.set("Cache-Control", "no-store");

    next();
  });

  router.get("/providers", (_req, res) =>
    res.json({
      success: true,

      providers: Object.keys(PROVIDERS).filter((name) =>
        Boolean(providerSettings(name)),
      ),
    }),
  );

  async function begin(req, res, { intent, userIdx = null }) {
    const provider = req.params.provider;

    const settings = providerSettings(provider);

    if (!settings)
      return res

        .status(503)

        .json({ success: false, errorCode: "SOCIAL_PROVIDER_UNAVAILABLE" });

    if (!process.env.SOCIAL_FRONTEND_ORIGIN)
      return res

        .status(503)

        .json({ success: false, errorCode: "SOCIAL_PROVIDER_UNAVAILABLE" });

    const locale = LOCALES.has(req.query.locale) ? req.query.locale : "ko";

    const flow = {
      state: randomToken(),

      verifier: randomToken(),

      nonce: randomToken(),

      provider,

      intent,

      userIdx,

      locale,
    };

    await saveFlow(AppDataSource, flow);

    res.cookie(STATE_COOKIE, flow.state, cookieOptions());

    const url = authorizationUrl(settings, flow);

    if (intent === "login") return res.redirect(302, url);

    return res.json({ success: true, authorizationUrl: url });
  }

  router.get("/:provider/start", async (req, res) => {
    try {
      return await begin(req, res, { intent: "login" });
    } catch (error) {
      console.error("[social] start:", error);

      return res

        .status(500)

        .json({ success: false, errorCode: "SOCIAL_PROVIDER_UNAVAILABLE" });
    }
  });

  router.get("/connections", authenticateMember, async (req, res) => {
    try {
      const rows = await AppDataSource.query(
        `SELECT PROVIDER, LINKED_AT FROM SOCIAL_ACCOUNT_TB

         WHERE USER_IDX = ?1 ORDER BY LINKED_AT`,

        [req.user.userIdx],
      );

      return res.json({
        success: true,

        providers: rows.map((r) => ({
          provider: r.PROVIDER.toLowerCase(),

          linkedAt: r.LINKED_AT,
        })),
      });
    } catch (error) {
      console.error("[social] connections:", error);

      return res

        .status(500)

        .json({ success: false, errorCode: "SOCIAL_SERVER_ERROR" });
    }
  });

  // A pending identity is a server-side one-use record, never a trusted browser payload.

  router.get("/signup/pending", async (req, res) => {
    const token = req.cookies?.[SIGNUP_COOKIE];

    if (typeof token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(token))
      return invalidSignup(res);

    try {
      const rows = await AppDataSource.query(
        `SELECT PROVIDER, LOCALE FROM SOCIAL_SIGNUP_PENDING_TB

         WHERE TOKEN_HASH = ?1 AND USED_AT IS NULL AND EXPIRES_AT > CURRENT_TIMESTAMP`,

        [hashToken(token)],
      );

      if (!rows[0]) return invalidSignup(res);

      return res.json({
        success: true,

        provider: rows[0].PROVIDER.toLowerCase(),

        locale: rows[0].LOCALE,
      });
    } catch (error) {
      console.error("[social] signup pending:", error);

      return res

        .status(500)

        .json({ success: false, errorCode: "SOCIAL_SERVER_ERROR" });
    }
  });

  router.post("/signup/complete", async (req, res) => {
    if (!sameOrigin(req))
      return res

        .status(403)

        .json({ success: false, errorCode: "SOCIAL_REQUEST_DENIED" });

    const token = req.cookies?.[SIGNUP_COOKIE];

    if (typeof token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(token))
      return invalidSignup(res);

    const validated = validateRegistration(req.body);

    if (validated.error)
      return res

        .status(validated.status || 400)

        .json({ success: false, message: validated.error });

    const input = validated.value;

    try {
      const now = new Date();

      const dateKey = [
        now.getFullYear(),

        String(now.getMonth() + 1).padStart(2, "0"),

        String(now.getDate()).padStart(2, "0"),
      ].join("");

      const chartNo = `C${dateKey}${crypto.randomBytes(5).toString("hex").toUpperCase()}`;

      const hashedPw = await bcrypt.hash(input.userPw, 12);

      const policyVersion =
        process.env.REGISTRATION_POLICY_VERSION || "2026-11-04-draft";

      const member = await AppDataSource.transaction(async (manager) => {
        const rows = await manager.query(
          `SELECT PROVIDER, PROVIDER_USER_ID FROM SOCIAL_SIGNUP_PENDING_TB

           WHERE TOKEN_HASH = ?1 AND USED_AT IS NULL AND EXPIRES_AT > CURRENT_TIMESTAMP`,

          [hashToken(token)],
        );

        const pending = rows[0];

        if (!pending) {
          const err = new Error("SOCIAL_SIGNUP_EXPIRED");

          err.status = 401;

          throw err;
        }

        // Provider identity may have been linked in another session after OAuth.

        const linked = await manager.query(
          `SELECT SOCIAL_ID FROM SOCIAL_ACCOUNT_TB WHERE PROVIDER = ?1 AND PROVIDER_USER_ID = ?2`,

          [pending.PROVIDER, pending.PROVIDER_USER_ID],
        );

        if (linked.length) {
          const err = new Error("SOCIAL_ACCOUNT_ALREADY_LINKED");

          err.status = 409;

          throw err;
        }

        const created = await manager.getRepository(Member).save({
          CHART_NO: chartNo,

          USER_NAME: input.userName,

          USER_ID: input.userId,

          STATUS: "정상",

          IS_ADMIN: 0,

          SESSION_VERSION: 0,

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

        for (const [type, agreed] of [
          ["TERMS", true],

          ["PRIVACY_NOTICE", true],

          ["MARKETING_EMAIL", input.marketingEmail],

          ["MARKETING_SMS", input.marketingSms],
        ]) {
          await manager.query(
            `INSERT INTO MEMBER_REGISTRATION_CONSENT (USER_IDX, CONSENT_TYPE, STATUS, POLICY_VERSION)

             VALUES (?1, ?2, ?3, ?4)`,

            [created.USER_IDX, type, agreed ? "Y" : "N", policyVersion],
          );
        }

        await manager.query(
          `INSERT INTO SOCIAL_ACCOUNT_TB (USER_IDX, PROVIDER, PROVIDER_USER_ID, LINKED_AT)

           VALUES (?1, ?2, ?3, CURRENT_TIMESTAMP)`,

          [created.USER_IDX, pending.PROVIDER, pending.PROVIDER_USER_ID],
        );

        await manager.query(
          `UPDATE SOCIAL_SIGNUP_PENDING_TB SET USED_AT = CURRENT_TIMESTAMP WHERE TOKEN_HASH = ?1`,

          [hashToken(token)],
        );

        return created;
      });

      res.clearCookie(SIGNUP_COOKIE, { path: signupCookieOptions().path });

      await issueMemberSession(req, res, member);

      return res.status(201).json({ success: true });
    } catch (error) {
      if (error.status)
        return res

          .status(error.status)

          .json({ success: false, errorCode: error.message });

      if (error?.errorNum === 1 || /ORA-00001/.test(error?.message || ""))
        return res

          .status(409)

          .json({ success: false, errorCode: "SOCIAL_SIGNUP_CONFLICT" });

      console.error("[social] signup complete:", error);

      return res

        .status(500)

        .json({ success: false, errorCode: "SOCIAL_SERVER_ERROR" });
    }
  });

  router.post("/:provider/unlink", authenticateMember, async (req, res) => {
    if (!sameOrigin(req))
      return res

        .status(403)

        .json({ success: false, errorCode: "SOCIAL_REQUEST_DENIED" });

    const provider = req.params.provider;

    if (!PROVIDERS[provider])
      return res

        .status(404)

        .json({ success: false, errorCode: "SOCIAL_PROVIDER_UNAVAILABLE" });

    const password = req.body?.currentPassword;

    if (typeof password !== "string" || !password)
      return res

        .status(400)

        .json({ success: false, errorCode: "SOCIAL_REAUTH_REQUIRED" });

    if (isRateLimited(req, req.user.userId))
      return res

        .status(429)

        .json({ success: false, errorCode: "SOCIAL_TOO_MANY_REQUESTS" });

    try {
      const member = await AppDataSource.getRepository(Member).findOne({
        where: { USER_IDX: req.user.userIdx },

        select: { USER_PW: true },
      });

      if (
        !member?.USER_PW ||
        !(await bcrypt.compare(password, member.USER_PW))
      ) {
        recordLoginFailure(req, req.user.userId);

        return res

          .status(401)

          .json({ success: false, errorCode: "SOCIAL_REAUTH_REQUIRED" });
      }

      clearAccountFailures(req, req.user.userId);

      const result = await AppDataSource.query(
        `DELETE FROM SOCIAL_ACCOUNT_TB WHERE USER_IDX = ?1 AND PROVIDER = ?2`,

        [req.user.userIdx, provider.toUpperCase()],
      );

      return res.json({ success: true });
    } catch (error) {
      console.error("[social] unlink:", error);

      return res

        .status(500)

        .json({ success: false, errorCode: "SOCIAL_SERVER_ERROR" });
    }
  });

  router.post("/:provider/link/start", authenticateMember, async (req, res) => {
    if (!sameOrigin(req))
      return res

        .status(403)

        .json({ success: false, errorCode: "SOCIAL_REQUEST_DENIED" });

    const password = req.body?.currentPassword;

    const userId = req.user.userId;

    if (isRateLimited(req, userId))
      return res

        .status(429)

        .json({ success: false, errorCode: "SOCIAL_TOO_MANY_REQUESTS" });

    if (typeof password !== "string" || !password)
      return res

        .status(400)

        .json({ success: false, errorCode: "SOCIAL_REAUTH_REQUIRED" });

    try {
      const member = await AppDataSource.getRepository(Member).findOne({
        where: { USER_IDX: req.user.userIdx },

        select: { USER_PW: true },
      });

      if (
        !member?.USER_PW ||
        !(await bcrypt.compare(password, member.USER_PW))
      ) {
        recordLoginFailure(req, userId);

        return res

          .status(401)

          .json({ success: false, errorCode: "SOCIAL_REAUTH_REQUIRED" });
      }

      clearAccountFailures(req, userId);

      return await begin(req, res, {
        intent: "link",

        userIdx: req.user.userIdx,
      });
    } catch (error) {
      console.error("[social] link start:", error);

      return res

        .status(500)

        .json({ success: false, errorCode: "SOCIAL_SERVER_ERROR" });
    }
  });

  router.get("/:provider/callback", async (req, res) => {
    const provider = req.params.provider;

    const state = req.query.state;

    const browserState = req.cookies?.[STATE_COOKIE];

    res.clearCookie(STATE_COOKIE, { path: cookieOptions().path });

    if (
      typeof state !== "string" ||
      typeof browserState !== "string" ||
      state.length !== 43 ||
      !/^[A-Za-z0-9_-]{43}$/.test(state) ||
      browserState.length !== state.length ||
      !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(browserState))
    ) {
      return res.redirect(303, frontendUrl("ko", "invalidState"));
    }

    let flow;

    try {
      flow = await consumeFlow(AppDataSource, state, provider);
    } catch (error) {
      console.error("[social] state:", error);

      return res.redirect(303, frontendUrl("ko", "errorGeneric"));
    }

    if (!flow) return res.redirect(303, frontendUrl("ko", "invalidState"));

    const locale = LOCALES.has(flow.LOCALE) ? flow.LOCALE : "ko";

    const go = (result, path) =>
      res.redirect(303, frontendUrl(locale, result, path));

    if (req.query.error) return go("cancelled");

    if (typeof req.query.code !== "string" || !req.query.code)
      return go("invalidState");

    const settings = providerSettings(provider);

    if (!settings) return go("errorProvider");

    try {
      const sub = await verifiedSubject(settings, {
        code: req.query.code,

        verifier: flow.CODE_VERIFIER,

        nonce: flow.NONCE,
      });

      if (flow.INTENT === "link") {
        return authenticateMember(req, res, async () => {
          if (req.user.userIdx !== Number(flow.USER_IDX))
            return go("invalidState");

          try {
            await AppDataSource.transaction(async (manager) => {
              // Both provider account and the member's single-provider mapping are unique.

              await manager.query(
                `INSERT INTO SOCIAL_ACCOUNT_TB (USER_IDX, PROVIDER, PROVIDER_USER_ID, LINKED_AT)

                 VALUES (?1, ?2, ?3, CURRENT_TIMESTAMP)`,

                [req.user.userIdx, provider.toUpperCase(), sub],
              );
            });

            return go("linked", "/mypage/accountsettings");
          } catch (error) {
            if (error?.errorNum === 1 || /ORA-00001/.test(error?.message || ""))
              return go("alreadyLinked");

            console.error("[social] link:", error);

            return go("errorGeneric");
          }
        });
      }

      const rows = await AppDataSource.query(
        `SELECT m.USER_IDX, m.USER_ID, m.USER_NAME, m.SESSION_VERSION, m.STATUS, m.IS_ADMIN

         FROM SOCIAL_ACCOUNT_TB a JOIN MEMBER_TB m ON m.USER_IDX = a.USER_IDX

         WHERE a.PROVIDER = ?1 AND a.PROVIDER_USER_ID = ?2`,

        [provider.toUpperCase(), sub],
      );

      const member = rows[0];

      if (!member) {
        // New provider identity: do not auto-merge accounts by email.

        // OAuth subject stays on the backend, guarded by one-time cookie + row lock.

        const signupToken = randomToken();

        await AppDataSource.query(
          `INSERT INTO SOCIAL_SIGNUP_PENDING_TB

           (TOKEN_HASH, PROVIDER, PROVIDER_USER_ID, LOCALE, EXPIRES_AT)

           VALUES (?1, ?2, ?3, ?4, datetime('now', '+10 minutes'))`,

          [hashToken(signupToken), provider.toUpperCase(), sub, locale],
        );

        res.cookie(SIGNUP_COOKIE, signupToken, signupCookieOptions());

        return go("signupRequired", "/register/social");
      }

      if (member.STATUS !== "정상" || Number(member.IS_ADMIN) !== 0)
        return go("errorGeneric");

      // Must set the same clinic_session policy as ordinary login; never issue a second auth type.

      await issueMemberSession(req, res, member);

      await AppDataSource.query(
        `UPDATE SOCIAL_ACCOUNT_TB SET LAST_LOGIN_AT = CURRENT_TIMESTAMP

         WHERE PROVIDER = ?1 AND PROVIDER_USER_ID = ?2`,

        [provider.toUpperCase(), sub],
      );

      return go("success");
    } catch (error) {
      console.error("[social] callback:", error);

      return go("errorProvider");
    }
  });

  return router;
}

module.exports = { createSocialAuthRouter };
