"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

import * as S from "@/components/about/pages/AboutPages.styles";
import { stripLocalePrefix } from "@/i18n/url";
import {
  isAboutLinkActive,
  useAboutNavigation,
} from "@/lib/navigation/aboutNavigation";

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
  const pathname = stripLocalePrefix(usePathname());
  const links = useAboutNavigation();
  const t = useTranslations("About");
  const labels: Record<string, string> = {
    "/about/brand": t("shared.navBrand"),
    "/about/philosophy": t("shared.navPhilosophy"),
    "/about/doctors": t("shared.navDoctors"),
    "/about/facilities": t("shared.navFacilities"),
    "/about/safety": t("shared.navSafety"),
    "/about/location": t("shared.navLocation"),
  };
  return (
    <S.AboutNavWrap aria-label={t("shared.navLabel")}>
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
              {labels[link.url] ?? link.name}
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

export function AboutBottom({ title }: { title?: string }) {
  const t = useTranslations("About");
  return (
    <S.BottomCall>
      <S.Container data-about-reveal>
        <S.Eyebrow>AHN&apos;S · YOUR NEXT CHAPTER</S.Eyebrow>
        <h2>{title ?? t("shared.bottomDefault")}</h2>
        <p>{t("shared.bottomDesc")}</p>
        <S.EditorialLink as={Link} href="/#site-footer-contact">
          {t("shared.bottomLink")} <span aria-hidden="true">↗</span>
        </S.EditorialLink>
      </S.Container>
    </S.BottomCall>
  );
}
