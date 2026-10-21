import styled, { keyframes } from "styled-components";

/*
 * Footer.styles.ts
 * [연결 디자인]
 * Safety Archive 마지막 배경(#17352B)과 푸터 시작 색을 동일하게 만든다.
 * 별도의 상단 border나 가상 그라데이션을 두지 않아 얇은 경계선을 방지한다.
 * [레이아웃]
 * PC: 좌측 정보 / 우측 대형 지도 2열
 * 모바일: 정보 / 지도를 세로로 1열
 */
const FOREST = "#17352B";
const CREAM = "#F6F5ED";
const MUTED = "#B9CCBC";
const HAIRLINE = "rgba(231, 241, 227, 0.17)";

const mapFade = keyframes`
  from { opacity: 0; transform: translateY(9px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const FooterWrapper = styled.footer`
  position: relative;
  isolation: isolate;
  z-index: 1;
  width: 100%;
  background: ${FOREST};
  color: ${CREAM};
  padding: clamp(88px, 10vw, 160px) 0 0;
  font-family: inherit;
  /* CSS grid 지도 내부가 뷰포트 밖으로 나가지 않게 한다. */
  overflow: clip;
`;
export const FooterInner = styled.div`
  width: min(100%, 1860px);
  margin: 0 auto;
  padding: 0 clamp(20px, 5.5vw, 105px);
`;
export const FooterTopLabel = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 27px;
  margin-bottom: clamp(65px, 7vw, 110px);
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
  color: #b5cdba;
  font-size: 10px;
  letter-spacing: 0.25em;
  font-weight: 500;
`;
export const IntroTitle = styled.h2`
  margin: 0;
  color: ${CREAM};
  font-family: inherit;
  font-weight: 400;
  font-size: clamp(53px, 5.6vw, 104px);
  line-height: 0.95;
  letter-spacing: -0.078em;
  em {
    color: #afcaaf;
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
  color: #a0b6a3;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.24em;
`;
export const PhoneAnchor = styled.a`
  color: ${CREAM};
  font-size: clamp(26px, 3vw, 52px);
  text-decoration: none;
  font-weight: 400;
  letter-spacing: -0.055em;
  line-height: 1.2;
  &:hover {
    color: #c9dfcb;
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
  display: inline-flex;
  gap: 14px;
  margin-top: 6px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(242, 248, 238, 0.5);
  color: ${CREAM};
  text-decoration: none;
  font-size: 12px;
  &:hover {
    color: #b9d1bc;
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
  color: #abc1ae;
  letter-spacing: 0.22em;
`;
export const MapTitle = styled.h3`
  margin: 0;
  font-size: clamp(35px, 3.5vw, 61px);
  line-height: 1.05;
  font-weight: 400;
  letter-spacing: -0.065em;
  color: ${CREAM};
  em {
    font-weight: 400;
    color: #abc6ad;
  }
`;
export const MapTabs = styled.div`
  display: inline-flex;
  gap: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
`;
export const MapTab = styled.button<{ $selected: boolean }>`
  position: relative;
  background: transparent;
  color: ${({ $selected }) => ($selected ? "#F6F5ED" : "#96AE9D")};
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
    color: #fff;
  }
  &:focus-visible {
    outline: 2px solid ${CREAM};
    outline-offset: 4px;
  }
`;
export const MapFrame = styled.div`
  position: relative;
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
  border: 1px solid rgba(245, 249, 243, 0.35);
  color: ${CREAM};
  text-decoration: none;
  font-size: 11px;
  transition:
    background 0.25s ease,
    color 0.25s ease;
  &:hover {
    background: ${CREAM};
    color: ${FOREST};
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
  color: #9eb4a3;
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
    border-color: rgba(255, 255, 255, 0.55);
  }
`;
export const BottomWordmark = styled.div`
  font-family: inherit;
  font-size: clamp(140px, 26.5vw, 485px);
  font-weight: 400;
  line-height: 0.65;
  letter-spacing: -0.13em;
  margin: clamp(75px, 9vw, 140px) 0 -8px -0.035em;
  color: rgba(218, 234, 216, 0.105);
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
  @media (max-width: 580px) {
    font-size: 31vw;
    margin-bottom: -4px;
  }
`;
export const FloatingActions = styled.div`
  position: fixed;
  right: clamp(12px, 2vw, 28px);
  bottom: clamp(16px, 3vw, 36px);
  z-index: 9000;
  display: flex;
  flex-direction: column;
  gap: 9px;
`;
const floatBase = `
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-family: inherit;
  font-size: 20px;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,.12);
  transition: transform .2s ease;
  &:hover { transform: translateY(-3px); }
`;
export const FloatPhone = styled.a`
  ${floatBase}
  border: 1px solid rgba(255,255,255,.5);
  background: #dce9d7;
  color: #2b4934;
`;
export const FloatTop = styled.button`
  ${floatBase}
  border: 1px solid rgba(255,255,255,.5);
  background: #294937;
  color: ${CREAM};
`;
