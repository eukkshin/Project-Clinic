"use client";

import * as S from "@/assets/css/components/detail/DetailLayout.styles";
import DetailHero from "@/components/detail/DetailHero";
import DetailSectionRenderer from "@/components/detail/DetailSectionRenderer";
import DetailSideNav from "@/components/detail/DetailSideNav";

import type { DetailPageData } from "@/types/detail";
/** Header/Footer는 기존 src/app/layout.tsx / ConditionalLayout에 맡깁니다. */
export default function DetailLayout({ page }: { page: DetailPageData }) {
  const visibleSections = page.sections;
  const navSections = visibleSections.map((section) => ({
    id: `detail-${section.id}`,
    title: section.title,
  }));

  return (
    <S.PageRoot>
      {/* Hero/본문과 동일한 상위 레벨: fixed SideNav가 transform 조상의 영향을 받지 않음 */}
      <DetailSideNav
        sections={navSections}
        scrollOffset={100}
        eyebrow="AHN'S · DETAIL"
      />
      <S.Main>
        <DetailHero hero={page.hero} />
        {visibleSections.map((section, index) => (
          <DetailSectionRenderer
            key={section.id}
            section={section}
            index={index}
          />
        ))}
      </S.Main>
    </S.PageRoot>
  );
}
