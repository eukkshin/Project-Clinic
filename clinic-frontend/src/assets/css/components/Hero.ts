import styled, { css, keyframes } from "styled-components";

// 전체 사이트에서 사용할 '밝은 세이지 그린' 기준 색상.
// 나중에는 프로젝트 공통 theme 파일로 옮기면 색상을 한꺼번에 바꿀 수 있다.
const SAGE = "#A1AF96";
const DARK_TEXT = "#344638";
const IVORY = "#F7F4EA";

const shimmer = keyframes`
  0%, 100% { opacity: 0.45; }
  50% { opacity: 0.72; }
`;

export const CarouselSection = styled.section`
  position: relative;
  width: 100%;
  height: 100svh; /* 모바일 브라우저 주소창 영향을 줄인 화면 높이 단위 */
  min-height: 650px;
  max-height: 1100px;
  overflow: hidden;
  background: ${SAGE};
  color: ${DARK_TEXT};
  isolation: isolate; /* Hero 내부 z-index가 외부 요소와 섞이지 않게 한다. */

  @media (max-width: 768px) {
    height: 85svh;
    min-height: 540px;
  }
`;

// EmblaViewport는 슬라이더의 전체 사진을 담는 레이어다.
// 이 요소만 GSAP으로 blur + fade해도 EmblaContainer의 x축 이동은 유지된다.
export const EmblaViewport = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform-origin: center center;
  filter: blur(0px); /* GSAP이 0 → 7px로 자연스럽게 보간할 시작값 */
`;

// flex로 슬라이드가 좌우 일렬로 놓이게 한다. 이동 제어는 Embla가 맡는다.
export const EmblaContainer = styled.div`
  display: flex;
  height: 100%;
  touch-action: pan-y pinch-zoom;
`;

export const EmblaSlide = styled.div`
  position: relative;
  flex: 0 0 100%; /* 각 슬라이드가 화면 너비 100%를 차지한다. */
  min-width: 0;
  height: 100%;
  overflow: hidden;
  background: ${SAGE};
`;

export const SlideLink = styled.a`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  color: inherit;
  text-decoration: none;
`;

/**
 * 각 슬라이드의 이미지를 100% 가득 표시하는 뷰.
 * GSAP clip-path를 절대 적용하지 않는다. 작은 사각형이 생기지 않게 하는 핵심.
 */
export const VisualFrame = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
`;

// 이미지/영상에만 미세한 확대를 적용한다. Embla 부모 요소에는 transform을 주지 않는다.
export const ImageWrapper = styled.div`
  position: absolute;
  inset: 0;
  transform-origin: center center;

  /* Next/Image fill의 기준 위치가 된다. */
  img,
  video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// 파일이 아직 없는 경우에도 레이아웃이 무너지지 않도록 기본 그라데이션을 보여준다.
export const EmptyMedia = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(125deg, #cad4b9 0%, #96aa88 52%, #789179 100%);
`;

export const HeroVideo = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 첫 화면에서 밝은 사진 위에도 흰 글자가 읽히도록 왼쪽을 어둡게 만든다.
// Soft Focus 전환에서는 이 그라데이션도 사진과 함께 페이드된다.
export const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none; /* 장식 요소가 링크 클릭을 가로막지 않게 한다. */
  background:
    linear-gradient(
      90deg,
      rgba(29, 45, 34, 0.72) 0%,
      rgba(29, 45, 34, 0.42) 34%,
      rgba(29, 45, 34, 0.09) 72%,
      rgba(29, 45, 34, 0.02) 100%
    ),
    linear-gradient(0deg, rgba(15, 25, 18, 0.28) 0%, transparent 31%);

  @media (max-width: 768px) {
    background: linear-gradient(
      90deg,
      rgba(29, 45, 34, 0.72),
      rgba(29, 45, 34, 0.22) 100%
    );
  }
