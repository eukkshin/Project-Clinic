import styled, { keyframes } from 'styled-components';

const green = "#193a32";
const ink = "#1c322b";
const ivory = "#f8f6f1";
const sage = "#87988b";
const serif = '"Noto Serif KR", "Nanum Myeongjo", "Batang", Georgia, serif';
const latin =
  '"Cormorant Garamond", "Iowan Old Style", "Baskerville", Georgia, serif';
const sans = '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", sans-serif';

const arrive = keyframes`
  from { opacity: 0; transform: translate3d(0, 20px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
`;

export const Page = styled.main`
  --be-green: ${green};
  --be-ink: ${ink};
  --be-ivory: ${ivory};
  --be-serif: ${serif};
  --be-latin: ${latin};
  width: 100%;
  max-width: 100%;
  overflow: clip;
  color: ${ink};
  background: ${ivory};
  font-family: ${sans};
  -webkit-font-smoothing: antialiased;
  scroll-behavior: smooth;

  &,
  * {
    box-sizing: border-box;
  }
  h1,
  h2,
  h3,
  p,
  figure {
    margin: 0;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  button {
    font-family: inherit;
  }
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid #7b947d;
    outline-offset: 5px;
  }

  &[data-brand-editorial-motion="on"] [data-brand-editorial-reveal] {
    opacity: 0;
    transform: translate3d(0, 28px, 0);
    transition:
      opacity 0.9s cubic-bezier(0.2, 0.9, 0.25, 1),
      transform 1.05s cubic-bezier(0.2, 0.9, 0.25, 1);
  }
  &[data-brand-editorial-motion="on"]
    [data-brand-editorial-reveal][data-brand-editorial-visible="true"] {
    opacity: 1;
    transform: none;
  }
  &[data-brand-editorial-motion="on"] [data-brand-editorial-parallax] img {
    transform: translate3d(0, var(--be-parallax, 0px), 0) scale(1.055);
    transition: transform 220ms linear;
  }
  @media (max-width: 819px) {
    &[data-brand-editorial-motion="on"] [data-brand-editorial-parallax] img {
      transform: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
    *,
    *::before,
    *::after {
      animation: none !important;
      transition-duration: 0.01ms !important;
    }
    &[data-brand-editorial-motion="on"] [data-brand-editorial-reveal] {
      opacity: 1 !important;
      transform: none !important;
    }
    &[data-brand-editorial-motion="on"] [data-brand-editorial-parallax] img {
      transform: none !important;
    }
  }
`;

export const Hero = styled.section`
  position: relative;
  min-height: clamp(720px, 57vw, 965px);
  background: #f2eee6;
  isolation: isolate;
  overflow: hidden;
  @media (max-width: 1024px) {
    min-height: 760px;
  }
  @media (max-width: 700px) {
    min-height: 760px;
  }
`;

export const HeroMedia = styled.div`
  position: absolute;
  inset: 0 0 0 36%;
  z-index: -2;
  overflow: hidden;
  background: #d5d4c7;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    #000 28%,
    #000 100%
  );
  mask-image: linear-gradient(to right, transparent 0%, #000 28%, #000 100%);
  @media (max-width: 980px) {
    inset: 0 0 0 24%;
  }
  @media (max-width: 700px) {
    inset: 19% -9% 0 5%;
    opacity: 0.86;
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      #000 26%,
      #000 75%,
      transparent 100%
    );
    mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      #000 26%,
      #000 75%,
      transparent 100%
    );
  }
`;
export const HeroSlide = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 1000ms cubic-bezier(0.22, 1, 0.36, 1);
  img {
    object-fit: cover;
    object-position: 50% 34%;
    filter: saturate(0.82) contrast(0.95) brightness(1.045);
    transform: scale(1.035);
  }
  @media (max-width: 700px) {
    img {
      object-position: 50% 20%;
    }
  }
