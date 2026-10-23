import styled from "styled-components";

/**
 * 영상 섹션의 색상은 이전 CircularOverlay 섹션 마지막 색인 #F7F4EA부터 시작한다.
 * 무겁고 검은색으로 화면을 전부 덮지 않고, 사진 영역만 어둡게 해서 영화 같은 대비를 준다.
 */
const IVORY = "#F7F4EA";
const DARK = "#344638";
const SAGE = "#7F987F";

export const Section = styled.section`
  position: relative;
  width: 100%;
  padding: clamp(84px, 7.8vw, 120px) 0 clamp(56px, 6vw, 94px);
  color: ${DARK};
  /*
   * [하나로 이어지는 배경]
   * VlogSafetyFlow에서 Vlog · 전환 장면 · Safety를 한 번에 감싼다.
   * 모든 색 변화는 부모 요소의 단일 background로만 그린다.
   * 이곳에 별도 background를 넣으면 경계에 1px 선이 남을 수 있다.
   */
  background: transparent;

  /* pin이 있는 앞 섹션과 충돌할 수 있는 transform·filter는 Section에 적용하지 않는다. */
  @media (max-width: 768px) {
    padding: 82px 0 80px;
  }
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1760px;
  margin: 0 auto;
  padding: 0 clamp(20px, 5.8vw, 110px);
`;

export const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 36px;
  margin-bottom: clamp(26px, 3.5vw, 48px);

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 22px;
  }
`;

export const HeaderLeft = styled.div`
  max-width: 920px;
`;

export const Eyebrow = styled.p`
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 0 0 clamp(19px, 2vw, 28px);
  color: #718a73;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.19em;

  span {
    width: 24px;
    height: 1px;
    background: currentColor;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-family: var(--ahns-display, Georgia, serif);
  font-size: clamp(48px, 5.4vw, 86px);
  font-weight: 400;
  line-height: 1.04;
  letter-spacing: -0.072em;
  color: ${DARK};

  em {
    color: ${SAGE};
    font-weight: 400;
  }

  @media (max-width: 650px) {
    font-size: clamp(44px, 10.5vw, 70px);
  }
`;

export const Description = styled.p`
  margin: clamp(23px, 2.6vw, 34px) 0 0;
  color: #647a69;
  font-size: clamp(12px, 1vw, 14px);
  line-height: 2;
  letter-spacing: -0.015em;
  word-break: keep-all;
`;

export const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
  padding-bottom: 8px;
  min-width: 205px;
  @media (max-width: 760px) {
    align-items: flex-start;
    min-width: 0;
  }
`;

export const SectionCount = styled.span`
  font-size: 10px;
  letter-spacing: 0.16em;
  white-space: nowrap;
  color: #728875;
`;

export const HeaderRule = styled.span`
  width: 75px;
  height: 1px;
  background: #91a994;
`;

export const HeaderSignature = styled.span`
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.1em;
  color: #91a493;
`;

/**
 * 왼쪽 72% : 오른쪽 28%의 시네마 레이아웃.
 * 오른쪽 썸네일 목록은 자체 스크롤을 사용한다.
 * 섹션 전체는 pin 하지 않아 이전 Hero/CategoryNav/CircularOverlay와 자연스럽게 연결된다.
 */
export const CinemaLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(290px, .85fr);
  gap: clamp(24px, 3.1vw, 54px);
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 30px;
  }
`;

export const MainColumn = styled.div`
  min-width: 0;
`;

export const Stage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 320px;
  isolation: isolate;
  overflow: hidden;
  border-radius: 3px;
  background: #879c8a;

  /* Next/Image fill이 삽입하는 img를 배경으로 사용한다. */
  > img {
    z-index: -2;
    transition: transform 1000ms cubic-bezier(0.2, 0.7, 0.1, 1);
  }
  &:hover > img {
    transform: scale(1.025);
  }

  @media (max-width: 720px) {
    aspect-ratio: 4 / 4.2;
    min-height: 300px;
  }
`;

export const StageShade = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    180deg,
    rgba(18, 31, 22, 0.3) 0%,
    rgba(18, 31, 22, 0.07) 34%,
    rgba(13, 28, 18, 0.25) 58%,
    rgba(12, 28, 18, 0.75) 100%
  );
  pointer-events: none;
