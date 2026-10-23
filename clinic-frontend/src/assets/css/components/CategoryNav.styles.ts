import styled from 'styled-components';

/**
 * [홈페이지 공통 색상]
 * Hero에서 사용한 세이지 그린을 그대로 이어 받아 전체 디자인을 통일한다.
 */
const SAGE = "#A1AF96";
const IVORY = "#F7F4EA";
const DARK = "#344638";

/**
 * Hero → CategoryNav 사이의 전환 영역.
 * 여기에는 GSAP pin이 없어서 일반 세로 스크롤로 자연스럽게 지나간다.
 */
export const TransitionBridge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 0;
  padding: 0;
  box-sizing: border-box;
  text-align: center;
  color: ${DARK};
  background: transparent;
  @media (min-width: 769px) { display: none; }

  @media (max-width: 768px) {
    min-height: clamp(260px, 38svh, 400px);
    /* Hero 모바일 하단의 아이보리와 양 끝 색을 맞춰 단절을 없앤다. */
    background: linear-gradient(
      180deg,
      #f7f4ea 0%,
      #e9efe5 52%,
      #f7f4ea 100%
    );
  }
`;

export const BridgeInner = styled.div`
  width: 100%;
  max-width: 1000px;
`;

export const BridgeEyebrow = styled.p`
  margin: 0;
  font-family: inherit;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.27em;
  color: #607965;
`;

export const BridgeText = styled.p`
  margin: 22px 0 26px;
  font-family: inherit;
  font-size: clamp(31px, 4.7vw, 74px);
  font-weight: 400;
  letter-spacing: -0.06em;
  line-height: 1.12;

  em {
    color: #69826b;
    font-weight: 400;
  }
`;

export const BridgeLine = styled.div`
  width: 68px;
  height: 1px;
  margin: 24px auto 0;
  background: rgba(52, 70, 56, 0.3);
`;

/**
 * 가로 갤러리 전체 화면.
 * PC에서는 viewport 높이(100svh)를 기준으로 고정되어 보여야
 * 화면 밖으로 콘텐츠가 튀어나오거나 다음 섹션과 겹치지 않는다.
 */
export const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100svh;
  min-height: 650px;
  padding: clamp(50px, 5.2vw, 84px) 0;
  box-sizing: border-box;
  overflow: hidden;
  /* Hero 마지막 프레임(#F7F4EA)에서 공통 배경(HomeCanvas)이
     서서히 드러나도록 상단에만 매우 얇은 색상 보정층을 둔다.
     이 레이어는 카드/GSAP pin의 위치나 크기를 바꾸지 않는다. */
  background: linear-gradient(
    180deg,
    #f7f4ea 0px,
    rgba(247, 244, 234, 0.88) 115px,
    rgba(247, 244, 234, 0) 340px
  );
  color: ${DARK};

  @media (max-width: 768px) {
    height: auto;
    min-height: 0;
    padding: 78px 0 46px;
  }
`;

export const LoadingMessage = styled.p`
  margin: auto;
  font-family: inherit;
  color: #708670;
  font-size: 12px;
  letter-spacing: 0.18em;
`;

export const Heading = styled.div`
  position: relative;
  z-index: 1;
  padding: 0 clamp(24px, 6vw, 112px);
  margin-bottom: clamp(22px, 2.55vw, 40px);
`;

export const Kicker = styled.p`
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 0;
  font-family: inherit;
  color: #657e69;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.19em;

  span {
    color: #a2b4a4;
  }

  @media (max-width: 768px) {
    font-size: 9px;
    gap: 10px;
    flex-wrap: wrap;
  }
`;

export const HeadingRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 26px;
  margin-top: clamp(12px, 2svh, 26px);

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const Title = styled.h2`
  margin: 0;
  max-width: 900px;
  font-family: var(--ahns-display, Georgia, serif);
  font-size: clamp(42px, 4.45vw, 72px);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.065em;

  em {
    font-style: italic;
    font-weight: 400;
    color: #829e84;
  }

  @media (max-width: 768px) {
    font-size: clamp(36px, 9vw, 54px);
  }
`;

export const Intro = styled.p`
  margin: 0 0 4px;
  flex: 0 0 auto;
  font-family: inherit;
  color: #637a66;
  font-size: clamp(12px, 1vw, 14px);
  line-height: 1.9;
  word-break: keep-all;
`;

/**
 * Viewport = 지금 보이는 창, Track = 그 안의 긴 카드 줄.
 * PC는 Viewport가 넘치는 부분을 숨기고 GSAP이 Track을 이동한다.
 * 모바일은 넘치는 부분을 표시할 수 있도록 가로 스크롤을 켠다.
 */
export const Viewport = styled.div`
  position: relative;
  width: 100%;
  flex: 0 0 auto;
  overflow: hidden;
  scroll-padding-inline: clamp(24px, 6vw, 112px);
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  outline-offset: -4px;
  &::-webkit-scrollbar{display:none;}

  &:focus-visible {
    outline: 2px solid #738f78;
  }

  @media (max-width: 768px) {
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }
`;

export const Track = styled.div`
  display: flex;
  width: max-content;
  align-items: stretch;
  gap: clamp(9px, 1vw, 18px);
  padding: 0 clamp(24px, 6vw, 112px);
  will-change: transform;

  @media (max-width: 768px) {
    gap: 14px;
    will-change: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    will-change: auto;
  }
`;