`;

export const SlideContent = styled.div<{ $withRollingBanner?: boolean }>`
  position: absolute;
  z-index: 3;
  top: 49%;
  left: clamp(24px, 7vw, 140px);
  transform: translateY(-50%);
  width: min(70vw, 920px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  pointer-events: none; /* 화면 전체를 감싸는 SlideLink가 클릭을 받는다. */

  /* 기존 RollingBanner가 중앙의 주인공이 되면,
     기존 슬라이드 제목은 위쪽의 작은 보조 제목으로 이동시킨다.
     그래야 큰 배너와 텍스트가 중앙에서 서로 겹치지 않는다. */
  ${({ $withRollingBanner }) =>
    $withRollingBanner &&
    css`
      top: 26%;
      width: min(65vw, 760px);

      h1 {
        font-size: clamp(34px, 4.2vw, 76px);
      }
      [data-hero-description],
      [data-hero-explore] {
        display: none;
      }
    `}

  @media (max-width: 768px) {
    top: ${({ $withRollingBanner }) => ($withRollingBanner ? "26%" : "45%")};
    left: 24px;
    width: min(78vw, 400px);

    h1 {
      font-size: clamp(28px, 8vw, 48px);
    }
  }
`;

export const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  color: rgba(255, 255, 255, 0.92);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.26em;

  @media (max-width: 768px) {
    font-size: 9px;
    letter-spacing: 0.16em;
    margin-bottom: 17px;
  }
`;

export const EyebrowLine = styled.span`
  width: 28px;
  height: 1px;
  background: rgba(255, 255, 255, 0.85);
`;

export const SlideTitle = styled.h1`
  margin: 0;
  max-width: 100%;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(58px, 8.2vw, 148px);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.06em;
  color: #f8f7f0;
  text-shadow: 0 12px 48px rgba(0, 0, 0, 0.12);
  word-break: keep-all;
  overflow-wrap: anywhere; /* 관리자가 긴 제목을 등록해도 화면 밖으로 넘치지 않게 한다. */

  @media (max-width: 768px) {
    font-size: clamp(36px, 10vw, 60px);
    line-height: 1.12;
  }
`;

export const SlideDescription = styled.p`
  margin: 26px 0 0;
  color: rgba(255, 255, 255, 0.87);
  font-size: clamp(13px, 1.08vw, 17px);
  font-weight: 400;
  line-height: 1.8;
  word-break: keep-all;

  @media (max-width: 768px) {
    margin-top: 18px;
    font-size: 13px;
  }
`;

export const ExploreLink = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 20px;
  margin-top: 44px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.75);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.13em;
  transition: gap 0.3s ease;

  span {
    font-size: 19px;
    font-weight: 400;
  }
  ${SlideLink}:hover & {
    gap: 28px;
  }

  @media (max-width: 768px) {
    margin-top: 26px;
  }
`;

export const BottomControls = styled.div`
  position: absolute;
  z-index: 10;
  left: clamp(24px, 7vw, 140px);
  right: clamp(24px, 7vw, 140px);
  bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 768px) {
    left: 24px;
    right: 24px;
    bottom: 24px;
  }
`;

export const ScrollCue = styled.span`
  color: #f6f7f0;
  font-size: 10px;
  letter-spacing: 0.14em;
  font-weight: 500;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-left: auto;
`;

export const SlideCounter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-variant-numeric: tabular-nums;
`;

export const CurrentNumber = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;

export const TotalNumber = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
`;

export const CounterDivider = styled.span`
  width: 22px;
  height: 1px;
  background: rgba(255, 255, 255, 0.6);
  transform: rotate(-45deg);
`;

export const ProgressTrack = styled.div`
  width: 110px;
  height: 2px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.3);

  @media (max-width: 768px) {
    width: 50px;
  }
`;

export const ProgressFill = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  transform: scaleX(0);
  transform-origin: left center;
`;

export const DotNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  @media (max-width: 768px) {
    display: none;
  }
`;

export const DotButton = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "20px" : "6px")};
  height: 6px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: ${({ $active }) => ($active ? "#fff" : "rgba(255,255,255,0.45)")};
  cursor: pointer;
  transition:
    width 0.3s ease,
    background 0.3s ease;
  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 4px;
  }
`;

export const ArrowNavigation = styled.div`
  display: flex;
  gap: 9px;
`;

export const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 19px;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    background 0.25s ease;

  &:hover {
    transform: scale(1.06);
    background: #fff;
    color: ${DARK_TEXT};
  }
  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 4px;
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    font-size: 17px;
  }
`;

/**
 * Soft Focus 전환을 위한 밝은 포그 레이어.
 * 이미지가 페이드되면 화면 전면에 아이보리빛이 차오르고
 * 최하단은 CategoryNav와 같은 세이지(#A1AF96)로 끝난다.
 */
export const FocusVeil = styled.div`
  position: absolute;
  z-index: 2;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    #e9eee3 0%,
    #dce6d9 25%,
    #c2d0be 57%,
    ${SAGE} 100%
  );

  /*
   * 모바일/움직임 줄이기 환경에서는 Hero를 pin하지 않으므로
   * 사진의 맨 아래를 세이지 그린으로 자연스럽게 녹여서
   * 바로 이어지는 CategoryNav 첫 픽셀과 색이 같도록 한다.
   * 데스크톱 일반 모드에서는 GSAP이 opacity를 제어한다.
   */
  @media (max-width: 768px), (prefers-reduced-motion: reduce) {
    opacity: 1;
    background: linear-gradient(
      180deg,
      transparent 52%,
      rgba(161, 175, 150, 0.18) 72%,
      rgba(161, 175, 150, 0.7) 89%,
      ${SAGE} 100%
    );
  }
