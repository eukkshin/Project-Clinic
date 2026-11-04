import { NextResponse } from "next/server";

import { defaultLocale, isAppLocale, localeCookieName } from "./i18n/config";
import { localizedPath, splitLocalePath } from "./i18n/url";

import type { NextRequest } from "next/server";

const ADMIN_API_INTERNAL_URL =
  process.env.ADMIN_API_INTERNAL_URL ?? "http://localhost:4000";

export async function proxy(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  const { locale: urlLocale, pathname: barePath } =
    splitLocalePath(currentPath);

  // ============================================
  // 1. 다국어 접두사가 붙은 관리자/API 경로 처리
  // ============================================

  if (urlLocale && /^\/(admin|api)(?:\/|$)/.test(barePath)) {
    const target = request.nextUrl.clone();
    target.pathname = barePath;

    return NextResponse.redirect(target, 307);
  }

  // ============================================
  // 2. 관리자 세션 인증
  // Express의 ahns_admin_session 쿠키를 서명/권한 검증하는 API로 검사합니다.
  // ============================================
  if (currentPath === "/admin" || currentPath.startsWith("/admin/")) {
    const loginPage =
      currentPath === "/admin" || currentPath === "/admin/login";
    const session = request.cookies.get("ahns_admin_session")?.value;

    if (!session) {
      return loginPage
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/admin", request.url));
    }

    try {
      const response = await fetch(
        `${ADMIN_API_INTERNAL_URL}/api/admin/session/me`,
        {
          headers: { cookie: request.headers.get("cookie") ?? "" },
          cache: "no-store",
          signal: AbortSignal.timeout(4000),
        },
      );
      if (response.ok) {
        return loginPage
          ? NextResponse.redirect(new URL("/admin/root", request.url))
          : NextResponse.next();
      }
    } catch {
      // 검증 서버에 연결할 수 없을 때는 관리자 페이지 접근을 차단합니다.
    }
    return loginPage
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/admin", request.url));
  }

  // ============================================
  // 3. GET / HEAD 이외 요청 처리
  // ============================================

  if (request.method !== "GET" && request.method !== "HEAD") {
    if (!urlLocale) {
      return NextResponse.next();
    }

    const target = request.nextUrl.clone();
    target.pathname = barePath;

    const headers = new Headers(request.headers);
    headers.set("x-ahns-locale", urlLocale);

    return NextResponse.rewrite(target, {
      request: { headers },
    });
  }

  // ============================================
  // 4. 기본 언어(KO) 접두사 제거
  // ============================================

  if (urlLocale === defaultLocale) {
    const target = request.nextUrl.clone();
    target.pathname = barePath;

    const response = NextResponse.redirect(target, 308);

    response.cookies.set(localeCookieName, defaultLocale, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  }

  // ============================================
  // 5. URL 언어에 맞춰 내부 Rewrite
  // ============================================

  if (urlLocale) {
    const target = request.nextUrl.clone();
    target.pathname = barePath;

    const headers = new Headers(request.headers);
    headers.set("x-ahns-locale", urlLocale);

    const response = NextResponse.rewrite(target, {
      request: { headers },
    });

    response.cookies.set(localeCookieName, urlLocale, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  }

  // ============================================
  // 6. 쿠키에 저장된 언어 복원
  // ============================================

  const saved = request.cookies.get(localeCookieName)?.value;

  const locale = isAppLocale(saved) ? saved : defaultLocale;

  if (locale !== defaultLocale) {
    const target = request.nextUrl.clone();

    target.pathname = localizedPath(currentPath, locale);

    return NextResponse.redirect(target, 307);
  }

  // ============================================
  // 7. 한국어 기본 페이지
  // ============================================

  return NextResponse.next();
}

// ============================================
// Proxy 적용 경로
// ============================================

export const config = {
  matcher: [
    // 관리자 페이지
    "/admin/:path*",

    // 일반 페이지 (다국어 적용)
    "/((?!api(?:/|$)|admin(?:/|$)|_next(?:/|$)|_vercel(?:/|$)|.*\\..*).*)",
  ],
};
