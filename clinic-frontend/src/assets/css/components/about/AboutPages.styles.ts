import styled, { css, keyframes } from 'styled-components';

export const C = {
  green: "#1B3528",
  deep: "#132A20",
  ink: "#233C2E",
  ivory: "#F7F5EE",
  paper: "#F0EEE5",
  warm: "#EAE7DB",
  sage: "#A4B09F",
  muted: "#6A786D",
  line: "rgba(28,60,42,.18)",
};
const serif = '"Noto Serif KR", "Nanum Myeongjo", Georgia, serif';
const latin = '"Cormorant Garamond", "Iowan Old Style", Georgia, serif';
const revealStyles = css`
  &[data-about-motion="on"] [data-about-reveal] {
    opacity: 0;
    transform: translate3d(0, 34px, 0);
    transition:
      opacity 0.9s cubic-bezier(0.23, 1, 0.32, 1),
      transform 1s cubic-bezier(0.23, 1, 0.32, 1);
  }
  &[data-about-motion="on"] [data-about-reveal][data-about-visible="true"] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  @media (prefers-reduced-motion: reduce) {
    &,
    & * {
      scroll-behavior: auto !important;
    }
    [data-about-reveal] {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }
`;

export const Canvas = styled.main`
  min-height: 100vh;
  width: 100%;
  overflow: clip;
  background: ${C.ivory};
  color: ${C.ink};
  -webkit-font-smoothing: antialiased;
  &,
  & * {
    box-sizing: border-box;
  }
  h1,
  h2,
  h3,
  h4,
  p,
  figure,
  blockquote {
    margin: 0;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  button {
    font: inherit;
  }
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid #778b75;
    outline-offset: 5px;
  }
  ${revealStyles}
`;
export const AboutNavWrap = styled.nav`
  position: relative;
  z-index: 4;
  width: min(calc(100% - 9vw), 1440px);
  margin: 0 auto;
  padding-top: 119px;
  display: flex;
  align-items: center;
  gap: clamp(22px, 3vw, 48px);
  color: ${C.ink};
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding-top: 98px;
  }
  @media (max-width: 600px) {
    width: calc(100% - 40px);
    padding-top: 88px;
  }
`;
export const AboutNavCaption = styled.span`
  flex: none;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  white-space: nowrap;
  span {
    opacity: 0.35;
    padding-left: 13px;
  }
`;
export const AboutNavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(16px, 2vw, 32px);
  overflow-x: auto;
  max-width: 100%;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 900px) {
    width: 100%;
    padding-bottom: 7px;
  }
