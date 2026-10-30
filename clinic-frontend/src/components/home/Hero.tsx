"use client";

import axios from 'axios';
import useEmblaCarousel from 'embla-carousel-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

// 기존 프로젝트의 스타일 파일 경로를 그대로 사용한다.
import * as S from './Hero.styles';

import type { ReactNode } from "react";

/**

 * 관리자 서버에서 내려주는 슬라이드 데이터 형식.

 * id/fileName/title/link는 현재 서버에서 사용 중인 필드다.

 * mediaType은 나중에 관리자가 영상을 업로드할 때를 위한 선택 항목이다.

 */

interface SlideItem {
  id: number;

  fileName: string;

  title: string;

  link: string;

  mediaType?: "IMAGE" | "VIDEO";
}

interface VisualResponse {
  success: boolean;

  data?: {
    // 기존 서버는 문자열(JSON) 또는 배열로 SLIDES를 반환할 수 있다.

    SLIDES?: string | unknown[];
  };
}

// API 서버 주소를 한 곳에서만 관리한다.

// .env.local에 NEXT_PUBLIC_API_URL을 등록하지 않았다면 기존 4000 포트를 사용한다.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const AUTOPLAY_DELAY = 5000; // 자동 슬라이드 전환 간격: 5,000ms = 5초

/** 서버에서 전달된 데이터가 실제로 슬라이드로 쓸 수 있는 형태인지 확인한다. */

function isSlideItem(value: unknown): value is SlideItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "number" &&
    typeof item.fileName === "string" &&
    item.fileName.trim().length > 0 &&
    typeof item.title === "string" &&
    typeof item.link === "string"
  );
}

/**

 * 관리자가 입력한 링크를 그대로 사용할 경우 javascript: 같은 잘못된 주소가

 * 들어올 수 있다. 내부 경로(/about)와 http(s) 주소만 허용한다.

 */

