"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import * as S from "@/components/about/pages/AboutPages.styles";
import {
  AboutBottom,
  AboutFrame,
} from "@/components/about/shared/AboutFoundation";
import HangulTyping from "@/components/ui/TypingText";

const beliefs = [
  {
    num: "01 /",
    titleKey: "belief1Title",
    bodyKey: "belief1Body",
  },
  {
    num: "02 /",
    titleKey: "belief2Title",
    bodyKey: "belief2Body",
  },
  {
    num: "03 /",
    titleKey: "belief3Title",
    bodyKey: "belief3Body",
  },
];

export default function PhilosophyPage() {
  const t = useTranslations("About");
  return (
    <AboutFrame>
      <S.PhilosophyHero>
        <S.Container>
          <S.Eyebrow data-about-reveal>01 / OUR PHILOSOPHY</S.Eyebrow>
          <S.PhilosophyHeroGrid>
            <div data-about-reveal style={{ paddingTop: 55 }}>
              <S.Title>
                {t("philosophy.hero1")}
                <br />
                {t("philosophy.hero2")}
                <br />
                <em>
                  <HangulTyping text={t("philosophy.hero3")} speed={90} />
                </em>
              </S.Title>
              <S.Body
                style={{ marginTop: 40, maxWidth: 425, color: S.C.muted }}
              >
                {t("philosophy.heroDesc")}
              </S.Body>
            </div>
            <S.PhilosophyImage data-about-reveal>
              <Image
                src="/images/about/philosophy-hero.webp"
                alt={t("philosophy.heroAlt")}
                fill
                priority
                sizes="(max-width: 800px) 90vw, 43vw"
              />
            </S.PhilosophyImage>
          </S.PhilosophyHeroGrid>
        </S.Container>
      </S.PhilosophyHero>
      <S.PhilosophyRail>
        <S.Container>
          <S.Eyebrow data-about-reveal>{t("philosophy.railHeading")}</S.Eyebrow>
          <div style={{ height: 75 }} />
          {beliefs.map((item) => (
            <S.PhilosophyRow data-about-reveal key={item.num}>
              <span>{item.num}</span>
              <h3>{t(`philosophy.${item.titleKey}`)}</h3>
              <S.Body style={{ color: S.C.muted, maxWidth: 400 }}>
                {t(`philosophy.${item.bodyKey}`)}
              </S.Body>
            </S.PhilosophyRow>
          ))}
        </S.Container>
      </S.PhilosophyRail>
      <S.PhilosophyQuote>
        <S.Container data-about-reveal>
          <S.Eyebrow>THE ART OF LISTENING</S.Eyebrow>
          <blockquote>
            {t("philosophy.quote1")}
            <br />
            {t("philosophy.quote2")}
          </blockquote>
          <p>AN APPROACH BUILT AROUND YOU</p>
          <div style={{ marginTop: 55 }}>
            <S.EditorialLink as={Link} href="/about/doctors">
              {t("philosophy.doctorsLink")} <span aria-hidden="true">↗</span>
            </S.EditorialLink>
          </div>
        </S.Container>
      </S.PhilosophyQuote>
      <AboutBottom />
    </AboutFrame>
  );
}
