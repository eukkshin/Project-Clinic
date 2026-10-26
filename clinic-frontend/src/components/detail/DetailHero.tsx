'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

import * as S from '@/assets/css/components/detail/DetailHero.styles';

export default function DetailHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();

      // 이미지가 천천히 멀어지는 효과
      timeline.to(
        '[data-hero-image]',
        {
          scale: 1,
          duration: 2.8,
          ease: 'power2.out',
        },
        0,
      );

      // 글씨가 위에서 아래로 부드럽게 등장
      timeline.fromTo(
        '[data-hero-text]',
        {
          y: -35,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: 'power3.out',
        },
        0.35,
      );
    }, hero);

    return () => ctx.revert();
  }, []);

  return (
    <S.Hero ref={heroRef}>
      <S.HeroImage data-hero-image>
        <Image
          src="/images/detail/eyes/hero.webp"
          alt="눈성형 소개"
          fill
          sizes="100vw"
          priority
          style={{ objectFit: 'cover' }}
        />
      </S.HeroImage>

      <S.HeroContent>
        <p data-hero-text>AHN'S PLASTIC SURGERY</p>
        <h1 data-hero-text>자연스러운 아름다움</h1>
        <p data-hero-text>섬세한 차이가 만드는 조화로운 변화</p>
      </S.HeroContent>
    </S.Hero>
  );
}
