"use client";

import Image from 'next/image';
import { useState } from 'react';

import * as S from '@/assets/css/components/about/brand/BrandStory.styles';
import AboutTextNav from '@/components/about/AboutTextNav';
import BrandMotion from '@/components/about/brand/BrandMotion';

/**
 * AHN'S Brand Story — 웹사이트 브랜드 소개 시안
 * - 기존 Header / Footer / Lenis / 관리자 데이터에 관여하지 않음
 * - 이미지: public/images/brand에 배포되는 기존 프로젝트 에디토리얼 자산
 * - 카피: 실제 병원 연혁·의료진·임상 성과를 주장하지 않는 브랜드 메시지 시안
 */
const values = [
  {
    number: "01",
    en: "Listen",
    ko: "먼저 듣는 태도",
    description:
      "정해진 아름다움을 권하기보다, 각자가 바라는 변화와 그 이유를 먼저 이해하는 것에서 이야기를 시작합니다.",
  },
  {
    number: "02",
    en: "Balance",
    ko: "자연스러운 조화",
    description:
      "하나의 부분만을 바라보지 않고, 전체적인 균형과 본래의 인상을 함께 생각하는 방향을 지향합니다.",
  },
  {
    number: "03",
    en: "Respect",
    ko: "당신다움의 존중",
    description:
      "모든 얼굴이 서로 다르듯 아름다움의 답도 다릅니다. 그 고유함을 존중하는 마음을 브랜드의 중심에 둡니다.",
  },
] as const;

const heroSlides = [
  {
    src: "/images/brand/brand-portrait.webp",
    alt: "자연광 아래 인물의 담백한 에디토리얼 사진",
  },
  {
    src: "/images/brand/brand-profile.webp",
    alt: "부드러운 옆모습을 담은 인물 에디토리얼 사진",
  },
  {
    src: "/images/brand/brand-detail-portrait.webp",
    alt: "인물의 자연스러운 표정을 담은 클로즈업 사진",
  },
] as const;

