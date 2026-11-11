import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import SearchResultsClient from "@/components/search/SearchResultsClient";
import { publicPageMetadata } from "@/lib/seo/publicMetadata";

export async function generateMetadata() {
  return publicPageMetadata("/search");
}

export default async function SearchPage() {
  const t = await getTranslations("Search");
  return (
    <Suspense
      fallback={<main style={{ padding: "160px 24px" }}>{t("preparing")}</main>}
    >
      <SearchResultsClient />
    </Suspense>
  );
}