`;
export const HeroGradient = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(
      90deg,
      #f7f4ed 0%,
      rgba(247, 244, 237, 0.96) 15%,
      rgba(247, 244, 237, 0.69) 39%,
      rgba(247, 244, 237, 0.06) 67%
    ),
    linear-gradient(0deg, rgba(248, 246, 241, 0.36), transparent 29%);
  @media (max-width: 700px) {
    background: linear-gradient(
      180deg,
      #f8f5ed 0%,
      rgba(248, 245, 237, 0.91) 28%,
      rgba(248, 245, 237, 0.36) 50%,
      rgba(248, 245, 237, 0.02) 72%,
      rgba(248, 245, 237, 0.52) 100%
    );
  }
`;
export const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  width: min(calc(100% - clamp(48px, 10vw, 180px)), 1540px);
  min-height: inherit;
  margin: 0 auto;
  @media (max-width: 700px) {
    width: calc(100% - 42px);
  }
`;
export const AboutNav = styled.nav`
  position: absolute;
  z-index: 3;
  left: 0;
  right: 0;
  top: clamp(98px, 9.7vw, 140px);
  display: flex;
  align-items: center;
  gap: clamp(20px, 2.4vw, 40px);
  max-width: 100%;
  @media (max-width: 700px) {
    top: 91px;
    gap: 15px;
  }
`;
export const NavIdentity = styled.span`
  white-space: nowrap;
  flex: none;
  color: #264438;
  font: 600 10px ${sans};
  letter-spacing: 0.17em;
  span {
    color: #afbaa8;
    margin-left: 10px;
  }
`;
export const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(17px, 2vw, 32px);
  overflow-x: auto;
  min-width: 0;
  overscroll-behavior-inline: contain;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 700px) {
    gap: 21px;
    padding-right: 20px;
  }
`;
export const NavItem = styled.a<{ $active: boolean }>`
  position: relative;
  white-space: nowrap;
  flex: none;
  padding: 4px 0 11px;
  color: ${({ $active }) => ($active ? "#193a32" : "#687e71")};
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  transition: color 0.3s ease;
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
    transition: transform 0.35s ease;
  }
  &:hover {
    color: ${green};
  }
  &:hover::after {
    transform: scaleX(1);
  }
`;
export const HeroContent = styled.div`
  width: min(65%, 850px);
  padding: clamp(215px, 19vw, 294px) 0 140px;
  animation: ${arrive} 1.15s ease-out both;
  @media (max-width: 980px) {
    width: 75%;
    padding-top: 235px;
  }
  @media (max-width: 700px) {
    width: 100%;
    padding: 200px 0 160px;
  }
`;
export const Eyebrow = styled.p`
  color: #627468;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.24em;
  span {
    margin: 0 7px;
    color: #a4aa98;
  }
`;
export const HeroTitle = styled.h1`
  max-width: 830px;
  margin-top: 30px !important;
  font-family: ${serif};
  font-size: clamp(54px, 5.1vw, 89px);
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.093em;
  word-break: keep-all;
  em {
    font-family: ${latin};
    font-size: 1.2em;
    line-height: 1.05;
    font-style: normal;
    letter-spacing: -0.075em;
  }
  @media (max-width: 1100px) {
    font-size: clamp(51px, 5.4vw, 69px);
  }
  @media (max-width: 700px) {
    font-size: clamp(42px, 9.5vw, 70px);
    margin-top: 24px !important;
  }
`;
export const HeroRule = styled.div`
  margin-top: 32px;
  width: 38px;
  height: 1px;
  background: #6c8174;
`;
export const HeroDescription = styled.p`
  margin-top: 27px !important;
  color: #657367;
  font-size: clamp(13px, 1.05vw, 16px);
  font-weight: 300;
  letter-spacing: -0.024em;
  line-height: 2.07;
  word-break: keep-all;
`;
export const HeroScroll = styled.a`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: start;
  gap: 17px;
  margin-top: 67px;
  color: #526958;
  font-size: 9px;
  letter-spacing: 0.14em;
  font-weight: 500;
  i {
    display: block;
    width: 1px;
    height: 53px;
    margin-left: 5px;
    background: #6d8976;
    transform-origin: top;
    transition: transform 0.4s ease;
  }
  &:hover i {
    transform: scaleY(1.3);
  }
  @media (max-width: 700px) {
    margin-top: 38px;
  }
`;
export const HeroSideText = styled.span`
  position: absolute;
  right: 0;
  bottom: 95px;
  color: #44594a;
  font-family: ${latin};
  font-size: 12px;
  letter-spacing: 0.27em;
  line-height: 1.65;
  @media (max-width: 700px) {
    right: 5px;
    bottom: 85px;
    font-size: 9px;
  }
`;
export const HeroControls = styled.div`
  position: absolute;
  right: 0;
  bottom: 35px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #335347;
  font: 12px ${latin};
  letter-spacing: 0.1em;
  span {
    padding-right: 4px;
    font-variant-numeric: tabular-nums;
  }
  button {
    appearance: none;
    border: 0;
    background: transparent;
    padding: 6px;
    cursor: pointer;
    color: inherit;
    font-size: 20px;
    line-height: 1;
    transition: transform 0.25s ease;
  }
  button:hover {
    transform: translateY(-2px);
  }
  @media (max-width: 700px) {
    bottom: 30px;
  }
`;

