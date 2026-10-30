import styled, { css, keyframes } from "styled-components";

const GREEN = "#1B3528";
const PAPER = "#F7F5EF";
const INK = "#23382B";
const MUTED = "#728076";
const HAIR = "rgba(27,53,40,.16)";
const SERIF = 'var(--ahns-display, "Noto Serif KR", Georgia, serif)';

const drawRoute = keyframes`
  from {stroke-dasharray: 1; stroke-dashoffset: 1; opacity:.2;}
  to {stroke-dasharray: 1; stroke-dashoffset: 0;opacity:1;}
`;
const enterCard = keyframes`
  from { opacity:0; transform:translateY(8px); }
  to { opacity:1; transform:translateY(0); }
`;

export const Page = styled.div`
  background: ${PAPER};
  color: ${INK};
  overflow: clip;
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;
export const Content = styled.div`
  width: min(calc(100% - 9vw), 1500px);
  margin-inline: auto;
  @media (max-width: 600px) {
    width: calc(100% - 36px);
  }
`;
export const Intro = styled.section`
  padding: clamp(53px, 5.5vw, 94px) 0 clamp(39px, 4vw, 65px);
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: end;
  gap: 30px;
  .eyebrow {
    font-size: 10px;
    letter-spacing: 0.28em;
    font-weight: 600;
    color: #668070;
    display: flex;
    align-items: center;
    gap: 13px;
  }
  .eyebrow::before {
    content: "";
    display: block;
    width: 29px;
    height: 1px;
    background: #9aab98;
  }
  h1 {
    margin: 19px 0 0;
    font: 400 clamp(54px, 6.2vw, 112px)/1.16 ${SERIF};
    letter-spacing: -0.085em;
    color: ${GREEN};
  }
  .english {
    display: block;
    font:
      400 clamp(27px, 3.05vw, 52px)/1 Georgia,
      serif;
    letter-spacing: -0.045em;
    font-style: italic;
    color: #788a77;
    margin-left: 4px;
  }
  .intro-description {
    justify-self: end;
    max-width: 355px;
    font-size: 14px;
    line-height: 2;
    color: #6b7a70;
    padding-bottom: 6px;
    word-break: keep-all;
  }
  @media (max-width: 790px) {
    grid-template-columns: 1fr;
    gap: 24px;
    .intro-description {
      justify-self: start;
    }
  }
  @media (max-width: 600px) {
    h1 {
      font-size: clamp(48px, 12vw, 75px);
    }
    .intro-description {
      font-size: 13px;
    }
  }
`;
export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.72fr) minmax(330px, 0.83fr);
  border: 1px solid #e0e4d9;
  min-height: 658px;
  @media (max-width: 1150px) {
    grid-template-columns: minmax(0, 1fr) minmax(290px, 0.7fr);
  }
  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;
export const MapSection = styled.section`
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #eeefe7;
`;
export const MapScroll = styled.div`
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
  scrollbar-color: #bfc9b9 transparent;
  &:focus-visible {
    outline: 2px solid #73907a;
    outline-offset: -4px;
  }
`;
export const MapSurface = styled.div`
  position: relative;
  isolation: isolate;
  width: 100%;
  min-width: 720px;
  aspect-ratio: 1000 / 680;
  background: #eeefe7;
  @media (min-width: 981px) {
    min-width: 0;
  }
