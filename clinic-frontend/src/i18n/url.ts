import { AppLocale, defaultLocale, isAppLocale } from "./config";

/** 기존 /foo 경로를 유지하면서 /en/foo 등 언어 접두사를 지원합니다. */
export function splitLocalePath(pathname: string): {
  locale: AppLocale | null;
  pathname: string;
} {
  const safe =
    pathname.startsWith("/") && !pathname.startsWith("//") ? pathname : "/";
  const segments = safe.split("/");
  const prefix = segments[1];
  if (!isAppLocale(prefix)) return { locale: null, pathname: safe };
  const rest = "/" + segments.slice(2).join("/");
  return { locale: prefix, pathname: rest || "/" };
}

export function stripLocalePrefix(pathname: string): string {
  return splitLocalePath(pathname).pathname;
}

export function localizedPath(pathname: string, locale: AppLocale): string {
  // 내부 링크만 처리하고 외부 URL, //example.com, 빈 URL은 건드리지 않습니다.
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return pathname;
  const match = pathname.match(/^([^?#]*)(.*)$/);
  const bare = stripLocalePrefix(match?.[1] || "/");
  const suffix = match?.[2] || "";
  if (locale === defaultLocale) return bare + suffix;
  return `/${locale}${bare === "/" ? "" : bare}${suffix}`;
}
