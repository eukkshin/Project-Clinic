import styled from "styled-components";

import * as S from "@/components/procedures/DetailPage.styles";
import * as V from "@/components/procedures/DetailSectionLayouts.styles";

/**
 * 필러 / 쁘띠시술 전용 에디토리얼 스타일.
 * 기존 눈·코·동안성형 및 공통 Hero/SideNav/FAQ 컴포넌트를 변경하지 않습니다.
 */
export const PetitDetailTheme = styled.div`
  width: 100%;
  min-width: 0;
  background: #f9f5ee;

  ${S.Hero} {
    align-items: flex-end;
    background: #193427;
  }
  ${S.HeroShade} {
    background:
      linear-gradient(
        90deg,
        rgba(15, 39, 28, 0.46) 0%,
        rgba(17, 42, 30, 0.18) 49%,
        rgba(12, 28, 21, 0.02) 77%
      ),
      linear-gradient(0deg, rgba(7, 26, 18, 0.54), transparent 46%);
  }
  ${S.HeroInner} {
    z-index: 1;
    width: min(calc(100% - 112px), 1320px);
    margin: 0 auto;
    padding: 120px 0 clamp(124px, 15vh, 194px);
  }
  ${S.HeroEyebrow} {
    color: #ecdac4;
    letter-spacing: 0.3em;
  }
  ${S.HeroTitle} {
    max-width: 620px;
    font-size: clamp(56px, 7vw, 112px);
    font-weight: 400;
    line-height: 1.12;
    letter-spacing: -0.07em;
  }
  ${S.HeroDesc} {
    max-width: 520px;
    color: rgba(250, 246, 237, 0.9);
  }
  ${S.HeroPoints} {
    display: none;
  }
  ${S.Hero}::after {
    content: "AHN'S   /   PERSONAL BEAUTY";
    position: absolute;
    right: clamp(30px, 5.5vw, 98px);
    bottom: 98px;
    color: rgba(255, 244, 226, 0.72);
    font-family: Georgia, serif;
    font-size: 10px;
    letter-spacing: 0.27em;
    pointer-events: none;
  }

  /* 기존 왼쪽 padding 때문에 발생했던 본문 오른쪽 쏠림 방지 */
  ${S.Content} {
    width: min(calc(100% - clamp(112px, 17vw, 240px)), 1260px);
    margin-inline: auto;
    padding-left: 0;
  }
  ${S.Label} {
    color: #9b846c;
  }
  ${S.EditorialSection}[id="detail-intro"] {
    background: #f9f5ee;
  }
  ${S.EditorialSection}[id="detail-intro"] ${S.IntroVisual} {
    aspect-ratio: 0.97 / 1;
    min-height: 380px;
    border-radius: 220px 220px 8px 8px;
    background: #d9ccbd;
    box-shadow: 0 22px 58px rgba(94, 70, 50, 0.12);
  }
  ${S.EditorialSection}[id="detail-intro"] ${S.IntroMark} {
    color: #fff7e9;
    font-size: 0;
  }
  ${S.EditorialSection}[id="detail-intro"] ${S.IntroMark}::after {
    content: "Simply You";
    font:
      italic clamp(22px, 2vw, 34px)/1.15 Georgia,
      serif;
    letter-spacing: -0.035em;
  }

  ${S.EditorialSection}[id="detail-balance"] {
    background: #eee8df;
  }
  ${V.ComparisonCard} {
    min-height: 260px;
    border-radius: 3px 72px 3px 3px;
    background: #faf8f3;
    border: 1px solid rgba(128, 98, 77, 0.14);
  }
  ${V.ComparisonIndex} {
    color: #ad9580;
  }

  ${S.EditorialSection}[id="detail-features"] {
    background: #f9f5ee;
  }
  ${V.FeatureRows} {
    border-color: rgba(133, 101, 81, 0.2);
  }
  ${V.FeatureRow} {
    padding-block: clamp(24px, 3.3vw, 44px);
  }
  ${V.FeatureRow} .number {
    color: #b49e89;
  }
  ${V.FeatureRow} svg {
    color: #8d826b;
  }

  ${S.EditorialSection}[id="detail-process"] {
    background: linear-gradient(128deg, #2a4b3a 0%, #1d382d 52%, #162d25 100%);
  }
  ${V.TimelineItem}::before {
    background: #d3bda5;
  }

  ${S.EditorialSection}[id="detail-gallery"] {
    background: #f1eae1;
  }
  ${S.GalleryVisual} {
    border-radius: 160px 160px 5px 5px;
    background: #dfd1c1;
    aspect-ratio: 0.88 / 1;
  }
  ${S.GalleryVisual} img {
    object-position: center;
  }
  ${S.GalleryCard} figcaption {
    color: #8b7f70;
  }
  ${S.GalleryControls} button {
    border-color: rgba(119, 94, 68, 0.48);
    color: #775f4e;
  }
  ${S.GalleryControls} button:hover {
    background: #254736;
    color: #fff;
  }

  ${S.EditorialSection}[id="detail-faq"] {
    background: #f9f5ee;
  }
  ${S.EditorialSection}[id="detail-consultation"] {
    background: #1b3528;
    padding-bottom: clamp(110px, 12vw, 185px);
  }
  ${S.EditorialSection}[id="detail-consultation"] ${S.CtaPanel} {
    background: transparent;
    padding-block: clamp(46px, 7vw, 92px);
  }
  ${S.EditorialSection}[id="detail-consultation"] ${S.Label} {
    color: #dec8af;
  }
  ${S.EditorialSection}[id="detail-consultation"] ${S.CtaButton} {
    border-color: rgba(230, 210, 187, 0.74);
  }

  @media (max-width: 768px) {
    ${S.HeroInner} {
      width: calc(100% - 42px);
      padding: 130px 0 118px;
    }
    ${S.HeroTitle} {
      font-size: clamp(48px, 11vw, 76px);
    }
    ${S.HeroShade} {
      background: linear-gradient(
        0deg,
        rgba(13, 37, 26, 0.9),
        rgba(17, 37, 27, 0.4) 64%,
        rgba(10, 28, 21, 0.08)
      );
    }
    ${S.Hero}::after {
      display: none;
    }
    ${S.Content} {
      width: calc(100% - 40px);
      padding-left: 0;
    }
    ${S.EditorialSection}[id="detail-intro"] ${S.IntroVisual} {
      aspect-ratio: 1 / 1;
      min-height: 290px;
      border-radius: 130px 130px 3px 3px;
    }
    ${V.ComparisonCard} {
      min-height: auto;
      border-radius: 2px 42px 2px 2px;
    }
    ${S.GalleryVisual} {
      border-radius: 95px 95px 3px 3px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ${S.HeroVisual} {
      transform: none !important;
    }
  }
`;
