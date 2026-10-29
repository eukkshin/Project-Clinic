"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import * as S from "@/components/about/brand/BrandEditorial.styles";
import BrandEditorialMotion from "@/components/about/brand/BrandEditorialMotion";
import {
  isAboutLinkActive,
  useAboutNavigation,
} from "@/lib/navigation/aboutNavigation";

/**
 * AHN'S BRAND / 2026 editorial redesign
 * 시안: 베이지 인물 Hero → 딥그린 스토리 → 포토 가치 3종 → 공간 이미지 → 상담 CTA
 * 정보성 문구와 공간 이미지는 브랜드 디자인 시안이며, 실제 병원 정보·시설을 의미하지 않습니다.
 * 기존 Header / Footer / 관리자 / 세부 시술 컴포넌트와 독립적으로 동작합니다.
 */

const heroImages = [
  {
    src: "/images/brand-editorial/hero-profile.webp",
    alt: "자연광 속 인물의 측면 사진",
  },
  {
    src: "/images/brand-editorial/hero-portrait.webp",
    alt: "은은한 조명 속 인물의 정면 사진",
  },
  {
    src: "/images/brand-editorial/hero-soft.webp",
    alt: "부드러운 표정의 인물 사진",
  },
] as const;

const values = [
  {
    index: "01",
    title: "Listen",
    subtitle: "깊이 듣는 상담",
    copy: "한 사람의 이야기를 충분히 듣고, 진짜 필요한 변화를 함께 찾아갑니다.",
    image: "/images/brand-editorial/value-listen.webp",
    alt: "부드러운 조명의 얼굴 클로즈업 사진",
  },
  {
    index: "02",
    title: "Balance",
    subtitle: "조화로운 디자인",
    copy: "개인의 특성과 전체적인 조화를 고려해 자연스러운 아름다움을 생각합니다.",
    image: "/images/brand-editorial/value-balance.webp",
    alt: "자연광과 식물 그림자가 어우러진 장면",
  },
  {
    index: "03",
    title: "Respect",
    subtitle: "진심 어린 케어",
    copy: "수술 전부터 회복 과정까지, 항상 진심을 다해 함께하겠습니다.",
    image: "/images/brand-editorial/value-respect.webp",
    alt: "인물의 자연스러운 옆모습 사진",
  },
] as const;

