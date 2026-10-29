"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import * as S from '@/assets/css/components/about/AboutPages.styles';
import { isAboutLinkActive, useAboutNavigation } from '@/lib/navigation/aboutNavigation';

// Hooks only run inside React components. The observer never prevents static rendering.
function AboutMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-ahns-about]");
    if (
      !root ||
      !window.matchMedia("(prefers-reduced-motion: no-preference)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-about-reveal]"),
    );
    if (!targets.length) return;
    const rect = (node: HTMLElement) => node.getBoundingClientRect();
    // Keep content already in view visible before enabling motion.
    for (const target of targets) {
      if (rect(target).top <= window.innerHeight * 0.95)
        target.dataset.aboutVisible = "true";
    }
    root.dataset.aboutMotion = "on";
    const observer = new IntersectionObserver(
      (entries) => {
        for (const item of entries) {
          if (item.isIntersecting) {
            (item.target as HTMLElement).dataset.aboutVisible = "true";
            observer.unobserve(item.target);
          }
        }
      },
      { threshold: 0.11, rootMargin: "0px 0px -35px 0px" },
    );
    for (const target of targets)
      if (target.dataset.aboutVisible !== "true") observer.observe(target);
    return () => {
      observer.disconnect();
      delete root.dataset.aboutMotion;
    };
  }, []);
  return null;
}

export function AboutNav() {
  const pathname = usePathname();
  const links = useAboutNavigation();
  return (
    <S.AboutNavWrap aria-label="병원소개 내비게이션">
      <S.AboutNavCaption>
        ABOUT <span>/</span>
      </S.AboutNavCaption>
      <S.AboutNavLinks>
        {links.map((link) => {
          const active = isAboutLinkActive(pathname, link.url);
          return (
            <S.AboutNavLink
              as={Link}
              key={link.url}
              href={link.url}
              $active={active}
              aria-current={active ? "page" : undefined}
            >
              {link.name}
            </S.AboutNavLink>
          );
        })}
      </S.AboutNavLinks>
    </S.AboutNavWrap>
  );
}

export function AboutFrame({ children }: { children: ReactNode }) {
  return (
    <S.Canvas data-ahns-about>
      <AboutMotion />
      <AboutNav />
      {children}
    </S.Canvas>
  );
}

export function AboutBottom({
  title = "당신의 이야기를 듣겠습니다.",
}: {
  title?: string;
}) {
  return (
    <S.BottomCall>
      <S.Container data-about-reveal>
        <S.Eyebrow>AHN&apos;S · YOUR NEXT CHAPTER</S.Eyebrow>
        <h2>{title}</h2>
        <p>궁금한 점이 있다면 편안하게 문의해 주세요.</p>
        <S.EditorialLink as={Link} href="/#site-footer-contact">
          상담 및 문의 <span aria-hidden="true">↗</span>
        </S.EditorialLink>
      </S.Container>
    </S.BottomCall>
  );
}
