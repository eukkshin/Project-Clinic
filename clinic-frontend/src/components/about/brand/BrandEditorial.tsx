"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import * as S from "@/components/about/brand/BrandEditorial.styles";
import BrandEditorialMotion from "@/components/about/brand/BrandEditorialMotion";
import { stripLocalePrefix } from "@/i18n/url";
import {
  isAboutLinkActive,
  useAboutNavigation,
} from "@/lib/navigation/aboutNavigation";

/**
 * AHN'S BRAND / 2026 editorial redesign
 * 시안: 베이지 인물 Hero → 딥그린 스토리 → 포토 가치 3종 → 공간 이미지 → 상담 CTA
 * 정보성 문구와 공간 이미지는 브랜드 디자인 시안이며, 실제 병원 정보·시설을 의미하지 않습니다.
 * 기존 Header / Footer / 관리자 / 세부 시술 컴포넌트와 독립적으로 동작합니다.
 */

const heroImages = [
  {
    src: "/images/brand-editorial/hero-profile.webp",
    altKey: "heroAlt1",
  },
  {
    src: "/images/brand-editorial/hero-portrait.webp",
    altKey: "heroAlt2",
  },
  {
    src: "/images/brand-editorial/hero-soft.webp",
    altKey: "heroAlt3",
  },
] as const;

const values = [
  {
    index: "01",
    title: "Listen",
    subtitleKey: "v1Subtitle",
    copyKey: "v1Copy",
    image: "/images/brand-editorial/value-listen.webp",
    altKey: "v1Alt",
  },
  {
    index: "02",
    title: "Balance",
    subtitleKey: "v2Subtitle",
    copyKey: "v2Copy",
    image: "/images/brand-editorial/value-balance.webp",
    altKey: "v2Alt",
  },
  {
    index: "03",
    title: "Respect",
    subtitleKey: "v3Subtitle",
    copyKey: "v3Copy",
    image: "/images/brand-editorial/value-respect.webp",
    altKey: "v3Alt",
  },
] as const;

