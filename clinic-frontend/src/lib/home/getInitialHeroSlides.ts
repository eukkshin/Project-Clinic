/**
 * Hero 첫 이미지를 App Router 서버 렌더에서 노출해 request discovery를 앞당긴다.
 * 실패 시 기존 Hero.tsx useEffect가 클라이언트에서 재시도한다.
 */
export type InitialHeroSlide = {
  id: number;
  fileName: string;
  title: string;
  link: string;
  mediaType?: "IMAGE" | "VIDEO";
};

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000";

function isSlideItem(value: unknown): value is InitialHeroSlide {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "number" &&
    typeof item.fileName === "string" &&
    item.fileName.trim().length > 0 &&
    typeof item.title === "string" &&
    typeof item.link === "string"
  );
}

export async function getInitialHeroSlides(): Promise<InitialHeroSlide[]> {
  try {
    const response = await fetch(`${API_URL}/api/admin/visual`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(1200),
    });
    if (!response.ok) return [];
    const json: unknown = await response.json();
    if (!json || typeof json !== "object") return [];
    const payload = json as { success?: boolean; data?: { SLIDES?: unknown } };
    if (!payload.success) return [];
    const raw = payload.data?.SLIDES;
    const value: unknown = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(value) ? value.filter(isSlideItem) : [];
  } catch {
    return [];
  }
}
