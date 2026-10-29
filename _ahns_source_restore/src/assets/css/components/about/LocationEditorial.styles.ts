import styled, { css, keyframes } from 'styled-components';

const C = {
  ivory: "#F6F4EE",
  green: "#1B3528",
  ink: "#172E23",
  muted: "#69736B",
  border: "#D8D8CD",
} as const;
const serif =
  'var(--ahns-display, "Iowan Old Style", "Baskerville", Georgia, serif)';

const draw = keyframes`
  from { stroke-dashoffset: 1; opacity: .3; }
  to { stroke-dashoffset: 0; opacity: 1; }
`;
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;
const gentlePulse = keyframes`
  0%,100% { opacity:.26; transform:translate(-50%, -50%) scale(.84); }
  50% { opacity:.62; transform:translate(-50%, -50%) scale(1.15); }
`;

export const PageLayout = styled.section`
  width: 100%;
  margin: 30px auto 0;
  background: ${C.ivory};
  color: ${C.ink};
  overflow: clip;
`;
export const TopRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2.728fr) minmax(340px, 1fr);
  width: 100%;
  align-items: stretch;
  @media (max-width: 1050px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
export const MapViewport = styled.div`
  position: relative;
  min-width: 0;
  aspect-ratio: 1124 / 804;
  overflow: hidden;
  isolation: isolate;
  @media (max-width: 1050px) {
    aspect-ratio: auto;
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-inline: contain;
    scrollbar-width: thin;
    scrollbar-color: #a6ae9e transparent;
  }
`;
export const MapArtwork = styled.div`
  width: 100%;
  aspect-ratio: 1124 / 804;
  min-height: 0;
  position: relative;
  overflow: hidden;
  background: #edede3;
  isolation: isolate;
  .editorial-map-image {
    object-fit: fill;
    user-select: none;
    pointer-events: none;
  }
  @media (max-width: 1050px) {
    min-width: 810px;
  }
  @media (max-width: 560px) {
    min-width: 720px;
  }
`;
export const MapTitleMask = styled.div`
  position: absolute;
  z-index: 1;
  pointer-events: none;
  left: 0;
  top: 0;
  width: 57%;
  height: 47%;
  background: linear-gradient(
    95deg,
    rgba(248, 247, 242, 0.995) 0%,
    rgba(248, 247, 242, 0.995) 73%,
    rgba(248, 247, 242, 0.95) 81%,
    rgba(248, 247, 242, 0.04) 100%
  );
  mask-image: linear-gradient(to bottom, #000 0%, #000 82%, transparent 100%);
`;
export const MapHeading = styled.div`
  position: absolute;
  z-index: 2;
  top: 8%;
  left: 5.35%;
  width: 39%;
  .overline {
    font-size: clamp(8px, 0.75vw, 12px);
    letter-spacing: 0.34em;
    font-family: ${serif};
    color: ${C.ink};
  }
  h1 {
    font-family: ${serif};
    font-weight: 400;
    letter-spacing: -0.072em;
    line-height: 1.04;
    font-size: clamp(60px, 8.05vw, 124px);
    margin: 12px 0 14px;
  }
  .lead {
    font-family: ${serif};
    font-size: clamp(15px, 1.42vw, 23px);
    letter-spacing: -0.04em;
  }
  .description {
    margin-top: 20px;
    font-size: clamp(11px, 1vw, 15px);
    line-height: 1.9;
    letter-spacing: -0.045em;
  }
  @media (max-width: 1050px) {
    h1 {
      font-size: 87px;
    }
    .lead {
      font-size: 17px;
    }
    .description {
      font-size: 13px;
    }
  }
`;
export const StationInfoCard = styled.div`
  position: absolute;
  z-index: 5;
  left: 28.35%;
  top: 49.65%;
  width: 17.25%;
  height: 17.2%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 13px 13px 11px;
  background: rgba(255, 255, 252, 0.97);
  border: 1px solid rgba(240, 239, 231, 0.85);
  border-radius: 13px;
  box-shadow: 0 9px 32px rgba(37, 41, 28, 0.13);
  animation: ${fadeIn} 0.35s ease both;
  .info-head {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    margin-bottom: 8px;
  }
  .info-head strong {
    font-size: clamp(10px, 0.93vw, 15px);
    white-space: nowrap;
    font-weight: 600;
  }
  .info-head strong span {
    font-size: 0.83em;
    font-weight: 400;
    color: #687366;
  }
  .line-dot {
    width: 7px;
    height: 7px;
    flex: none;
    border-radius: 50%;
  }
  .card-arrow {
    margin-left: auto;
    font-size: 13px;
  }
  .trip-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 5px;
  }
  .mode-symbol {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    flex: none;
    background: #eeefe8;
    display: grid;
    place-items: center;
    font-size: 15px;
  }
  .trip-row div {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .trip-row small {
    font-size: clamp(8px, 0.68vw, 11px);
    color: #6f786e;
  }
  .trip-row strong {
    font-size: clamp(9px, 0.79vw, 12px);
    font-weight: 500;
    white-space: nowrap;
  }
  @media (max-width: 1050px) {
    .info-head strong {
      font-size: 11px;
    }
    .trip-row strong {
      font-size: 10px;
    }
    .trip-row small {
      font-size: 9px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
export const RouteSvg = styled.svg`
  position: absolute;
  z-index: 3;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
  .route-outer,
  .route-inner {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .route-outer {
    stroke: rgba(255, 255, 245, 0.9);
    stroke-width: 8;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: ${draw} 1.7s cubic-bezier(0.18, 0.7, 0.2, 1) both;
  }
  .route-inner {
    stroke: #c8a76a;
    stroke-width: 3;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: ${draw} 1.7s 0.1s cubic-bezier(0.18, 0.7, 0.2, 1) both;
  }
  .clinic-halo {
    stroke: #daf1cc;
    stroke-width: 3;
    fill: rgba(46, 92, 54, 0.07);
  }
  @media (prefers-reduced-motion: reduce) {
    .route-outer,
    .route-inner {
      animation: none;
      stroke-dasharray: none;
      stroke-dashoffset: 0;
    }
  }
`;
export const StationHotspot = styled.button<{
  $active: boolean;
  $line: string;
}>`
  position: absolute;
  z-index: 7;
  width: clamp(34px, 3.2vw, 56px);
  height: clamp(34px, 3.2vw, 56px);
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transform: translate(-50%, -50%);
  outline-offset: 3px;
  .hotspot-ring {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;
    border: 2px solid ${({ $line }) => $line};
    border-radius: 50%;
    background: rgba(255, 255, 251, 0.11);
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.55);
    transform: translate(-50%, -50%) scale(0.75);
    opacity: 0;
    transition:
      opacity 0.25s ease,
      transform 0.25s ease;
  }
  ${({ $active }) =>
    $active &&
    css`
      .hotspot-ring {
        opacity: 0.9;
        animation: ${gentlePulse} 2.6s ease-in-out infinite;
      }
    `}
  &:hover .hotspot-ring, &:focus-visible .hotspot-ring {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
  }
  &:focus-visible {
    outline: 2px solid #2c5037;
  }
  @media (max-width: 1050px) {
    width: 42px;
    height: 42px;
  }
  @media (prefers-reduced-motion: reduce) {
    .hotspot-ring {
      animation: none;
    }
  }
`;
export const MapCompass = styled.div`
  position: absolute;
  z-index: 2;
  right: 3.6%;
  top: 5%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 2px;
  color: ${C.ink};
  font: 12px ${serif};
  i {
    font-size: 28px;
    font-style: normal;
    line-height: 1.1;
    font-weight: 200;
  }
`;
export const MapDisclaimer = styled.p`
  position: absolute;
  z-index: 4;
  left: 4%;
  bottom: 2%;
  max-width: 45%;
  padding: 5px 8px;
  font-size: clamp(8px, 0.67vw, 11px);
  letter-spacing: 0.08em;
  background: rgba(247, 246, 239, 0.84);
  color: #536457;
`;
export const MobileMapNote = styled.p`
  display: none;
  @media (max-width: 1050px) {
    display: block;
    position: sticky;
    bottom: 0;
    left: 0;
    padding: 9px 18px;
    background: #e9ece3;
    color: #4a5a4d;
    font-size: 11px;
    text-align: center;
  }
`;
export const RightPanel = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(24px, 2.8vw, 46px);
  background: #f9f8f4;
  padding: clamp(37px, 5.15vw, 80px) clamp(27px, 4vw, 62px) 49px;
  min-width: 0;
  @media (max-width: 1050px) {
    padding: 45px max(24px, 7vw);
    gap: 32px;
  }
`;
export const RightOverline = styled.p`
  letter-spacing: 0.28em;
  font-size: 10px;
  font-family: ${serif};
  font-weight: 400;
`;
export const RightHeading = styled.h2`
  margin: 28px 0 0;
  line-height: 1.35;
  letter-spacing: -0.07em;
  font-size: clamp(27px, 2.2vw, 37px);
  font-family: ${serif};
  font-weight: 400;
  @media (max-width: 1050px) {
    font-size: clamp(28px, 5.7vw, 41px);
  }
`;
export const SmallRule = styled.div`
  width: 65px;
  height: 1px;
  background: #b9c1b3;
  margin-top: 29px;
`;
export const InformationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  @media (max-width: 1050px) {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  @media (max-width: 680px) {
    display: flex;
    gap: 26px;
  }
`;
export const InformationItem = styled.div`
  display: grid;
  grid-template-columns: 27px minmax(0, 1fr);
  gap: 17px;
  .icon {
    color: ${C.ink};
    padding-top: 1px;
  }
  strong {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  p {
    font-size: 13px;
    line-height: 1.85;
    letter-spacing: -0.025em;
    overflow-wrap: anywhere;
  }
  small {
    display: block;
    margin-top: 9px;
    font-size: 11px;
    line-height: 1.7;
    color: ${C.muted};
  }
  .quiet {
    color: ${C.muted};
  }
  a:hover {
    text-decoration: underline;
  }
`;
export const ScheduleTable = styled.div`
  display: grid;
  gap: 6px;
  div {
    display: grid;
    grid-template-columns: 52px 1fr;
    gap: 7px;
    align-items: baseline;
    font-size: 12px;
    line-height: 1.5;
  }
  span {
    color: ${C.muted};
  }
  b {
    font-weight: 500;
    overflow-wrap: anywhere;
  }
`;
export const DirectionButtons = styled.div`
  display: grid;
  gap: 11px;
  a {
    min-height: 57px;
    padding: 10px 18px;
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition:
      background 0.25s,
      color 0.25s,
      border-color 0.25s,
      transform 0.25s;
    font-size: 13px;
    white-space: nowrap;
  }
  a > span:last-child {
    margin-left: auto;
    font-size: 20px;
    font-weight: 200;
  }
  .kakao {
    background: ${C.green};
    color: #fafbf7;
    border: 1px solid ${C.green};
  }
  .kakao:hover {
    background: #2c513a;
    transform: translateY(-2px);
  }
  .naver {
    background: transparent;
    color: ${C.green};
    border: 1px solid #9fa89d;
  }
  .naver:hover {
    background: #ebeee7;
    transform: translateY(-2px);
  }
  .naver-mark {
    font-family: Arial, sans-serif;
    font-weight: 900;
    font-size: 22px;
    letter-spacing: -0.1em;
  }
  @media (max-width: 1050px) {
    max-width: 530px;
  }
  @media (prefers-reduced-motion: reduce) {
    a {
      transition: none;
    }
    a:hover {
      transform: none;
    }
  }
`;
export const BottomRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2.728fr) minmax(340px, 1fr);
  min-height: 216px;
  @media (max-width: 1050px) {
    grid-template-columns: 1fr;
  }
`;
export const TransportPanel = styled.section`
  display: grid;
  grid-template-columns: 0.85fr 1fr 1fr 1fr;
  align-items: center;
  background: #f8f7f3;
  padding: 32px clamp(20px, 4vw, 61px);
  gap: 0;
  .transport-title {
    align-self: stretch;
    padding-top: 14px;
    padding-right: 18px;
  }
  .transport-title span {
    font: 10px ${serif};
    letter-spacing: 0.2em;
    white-space: nowrap;
  }
  .transport-title h2 {
    font-family: ${serif};
    font-size: clamp(27px, 2.2vw, 37px);
    font-weight: 400;
    margin: 15px 0 17px;
    letter-spacing: -0.065em;
  }
  .transport-title i {
    display: block;
    width: 30px;
    height: 1px;
    background: #adb7ab;
  }
  @media (max-width: 1250px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 25px;
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    padding: 40px 23px;
    row-gap: 20px;
  }
`;
export const TransportItem = styled.div`
  min-height: 130px;
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 13px 13px 0 22px;
  border-left: 1px solid #dedcd3;
  > svg {
    flex: none;
    width: 22px;
    height: 22px;
  }
  > div {
    min-width: 0;
  }
  strong {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.025em;
    white-space: nowrap;
  }
  p {
    font-size: 12px;
    line-height: 1.8;
    margin-top: 16px;
  }
  small {
    display: block;
    color: ${C.muted};
    font-size: 10px;
    line-height: 1.7;
    margin-top: 6px;
  }
  .train-lines {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 17px;
  }
  .train-lines span {
    color: white;
    min-width: 23px;
    height: 23px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 700;
  }
  .train-lines .seven {
    background: #627b3a;
  }
  .train-lines .four {
    background: #2a6b9c;
  }
  .train-lines b {
    font-size: 11px;
    font-weight: 400;
    margin-left: 3px;
  }
  @media (max-width: 560px) {
    min-height: 0;
    padding: 16px 0 0;
    border-left: 0;
    border-top: 1px solid #dedcd3;
  }
`;
export const GreenSignature = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background:
    radial-gradient(
      ellipse at 97% 14%,
      rgba(123, 147, 109, 0.26),
      transparent 50%
    ),
    linear-gradient(130deg, #1d4031, #142e24);
  color: #f7f6ef;
  padding: 42px clamp(28px, 4vw, 66px);
  position: relative;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    inset: 0 0 0 auto;
    width: 54%;
    background: url("/images/about/location/location-green-panel.webp")
      center/cover no-repeat;
    opacity: 0.22;
    pointer-events: none;
  }
  .brand {
    font: clamp(34px, 2.7vw, 45px) ${serif};
    letter-spacing: 0.045em;
    position: relative;
    z-index: 1;
  }
  .subbrand {
    font: 13px ${serif};
    letter-spacing: 0.27em;
    margin-top: 3px;
    position: relative;
    z-index: 1;
  }
  i {
    display: block;
    width: 33px;
    height: 1px;
    background: #b7c2b0;
    margin: 21px 0;
    position: relative;
    z-index: 1;
  }
  .motto {
    font: 9px ${serif};
    letter-spacing: 0.22em;
    white-space: nowrap;
    position: relative;
    z-index: 1;
  }
`;
export const MapFootnote = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 35px;
  padding: 24px clamp(25px, 4vw, 62px);
  background: #f1f1ea;
  border-top: 1px solid #e2e2d9;
  span {
    font: 10px ${serif};
    letter-spacing: 0.19em;
    white-space: nowrap;
  }
  p {
    font-size: 11px;
    line-height: 1.8;
    color: #6b746a;
    max-width: 800px;
  }
  @media (max-width: 780px) {
    flex-direction: column;
    gap: 8px;
    padding: 25px;
  }
`;
export const LiveMapDisclosure = styled.details`
  background: #f6f4ee;
  border-top: 1px solid #e0e2da;
  summary {
    cursor: pointer;
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    width: min(calc(100% - 50px), 1360px);
    margin: auto;
    padding: 27px 0;
    font-size: 15px;
    color: ${C.green};
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary span {
    font-size: 20px;
  }
  &[open] summary span {
    transform: rotate(45deg);
  }
  .map-container {
    width: min(calc(100% - 50px), 1360px);
    margin: 0 auto;
    padding-bottom: 44px;
    min-height: 390px;
  }
`;
