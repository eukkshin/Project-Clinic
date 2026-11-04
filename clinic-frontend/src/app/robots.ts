import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/seo/publicMetadata";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteOrigin();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/mypage/",
          "/register/",
          "/find/",
          "/search",
          "/en/search",
          "/ja/search",
          "/zh-CN/search",
          "/zh-TW/search",
          "/en/mypage/",
          "/ja/mypage/",
          "/zh-CN/mypage/",
          "/zh-TW/mypage/",
        ],
      },
    ],
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
