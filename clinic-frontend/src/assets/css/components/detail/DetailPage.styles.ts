import styled from 'styled-components';

import * as QA from '@/components/QuaAccordion/Accordion.style';

const colors = {
  forest: "#213a30",
  deep: "#132920",
  cream: "#f8f7f2",
  sage: "#7c967c",
  text: "#263a30",
  muted: "#78877c",
};

export const PageRoot = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
  overflow: clip;
  background: ${colors.cream};
  color: ${colors.text};
  isolation: isolate;
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  button,
  a {
    -webkit-tap-highlight-color: transparent;
  }
  button:focus-visible,
  a:focus-visible,
  summary:focus-visible {
    outline: 3px solid #91b7a0;
    outline-offset: 4px;
  }
`;

export const Main = styled.main`
  width: 100%;
  min-width: 0;
`;

export const Hero = styled.section`
  position: relative;
  display: flex;
  align-items: flex-end;
  isolation: isolate;
  min-height: 760px;
  min-height: 94svh;
  width: 100%;
  overflow: hidden;
  background: #172e24;
  color: white;
  @media (max-width: 768px) {
    min-height: 690px;
    min-height: 92svh;
    align-items: flex-end;
  }
`;

export const HeroVisual = styled.div`
  position: absolute;
  inset: 0;
  z-index: -2;
  transform-origin: center center;
  & > img {
    object-fit: cover;
    object-position: center;
  }
`;

export const HeroShade = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    linear-gradient(
      90deg,
      rgba(10, 31, 21, 0.56),
      rgba(15, 39, 27, 0.15) 52%,
      transparent 88%
    ),
    linear-gradient(0deg, rgba(8, 28, 20, 0.58), transparent 31%);
  @media (max-width: 768px) {
    background: linear-gradient(
      0deg,
      rgba(8, 26, 20, 0.94),
      rgba(12, 34, 25, 0.56) 48%,
      rgba(16, 40, 28, 0.14)
    );
  }
`;

export const HeroInner = styled.div`
  position: relative;
  width: min(calc(100% - 76px), 1520px);
  padding: 0 0 110px;
  margin: 0 auto;
  text-shadow: 0 6px 35px rgba(0, 0, 0, 0.17);
  @media (max-width: 768px) {
    width: calc(100% - 42px);
    padding: 0 0 95px;
  }
`;

export const HeroEyebrow = styled.p`
  margin: 0 0 24px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.38em;
  color: rgba(255, 255, 255, 0.84);
  @media (max-width: 768px) {
    font-size: 10px;
    letter-spacing: 0.25em;
  }
`;

export const HeroTitle = styled.h1`
  margin: 0;
  max-width: 800px;
  font-size: clamp(48px, 5.65vw, 88px);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.065em;
  word-break: keep-all;
  @media (max-width: 768px) {
    font-size: clamp(42px, 9vw, 66px);
  }
`;

export const HeroLine = styled.div`
  width: 50px;
  height: 1px;
  background: rgba(255, 255, 255, 0.58);
  margin-top: 32px;
`;

export const HeroDesc = styled.p`
  margin: 24px 0 0;
  max-width: 550px;
  color: rgba(255, 255, 255, 0.87);
  font-size: clamp(14px, 1.24vw, 18px);
  font-weight: 400;
  line-height: 1.9;
  white-space: pre-line;
  word-break: keep-all;
`;

export const HeroPoints = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  margin-top: 42px;
  max-width: 550px;
  @media (max-width: 480px) {
    margin-top: 32px;
  }
`;

export const HeroPoint = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  gap: 11px;
  padding: 0 10px;
  text-align: center;
  border-right: 1px solid rgba(255, 255, 255, 0.21);
  color: rgba(255, 255, 255, 0.86);
  &:first-child {
    padding-left: 0;
  }
  &:last-child {
    border-right: 0;
  }
  svg {
    width: 24px;
    height: 24px;
    stroke-width: 1.25;
  }
  span {
    font-size: 12px;
    word-break: keep-all;
  }
  @media (max-width: 480px) {
    span {
      font-size: 10px;
    }
    svg {
      width: 22px;
    }
  }
`;

export const HeroScroll = styled.a`
  position: absolute;
  right: clamp(22px, 4.5vw, 75px);
  bottom: 37px;
  display: inline-flex;
  align-items: center;
  gap: 15px;
  color: rgba(255, 255, 255, 0.86);
  font-size: 10px;
  letter-spacing: 0.24em;
  text-decoration: none;
  svg {
    width: 18px;
    height: 18px;
  }
  @media (max-width: 768px) {
    bottom: 25px;
    font-size: 9px;
  }
`;