`;
export const CitySvg = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  display: block;
  overflow: hidden;
  .flat-route {
    animation: ${drawRoute} 1.25s cubic-bezier(0.2, 0.8, 0.3, 1) both;
  }
  .flat-route-dash {
    opacity: 0.8;
  }
  @media (prefers-reduced-motion: reduce) {
    .flat-route {
      animation: none;
      stroke-dasharray: none;
      stroke-dashoffset: 0;
    }
  }
`;
export const MapTopLabel = styled.div`
  position: absolute;
  left: 5.2%;
  top: 5.5%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
  .eyebrow {
    font:
      500 clamp(9px, 0.82vw, 12px) Georgia,
      serif;
    letter-spacing: 0.23em;
    color: #536d5a;
  }
  .fine {
    font-size: 10px;
    letter-spacing: 0.14em;
    color: #92a092;
  }
`;
export const Compass = styled.div`
  position: absolute;
  right: 5%;
  top: 5%;
  color: ${GREEN};
  font:
    500 11px Georgia,
    serif;
  text-align: center;
  span {
    display: block;
    border: 1px solid #9bab99;
    width: 29px;
    height: 29px;
    border-radius: 50%;
    margin-top: 5px;
    line-height: 26px;
    font-size: 19px;
  }
`;
export const ClinicFlag = styled.div`
  position: absolute;
  z-index: 3;
  transform: translate(-50%, -100%);
  text-align: center;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  color: white;
  span {
    background: ${GREEN};
    padding: 13px 22px 10px;
    font:
      400 clamp(19px, 1.65vw, 27px)/1 Georgia,
      serif;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  small {
    padding: 4px 12px;
    background: ${GREEN};
    font-size: 10px;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  &::after {
    content: "";
    width: 1px;
    height: 16px;
    background: ${GREEN};
  }
`;
export const StationMarker = styled.button<{ $active: boolean }>`
  position: absolute;
  z-index: 4;
  transform: translate(-50%, -50%);
  border: 0;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 6px;
  color: ${GREEN};
  white-space: nowrap;
  .number {
    display: grid;
    place-items: center;
    width: 31px;
    height: 31px;
    flex: none;
    background: var(--line-color);
    color: white;
    border: 3px solid #f8f7ef;
    border-radius: 50%;
    font:
      600 15px/1 Arial,
      sans-serif;
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease;
  }
  .station-name {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 8px 11px;
    background: rgba(250, 249, 244, 0.96);
    border: 1px solid #dfe3d7;
    color: ${GREEN};
    font-size: 12px;
    font-weight: 650;
    line-height: 1;
    transition:
      background 0.25s,
      border-color 0.25s;
  }
  .station-name small {
    font-size: 10px;
    font-weight: 400;
    color: #718175;
  }
  &:hover .number,
  &:focus-visible .number {
    transform: scale(1.14);
    box-shadow: 0 0 0 5px rgba(27, 53, 40, 0.12);
  }
  &:hover .station-name,
  &:focus-visible .station-name {
    background: white;
  }
  ${({ $active }) =>
    $active &&
    css`
      .number {
        box-shadow: 0 0 0 5px rgba(27, 53, 40, 0.15);
      }
      .station-name {
        border-color: #b6c5b4;
        background: white;
      }
    `}
  &:focus-visible {
    outline: 2px solid ${GREEN};
    outline-offset: 2px;
  }
`;
export const RouteCard = styled.div`
  position: absolute;
  z-index: 5;
  left: 5.2%;
  bottom: 9.3%;
  width: 230px;
  padding: 21px 22px 19px;
  border: 1px solid #dfe4d9;
  background: rgba(252, 251, 247, 0.96);
  animation: ${enterCard} 0.35s ease both;
  pointer-events: none;
  .small {
    font-size: 9px;
    letter-spacing: 0.16em;
    color: #7c897c;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .small i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #8a9e78;
  }
  strong {
    display: block;
    margin-top: 13px;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.04em;
  }
  strong small {
    font-size: 11px;
    font-weight: 400;
    color: #697e6d;
    margin-left: 7px;
  }
  .rule {
    height: 1px;
    background: #e3e5dd;
    margin: 16px 0 13px;
  }
  .route-info {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    font-size: 12px;
    line-height: 1.8;
  }
  .route-info span {
    color: ${MUTED};
  }
  .route-info b {
    font-weight: 600;
  }
  @media (max-width: 980px) {
    width: 210px;
    padding: 16px;
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
export const MapLegend = styled.div`
  position: absolute;
  bottom: 3%;
  left: 5.2%;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: #829081;
  letter-spacing: -0.025em;
  i {
    width: 19px;
    border-top: 2px solid #b18d5e;
  }
