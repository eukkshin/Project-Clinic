"use client";

import { useCallback } from "react";

import { normalizeLocale } from "@/i18n/config";
import { localizedPath } from "@/i18n/url";

export function useChangeLocale() {
  return useCallback(async (value: string) => {
    const locale = normalizeLocale(value);
    if (!locale) throw new Error(`Unsupported language selection: ${value}`);

    // 기존 API 계약을 유지하여 쿠키 저장. URL 기반 언어도 함께 전환합니다.
    const response = await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify({ locale }),
    });
    if (!response.ok) throw new Error("Failed to save the selected language");

    // 루트 레이아웃의 <html lang>과 번역 Provider까지 확실히 교체하기 위해
    // 언어를 바꿀 때만 문서 전체를 새로 열고, 일반 페이지 탐색은 Next 라우팅 유지.
    const nextPath = localizedPath(window.location.pathname, locale);
    const destination =
      nextPath + window.location.search + window.location.hash;
    if (
      destination ===
      window.location.pathname + window.location.search + window.location.hash
    ) {
      window.location.reload();
    } else {
      window.location.assign(destination);
    }
  }, []);
}