/**
 * 카드 크기가 고정되어 있으면 이미지가 늦게 로드되어도 높이가 바뀌지 않는다.
 * 이는 ScrollTrigger의 시작/종료 위치가 흔들리는 문제를 줄여준다.
 */
export const Card = styled.article<{ $index: number }>`
  position: relative;
  flex: 0 0 auto;
  /* Three editorial photo cards are visible on wide screens.
     Width still drives the original GSAP getDistance() pin + scrub. */
  width: clamp(270px, 30.5vw, 535px);
  height: clamp(345px, 48svh, 530px);
  scroll-snap-align: start;
  overflow: hidden;
  border-radius: 0;
  isolation: isolate;
  background: ${({ $index }) =>
    ["#B8C7B3", "#869D8B", "#D2DAC9", "#708975"][$index % 4]};

  @media (max-width: 768px) {
    width: 80vw;
    height: clamp(300px, 56svh, 460px);
    scroll-snap-align: center;
  }
`;

export const CardLink = styled.a`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: #fff;
  isolation: isolate; /* 이미지와 글자의 z-index 순서를 카드 안에서만 관리 */

  &:focus-visible {
    outline: 3px solid #fff;
    outline-offset: -5px;
  }
`;

export const CardImage = styled.div`
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;

  img {
    transition: transform 0.8s cubic-bezier(0.2, 0.7, 0.25, 1);
  }

  ${CardLink}:hover & img {
    transform: scale(1.045);
  }

  @media (prefers-reduced-motion: reduce) {
    img {
      transition: none;
    }
  }
`;

export const ImageShade = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg,
    rgba(246, 246, 238, .10) 0%,
    rgba(15, 42, 26, .01) 38%,
    rgba(17, 39, 27, .12) 60%,
    rgba(15, 38, 24, .68) 100%);
`;

export const CardTop = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(22px, 3.2vw, 42px);
  gap: 16px;
`;

export const CardEyebrow = styled.span`
  font-family: inherit;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
`;

export const CardArrow = styled.span`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.66);
  border-radius: 50%;
  font-size: 18px;
  transition:
    background 0.3s ease,
    color 0.3s ease;

  ${CardLink}:hover & {
    background: #fff;
    color: ${DARK};
  }
`;

export const CardBottom = styled.div`
  position: relative;
  z-index: 1;
  padding: 0 clamp(18px, 2vw, 28px) clamp(20px, 2vw, 30px);
`;

export const CardNumber = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.07em;

  span {
    opacity: 0.65;
  }
`;

export const CardTitle = styled.h3`
  margin: 14px 0 18px;
  font-family: inherit;
  font-size: clamp(29px, 2.85vw, 45px);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.05em;
  word-break: keep-all;
  overflow-wrap: anywhere;

  @media (max-width: 768px) {
    font-size: clamp(34px, 9vw, 54px);
  }
`;

export const CardDiscover = styled.p`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-family: inherit;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.17em;
  opacity: 0.9;

  span {
    font-size: 16px;
  }
`;

export const ProgressInfo = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(18px, 3vw, 48px);
  padding: 18px clamp(24px, 6vw, 112px) 0;
  color: #687f6b;
`;

export const ScrollGuide = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  font-family: inherit;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.13em;

  .mobile {
    display: none;
  }
  @media (max-width: 768px) {
    .desktop {
      display: none;
    }
    .mobile {
      display: inline;
    }
  }
`;

export const ProgressBar = styled.div`
  flex: 1;
  height: 2px;
  overflow: hidden;
  background: #d5dfd2;
`;

export const ProgressBarFill = styled.div`
  width: 100%;
  height: 100%;
  background: #778f79;
  transform: scaleX(0);
  transform-origin: left center;
`;

export const PageNumber = styled.span`
  white-space: nowrap;
  font-family: inherit;
  font-size: 16px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;

  span {
    opacity: 0.55;
    font-size: 12px;
  }
`;

/** On mobile (no Hero pin), present the type as a quiet scroll-through interlude. */
export const MobileBridgeTitle = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0 10px;
    line-height: 1;
    letter-spacing: -0.055em;
    span {
      font-family: "Helvetica Neue", Arial, sans-serif;
      color: rgba(248, 247, 237, 0.78);
      font-size: clamp(42px, 10vw, 74px);
      font-weight: 300;
    }
    em {
      margin-top: -6px;
      font-family: "Iowan Old Style", Baskerville, Georgia, serif;
      color: rgba(54, 85, 58, 0.75);
      font-size: clamp(42px, 10.5vw, 78px);
    }
  }
`;


/* ── Ahn's editorial gallery / 2026 redesign ──────────────────────────
   The Hero is the only pinned opening scene. Category is a light, compact
   native carousel: no extra pin, no inter-section scroll stall.           */
export const GalleryButtons = styled.div`
  display:flex; align-items:center; gap:7px; margin-left:14px;
  @media(max-width:768px){display:none;}
`;
export const GalleryButton = styled.button`
  width:37px; height:37px; display:grid; place-items:center;
  border:1px solid rgba(36,69,53,.4); border-radius:50%;
  color:#244535; background:rgba(255,255,255,.20); cursor:pointer;
  transition:color .2s, background .2s;
  &:hover{color:#f7f4ea; background:#244535;}
  &:focus-visible{outline:2px solid #244535; outline-offset:3px;}
`;
