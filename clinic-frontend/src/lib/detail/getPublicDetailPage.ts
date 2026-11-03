import "server-only";

import { cache } from "react";

import type {
  DetailPageData,
  DetailSectionContent,
  DetailSectionType,
} from "@/types/detail";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length ? value : undefined;
}

const sectionTypes = new Set<DetailSectionType>([
  "INTRO",
  "FEATURES",
  "PROCESS",
  "GALLERY",
  "FAQ",
  "TEXT",
  "CTA",
]);

/** 백엔드 {success, data} 응답을 현재 DetailLayout props로 변환합니다. */
export function parsePublicDetailPage(payload: unknown): DetailPageData {
  if (
    !isRecord(payload) ||
    !isRecord(payload.hero) ||
    !Array.isArray(payload.sections)
  ) {
    throw new Error("상세페이지 API의 data 구조가 올바르지 않습니다.");
  }
  const hero = payload.hero;
  if (
    typeof payload.category !== "string" ||
    typeof payload.slug !== "string" ||
    typeof payload.title !== "string" ||
    typeof hero.title !== "string"
  ) {
    throw new Error("상세페이지에 필수 정보가 누락되었습니다.");
  }

  const sections = payload.sections.map((raw, index) => {
    if (
      !isRecord(raw) ||
      typeof raw.id !== "string" ||
      !/^[a-z0-9-]+$/.test(raw.id) ||
      typeof raw.title !== "string" ||
      typeof raw.type !== "string" ||
      !sectionTypes.has(raw.type as DetailSectionType)
    ) {
      throw new Error(
        `상세페이지 섹션 ${index + 1}의 데이터가 올바르지 않습니다.`,
      );
    }
    // Oracle CLOB은 Express service에서 JSON 파싱을 마친 상태여야 합니다.
    if (!isRecord(raw.content)) {
      throw new Error(
        `상세페이지 섹션 ${index + 1}의 content가 JSON 객체가 아닙니다.`,
      );
    }
    return {
      id: raw.id,
      type: raw.type as DetailSectionType,
      title: raw.title,
      eyebrow: optionalString(raw.eyebrow),
      content: raw.content as DetailSectionContent,
    };
  });

  const seo = isRecord(payload.seo) ? payload.seo : {};
  return {
    category: payload.category,
    slug: payload.slug,
    title: payload.title,
    hero: {
      eyebrow: optionalString(hero.eyebrow),
      title: hero.title,
      description: optionalString(hero.description),
      imageUrl: optionalString(hero.imageUrl),
      imageAlt: optionalString(hero.imageAlt),
      imagePosition: optionalString(hero.imagePosition),
    },
    seo: {
      title: optionalString(seo.title),
      description: optionalString(seo.description),
    },
    sections,
  };
}

/**
 * App Router 서버 컴포넌트 전용. 데이터 수정 후 새로고침하면 DB 최신값을 받습니다.
 * React cache는 같은 요청 안에서 page + generateMetadata의 중복 조회만 막습니다.
 */
export const getPublicDetailPage = cache(
  async (category: string, slug: string): Promise<DetailPageData | null> => {
    if (
      !/^[a-z0-9-]{1,80}$/.test(category) ||
      !/^[a-z0-9-]{1,120}$/.test(slug)
    ) {
      return null;
    }

    const origin = (
      process.env.DETAIL_API_ORIGIN ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://127.0.0.1:4000"
    ).replace(/\/+$/, "");

    const url = `${origin}/api/details/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`;
    let response: Response;
    try {
      response = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(12000),
      });
    } catch (error) {
      console.error("[Detail Page] Express 공개 API 접속 실패:", url, error);
      throw new Error("상세페이지 서버에 연결할 수 없습니다.");
    }

    if (response.status === 404) return null;
    if (!response.ok) {
      console.error(
        "[Detail Page] Express 공개 API 응답 오류:",
        response.status,
        url,
      );
      throw new Error(`상세페이지 서버 응답 오류 (${response.status})`);
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new Error("상세페이지 API가 유효하지 않은 JSON을 반환했습니다.");
    }
    if (!isRecord(body) || body.success !== true) {
      throw new Error("상세페이지 API의 응답 형식이 올바르지 않습니다.");
    }
    return parsePublicDetailPage(body.data);
  },
);