`;

export const StageTop = styled.div`
  position: absolute;
  top: clamp(20px, 2.7vw, 43px);
  left: clamp(20px, 2.7vw, 43px);
  right: clamp(20px, 2.7vw, 43px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.93);
`;

export const StageTopLabel = styled.span`
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.18em;
  @media (max-width: 480px) {
    font-size: 8px;
  }
`;

export const StageTopNumber = styled.span`
  font-size: 11px;
  letter-spacing: 0.17em;
  white-space: nowrap;
`;

export const PlayButton = styled.button`
  position: absolute;
  left: 50%;
  top: 48%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: clamp(76px, 8vw, 118px);
  height: clamp(76px, 8vw, 118px);
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  background: rgba(250, 250, 242, 0.13);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition:
    background 0.35s ease,
    box-shadow 0.35s ease,
    scale 0.35s ease;

  &:hover {
    background: rgba(250, 250, 242, 0.25);
    box-shadow: 0 0 0 9px rgba(255, 255, 255, 0.09);
    scale: 1.045;
  }
  &:focus-visible {
    outline: 3px solid #fff;
    outline-offset: 5px;
  }
  span {
    font-size: 9px;
    letter-spacing: 0.2em;
  }
  @media (max-width: 550px) {
    gap: 8px;
    span {
      font-size: 8px;
    }
  }
`;

export const PlayTriangle = styled.span`
  display: block;
  padding-left: 3px;
  font-size: 22px !important;
  letter-spacing: 0 !important;
  line-height: 1;
`;

export const StageBottom = styled.div`
  position: absolute;
  left: clamp(20px, 3.6vw, 58px);
  right: clamp(20px, 3.6vw, 58px);
  bottom: clamp(22px, 3.4vw, 55px);
  color: #fff;
`;

export const StageKicker = styled.p`
  margin: 0 0 12px;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.17em;
  color: rgba(255, 255, 255, 0.85);
`;

export const StageTitle = styled.h3`
  margin: 0 0 clamp(21px, 3vw, 46px);
  font-family: var(--ahns-display, Georgia, serif);
  font-weight: 400;
  font-size: clamp(28px, 3.1vw, 55px);
  line-height: 1.22;
  letter-spacing: -0.05em;
  overflow-wrap: anywhere;
  max-width: 770px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const StageBottomLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.32);
  padding-top: 15px;
  font-size: 9px;
  letter-spacing: 0.16em;
  color: rgba(255, 255, 255, 0.82);
  span {
    font-size: 17px;
  }
`;

export const StageFoot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding-top: 21px;
`;

export const FootHint = styled.span`
  color: #728873;
  font-size: 10px;
  letter-spacing: 0.13em;
  @media (max-width: 500px) {
    font-size: 8px;
  }
`;

export const FootNavigation = styled.div`
  display: flex;
  gap: 9px;
`;

export const ArrowButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #bdccbc;
  border-radius: 50%;
  background: transparent;
  color: #466249;
  font-size: 19px;
  cursor: pointer;
  transition:
    background 0.25s ease,
    color 0.25s ease;
  &:hover:not(:disabled) {
    background: #4f6d55;
    color: white;
  }
  &:focus-visible {
    outline: 2px solid #4f6d55;
    outline-offset: 3px;
  }
  &:disabled {
    cursor: default;
    opacity: 0.35;
  }
`;

/** 영상 목록은 스크롤 높이를 제한하되 기본 세로 스크롤을 그대로 사용한다. */
export const Playlist = styled.aside`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const PlaylistHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 0 21px;
  border-bottom: 1px solid #bccbbf;
`;

export const PlaylistTitle = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
`;

export const PlaylistCount = styled.span`
  font-size: 10px;
  color: #78907a;
  letter-spacing: 0.1em;
  white-space: nowrap;
`;

export const PlaylistItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: min(52vw, 650px);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: #b0c1b1 transparent;

  @media (max-width: 1100px) {
    max-height: 385px;
  }
  @media (max-width: 720px) {
    max-height: 350px;
  }
