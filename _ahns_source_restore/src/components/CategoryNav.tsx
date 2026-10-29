"use client";

import axios from 'axios';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import * as S from '@/assets/css/components/CategoryNav.styles';

/**
 * [기존 관리자 API 응답 형식]
 * Express 서버의 /api/admin/categories 에서 전달되는 원본 데이터다.
 * 서버의 필드명을 바꾸지 않고 그대로 사용한다.
 */
interface CategoryResponseItem {
  CATEGORY_IDX: number;
  TITLE: string;
  FILE_NAME: string;
  LINK: string | null;
}

/**
 * [화면에 표시하기 좋은 데이터 형식]
 * DB에서 받아온 대문자 필드명을 React 코드에서 읽기 편한 이름으로 바꾼다.
 */
interface CategoryData {
  id: number;
  name: string;
  img: string;
  link: string;
}

interface CategoryApiResponse {
  success: boolean;
  data: CategoryResponseItem[];
}

// 실제 이미지 파일은 Next.js public 폴더가 아니라 Express 서버가 제공한다.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// GSAP에서 ScrollTrigger 기능을 사용할 수 있도록 플러그인을 등록한다.
gsap.registerPlugin(ScrollTrigger);

/**
 * DB에 등록된 링크가 비어 있거나 잘못된 문자열이면 #으로 처리한다.
 * 이 검사는 javascript: 와 같은 위험한 주소가 링크로 들어가는 것도 막는다.
 */
