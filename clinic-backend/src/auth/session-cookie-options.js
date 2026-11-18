"use strict";
// For cross-origin static frontends, a production cookie must be Secure + SameSite=None.
// Browser-level third-party cookie blocking still requires a same-site API domain/proxy.
function sessionCookieOptions() {
  const production = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: production,
    sameSite: production ? "none" : "lax",
    path: "/",
  };
}
module.exports = { sessionCookieOptions };
