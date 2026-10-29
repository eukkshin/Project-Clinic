import styled, { keyframes } from 'styled-components';

const C = {
  forest: "#1B3528",
  deep: "#11281D",
  ink: "#223D2D",
  cream: "#F7F5EE",
  warm: "#EDEAE1",
  muted: "#6A786D",
  sage: "#91A28C",
  gold: "#BE9D70",
};
const serif = '"Noto Serif KR", "Nanum Myeongjo", Georgia, serif';
const serifLatin = '"Cormorant Garamond", Georgia, serif';

export const Shell = styled.section`
  padding-top: clamp(74px, 8.5vw, 130px);
  padding-bottom: clamp(96px, 12vw, 170px);
  background: ${C.cream};
`;
export const Intro = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(250px, 370px);
  column-gap: clamp(36px, 7vw, 140px);
  align-items: end;
  padding-bottom: clamp(45px, 5vw, 78px);
  @media (max-width: 850px) {
    grid-template-columns: 1fr;
    gap: 23px;
  }
`;
export const Overline = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 10px;
  letter-spacing: 0.28em;
  font-weight: 500;
  text-transform: uppercase;
  color: #798979;
  &::before {
    content: "";
    height: 1px;
    width: 27px;
    background: ${C.gold};
  }
`;
export const Headline = styled.h1`
  margin: 24px 0 0;
  font-family: ${serif};
  font-weight: 400;
  line-height: 1.22;
  letter-spacing: -0.085em;
  font-size: clamp(53px, 7.1vw, 115px);
  color: ${C.forest};
  em {
    font-weight: 400;
    font-style: normal;
    color: #839487;
  }
  @media (max-width: 600px) {
    font-size: clamp(46px, 12vw, 74px);
  }
`;
export const IntroAside = styled.div`
  padding-bottom: 7px;
  p {
    font-size: clamp(14px, 1.25vw, 16px);
    line-height: 2.02;
    letter-spacing: -0.045em;
    color: #617365;
  }
  .edition {
    margin-top: 29px;
    font-family: ${serifLatin};
    font-size: 20px;
    letter-spacing: 0.12em;
    color: ${C.forest};
  }
`;
export const Composition = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.72fr) minmax(310px, 0.85fr);
  overflow: hidden;
  border: 1px solid rgba(26, 55, 38, 0.13);
  min-height: 700px;
  box-shadow: 0 28px 65px rgba(38, 58, 39, 0.065);
  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1.32fr) minmax(300px, 0.85fr);
  }
  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;
export const MapExperience = styled.div`
  position: relative;
  min-width: 0;
  min-height: 695px;
  display: flex;
  flex-direction: column;
  background: #ecebe1;
  color: ${C.forest};
  isolation: isolate;
  @media (max-width: 850px) {
    min-height: 620px;
  }
  @media (max-width: 600px) {
    min-height: 480px;
  }
`;
export const MapTopbar = styled.div`
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 29px clamp(19px, 3vw, 47px);
  pointer-events: none;
  span {
    font:
      500 9px/1.5 Arial,
      sans-serif;
    letter-spacing: 0.25em;
    white-space: nowrap;
    color: #4c6250;
  }
  i {
    display: inline-block;
    width: 5px;
    height: 5px;
    margin-left: 8px;
    border-radius: 50%;
    background: #729579;
    vertical-align: middle;
    box-shadow: 0 0 0 4px rgba(114, 149, 121, 0.14);
  }
  @media (max-width: 600px) {
    padding: 19px;
    span {
      font-size: 8px;
      letter-spacing: 0.13em;
    }
  }
`;
export const MapArtwork = styled.div`
  flex: 1;
  position: relative;
  min-height: 520px;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      rgba(246, 245, 236, 0.2),
      transparent 20%,
      transparent 85%,
      rgba(247, 245, 236, 0.05)
    );
  }
  @media (max-width: 850px) {
    min-height: 430px;
  }
  @media (max-width: 600px) {
    min-height: 340px;
  }
`;
const routeAppear = keyframes`from{stroke-dashoffset:1;} to{stroke-dashoffset:0;}`;
export const CitySvg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  .selectedRoute {
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
    animation: ${routeAppear} 1.5s cubic-bezier(0.2, 1, 0.4, 1) both;
  }
  .selectedRouteEdge {
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
    animation: ${routeAppear} 1.7s cubic-bezier(0.2, 1, 0.4, 1) both;
  }
  @media (prefers-reduced-motion: reduce) {
    .selectedRoute,
    .selectedRouteEdge {
      animation: none;
    }
  }
