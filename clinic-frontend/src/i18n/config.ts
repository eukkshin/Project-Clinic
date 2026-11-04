/** AHNS supported locales. Phase 1 preserves existing URLs. */
export const locales = ["ko", "en", "ja", "zh-CN", "zh-TW"] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = "ko";
export const localeCookieName = "NEXT_LOCALE";

export type LanguageCode = "KR" | "EN" | "JP" | "CN" | "TW";

export function isAppLocale(value: unknown): value is AppLocale {
  return (
    typeof value === "string" && locales.some((locale) => locale === value)
  );
}

/** UI codes CN/TW map to simplified/traditional Chinese (BCP-47). */
export function normalizeLocale(value: string): AppLocale | null {
  const text = value.trim().toLowerCase().replaceAll("_", "-");
  if (["ko", "kr", "korean", "한국어"].includes(text)) return "ko";
  if (["en", "eng", "english", "영어"].includes(text)) return "en";
  if (["ja", "jp", "japanese", "日本語", "일본어"].includes(text)) return "ja";
  if (
    ["cn", "zh", "zh-cn", "zh-hans", "简体中文", "중국어 간체"].includes(text)
  )
    return "zh-CN";
  if (["tw", "zh-tw", "zh-hant", "繁體中文", "중국어 번체"].includes(text))
    return "zh-TW";
  return null;
}

export function localeToLanguage(locale: string): LanguageCode {
  if (locale === "en") return "EN";
  if (locale === "ja") return "JP";
  if (locale === "zh-CN") return "CN";
  if (locale === "zh-TW") return "TW";
  return "KR";
}
