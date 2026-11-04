import { API_ORIGIN } from "@/lib/api/config";

export type CmsType =
  | "EVENT"
  | "FAQ"
  | "DETAIL_CATEGORY"
  | "DETAIL_PAGE"
  | "DETAIL_SECTION";
export type TranslationLocale = "en" | "ja" | "zh-CN" | "zh-TW";
export type ContentStatus = "MISSING" | "DRAFT" | "PUBLISHED" | "SOURCE";
export type ContentSource = Record<string, unknown>;

export type AdminTranslation = {
  type: CmsType;
  id: number;
  locale: TranslationLocale | "ko";
  source: ContentSource;
  payload: Record<string, unknown>;
  status: ContentStatus;
  updatedAt?: string | null;
};
export type SourceOption = { id: number; label: string };

type ApiResult<T> = { success: boolean; data: T; message?: string };
const BASE = `${API_ORIGIN}/api/admin/content-i18n`;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  const body = (await response.json().catch(() => null)) as ApiResult<T> | null;
  if (!response.ok || body?.success !== true) {
    throw new Error(body?.message || `API 요청 실패 (${response.status})`);
  }
  return body.data;
}

export const contentI18nApi = {
  sources: (type: CmsType, q = "") =>
    request<SourceOption[]>(`/sources/${type}?q=${encodeURIComponent(q)}`),
  get: (type: CmsType, id: number, lang: TranslationLocale | "ko") =>
    request<AdminTranslation>(`/${type}/${id}/${lang}`),
  save: (
    type: CmsType,
    id: number,
    lang: TranslationLocale,
    payload: Record<string, unknown>,
    status: "DRAFT" | "PUBLISHED",
  ) =>
    request<{ status: "DRAFT" | "PUBLISHED" }>(`/${type}/${id}/${lang}`, {
      method: "PUT",
      body: JSON.stringify({ payload, status }),
    }),
  remove: (type: CmsType, id: number, lang: TranslationLocale) =>
    request<{ locale: TranslationLocale }>(`/${type}/${id}/${lang}`, {
      method: "DELETE",
    }),
};