`;
export const StationButton = styled.button<{ $active: boolean }>`
  position: absolute;
  z-index: 3;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  border: 0;
  padding: 7px;
  background: transparent;
  cursor: pointer;
  color: ${C.forest};
  .stationDot {
    position: relative;
    display: block;
    flex: none;
    width: 20px;
    height: 20px;
    border: 5px solid white;
    border-radius: 100%;
    background: var(--station-color);
    box-shadow:
      0 1px 0 2px var(--station-color),
      0 5px 18px rgba(20, 48, 31, 0.2);
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease;
    transform: scale(${({ $active }) => ($active ? 1.15 : 1)});
  }
  .stationDot::after {
    content: "";
    position: absolute;
    inset: -14px;
    border: 1px solid var(--station-color);
    border-radius: 50%;
    opacity: ${({ $active }) => ($active ? ".42" : "0")};
    transform: scale(${({ $active }) => ($active ? "1" : "0.6")});
    transition: 0.35s ease;
  }
  .stationLabel {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 70px;
    padding: 6px 9px;
    border-radius: 2px;
    background: rgba(250, 249, 244, 0.85);
    box-shadow: 0 3px 20px rgba(50, 65, 48, 0.07);
    backdrop-filter: blur(7px);
    transition:
      background 0.25s,
      color 0.25s,
      transform 0.25s;
  }
  b {
    font-size: 12px;
    font-weight: 650;
    white-space: nowrap;
  }
  small {
    font-size: 9px;
    letter-spacing: 0.025em;
    color: #718171;
    white-space: nowrap;
  }
  &:hover .stationDot,
  &:focus-visible .stationDot {
    transform: scale(1.3);
  }
  &:hover .stationLabel,
  &:focus-visible .stationLabel {
    background: #fff;
    transform: translateY(-2px);
  }
  ${({ $active }) =>
    $active &&
    `.stationLabel{background:${C.forest};color:#FCF9EF;}small{color:#CDD7C9;}`}
  @media(max-width:600px) {
    .stationLabel {
      min-width: 55px;
      padding: 4px 5px;
    }
    b {
      font-size: 10px;
    }
    small {
      font-size: 8px;
    }
    .stationDot {
      width: 14px;
      height: 14px;
      border-width: 3px;
    }
  }
`;
export const MapCoordinates = styled.div`
  position: absolute;
  right: 33px;
  bottom: 22px;
  text-align: right;
  font-size: 9px;
  letter-spacing: 0.2em;
  line-height: 1.9;
  color: #697967;
  pointer-events: none;
`;
export const MapBottom = styled.div`
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 26px;
  border-top: 1px solid rgba(40, 63, 40, 0.08);
  background: rgba(247, 246, 238, 0.65);
  @media (max-width: 600px) {
    padding: 11px 15px;
    flex-wrap: wrap;
  }
