"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import * as S from "@/components/about/pages/AboutPages.styles";
import {
  AboutBottom,
  AboutFrame,
} from "@/components/about/shared/AboutFoundation";
import HangulTyping from "@/components/ui/TypingText";

/** 시안용 연출 사진입니다. 실제 병원 공간을 촬영한 사진으로 교체하세요. */
const spaces = [
  {
    id: "01",
    name: "THE FIRST IMPRESSION",
    nameKey: "space1",
    src: "/images/about/facilities-light.webp",
  },
  {
    id: "02",
    name: "QUIET MOMENTS",
    nameKey: "space2",
    src: "/images/about/facilities-green.webp",
  },
  {
    id: "03",
    name: "A SENSE OF BALANCE",
    nameKey: "space3",
    src: "/images/about/facilities-detail.webp",
  },
] as const;

export default function FacilitiesPage() {
  const [active, setActive] = useState(0);
  const t = useTranslations("About");
  return (
    <AboutFrame>
      <S.FacilitiesHero>
        <S.Container>
          <S.Eyebrow data-about-reveal>03 / THE SPACE</S.Eyebrow>
          <S.FacilitiesCopy style={{ padding: "45px 0 95px" }}>
            <S.SectionTitle data-about-reveal>
              {t("facilities.hero1")}
              <br />
              {t("facilities.hero2")}
              <br />
              <em>
                <HangulTyping text={t("facilities.hero3")} speed={90} />
              </em>
            </S.SectionTitle>
            <S.Body
              data-about-reveal
              style={{ maxWidth: 440, color: S.C.muted }}
            >
              {t("facilities.heroDesc")}
            </S.Body>
          </S.FacilitiesCopy>
        </S.Container>
        <S.GalleryStage aria-label={t("facilities.galleryLabel")}>
          {spaces.map((space, index) => (
            <S.GalleryLayer
              key={space.id}
              $active={active === index}
              aria-hidden={active !== index}
            >
              <Image
                src={space.src}
                fill
                alt={
                  t(`facilities.${space.nameKey}`) +
                  t("facilities.imageAltSuffix")
                }
                sizes="100vw"
                priority={index === 0}
              />
            </S.GalleryLayer>
          ))}
          <S.GalleryOverlay />
          <S.GalleryCaption aria-live="polite">
            <S.Eyebrow>{spaces[active].name}</S.Eyebrow>
            <h3>{t(`facilities.${spaces[active].nameKey}`)}</h3>
          </S.GalleryCaption>
          <S.GallerySideIndex aria-hidden="true">
            0{active + 1} <span>/ 03</span>
          </S.GallerySideIndex>
        </S.GalleryStage>
        <S.Container>
          <S.GalleryTabBar
            role="group"
            aria-label={t("facilities.galleryTabs")}
          >
            {spaces.map((space, index) => (
              <S.GalleryTab
                type="button"
                key={space.id}
                $active={active === index}
                onClick={() => setActive(index)}
                aria-pressed={active === index}
              >
                <span>{space.id}</span> {t(`facilities.${space.nameKey}`)}
                <span aria-hidden="true">↗</span>
              </S.GalleryTab>
            ))}
          </S.GalleryTabBar>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: 18,
            }}
          >
            <S.FigureCredit>{t("facilities.conceptNotice")}</S.FigureCredit>
          </div>
        </S.Container>
      </S.FacilitiesHero>
      <S.Container>
        <S.FacilitiesCopy data-about-reveal>
          <div>
            <S.Eyebrow>AN EXPERIENCE OF CALM</S.Eyebrow>
            <S.SectionTitle style={{ marginTop: 38 }}>
              {t("facilities.body1")}
              <br />
              {t("facilities.body2")}
            </S.SectionTitle>
          </div>
          <div>
            <S.Body style={{ color: S.C.muted, maxWidth: 530 }}>
              {t("facilities.bodyDesc")}
            </S.Body>
            <S.EditorialLink
              as={Link}
              href="/about/location"
              style={{ marginTop: 45 }}
            >
              {t("facilities.locationLink")} <span aria-hidden="true">↗</span>
            </S.EditorialLink>
          </div>
        </S.FacilitiesCopy>
      </S.Container>
      <AboutBottom title={t("facilities.bottomTitle")} />
    </AboutFrame>
  );
}
