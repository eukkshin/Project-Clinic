import styled, { keyframes } from "styled-components";

/*
 * SafetySlider.styles.ts — Safety Archive 디자인
 *
 * 이전 섹션들의 밝은 세이지 그린과 달리, 깊이 있는 포레스트 그린을 사용한다.
 * 직전 VlogSlider의 마지막 배경색(#91AC97)과 정확히 맞춰서
 * 진한 포레스트 그린으로 서서히 이어지게 만든다.
 *
 * 서체는 모두 font-family: inherit을 사용하여 홈페이지 공통 글꼴을 물려받는다.
 */

const FOREST = "#17352B";
const FOREST_DARK = "#0F281F";
const CREAM = "#F6F5ED";
const SOFT = "#B9CBB9";
const LINE = "rgba(229, 239, 226, 0.20)";

// 대표 사진이 바뀔 때 약하게 등장하도록 하는 CSS 애니메이션.
const stageReveal = keyframes`
  from { opacity: 0.45; transform: scale(1.025); }
  to { opacity: 1; transform: scale(1); }
`;

export const Section = styled.section`
  position: relative;
  isolation: isolate;
  width: 100%;
  color: ${CREAM};
  /*
   * [단일 배경 연결]
   * VlogSafetyFlow 부모가 Safety 시작 위치부터 #17352B를 그린다.
   * 별도의 배경이나 ::before를 만들지 않아 경계선이 생기지 않는다.
   * 여기의 isolation:isolate는 내부 이미지 합성용이며 sticky를 방해하지 않는다.
   */
  background: transparent;
  padding: clamp(145px, 15vw, 215px) 0 38px;

  /*
   * 중요: position: sticky가 들어 있는 Section에 overflow:hidden을 주지 않는다.
   * 스크롤 부모가 바뀌면 sticky가 작동하지 않을 수 있기 때문이다.
   */
  @media (max-width: 900px) {
    padding-top: 130px;
  }
`;

export const Inner = styled.div`
  position: relative;
  max-width: 1740px;
  margin: 0 auto;
  padding: 0 clamp(20px, 6vw, 108px);
`;

export const Header = styled.div`
  position: relative;
  margin: 0 0 clamp(70px, 8vw, 125px);
  max-width: 1130px;
`;

export const Kicker = styled.p`
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0 0 34px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.26em;
  color: #c7d6c7;

  span {
    width: 27px;
    height: 1px;
    background: currentColor;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-family: inherit;
  font-size: clamp(72px, 10vw, 176px);
  font-weight: 400;
  line-height: 0.91;
  letter-spacing: -0.09em;
  color: ${CREAM};

  em {
    display: inline-block;
    font-weight: 400;
    color: #b3c8b6;
  }

  @media (max-width: 760px) {
    font-size: clamp(56px, 12vw, 95px);
  }
`;

export const HeaderBottom = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-top: 42px;

  @media (max-width: 680px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const HeaderDescription = styled.p`
  margin: 0;
  color: #c4d2c4;
  font-size: clamp(12px, 1.05vw, 14px);
  font-weight: 400;
  line-height: 2.15;
  letter-spacing: -0.01em;
  word-break: keep-all;
`;

export const HeaderCounter = styled.span`
  font-size: 10px;
  letter-spacing: 0.18em;
  color: #98b29e;
  white-space: nowrap;
`;

export const Status = styled.div`
  padding: 70px 0 90px;
  color: ${SOFT};
  font-size: 13px;
  letter-spacing: 0.04em;
  line-height: 2.1;
`;

export const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
  padding: 10px 0;
  color: ${CREAM};
  background: none;
  border: 0;
  border-bottom: 1px solid ${LINE};
  font: inherit;
  font-size: 12px;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #e8f1df;
    outline-offset: 4px;
  }
`;

/*
 * Layout 자체는 화면을 고정하지 않는다.
 * CSS sticky는 StageColumn 안의 StickyStage에만 사용한다.
 */
export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: clamp(50px, 7.3vw, 145px);
  align-items: start;

  @media (max-width: 900px) {
    display: block;
  }
`;

export const StageColumn = styled.div`
  align-self: stretch;
  min-width: 0;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const StickyStage = styled.div`
  /*
   * 스크롤이 올라올 때 상단 95px에 붙어 있는 효과.
   * GSAP pin과 달리 스크롤 길이를 추가하지 않아 점프 문제 가능성이 낮다.
   * 상위 요소 overflow:hidden이 있으면 sticky가 동작하지 않을 수 있다.
   */
  position: sticky;
  top: clamp(70px, 9vh, 105px);
  width: 100%;
