"use client";

import { useEffect, useState } from 'react';

/**
 * Header와 브랜드 페이지 내부 메뉴의 공통 규칙.
 * 실제 운영 설정의 원본은 GET /api/admin/nav 의 MENUS입니다.
 * 관리자가 병원소개 하위 메뉴를 입력하면 이름/주소/순서를 그대로 따릅니다.
 */
export interface AboutLink {
  name: string;
  url: string;
}

export interface AboutNavigationMenu {
  name: string;
  url: string;
  children?: AboutLink[];
}

export const DEFAULT_ABOUT_LINKS: AboutLink[] = [
  { name: "브랜드 소개", url: "/about/brand" },
  { name: "진료 철학", url: "/about/philosophy" },
  { name: "의료진 소개", url: "/about/doctors" },
  { name: "진료 환경", url: "/about/facilities" },
  { name: "안전 시스템", url: "/about/safety" },
  { name: "오시는 길", url: "/about/location" },
];

function isSafeLink(url: string): boolean {
  const value = url.trim();
  return (
    (value.startsWith("/") && !value.startsWith("//")) ||
    /^https?:\/\//i.test(value)
  );
}

function isAboutMenu(menu: AboutNavigationMenu): boolean {
  const name = menu.name.replace(/\s/g, "");
  return (
    name.includes("병원소개") ||
    name.toUpperCase() === "ABOUT" ||
    /^\/about(?:\/|$)/.test(menu.url) ||
    Boolean(menu.children?.some((child) => /^\/about\//.test(child.url)))
  );
}

/** 기존 Header 타입/메뉴 구조를 보존하고 병원소개 메뉴만 보완합니다. */
export function withAboutNavigation<T extends AboutNavigationMenu>(
  menus: readonly T[],
): T[] {
  return menus.map((menu) => {
    if (!isAboutMenu(menu)) return menu;

    const adminChildren = Array.isArray(menu.children)
      ? menu.children.filter(
          (child) =>
            child &&
            typeof child.name === "string" &&
            child.name.trim().length > 0 &&
            typeof child.url === "string" &&
            isSafeLink(child.url),
        )
      : [];

    return {
      ...menu,
      url: menu.url === "/" ? "/about/brand" : menu.url,
      children: adminChildren.length ? adminChildren : [...DEFAULT_ABOUT_LINKS],
    } as T;
  });
}

export function getAboutLinks(
  menus: readonly AboutNavigationMenu[],
): AboutLink[] {
  const group = withAboutNavigation(menus).find(isAboutMenu);
  return group?.children ? [...group.children] : [];
}

export function isAboutLinkActive(pathname: string, url: string): boolean {
  if (!url.startsWith("/") || url.startsWith("//")) return false;
  const path = url.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  return pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
}

interface NavResponse {
  success?: boolean;
  data?: { MENUS?: unknown } | null;
}

function readNavigationMenus(input: unknown): AboutNavigationMenu[] | null {
  let value: unknown = input;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (!Array.isArray(value)) return null;

  return value
    .filter(
      (item): item is Record<string, unknown> =>
        item !== null &&
        typeof item === "object" &&
        typeof item.name === "string" &&
        typeof item.url === "string",
    )
    .map((item) => ({
      name: String(item.name),
      url: String(item.url),
      children: Array.isArray(item.children)
        ? item.children
            .filter(
              (child): child is AboutLink =>
                child !== null &&
                typeof child === "object" &&
                typeof child.name === "string" &&
                typeof child.url === "string",
            )
            .map((child) => ({ name: child.name, url: child.url }))
        : [],
    }));
}

/**
 * 브랜드 콘텐츠용 메뉴. Header와 같은 관리자 내비게이션 API를 참조합니다.
 * 네트워크 오류 시에는 기본 메뉴를 유지하고, 관리자 설정 성공 시에는 그 메뉴를 우선합니다.
 */
export function useAboutNavigation(): AboutLink[] {
  const [links, setLinks] = useState<AboutLink[]>(DEFAULT_ABOUT_LINKS);

  useEffect(() => {
    const controller = new AbortController();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

    async function load() {
      try {
        const response = await fetch(`${apiUrl}/api/admin/nav`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) return;
        const payload: NavResponse = await response.json();
        if (controller.signal.aborted || !payload.success) return;
        const menus = readNavigationMenus(payload.data?.MENUS);
        if (menus !== null) setLinks(getAboutLinks(menus));
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("병원소개 내비게이션 조회 실패:", error);
        }
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  return links;
}