`;
export const AboutNavLink = styled.a<{ $active: boolean }>`
  position: relative;
  flex: none;
  display: inline-block;
  padding: 8px 0 11px;
  font-size: 12px;
  letter-spacing: -0.035em;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
  transition: opacity 0.25s;
  &::after {
    content: "";
    position: absolute;
    height: 1px;
    bottom: 3px;
    left: 0;
    right: 0;
    background: currentColor;
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  &:hover {
    opacity: 1;
  }
  &:hover::after {
    transform: scaleX(1);
  }
`;
export const Container = styled.div`
  width: min(calc(100% - 9vw), 1440px);
  margin-inline: auto;
  @media (max-width: 600px) {
    width: calc(100% - 40px);
  }
`;
export const Eyebrow = styled.div`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  line-height: 1.8;
`;
export const Title = styled.h1`
  font-family: ${serif};
  font-size: clamp(52px, 6.8vw, 116px);
  font-weight: 400;
  letter-spacing: -0.085em;
  line-height: 1.23;
  word-break: keep-all;
  em {
    font-family: ${latin};
    font-weight: 400;
    font-size: 1.1em;
  }
  @media (max-width: 600px) {
    font-size: clamp(42px, 11vw, 60px);
  }
`;
export const SectionTitle = styled.h2`
  font-family: ${serif};
  font-size: clamp(36px, 4.5vw, 74px);
  font-weight: 400;
  letter-spacing: -0.07em;
  line-height: 1.35;
  word-break: keep-all;
`;
export const Body = styled.p`
  font-size: clamp(13px, 1.2vw, 16px);
  line-height: 2.15;
  font-weight: 350;
  word-break: keep-all;
  white-space: pre-line;
`;
export const ThinRule = styled.div`
  height: 1px;
  background: currentColor;
  opacity: 0.18;
  width: 100%;
`;
export const EditorialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  min-width: 205px;
  gap: 50px;
  padding: 13px 0;
  border-bottom: 1px solid currentColor;
  font-size: 12px;
  letter-spacing: 0.06em;
  transition:
    gap 0.25s,
    opacity 0.25s;
  &:hover {
    opacity: 0.7;
    gap: 62px;
  }
  span {
    font-size: 18px;
    line-height: 1;
  }
`;
export const DarkPanel = styled.section`
  background: ${C.green};
  color: ${C.ivory};
`;
export const Picture = styled.div`
  position: relative;
  overflow: hidden;
  background: ${C.warm};
  img {
    object-fit: cover;
    transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1);
    filter: saturate(0.75);
  }
  &:hover img {
    transform: scale(1.035);
  }
  @media (prefers-reduced-motion: reduce) {
    img {
      transition: none;
    }
    &:hover img {
      transform: none;
    }
  }
`;
export const BottomCall = styled.section`
  background: ${C.green};
  color: ${C.ivory};
  padding: clamp(100px, 10vw, 190px) 0;
  text-align: center;
  h2 {
    font: 400 clamp(43px, 6vw, 94px)/1.35 ${serif};
    letter-spacing: -0.07em;
    margin: 25px 0 30px;
    word-break: keep-all;
  }
  p {
    font-size: 14px;
    line-height: 2;
    opacity: 0.7;
  }
  a {
    margin-top: 34px;
  }
`;
export const FigureCredit = styled.span`
  font-size: 10px;
  letter-spacing: 0.11em;
  color: ${C.muted};
`;

// Philosophy — large editorial manifesto
export const PhilosophyHero = styled.section`
  position: relative;
  min-height: min(940px, 88svh);
  padding: clamp(88px, 9vw, 160px) 0 150px;
  @media (max-width: 750px) {
    min-height: 680px;
    padding: 95px 0 120px;
  }
`;
export const PhilosophyHeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.12fr 0.88fr;
  align-items: end;
  gap: clamp(30px, 5vw, 90px);
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
export const PhilosophyImage = styled(Picture)`
  width: 100%;
  aspect-ratio: 0.98;
  margin-top: 20px;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  @media (min-width: 801px) {
    transform: translateY(70px);
  }
  @media (max-width: 800px) {
    max-height: 410px;
    aspect-ratio: 1.8;
  }
`;
export const PhilosophyRail = styled.section`
  padding: clamp(100px, 12vw, 210px) 0;
`;
export const PhilosophyRow = styled.article`
  display: grid;
  grid-template-columns: 105px 1fr 1fr;
  gap: clamp(20px, 3vw, 60px);
  padding: clamp(36px, 5vw, 80px) 0;
  border-top: 1px solid ${C.line};
  align-items: start;
  h3 {
    font: 400 clamp(42px, 4.2vw, 75px)/1.3 ${serif};
    letter-spacing: -0.08em;
  }
  span {
    font-size: 11px;
    letter-spacing: 0.2em;
  }
  @media (max-width: 830px) {
    grid-template-columns: 55px 1fr;
    p {
      grid-column: 2;
    }
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
    gap: 18px;
    p {
      grid-column: 1;
    }
  }
`;
export const PhilosophyQuote = styled.section`
  background: ${C.deep};
  color: ${C.ivory};
  padding: clamp(100px, 11vw, 190px) 0;
  text-align: center;
  blockquote {
    margin: 34px auto;
    max-width: 1000px;
    font: 400 clamp(38px, 5.6vw, 84px)/1.55 ${serif};
    letter-spacing: -0.065em;
    word-break: keep-all;
  }
  p {
    opacity: 0.6;
    font-size: 12px;
    letter-spacing: 0.12em;
  }
`;

// Doctors — honest profiles with empty-state for unverified details
export const DoctorsHero = styled.section`
  padding: clamp(85px, 8vw, 150px) 0 clamp(90px, 10vw, 160px);
`;
export const DoctorsGrid = styled.div`
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: clamp(30px, 7vw, 120px);
  align-items: center;
  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;
export const PortraitPlaceholder = styled.div`
  position: relative;
  min-height: clamp(470px, 53vw, 790px);
  display: flex;
  align-items: end;
  justify-content: space-between;
  flex-direction: column;
  padding: clamp(25px, 4vw, 65px);
  overflow: hidden;
  background: radial-gradient(
    ellipse at 60% 46%,
    #bac4b1 0%,
    #839786 58%,
    #536b5b 100%
  );
  color: ${C.ivory};
  &:before {
    content: "";
    position: absolute;
    width: 80%;
    height: 88%;
    left: 10%;
    bottom: -29%;
    border-radius: 55% 55% 0 0;
    background: linear-gradient(
      130deg,
      rgba(242, 240, 229, 0.9),
      rgba(215, 226, 211, 0.2)
    );
    filter: blur(1px);
  }
  &:after {
    content: "";
    position: absolute;
    width: 43%;
    height: 37%;
    left: 29%;
    top: 19%;
    border-radius: 50%;
    background: linear-gradient(135deg, #dde3d5 15%, #abb9a7);
    opacity: 0.83;
  }
  > * {
    position: relative;
    z-index: 1;
  }
  @media (max-width: 850px) {
    min-height: 480px;
  }
`;
export const DoctorsSmallGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 100px;
  @media (max-width: 750px) {
    grid-template-columns: 1fr;
    margin-top: 60px;
  }
`;
export const DoctorsInfoCell = styled.div`
  border-top: 1px solid ${C.line};
  padding: 30px 0;
  h3 {
    font: 400 30px/1.35 ${serif};
    letter-spacing: -0.05em;
    margin: 20px 0;
  }
  p {
    font-size: 13px;
    line-height: 2;
    color: ${C.muted};
  }
`;

// Facilities — cinematic controlled tabs
export const FacilitiesHero = styled.section`
  padding: clamp(80px, 8vw, 135px) 0 clamp(80px, 9vw, 145px);
`;
export const GalleryStage = styled.div`
  position: relative;
  aspect-ratio: 16/8.5;
  overflow: hidden;
  background: #bec5b8;
  @media (max-width: 800px) {
    aspect-ratio: 4/4.2;
  }
`;
export const GalleryLayer = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  visibility: ${({ $active }) => ($active ? "visible" : "hidden")};
  transition:
    opacity 0.9s ease,
    visibility 0.9s ease;
  img {
    object-fit: cover;
    filter: saturate(0.7);
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
export const GalleryOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(0deg, rgba(14, 37, 25, 0.52), transparent 52%);
`;
export const GalleryCaption = styled.div`
  position: absolute;
  bottom: clamp(25px, 5vw, 70px);
  left: clamp(25px, 5vw, 70px);
  color: white;
  h3 {
    font: 400 clamp(39px, 5vw, 77px)/1.2 ${serif};
    letter-spacing: -0.07em;
    margin-top: 10px;
  }
`;
export const GalleryTabBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-bottom: 1px solid ${C.line};
  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;
export const GalleryTab = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 29px 14px 29px 0;
  color: ${({ $active }) => ($active ? C.ink : C.muted)};
  font-size: 12px;
  text-align: left;
  letter-spacing: 0.06em;
  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${C.green};
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transform-origin: left;
    transition: transform 0.4s;
  }
  &:hover {
    color: ${C.ink};
  }
  span {
    font-size: 11px;
    opacity: 0.65;
  }
  @media (max-width: 620px) {
    padding: 17px 0;
  }
`;
export const FacilitiesCopy = styled.section`
  padding: clamp(110px, 12vw, 200px) 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(35px, 8vw, 120px);
  align-items: start;
  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

// Safety — interactive SVG sequence and disclosure panels
export const SafetyHero = styled.section`
  padding: clamp(75px, 7vw, 120px) 0 90px;
`;
export const SafetyStage = styled.section`
  background: ${C.green};
  color: ${C.ivory};
  padding: clamp(85px, 9vw, 150px) 0;
`;
export const SafetyTimeline = styled.div`
  position: relative;
  margin: 65px 0 30px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  @media (max-width: 780px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
export const SafetyStep = styled.button<{ $active: boolean }>`
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(244,248,235,.66)" : "rgba(244,248,235,.22)"};
  background: ${({ $active }) =>
    $active ? "rgba(245,248,239,.13)" : "transparent"};
  color: ${C.ivory};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  text-align: left;
  padding: clamp(19px, 2.3vw, 36px);
  min-height: 210px;
  transition:
    background 0.35s,
    border-color 0.35s,
    transform 0.35s;
  &:hover {
    transform: translateY(-5px);
  }
  span {
    font-size: 12px;
    letter-spacing: 0.1em;
    opacity: 0.63;
  }
  strong {
    font: 400 clamp(23px, 2.2vw, 35px)/1.4 ${serif};
    letter-spacing: -0.06em;
  }
  @media (max-width: 780px) {
    min-height: 175px;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`;
export const SafetyDetail = styled.div`
  max-width: 950px;
  min-height: 140px;
  margin: 0 auto;
  padding: 55px 0 0;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  h3 {
    font: 400 clamp(28px, 3.5vw, 53px)/1.4 ${serif};
    letter-spacing: -0.05em;
  }
  p {
    font-size: 14px;
    line-height: 2;
    opacity: 0.7;
    margin-top: 18px;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;
export const SafetyNotes = styled.section`
  padding: clamp(110px, 10vw, 180px) 0;
`;
export const SafetyNote = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  border-top: 1px solid ${C.line};
  padding: 38px 0;
  h3 {
    font: 400 clamp(28px, 3vw, 45px)/1.45 ${serif};
    letter-spacing: -0.055em;
  }
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

// Location — reuse clinic footer API and the shared Kakao/Naver SDK map
export const LocationHero = styled.section`
  padding: clamp(85px, 8vw, 155px) 0 clamp(60px, 7vw, 105px);
`;
export const LocationSplit = styled.div`
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: clamp(30px, 6vw, 120px);
  align-items: end;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
export const LocationInfo = styled.div`
  border-top: 1px solid ${C.line};
  padding: 26px 0;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 15px;
  span {
    font-size: 11px;
    letter-spacing: 0.12em;
    opacity: 0.6;
  }
  strong {
    font-size: 15px;
    font-weight: 400;
    line-height: 2;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
  @media (max-width: 550px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;
export const LocationMapSection = styled.section`
  padding: clamp(65px, 8vw, 125px) 0;
  background: ${C.green};
  color: ${C.ivory};
  /* The existing HospitalMap is shared with Footer to avoid duplicated SDK. */
  button {
    color: ${C.ivory};
  }
`;
export const LocationDiagram = styled.div`
  width: min(100%, 470px);
  margin: 40px 0 0;
  svg {
    width: 100%;
    height: auto;
    display: block;
  }
  path,
  circle {
    transition:
      stroke-dashoffset 0.8s ease,
      opacity 0.6s;
  }
`;
export const LocationAdvice = styled.section`
  padding: clamp(90px, 10vw, 170px) 0;
  display: grid;
  grid-template-columns: 0.7fr 1.3fr;
  gap: clamp(30px, 6vw, 110px);
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

export const GallerySideIndex = styled.div`
  position: absolute;
  right: clamp(25px, 5vw, 70px);
  bottom: clamp(35px, 5vw, 75px);
  color: white;
  font:
    400 38px Georgia,
    serif;
  letter-spacing: -0.06em;
  span {
    font:
      400 12px Arial,
      sans-serif;
    letter-spacing: 0.12em;
    opacity: 0.7;
  }
`;
export const SafetyFlowDiagram = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  max-height: 125px;
  margin-top: 40px;
  @media (max-width: 780px) {
    display: none;
  }
  path,
  circle {
    transition:
      stroke 0.5s,
      fill 0.5s;
  }
`;
export const LocationActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px 30px;
  margin-top: 32px;
  a {
    min-width: 180px;
  }
`;
export const MapSurface = styled.div`
  background: ${C.ivory};
  padding: clamp(22px, 4vw, 64px);
  color: ${C.ink};
  border: 1px solid rgba(255, 255, 255, 0.26);
  & > div {
    width: 100%;
  }
  @media (max-width: 600px) {
    padding: 20px;
  }
`;
