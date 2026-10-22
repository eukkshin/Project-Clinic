import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("admin_token")?.value;

  if (pathname === "/admin" || pathname === "/admin/login") {
    if (token) {
      return NextResponse.redirect(new URL("/admin/root", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }
}

// The middleware only runs on admin pages.
export const config = {
  matcher: ["/admin/:path*"],
};
