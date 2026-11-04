"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { API_ORIGIN } from "@/lib/api/config";
import { recordSearchKeyword } from "@/lib/search/recordSearchKeyword";

import * as S from "./PopularSearches.styles";

type PopularItem = {
  rank: number;
  keyword: string;
  count: number | null;
};

type PopularResponse = {
  success: boolean;
  mode: "popular" | "recommended";
  periodDays: number;
  items: PopularItem[];
};

const recommended: PopularItem[] = [
  "눈성형",
  "코성형",
  "리프팅",
  "보톡스",
  "필러",
].map((keyword, index) => ({ rank: index + 1, keyword, count: null }));

interface Props {
  /** HeaderSearch의 open prop을 그대로 전달: 닫혀 있을 때 요청하지 않음 */
  enabled?: boolean;
  /** 검색 결과 페이지로 이동 직전에 기존 검색 드롭다운 닫기 */
  onNavigate?: () => void;
}

/**
 * 기존 SearchPanel 내부에 넣는 순위 목록입니다.
 * 이 컴포넌트는 패널 배경/레이아웃/헤더 검색창을 변경하지 않습니다.
 */
export default function PopularSearches({ enabled = true, onNavigate }: Props) {
  const router = useRouter();
  const locale = useLocale();
  const tSearch = useTranslations("Search");
  const [items, setItems] = useState<PopularItem[]>(recommended);
  const [mode, setMode] = useState<"popular" | "recommended">("recommended");

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const controller = new AbortController();

    const refresh = async () => {
      try {
        const response = await fetch(`${API_ORIGIN}/api/search/popular`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("인기 검색어 요청 실패");
        const payload: PopularResponse = await response.json();
        if (!payload.success || !Array.isArray(payload.items))
          throw new Error("잘못된 응답");
        if (!active) return;
        setItems(payload.items.slice(0, 5));
        setMode(payload.mode === "popular" ? "popular" : "recommended");
      } catch {
        // 집계 DB가 준비되지 않았거나 서버 연결이 실패했으면 추천 목록을 노출합니다.
        if (!active || controller.signal.aborted) return;
        setItems(recommended);
        setMode("recommended");
      }
    };

    void refresh();
    // 열려 있는 동안 5분마다 최신 순위를 가져옵니다.
    const timer = window.setInterval(
      () => {
        void refresh();
      },
      5 * 60 * 1000,
    );
    return () => {
      active = false;
      window.clearInterval(timer);
      controller.abort();
    };
  }, [enabled]);

  function openKeyword(keyword: string) {
    recordSearchKeyword(keyword);
    onNavigate?.();
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  }

  return (
    <S.Root
      aria-label={
        mode === "popular" ? tSearch("popular") : tSearch("recommended")
      }
    >
      <S.Heading>
        <S.Eyebrow>AHNS / DISCOVER</S.Eyebrow>
        <S.Title>
          {mode === "popular" ? tSearch("popular") : tSearch("recommended")}
        </S.Title>
        <S.Note>
          {mode === "popular"
            ? tSearch("popularPeriod")
            : tSearch("recommendedNote")}
        </S.Note>
      </S.Heading>
      <S.List>
        {items.map((item, index) => (
          <S.Item key={item.keyword}>
            <S.KeywordButton
              type="button"
              onClick={() => openKeyword(item.keyword)}
            >
              <S.Index aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </S.Index>
              <S.Keyword>{item.keyword}</S.Keyword>
              {mode === "popular" && item.count !== null && (
                <S.Count aria-label={`${item.count} ${tSearch("countUnit")}`}>
                  {item.count.toLocaleString(locale)}
                  {tSearch("countUnit")}
                </S.Count>
              )}
            </S.KeywordButton>
          </S.Item>
        ))}
      </S.List>
      <S.Footer>
        {mode === "popular"
          ? tSearch("popularFooter")
          : tSearch("recommendedFooter")}
      </S.Footer>
    </S.Root>
  );
}