export const Story = styled.section`
  display: grid;
  grid-template-columns: 52% 48%;
  min-height: clamp(580px, 46vw, 740px);
  color: #f4f1e9;
  background: #17382e;
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;
export const StoryCopy = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  padding: clamp(85px, 9vw, 158px) clamp(35px, 9vw, 170px);
  background:
    radial-gradient(
      circle at 15% 25%,
      rgba(100, 143, 114, 0.17),
      transparent 56%
    ),
    #17372c;
  @media (max-width: 1100px) {
    padding: 90px 7vw;
  }
  @media (max-width: 760px) {
    min-height: 540px;
    padding: 85px 30px;
  }
`;
export const SmallLabel = styled.p`
  display: flex;
  align-items: center;
  gap: 19px;
  color: #b5c8ba;
  font: 10px ${latin};
  letter-spacing: 0.16em;
  span {
    font-family: ${sans};
    font-weight: 400;
  }
`;
export const StoryTitle = styled.h2`
  margin-top: 55px !important;
  font: 400 clamp(38px, 3.4vw, 65px)/1.52 ${serif};
  letter-spacing: -0.075em;
  word-break: keep-all;
  @media (max-width: 1100px) {
    font-size: clamp(38px, 3.75vw, 53px);
  }
  @media (max-width: 760px) {
    font-size: clamp(37px, 7.6vw, 52px);
    margin-top: 40px !important;
  }
`;
export const StoryText = styled.p`
  margin-top: 43px !important;
  font-size: 13px;
  font-weight: 300;
  line-height: 2.05;
  color: #c7d6cd;
  letter-spacing: -0.02em;
  @media (max-width: 760px) {
    margin-top: 31px !important;
  }
`;
export const StoryLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 18px;
  padding-bottom: 9px;
  margin-top: 48px;
  border-bottom: 1px solid rgba(223, 234, 225, 0.52);
  color: #ecf2e8 !important;
  font-size: 12px;
  font-weight: 400;
  transition:
    gap 0.32s ease,
    border-color 0.32s ease;
  span {
    font-size: 16px;
  }
  &:hover {
    gap: 27px;
    border-color: #fff;
  }
`;
export const StoryPhoto = styled.figure`
  position: relative;
  overflow: hidden;
  background: #6b7162;
  min-height: 580px;
  img {
    object-fit: cover;
    object-position: center;
    filter: saturate(0.76) contrast(0.95);
  }
  @media (max-width: 760px) {
    min-height: 465px;
  }
