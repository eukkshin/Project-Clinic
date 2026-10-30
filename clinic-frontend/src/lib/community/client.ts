import { API_ORIGIN } from "@/lib/api/config";
import type { CommunityKind } from "./config";

export interface CommunityEntry {
  id: string;
  title: string;
  subtitle: string;
  image: string | null;
  video: string | null;
  category: string;
  date: string;
  question: string;
  answer: string;
}

export type CommunityResult = {
  connected: boolean;
  entries: CommunityEntry[];
};

const API = API_ORIGIN;

/**
 * Existing endpoints confirmed from the provided frontend source.
 * Notice/review/before-after endpoints were NOT confirmed, so do not guess.
 * Expose these only after a verified public, consent-aware backend API is available.
 */
const VERIFIED_ENDPOINTS: Partial<Record<CommunityKind, string>> = {
  events: "/api/admin/events",
  qna: "/api/admin/qnas",
  vlog: "/api/admin/vlogs",
};

const OPTIONAL_PUBLIC_ENDPOINTS: Partial<
  Record<CommunityKind, string | undefined>
> = {
  notice: process.env.NEXT_PUBLIC_COMMUNITY_NOTICE_API,
  reviews: process.env.NEXT_PUBLIC_COMMUNITY_REVIEWS_API,
  "before-after": process.env.NEXT_PUBLIC_COMMUNITY_BEFORE_AFTER_API,
};

function field(row: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys)
    if (row[key] !== undefined && row[key] !== null) return row[key];
  return undefined;
}
function stringField(row: Record<string, unknown>, ...keys: string[]): string {
  const value = field(row, ...keys);
  return typeof value === "string"
    ? value.trim()
    : typeof value === "number"
      ? String(value)
      : "";
}
function safeUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value, API);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}
function pictureUrl(row: Record<string, unknown>): string | null {
  const direct = field(row, "image", "imageUrl", "IMAGE_URL", "thumbnailUrl");
  if (typeof direct === "string" && direct.trim()) return safeUrl(direct);
  const filename = stringField(row, "FILE_NAME", "fileName");
  if (!filename) return null;
  return `${API}/images/${encodeURIComponent(filename)}`;
}
function published(row: Record<string, unknown>): boolean {
  const status = field(row, "IS_ACTIVE", "isActive", "PUBLISHED", "published");
  if (status === undefined || status === null) return true; // older admin listing APIs omitted status
  return (
    status === "Y" ||
    status === "PUBLISHED" ||
    status === "ACTIVE" ||
    status === true ||
    status === 1
  );
}
function normalize(
  row: Record<string, unknown>,
  kind: CommunityKind,
  index: number,
): CommunityEntry {
  const id =
    stringField(
      row,
      "id",
      "ID",
      "EVENT_IDX",
      "VLOG_IDX",
      "QNA_IDX",
      "NOTICE_IDX",
      "REVIEW_IDX",
      "BEFORE_AFTER_IDX",
    ) || String(index);
  const question = stringField(row, "question", "QUESTION");
  const answer = stringField(row, "answer", "ANSWER");
  return {
    id,
    title:
      stringField(row, "title", "TITLE", "name", "NAME") ||
      question ||
      "제목 없음",
    subtitle: stringField(
      row,
      "description",
      "DESCRIPTION",
      "content",
      "CONTENT",
      "PRICE",
      "price",
    ),
    image: pictureUrl(row),
    video: safeUrl(field(row, "VIDEO_URL", "videoUrl", "video")),
    category:
      stringField(
        row,
        "CATEGORY_NAME",
        "categoryName",
        "CATEGORY",
        "category",
      ) || (kind === "qna" ? "일반" : "AHN’S"),
    date: stringField(
      row,
      "CREATED_AT",
      "createdAt",
      "REG_DATE",
      "regDate",
      "DATE",
      "date",
    ),
    question,
    answer,
  };
}

export async function loadCommunity(
  kind: CommunityKind,
  signal: AbortSignal,
): Promise<CommunityResult> {
  const configured =
    VERIFIED_ENDPOINTS[kind] || OPTIONAL_PUBLIC_ENDPOINTS[kind];
  if (!configured) return { connected: false, entries: [] };
  // Disallow external arbitrary hosts for optional path to prevent unintended requests.
  const endpoint =
    configured.startsWith("/api/") && !configured.startsWith("//")
      ? `${API}${configured}`
      : null;
  if (!endpoint) return { connected: false, entries: [] };

  const response = await fetch(endpoint, { signal, cache: "no-store" });
  if (!response.ok) throw new Error(`서버 응답: ${response.status}`);
  const body: unknown = await response.json();
  if (!body || typeof body !== "object")
    throw new Error("응답 형식이 올바르지 않습니다.");
  const payload = body as { success?: boolean; data?: unknown };
  if (payload.success === false || !Array.isArray(payload.data))
    throw new Error("목록 응답이 올바르지 않습니다.");
  const entries = payload.data
    .filter(
      (item): item is Record<string, unknown> =>
        item !== null && typeof item === "object" && !Array.isArray(item),
    )
    .filter(published)
    .map((item, index) => normalize(item, kind, index));
  return { connected: true, entries };
}

export function toYoutubeEmbed(urlValue: string | null): string | null {
  if (!urlValue) return null;
  try {
    const url = new URL(urlValue);
    const host = url.hostname.replace(/^(www|m)\./, "").toLowerCase();
    const pieces = url.pathname.split("/").filter(Boolean);
    const id =
      host === "youtu.be"
        ? pieces[0]
        : host === "youtube.com" && pieces[0] === "watch"
          ? url.searchParams.get("v")
          : host === "youtube.com" &&
              ["shorts", "live", "embed"].includes(pieces[0])
            ? pieces[1]
            : null;
    return id && /^[\w-]{11}$/.test(id)
      ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
      : null;
  } catch {
    return null;
  }
}

export async function submitQuickConsultation(payload: {
  name: string;
  phone: string;
  department: string;
}): Promise<void> {
  // The same endpoint and payload as existing QuickConsultBar.tsx.
  const response = await fetch(`${API}/api/consult/quick`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data: unknown = await response.json().catch(() => null);
  if (
    !response.ok ||
    !data ||
    typeof data !== "object" ||
    (data as { success?: boolean }).success !== true
  ) {
    throw new Error("상담 접수에 실패했습니다.");
  }
}
