"use client";

import { useEffect } from 'react';

/**
 * 페이지 전용 경량 인터랙션: reveal + 미세 패럴랙스.
 * 기존 전역 Lenis/GSAP에 연결하지 않으므로 다른 페이지에 영향이 없습니다.
 */
export default function BrandEditorialMotion() {
  useEffect(() => {
    const page = document.getElementById("ahns-brand-editorial");
    if (!page) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const reveals = [
      ...page.querySelectorAll<HTMLElement>("[data-brand-editorial-reveal]"),
    ];
    const media = [
      ...page.querySelectorAll<HTMLElement>("[data-brand-editorial-parallax]"),
    ];

    // 첫 화면에서 이미 보이는 콘텐츠는 숨기지 않아 깜빡임을 막습니다.
    for (const element of reveals) {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.94) {
        element.dataset.brandEditorialVisible = "true";
      }
    }
    page.dataset.brandEditorialMotion = "on";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.brandEditorialVisible = "true";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.05 },
    );

    reveals
      .filter((el) => !el.dataset.brandEditorialVisible)
      .forEach((el) => observer.observe(el));

    let frame = 0;
    const parallax = () => {
      frame = 0;
      if (window.innerWidth < 820) return;
      const height = window.innerHeight;
      for (const element of media) {
        const bounds = element.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > height) continue;
        const progress = Math.min(
          1,
          Math.max(0, (height - bounds.top) / (height + bounds.height)),
        );
        element.style.setProperty(
          "--be-parallax",
          `${((0.5 - progress) * 22).toFixed(1)}px`,
        );
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(parallax);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      delete page.dataset.brandEditorialMotion;
      for (const el of media) el.style.removeProperty("--be-parallax");
    };
  }, []);
  return null;
}