`;
export const StoryPhotoShade = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 28%,
    rgba(12, 29, 22, 0.44) 100%
  );
`;
export const StoryPhotoCopy = styled.p`
  position: absolute;
  left: clamp(38px, 5vw, 90px);
  bottom: 76px;
  color: #fff;
  font: 400 clamp(28px, 2.7vw, 46px)/1.5 ${serif};
  letter-spacing: -0.05em;
`;
export const StoryNumber = styled.span`
  position: absolute;
  right: 32px;
  bottom: 28px;
  color: #e0e9dd;
  font: 12px ${latin};
`;

export const Container = styled.div`
  width: min(calc(100% - clamp(48px, 10vw, 180px)), 1540px);
  margin: 0 auto;
  @media (max-width: 760px) {
    width: calc(100% - 48px);
  }
`;
export const Values = styled.section`
  padding: clamp(110px, 9vw, 160px) 0 clamp(120px, 9vw, 165px);
  background: #fbfaf7;
  @media (max-width: 760px) {
    padding: 94px 0 100px;
  }
`;
export const ValuesHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: start;
  }
`;
export const SectionEyebrow = styled.p<{ $light?: boolean }>`
  color: ${({ $light }) => ($light ? "#e4e6dc" : "#7a8c7d")};
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.18em;
`;
export const ValuesHeading = styled.h2`
  margin-top: 30px !important;
  color: ${ink};
  font: 400 clamp(34px, 3.1vw, 58px)/1.5 ${serif};
  letter-spacing: -0.066em;
  word-break: keep-all;
  @media (max-width: 760px) {
    font-size: 36px;
  }
`;
export const ValuesIntro = styled.p`
  padding-bottom: 7px;
  color: #65736a;
  font-size: 12px;
  line-height: 1.95;
  font-weight: 300;
  letter-spacing: -0.02em;
`;
export const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(17px, 2.3vw, 40px);
  margin-top: clamp(58px, 5.3vw, 85px);
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 58px;
  }
`;
export const ValueCard = styled.article`
  min-width: 0;
`;
export const ValuePhoto = styled.figure`
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1.15;
  background: #ddd8ca;
  img {
    object-fit: cover;
    filter: saturate(0.76);
    transition: filter 0.65s ease;
  }
  &:hover img {
    filter: saturate(0.97);
  }
  @media (max-width: 760px) {
    aspect-ratio: 1.38;
  }
`;
export const ValueIndex = styled.span`
  position: absolute;
  left: 22px;
  bottom: 19px;
  color: #fff;
  font: 400 38px ${latin};
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.15);
`;
export const ValuePhotoArrow = styled.span`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 50%;
  color: #fff;
  font-size: 15px;
  transition: transform 0.35s ease;
  ${ValueCard}:hover & {
    transform: translate(2px, -2px);
  }
`;
export const ValueMeta = styled.div`
  margin-top: 23px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #87978b;
  font: 12px ${latin};
  span {
    width: 25px;
    height: 1px;
    background: #b9c6b6;
  }
`;
export const ValueEnglish = styled.h3`
  margin-top: 10px !important;
  font: 400 clamp(41px, 3.8vw, 67px)/1.02 ${latin};
  letter-spacing: -0.05em;
  color: #24372c;
`;
export const ValueKorean = styled.p`
  margin-top: 13px !important;
  font-size: 16px;
  font-weight: 500;
  color: #344d3a;
  letter-spacing: -0.045em;
`;
export const ValueDescription = styled.p`
  margin-top: 15px !important;
  max-width: 350px;
  color: #6b786c;
  font-size: 12px;
  font-weight: 300;
  line-height: 1.95;
  word-break: keep-all;
`;

