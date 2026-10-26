import styled, { keyframes } from "styled-components";

/*
 * Footer.styles.ts
 * [연결 디자인]
 * Safety의 포레스트 그린에서 아이보리로 부드럽게 돌아오는 밝은 Footer.
 * 연락처/지도 기능은 모두 보존한다.
 * [레이아웃]
 * PC: 좌측 정보 / 우측 대형 지도 2열
 * 모바일: 정보 / 지도를 세로로 1열
 */
const FOREST = "#f7f4ea";
const CREAM = "#244535";
const MUTED = "#647969";
const HAIRLINE = "rgba(36,69,53,.18)";

const mapFade = keyframes`
  from { opacity: 0; transform: translateY(9px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const FooterWrapper = styled.footer`
  position: relative;
  isolation: isolate;
  z-index: 1;
  width: 100%;

  background-color: #f7f4ea;

  background-image: linear-gradient(
    to bottom,
    #1b3528 0px,
    #1b3528 80px,
    #244535 160px,
    #45684d 260px,
    #87a188 390px,
    #c8d7c4 510px,
    #f7f4ea 620px,
    #f7f4ea 100%
  );

  color: ${CREAM};
  padding: 620px 0 0;
  font-family: inherit;
  overflow: clip;

  &::before {
    content: "";
    position: absolute;
    inset: 0 0 auto;
    z-index: 0;
    height: 620px;
    pointer-events: none;

    background: url("/images/ahns-editorial-mist.webp") center top / 1550px auto
      repeat-x;

    opacity: 0.2;

    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 20%,
      #000 50%,
      transparent 100%
    );

    mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 20%,
      #000 50%,
      transparent 100%
    );
  }

  @media (max-width: 768px) {
    background-image: linear-gradient(
      to bottom,
      #1b3528 0px,
      #1b3528 50px,
      #45684d 130px,
      #8fab90 220px,
      #d9e4d5 310px,
      #f7f4ea 380px,
      #f7f4ea 100%
    );

    padding-top: 380px;

    &::before {
      height: 380px;
    }
  }
`;
export const FooterInner = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, 1860px);
  margin: 0 auto;
  padding: 0 clamp(20px, 5.5vw, 105px);
`;
export const FooterTopLabel = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 27px;
  margin-bottom: clamp(45px, 5vw, 80px);
  border-bottom: 1px solid ${HAIRLINE};
  color: ${MUTED};
  font-size: 10px;
  letter-spacing: 0.22em;
  @media (max-width: 600px) {
    font-size: 9px;
    flex-wrap: wrap;
  }
`;
export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  align-items: start;
  gap: clamp(35px, 6vw, 110px);
  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
    gap: 70px;
  }
`;
export const InfoColumn = styled.div`
  min-width: 0;
`;
export const IntroSmall = styled.p`
  margin: 0 0 26px;
  color: #627b66;
  font-size: 10px;
  letter-spacing: 0.25em;
  font-weight: 500;
`;
export const IntroTitle = styled.h2`
  margin: 0;
  color: ${CREAM};
  font-family: var(--ahns-display, Georgia, serif);
  font-weight: 400;
  font-size: clamp(46px, 4.8vw, 79px);
  line-height: 0.95;
  letter-spacing: -0.078em;
  em {
    color: #6c8a70;
    font-weight: 400;
  }
  @media (max-width: 420px) {
    font-size: clamp(45px, 11vw, 63px);
  }
`;
export const IntroDescription = styled.p`
  margin: 34px 0 clamp(60px, 6.4vw, 90px);
  color: ${MUTED};
  font-size: clamp(12px, 1.1vw, 15px);
  line-height: 2.15;
  word-break: keep-all;
`;
export const ContactGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 43px;
`;
export const ContactLabel = styled.p`
  margin: 0 0 12px;
  color: #69826b;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.24em;
`;
export const PhoneAnchor = styled.a`
  display: inline-block;
  transition:
    color 0.35s ease,
    letter-spacing 0.5s ease;
  &:hover {
    letter-spacing: -0.035em;
  }
  color: ${CREAM};
  font-size: clamp(26px, 3vw, 52px);
  text-decoration: none;
  font-weight: 400;
  letter-spacing: -0.055em;
  line-height: 1.2;
  &:hover {
    color: #6c8870;
  }
`;
export const ContactPlaceholder = styled.span`
  font-size: 15px;
  color: ${MUTED};
