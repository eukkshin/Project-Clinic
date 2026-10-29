"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiBookOpen,
  FiFileText,
  FiHelpCircle,
  FiImage,
  FiLayers,
  FiList,
  FiMessageCircle,
  FiStar,
  FiX,
} from "react-icons/fi";

import * as S from "@/components/procedures/DetailSideNav.styles";

import type { DetailSectionType } from "@/types/detail";

export interface DetailNavSection {
  id: string;
  title: string;
  type?: DetailSectionType;
}

interface DetailSideNavProps {
  sections: DetailNavSection[];
  scrollOffset?: number;
  /** 기존 DetailLayout 호환용. 아이콘 전용 내비에서는 표시하지 않습니다. */
  eyebrow?: string;
}

const iconBySectionType = {
  INTRO: FiBookOpen,
  TEXT: FiFileText,
  FEATURES: FiStar,
  PROCESS: FiLayers,
  GALLERY: FiImage,
  FAQ: FiHelpCircle,
  CTA: FiMessageCircle,
} as const;

/**
 * SideNav는 DetailLayout의 overflow:clip / isolation:isolate 밖으로 빼야
 * Footer, 레이어, 스크롤 구간에서 잘리거나 아래로 숨지 않습니다.
 * Footer 영역에 진입하면 겹치기 전에 자연스럽게 사라집니다.
 */
export default function DetailSideNav({
  sections,
  scrollOffset = 86,
}: DetailSideNavProps) {
  const [mountTarget, setMountTarget] = useState<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const scrollTargetRef = useRef<string | null>(null);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idsKey = sections.map(({ id }) => id).join("\u001f");

  // Portal은 client 마운트 이후에만 생성하여 SSR hydration 불일치를 방지합니다.
  useEffect(() => {
    setMountTarget(document.body);
    return () => {
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setActiveId((previous) =>
      sections.some(({ id }) => id === previous)
        ? previous
        : (sections[0]?.id ?? ""),
    );
    // 동일한 ID 목록일 때 상위 렌더에 따른 effect 재실행 방지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  useEffect(() => {
    if (!sections.length) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // Footer.tsx 실제 마운트 위치: <FooterWrapper id="site-footer-contact">
      const footer = document.getElementById("site-footer-contact");
      const lastSection = document.getElementById(
        sections[sections.length - 1].id,
      );
      // Footer가 아직 준비되지 않은 경우 마지막 섹션 끝을 경계로 사용합니다.
      const footerTop =
        footer?.getBoundingClientRect().top ??
        lastSection?.getBoundingClientRect().bottom ??
        Number.POSITIVE_INFINITY;
      const navBottom =
        navRef.current?.getBoundingClientRect().bottom ??
        window.innerHeight * 0.5 + 150;
      // SideNav와 Footer가 겹치기 24px 전에 fade-out.
      const shouldHide = footerTop <= navBottom - 148;
      setAtFooter((previous) =>
        previous === shouldHide ? previous : shouldHide,
      );

      if (scrollTargetRef.current) return;
      const position = Math.max(scrollOffset + 16, window.innerHeight * 0.4);
      let nextId = sections[0]?.id ?? "";
      for (const section of sections) {
        const target = document.getElementById(section.id);
        if (!target) continue;
        if (target.getBoundingClientRect().top <= position) nextId = section.id;
        else break;
      }
      setActiveId((previous) => (previous === nextId ? previous : nextId));
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
    // 동일 섹션 ID면 effect를 재설치하지 않습니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, scrollOffset, mountTarget]);

  useEffect(() => {
    if (atFooter) setMobileOpen(false);
  }, [atFooter]);

  const goToSection = useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;

      setActiveId(id);
      setMobileOpen(false);
      scrollTargetRef.current = id;

      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = setTimeout(() => {
        scrollTargetRef.current = null;
        unlockTimerRef.current = null;
      }, 950);

      const top =
        target.getBoundingClientRect().top + window.scrollY - scrollOffset;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [scrollOffset],
  );

  if (!sections.length || !mountTarget) return null;

  return createPortal(
    <>
      <S.MobileToggle
        type="button"
        $hidden={atFooter}
        aria-controls="ahns-detail-side-navigation"
        aria-expanded={mobileOpen && !atFooter}
        aria-label={
          mobileOpen ? "상세페이지 목차 닫기" : "상세페이지 목차 열기"
        }
        onClick={() => setMobileOpen((previous) => !previous)}
      >
        {mobileOpen ? <FiX size={19} /> : <FiList size={19} />}
      </S.MobileToggle>

      <S.SideNav
        ref={navRef}
        id="ahns-detail-side-navigation"
        aria-label="상세페이지 목차"
        aria-hidden={atFooter ? true : undefined}
        $hidden={atFooter}
        $mobileOpen={mobileOpen}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setMobileOpen(false);
            (
              event.currentTarget.querySelector(":focus") as HTMLElement | null
            )?.blur();
          }
        }}
      >
        <S.NavList>
          {sections.map((section) => {
            const Icon = section.type
              ? iconBySectionType[section.type]
              : FiFileText;
            const isActive = activeId === section.id;
            return (
              <S.NavButton
                key={section.id}
                type="button"
                $active={isActive}
                tabIndex={atFooter ? -1 : 0}
                aria-label={`${section.title} 섹션으로 이동`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => goToSection(section.id)}
              >
                <S.NavIcon aria-hidden="true">
                  <Icon size={19} strokeWidth={1.7} />
                </S.NavIcon>
                <S.NavText aria-hidden="true">{section.title}</S.NavText>
              </S.NavButton>
            );
          })}
        </S.NavList>
      </S.SideNav>
    </>,
    mountTarget,
  );
}