function safeHref(link: string): string {
  if (link.startsWith("/") && !link.startsWith("//")) return link;

  if (/^https?:\/\//i.test(link)) return link;

  return "/";
}

/**

 * 현재 DB에는 mediaType이 없으므로 파일 확장자로 이미지/영상을 구분한다.

 * 백엔드에 mediaType을 추가한 뒤에는 해당 값이 우선 적용된다.

 */

function isVideo(slide: SlideItem): boolean {
  if (slide.mediaType === "VIDEO") return true;

  if (slide.mediaType === "IMAGE") return false;

  return /\.(mp4|webm|ogg)$/i.test(slide.fileName);
}

/**

 * rollingBanner는 현재 프로젝트의 <RollingBanner />를 바깥에서 전달받는다.

 * Hero 내부에 직접 import하지 않아 기존 파일의 경로를 바꿀 필요가 없다.

 * JSX를 prop으로 넘기는 패턴을 "컴포지션"이라고 부른다.

 */

interface HeroProps {
  rollingBanner?: ReactNode;

  /** 서버에서 가져온 최초 Hero 슬라이드. 첫 이미지 요청을 앞당긴다. */
  initialSlides?: SlideItem[];

  /** 인트로가 활성화될 때 무거운 GSAP 초기화를 완료 이후로 미룬다. */
  introPlaying?: boolean;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Hero({
  rollingBanner,
  initialSlides = [],
  introPlaying = false,
}: HeroProps) {
  // Embla는 슬라이드의 '좌우 이동'만 담당한다.

  // GSAP은 바깥 viewport만 흐림/페이드하므로 Embla와 transform이 충돌하지 않는다.

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,

    align: "start",

    duration: 30,
  });

  const [slides, setSlides] = useState<SlideItem[]>(initialSlides);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [loading, setLoading] = useState(initialSlides.length === 0);

  const [tabHidden, setTabHidden] = useState(false);

  const [scrollInteracting, setScrollInteracting] = useState(false);

  const [introReady, setIntroReady] = useState(!introPlaying);
  const scrollInteractionRef = useRef(false);

  const setInteractionIfChanged = useCallback((next: boolean) => {
    if (scrollInteractionRef.current === next) return;
    scrollInteractionRef.current = next;
    setScrollInteracting(next);
  }, []);

  useEffect(() => {
    if (!introPlaying) {
      setIntroReady(true);
      return;
    }

    const onIntroFinished = () => setIntroReady(true);
    window.addEventListener("ahns:intro-finished", onIntroFinished);

    // 모션 감소 설정이나 새로고침 판정으로 인트로가 즉시 사라졌을 때도 재개한다.
    if (!document.getElementById("ahns-brand-intro")) onIntroFinished();

    return () =>
      window.removeEventListener("ahns:intro-finished", onIntroFinished);
  }, [introPlaying]);

  // useRef는 값을 기억하지만, 값이 바뀌어도 컴포넌트를 다시 렌더링하지 않는다.

  // 실제 DOM이나 GSAP 애니메이션 객체를 보관할 때 유용하다.

  const sectionRef = useRef<HTMLElement>(null);

  const progressRef = useRef<HTMLDivElement>(null);

  const autoplayRef = useRef<gsap.core.Tween | null>(null);

  // API 오류가 발생해도 없는 로컬 이미지를 임의로 불러오지 않는다.

  // DB에 이미지가 없으면 세이지 그린 기본 화면과 브랜드 문구를 보여준다.

  const displayedSlides: SlideItem[] = slides.length
    ? slides
    : [{ id: -1, fileName: "", title: "Your Beauty, Reimagined.", link: "/" }];

  // 1. 관리자 Hero 설정 불러오기

  useEffect(() => {
    // 초기 슬라이드는 서버가 전달했으므로 클라이언트 API를 중복 호출하지 않는다.
    if (initialSlides.length > 0) return;

    const controller = new AbortController();

    const fetchVisualSettings = async () => {
      try {
        const response = await axios.get<VisualResponse>(
          `${API_URL}/api/admin/visual`,

          { signal: controller.signal },
        );

        // 서버 요청에는 성공했지만, 응답 결과가 실패인 경우도 처리한다.

        if (!response.data.success) {
          setSlides([]);

          return;
        }

        const raw = response.data.data?.SLIDES;

        let parsed: unknown = raw;

        // 백엔드가 배열을 JSON 문자열로 저장했다면 배열로 변환한다.

        // 예: '[{"id":1,...}]' → [{ id: 1, ... }]

        if (typeof raw === "string") parsed = JSON.parse(raw);

        // Array.isArray는 실제 배열인지를 검사한다.

        // 잘못된 데이터가 들어오면 .map()에서 오류가 생기므로 미리 검사한다.

        const validSlides = Array.isArray(parsed)
          ? parsed.filter(isSlideItem)
          : [];

        setSlides(validSlides);
      } catch (error) {
        // 다른 페이지로 이동해서 요청이 취소된 경우는 정상적인 정리이므로 제외한다.

        if (controller.signal.aborted) return;

        console.error("Hero 비주얼 설정 로드 실패:", error);

        setSlides([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void fetchVisualSettings();

    // 페이지를 떠날 때 진행 중이던 API 요청을 취소한다.

    return () => controller.abort();
  }, [initialSlides.length]);

  // 2. Embla가 선택한 슬라이드 번호를 React state와 동기화

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

    emblaApi.on("select", onSelect);

    onSelect();

    // 이벤트를 해제하지 않으면 컴포넌트 재실행 시 같은 이벤트가 중복될 수 있다.

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // 3. 슬라이드가 바뀔 때마다 '글자 등장 + 이미지 아주 미세한 움직임' 실행

  useEffect(() => {
    if (loading || !introReady || !sectionRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const activeSlide = sectionRef.current?.querySelector(
        `[data-slide-index="${selectedIndex}"]`,
      );

      if (!activeSlide) return;

      const textItems = activeSlide.querySelectorAll("[data-animate]");

      gsap.fromTo(
        textItems,

        { y: 24, opacity: 0 },

        {
          y: 0,

          opacity: 1,

          duration: 0.85,

          stagger: 0.12, // 제목, 설명 등이 0.12초 간격으로 순서대로 나타난다.

          ease: "power2.out",

          overwrite: "auto",
        },
      );

      const image = activeSlide.querySelector("[data-image-inner]");

      if (image) {
        // 배경 사진이 흔들리지 않도록 기존 1.12배 확대 대신 1.025배만 사용한다.

        gsap.fromTo(
          image,

          { scale: 1.025 },

          { scale: 1, duration: 6, ease: "power1.out", overwrite: "auto" },
        );
      }
    }, sectionRef);

    return () => context.revert();
  }, [selectedIndex, loading, introReady]);

  // 4. Pin-spacer cleanup before React removes DOM on route changes.

  useIsomorphicLayoutEffect(() => {
    if (loading || !introReady || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;

    const media = gsap.matchMedia();

    // PC에서만 Hero를 잠깐 pin한다. 모바일에서는 자연스러운 기본 세로 스크롤.

    // 사용자 시스템의 '동작 줄이기' 설정도 존중한다.

    media.add(
      "(min-width: 769px) and (prefers-reduced-motion: no-preference)",

      () => {
        // Embla의 '슬라이드 가로 이동' transform에는 접근하지 않는다.

        // 사진 전체를 담은 viewport만 가볍게 확대/페이드하므로 충돌을 피한다.

        const viewport = section.querySelector<HTMLElement>(
          "[data-hero-viewport]",
        );

        const veil = section.querySelector<HTMLElement>("[data-focus-veil]");

        // 포그는 따뜻한 그라데이션, matchOverlay는 전환 마지막의 '단색 정렬'이다.

        const matchOverlay =
          section.querySelector<HTMLElement>("[data-color-match]");

        const contents = section.querySelectorAll<HTMLElement>(
          "[data-slide-content]",
        );

        const rolling = section.querySelector<HTMLElement>(
          "[data-hero-rolling]",
        );

        const controls = section.querySelector<HTMLElement>(
          "[data-bottom-controls]",
        );

        const copy = section.querySelector<HTMLElement>("[data-reveal-copy]");

        const sideNote = section.querySelector<HTMLElement>(
          "[data-reveal-label]",
        );

        if (!viewport || !veil || !matchOverlay || !copy) return;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,

            start: "top top",

            end: () => `+=${Math.round(window.innerHeight * 2.5)}`,

            pin: true,

            pinSpacing: true,

            refreshPriority: 10, // 아래 CategoryNav의 pin보다 먼저 위치 계산

            scrub: 1, // 스크롤 진행률과 정확히 1:1로 동기화

            anticipatePin: 1,

            invalidateOnRefresh: true,

            onUpdate: (self) => {
              // Hero가 전환 중에는 자동 슬라이드가 교체되지 않게 한다.

              const active = self.progress > 0.015;

              setInteractionIfChanged(active);
            },

            onLeave: () => setInteractionIfChanged(false),

            onLeaveBack: () => setInteractionIfChanged(false),
          },
        });

        // [A] 초반: 사진/롤링 배너 위의 제목과 조작 UI가 먼저 사라진다.

        // copy와 reveal은 처음부터 CSS visibility:hidden이어서 깜빡임이 없다.

        timeline.to(
          contents,

          {
            autoAlpha: 0,

            y: -20,

            duration: 0.25,

            ease: "none",
          },

          0,
        );

        if (rolling) {
          timeline.to(
            rolling,

            {
              autoAlpha: 0,

              y: -22,

              duration: 0.24,

              ease: "none",
            },

            0,
          );
        }

        if (controls) {
          timeline.to(
            controls,

            {
              autoAlpha: 0,

              duration: 0.23,

              ease: "none",
            },

            0,
          );
        }

        // [B] 초점 이탈: 사진은 전혀 잘라내지 않고, 화면 가득 유지하면서

        // 1.045배 미세 확대 + 최대 7px blur + 투명도로 자연스럽게 사라진다.

        // blur는 전체 전환 후반에만 잠깐 사용하고 최종적으로 사진을 숨긴다.

        timeline.to(
          viewport,

          {
            scale: 1.045,

            autoAlpha: 0,

            duration: 0.64,

            ease: "none",
          },

          0.16,
        );

        // [C] 이미지가 흐려지는 동안 아이보리→세이지 포그 레이어가 들어온다.

        // 배경 끝은 CategoryNav TransitionBridge와 동일한 #A1AF96.

        timeline.to(
          veil,

          {
            opacity: 1,

            duration: 0.62,

            ease: "none",
          },

          0.15,
        );

        // [D] 사진이 사라지는 '마지막 구간'에서만 그라데이션을 단색으로 정리.

        // 이렇게 해야 Hero의 마지막 전체 화면과 CategoryNav 시작 색이 동일하다.

        // opacity만 움직여서 그라데이션의 색상 보간 부작용도 피한다.

        timeline.to(
          matchOverlay,

          {
            autoAlpha: 1,

            duration: 0.22,

            ease: "none",
          },

          0.7,
        );

        // [E] 사진이 충분히 부드러워진 뒤 중앙 브랜드 문구가 '선명하게' 등장.

        // filter의 blur→0은 브랜드 타이포의 초점이 맞는 느낌을 만든다.

        timeline.fromTo(
          copy,

          { autoAlpha: 0, y: 46 },

          {
            autoAlpha: 1,

            y: 0,

            duration: 0.42,

            ease: "none",
          },

          0.46,
        );

        // 브랜드 장면을 잠깐 유지해 다음 섹션으로 급하게 넘어가지 않도록 한다.

        timeline.to(copy, { y: 0, duration: 0.36, ease: "none" }, 0.92);

        if (sideNote) {
          timeline.fromTo(
            sideNote,

            { autoAlpha: 0, y: 12 },

            {
              autoAlpha: 1,

              y: 0,

              duration: 0.3,

              ease: "none",
            },

            0.62,
          );
        }

        return () => {
          timeline.scrollTrigger?.kill();

          timeline.kill();
        };
      },
    );

    // 모바일은 기존과 동일하게 pin을 생략한다.

    // 중앙 RollingBanner만 초반 스크롤에서 부드럽게 사라지도록 한다.

    media.add(
      "(max-width: 768px) and (prefers-reduced-motion: no-preference)",

      () => {
        const rolling = section.querySelector("[data-hero-rolling]");

        if (!rolling) return;

        const tween = gsap.to(rolling, {
          autoAlpha: 0,

          y: -16,

          ease: "none",

          scrollTrigger: {
            trigger: section,

            start: "top top",

            end: "25% top",

            scrub: 1,
          },
        });

        return () => tween.kill();
      },
    );

    // Hero는 관리자 API 로딩 이후 pin이 생성된다. 그 이전에 아래

    // CategoryNav의 ScrollTrigger가 먼저 생성되었을 수 있으므로 전체를 재측정.

    const refreshFrame = requestAnimationFrame(() => {
      ScrollTrigger.sort();

      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshFrame);

      media.revert(); // Strict Mode, 라우트 변경, 화면 크기 변경 시 정리
    };
  }, [loading, introReady, setInteractionIfChanged]);

  // 5. 진행 막대를 0% → 100%로 채우고, 완료되면 다음 슬라이드로 이동

  useEffect(() => {
    autoplayRef.current?.kill();

    const progress = progressRef.current;

    if (!introReady || !emblaApi || !progress || slides.length < 2) return;

    gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

    if (tabHidden || scrollInteracting) return;

    const tween = gsap.to(progress, {
      scaleX: 1,

      duration: AUTOPLAY_DELAY / 1000,

      ease: "none",

      onComplete: () => emblaApi.scrollNext(),
    });

    autoplayRef.current = tween;

    return () => {
      tween.kill();

      if (autoplayRef.current === tween) autoplayRef.current = null;
    };
  }, [
    emblaApi,
    selectedIndex,
    slides.length,
    tabHidden,
    scrollInteracting,
    introReady,
  ]);

  // 6. 다른 탭으로 이동한 동안에는 불필요한 자동 슬라이드 재생을 멈춘다.

  useEffect(() => {
    const onVisibilityChange = () => setTabHidden(document.hidden);

    onVisibilityChange();

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // useCallback은 emblaApi가 바뀌지 않으면 같은 함수를 재사용하게 한다.

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);

  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),

    [emblaApi],
  );

  return (
    <S.CarouselSection
      ref={sectionRef}
      aria-label="메인 비주얼"
      aria-busy={loading}
    >
      {/* 전체 화면 사진은 줄어들거나 사각형으로 잘리지 않는다. */}

      <S.EmblaViewport ref={emblaRef} data-hero-viewport>
        <S.EmblaContainer>
          {displayedSlides.map((slide, index) => (
            <S.EmblaSlide key={slide.id} data-slide-index={index}>
              <S.SlideLink
                as={Link}
                href={safeHref(slide.link)}
                tabIndex={index === selectedIndex ? 0 : -1}
                aria-label={`${slide.title} 자세히 보기`}
              >
                {/* 풀스크린 이미지. 기존 사각형 축소 clip-path는 완전히 제거했다. */}

                <S.VisualFrame data-visual-frame>
                  <S.ImageWrapper data-image-inner>
                    {slide.fileName ? (
                      isVideo(slide) ? (
                        <S.HeroVideo
                          src={`${API_URL}/images/${encodeURIComponent(slide.fileName)}`}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          aria-hidden="true"
                        />
                      ) : (
                        <Image
                          src={`${API_URL}/images/${encodeURIComponent(slide.fileName)}`}
                          alt={slide.title || "메인 비주얼"}
                          fill
                          priority={index === 0}
                          loading={index === 0 ? "eager" : "lazy"}
                          sizes="100vw"
                          style={{
                            objectFit: "cover",

                            objectPosition: "center",
                          }}
                        />
                      )
                    ) : (
                      <S.EmptyMedia aria-hidden="true" />
                    )}
                  </S.ImageWrapper>

                  {/* 읽기 쉬운 첫 화면을 위한 사진 위 그라데이션. */}

                  <S.ImageOverlay aria-hidden="true" />
                </S.VisualFrame>

                <S.SlideContent
                  data-slide-content
                  $withRollingBanner={Boolean(rollingBanner)}
                >
                  <S.Eyebrow data-animate>
                    <S.EyebrowLine /> AHN'S PLASTIC SURGERY
                  </S.Eyebrow>

                  <S.HeroEditorialTitle data-animate>
                    <span>A NATURAL</span>

                    <em>Moment</em>
                  </S.HeroEditorialTitle>

                  <S.SlideTitle data-animate>{slide.title}</S.SlideTitle>

                  <S.SlideDescription data-animate data-hero-description>
                    당신만의 아름다움을 발견하는 시간
                  </S.SlideDescription>

                  <S.ExploreLink data-animate data-hero-explore>
                    DISCOVER MORE <span aria-hidden="true">↗</span>
                  </S.ExploreLink>
                </S.SlideContent>
              </S.SlideLink>
            </S.EmblaSlide>
          ))}
        </S.EmblaContainer>
      </S.EmblaViewport>

      {/*

        Hero에 겹쳐 보여줄 기존 RollingBanner.

        page.tsx에서 <Hero rollingBanner={<RollingBanner />} />로 전달한다.

        처음에는 화면 중앙에 있고, 스크롤하면 GSAP 타임라인에서 사라진다.

        이 배너는 별도 섹션으로 렌더링하지 않으므로 중복 표시되지 않는다.

      */}

      {rollingBanner && (
        <S.HeroRollingOverlay data-hero-rolling aria-label="브랜드 롤링 배너">
          {rollingBanner}
        </S.HeroRollingOverlay>
      )}

      {/*

        사진을 흐리게 만드는 동안 덮이는 아주 밝은 빛(포그) 레이어.

        pointer-events:none이어서 슬라이드의 드래그/클릭을 막지 않는다.

        이 레이어의 아랫쪽 색을 #A1AF96으로 맞춰 CategoryNav와 연결한다.

      */}

      <S.FocusVeil data-focus-veil aria-hidden="true" />

      {/* 마지막에는 화면 전체를 CategoryNav의 시작 색상과 정확히 맞춘다. */}

      <S.ColorMatchOverlay data-color-match aria-hidden="true" />

      {/* Scroll outro: photographic Hero -> softly textured editorial typography. */}

      <S.RevealCopy data-reveal-copy aria-label="Every detail, uniquely yours.">
        <S.RevealEyebrow>THE ART OF YOUR OWN BEAUTY</S.RevealEyebrow>

        <S.RevealTitle>
          <S.RevealEvery>Every</S.RevealEvery>

          <S.RevealDetail>detail,</S.RevealDetail>

          <S.RevealUniquely>uniquely</S.RevealUniquely>

          <S.RevealYours>yours.</S.RevealYours>
        </S.RevealTitle>

        <S.RevealRule aria-hidden="true" />
      </S.RevealCopy>

      <S.RevealSideNote data-reveal-label>
        A NATURAL MOMENT — AHN'S
      </S.RevealSideNote>

      <S.BottomControls data-bottom-controls>
        <S.ScrollCue aria-hidden="true">SCROLL TO EXPLORE ↓</S.ScrollCue>

        {slides.length > 1 && (
          <S.ControlGroup>
            <S.SlideCounter>
              <S.CurrentNumber>
                {String(selectedIndex + 1).padStart(2, "0")}
              </S.CurrentNumber>

              <S.CounterDivider />

              <S.TotalNumber>
                {String(slides.length).padStart(2, "0")}
              </S.TotalNumber>
            </S.SlideCounter>

            <S.ProgressTrack aria-hidden="true">
              <S.ProgressFill ref={progressRef} />
            </S.ProgressTrack>

            <S.DotNavigation>
              {slides.map((slide, index) => (
                <S.DotButton
                  key={slide.id}
                  type="button"
                  $active={selectedIndex === index}
                  aria-label={`${index + 1}번 슬라이드`}
                  aria-current={selectedIndex === index ? "true" : undefined}
                  onClick={() => scrollTo(index)}
                />
              ))}
            </S.DotNavigation>

            <S.ArrowNavigation>
              <S.NavButton
                type="button"
                onClick={scrollPrev}
                aria-label="이전 슬라이드"
              >
                <span aria-hidden="true">←</span>
              </S.NavButton>

              <S.NavButton
                type="button"
                onClick={scrollNext}
                aria-label="다음 슬라이드"
              >
                <span aria-hidden="true">→</span>
              </S.NavButton>
            </S.ArrowNavigation>
          </S.ControlGroup>
        )}
      </S.BottomControls>

      {loading && <S.LoadingOverlay aria-label="메인 비주얼 로딩 중" />}
    </S.CarouselSection>
  );
}