`;
export const EmailAnchor = styled.a`
  color: ${MUTED};
  font-size: 13px;
  text-decoration: none;
  &:hover {
    color: ${CREAM};
  }
`;
export const ClinicTitle = styled.strong`
  font-size: 17px;
  font-weight: 500;
  letter-spacing: -0.03em;
`;
export const AddressText = styled.p`
  margin: 0;
  color: ${MUTED};
  line-height: 1.95;
  font-size: 13px;
  word-break: keep-all;
`;
export const SimpleTextLink = styled.a`
  transition:
    gap 0.35s ease,
    color 0.35s ease;
  &:hover {
    gap: 22px;
  }
  display: inline-flex;
  gap: 14px;
  margin-top: 6px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(36, 69, 53, 0.23);
  color: ${CREAM};
  text-decoration: none;
  font-size: 12px;
  &:hover {
    color: #3a5b40;
  }
`;
export const HoursGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 50px;
  padding-top: 28px;
  border-top: 1px solid ${HAIRLINE};
`;
export const HoursItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: ${MUTED};
  font-size: 12px;
  line-height: 1.75;
  strong {
    color: ${CREAM};
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
  }
`;

/* ------------ 오른쪽 대형 네이버/카카오 지도 ------------ */
export const MapSection = styled.div`
  width: 100%;
  min-width: 0;
`;
export const MapHeading = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 22px;
  @media (max-width: 580px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;
export const MicroLabel = styled.p`
  margin: 0 0 12px;
  font-size: 10px;
  color: #56765a;
  letter-spacing: 0.22em;
`;
export const MapTitle = styled.h3`
  margin: 0;
  font-family: var(--ahns-display, Georgia, serif);
  font-size: clamp(35px, 3.5vw, 61px);
  line-height: 1.05;
  font-weight: 400;
  letter-spacing: -0.065em;
  color: ${CREAM};
  em {
    font-weight: 400;
    color: #5c795f;
  }
`;
export const MapTabs = styled.div`
  display: inline-flex;
  gap: 0;
  border-bottom: 1px solid rgba(36, 69, 53, 0.21);
`;
export const MapTab = styled.button<{ $selected: boolean }>`
  position: relative;
  background: transparent;
  color: ${({ $selected }) => ($selected ? "#244535" : "#728c75")};
  border: 0;
  padding: 13px 15px 14px;
  font-family: inherit;
  font-size: 11px;
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
  letter-spacing: 0.08em;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s ease;
  span {
    margin-left: 7px;
  }
  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 1px;
    background: ${CREAM};
    transform: scaleX(${({ $selected }) => ($selected ? 1 : 0)});
    transition: transform 0.3s ease;
  }
  &:hover {
    color: #244535;
  }
  &:focus-visible {
    outline: 2px solid ${CREAM};
    outline-offset: 4px;
  }