`;

export const PlaylistButton = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: clamp(11px, 1.3vw, 21px);
  width: 100%;
  padding: clamp(15px, 1.5vw, 22px) 3px;
  border: 0;
  border-bottom: 1px solid #cdd9cd;
  background: ${({ $selected }) =>
    $selected ? "rgba(154, 181, 155, .13)" : "transparent"};
  color: ${DARK};
  text-align: left;
  cursor: pointer;
  transition: background 0.25s ease;

  &:hover {
    background: rgba(154, 181, 155, 0.18);
  }
  &:focus-visible {
    outline: 2px solid #698d6d;
    outline-offset: -2px;
  }
`;

export const ListImage = styled.span`
  position: relative;
  width: clamp(77px, 8.1vw, 132px);
  min-width: clamp(77px, 8.1vw, 132px);
  aspect-ratio: 4 / 3;
  display: block;
  overflow: hidden;
  border-radius: 2px;
  background: #a6b7a8;

  img {
    transition: transform 0.6s ease;
  }
  ${PlaylistButton}:hover & img {
    transform: scale(1.08);
  }

  @media (max-width: 1100px) {
    width: clamp(82px, 16vw, 155px);
    min-width: clamp(82px, 16vw, 155px);
  }
`;

export const ListImageOverlay = styled.span`
  position: absolute;
  inset: 0;
  background: rgba(23, 43, 29, 0.09);
  pointer-events: none;
`;

export const ListDetail = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 9px;
  flex: 1;
`;

export const ListIndex = styled.span`
  color: #839987;
  font-size: 9px;
  letter-spacing: 0.12em;
`;

export const ListTitle = styled.span`
  font-family: inherit;
  color: ${DARK};
  font-size: clamp(12px, 1.12vw, 17px);
  font-weight: 500;
  letter-spacing: -0.028em;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ListFoot = styled.span`
  font-size: 8px;
  letter-spacing: 0.14em;
  color: #7e9581;
`;

export const ListArrow = styled.span`
  font-size: 18px;
  color: #78907c;
  align-self: flex-start;
  transition: transform 0.3s ease;
  ${PlaylistButton}:hover & {
    transform: translate(2px, -2px);
  }
`;

export const PlaylistFooter = styled.span`
  padding-top: 12px;
  font-size: 9px;
  letter-spacing: 0.11em;
  line-height: 1.9;
  color: #8aa08c;
`;

export const StatusPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 22px;
  min-height: clamp(330px, 44vw, 650px);
  border: 1px solid #d9e2d9;
  background: #e6ece3;
  color: #637b68;
  text-align: center;
  font-size: 12px;
  letter-spacing: 0.1em;
`;

export const RetryButton = styled.button`
  border: 1px solid #78937d;
  border-radius: 24px;
  background: transparent;
  color: #46684f;
  padding: 10px 18px;
  cursor: pointer;
  &:hover {
    background: #d4e0d3;
  }
`;

export const BottomLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: clamp(62px, 7.5vw, 116px);
  padding-top: 22px;
  border-top: 1px solid #c6d5c8;
  font-size: 10px;
  letter-spacing: 0.15em;
  color: #829986;
`;

/**
 * 영상 재생은 모달에서만 한다.
 * 유튜브 iframe 자체를 백그라운드에 미리 띄우지 않으므로 첫 페이지 로딩 부담을 줄인다.
 */
export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(12, 21, 13, 0.9);
  backdrop-filter: blur(11px);
`;

export const ModalPanel = styled.div`
  width: min(1130px, 100%);
  padding: clamp(14px, 2vw, 26px);
  background: #132016;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  gap: 10px;
`;

export const ModalLabel = styled.span`
  font-size: 10px;
  letter-spacing: 0.18em;
  color: #d7e5d9;
  @media (max-width: 450px) {
    font-size: 8px;
  }
`;

export const ModalClose = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  background: transparent;
  color: white;
  font-size: 16px;
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 4px;
  }
`;

export const IframeFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;

  iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;
    border: 0;
  }
`;

/* 동작 감소를 설정한 사용자는 GSAP 마운트 효과도 받지 않도록 TSX에서 제외한다. */