`;
export const StationTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  border-top: 1px solid #dde2d8;
  padding: 0 17px;
  button {
    display: flex;
    align-items: center;
    gap: 7px;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    cursor: pointer;
    color: #7e8d80;
    font-size: 12px;
    padding: 14px 13px;
    transition:
      color 0.25s,
      border-color 0.25s;
  }
  button i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
  }
  button span {
    font-size: 10px;
    opacity: 0.8;
  }
  button[aria-pressed="true"] {
    color: ${GREEN};
    border-color: ${GREEN};
    font-weight: 600;
  }
  button:focus-visible {
    outline: 2px solid #73907a;
    outline-offset: -3px;
  }
  @media (max-width: 600px) {
    padding: 0 9px;
    button {
      padding: 11px 7px;
      font-size: 11px;
    }
  }
`;
export const Details = styled.aside`
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #fcfbf7;
  border-left: 1px solid #e0e4d9;
  padding: clamp(31px, 3.5vw, 64px) clamp(24px, 3vw, 52px) 35px;
  @media (max-width: 980px) {
    border-left: 0;
    border-top: 1px solid #e0e4d9;
    padding: 42px clamp(25px, 5vw, 60px);
  }
`;
export const AsideTop = styled.div`
  .index {
    font:
      400 11px Georgia,
      serif;
    letter-spacing: 0.25em;
    color: #849585;
  }
  h2 {
    font: 400 clamp(27px, 2.5vw, 40px)/1.48 ${SERIF};
    letter-spacing: -0.07em;
    color: ${GREEN};
    margin: 27px 0 22px;
    word-break: keep-all;
  }
  .bar {
    width: 39px;
    height: 1px;
    background: #9dae9e;
  }
`;
export const ContactGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 26px;
  margin: clamp(25px, 3.3vw, 53px) 0;
  @media (max-width: 980px) {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }
  @media (max-width: 650px) {
    display: flex;
    gap: 26px;
  }
`;
export const ContactRow = styled.div`
  display: grid;
  grid-template-columns: 23px minmax(0, 1fr);
  gap: 12px;
  color: ${GREEN};
  .symbol {
    padding-top: 1px;
  }
  strong {
    font-size: 12px;
    display: block;
    margin: 0 0 8px;
    font-weight: 650;
    letter-spacing: 0.01em;
  }
  p {
    font-size: 13px;
    line-height: 1.9;
    color: #506658;
    overflow-wrap: anywhere;
  }
  a {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px solid #9faf9b;
  }
  .quiet {
    color: #87968a;
    font-size: 12px;
  }
  small {
    display: block;
    margin-top: 6px;
    font-size: 10px;
    line-height: 1.6;
    color: #88968b;
  }
`;
export const ScheduleLines = styled.div`
  display: grid;
  gap: 6px;
  div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 12px;
    color: #54685a;
  }
  span {
    color: #869486;
  }
  b {
    font-weight: 500;
    text-align: right;
  }
`;
export const MapButtons = styled.div`
  display: grid;
  gap: 9px;
  margin-top: auto;
  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 50px;
    padding: 10px 16px;
    text-decoration: none;
    font-size: 12px;
    font-weight: 550;
    transition:
      background 0.25s,
      color 0.25s;
  }
  a.primary {
    background: ${GREEN};
    color: #fefdf8;
    border: 1px solid ${GREEN};
  }
  a.primary:hover {
    background: #2c513b;
  }
  a.secondary {
    background: transparent;
    color: ${GREEN};
    border: 1px solid #b3c0b1;
  }
  a.secondary:hover {
    background: #ebf0e9;
  }
  a span {
    font-size: 17px;
    font-weight: 300;
  }
  @media (max-width: 980px) {
    max-width: 520px;
  }
`;
export const Below = styled.section`
  padding: clamp(40px, 4.8vw, 75px) 0 clamp(85px, 8vw, 135px);
