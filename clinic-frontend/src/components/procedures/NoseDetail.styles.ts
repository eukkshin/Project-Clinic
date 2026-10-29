import styled from 'styled-components';

import * as S from '@/assets/css/components/detail/DetailPage.styles';
import * as V from '@/assets/css/components/detail/DetailSectionLayouts.styles';

/**
 * 코성형 전용 디자인 레이어. 기존 Hero/SideNav/섹션 구현 파일을 수정하지 않습니다.
 * 눈성형에서 조정한 GSAP 속도와 SideNav 동작은 공통 컴포넌트를 그대로 따릅니다.
 */
export const NoseDetailTheme = styled.div`
  width: 100%;
  min-width: 0;
  background: #f8f7f2;

  ${S.Hero} {
    align-items: flex-end;
    background: #1b332a;
  }

  ${S.HeroShade} {
    background:
      linear-gradient(
        90deg,
        rgba(12, 32, 25, 0.54) 0%,
        rgba(12, 32, 25, 0.2) 52%,
        transparent 84%
      ),
      linear-gradient(0deg, rgba(11, 31, 24, 0.42), transparent 38%);
  }

  ${S.HeroInner} {
    width: min(calc(100% - 100px), 1510px);
    padding: 110px 0 clamp(120px, 13vh, 180px);
    margin-inline: auto;
    z-index: 1;
  }

  ${S.HeroTitle} {
    font-size: clamp(50px, 6.25vw, 100px);
    max-width: 720px;
    line-height: 1.16;
    letter-spacing: -0.06em;
  }

  ${S.HeroDesc} {
    max-width: 600px;
    color: rgba(255, 255, 255, 0.89);
  }

  /* 공통 Hero의 눈성형 전용 안내 문구는 코성형에서 노출하지 않음. */
  ${S.HeroPoints} {
    display: none;
  }

  ${S.Hero}::after {
    content: "PROFILE  /  BALANCE  /  HARMONY";
    position: absolute;
    right: clamp(36px, 6vw, 115px);
    bottom: 110px;
    pointer-events: none;
    color: rgba(255, 255, 255, 0.76);
    font-size: 10px;
    font-weight: 500;
    line-height: 1.5;
    font-family: inherit;
    letter-spacing: 0.28em;
  }

  /* 코성형 시술 소개 사진의 화면 비중을 높여 측면 윤곽을 강조. */
  ${S.IntroVisual} {
    aspect-ratio: 0.98 / 1;
    border-radius: 140px 4px 4px 4px;
    background: #d4d7cf;
  }

  ${S.IntroMark} {
    font-size: 0;
  }
  ${S.IntroMark}::after {
    content: "A balanced profile";
    font:
      italic clamp(20px, 2vw, 32px)/1.2 Georgia,
      serif;
  }

  /* 비교형 / 리스트형에서 코성형 특유의 정갈한 선형 구성. */
  ${V.ComparisonCard} {
    border-radius: 2px 70px 2px 2px;
    min-height: 295px;
    background: rgba(255, 255, 255, 0.78);
  }

  ${V.FeatureRow} {
    padding-block: clamp(24px, 3.3vw, 43px);
  }

  ${S.GalleryVisual} {
    border-radius: 3px 50px 3px 3px;
  }

  ${S.EditorialSection}[data-tone="mist"] {
    background: #edefe9;
  }

  @media (max-width: 768px) {
    ${S.HeroInner} {
      width: calc(100% - 42px);
      padding: 120px 0 112px;
    }
    ${S.HeroTitle} {
      font-size: clamp(42px, 9.4vw, 66px);
    }
    ${S.HeroShade} {
      background: linear-gradient(
        0deg,
        rgba(10, 29, 22, 0.89),
        rgba(10, 29, 22, 0.38) 54%,
        transparent 100%
      );
    }
    ${S.Hero}::after {
      display: none;
    }
    ${S.IntroVisual} {
      aspect-ratio: 1.15 / 1;
      min-height: 280px;
      border-radius: 70px 3px 3px 3px;
    }
    ${V.ComparisonCard} {
      min-height: auto;
      border-radius: 2px 48px 2px 2px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ${S.HeroVisual} {
      transform: none !important;
    }
  }

  ${S.Content} {
    width: min(calc(100% - 80px), 1260px);
    padding-left: 0;
    margin-inline: auto;
  }

  @media (max-width: 768px) {
    ${S.Content} {
      width: calc(100% - 40px);
    }
  }
`;