`;
export const MapFrame = styled.div`
  position: relative;
  outline: 1px solid rgba(36, 69, 53, 0.12);
  outline-offset: 9px;
  transition:
    outline-offset 0.65s ease,
    box-shadow 0.65s ease;
  &:hover {
    outline-offset: 4px;
    box-shadow: 0 25px 65px rgba(36, 69, 53, 0.16);
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
  isolation: isolate;
  width: 100%;
  height: clamp(480px, 47vw, 640px);
  background: #dde4dc;
  overflow: hidden;
  animation: ${mapFade} 0.65s ease both;
  @media (max-width: 1040px) {
    height: 530px;
  }
  @media (max-width: 580px) {
    height: 410px;
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
export const MapContent = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;
export const MapCanvas = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;
export const MapFallback = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 28px;
  background: radial-gradient(ellipse at 42% 45%, #e3eae0 0%, #bccdbb 100%);
  text-align: center;
  color: #2e4b38;
  .map-symbol {
    font-size: 48px;
    font-weight: 200;
  }
  strong {
    font-size: 17px;
    font-weight: 500;
  }
  p {
    font-size: 12px;
    line-height: 1.9;
    margin: 0;
    max-width: 350px;
  }
`;
export const MapCornerMark = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 3;
  pointer-events: none;
  padding: 9px 12px;
  background: rgba(255, 255, 255, 0.93);
  color: #355340;
  font-size: 9px;
  letter-spacing: 0.18em;
  box-shadow: 0 6px 22px rgba(30, 60, 40, 0.1);
`;
export const MapBottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  padding-top: 20px;
  > div {
    display: flex;
    flex-direction: column;
    gap: 7px;
    min-width: 0;
  }
  strong {
    color: ${CREAM};
    font-size: 13px;
    font-weight: 500;
  }
  > div span {
    color: ${MUTED};
    font-size: 12px;
    line-height: 1.7;
    overflow-wrap: anywhere;
  }
`;
export const OutlineLink = styled.a`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 20px;
  padding: 12px 16px;
  border: 1px solid rgba(36, 69, 53, 0.35);
  color: ${CREAM};
  text-decoration: none;
  font-size: 11px;
  transition:
    background 0.25s ease,
    color 0.25s ease;
  &:hover {
    background: ${CREAM};
    color: #f7f4ea;
  }
  @media (max-width: 580px) {
    width: 100%;
    justify-content: space-between;
  }
`;

/* ------------ 맨 아래 사업장·패밀리 정보 ------------ */
export const FooterBottom = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 50px;
  margin-top: clamp(100px, 11vw, 180px);
  padding-top: 28px;
  border-top: 1px solid ${HAIRLINE};
  @media (max-width: 800px) {
    flex-direction: column;
    gap: 35px;
  }
`;
export const FooterLegal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  color: #708773;
  font-size: 11px;
  line-height: 1.7;
  strong {
    color: ${CREAM};
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 7px;
  }
`;
export const FamilyArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
`;
export const FamilyList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
export const FamilyLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 10px 13px;
  color: ${MUTED};
  border: 1px solid ${HAIRLINE};
  text-decoration: none;
  font-size: 11px;
  &:hover {
    color: ${CREAM};
    border-color: rgba(36, 69, 53, 0.55);
  }
`;
export const BottomWordmark = styled.div`
  font-family: inherit;
  font-size: clamp(140px, 26.5vw, 485px);
  font-weight: 400;
  line-height: 0.65;
  letter-spacing: -0.13em;
  margin: clamp(75px, 9vw, 140px) 0 -8px -0.035em;
  color: rgba(48, 79, 52, 0.075);
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
  @media (max-width: 580px) {
    font-size: 31vw;
    margin-bottom: -4px;
  }
`;
/**
 * Floating Quick Menu — Footer 밖(형제)에 렌더링해 FooterWrapper overflow:clip의
 * 영향 없이 모든 페이지에서 viewport 우측 하단에 고정된다.
 * 아래 스타일만 신규/교체하며 Footer 본문 스타일은 건드리지 않는다.
 */
export const FloatingActions = styled.div<{ $isSafety: boolean }>`
  position: fixed;
  right: clamp(12px, 2vw, 28px);
  bottom: calc(clamp(16px, 3vw, 36px) + env(safe-area-inset-bottom, 0px));
  z-index: 9000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 9px;
  color: ${({ $isSafety }) => ($isSafety ? "#F7F6F1" : "#244535")};
  transition: color 0.35s ease;
`;

const liquidGlassButton = `
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  min-width: 46px;
  height: 46px;
  padding: 0;
  gap: 8px;

  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;

  /* 기본 상태: AccountDropdown Hover 느낌의 Liquid Glass */
  background: rgba(255, 255, 255, 0.16);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  backdrop-filter: blur(14px) saturate(160%);

  box-shadow:
    0 4px 20px rgba(36, 69, 53, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    inset 0 -1px 0 rgba(255, 255, 255, 0.12);

  color: inherit;
  font: inherit;
  font-size: 20px;
  text-decoration: none;
  white-space: nowrap;
  text-shadow: none;
  cursor: pointer;

  transition:
    width 0.38s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    backdrop-filter 0.3s ease;

  /* Hover 상태는 💬, TOP, 펼쳐진 퀵 링크에 공통 적용 */
  &:hover,
  &[aria-expanded="true"] {
    transform: translateY(-2px);

    background: rgba(197, 224, 199, 0.55);
    border-color: rgba(102, 145, 109, 0.65);

    -webkit-backdrop-filter: blur(20px) saturate(180%);
    backdrop-filter: blur(20px) saturate(180%);

    box-shadow:
      0 10px 28px rgba(36, 69, 53, 0.16),
      0 0 0 3px rgba(122, 168, 128, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.75),
      inset 0 -1px 0 rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: translateY(0);
    background: rgba(176, 211, 180, 0.65);
  }

  &:focus-visible {
    outline: 2px solid #69826b;
    outline-offset: 3px;
  }

  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    background: #edf4eb;
    &:hover,
    &[aria-expanded="true"] {
      background: #d6e8d5;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
    &:hover,
    &[aria-expanded="true"] {
      transform: none;
    }
  }
`;

/** Anchor for the trigger and upward-expanding circular quick links. */
export const QuickMessageRoot = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

/** Main chat emoji toggle: matches the existing liquid glass treatment. */
export const FloatMessage = styled.button`
  ${liquidGlassButton}
  position: relative;
  z-index: 2;
  font-family:
    "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
  font-size: 21px;
  line-height: 1;
`;

/** No panel. Links are individual bubbles positioned above the chat icon. */
export const QuickMenuList = styled.div<{ $open: boolean }>`
  position: absolute;
  right: 0;
  bottom: calc(100% + 12px);
  z-index: 1;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  gap: 10px;
  width: max-content;
  max-width: calc(100vw - 25px);
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
`;

/**
 * 이름은 별도 툴팁이 아니라 같은 링크 버튼의 왼쪽 영역.
 * max-width 애니메이션으로 오른쪽 아이콘은 고정하고 버튼만 왼쪽으로 확장.
 */
export const QuickMenuLabel = styled.span`
  display: block;
  flex: 0 1 auto;
  min-width: 0;
  max-width: 0;
  overflow: hidden;
  opacity: 0;
  padding-left: 0;
  color: inherit;
  font-family: inherit;
  font-size: 12px;
  font-weight: 550;
  letter-spacing: -0.02em;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-shadow: none;
  transform: translateX(7px);
  transition:
    max-width 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    padding-left 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s ease,
    transform 0.32s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/** 아이콘은 오른쪽 끝 46px을 유지하므로 이름이 열려도 위치가 바뀌지 않는다. */
export const QuickMenuIcon = styled.span`
  display: inline-flex;
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

/** The first configured item appears immediately above 💬, then the next ones climb upward. */
export const QuickMenuEntry = styled.div<{
  $open: boolean;
  $index: number;
  $total: number;
}>`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-end;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transform: translateY(${({ $open }) => ($open ? "0px" : "18px")})
    scale(${({ $open }) => ($open ? 1 : 0.84)});
  transform-origin: center bottom;
  transition:
    opacity 0.26s ease,
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    visibility 0.26s ease;
  transition-delay: ${({ $open, $index, $total }) =>
    $open ? `${$index * 68}ms` : `${($total - $index - 1) * 35}ms`};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/**
 * 원형에서 Hover/키보드 포커스 시 자신의 너비가 왼쪽으로 늘어나는 링크 버튼.
 * 독립적인 말풍선이 아닌 하나의 Liquid Glass pill이다.
 */
export const QuickMenuLink = styled.a`
  ${liquidGlassButton}
  width: max-content;
  min-width: 46px;
  max-width: calc(100vw - 24px);
  height: 46px;
  padding: 0;
  box-sizing: border-box;
  border-radius: 999px;
  justify-content: flex-end;
  overflow: hidden;
  font-family: inherit;
  font-size: 18px;
  text-decoration: none;
  white-space: nowrap;
  gap: 0;

  &:hover ${QuickMenuLabel}, &:focus-visible ${QuickMenuLabel} {
    max-width: min(220px, calc(100vw - 90px));
    padding-left: 15px;
    padding-right: 12px;
    opacity: 1;
    transform: translateX(0);
  }

  /* 터치 기기에는 Hover가 없으므로 메뉴를 열었을 때 이름도 표시 */
  @media (hover: none) {
    ${QuickMenuLabel} {
      max-width: min(220px, calc(100vw - 90px));
      padding-left: 15px;
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

/** TOP is gently lifted into view only once the page has been scrolled. */
export const TopReveal = styled.div<{ $visible: boolean }>`
  width: 46px;
  height: ${({ $visible }) => ($visible ? "46px" : "0px")};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? "0px" : "22px")});
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transition:
    height 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.27s ease,
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    visibility 0.42s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const FloatTop = styled.button<{ $isSafety: boolean }>`
  ${liquidGlassButton}
  font-family: inherit;
  font-size: 21px;
  font-weight: 400;
  color: ${({ $isSafety }) => ($isSafety ? "#F7F6F1" : "#244535")};
`;
