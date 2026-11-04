"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { API_ORIGIN } from "@/lib/api/config";

import {
  HeaderNavMenu,
  mergePublishedProcedureMenus,
  PublicProcedureLink,
} from "./procedureNav";

/** 관리자 메뉴는 그대로 읽고, 공개 시술만 동적으로 덧입힌다. */
export function usePublishedProcedureMenus<T extends HeaderNavMenu>(
  menus: T[],
): T[] {
  const pathname = usePathname();
  const locale = useLocale();
  const [publicPages, setPublicPages] = useState<PublicProcedureLink[] | null>(
    null,
  );

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const response = await fetch(
          `${API_ORIGIN}/api/details/navigation?locale=${encodeURIComponent(locale)}`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const body: { success?: boolean; data?: unknown } =
          await response.json();
        if (!body.success || !Array.isArray(body.data)) {
          throw new Error("공개 상세메뉴 응답 형식이 잘못됐습니다.");
        }
        if (!controller.signal.aborted) {
          setPublicPages(body.data as PublicProcedureLink[]);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.warn(
            "[Header] 공개 상세메뉴 조회 실패, 기존 관리자 메뉴 유지:",
            error,
          );
          setPublicPages(null);
        }
      }
    };
    void load();
    return () => controller.abort();
  }, [pathname, locale]); // 페이지 또는 언어 변경 시 재조회

  return useMemo(
    () => mergePublishedProcedureMenus(menus, publicPages),
    [menus, publicPages],
  );
}