function getSafeLink(link: string | null): string {
  const value = link?.trim() ?? "";
  if (/^(https?:\/\/|\/(?!\/)|#)/i.test(value)) return value;
  return "#";
}

export default function CategoryNav() {
  // categories: 서버에서 가져와 카드로 표시할 진료 분야 목록.
  const [categories, setCategories] = useState<CategoryData[]>([]);

  // loading: 요청이 끝났는지 구분한다. true인 동안에는 로딩 상태를 보여준다.
  const [loading, setLoading] = useState(true);

  // 현재 사용자가 가로 갤러리에서 보고 있는 카드 번호(0부터 시작).
  const [selectedIndex, setSelectedIndex] = useState(0);

  /**
   * useRef는 HTML 요소를 기억할 때 사용한다.
   * useState와 달리 ref.current가 바뀌어도 React 화면이 다시 렌더링되지 않는다.
   * GSAP처럼 HTML 요소 자체를 움직이는 라이브러리와 함께 사용하기 좋다.
   */
  const sectionRef = useRef<HTMLElement>(null); // 갤러리를 화면에 고정할 영역
  const viewportRef = useRef<HTMLDivElement>(null); // 화면에 실제로 보이는 가로 너비
  const trackRef = useRef<HTMLDivElement>(null); // 카드들을 가로로 나열한 긴 줄
  const progressRef = useRef<HTMLDivElement>(null); // 이동 진행률을 보여주는 선

  // ────────────────────────────────────────────────────────────────
  // 1. 관리자 DB에서 카테고리 정보를 가져온다.
  // ────────────────────────────────────────────────────────────────
  useEffect(() => {
    // 컴포넌트가 사라졌을 때 진행 중이던 API 요청을 취소하기 위한 객체.
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        const response = await axios.get<CategoryApiResponse>(
          `${API_URL}/api/admin/categories`,
          { signal: controller.signal },
        );

        // 응답이 실패했거나 실제 배열이 아니면 카드 데이터로 사용하지 않는다.
        if (!response.data.success || !Array.isArray(response.data.data)) {
          setCategories([]);
          return;
        }

        const formatted: CategoryData[] = response.data.data
          .filter((category) => {
            // 화면에서 사용하는 필수 값들이 정상적인지 먼저 검사한다.
            return (
              category !== null &&
              typeof category === "object" &&
              typeof category.CATEGORY_IDX === "number" &&
              typeof category.TITLE === "string" &&
              typeof category.FILE_NAME === "string" &&
              category.FILE_NAME.trim().length > 0
            );
          })
          .map((category) => ({
            id: category.CATEGORY_IDX,
            name: category.TITLE,
            // DB에는 파일명이 저장되어 있고 실제 이미지는 Express가 제공한다.
            img: `${API_URL}/images/${encodeURIComponent(category.FILE_NAME)}`,
            link: getSafeLink(category.LINK),
          }));

        setCategories(formatted);
      } catch (error) {
        // 페이지 이동으로 요청이 취소된 상황에서는 오류 메시지를 출력하지 않는다.
        if (!controller.signal.aborted) {
          console.error("진료 카테고리를 불러오지 못했습니다:", error);
          setCategories([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void fetchCategories();

    // React 컴포넌트가 사라질 때 요청을 취소한다.
    return () => controller.abort();
  }, []);

  // ────────────────────────────────────────────────────────────────
  // 2. PC에서는 세로 휠을 가로 카드 이동에 연결한다.
  // ────────────────────────────────────────────────────────────────
  useEffect(() => {
    // 서버 데이터가 아직 없으면 카드 너비를 측정할 수 없으므로 기다린다.
    if (loading || categories.length === 0) return;

    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!section || !viewport || !track) return;

    /**
     * 필요한 가로 이동 거리 계산법:
     *
     * track.scrollWidth : 카드들과 카드 사이 여백을 합친 전체 가로 길이
     * viewport.clientWidth : 브라우저에서 실제로 보이는 가로 영역의 길이
     *
     * 예시) 전체 카드 줄 2500px - 보이는 화면 1200px = 1300px 이동
     * Math.max(0, ...)는 카드가 1개라 이동할 필요가 없는 경우를 처리한다.
     */
    const getDistance = () =>
      Math.max(0, track.scrollWidth - viewport.clientWidth);

    const scrollSpeedMultiplier = 1.4;

    // 브라우저 화면 크기와 '움직임 줄이기' 접근성 설정에 따라 GSAP을 켜거나 끈다.
    const media = gsap.matchMedia();

    media.add(
      "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
      () => {
        // 가로로 움직일 거리가 없으면 pin(화면 고정)을 만들지 않는다.
        if (getDistance() <= 0) {
          if (progressRef.current)
            progressRef.current.style.transform = "scaleX(1)";
          return;
        }

        // gsap.to()는 현재 위치에서 설정한 목표 위치까지 요소를 움직인다.
        const animation = gsap.to(track, {
          // x가 음수이면 카드 줄 전체가 왼쪽으로 이동한다.
          // 함수를 사용하므로 화면 크기가 바뀌면 새로운 이동 거리를 측정한다.
          x: () => -getDistance(),
          ease: "none", // 스크롤 거리와 실제 이동 거리를 1:1에 가깝게 연결
          scrollTrigger: {
            trigger: section, // 이 섹션이 화면에 도달했는지 판단할 기준
            start: "top top", // 섹션 상단과 화면 상단이 만날 때 시작
            end: () =>
              `+=${Math.max(1, getDistance() * scrollSpeedMultiplier)}`,

            // 이동하는 동안 섹션을 화면에 고정한다.
            pin: true,
            pinSpacing: true, // 고정 시간만큼 다음 섹션을 아래로 밀어 겹침 방지

            // 사용자의 스크롤 진행률이 곧 카드의 이동 진행률이 된다.
            scrub: 0.8,
            anticipatePin: 1, // pin 시작 지점의 작은 화면 떨림을 줄인다.

            // Hero에서도 pin을 사용하므로, 위치 계산은 Hero부터 먼저 하도록 한다.
            // 기존 Hero의 refreshPriority: 10보다 낮은 0으로 둔다.
            refreshPriority: 0,
            invalidateOnRefresh: true, // 창 크기가 바뀌면 이동 거리 다시 계산
            fastScrollEnd: true,

            onUpdate: (self) => {
              // self.progress는 0(시작)~1(종료) 사이 숫자다.
              // 진행률 선은 DOM 스타일을 직접 바꿔서 불필요한 React 렌더링을 줄인다.
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }

              // 지금 어떤 카드를 보고 있는지 상태에 반영한다.
              // 실제로 번호가 달라질 때만 setSelectedIndex로 렌더링을 발생시킨다.
              const next = Math.min(
                categories.length - 1,
                Math.round(self.progress * (categories.length - 1)),
              );
              setSelectedIndex((previous) =>
                previous === next ? previous : next,
              );
            },
          },
        });

        // PC→모바일 또는 접근성 설정 변경 시 이전 애니메이션을 제거한다.
        return () => animation.kill();
      },
    );

    // pin이 생성되면 문서의 전체 스크롤 길이가 달라진다.
    // 따라서 다음 화면 그리기 시점에 Hero와 갤러리 위치를 다시 계산한다.
    // Hero는 refreshPriority: 10, 이 갤러리는 0이라 Hero가 먼저 계산된다.
    const frame = window.requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      media.revert(); // GSAP matchMedia에서 만든 ScrollTrigger까지 정리
    };
  }, [loading, categories.length]);

  // ────────────────────────────────────────────────────────────────
  // 3. API 요청 후 섹션이 사라지거나 높이가 달라진 경우도 위치를 갱신한다.
  // ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || categories.length !== 0) return;

    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, [loading, categories.length]);

  // 모바일에서는 pin 대신 기본 가로 스와이프를 사용한다.
  // 사용자가 카드 줄을 손가락으로 옮겼을 때 진행률 표시도 함께 변경한다.
  const handleNativeScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    if (maxScroll <= 0) return;

    const progress = Math.min(1, Math.max(0, viewport.scrollLeft / maxScroll));
    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${progress})`;
    }
    const next = Math.min(
      categories.length - 1,
      Math.round(progress * (categories.length - 1)),
    );
    setSelectedIndex((previous) => (previous === next ? previous : next));
  };

  // DB 로딩 전후에 Hero 아래의 전환 영역을 동일한 높이로 유지한다.
  // 요청이 끝날 때 이 공간이 갑자기 추가되면 사용 중인 스크롤 위치가 튈 수 있다.
  const transitionBridge = (
    <S.TransitionBridge aria-hidden="true">
      <S.BridgeInner>
        <S.BridgeEyebrow>DISCOVER YOUR OWN BEAUTY</S.BridgeEyebrow>
        <S.BridgeLine data-editorial-rule />
        <S.MobileBridgeTitle aria-hidden="true">
          <span>Every detail,</span>
          <em>uniquely yours.</em>
        </S.MobileBridgeTitle>
      </S.BridgeInner>
    </S.TransitionBridge>
  );

  // 로딩 중에도 전환 영역과 갤러리 높이를 유지해 화면 점프를 줄인다.
  if (loading) {
    return (
      <>
        {transitionBridge}
        <S.Section aria-label="진료 분야 불러오는 중">
          <S.LoadingMessage role="status">
            PREPARING YOUR EXPERIENCE...
          </S.LoadingMessage>
        </S.Section>
      </>
    );
  }

  // DB에 진료 카테고리가 없으면 가짜 카드나 빈 갤러리를 보여주지 않는다.
  if (categories.length === 0) return null;

  return (
    <>
      {/* Hero와 갤러리 사이에 일반 스크롤로 지나가는 세이지→아이보리 전환 구간 */}
      {transitionBridge}

      <S.Section ref={sectionRef} aria-label="진료 분야 소개">
        <S.Heading>
          <S.Kicker>
            AHN'S SIGNATURE COLLECTION
            <span>— 01 / {String(categories.length).padStart(2, "0")}</span>
          </S.Kicker>
          <S.HeadingRow>
            <S.Title data-editorial-reveal>
              Discover Your <em>Own Beauty.</em>
            </S.Title>
            <S.Intro data-editorial-reveal>
              아름다움은 하나의 기준이 아닌, 각자의 이야기에서 시작됩니다.
              <br />
              아래로 스크롤하며 진료 분야를 만나보세요.
            </S.Intro>
          </S.HeadingRow>
        </S.Heading>

        {/*
          PC: overflow hidden인 화면에서 GSAP이 Track을 왼쪽으로 이동시킨다.
          모바일: overflow-x auto를 사용하므로 손가락으로 옆으로 넘긴다.
        */}
        <S.Viewport
          ref={viewportRef}
          onScroll={handleNativeScroll}
          tabIndex={0}
          role="region"
          aria-label="진료 분야 이미지 갤러리"
        >
          <S.Track ref={trackRef}>
            {categories.map((category, index) => (
              <S.Card key={category.id} $index={index}>
                {/*
                  카드 전체를 링크로 만들어 진료 상세 페이지로 이동한다.
                  href는 기존 관리자 API의 LINK 값을 사용한다.
                */}
                <S.CardLink
                  data-editorial-spotlight
                  as={Link}
                  href={category.link}
                  aria-label={`${category.name} 자세히 보기`}
                >
                  <S.CardImage>
                    <Image
                      src={category.img}
                      alt={`${category.name} 진료 이미지`}
                      fill
                      sizes="(max-width: 768px) 84vw, (max-width: 1200px) 64vw, 800px"
                      style={{ objectFit: "cover" }}
                      // 첫 번째 이미지는 사용자가 가장 먼저 보므로 빠르게 로드한다.
                      priority={index === 0}
                    />
                    <S.ImageShade />
                  </S.CardImage>

                  <S.CardTop>
                    <S.CardEyebrow>AHN'S EXPERTISE</S.CardEyebrow>
                    <S.CardArrow aria-hidden="true">↗</S.CardArrow>
                  </S.CardTop>

                  <S.CardBottom>
                    <S.CardNumber>
                      {String(index + 1).padStart(2, "0")}
                      <span>
                        {" "}
                        / {String(categories.length).padStart(2, "0")}
                      </span>
                    </S.CardNumber>
                    <S.CardTitle>{category.name}</S.CardTitle>
                    <S.CardDiscover>
                      DISCOVER THE TREATMENT <span aria-hidden="true">→</span>
                    </S.CardDiscover>
                  </S.CardBottom>
                </S.CardLink>
              </S.Card>
            ))}
          </S.Track>
        </S.Viewport>

        <S.ProgressInfo>
          <S.ScrollGuide>
            <span className="desktop">SCROLL TO EXPLORE</span>
            <span className="mobile">SWIPE TO EXPLORE</span>
            <span aria-hidden="true">→</span>
          </S.ScrollGuide>
          <S.ProgressBar aria-hidden="true">
            <S.ProgressBarFill ref={progressRef} />
          </S.ProgressBar>
          <S.PageNumber>
            {String(selectedIndex + 1).padStart(2, "0")}
            <span> / {String(categories.length).padStart(2, "0")}</span>
          </S.PageNumber>
        </S.ProgressInfo>
      </S.Section>
    </>
  );
}
