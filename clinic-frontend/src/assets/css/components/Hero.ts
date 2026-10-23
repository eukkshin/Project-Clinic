import styled, { css, keyframes } from 'styled-components';

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
  background: #f7f4ea;
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
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    background: linear-gradient(110deg, transparent 30%, rgba(250,255,244,.08) 48%, transparent 67%);
    transform: translateX(-110%);
    transition: transform 1.8s cubic-bezier(.2,.7,.1,1);
  }
  ${SlideLink}:hover &::after { transform: translateX(110%); }
  @media (prefers-reduced-motion: reduce) { &::after { display: none; } }
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
  pointer-events: none;
  /* Text stays legible while the model retains photographic contrast. */
  background:
    linear-gradient(90deg,
      rgba(248, 247, 235, .86) 0%,
      rgba(248, 247, 235, .70) 20%,
      rgba(244, 246, 233, .23) 50%,
      transparent 76%),
    linear-gradient(0deg, rgba(241, 245, 233, .50), transparent 29%);
  @media (max-width: 768px) {
    background: linear-gradient(90deg, rgba(248,247,236,.90), rgba(248,247,236,.40) 70%, transparent);
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

  /* 롤링 배너가 있어도 메인 타이틀/설명/링크를 숨기지 않는다. */
  ${({ $withRollingBanner }) => $withRollingBanner && css`
    top: 45%;
    width: min(49vw, 760px);
  `}

  @media (max-width: 768px) {
    top: 47%;
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
  margin-bottom: clamp(16px, 2vw, 30px);
  color: #3f5844;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .24em;
  @media(max-width:768px){font-size:9px; letter-spacing:.14em;}
`;

export const EyebrowLine = styled.span`
  width: 28px;
  height: 1px;
  background: rgba(53, 85, 58, .58);
`;

/** DB에 저장한 슬라이드별 문구는 브랜드 타이틀 아래에 보조 설명으로 노출한다. */
export const SlideTitle = styled.p`
  margin: 15px 0 0;
  max-width: 550px;
  font-size: clamp(12px, 1.08vw, 17px);
  font-weight: 500;
  color: #36543d;
  line-height: 1.65;
  letter-spacing: -.025em;
  word-break: keep-all;
`;

export const HeroEditorialTitle = styled.h1`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0;
  font-family: var(--ahns-display, Georgia, serif);
  font-weight: 400;
  font-size: clamp(64px, 7.2vw, 136px);
  line-height: .92;
  letter-spacing: -.058em;
  color: #254433;
  white-space: nowrap;
  span { display: block; }
  em {
    display: block;
    margin-left: clamp(32px, 4.5vw, 82px);
    font-size: .88em;
    font-style: italic;
    color: #69846b;
    font-weight: 400;
  }
  @media(max-width:900px){font-size:clamp(52px,8vw,90px);}
  @media(max-width:768px){font-size:clamp(44px,10vw,76px);}
`;

export const SlideDescription = styled.p`
  margin: 8px 0 0;
  color: #59715c;
  font-size: clamp(12px, 1vw, 15px);
  font-weight: 400;
  line-height: 1.8;
  word-break: keep-all;
`;

export const ExploreLink = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 18px;
  margin-top: clamp(18px, 2vw, 30px);
  padding-bottom: 8px;
  border-bottom: 1px solid #5c775f;
  color: #254433;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .2em;
  transition: gap .28s ease;
  span { font-size: 17px; font-weight: 400; }
  ${SlideLink}:hover & { gap: 26px; }
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
  background: linear-gradient(180deg, rgba(231,239,224,.60) 0%, #e2e9dc 58%, #f7f4ea 100%);

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
      rgba(241, 242, 229, 0.3) 72%,
      rgba(247, 244, 234, 0.75) 89%,
      ${IVORY} 100%
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

  /* Organic light / shadow texture. Bottom finishes in the exact ivory
   * used by the next section, preventing a harsh pin-unpin colour seam. */
  /* Soft garden-shadow backdrop: the tail matches the shared ivory canvas. */
  background-image:
    url("/images/ahns-editorial-shadows.webp"),
    radial-gradient(ellipse at 18% 24%, rgba(150, 171, 143, .35), transparent 64%),
    radial-gradient(ellipse at 85% 78%, rgba(236, 226, 200, .55), transparent 62%),
    linear-gradient(180deg, #c7d2c1 0%, #e2e5d8 49%, #f7f4ea 100%);
  background-size: min(1850px, 125vw) auto, 100% 100%, 100% 100%, 100% 100%;
  background-position: center top;
  background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;

  /* Hero 하단의 식물 질감을 부드럽게 정리해 다음 섹션의 첫 색과 연결. */
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 38%;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(247, 244, 234, 0), #f7f4ea 98%);
  }
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
  width: 100%;
  height: min(86svh, 840px);
  max-width: 1760px;
  transform: translate(-50%, -50%);
  color: #36513a;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;

  @media (max-width: 768px) {
    display: none; /* Mobile keeps the current natural scroll behaviour. */
  }
`;

export const RevealEyebrow = styled.p`
  position: absolute;
  top: 19%;
  right: clamp(28px, 11vw, 190px);
  margin: 0;
  color: #49634f;
  font-size: clamp(9px, 0.8vw, 12px);
  font-weight: 500;
  letter-spacing: 0.3em;
  line-height: 2;
  text-align: right;
  max-width: 200px;
`;

/** The primary headline is a composition rather than a centered paragraph. */
export const RevealTitle = styled.h2`
  position: absolute;
  inset: 0;
  margin: 0;
  font-weight: 400;
  line-height: 0.86;
  letter-spacing: -0.085em;
  font-family: var(--ahns-display, Georgia, serif);

  > span {
    display: block;
    position: absolute;
    white-space: nowrap;
  }
`;

export const RevealEvery = styled.span`
  top: 12%;
  left: 8%;
  color: rgba(249, 247, 236, 0.82);
  font-size: clamp(90px, 14.3vw, 258px);
  font-weight: 300;
  letter-spacing: -0.105em;
`;

export const RevealDetail = styled.span`
  top: 35%;
  left: 30%;
  color: rgba(48, 79, 51, 0.72);
  font-family: var(--ahns-display, Georgia, serif);
  font-style: italic;
  font-size: clamp(91px, 10.1vw, 184px);
  letter-spacing: -0.09em;
`;

export const RevealUniquely = styled.span`
  top: 53%;
  left: 45%;
  color: rgba(73, 104, 71, 0.62);
  font-family: var(--ahns-display, Georgia, serif);
  font-style: italic;
  font-size: clamp(95px, 11.2vw, 207px);
  letter-spacing: -0.092em;
`;

export const RevealYours = styled.span`
  bottom: 0;
  right: 5%;
  color: rgba(174, 153, 120, 0.52);
  font-size: clamp(102px, 12.7vw, 237px);
  font-weight: 300;
  letter-spacing: -0.1em;
`;

export const RevealRule = styled.div`
  position: absolute;
  width: 68px;
  height: 1px;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(77, 103, 77, 0.5);
`;

export const RevealSideNote = styled.span`
  position: absolute;
  z-index: 4;
  right: clamp(24px, 7vw, 140px);
  bottom: 5%;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.16em;
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
  inset: auto 0 112px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  overflow: hidden;
  pointer-events: none;
  opacity: .38;
  color: #294734;

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
    top: auto;
    bottom: 90px;
    height: auto;
    opacity: .28;
  }
`;