export const EditorialSection = styled.section<{
  $tone?: "cream" | "mist" | "dark";
}>`
  width: 100%;
  padding: clamp(86px, 9.5vw, 144px) 0;
  scroll-margin-top: 85px;
  background: ${({ $tone }) =>
    $tone === "mist" ? "#f0f1eb" : $tone === "dark" ? "#1b3528" : colors.cream};
  color: ${({ $tone }) => ($tone === "dark" ? "#fff" : colors.text)};
  @media (max-width: 768px) {
    padding: 82px 0;
    scroll-margin-top: 70px;
  }
`;

export const Content = styled.div`
  width: min(calc(100% - 80px), 1510px);
  margin: 0 auto;
  padding-left: clamp(225px, 16vw, 258px);
  @media (max-width: 768px) {
    width: calc(100% - 40px);
    padding-left: 0;
  }
`;

export const Label = styled.p<{ $light?: boolean }>`
  margin: 0 0 19px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.28em;
  color: ${({ $light }) => ($light ? "#a9c3ab" : "#668875")};
`;

export const Title = styled.h2<{ $light?: boolean }>`
  margin: 0;
  color: ${({ $light }) => ($light ? "#fff" : colors.text)};
  font-size: clamp(32px, 3.6vw, 56px);
  font-weight: 500;
  line-height: 1.26;
  letter-spacing: -0.055em;
  word-break: keep-all;
`;

export const Description = styled.p<{ $light?: boolean }>`
  margin: 0;
  color: ${({ $light }) => ($light ? "rgba(255,255,255,.75)" : "#66776d")};
  font-size: clamp(15px, 1.1vw, 17px);
  font-weight: 400;
  line-height: 2;
  white-space: pre-line;
  word-break: keep-all;
`;

export const IntroGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.18fr);
  gap: clamp(40px, 5vw, 90px);
  align-items: center;
  @media (max-width: 1050px) {
    gap: 35px;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 38px;
  }
`;

export const IntroText = styled.div`
  ${Title} {
    margin-bottom: 30px;
  }
  ${Description} + ${Description} {
    margin-top: 12px;
  }
`;

export const IntroVisual = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 1.22 / 1;
  min-height: 340px;
  border-radius: 2px 86px 2px 2px;
  background: #cdd8ce;
  box-shadow: 0 26px 64px rgba(21, 45, 29, 0.09);
  img {
    object-fit: cover;
    object-position: center 42%;
  }
  @media (max-width: 768px) {
    min-height: 290px;
    border-radius: 2px 52px 2px 2px;
  }
`;

export const IntroMark = styled.span`
  position: absolute;
  z-index: 1;
  right: 24px;
  bottom: 20px;
  color: #fff;
  font-size: clamp(19px, 2vw, 30px);
  font-family: Georgia, serif;
  font-style: italic;
  letter-spacing: -0.04em;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

export const FeaturesHeading = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 42px;
  ${Description} {
    max-width: 320px;
    text-align: right;
  }
  @media (max-width: 768px) {
    display: block;
    ${Description} {
      margin-top: 20px;
      text-align: left;
    }
  }
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 222px;
  padding: 30px 20px;
  border-radius: 9px;
  border: 1px solid rgba(38, 71, 48, 0.05);
  background: rgba(255, 255, 255, 0.91);
  box-shadow: 0 10px 30px rgba(30, 51, 36, 0.035);
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 22px 45px rgba(30, 51, 36, 0.085);
  }
  svg {
    color: #36644c;
    width: 34px;
    height: 34px;
    stroke-width: 1.35;
    margin-bottom: 23px;
  }
  h3 {
    margin: 0;
    color: ${colors.text};
    font-size: 17px;
    line-height: 1.6;
    font-weight: 600;
    word-break: keep-all;
  }
  span {
    margin-top: 12px;
    color: #9aaba0;
    font-size: 10px;
    letter-spacing: 0.13em;
  }
  @media (max-width: 768px) {
    min-height: 180px;
  }
`;

export const ProcessHeading = styled.div`
  display: flex;
  gap: 55px;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 53px;
  ${Description} {
    max-width: 400px;
  }
  @media (max-width: 768px) {
    display: block;
    ${Description} {
      margin-top: 18px;
    }
  }
`;

export const ProcessGrid = styled.ol`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 23px;
  padding: 0;
  margin: 0;
  list-style: none;
  &::before {
    content: "";
    position: absolute;
    height: 1px;
    background: rgba(213, 231, 218, 0.28);
    top: 52px;
    left: 6%;
    right: 6%;
  }
  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    &::before {
      display: none;
    }
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ProcessItem = styled.li`
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.65);
    font-size: 12px;
    line-height: 1.8;
  }
  h3 {
    margin: 0;
    color: #fff;
    font-size: 17px;
    font-weight: 500;
    line-height: 1.6;
    word-break: keep-all;
  }
