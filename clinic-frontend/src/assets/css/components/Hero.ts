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

// EmblaViewport는 '현재 화면에 보여줄 슬라이드 영역'이다.
export const EmblaViewport = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
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
 * Hero의 스크롤 프레임.
 * 처음에는 이미지가 화면 전체를 채운다 (clip-path를 자르지 않음).
 * GSAP이 스크롤 진행률에 맞게 clip-path를 바꾸어 사진 주변에 여백을 만든다.
 * 아치는 쓰지 않고 작은 모서리 곡률을 가진 고급스러운 사진 프레임으로 변한다.
 */
export const VisualFrame = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;

  /* 0%: 초기 로딩 직후 이미지가 화면 가장자리까지 가득 보인다. */
  clip-path: inset(0% 0% 0% 0% round 0px);

  @media (max-width: 768px) {
    /* 모바일은 짧은 터치 스크롤에서 화면이 고정되는 불편함을 줄이기 위해
       프레임 축소를 하지 않고 풀스크린 배너 그대로 사용한다. */
    clip-path: inset(0% 0% 0% 0% round 0px);
  }
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

// 첫 화면은 이미지가 화면을 채우므로 글자가 묻히지 않게 왼쪽만 어둡게 만든다.
// 이 그라데이션은 사진 프레임 안에 들어 있어 스크롤할 때 같이 축소된다.
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

/* ──────────────────────────────────────────────────────────────────
 * 스크롤 후에만 나타나는 Editorial Reveal 화면
 * 첫 화면은 무조건 사진이 꽉 찬 상태로 시작한다.
 * 이미지를 줄일 때만 뒤의 세이지 그린 배경과 문구가 드러나도록 만든다.
 * ────────────────────────────────────────────────────────────────── */

export const RevealCopy = styled.div`
  position: absolute;
  z-index: 4;
  top: 49%;
  left: clamp(28px, 7vw, 140px);
  transform: translateY(-50%);
  width: min(33vw, 550px);
  color: ${DARK_TEXT};
  opacity: 0;
  visibility: hidden;
  pointer-events: none; /* 위에 올라와도 Embla 클릭/드래그를 막지 않는다. */

  @media (max-width: 768px) {
    display: none; /* 모바일은 풀스크린 배너만 사용한다. */
  }
`;

export const RevealEyebrow = styled.p`
  margin: 0 0 28px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.26em;
  color: #526a55;
`;

export const RevealTitle = styled.h2`
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 400;
  font-size: clamp(43px, 4.5vw, 84px);
  line-height: 1.12;
  letter-spacing: -0.065em;
`;

export const RevealDescription = styled.p`
  margin: 32px 0 0;
  font-size: clamp(14px, 1.1vw, 18px);
  line-height: 1.9;
  color: #485c4a;
`;

export const RevealRule = styled.div`
  width: 44px;
  height: 1px;
  margin-top: 38px;
  background: rgba(52, 70, 56, 0.65);
`;

export const RevealTagline = styled.p`
  margin: 16px 0 0;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: #536b56;
`;

export const RevealSideNote = styled.span`
  position: absolute;
  z-index: 4;
  right: 8%;
  bottom: 5.5%;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: ${DARK_TEXT};
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
