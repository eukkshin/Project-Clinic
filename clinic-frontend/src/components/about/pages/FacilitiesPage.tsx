"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import * as S from "@/components/about/pages/AboutPages.styles";
import {
  AboutBottom,
  AboutFrame,
} from "@/components/about/shared/AboutFoundation";

/** 시안용 연출 사진입니다. 실제 병원 공간을 촬영한 사진으로 교체하세요. */
const spaces = [
  {
    id: "01",
    name: "THE FIRST IMPRESSION",
    ko: "여유를 느끼는 순간",
    src: "/images/about/facilities-light.webp",
    desc: "문을 열고 들어서는 순간부터 편안한 호흡을 느낄 수 있도록. 공간의 첫인상을 섬세하게 생각합니다.",
  },
  {
    id: "02",
    name: "QUIET MOMENTS",
    ko: "고요한 일상 사이",
    src: "/images/about/facilities-green.webp",
    desc: "복잡한 일상 속 잠시 멈추어 머물 수 있는 감각. 빛과 소재, 여백의 균형을 담아냈습니다.",
  },
  {
    id: "03",
    name: "A SENSE OF BALANCE",
    ko: "조화로운 시선",
    src: "/images/about/facilities-detail.webp",
    desc: "작은 디테일까지 소홀히 하지 않는 태도가 공간의 분위기를 결정한다고 믿습니다.",
  },
] as const;

export default function FacilitiesPage() {
  const [active, setActive] = useState(0);
  return (
    <AboutFrame>
      <S.FacilitiesHero>
        <S.Container>
          <S.Eyebrow data-about-reveal>03 / THE SPACE</S.Eyebrow>
          <S.FacilitiesCopy style={{ padding: "45px 0 95px" }}>
            <S.SectionTitle data-about-reveal>
              머무는 순간에도,
              <br />
              아름다운 <em style={{ fontWeight: 400 }}>여백.</em>
            </S.SectionTitle>
            <S.Body
              data-about-reveal
              style={{ maxWidth: 440, color: S.C.muted }}
            >
              어떤 공간은 말보다 먼저 마음을 전합니다. 자연광이 머무는 자리,
              차분한 색채, 편안한 동선. AHN&apos;S가 추구하는 공간의 분위기를
              소개합니다.
            </S.Body>
          </S.FacilitiesCopy>
        </S.Container>
        <S.GalleryStage aria-label="공간 분위기 사진 갤러리">
          {spaces.map((space, index) => (
            <S.GalleryLayer
              key={space.id}
              $active={active === index}
              aria-hidden={active !== index}
            >
              <Image
                src={space.src}
                fill
                alt={space.ko + "을 표현한 연출 이미지"}
                sizes="100vw"
                priority={index === 0}
              />
            </S.GalleryLayer>
          ))}
          <S.GalleryOverlay />
          <S.GalleryCaption aria-live="polite">
            <S.Eyebrow>{spaces[active].name}</S.Eyebrow>
            <h3>{spaces[active].ko}</h3>
          </S.GalleryCaption>
          <S.GallerySideIndex aria-hidden="true">
            0{active + 1} <span>/ 03</span>
          </S.GallerySideIndex>
        </S.GalleryStage>
        <S.Container>
          <S.GalleryTabBar role="group" aria-label="공간 사진 선택">
            {spaces.map((space, index) => (
              <S.GalleryTab
                type="button"
                key={space.id}
                $active={active === index}
                onClick={() => setActive(index)}
                aria-pressed={active === index}
              >
                <span>{space.id}</span> {space.ko}
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
            <S.FigureCredit>
              ※ 공간 사진은 디자인 시안용입니다. 실제 병원 사진으로 교체해
              주세요.
            </S.FigureCredit>
          </div>
        </S.Container>
      </S.FacilitiesHero>
      <S.Container>
        <S.FacilitiesCopy data-about-reveal>
          <div>
            <S.Eyebrow>AN EXPERIENCE OF CALM</S.Eyebrow>
            <S.SectionTitle style={{ marginTop: 38 }}>
              보이는 것 너머의
              <br />
              편안함까지.
            </S.SectionTitle>
          </div>
          <div>
            <S.Body style={{ color: S.C.muted, maxWidth: 530 }}>
              공간은 단순한 배경이 아니라, 사람을 환대하는 방식의 일부입니다.
              낯설지 않은 감각과 차분한 분위기가 상담 전후의 시간을 조금 더
              편안하게 만들어 주기를 바랍니다.
            </S.Body>
            <S.EditorialLink
              as={Link}
              href="/about/location"
              style={{ marginTop: 45 }}
            >
              오시는 길 확인하기 <span aria-hidden="true">↗</span>
            </S.EditorialLink>
          </div>
        </S.FacilitiesCopy>
      </S.Container>
      <AboutBottom title="편안한 첫 만남을 기다립니다." />
    </AboutFrame>
  );
}