export const Space = styled.section`
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: clamp(510px, 46vw, 725px);
  overflow: hidden;
  color: #fff;
  background: #5f675b;
  @media (max-width: 760px) {
    min-height: 585px;
    align-items: flex-end;
  }
`;
export const SpaceImage = styled.div`
  position: absolute;
  z-index: -2;
  inset: 0;
  img {
    object-fit: cover;
    object-position: center 55%;
    filter: saturate(0.8) brightness(0.94);
  }
`;
export const SpaceVeil = styled.div`
  position: absolute;
  z-index: -1;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(7, 17, 12, 0.06) 0%,
    rgba(14, 30, 23, 0.18) 40%,
    rgba(17, 30, 23, 0.68) 100%
  );
  @media (max-width: 760px) {
    background: linear-gradient(
      0deg,
      rgba(16, 29, 22, 0.86),
      rgba(16, 29, 22, 0.04) 100%
    );
  }
`;
export const SpaceContent = styled.div`
  width: min(560px, 45%);
  margin: 0 clamp(65px, 9vw, 175px) 0 25px;
  @media (max-width: 760px) {
    width: auto;
    margin: 0 25px 78px;
  }
`;
export const SpaceTitle = styled.h2`
  margin-top: 35px !important;
  font: 400 clamp(33px, 3vw, 57px)/1.58 ${serif};
  letter-spacing: -0.065em;
  word-break: keep-all;
  @media (max-width: 760px) {
    font-size: clamp(32px, 7vw, 45px);
  }
`;
export const SpaceDescription = styled.p`
  margin-top: 27px !important;
  color: #e7e9e0;
  font-size: 12px;
  font-weight: 300;
  line-height: 2;
  word-break: keep-all;
  @media (max-width: 760px) {
    br {
      display: none;
    }
  }
`;
export const SpaceLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.7);
  padding-bottom: 9px;
  margin-top: 34px;
  color: #fff !important;
  font-size: 12px;
  transition: gap 0.3s ease;
  &:hover {
    gap: 26px;
  }
  span {
    font-size: 16px;
  }
`;

export const Closing = styled.section`
  background: #1b3528;
  color: #f5f3ec;
`;
export const ClosingInner = styled.div`
  width: min(calc(100% - clamp(48px, 10vw, 180px)), 1540px);
  margin: 0 auto;
  padding: clamp(67px, 6vw, 108px) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 40px;
  }
  @media (max-width: 760px) {
    width: calc(100% - 48px);
    padding: 80px 0 88px;
  }
`;
export const ClosingCopy = styled.div`
  min-width: 0;
`;
export const ClosingTitle = styled.h2`
  font: 400 clamp(26px, 2.45vw, 43px)/1.58 ${serif};
  letter-spacing: -0.06em;
  word-break: keep-all;
  @media (max-width: 760px) {
    font-size: clamp(26px, 6.4vw, 39px);
  }
`;
export const ClosingSmall = styled.p`
  margin-top: 24px !important;
  font: 11px ${latin};
  letter-spacing: 0.19em;
  color: #a9c0ad;
`;
export const ClosingActions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: none;
  @media (max-width: 500px) {
    width: 100%;
    flex-direction: column;
  }
`;
const action = `
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 35px;
  min-width: 194px;
  padding: 17px 21px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  transition: transform .3s ease, background .3s ease, border-color .3s ease;
  span { font-size: 16px; line-height: 1; }
  &:hover { transform: translateY(-3px); }
  @media (max-width: 500px) { width: 100%; }
`;
export const ContactLink = styled.a`
  ${action}
  background: #f8f6ef;
  border: 1px solid #f8f6ef;
  color: #193a32 !important;
  &:hover {
    background: #e1e9de;
  }
`;
export const LocationLink = styled.a`
  ${action}
  background: transparent;
  border: 1px solid rgba(245, 249, 241, 0.5);
  color: #f8f6ef !important;
  &:hover {
    border-color: #f8f6ef;
    background: rgba(255, 255, 255, 0.08);
  }
`;
