import type { Metadata } from "next";
import { headers } from 'next/headers';

import CategoryNav from '@/components/home/CategoryNav';
import CircularOverlay from '@/components/home/CircularOverlay';
import EditorialExperience from '@/components/home/EditorialExperience';
import Hero from '@/components/home/Hero';
import HomeAtmosphere from '@/components/home/HomeAtmosphere';
import HomeOverflowGuard from '@/components/home/HomeOverflowGuard';
import RollingBanner from '@/components/home/RollingBanner';
import { SafetySlider } from '@/components/home/SafetySlider';
import Selfies from '@/components/home/Selfies';
import VlogSafetyFlow from '@/components/home/VlogSafetyFlow';
import { VlogSlider } from '@/components/home/VlogSlider';
import BrandIntro from '@/components/intro/BrandIntro';
import { getInitialHeroSlides } from '@/lib/home/getInitialHeroSlides';

export const metadata: Metadata = {
  title: "AHNS | 아름다움, 그 이상의 가치",
  description:
    "AHNS의 진료 철학과 시술 안내, 후기 및 상담 정보를 확인해 보세요.",
};

/**
 * Intro policy: only an external LINK opening the homepage in a new
 * document (NOT local navigation, refresh, or directly typed/bookmarked URLs).
 * Browser privacy / Referrer-Policy may hide the referring site.
 */
function isExternalNavigation(requestHeaders: {
  get(name: string): string | null;
}): boolean {
  const mode = requestHeaders.get("sec-fetch-mode");
  if (mode && mode !== "navigate") return false;

  const host = (
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host") ||
    ""
  )
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");
  const referer = requestHeaders.get("referer");
  if (referer && host) {
    try {
      const referringHost = new URL(referer).host
        .toLowerCase()
        .replace(/^www\./, "");
      if (referringHost && referringHost !== host) return true;
      if (referringHost === host) return false;
    } catch {
      /* fall through to fetch metadata */
    }
  }
  return requestHeaders.get("sec-fetch-site") === "cross-site";
}

type HomeProps = {
  searchParams: Promise<{ intro?: string | string[] }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const [requestHeaders, params, initialHeroSlides] = await Promise.all([
    headers(),
    searchParams,
    getInitialHeroSlides(),
  ]);
  const preview = params.intro === "1";
  const shouldPlay = preview || isExternalNavigation(requestHeaders);

  return (
    <>
      {/* Homepage-wide x-axis overflow guard; local scroll carousels still work. */}
      <HomeOverflowGuard />

      {/* Server chooses whether to render: no after-hydration flash. */}
      <BrandIntro shouldPlay={shouldPlay} />

      <HomeAtmosphere>
        <EditorialExperience />
        <Hero
          rollingBanner={<RollingBanner />}
          initialSlides={initialHeroSlides}
          introPlaying={shouldPlay}
        />
        <CategoryNav />
        <Selfies />
        <CircularOverlay />
        <VlogSafetyFlow vlog={<VlogSlider />} safety={<SafetySlider />} />
      </HomeAtmosphere>
    </>
  );
}
