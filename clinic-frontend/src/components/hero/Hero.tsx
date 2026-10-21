"use client";

import axios from "axios";
import useEmblaCarousel from "embla-carousel-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// 기존 프로젝트의 스타일 파일 경로를 그대로 사용한다.
import * as S from "../../assets/css/components/Hero";

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
}

export default function Hero({ rollingBanner }: HeroProps) {
  // Embla는 슬라이드의 '좌우 이동'만 담당한다.
  // GSAP이 움직일 이미지 마스크는 슬라이드 내부에 따로 두어 충돌을 피한다.
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    duration: 30,
  });

  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tabHidden, setTabHidden] = useState(false);
  const [scrollInteracting, setScrollInteracting] = useState(false);

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
  }, []);

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
    if (loading || !sectionRef.current) return;
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
  }, [selectedIndex, loading]);

  // 4. 핵심 인터랙션: 화면을 꽉 채운 이미지가 스크롤에 따라 오른쪽 편집형 프레임으로 축소
  useEffect(() => {
    if (loading || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const media = gsap.matchMedia();

    // 모바일과 '움직임 줄이기' 사용자에게는 pin 효과를 적용하지 않는다.
    media.add(
      "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
      () => {
        const frames = section.querySelectorAll("[data-visual-frame]");
        const contents = section.querySelectorAll("[data-slide-content]");
        const control = section.querySelector("[data-bottom-controls]");
        // Hero 중앙에 올린 RollingBanner 역시 이 타임라인의 일부로 제어한다.
        const rolling = section.querySelector("[data-hero-rolling]");
        // 두 번째 브랜드 메시지는 이미지가 줄어든 이후에만 보인다.
        const revealCopy = section.querySelector("[data-reveal-copy]");
        const revealLabel = section.querySelector("[data-reveal-label]");

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 1.05)}`,

            // 숫자가 높을수록 스크롤 위치를 먼저 계산한다.
            // Hero가 먼저 계산되어야 아래 갤러리 위치도 정확해진다.
            refreshPriority: 10,

            // 스크롤 도중 Hero를 고정한다.
            pin: true,

            // 고정된 스크롤 거리만큼 실제 공간도 확보한다.
            pinSpacing: true,

            // 스크롤 진행률과 애니메이션 진행률을 정확하게 맞춘다.
            // 이전의 scrub: 1.1에서 변경했다.
            scrub: true,
          },
        });

        // ① 첫 화면은 이미지가 Hero 전체를 채운다(잘라내는 영역이 0%).
        // ② 사용자가 휠을 내리면 상하좌우 여백이 생기고,
        //    오른쪽에 배치된 사각형 에디토리얼 사진으로 자연스럽게 바뀐다.
        //    이미지가 움직이는 게 아니라 '보이는 영역'을 변경하기 때문에
        //    배경이 흔들리는 느낌이 적고 Embla 이동 애니메이션과 충돌하지 않는다.
        timeline.to(
          frames,
          {
            clipPath: "inset(12% 8% 12% 43% round 28px)",
            ease: "none",
          },
          0,
        );

        // 처음 이미지 위에 있던 제목과 슬라이드 컨트롤은 점차 사라진다.
        timeline.to(contents, { opacity: 0, y: -22, ease: "none" }, 0);

        if (rolling) {
          // RollingBanner는 사진이 줄어들기 시작하는 초기 25% 구간에서 사라진다.
          // autoAlpha는 opacity + visibility를 함께 조정하므로
          // 보이지 않는 배너가 계속 클릭 대상이 되는 문제도 피할 수 있다.
          timeline.to(
            rolling,
            { autoAlpha: 0, y: -28, duration: 0.25, ease: "none" },
            0,
          );
        }
        if (control) timeline.to(control, { opacity: 0, ease: "none" }, 0);

        // 축소된 이미지 옆으로 브랜드 메시지가 등장한다.
        // 이미지 확대/축소가 시작되자마자 나타나면 서로 겹치기 때문에
        // 전체 타임라인 진행률의 약 38% 이후부터 보이도록 만든다.
        if (revealCopy) {
          timeline.fromTo(
            revealCopy,
            { autoAlpha: 0, y: 36 },
            { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
            0.38,
          );
        }
        if (revealLabel) {
          timeline.fromTo(
            revealLabel,
            { autoAlpha: 0, x: -24 },
            { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" },
            0.48,
          );
        }

        return () => timeline.kill();
      },
    );

    // 모바일에서는 pin 없이 일반 스크롤한다.
    // 단, "스크롤하면 배너 사라짐" 요구는 모바일에도 적용한다.
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
            scrub: true,
          },
        });
        return () => tween.kill();
      },
    );

    // 반응형 조건이 바뀌거나 컴포넌트가 사라지면 pin/애니메이션을 해제한다.
    return () => {
      media.revert();
    };
  }, [loading, displayedSlides.length]);

  // 5. 진행 막대를 0% → 100%로 채우고, 완료되면 다음 슬라이드로 이동
  useEffect(() => {
    autoplayRef.current?.kill();
    const progress = progressRef.current;
    if (!emblaApi || !progress || slides.length < 2) return;

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
  }, [emblaApi, selectedIndex, slides.length, tabHidden, scrollInteracting]);

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
      <S.EmblaViewport ref={emblaRef}>
        <S.EmblaContainer>
          {displayedSlides.map((slide, index) => (
            <S.EmblaSlide key={slide.id} data-slide-index={index}>
              <S.SlideLink
                as={Link}
                href={safeHref(slide.link)}
                tabIndex={index === selectedIndex ? 0 : -1}
                aria-label={`${slide.title} 자세히 보기`}
              >
                {/* 첫 화면은 풀스크린, 스크롤하면 이미지가 우측 프레임으로 작아진다.
                    EmblaContainer의 transform은 건드리지 않아 슬라이드 이동과 충돌하지 않는다. */}
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
                  {/* 배경 이미지와 그라데이션을 같은 프레임 안에 둔다.
                      그래야 프레임이 작아질 때 그라데이션도 함께 줄어든다. */}
                  <S.ImageOverlay aria-hidden="true" />
                </S.VisualFrame>

                <S.SlideContent
                  data-slide-content
                  $withRollingBanner={Boolean(rollingBanner)}
                >
                  <S.Eyebrow data-animate>
                    <S.EyebrowLine />A NATURAL MOMENT
                  </S.Eyebrow>
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

      {/* 스크롤 후에만 보이는 두 번째 화면. 처음부터 DOM에는 있지만 투명하게 숨겨진다.
          첫 번째 화면을 빈 배경 + 작은 사진으로 시작하지 않는 것이 이번 리뉴얼의 핵심이다. */}
      <S.RevealCopy data-reveal-copy aria-hidden="true">
        <S.RevealEyebrow>THE AHN'S PHILOSOPHY</S.RevealEyebrow>
        <S.RevealTitle>
          Beauty,
          <br />
          In Your Own Way.
        </S.RevealTitle>
        <S.RevealDescription>
          정해진 아름다움이 아닌,
          <br />
          당신만의 조화를 찾아가는 곳.
        </S.RevealDescription>
        <S.RevealRule aria-hidden="true" />
        <S.RevealTagline>AN EXPRESSION OF YOU — AHN'S</S.RevealTagline>
      </S.RevealCopy>

      <S.RevealSideNote data-reveal-label aria-hidden="true">
        01 — THE ART OF NATURAL BEAUTY
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
