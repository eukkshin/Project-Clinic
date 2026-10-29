"use client";

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

import * as S from '@/assets/css/components/detail/DetailPage.styles';
import DetailHero from '@/components/detail/DetailHero';
import DetailSectionRenderer from '@/components/detail/DetailSectionRenderer';
import DetailSideNav from '@/components/detail/DetailSideNav';

import type { DetailPageData } from "@/types/detail";
/** Header / Footer / QuickMenu는 원래 프로젝트의 ConditionalLayout이 렌더링합니다. */
export default function DetailLayout({ page }: { page: DetailPageData }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sections = page.sections ?? [];
  const nav = sections.map((section) => ({
    id: `detail-${section.id}`,
    title: section.title,
    type: section.type,
  }));

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      root
        .querySelectorAll<HTMLElement>("[data-detail-animate]")
        .forEach((element) => {
          gsap.fromTo(
            element,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "power2.out",
              scrollTrigger: { trigger: element, start: "top 92%", once: true },
            },
          );
        });
    }, root);
    return () => ctx.revert();
  }, [page.category, page.slug, page.sections]);

  return (
    <S.PageRoot ref={rootRef}>
      <DetailSideNav
        sections={nav}
        eyebrow="AHN'S · DETAIL"
        scrollOffset={86}
      />
      <S.Main>
        <DetailHero hero={page.hero} firstSectionId={sections[0]?.id} />
        {sections.map((section, index) => (
          <DetailSectionRenderer
            section={section}
            index={index}
            isLast={index === sections.length - 1}
            key={section.id}
          />
        ))}
      </S.Main>
    </S.PageRoot>
  );
}
