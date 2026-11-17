"use strict";

const crypto = require("node:crypto");

// Endpoints are pinned to the providers' documented OIDC endpoints.
const PROVIDERS = Object.freeze({
  kakao: {
    issuer: "https://kauth.kakao.com",
    authorization: "https://kauth.kakao.com/oauth/authorize",
    token: "https://kauth.kakao.com/oauth/token",
    jwks: "https://kauth.kakao.com/.well-known/jwks.json",
    scope: "openid",
  },
  naver: {
    issuer: "https://nid.naver.com",
    authorization: "https://nid.naver.com/oauth2/authorize",
    token: "https://nid.naver.com/oauth2/token",
    jwks: "https://nid.naver.com/oauth2/jwks",
    scope: "openid",
  },
  google: {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    authorization: "https://accounts.google.com/o/oauth2/v2/auth",
    token: "https://oauth2.googleapis.com/token",
    jwks: "https://www.googleapis.com/oauth2/v3/certs",
    scope: "openid email profile",
  },
});

const randomToken = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("base64url");
const hashToken = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");
const pkceChallenge = (verifier) =>
  crypto.createHash("sha256").update(verifier).digest("base64url");
const keySets = new Map();

function providerSettings(provider) {
  const info = PROVIDERS[provider];
  if (!info || process.env.SOCIAL_AUTH_ENABLED !== "true") return null;
  const prefix = `SOCIAL_${provider.toUpperCase()}_`;
  const clientId = process.env[`${prefix}CLIENT_ID`];
  const clientSecret = process.env[`${prefix}CLIENT_SECRET`];
  const apiOrigin = process.env.SOCIAL_API_ORIGIN;
  if (!clientId || !clientSecret || !apiOrigin) return null;
  const origin = new URL(apiOrigin);
  if (
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash ||
    (origin.protocol !== "https:" && origin.hostname !== "localhost")
  ) {
    throw new Error(
      "SOCIAL_API_ORIGIN must be an HTTPS origin (localhost permitted)",
    );
  }
  return {
    ...info,
    clientId,
    clientSecret,
    redirectUri: new URL(`/api/auth/social/${provider}/callback`, origin).href,
  };
}

function authorizationUrl(settings, { state, verifier, nonce }) {
  const url = new URL(settings.authorization);
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: settings.clientId,
    redirect_uri: settings.redirectUri,
    scope: settings.scope,
    state,
    nonce,
    code_challenge: pkceChallenge(verifier),
    code_challenge_method: "S256",
  }).toString();
  return url.href;
}

async function verifiedSubject(settings, { code, verifier, nonce }) {
  const response = await fetch(settings.token, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: settings.clientId,
      client_secret: settings.clientSecret,
      code,
      code_verifier: verifier,
      redirect_uri: settings.redirectUri,
    }),
    redirect: "error",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("SOCIAL_PROVIDER_TOKEN_FAILED");
  const tokens = await response.json();
  if (typeof tokens.id_token !== "string")
    throw new Error("SOCIAL_ID_TOKEN_MISSING");

  // jose is an audited JOSE library; never read JWT payload without signature validation.
  const { createRemoteJWKSet, jwtVerify } = await import("jose");
  if (!keySets.has(settings.jwks)) {
    keySets.set(settings.jwks, createRemoteJWKSet(new URL(settings.jwks)));
  }
  const jwks = keySets.get(settings.jwks);
  const { payload } = await jwtVerify(tokens.id_token, jwks, {
    algorithms: ["RS256"],
    issuer: settings.issuer,
    audience: settings.clientId,
    requiredClaims: ["sub", "nonce", "iat", "exp"],
    clockTolerance: 5,
  });
  if (
    payload.nonce !== nonce ||
    typeof payload.sub !== "string" ||
    !payload.sub ||
    payload.iat > Math.floor(Date.now() / 1000) + 60
  ) {
    throw new Error("SOCIAL_ID_TOKEN_INVALID");
  }
  if (
    Array.isArray(payload.aud) &&
    payload.aud.length > 1 &&
    payload.azp !== settings.clientId
  ) {
    throw new Error("SOCIAL_ID_TOKEN_AZP_INVALID");
  }
  return payload.sub;
}

module.exports = {
  PROVIDERS,
  randomToken,
  hashToken,
  providerSettings,
  authorizationUrl,
  verifiedSubject,
};
