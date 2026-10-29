"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactNode, useEffect, useRef } from "react";

import * as S from "@/components/home/VlogSafetyFlow.styles";

// GSAP 기본 기능에는 스크롤 진행률 추적이 포함되지 않으므로 플러그인을 등록한다.
gsap.registerPlugin(ScrollTrigger);

interface VlogSafetyFlowProps {
  // 기존 DB 연동 컴포넌트를 그대로 전달한다. 내부 API 코드는 수정하지 않는다.
  vlog: ReactNode;
  safety: ReactNode;
}

/**
 * [왜 이 컴포넌트를 만들었을까?]
 *
 * Vlog의 배경과 Safety의 배경을 각 section에서 따로 그리면,
 * 그라데이션 마지막 색을 맞추어도 브라우저 픽셀 합성 과정에서
 * 경계가 얇은 선처럼 보일 수 있다.
 *
 * 그래서 3개의 장면을 하나의 Flow로 감싼다.
 *    Vlog → Ahn's 브랜드 전환 → Safety
 *
 * 부모인 Flow에 그라데이션 하나만 주고 자식 배경을 투명하게 하면
 * 이어지는 색이 한 장의 이미지처럼 렌더링되므로 중간 이음매가 없다.
 *
 * [스크롤 방식]
 * 이번 전환 장면에는 pin을 쓰지 않는다.
 * Hero/CategoryNav/이벤트에 이미 pin이 있으므로 추가 pin 없이
 * scrub만으로 문자와 원형 장식이 움직이도록 한다.
 */
