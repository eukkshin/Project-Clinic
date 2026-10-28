"use client";

import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { FiArrowDown, FiEye, FiMessageCircle, FiShield } from 'react-icons/fi';

import * as S from '@/assets/css/components/detail/DetailPage.styles';
import DetailImage from '@/components/detail/DetailImage';

import type { DetailHeroData } from "@/types/detail";
interface Props {
  hero: DetailHeroData;
  firstSectionId?: string;
}

export default function DetailHero({ hero, firstSectionId }: Props) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-hero-text]"),
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 4,
          stagger: 0.13,
          ease: "power3.out",
          delay: 1,
        },
      );
      const visual = el.querySelector("[data-hero-visual]");
      if (visual)
        gsap.fromTo(
          visual,
          { scale: 1.075 },
          { scale: 1, duration: 8, ease: "power2.out" },
        );
    }, el);
    return () => ctx.revert();
  }, [hero.title, hero.imageUrl]);

  return (
    <S.Hero ref={heroRef} aria-label={hero.title}>
      <S.HeroVisual data-hero-visual>
        {hero.imageUrl && (
          <DetailImage
            src={hero.imageUrl}
            alt={hero.imageAlt ?? ""}
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: hero.imagePosition ?? "center",
            }}
          />
        )}
      </S.HeroVisual>
      <S.HeroShade />
      <S.HeroInner>
        <S.HeroEyebrow data-hero-text>
          {hero.eyebrow ?? "AHN'S · PROCEDURE"}
        </S.HeroEyebrow>
        <S.HeroTitle data-hero-text>{hero.title}</S.HeroTitle>
        <S.HeroLine data-hero-text />
        {hero.description && (
          <S.HeroDesc data-hero-text>{hero.description}</S.HeroDesc>
        )}
        <S.HeroPoints data-hero-text aria-label="상담 안내">
          <S.HeroPoint>
            <FiEye aria-hidden="true" />
            <span>개인별 눈 상태 확인</span>
          </S.HeroPoint>
          <S.HeroPoint>
            <FiMessageCircle aria-hidden="true" />
            <span>맞춤 상담</span>
          </S.HeroPoint>
          <S.HeroPoint>
            <FiShield aria-hidden="true" />
            <span>경과 관리 안내</span>
          </S.HeroPoint>
        </S.HeroPoints>
      </S.HeroInner>
      {firstSectionId && (
        <S.HeroScroll href={`#detail-${firstSectionId}`}>
          SCROLL TO EXPLORE <FiArrowDown aria-hidden="true" />
        </S.HeroScroll>
      )}
    </S.Hero>
  );
}