`;
export const MapLegend = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 10px;
  letter-spacing: -0.04em;
  color: #526656;
  i {
    width: 22px;
    height: 2px;
    background: ${C.gold};
  }
`;
export const MapDisclaimer = styled.span`
  font-size: 10px;
  letter-spacing: -0.03em;
  color: #8a968a;
`;
export const StationPanel = styled.div`
  position: absolute;
  z-index: 4;
  left: clamp(17px, 3vw, 42px);
  bottom: 100px;
  width: min(460px, calc(100% - 50px));
  padding: 23px 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border: 1px solid rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 252, 0.94);
  box-shadow: 0 16px 45px rgba(34, 57, 38, 0.11);
  backdrop-filter: blur(16px);
  .stationName {
    flex: 1;
    min-width: 0;
  }
  .stationName > span,
  .travelGroup span {
    font:
      500 9px Arial,
      sans-serif;
    letter-spacing: 0.18em;
    color: #889587;
  }
  .stationName strong {
    display: block;
    margin: 9px 0 7px;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.06em;
  }
  .stationName strong small {
    font-size: 11px;
    color: #738676;
    font-weight: 400;
    letter-spacing: 0;
  }
  .stationName p {
    font-size: 11px;
    color: #6d7b6c;
    line-height: 1.6;
  }
  .travelGroup {
    flex: none;
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 18px;
    border-left: 1px solid rgba(27, 53, 40, 0.13);
    padding-left: 23px;
  }
  .travelGroup strong {
    display: block;
    margin-top: 10px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
  }
  @media (max-width: 1050px) {
    width: min(360px, calc(100% - 32px));
    padding: 18px;
    display: block;
    .travelGroup {
      margin-top: 15px;
      padding: 14px 0 0;
      border-left: 0;
      border-top: 1px solid rgba(27, 53, 40, 0.13);
      justify-content: start;
    }
  }
  @media (max-width: 850px) {
    bottom: 90px;
  }
  @media (max-width: 600px) {
    position: static;
    width: auto;
    margin: 0 14px 14px;
    padding: 17px 18px;
    box-shadow: 0 8px 22px rgba(34, 57, 38, 0.05);
    .stationName strong {
      font-size: 18px;
    }
  }
`;
export const StationSelector = styled.div`
  display: none;
  @media (max-width: 600px) {
    display: flex;
    gap: 8px;
    overflow: auto;
    scrollbar-width: none;
    padding: 0 14px 16px;
    button {
      flex: none;
      border: 1px solid #bcc6b7;
      border-radius: 40px;
      background: transparent;
      color: #435946;
      padding: 8px 12px;
      font-size: 11px;
      cursor: pointer;
    }
    button[aria-pressed="true"] {
      background: ${C.forest};
      border-color: ${C.forest};
      color: #f7f5ee;
    }
    i {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 5px;
    }
    span {
      opacity: 0.7;
      margin-left: 2px;
    }
  }
`;
export const DetailPanel = styled.aside`
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: clamp(32px, 4.5vw, 73px) clamp(27px, 3.2vw, 57px);
  background: #fbfaf6;
  .sideCaption {
    font-size: 10px;
    letter-spacing: 0.24em;
    color: #8a9c88;
  }
  .rule {
    width: 28px;
    height: 1px;
    background: ${C.gold};
    margin: 22px 0 30px;
  }
  .clinicName {
    font-family: ${serif};
    font-size: clamp(25px, 2.2vw, 39px);
    font-weight: 400;
    letter-spacing: -0.05em;
    line-height: 1.55;
    color: ${C.forest};
  }
  .address {
    font-size: 14px;
    line-height: 1.9;
    color: #657567;
    letter-spacing: -0.045em;
    margin-top: 16px;
  }
  .line {
    height: 1px;
    background: rgba(30, 58, 41, 0.13);
    margin: 33px 0;
  }
  .label {
    font-size: 9px;
    letter-spacing: 0.19em;
    color: #899889;
  }
  .infoRow {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 18px;
    align-items: start;
    margin: 19px 0;
  }
  .infoRow strong {
    font-size: 13px;
    font-weight: 500;
    line-height: 1.7;
    letter-spacing: -0.03em;
  }
  .guide {
    margin-top: auto;
  }
  .guide h3 {
    font-family: ${serif};
    font-size: 20px;
    font-weight: 400;
    letter-spacing: -0.05em;
  }
  .guide p {
    margin-top: 12px;
    line-height: 1.9;
    font-size: 12px;
    color: #768578;
  }
  @media (max-width: 850px) {
    padding: 35px 30px;
    .guide {
      margin-top: 18px;
    }
  }
`;
export const MapLink = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 52px;
  padding: 13px 20px;
  margin-top: 22px;
  background: ${C.forest};
  border: 1px solid ${C.forest};
  color: #f9f8f1;
  font-size: 12px;
  letter-spacing: 0.05em;
  transition:
    background 0.3s,
    transform 0.3s;
  span {
    font-size: 19px;
    transition: transform 0.3s;
  }
  &:hover {
    background: #325640;
    transform: translateY(-2px);
    span {
      transform: translate(3px, -3px);
    }
  }
  &.subtle {
    background: transparent;
    color: ${C.forest};
    margin-top: 8px;
    border-color: rgba(27, 53, 40, 0.2);
  }
  &.subtle:hover {
    background: #ecefe6;
  }
`;
export const Endnote = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
  padding: 65px 0 0;
  .smallLabel {
    font-size: 10px;
    letter-spacing: 0.23em;
    color: #819582;
  }
  h2 {
    font-family: ${serif};
    font-weight: 400;
    font-size: clamp(24px, 3vw, 39px);
    letter-spacing: -0.07em;
    margin-top: 21px;
  }
  p {
    max-width: 460px;
    color: #718071;
    line-height: 1.95;
    font-size: 13px;
  }
  @media (max-width: 700px) {
    padding-top: 45px;
    gap: 19px;
  }
`;
export const RealMapDetails = styled.details`
  background: #e9eadf;
  border-top: 1px solid rgba(27, 53, 40, 0.12);
  summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 24px 0;
    font-size: 13px;
    letter-spacing: 0.02em;
    color: ${C.forest};
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary span {
    color: #69806d;
    font-size: 22px;
    transition: transform 0.3s;
  }
  &[open] summary span {
    transform: rotate(45deg);
  }
  .liveMap {
    min-height: 350px;
    padding-bottom: 45px;
  }
  @media (max-width: 600px) {
    summary {
      font-size: 12px;
    }
  }
`;
const subtleMove = keyframes`0%,100%{transform:scale(1);opacity:.33}50%{transform:scale(1.1);opacity:.16}`;
export const BrandSeal = styled.span`
  font-family: ${serifLatin};
  font-size: 21px;
  letter-spacing: 0.13em;
  color: ${C.forest};
  &::before {
    content: "✧";
    display: inline-block;
    color: ${C.gold};
    margin-right: 7px;
    animation: ${subtleMove} 5s ease infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`;
