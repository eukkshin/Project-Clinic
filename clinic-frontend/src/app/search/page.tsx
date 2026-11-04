import { Suspense } from "react";

import SearchResultsClient from "@/components/search/SearchResultsClient";
import { publicPageMetadata } from "@/lib/seo/publicMetadata";

export async function generateMetadata() {
  return publicPageMetadata("/search");
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main style={{ padding: "160px 24px" }}>
          검색 화면을 준비하고 있습니다.
        </main>
      }
    >
      <SearchResultsClient />
    </Suspense>
  );
}