export default function VlogSafetyFlow({ vlog, safety }: VlogSafetyFlowProps) {
  // 전체 배경을 가진 부모 DOM이다. CSS 변수를 이 요소에 설정한다.
  const flowRef = useRef<HTMLDivElement>(null);
  // Vlog 높이는 API 데이터·반응형 화면에 따라 변할 수 있다.
  const vlogRef = useRef<HTMLDivElement>(null);
  // 브랜드 전환 영역 높이도 모바일과 PC에서 달라진다.
  const bridgeRef = useRef<HTMLElement>(null);

  /* ------------------------------------------------------------------
   * 실행 순서 1: Vlog와 브랜드 전환 장면의 실제 높이 측정
   * ------------------------------------------------------------------
   * CSS 그라데이션은 Vlog가 끝난 지점에서 색 변화를 이어가야 한다.
   * 따라서 실제 요소 높이를 읽어 --vlog-height, --bridge-height에 기록한다.
   *
   * ResizeObserver:
   *   - API 응답 후 이미지 목록 높이가 달라진 경우
   *   - 모바일 ↔ PC처럼 화면 폭이 변경된 경우
   * 위 두 상황에서도 자동으로 실제 높이를 다시 읽는다.
   *
   * requestAnimationFrame:
   * 연속으로 들어온 크기 변경을 한 프레임에 합쳐 불필요한 작업을 줄인다.
   */
  useEffect(() => {
    const flow = flowRef.current;
    const vlogBlock = vlogRef.current;
    const bridge = bridgeRef.current;
    if (!flow || !vlogBlock || !bridge) return;

    let frame = 0;

    const measure = () => {
      // 대기 중인 이전 측정이 있다면 취소하고 최신 DOM 크기만 확인한다.
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const vlogHeight = vlogBlock.getBoundingClientRect().height;
        const bridgeHeight = bridge.getBoundingClientRect().height;

        // 값이 px 단위여야 CSS calc()에서 덧셈이 가능하다.
        flow.style.setProperty("--vlog-height", `${vlogHeight}px`);
        flow.style.setProperty("--bridge-height", `${bridgeHeight}px`);

        // 배경의 색상 단계들을 Bridge 실제 높이의 비율로 배치한다.
        // 고정 px값을 사용하면 모바일에서 색상이 끝부분에 몰리기 때문에
        // Vlog/Bridge 크기가 변경될 때마다 함께 다시 계산한다.
        const positions = [
          ["--tone-16", 0.16],
          ["--tone-34", 0.34],
          ["--tone-52", 0.52],
          ["--tone-70", 0.7],
          ["--tone-86", 0.86],
          ["--tone-end", 1],
        ] as const;

        for (const [property, progress] of positions) {
          flow.style.setProperty(
            property,
            `${vlogHeight + bridgeHeight * progress}px`,
          );
        }
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(vlogBlock);
    observer.observe(bridge);
    measure();

    // 컴포넌트가 사라지면 관찰과 예약된 프레임을 반드시 정리한다.
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  /* ------------------------------------------------------------------
   * 실행 순서 2: 가운데 브랜드 장면만 GSAP ScrollTrigger에 연결
   * ------------------------------------------------------------------
   * start: 장면 윗부분이 화면 아래쪽에 들어올 때
   * end: 장면 아랫부분이 화면 위쪽으로 지나갈 때
   * scrub: 스크롤 진행률에 따라 부드럽게 글자 등장/퇴장
   *
   * pin을 사용하지 않으므로 문서 스크롤 거리 자체는 바뀌지 않는다.
   */
  useEffect(() => {
    const bridge = bridgeRef.current;
    if (!bridge) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: bridge,
            start: "top 82%",
            end: "bottom 18%",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });

        // 처음: 아래에서 살짝 올라오면서 나타남
        // 중간: 화면 중앙에서 문구가 잠시 유지됨
        // 마지막: 위쪽으로 사라지며 Safety 섹션에 시선을 넘겨줌
        timeline
          .fromTo(
            "[data-brand-content]",
            { opacity: 0, y: 30, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.3 },
          )
          .to("[data-brand-content]", { opacity: 1, duration: 0.45 })
          .to("[data-brand-content]", { opacity: 0, y: -26, duration: 0.25 });

        // 제목 획 사이가 조여지는 에디토리얼 타이포 전환.
        gsap.fromTo(
          "[data-brand-title]",
          { letterSpacing: "0.05em", filter: "blur(5px)" },
          {
            letterSpacing: "-0.085em",
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: bridge,
              start: "top 76%",
              end: "top 26%",
              scrub: 1.2,
            },
          },
        );
        gsap.fromTo(
          "[data-brand-halo]",
          { rotate: -28, opacity: 0.03, scale: 0.76 },
          {
            rotate: 26,
            opacity: 0.45,
            scale: 1.13,
            ease: "none",
            scrollTrigger: {
              trigger: bridge,
              start: "top 90%",
              end: "bottom 20%",
              scrub: 1.5,
            },
          },
        );
        gsap.fromTo(
          "[data-brand-track]",
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: bridge,
              start: "top 65%",
              end: "bottom 35%",
              scrub: 0.9,
            },
          },
        );

        // 큰 원은 글자보다 더 천천히 확대되어 공간의 깊이감을 준다.
        gsap.fromTo(
          "[data-brand-orbit]",
          { scale: 0.86, opacity: 0.1 },
          {
            scale: 1.16,
            opacity: 0.28,
            ease: "none",
            scrollTrigger: {
              trigger: bridge,
              start: "top 85%",
              end: "bottom 15%",
              scrub: 1.1,
            },
          },
        );
      }, bridge);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <S.Flow ref={flowRef}>
      {/* 기존 Vlog를 재사용하므로 DB 이미지/영상 선택/모달 기능을 유지한다. */}
      <S.VlogBlock ref={vlogRef}>{vlog}</S.VlogBlock>

      {/*
        브랜드 전환 장면은 이미지 다운로드가 필요하지 않은 순수 타이포 연출이다.
        배경도 자기 자신이 아니라 Flow가 한 장으로 그린다.
      */}
      <S.Bridge ref={bridgeRef} aria-labelledby="ahns-bridge-title">
        <S.Orbit data-brand-orbit aria-hidden="true" />
        <S.OrbitHalo data-brand-halo aria-hidden="true" />
        <S.BridgeTrack aria-hidden="true">
          <span data-brand-track />
        </S.BridgeTrack>
        <S.BrandContent data-brand-content>
          <S.Eyebrow data-brand-eyebrow>THE AHN'S PHILOSOPHY</S.Eyebrow>
          <S.BrandTitle id="ahns-bridge-title" data-brand-title>
            Ahn's
          </S.BrandTitle>
          <S.Tagline data-brand-tagline>BEAUTY IN EVERY MOMENT.</S.Tagline>
          <S.KoreanText>
            아름다움에 대한 이야기에서
            <br />
            안전을 생각하는 마음까지.
          </S.KoreanText>
        </S.BrandContent>
        <S.EdgeNote aria-hidden="true">FROM BEAUTY TO CARE · AHN'S</S.EdgeNote>
      </S.Bridge>

      {/* Safety 자체의 기존 CSS sticky와 관리자 API는 그대로 동작한다. */}
      {safety}
    </S.Flow>
  );
}
