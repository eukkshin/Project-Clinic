import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

const API_INTERNAL_URL =
  process.env.ADMIN_API_INTERNAL_URL ?? "http://localhost:4000";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // 백엔드에서 서명/권한을 확인하는 쿠키이며 브라우저에서 admin_token=true로 조작 불가.
  const cookie = request.headers.get("cookie") ?? "";
  const isLogin = pathname === "/admin" || pathname === "/admin/login";

  if (!cookie.includes("ahns_admin_session=")) {
    return isLogin
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/admin", request.url));
  }
  try {
    const response = await fetch(`${API_INTERNAL_URL}/api/admin/session/me`, {
      headers: { cookie },
      cache: "no-store",
    });
    if (response.ok) {
      return isLogin
        ? NextResponse.redirect(new URL("/admin/root", request.url))
        : NextResponse.next();
    }
  } catch {
    /* 백엔드 접속 실패 시 접근 차단 */
  }
  return isLogin
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/admin", request.url));
}

export const config = { matcher: ["/admin/:path*"] };
