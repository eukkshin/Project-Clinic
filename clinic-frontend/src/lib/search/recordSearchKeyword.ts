import { API_ORIGIN } from "@/lib/api/config";

/**
 * 실제 검색을 제출했을 때만 호출합니다.
 * API 실패가 검색 결과 페이지 이동을 방해하지 않도록 비차단 전송합니다.
 */
export function recordSearchKeyword(rawKeyword: string): void {
  const keyword = rawKeyword
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
  if (!keyword || typeof window === "undefined") return;

  void fetch(`${API_ORIGIN}/api/search/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: keyword }),
    keepalive: true,
    cache: "no-store",
  }).catch(() => {
    // 집계 실패는 검색 기능과 독립적으로 처리합니다.
  });
}