export default function BrandEditorial() {
  const pathname = usePathname();
  const aboutPages = useAboutNavigation();

  const [slide, setSlide] = useState(0);

  const moveSlide = (direction: -1 | 1) => {
    setSlide(
      (value) => (value + direction + heroImages.length) % heroImages.length,
    );
  };

  return (
    <S.Page id="ahns-brand-editorial">
      <BrandEditorialMotion />

      <S.Hero id="brand-top" aria-labelledby="brand-heading">
        <S.HeroMedia aria-hidden="true">
          {heroImages.map((item, index) => (
            <S.HeroSlide key={item.src} $active={slide === index}>
              <Image
                src={item.src}
                alt=""
                fill
                priority={index === 0}
                sizes="(max-width: 700px) 100vw, 68vw"
              />
            </S.HeroSlide>
          ))}
        </S.HeroMedia>
        <S.HeroGradient aria-hidden="true" />

        <S.HeroInner>
          <S.AboutNav aria-label="병원소개 페이지 내비게이션">
            <S.NavIdentity>
              ABOUT <span>/</span>
            </S.NavIdentity>

            <S.NavItems>
              {aboutPages.map((page) => (
                <S.NavItem
                  key={page.url}
                  as={Link}
                  href={page.url}
                  $active={isAboutLinkActive(pathname, page.url)}
                  aria-current={
                    isAboutLinkActive(pathname, page.url) ? "page" : undefined
                  }
                >
                  {page.name}
                </S.NavItem>
              ))}
            </S.NavItems>
          </S.AboutNav>

          <S.HeroContent>
            <S.Eyebrow>
              BRAND STORY <span aria-hidden="true">—</span> AHN&apos;S
            </S.Eyebrow>
            <S.HeroTitle id="brand-heading">
              아름다움의
              <br />
              기준이 되는 곳,
              <br />
              <em>AHN&apos;S</em>
            </S.HeroTitle>
            <S.HeroRule aria-hidden="true" />
            <S.HeroDescription>
              사람을 이해하는 섬세한 시선으로
              <br />
              자연스럽고 조화로운 아름다움을 만들어갑니다.
            </S.HeroDescription>
            <S.HeroScroll href="#brand-story" aria-label="브랜드 스토리로 이동">
              <span>SCROLL TO EXPLORE</span>
              <i aria-hidden="true" />
            </S.HeroScroll>
          </S.HeroContent>
          <S.HeroSideText aria-hidden="true">
            NATURAL <br /> BALANCE <br /> CONFIDENCE
          </S.HeroSideText>
          <S.HeroControls aria-label="브랜드 메인 이미지 전환">
            <span aria-live="polite">
              {String(slide + 1).padStart(2, "0")} /{" "}
              {String(heroImages.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => moveSlide(-1)}
              aria-label="이전 이미지"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => moveSlide(1)}
              aria-label="다음 이미지"
            >
              →
            </button>
          </S.HeroControls>
        </S.HeroInner>
      </S.Hero>

      <S.Story id="brand-story" aria-labelledby="brand-story-title">
        <S.StoryCopy data-brand-editorial-reveal>
          <S.SmallLabel>
            01 <span>OUR STORY</span>
          </S.SmallLabel>
          <S.StoryTitle id="brand-story-title">
            사람을 먼저
            <br />
            생각하는 아름다움
          </S.StoryTitle>
          <S.StoryText>
            AHN&apos;S는 단순한 변화가 아닌,
            <br />
            한 사람의 일상과 자신감을 함께 고려한
            <br />
            조화로운 아름다움을 추구합니다.
          </S.StoryText>
          <S.StoryLink as={Link} href="/about/philosophy">
            브랜드 스토리 더 보기 <span aria-hidden="true">↗</span>
          </S.StoryLink>
        </S.StoryCopy>
        <S.StoryPhoto data-brand-editorial-parallax>
          <Image
            src="/images/brand-editorial/story-space.webp"
            alt="햇살과 식물이 어우러진 차분한 공간의 콘셉트 이미지"
            fill
            sizes="(max-width: 760px) 100vw, 52vw"
          />
          <S.StoryPhotoShade />
          <S.StoryPhotoCopy data-brand-editorial-reveal>
            당신의 오늘이
            <br />더 빛날 수 있도록
          </S.StoryPhotoCopy>
          <S.StoryNumber aria-hidden="true">02 / 05</S.StoryNumber>
        </S.StoryPhoto>
      </S.Story>

      <S.Values aria-labelledby="brand-values-heading">
        <S.Container>
          <S.ValuesHeader data-brand-editorial-reveal>
            <div>
              <S.SectionEyebrow>OUR VALUES</S.SectionEyebrow>
              <S.ValuesHeading id="brand-values-heading">
                AHN&apos;S가 지켜가는 세 가지 약속
              </S.ValuesHeading>
            </div>
            <S.ValuesIntro>
              아름다움은 결과가 아닌 과정에서 시작됩니다.
              <br />
              AHN&apos;S는 언제나 사람을 중심에 두고 생각합니다.
            </S.ValuesIntro>
          </S.ValuesHeader>
          <S.ValueGrid>
            {values.map((value) => (
              <S.ValueCard key={value.index} data-brand-editorial-reveal>
                <S.ValuePhoto data-brand-editorial-parallax>
                  <Image
                    src={value.image}
                    alt={value.alt}
                    fill
                    sizes="(max-width: 760px) 100vw, 33vw"
                  />
                  <S.ValueIndex>{value.index}</S.ValueIndex>
                  <S.ValuePhotoArrow aria-hidden="true">↗</S.ValuePhotoArrow>
                </S.ValuePhoto>
                <S.ValueMeta>
                  {value.index} <span aria-hidden="true" />
                </S.ValueMeta>
                <S.ValueEnglish>{value.title}</S.ValueEnglish>
                <S.ValueKorean>{value.subtitle}</S.ValueKorean>
                <S.ValueDescription>{value.copy}</S.ValueDescription>
              </S.ValueCard>
            ))}
          </S.ValueGrid>
        </S.Container>
      </S.Values>

      <S.Space aria-labelledby="brand-space-heading">
        <S.SpaceImage data-brand-editorial-parallax>
          <Image
            src="/images/brand-editorial/quiet-space.webp"
            alt="따뜻한 햇살이 스며드는 차분한 공간 콘셉트 사진"
            fill
            sizes="100vw"
          />
        </S.SpaceImage>
        <S.SpaceVeil aria-hidden="true" />
        <S.SpaceContent data-brand-editorial-reveal>
          <S.SectionEyebrow $light>THE SPACE OF AHN&apos;S</S.SectionEyebrow>
          <S.SpaceTitle id="brand-space-heading">
            사람을 위한 공간,
            <br />더 나은 내일을 위한 약속
          </S.SpaceTitle>
          <S.SpaceDescription>
            마음을 편안하게 하는 환경부터, 대화에 집중하는 시간까지.
            <br />
            당신의 경험을 소중히 생각합니다.
          </S.SpaceDescription>
          <S.SpaceLink as={Link} href="/about/facilities">
            진료 환경 둘러보기 <span aria-hidden="true">↗</span>
          </S.SpaceLink>
        </S.SpaceContent>
      </S.Space>

      <S.Closing aria-labelledby="brand-closing-heading">
        <S.ClosingInner>
          <S.ClosingCopy data-brand-editorial-reveal>
            <S.ClosingTitle id="brand-closing-heading">
              AHN&apos;S와 함께,
              <br />
              당신의 새로운 이야기를 시작하세요.
            </S.ClosingTitle>
            <S.ClosingSmall>BEAUTY IN YOUR OWN WAY.</S.ClosingSmall>
          </S.ClosingCopy>
          <S.ClosingActions data-brand-editorial-reveal>
            <S.ContactLink href="/#site-footer-contact">
              상담 문의하기 <span aria-hidden="true">↗</span>
            </S.ContactLink>
            <S.LocationLink as={Link} href="/about/location">
              오시는 길 보기 <span aria-hidden="true">↗</span>
            </S.LocationLink>
          </S.ClosingActions>
        </S.ClosingInner>
      </S.Closing>
    </S.Page>
  );
}