export default function BrandStory() {
  const [activeSlide, setActiveSlide] = useState(0);

  const moveSlide = (step: number) => {
    setActiveSlide(
      (current) => (current + step + heroSlides.length) % heroSlides.length,
    );
  };

  return (
    <S.Main id="brand-top">
      <BrandMotion />
      <S.Hero aria-labelledby="brand-title">
        <S.HeroNavigation>
          <AboutTextNav current="/about/brand" />
        </S.HeroNavigation>
        <S.HeroCanvas>
          <S.HeroCopy>
            <S.Eyebrow>
              <S.FineDot aria-hidden="true" />
              <span>AHN&apos;S PLASTIC SURGERY</span>
              <S.EyebrowDivider aria-hidden="true" />
              <span>OUR ESSENCE</span>
            </S.Eyebrow>

            <S.HeroTitle id="brand-title">
              Beauty,
              <br />
              <em>in your own</em>
              <br />
              rhythm.
            </S.HeroTitle>

            <S.HeroBottom>
              <div>
                <S.HeroKorean>
                  아름다움의 기준을 더하기보다,
                  <br />
                  당신만의 기준을 존중합니다.
                </S.HeroKorean>
                <S.HeroDescription>
                  AHN&apos;S가 이야기하고 싶은 아름다움은
                  <br />
                  다른 누군가가 아닌, 당신에게서 시작됩니다.
                </S.HeroDescription>
              </div>
              <S.DiscoverLink href="#brand-story">
                <span>DISCOVER OUR STORY</span>
                <S.DiscoverIcon aria-hidden="true">↘</S.DiscoverIcon>
              </S.DiscoverLink>
            </S.HeroBottom>
          </S.HeroCopy>

          <S.HeroVisual aria-label="AHN'S 브랜드 이미지">
            <S.HeroVisualBackdrop aria-hidden="true" />
            <S.HeroPortrait data-brand-parallax>
              {heroSlides.map((slide, index) => (
                <S.HeroSlide
                  key={slide.src}
                  $active={index === activeSlide}
                  aria-hidden={index !== activeSlide}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 760px) 90vw, (max-width: 1100px) 45vw, 42vw"
                  />
                </S.HeroSlide>
              ))}
            </S.HeroPortrait>
            <S.HeroVisualCaption>
              <span>THE BEAUTY OF BEING YOU</span>
              <S.HeroSlideControls aria-label="브랜드 이미지 전환">
                <span aria-live="polite">
                  {String(activeSlide + 1).padStart(2, "0")} /{" "}
                  {String(heroSlides.length).padStart(2, "0")}
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
              </S.HeroSlideControls>
            </S.HeroVisualCaption>
            <S.HeroDecorativeMark aria-hidden="true">A.</S.HeroDecorativeMark>
          </S.HeroVisual>
        </S.HeroCanvas>

        <S.HeroFootnote aria-hidden="true">
          <span>BEAUTY, WITH INTENTION</span>
          <span>
            SCROLL TO EXPLORE <S.ScrollArrow>↓</S.ScrollArrow>
          </span>
          <span>AHN&apos;S — BRAND JOURNAL</span>
        </S.HeroFootnote>
      </S.Hero>

      <S.StorySection id="brand-story" aria-labelledby="story-title">
        <S.SectionFrame>
          <S.SectionMarker>
            <span>01</span>
            <S.MarkerLine aria-hidden="true" />
            <span>OUR STORY</span>
          </S.SectionMarker>
          <S.StoryGrid data-brand-reveal>
            <S.StoryHeading id="story-title">
              아름다움을
              <br />
              정의하는 대신,
              <br />
              <em>이해하는 마음.</em>
            </S.StoryHeading>
            <S.StoryBody>
              <S.StoryBodyLabel>
                A MORE PERSONAL VIEW OF BEAUTY
              </S.StoryBodyLabel>
              <p>
                아름다움은 하나의 모습으로 설명할 수 없습니다. 누군가에게는 작은
                변화가, 또 다른 누군가에게는 지금의 모습을 지켜가는 선택이 더
                소중할 수 있으니까요.
              </p>
              <p>
                AHN&apos;S는 그 차이를 존중하는 관점에서 출발합니다. 보이는
                변화에 앞서, 자신에 대해 더 깊이 이해할 수 있는 시간을 중요하게
                생각합니다.
              </p>
              <S.StorySignature>Beautifully, you.</S.StorySignature>
            </S.StoryBody>
          </S.StoryGrid>
          <S.StoryBottomLine data-brand-reveal>
            <span>INDIVIDUALITY</span>
            <span>INTENTION</span>
            <span>HARMONY</span>
          </S.StoryBottomLine>
        </S.SectionFrame>
      </S.StorySection>

      <S.Manifesto aria-labelledby="manifesto-title">
        <S.ManifestoImageWrap data-brand-parallax>
          <Image
            src="/images/brand/brand-profile.webp"
            alt="자연스러운 옆모습을 담은 에디토리얼 사진"
            fill
            sizes="(max-width: 760px) 100vw, 48vw"
          />
          <S.ImageIndex>AHN&apos;S / EDITORIAL STUDY 02</S.ImageIndex>
        </S.ManifestoImageWrap>
        <S.ManifestoContent data-brand-reveal>
          <S.ManifestoTopline>
            <span>02</span>
            <span>OUR PERSPECTIVE</span>
          </S.ManifestoTopline>
          <S.ManifestoTitle id="manifesto-title">
            Not a new you.
            <br />
            <em>A truer you.</em>
          </S.ManifestoTitle>
          <S.ManifestoKorean>
            새로운 누군가가 되는 것보다,
            <br />
            나다운 모습을 더 깊이 바라보는 일.
          </S.ManifestoKorean>
          <S.ManifestoDescription>
            유행보다 오래 남는 것은 자신에게 어울리는 균형이라고 생각합니다.
            무엇을 더할지보다 무엇을 지킬지 함께 고민하는 것. AHN&apos;S가
            지향하는 아름다움의 태도입니다.
          </S.ManifestoDescription>
          <S.ManifestoRule />
          <S.ManifestoClosing>
            CONSIDERED BEAUTY, PERSONAL BY NATURE.
          </S.ManifestoClosing>
        </S.ManifestoContent>
      </S.Manifesto>

      <S.ValuesSection id="brand-values" aria-labelledby="values-title">
        <S.SectionFrame>
          <S.SectionMarker>
            <span>03</span>
            <S.MarkerLine aria-hidden="true" />
            <span>OUR VALUES</span>
          </S.SectionMarker>
          <S.ValuesIntro data-brand-reveal>
            <div>
              <S.ValuesOverline>THREE THINGS WE BELIEVE</S.ValuesOverline>
              <S.ValuesTitle id="values-title">
                The art of
                <br />
                <em>thoughtful beauty.</em>
              </S.ValuesTitle>
            </div>
            <S.ValuesAside>
              거창한 약속보다 오래 지키고 싶은 태도.
              <br />
              AHN&apos;S의 이야기를 이루는 세 가지 관점입니다.
            </S.ValuesAside>
          </S.ValuesIntro>
          <S.ValueGrid>
            {values.map((value) => (
              <S.ValueItem key={value.number} data-brand-reveal>
                <S.ValueTop>
                  <span>{value.number}</span>
                  <S.ValueSmallCircle aria-hidden="true">↗</S.ValueSmallCircle>
                </S.ValueTop>
                <S.ValueEn>{value.en}</S.ValueEn>
                <S.ValueKo>{value.ko}</S.ValueKo>
                <S.ValueDescription>{value.description}</S.ValueDescription>
              </S.ValueItem>
            ))}
          </S.ValueGrid>
        </S.SectionFrame>
      </S.ValuesSection>

      <S.ImageEssay aria-labelledby="essay-title">
        <S.EssayTextBlock data-brand-reveal>
          <S.EssayLabel>04 — THE QUIET DETAILS</S.EssayLabel>
          <S.EssayTitle id="essay-title">
            The beauty
            <br />
            <em>in every detail.</em>
          </S.EssayTitle>
          <S.EssayDescription>
            특별함은 때로 가장 작은 차이에서 시작됩니다.
            <br />
            무심히 지나칠 수 있는 섬세함까지 소중하게.
          </S.EssayDescription>
        </S.EssayTextBlock>
        <S.EssayPhotos>
          <S.EssaySmallPhoto data-brand-reveal data-brand-parallax>
            <Image
              src="/images/brand/brand-detail-eye.webp"
              alt="눈가의 자연스러운 디테일을 담은 사진"
              fill
              sizes="(max-width: 760px) 45vw, 25vw"
            />
            <S.PhotoCaption>THE DETAILS — I</S.PhotoCaption>
          </S.EssaySmallPhoto>
          <S.EssayLargePhoto data-brand-reveal data-brand-parallax>
            <Image
              src="/images/brand/brand-detail-portrait.webp"
              alt="자연스러운 표정의 인물 에디토리얼 사진"
              fill
              sizes="(max-width: 760px) 55vw, 40vw"
            />
            <S.PhotoCaption>THE DETAILS — II</S.PhotoCaption>
          </S.EssayLargePhoto>
        </S.EssayPhotos>
      </S.ImageEssay>

      <S.ClosingSection aria-labelledby="closing-title">
        <S.ClosingInterior>
          <S.ClosingEyebrow>THE NEXT CHAPTER IS YOURS</S.ClosingEyebrow>
          <S.ClosingTitle id="closing-title" data-brand-reveal>
            Every beauty
            <br />
            <em>has its own story.</em>
          </S.ClosingTitle>
          <S.ClosingKorean data-brand-reveal>
            당신만의 아름다움을 알아가는 과정,
            <br />그 이야기에 귀 기울이겠습니다.
          </S.ClosingKorean>
          <S.ClosingActions data-brand-reveal>
            <S.PrimaryLink href="#site-footer-contact">
              <span>상담 및 오시는 길</span>
              <span aria-hidden="true">↗</span>
            </S.PrimaryLink>
            <S.SecondaryLink href="/">
              <span>메인으로 돌아가기</span>
              <span aria-hidden="true">→</span>
            </S.SecondaryLink>
          </S.ClosingActions>
          <S.ClosingFooter>
            <span>AHN&apos;S PLASTIC SURGERY</span>
            <span>BEAUTIFULLY, YOU.</span>
          </S.ClosingFooter>
        </S.ClosingInterior>
      </S.ClosingSection>
    </S.Main>
  );
}