`;
export const TransportHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  margin-bottom: 20px;
  .small {
    font-size: 10px;
    letter-spacing: 0.22em;
    color: #7f907d;
  }
  h2 {
    font: 400 clamp(28px, 3vw, 47px)/1.45 ${SERIF};
    letter-spacing: -0.06em;
    color: ${GREEN};
    margin-top: 8px;
  }
  .footnote {
    font-size: 11px;
    color: #8d988c;
    max-width: 400px;
    line-height: 1.8;
  }
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;
export const TransportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid ${HAIR};
  border-bottom: 1px solid ${HAIR};
  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;
export const TransportCell = styled.div`
  display: grid;
  grid-template-columns: 35px minmax(0, 1fr);
  gap: 17px;
  min-height: 161px;
  padding: 29px clamp(16px, 2.8vw, 42px) 27px;
  color: ${GREEN};
  & + & {
    border-left: 1px solid ${HAIR};
  }
  .icon {
    padding-top: 3px;
  }
  h3 {
    font-size: 14px;
    font-weight: 650;
    margin: 0 0 13px;
    letter-spacing: -0.03em;
  }
  p {
    font-size: 12px;
    line-height: 1.9;
    color: #677a6b;
  }
  .lines {
    display: flex;
    gap: 6px;
    align-items: center;
    margin-bottom: 10px;
  }
  .lines i {
    font-style: normal;
    display: grid;
    place-items: center;
    width: 21px;
    height: 21px;
    border-radius: 50%;
    color: white;
    font:
      600 11px Arial,
      sans-serif;
  }
  @media (max-width: 780px) {
    min-height: 0;
    padding: 25px 5px;
    & + & {
      border-left: 0;
      border-top: 1px solid ${HAIR};
    }
  }
`;
export const RealMap = styled.details`
  border-top: 1px solid rgba(27, 53, 40, 0.15);
  background: ${PAPER};
  summary {
    padding: 21px 0;
    cursor: pointer;
    list-style: none;
    font-size: 12px;
    letter-spacing: 0.02em;
    color: ${GREEN};
  }
  summary::-webkit-details-marker {
    display: none;
  }
  .summary-inner {
    width: min(calc(100% - 9vw), 1500px);
    margin-inline: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .summary-inner i {
    font-style: normal;
    font-size: 21px;
    font-weight: 300;
    transition: transform 0.25s;
  }
  &[open] .summary-inner i {
    transform: rotate(45deg);
  }
  .map-holder {
    min-height: 420px;
    margin-bottom: 65px;
  }
  @media (max-width: 600px) {
    .summary-inner {
      width: calc(100% - 36px);
    }
  }
`;
/**
 * Footer.style.ts의 시작 지점은 #1b3528(처음 80px 유지)입니다.
 * 이 마지막 섹션도 정확히 같은 #1B3528로 마감해 Footer의 그라데이션과 연결합니다.
 */
export const FooterBridge = styled.section`
  background: ${GREEN};
  color: ${PAPER};
  position: relative;
  overflow: hidden;
  padding: clamp(95px, 10vw, 165px) 0 clamp(112px, 11vw, 175px);
  &::before {
    content: "";
    position: absolute;
    width: 560px;
    height: 560px;
    border: 1px solid rgba(240, 246, 230, 0.09);
    border-radius: 50%;
    right: -130px;
    top: -260px;
    pointer-events: none;
  }
  &::after {
    content: "";
    position: absolute;
    width: 730px;
    height: 730px;
    border: 1px solid rgba(240, 246, 230, 0.05);
    border-radius: 50%;
    right: -215px;
    top: -345px;
    pointer-events: none;
  }
  .overline {
    font-size: 10px;
    letter-spacing: 0.25em;
    color: #b7c8b6;
  }
  h2 {
    font: 400 clamp(36px, 5vw, 76px)/1.4 ${SERIF};
    letter-spacing: -0.075em;
    margin-top: 23px;
    max-width: 820px;
    word-break: keep-all;
  }
  .bottomline {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 22px;
    margin-top: 42px;
    padding-top: 25px;
    border-top: 1px solid rgba(242, 246, 230, 0.2);
  }
  .bottomline span {
    font:
      400 26px Georgia,
      serif;
    letter-spacing: 0.07em;
  }
  .bottomline p {
    font-size: 11px;
    letter-spacing: 0.11em;
    color: #b7c8b6;
  }
  @media (max-width: 600px) {
    .bottomline {
      align-items: start;
      flex-direction: column;
    }
  }
`;
