"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import * as S from "@/components/about/pages/AboutPages.styles";
import {
  AboutBottom,
  AboutFrame,
} from "@/components/about/shared/AboutFoundation";
import TypingText from "@/components/ui/TypingText";

export default function DoctorsPage() {
  const t = useTranslations("About");
  return (
    <AboutFrame>
      <S.DoctorsHero>
        <S.Container>
          <S.Eyebrow data-about-reveal>02 / OUR PEOPLE</S.Eyebrow>
          <div style={{ height: 38 }} />
          <S.DoctorsGrid>
            <div data-about-reveal>
              <S.Title>
                {t("doctors.hero1")}
                <br />
                {t("doctors.hero2")}
                <br />
                <em>
                  <TypingText text={t("doctors.hero3")} speed={90} />
                </em>
              </S.Title>
              <S.Body
                style={{ maxWidth: 450, marginTop: 43, color: S.C.muted }}
              >
                {t("doctors.heroDesc")}
              </S.Body>
              <S.EditorialLink
                as={Link}
                href="/about/philosophy"
                style={{ marginTop: 55 }}
              >
                {t("doctors.philosophyLink")} <span aria-hidden="true">↗</span>
              </S.EditorialLink>
            </div>
            <S.PortraitPlaceholder
              data-about-reveal
              role="img"
              aria-label={t("doctors.placeholderAlt")}
            >
              <S.Eyebrow>AHN&apos;S / PEOPLE</S.Eyebrow>
              <div style={{ alignSelf: "flex-start" }}>
                <div
                  style={{
                    fontFamily: "Georgia,serif",
                    fontSize: "clamp(68px,9vw,145px)",
                    fontStyle: "italic",
                    lineHeight: 1,
                  }}
                >
                  People.
                </div>
                <p
                  style={{
                    fontSize: 12,
                    letterSpacing: ".15em",
                    marginTop: 16,
                  }}
                >
                  MEDICAL TEAM PROFILE
                </p>
              </div>
            </S.PortraitPlaceholder>
          </S.DoctorsGrid>
        </S.Container>
      </S.DoctorsHero>
      <S.DarkPanel style={{ padding: "clamp(100px,11vw,180px) 0" }}>
        <S.Container data-about-reveal>
          <S.Eyebrow>MEET THE MEDICAL TEAM</S.Eyebrow>
          <S.SectionTitle style={{ maxWidth: 880, marginTop: 36 }}>
            {t("doctors.section1")}
            <br />
            {t("doctors.section2")}
          </S.SectionTitle>
          <S.Body style={{ opacity: 0.72, marginTop: 35, maxWidth: 610 }}>
            {t("doctors.sectionDesc")}
          </S.Body>
        </S.Container>
      </S.DarkPanel>
      <S.Container style={{ padding: "clamp(100px,10vw,175px) 0" }}>
        <S.Eyebrow data-about-reveal>PROFILE / INFORMATION</S.Eyebrow>
        <S.DoctorsSmallGrid>
          {[
            {
              n: "01",
              titleKey: "card1Title",
              descKey: "card1Desc",
            },
            {
              n: "02",
              titleKey: "card2Title",
              descKey: "card2Desc",
            },
            {
              n: "03",
              titleKey: "card3Title",
              descKey: "card3Desc",
            },
          ].map((item) => (
            <S.DoctorsInfoCell data-about-reveal key={item.n}>
              <S.Eyebrow>{item.n} — DETAILS</S.Eyebrow>
              <h3>{t(`doctors.${item.titleKey}`)}</h3>
              <p>{t(`doctors.${item.descKey}`)}</p>
            </S.DoctorsInfoCell>
          ))}
        </S.DoctorsSmallGrid>
      </S.Container>
      <AboutBottom title={t("doctors.bottomTitle")} />
    </AboutFrame>
  );
}
