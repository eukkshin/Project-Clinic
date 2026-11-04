import type { MetadataRoute } from "next";
import { AppLocale, locales } from "@/i18n/config";
import {
  absoluteLocalizedUrl,
  getSiteOrigin,
  HREFLANG_READY_PATHS,
} from "@/lib/seo/publicMetadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  if (!origin) return []; // 운영 도메인을 등록하기 전에는 거짓 URL을 제공하지 않음

  // KR 기본 경로는 유지. 수동 검증된 고정 소개 페이지에만 hreflang 등록.
  const urls = [
    "/",
    "/about/brand",
    "/about/philosophy",
    "/about/doctors",
    "/about/facilities",
    "/about/safety",
    "/about/location",
  ] as const;
  return urls.flatMap((path) => {
    const ready = (HREFLANG_READY_PATHS as readonly string[]).includes(path);
    const translations: AppLocale[] = ready ? [...locales] : ["ko"];
    return translations.map((locale) => {
      const url = absoluteLocalizedUrl(path, locale)!;
      const languages = ready
        ? Object.fromEntries(
            locales.map((l) => [l, absoluteLocalizedUrl(path, l)!]),
          )
        : undefined;
      return {
        url,
        changeFrequency: "monthly" as const,
        priority: path === "/" ? 1 : 0.7,
        ...(languages ? { alternates: { languages } } : {}),
      };
    });
  });
}