`;

export const ProcessDisc = styled.div`
  width: 105px;
  height: 105px;
  margin-bottom: 7px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: radial-gradient(circle at 27% 25%, #557b60, #294d38 65%, #203d30);
  box-shadow:
    0 0 0 7px #1b3528,
    0 0 0 8px rgba(195, 217, 198, 0.23);
  color: #eff5e9;
  svg {
    width: 31px;
    height: 31px;
    stroke-width: 1.25;
  }
`;

export const ProcessNumber = styled.span`
  position: absolute;
  z-index: 2;
  top: -7px;
  left: calc(50% - 63px);
  width: 33px;
  height: 33px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #638867;
  color: #fff;
  font-family: Georgia, serif;
  font-size: 13px;
`;

export const GalleryHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  margin-bottom: 32px;
  @media (max-width: 768px) {
    align-items: start;
  }
`;

export const GalleryControls = styled.div`
  display: flex;
  gap: 8px;
  button {
    background: transparent;
    color: #355341;
    border: 1px solid rgba(42, 78, 51, 0.38);
    width: 41px;
    height: 41px;
    border-radius: 50%;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition:
      background 0.2s,
      color 0.2s;
    &:hover {
      background: #355341;
      color: white;
    }
  }
`;

export const GalleryTrack = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  gap: 16px;
  scrollbar-width: thin;
  scrollbar-color: #91a99a transparent;
  padding-bottom: 18px;
`;

export const GalleryCard = styled.figure`
  flex: 0 0 clamp(260px, 37%, 470px);
  margin: 0;
  scroll-snap-align: start;
  @media (max-width: 768px) {
    flex-basis: min(80vw, 360px);
  }
  figcaption {
    font-size: 12px;
    margin-top: 12px;
    color: #7d8e81;
    line-height: 1.6;
  }
`;

export const GalleryVisual = styled.div`
  position: relative;
  aspect-ratio: 1.28;
  overflow: hidden;
  background: #dce3d9;
  border-radius: 6px;
  img {
    object-fit: cover;
  }
`;

export const FinePrint = styled.p<{ $light?: boolean }>`
  margin: 21px 0 0;
  color: ${({ $light }) => ($light ? "rgba(255,255,255,.72)" : "#849189")};
  font-size: 12px;
  line-height: 1.8;
`;

export const FaqGrid = styled.div`
  display: grid;
  grid-template-columns: 0.55fr 1fr;
  gap: clamp(40px, 5vw, 80px);
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

/**
 * Localized tuning of the existing QuaAccordion styles.
 * Keeps the global /qna page and its component/CSS untouched.
 */
export const FaqAccordionArea = styled.div`
  min-width: 0;
  width: 100%;
  ${QA.AccordionContainer} {
    padding: 0;
    border: 0;
    gap: 11px;
  }
  ${QA.ItemContainer} {
    border-color: rgba(40, 75, 55, 0.15);
    background: #fffefa;
    border-radius: 13px;
    box-shadow: none;
    &:hover {
      border-color: #8daa91;
    }
  }
  ${QA.AccordionHeader} {
    padding: 21px clamp(17px, 2vw, 25px);
  }
  ${QA.QuestionText} {
    font-size: 14px;
    font-weight: 500;
    color: #2a4936;
  }
  ${QA.QPrefix} {
    color: #6d896f;
  }
  ${QA.ToggleIcon} {
    width: 27px;
    height: 27px;
  }
  ${QA.AnswerContent} {
    margin: 0 24px;
    padding: 20px 0 25px;
  }
  ${QA.AnswerText} {
    font-size: 13.5px;
    line-height: 1.9;
    white-space: pre-line;
  }
  @media (max-width: 768px) {
    ${QA.AnswerContent} {
      margin: 0 17px;
    }
    ${QA.QuestionText} {
      font-size: 13.5px;
    }
  }
`;

export const CtaPanel = styled.div`
  position: relative;
  padding: clamp(30px, 5vw, 76px) 24px clamp(18px, 3vw, 42px);
  text-align: center;
  color: #fff;
  border-top: 1px solid rgba(235, 244, 233, 0.18);
  ${Title} {
    color: #fff;
    margin: 14px auto 22px;
  }
  ${Description} {
    color: rgba(255, 255, 255, 0.78);
    margin: 0 auto;
    max-width: 640px;
  }
`;

export const CtaButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 16px 28px;
  margin-top: 38px;
  min-height: 52px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.62);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    color 0.2s,
    background 0.2s;
  &:hover {
    background: #fff;
    color: #1d3d2c;
  }
`;

export const EmptyMedia = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: #6e8972;
  background: linear-gradient(145deg, #dfe9dc, #c8d8c7);
  span {
    font:
      italic 28px Georgia,
      serif;
    letter-spacing: 0.1em;
  }
`;