export default function BrandEditorial() {
  const pathname = stripLocalePrefix(usePathname());
  const t = useTranslations("About");
  const navNames: Record<string, string> = {
    "/about/brand": t("shared.navBrand"),
    "/about/philosophy": t("shared.navPhilosophy"),
    "/about/doctors": t("shared.navDoctors"),
    "/about/facilities": t("shared.navFacilities"),
    "/about/safety": t("shared.navSafety"),
    "/about/location": t("shared.navLocation"),
  };
  const aboutPages = useAboutNavigation();

  const [slide, setSlide] = useState(0);

  const moveSlide = (direction: -1 | 1) => {
    setSlide(
      (value) => (value + direction + heroImages.length) % heroImages.length,
    );
  };

  return (
    <S.Page id="ahns-brand-editorial">
      <BrandEditorialMotion />

      <S.Hero id="brand-top" aria-labelledby="brand-heading">
        <S.HeroMedia aria-hidden="true">
          {heroImages.map((item, index) => (
            <S.HeroSlide key={item.src} $active={slide === index}>
              <Image
                src={item.src}
                alt=""
                fill
                priority={index === 0}
                sizes="(max-width: 700px) 100vw, 68vw"
              />
            </S.HeroSlide>
          ))}
        </S.HeroMedia>
        <S.HeroGradient aria-hidden="true" />

        <S.HeroInner>
          <S.AboutNav aria-label={t("brand.navLabel")}>
            <S.NavIdentity>
              ABOUT <span>/</span>
            </S.NavIdentity>

            <S.NavItems>
              {aboutPages.map((page) => (
                <S.NavItem
                  key={page.url}
                  as={Link}
                  href={page.url}
                  $active={isAboutLinkActive(pathname, page.url)}
                  aria-current={
                    isAboutLinkActive(pathname, page.url) ? "page" : undefined
                  }
                >
                  {navNames[page.url] ?? page.name}
                </S.NavItem>
              ))}
            </S.NavItems>
          </S.AboutNav>

          <S.HeroContent>
            <S.Eyebrow>
              BRAND STORY <span aria-hidden="true">—</span> AHN&apos;S
            </S.Eyebrow>
            <S.HeroTitle id="brand-heading">
              {t("brand.hero1")}
              <br />
              {t("brand.hero2")}
              <br />
              <em>AHN&apos;S</em>
            </S.HeroTitle>
            <S.HeroRule aria-hidden="true" />
            <S.HeroDescription>
              {t("brand.heroDesc1")}
              <br />
              {t("brand.heroDesc2")}
            </S.HeroDescription>
            <S.HeroScroll
              href="#brand-story"
              aria-label={t("brand.scrollLabel")}
            >
              <span>SCROLL TO EXPLORE</span>
              <i aria-hidden="true" />
            </S.HeroScroll>
          </S.HeroContent>
          <S.HeroSideText aria-hidden="true">
            NATURAL <br /> BALANCE <br /> CONFIDENCE
          </S.HeroSideText>
          <S.HeroControls aria-label={t("brand.controlsLabel")}>
            <span aria-live="polite">
              {String(slide + 1).padStart(2, "0")} /{" "}
              {String(heroImages.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => moveSlide(-1)}
              aria-label={t("brand.prevImage")}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => moveSlide(1)}
              aria-label={t("brand.nextImage")}
            >
              →
            </button>
          </S.HeroControls>
        </S.HeroInner>
      </S.Hero>

      <S.Story id="brand-story" aria-labelledby="brand-story-title">
        <S.StoryCopy data-brand-editorial-reveal>
          <S.SmallLabel>
            01 <span>OUR STORY</span>
          </S.SmallLabel>
          <S.StoryTitle id="brand-story-title">
            {t("brand.story1")}
            <br />
            {t("brand.story2")}
          </S.StoryTitle>
          <S.StoryText>
            {t("brand.storyText1")}
            <br />
            {t("brand.storyText2")}
            <br />
            {t("brand.storyText3")}
          </S.StoryText>
          <S.StoryLink as={Link} href="/about/philosophy">
            {t("brand.storyLink")} <span aria-hidden="true">↗</span>
          </S.StoryLink>
        </S.StoryCopy>
        <S.StoryPhoto data-brand-editorial-parallax>
          <Image
            src="/images/brand-editorial/story-space.webp"
            alt={t("brand.storyPhotoAlt")}
            fill
            sizes="(max-width: 760px) 100vw, 52vw"
          />
          <S.StoryPhotoShade />
          <S.StoryPhotoCopy data-brand-editorial-reveal>
            {t("brand.storyPhoto1")}
            <br />
            {t("brand.storyPhoto2")}
          </S.StoryPhotoCopy>
          <S.StoryNumber aria-hidden="true">02 / 05</S.StoryNumber>
        </S.StoryPhoto>
      </S.Story>

      <S.Values aria-labelledby="brand-values-heading">
        <S.Container>
          <S.ValuesHeader data-brand-editorial-reveal>
            <div>
              <S.SectionEyebrow>OUR VALUES</S.SectionEyebrow>
              <S.ValuesHeading id="brand-values-heading">
                {t("brand.valuesHeading")}
              </S.ValuesHeading>
            </div>
            <S.ValuesIntro>
              {t("brand.valuesIntro1")}
              <br />
              {t("brand.valuesIntro2")}
            </S.ValuesIntro>
          </S.ValuesHeader>
          <S.ValueGrid>
            {values.map((value) => (
              <S.ValueCard key={value.index} data-brand-editorial-reveal>
                <S.ValuePhoto data-brand-editorial-parallax>
                  <Image
                    src={value.image}
                    alt={t(`brand.${value.altKey}`)}
                    fill
                    sizes="(max-width: 760px) 100vw, 33vw"
                  />
                  <S.ValueIndex>{value.index}</S.ValueIndex>
                  <S.ValuePhotoArrow aria-hidden="true">↗</S.ValuePhotoArrow>
                </S.ValuePhoto>
                <S.ValueMeta>
                  {value.index} <span aria-hidden="true" />
                </S.ValueMeta>
                <S.ValueEnglish>{value.title}</S.ValueEnglish>
                <S.ValueKorean>{t(`brand.${value.subtitleKey}`)}</S.ValueKorean>
                <S.ValueDescription>
                  {t(`brand.${value.copyKey}`)}
                </S.ValueDescription>
              </S.ValueCard>
            ))}
          </S.ValueGrid>
        </S.Container>
      </S.Values>

      <S.Space aria-labelledby="brand-space-heading">
        <S.SpaceImage data-brand-editorial-parallax>
          <Image
            src="/images/brand-editorial/quiet-space.webp"
            alt={t("brand.spaceAlt")}
            fill
            sizes="100vw"
          />
        </S.SpaceImage>
        <S.SpaceVeil aria-hidden="true" />
        <S.SpaceContent data-brand-editorial-reveal>
          <S.SectionEyebrow $light>THE SPACE OF AHN&apos;S</S.SectionEyebrow>
          <S.SpaceTitle id="brand-space-heading">
            {t("brand.spaceTitle1")}
            <br />
            {t("brand.spaceTitle2")}
          </S.SpaceTitle>
          <S.SpaceDescription>
            {t("brand.spaceDesc1")}
            <br />
            {t("brand.spaceDesc2")}
          </S.SpaceDescription>
          <S.SpaceLink as={Link} href="/about/facilities">
            {t("brand.spaceLink")} <span aria-hidden="true">↗</span>
          </S.SpaceLink>
        </S.SpaceContent>
      </S.Space>

      <S.Closing aria-labelledby="brand-closing-heading">
        <S.ClosingInner>
          <S.ClosingCopy data-brand-editorial-reveal>
            <S.ClosingTitle id="brand-closing-heading">
              {t("brand.close1")}
              <br />
              {t("brand.close2")}
            </S.ClosingTitle>
            <S.ClosingSmall>BEAUTY IN YOUR OWN WAY.</S.ClosingSmall>
          </S.ClosingCopy>
          <S.ClosingActions data-brand-editorial-reveal>
            <S.ContactLink href="/#site-footer-contact">
              {t("brand.contactLink")} <span aria-hidden="true">↗</span>
            </S.ContactLink>
            <S.LocationLink as={Link} href="/about/location">
              {t("brand.locationLink")} <span aria-hidden="true">↗</span>
            </S.LocationLink>
          </S.ClosingActions>
        </S.ClosingInner>
      </S.Closing>
    </S.Page>
  );
}
