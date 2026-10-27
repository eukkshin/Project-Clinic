"use client";

import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { FiList, FiX } from "react-icons/fi";

import * as S from "@/assets/css/components/detail/DetailSideNav.styles";

/** 각 section의 id와 동일한 id를 가진 실제 DOM 요소가 페이지에 있어야 합니다. */
export interface DetailNavSection {
  id: string;
  title: string;
}

interface DetailSideNavProps {
  sections: DetailNavSection[];
  /** 고정 Header에 가려지지 않도록 섹션 시작 위치에서 뺄 값(px) */
  scrollOffset?: number;
  /** 사이드바 최상단 작은 라벨 */
  eyebrow?: string;
}

export default function DetailSideNav({
  sections,
  scrollOffset = 100,
  eyebrow = "EXPLORE AHN'S",
}: DetailSideNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const previousActiveRef = useRef<string | null>(null);
  const activeIdRef = useRef(activeId);
  const scrollingToRef = useRef<string | null>(null);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 배열 인스턴스가 렌더마다 새로 생성되더라도 id 변경 시에만 Observer 재설정
  const idsKey = sections.map((section) => section.id).join("\u001f");
  activeIdRef.current = activeId;

  const moveIndicator = useCallback((id: string, animate: boolean) => {
    const indicator = indicatorRef.current;
    const ripple = rippleRef.current;
    const target = buttonRefs.current.get(id);
    if (!indicator || !target) return;

    const nextY = target.offsetTop;
    const nextHeight = target.offsetHeight;
    const currentY = Number(gsap.getProperty(indicator, "y")) || 0;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.killTweensOf(indicator);
    if (ripple) gsap.killTweensOf(ripple);

    if (!animate || reducedMotion) {
      gsap.set(indicator, {
        y: nextY,
        height: nextHeight,
        scaleX: 1,
        scaleY: 1,
        transformOrigin: "50% 50%",
      });
      if (ripple) gsap.set(ripple, { opacity: 0, scale: 1 });
      setReady(true);
      return;
    }

    const movingDown = nextY > currentY;
    const distance = Math.abs(nextY - currentY);
    const travelDuration = Math.min(
      0.78,
      Math.max(0.53, 0.47 + distance / 650),
    );

    gsap.set(indicator, {
      transformOrigin: movingDown ? "50% 18%" : "50% 82%",
    });

    const timeline = gsap.timeline();

    // 1. 이전 선택 배경이 다음 항목으로 흘러감
    timeline.to(
      indicator,
      {
        y: nextY,
        height: nextHeight,
        duration: travelDuration,
        ease: "power3.inOut",
      },
      0,
    );

    // 2. 이동 방향으로 물방울처럼 늘어남
    timeline.to(
      indicator,
      { scaleY: 1.28, scaleX: 0.94, duration: 0.22, ease: "power2.out" },
      0.04,
    );

    // 3. 도착할 때 살짝 눌려서 좌우로 퍼짐
    timeline.to(
      indicator,
      { scaleY: 0.88, scaleX: 1.055, duration: 0.17, ease: "power2.inOut" },
      travelDuration - 0.1,
    );

    // 4. 작은 탄성으로 원래 형태에 복귀
    timeline.to(
      indicator,
      { scaleY: 1, scaleX: 1, duration: 0.36, ease: "elastic.out(1, 0.65)" },
      travelDuration + 0.02,
    );

    // 5. 충돌 지점에 물결처럼 번지는 하이라이트
    if (ripple) {
      timeline.fromTo(
        ripple,
        { opacity: 0.48, scale: 0.88 },
        { opacity: 0, scale: 1.5, duration: 0.49, ease: "power2.out" },
        travelDuration - 0.02,
      );
    }
  }, []);

  // 선택된 항목 변경 시 단 하나의 indicator를 이동
  useLayoutEffect(() => {
    if (!activeId) return;
    const shouldAnimate =
      previousActiveRef.current !== null &&
      previousActiveRef.current !== activeId;
    moveIndicator(activeId, shouldAnimate);
    previousActiveRef.current = activeId;
  }, [activeId, moveIndicator, idsKey]);

  // 페이지 데이터 자체가 달라졌을 때 첫 번째 섹션으로 초기화
  useEffect(() => {
    if (sections.length === 0) return;
    const firstId = sections[0].id;
    if (!sections.some((section) => section.id === activeIdRef.current)) {
      previousActiveRef.current = null;
      setActiveId(firstId);
    }
  }, [idsKey, sections]);

  // 글꼴 로딩/화면 크기 변화로 버튼 위치가 달라졌을 때 위치만 재정렬
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const align = () => moveIndicator(activeIdRef.current, false);
    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(align);
      resizeObserver.observe(list);
      buttonRefs.current.forEach((button) => resizeObserver?.observe(button));
    }

    window.addEventListener("resize", align);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", align);
    };
  }, [idsKey, moveIndicator]);

  // 스크롤 위치에 맞춰 활성 메뉴 자동 변경 (IntersectionObserver)
  useEffect(() => {
    const targets = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (targets.length === 0) return;

    let observer: IntersectionObserver | null = null;

    const syncActive = () => {
      const anchorY = window.innerHeight * 0.44;

      // smooth scroll 중간 섹션을 지나갈 때 선택 배경이 튀는 현상을 방지
      const lockedId = scrollingToRef.current;
      if (lockedId) {
        const lockedElement = document.getElementById(lockedId);
        if (
          lockedElement &&
          lockedElement.getBoundingClientRect().top <= anchorY &&
          lockedElement.getBoundingClientRect().bottom > anchorY
        ) {
          scrollingToRef.current = null;
          if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
          unlockTimerRef.current = null;
        } else {
          return;
        }
      }

      const visibleAtAnchor = targets.find((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top <= anchorY && rect.bottom > anchorY;
      });

      if (visibleAtAnchor) {
        setActiveId((previous) =>
          previous === visibleAtAnchor.id ? previous : visibleAtAnchor.id,
        );
      }
    };

    // %, 특히 세로 rootMargin의 해석 혼동을 피하기 위해 px로 좁은 감지선 생성
    const observe = () => {
      observer?.disconnect();
      const top = Math.round(window.innerHeight * 0.44);
      const bottom = Math.max(0, window.innerHeight - top - 2);
      observer = new IntersectionObserver(syncActive, {
        rootMargin: `-${top}px 0px -${bottom}px 0px`,
        threshold: 0,
      });
      targets.forEach((target) => observer?.observe(target));
      syncActive();
    };

    observe();
    window.addEventListener("resize", observe);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", observe);
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
      scrollingToRef.current = null;
    };
    // id 목록이 바뀌었을 때만 observer를 새로 구성
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
      if (indicatorRef.current) gsap.killTweensOf(indicatorRef.current);
      if (rippleRef.current) gsap.killTweensOf(rippleRef.current);
    };
  }, []);

  const goToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`[DetailSideNav] id="${id}" 섹션을 찾지 못했습니다.`);
      return;
    }

    setActiveId(id);
    setMobileOpen(false);
    scrollingToRef.current = id;

    if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = setTimeout(() => {
      scrollingToRef.current = null;
      unlockTimerRef.current = null;
    }, 1700);

    const top =
      element.getBoundingClientRect().top + window.scrollY - scrollOffset;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  if (sections.length === 0) return null;

  return (
    <>
      {/* 작은 화면에서는 접혀 있다가 탭하면 펼침 */}
      <S.MobileToggle
        type="button"
        aria-expanded={mobileOpen}
        aria-controls="ahns-detail-side-navigation"
        aria-label={
          mobileOpen ? "상세페이지 메뉴 닫기" : "상세페이지 메뉴 열기"
        }
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        {mobileOpen ? <FiX size={20} /> : <FiList size={20} />}
      </S.MobileToggle>

      <S.SideNav
        id="ahns-detail-side-navigation"
        aria-label="상세페이지 섹션 이동"
        $mobileOpen={mobileOpen}
      >
        <S.NavEyebrow>{eyebrow}</S.NavEyebrow>
        <S.NavList ref={listRef}>
          <S.LiquidIndicator
            ref={indicatorRef}
            $ready={ready}
            aria-hidden="true"
          >
            <S.LiquidRipple ref={rippleRef} />
          </S.LiquidIndicator>

          {sections.map((section, index) => (
            <S.NavButton
              key={section.id}
              ref={(node) => {
                if (node) buttonRefs.current.set(section.id, node);
                else buttonRefs.current.delete(section.id);
              }}
              type="button"
              $active={activeId === section.id}
              aria-current={activeId === section.id ? "location" : undefined}
              onClick={() => goToSection(section.id)}
            >
              <S.NavNumber $active={activeId === section.id}>
                {String(index + 1).padStart(2, "0")}
              </S.NavNumber>
              <S.NavText>{section.title}</S.NavText>
            </S.NavButton>
          ))}
        </S.NavList>
        <S.NavBottomLine />
      </S.SideNav>
    </>
  );
}