`;

export const StageMedia = styled.div`
  position: relative;
  isolation: isolate;
  width: 100%;
  aspect-ratio: 4 / 4.4;
  max-height: min(74vh, 770px);
  min-height: 390px;
  overflow: hidden;
  background: #62836b;
`;

export const StagePicture = styled.div`
  position: absolute;
  z-index: -2;
  inset: 0;
  animation: ${stageReveal} 800ms cubic-bezier(0.2, 0.6, 0.2, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const StageShade = styled.div`
  position: absolute;
  z-index: -1;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(11, 32, 21, 0.32) 0%,
    transparent 36%,
    rgba(5, 22, 14, 0.08) 57%,
    rgba(5, 22, 14, 0.7) 100%
  );
`;

export const PhotoTop = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  left: 30px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: #ffffff;
  font-size: 9px;
  letter-spacing: 0.22em;
`;

export const PhotoBottom = styled.div`
  position: absolute;
  right: 32px;
  bottom: 33px;
  left: 32px;
`;

export const PhotoMicrocopy = styled.p`
  margin: 0 0 13px;
  font-size: 9px;
  letter-spacing: 0.2em;
  color: #e5ebdb;
`;

export const PhotoTitle = styled.h3`
  margin: 0;
  font-size: clamp(30px, 3vw, 52px);
  line-height: 1.18;
  font-weight: 400;
  letter-spacing: -0.055em;
  word-break: keep-all;
`;

export const PhotoFootnote = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding-top: 18px;
  color: #91a994;
  font-size: 9px;
  letter-spacing: 0.13em;
`;

export const ContentColumn = styled.div`
  min-width: 0;
  padding-top: 4px;
`;

export const ListLabel = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding-bottom: 25px;
  border-bottom: 1px solid ${LINE};
  font-size: 10px;
  letter-spacing: 0.13em;
  color: #afc4b0;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ListItem = styled.article`
  position: relative;
  border-bottom: 1px solid ${LINE};
  min-height: clamp(230px, 23vw, 370px);
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 900px) {
    min-height: 0;
    padding: 34px 0;
  }
`;

export const MobilePicture = styled.div`
  display: none;

  @media (max-width: 900px) {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 16 / 10;
    margin: 0 0 22px;
    background: #547b60;
    overflow: hidden;
  }
`;

export const ItemButton = styled.button<{ $active: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 26px;
  align-items: start;
  gap: clamp(17px, 2.3vw, 35px);
  padding: 30px 0;
  border: 0;
  background: transparent;
  color: ${CREAM};
  text-align: left;
  cursor: pointer;
  font: inherit;

  opacity: ${({ $active }) => ($active ? "1" : "0.66")};
  transition: opacity 350ms ease;

  &:hover,
  &:focus-visible {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid #d8e7d3;
    outline-offset: 7px;
  }

  @media (max-width: 900px) {
    opacity: 1;
    padding: 10px 0;
    grid-template-columns: 26px minmax(0, 1fr) 18px;
    gap: 15px;
    cursor: default;
  }
`;

export const ItemIndex = styled.span`
  padding-top: 7px;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #94b29b;
`;

export const ItemBody = styled.span`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;

  @media (max-width: 900px) {
    gap: 12px;
  }
`;

export const ItemTitle = styled.span`
  display: block;
  font-family: inherit;
  font-size: clamp(29px, 3.1vw, 53px);
  font-weight: 400;
  line-height: 1.12;
  letter-spacing: -0.065em;
  word-break: keep-all;

  @media (max-width: 900px) {
    font-size: clamp(25px, 6vw, 42px);
  }
`;

export const ItemDescription = styled.span`
  display: block;
  max-width: 420px;
  white-space: pre-line;
  font-size: clamp(12px, 1vw, 14px);
  font-weight: 400;
  line-height: 2;
  letter-spacing: -0.012em;
  word-break: keep-all;
  color: #b1c4b4;
`;

export const ItemArrow = styled.span`
  display: inline-block;
  font-size: 21px;
  color: #bed0b9;
  transition: transform 350ms ease;
  ${ItemButton}:hover & {
    transform: translate(3px, -3px);
  }

  @media (max-width: 900px) {
    visibility: hidden;
  }
`;

export const Endmark = styled.div`
  padding: 75px 0 120px;
  display: flex;
  align-items: center;
  gap: 17px;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: #91ab96;

  span {
    font-size: 20px;
  }

  @media (max-width: 900px) {
    padding: 55px 0 85px;
  }
`;

export const Footer = styled.footer`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  border-top: 1px solid ${LINE};
  padding: 26px 0 12px;
  color: #97b19b;
  font-size: 9px;
  letter-spacing: 0.19em;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
