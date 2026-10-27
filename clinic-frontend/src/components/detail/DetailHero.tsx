"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

import * as S from "@/assets/css/components/detail/DetailHero.styles";
import DetailImage from "@/components/detail/DetailImage";

import type { DetailHeroData } from "@/types/detail";
interface Props {
  hero: DetailHeroData;
}

/** 풀블리드 Hero: 이미지 scale 1.12 -> 1.0, 텍스트는 위에서 내려오며 부드럽게 노출. */
export default function DetailHero({ hero }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const elements = root.querySelectorAll<HTMLElement>("[data-detail-reveal]");
    const image = root.querySelector<HTMLElement>("[data-detail-hero-image]");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // 접근성 설정을 존중하고, CSS에서 숨긴 텍스트를 반드시 드러냅니다.
    if (reducedMotion) {
      gsap.set(elements, { autoAlpha: 1, y: 0, filter: "none" });
      if (image) gsap.set(image, { scale: 1 });
      return;
    }

    const context = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

      if (image) {
        tl.fromTo(
          image,
          { scale: 1.12 },
          { scale: 1, duration: 3.1, ease: "power2.out" },
          0,
        );
      }

      tl.fromTo(
        elements,
        { autoAlpha: 0, y: -32, filter: "blur(9px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.18,
          duration: 1.15,
          ease: "power3.out",
        },
        0.42,
      );
    }, root);

    return () => context.revert();
  }, [hero.imageUrl, hero.title]);

  return (
    <S.Hero ref={rootRef} aria-label={hero.title}>
      {/* 비주얼만 확대/축소. 섹션 자체는 transform하지 않으므로 fixed SideNav가 흔들리지 않습니다. */}
      <S.HeroImage data-detail-hero-image>
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
      </S.HeroImage>
      <S.HeroOverlay />
      <S.HeroContent>
        {hero.eyebrow && (
          <S.HeroEyebrow data-detail-reveal>{hero.eyebrow}</S.HeroEyebrow>
        )}
        <S.HeroTitle data-detail-reveal>{hero.title}</S.HeroTitle>
        {hero.description && (
          <S.HeroDescription data-detail-reveal>
            {hero.description}
          </S.HeroDescription>
        )}
      </S.HeroContent>
      <S.ScrollNote aria-hidden="true">
        SCROLL TO EXPLORE <span>↓</span>
      </S.ScrollNote>
    </S.Hero>
  );
}
