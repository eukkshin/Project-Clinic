import { NextResponse } from "next/server";

import { isAppLocale, localeCookieName } from "@/i18n/config";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON" },
      { status: 400 },
    );
  }

  const locale =
    typeof payload === "object" && payload !== null && "locale" in payload
      ? (payload as { locale?: unknown }).locale
      : undefined;

  if (!isAppLocale(locale)) {
    return NextResponse.json(
      { success: false, message: "Unsupported locale" },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ success: true, locale });
  response.cookies.set(localeCookieName, locale, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
