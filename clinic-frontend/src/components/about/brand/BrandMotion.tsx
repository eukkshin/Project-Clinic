"use client";

import { useEffect } from 'react';

/**
 * 기존 Lenis/GSAP 설정을 변경하지 않는 독립적인 브랜드 페이지 인터랙션.
 * - IntersectionObserver: 아래로 진입하는 섹션의 가벼운 reveal
 * - Passive scroll + rAF: 사진에 최대 약 18px의 미세 패럴랙스
 * - prefers-reduced-motion: 모든 모션 비활성화
 */
export default function BrandMotion() {
  useEffect(() => {
    const root = document.getElementById("brand-top");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    const reveals = [
      ...root.querySelectorAll<HTMLElement>("[data-brand-reveal]"),
    ];
    const images = [
      ...root.querySelectorAll<HTMLElement>("[data-brand-parallax]"),
    ];

    // 현재 화면에 이미 보이는 요소를 먼저 노출해 초기 화면의 깜빡임을 방지합니다.
    for (const element of reveals) {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.9) {
        element.setAttribute("data-brand-visible", "true");
      }
    }
    root.setAttribute("data-brand-motion", "on");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-brand-visible", "true");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -5% 0px" },
    );
    for (const element of reveals) {
      if (!element.hasAttribute("data-brand-visible"))
        observer.observe(element);
    }

    let frame = 0;
    const renderParallax = () => {
      frame = 0;
      if (window.innerWidth <= 768) return;
      for (const element of images) {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const travel = Math.max(1, window.innerHeight + rect.height);
        const position = Math.min(
          1,
          Math.max(0, (window.innerHeight - rect.top) / travel),
        );
        const offset = (0.5 - position) * 36;
        element.style.setProperty(
          "--brand-parallax-y",
          `${offset.toFixed(2)}px`,
        );
      }
    };
    const scheduleParallax = () => {
      if (!frame) frame = window.requestAnimationFrame(renderParallax);
    };
    scheduleParallax();
    window.addEventListener("scroll", scheduleParallax, { passive: true });
    window.addEventListener("resize", scheduleParallax, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleParallax);
      window.removeEventListener("resize", scheduleParallax);
      if (frame) window.cancelAnimationFrame(frame);
      root.removeAttribute("data-brand-motion");
      reveals.forEach((element) =>
        element.removeAttribute("data-brand-visible"),
      );
      images.forEach((element) =>
        element.style.removeProperty("--brand-parallax-y"),
      );
    };
  }, []);

  return null;
}
