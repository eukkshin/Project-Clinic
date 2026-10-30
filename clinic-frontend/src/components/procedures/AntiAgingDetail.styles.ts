import * as S from "@/components/procedures/DetailPage.styles";
import * as V from "@/components/procedures/DetailSectionLayouts.styles";
import styled from "styled-components";

/**
 * 안면거상 페이지 전용 테마.
 * 다른 페이지의 Hero, SideNav, QnA, Footer, GSAP 코드와 독립적입니다.
 */
export const AntiAgingDetailTheme = styled.div`
  width: 100%;
  min-width: 0;
  background: #f7f5ee;

  /* 왼쪽 하단 타이포그래피 + 절제된 다크그린 비주얼 */
  ${S.Hero} {
    align-items: flex-end;
    background: #1b3528;
  }
  ${S.HeroShade} {
    background:
      linear-gradient(
        90deg,
        rgba(15, 39, 30, 0.3),
        rgba(15, 39, 30, 0.06) 62%,
        transparent 90%
      ),
      linear-gradient(0deg, rgba(12, 31, 23, 0.53), transparent 40%);
  }
  ${S.HeroInner} {
    width: min(calc(100% - 100px), 1420px);
    margin-inline: auto;
    padding: 120px 0 clamp(112px, 13vh, 170px);
    z-index: 1;
  }
  ${S.HeroTitle} {
    max-width: 650px;
    font-size: clamp(53px, 6.5vw, 108px);
    font-weight: 400;
    letter-spacing: -0.068em;
    line-height: 1.14;
  }
  ${S.HeroDesc} {
    max-width: 550px;
    color: rgba(253, 251, 244, 0.85);
  }
  ${S.HeroPoints} {
    display: none;
  } /* 공통 Hero의 눈성형 전용 안내 문구 제거 */

  ${S.Hero}::after {
    content: "AHN'S   /   TIMELESS BEAUTY";
    position: absolute;
    right: clamp(36px, 6vw, 110px);
    bottom: 108px;
    color: rgba(248, 243, 232, 0.62);
    font-size: 10px;
    letter-spacing: 0.25em;
    pointer-events: none;
  }

  /* 기존 Content의 좌측만 큰 패딩을 적용하지 않도록 중앙 정렬 */
  ${S.Content} {
    width: min(calc(100% - clamp(112px, 17vw, 240px)), 1260px);
    margin-inline: auto;
    padding-left: 0;
  }

  ${S.EditorialSection}[id="detail-intro"] {
    background: #f7f5ee;
  }
  ${S.EditorialSection}[id="detail-intro"] ${S.IntroVisual} {
    aspect-ratio: 0.93 / 1;
    border-radius: 220px 220px 4px 4px;
    background: #e6dfd1;
  }
  ${S.EditorialSection}[id="detail-intro"] ${S.IntroMark} {
    font-size: 0;
  }
  ${S.EditorialSection}[id="detail-intro"] ${S.IntroMark}::after {
    content: "Timeless Harmony";
    font:
      italic clamp(21px, 2.2vw, 36px)/1.2 Georgia,
      serif;
  }

  ${S.EditorialSection}[id="detail-balance"] {
    background: #eaece4;
  }
  ${V.ComparisonCard} {
    border-radius: 2px 72px 2px 2px;
    min-height: 270px;
    background: rgba(255, 255, 255, 0.67);
    border-color: rgba(52, 80, 58, 0.1);
  }
  ${V.ComparisonIndex} {
    color: #7c8d78;
  }

  ${S.EditorialSection}[id="detail-features"] {
    background: #f7f5ee;
  }
  ${V.FeatureRow} {
    padding-block: clamp(24px, 3.6vw, 46px);
  }
  ${V.FeatureRow} .number {
    color: #8d9986;
  }
  ${V.FeatureRow} svg {
    color: #50745b;
  }

  ${S.EditorialSection}[id="detail-process"] {
    background: linear-gradient(125deg, #274936 0%, #1b3528 56%, #142d24 100%);
  }
  ${V.TimelineItem}::before {
    background: #c6cead;
  }

  ${S.EditorialSection}[id="detail-gallery"] {
    background: #eceee8;
  }
  ${S.GalleryVisual} {
    border-radius: 160px 160px 2px 2px;
    background: #e1e2d7;
  }

  ${S.EditorialSection}[id="detail-faq"] {
    background: #f7f5ee;
  }
  ${S.EditorialSection}[id="detail-consultation"] {
    padding-bottom: clamp(110px, 12vw, 190px);
    background: #1b3528;
  }
  ${S.EditorialSection}[id="detail-consultation"] ${S.CtaPanel} {
    background: transparent;
    border-radius: 0;
    padding-block: clamp(52px, 7vw, 96px);
  }
  ${S.EditorialSection}[id="detail-consultation"] ${S.CtaPanel}::before,
  ${S.EditorialSection}[id="detail-consultation"] ${S.CtaPanel}::after {
    border-color: rgba(232, 231, 212, 0.12);
  }

  @media (max-width: 768px) {
    ${S.HeroInner} {
      width: calc(100% - 42px);
      padding: 120px 0 110px;
    }
    ${S.HeroTitle} {
      font-size: clamp(44px, 10vw, 72px);
    }
    ${S.HeroShade} {
      background: linear-gradient(
        0deg,
        rgba(15, 35, 26, 0.84),
        rgba(15, 35, 26, 0.32) 55%,
        transparent
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
      min-height: 280px;
      border-radius: 120px 120px 2px 2px;
    }
    ${V.ComparisonCard} {
      min-height: auto;
      border-radius: 2px 45px 2px 2px;
    }
    ${S.GalleryVisual} {
      border-radius: 95px 95px 2px 2px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ${S.HeroVisual} {
      transform: none !important;
    }
  }
`;