`;

/**
 * [마지막 색 정렬 레이어]
 * Soft Focus의 중간은 아이보리→그린 포그를 유지한다.
 * 단, pin이 끝나기 직전에는 전체 화면을 순수 SAGE로 덮는다.
 * 기존에는 Hero 화면의 바닥만 SAGE이고 위는 아이보리여서
 * CategoryNav 진입 시 색이 갑자기 바뀌는 것처럼 보였다.
 *
 * 배경만 덮는 장식 요소라 z-index는 브랜드 문구(4)보다 아래(3).
 */
export const ColorMatchOverlay = styled.div`
  position: absolute;
  z-index: 3;
  inset: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  background: ${SAGE};
`;

/* ──────────────────────────────────────────────────────────────────
 * 전환 끝에서 등장하는 가운데 브랜드 메시지.
 * 사각형 사진 옆이 아니라 화면 정중앙을 차지하는 편집형 타이포그래피.
 * ────────────────────────────────────────────────────────────────── */
export const RevealCopy = styled.div`
  position: absolute;
  z-index: 4;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(calc(100% - 64px), 960px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: ${DARK_TEXT};
  opacity: 0;
  visibility: hidden;
  pointer-events: none;

  @media (max-width: 768px) {
    display: none; /* 모바일은 사진 중심의 자연스러운 스크롤 */
  }
`;

export const RevealEyebrow = styled.p`
  margin: 0 0 clamp(22px, 3.5svh, 45px);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
  color: #547059;
`;

export const RevealTitle = styled.h2`
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 400;
  font-size: clamp(64px, 8.15vw, 142px);
  line-height: 1.06;
  letter-spacing: -0.071em;
  color: #2f4b37;

  em {
    color: #607e64;
    font-weight: 400;
  }

  @media (max-height: 770px) {
    font-size: clamp(56px, 7vw, 105px);
  }
`;

export const RevealDescription = styled.p`
  margin: clamp(20px, 3.4svh, 38px) 0 0;
  font-family: inherit;
  font-size: clamp(14px, 1.14vw, 18px);
  line-height: 1.9;
  letter-spacing: -0.015em;
  color: #48634d;
`;

export const RevealRule = styled.div`
  width: 70px;
  height: 1px;
  margin: clamp(26px, 3.2svh, 42px) 0 0;
  background: rgba(63, 94, 68, 0.45);
`;

export const RevealTagline = styled.p`
  margin: 19px 0 0;
  font-size: 10px;
  letter-spacing: 0.25em;
  color: #5c7760;
`;

export const RevealSideNote = styled.span`
  position: absolute;
  z-index: 4;
  right: clamp(28px, 7vw, 140px);
  bottom: 6%;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: #59735d;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 15;
  background: linear-gradient(110deg, #d1dbc5, ${SAGE}, #bfceb2);
  animation: ${shimmer} 1.6s ease-in-out infinite;
`;

/**
 * Hero 이미지 위에 있는 RollingBanner 전용 레이어.
 * 위치는 Hero의 정중앙이며 absolute라 문서 높이를 추가하지 않는다.
 * GSAP이 이 요소만 fade-out 하므로 Hero 안의 배경/이미지는 그대로 유지된다.
 */
export const HeroRollingOverlay = styled.div`
  position: absolute;
  z-index: 8;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  color: #fafaf3;

  /* RollingBanner 최상위 박스가 기존 독립 섹션의 넓은 여백/배경을
     가지고 있을 수 있으므로 Hero 위에서는 레이아웃만 정돈한다.
     RollingBanner 내부 색상은 실제 소스 확인 후 조정하는 것이 안전하다. */
  > * {
    flex: 0 0 100%;
    min-width: 0;
    margin: 0;
    background: transparent !important; /* 독립 섹션의 배경색이 이미지 위에 뜨지 않게 한다. */
  }

  @media (max-width: 768px) {
    top: 7%;
    height: 86%;
  }
`;
