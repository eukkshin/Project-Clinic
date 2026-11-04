"use client";

import Link from "next/link";
import styled from "styled-components";

const forest = "#213d30";
const forestDeep = "#193529";
const body = "#586b5d";
const cream = "#f7f5ef";
const serif = 'var(--ahns-display, "Cormorant Garamond", Georgia, serif)';
const sans = 'var(--ahns-body, "Pretendard Variable", sans-serif)';

export const Page = styled.main`
  width: 100%;
  overflow: clip;
  color: ${forest};
  background: ${cream};
  font-family: ${sans};
  -webkit-font-smoothing: antialiased;
  & * {
    box-sizing: border-box;
  }
  h1,
  h2,
  h3,
  p {
    margin: 0;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  a:focus-visible {
    outline: 2px solid #789781;
    outline-offset: 5px;
  }
`;

export const Hero = styled.section`
  position: relative;
  isolation: isolate;
  min-height: 650px;
  padding: clamp(156px, 15vw, 205px) clamp(22px, 6vw, 96px) 56px;
  background:
    radial-gradient(
      ellipse 52% 80% at 100% 21%,
      rgba(167, 184, 149, 0.19),
      transparent 80%
    ),
    linear-gradient(115deg, #fbfaf6 0%, #f3f0e6 65%, #eeeadd 100%);
  overflow: hidden;
  @media (max-width: 960px) {
    min-height: 570px;
  }
  @media (max-width: 680px) {
    padding: 134px 22px 32px;
    min-height: 630px;
  }
`;
export const HeroInner = styled.div`
  width: min(100%, 1260px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  align-items: center;
  gap: clamp(25px, 4vw, 76px);
  position: relative;
  z-index: 1;
  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
export const HeroCopy = styled.div`
  position: relative;
  z-index: 2;
`;
export const Eyebrow = styled.p`
  display: flex;
  align-items: center;
  gap: 13px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: #6d8271;
  text-transform: uppercase;
  margin-bottom: 30px !important;
  word-break: keep-all;
`;
export const EyebrowRule = styled.span`
  flex: 0 0 28px;
  height: 1px;
  background: #8ba38c;
`;
export const HeroTitle = styled.h1`
  font-weight: 500;
  font-size: clamp(37px, 4.4vw, 67px);
  line-height: 1.22;
  letter-spacing: -0.065em;
  word-break: keep-all;
`;
export const HeroAccent = styled.p`
  margin-top: 9px !important;
  color: #77917d;
  font: italic 400 clamp(39px, 5.6vw, 88px) / 1.05 ${serif};
  letter-spacing: -0.055em;
  max-width: 740px;
`;
export const HeroLead = styled.p`
  max-width: 550px;
  color: ${body};
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.95;
  margin-top: 33px !important;
  word-break: keep-all;
`;
export const HeroActions = styled.nav`
  display: flex;
  flex-wrap: wrap;
  column-gap: 25px;
  row-gap: 13px;
  margin-top: 33px;
`;
export const HeroAnchor = styled.a<{ $secondary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 17px;
  min-height: 48px;
  padding: 0 ${({ $secondary }) => ($secondary ? "0" : "22px")};
  border: 1px solid ${({ $secondary }) => ($secondary ? "transparent" : forest)};
  background: ${({ $secondary }) => ($secondary ? "transparent" : forest)};
  color: ${({ $secondary }) => ($secondary ? forest : "#fff")} !important;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition:
    background 0.28s ease,
    color 0.28s ease,
    transform 0.28s ease;
  &:hover {
    transform: translateY(-2px);
    background: ${({ $secondary }) => ($secondary ? "transparent" : "#345b44")};
  }
  & span {
    font-size: 16px;
  }
  @media (max-width: 500px) {
    font-size: 11px;
  }
`;
export const HeroArt = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  width: min(100%, 425px);
  justify-self: end;
  display: grid;
  place-items: center;
  @media (max-width: 800px) {
    position: absolute;
    right: -68px;
    bottom: -90px;
    width: 260px;
    opacity: 0.23;
    z-index: -1;
    pointer-events: none;
  }
  @media (max-width: 460px) {
    width: 225px;
    right: -76px;
    bottom: -120px;
  }
`;
export const ArtRing = styled.div<{ $first?: boolean }>`
  position: absolute;
  inset: ${({ $first }) => ($first ? "0" : "14%")};
  border: 1px solid
    ${({ $first }) =>
      $first ? "rgba(68, 97, 73, .27)" : "rgba(68, 97, 73, .16)"};
  border-radius: 50%;
  &::after {
    content: "";
    position: absolute;
    width: 6px;
    height: 6px;
    top: 14%;
    left: 15%;
    border-radius: 50%;
    background: #769079;
  }
`;
export const ArtMonogram = styled.div`
  transform: translateY(-12px);
  font: italic 400 clamp(150px, 18vw, 265px)/0.9 ${serif};
  color: rgba(60, 92, 69, 0.67);
  user-select: none;
`;
export const ArtSignature = styled.div`
  position: absolute;
  bottom: 13%;
  right: 2%;
  font-size: 10px;
  letter-spacing: 0.23em;
  line-height: 1.8;
  color: #809180;
  text-align: right;
`;
export const HeroBottom = styled.div`
  width: min(100%, 1260px);
  position: relative;
  z-index: 1;
  margin: 70px auto 0;
  padding-top: 18px;
  display: flex;
  gap: 30px;
  border-top: 1px solid rgba(32, 60, 45, 0.14);
  font-size: 10px;
  letter-spacing: 0.15em;
  color: #7f9281;
  @media (max-width: 680px) {
    margin-top: 80px;
    font-size: 9px;
    flex-wrap: wrap;
    gap: 16px;
  }
`;
export const RightsSection = styled.section`
  padding: clamp(74px, 9vw, 132px) clamp(22px, 6vw, 96px)
    clamp(92px, 10vw, 148px);
  scroll-margin-top: 90px;
`;
export const SectionInner = styled.div`
  width: min(100%, 1200px);
  margin: 0 auto;
`;
export const SectionIntro = styled.div`
  max-width: 820px;
  margin-bottom: clamp(34px, 5vw, 62px);
`;
export const SectionMeta = styled.p<{ $light?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: ${({ $light }) => ($light ? "#b8cbb8" : "#76907a")};
  & span {
    font-family: ${serif};
    font-size: 28px;
    font-style: italic;
    letter-spacing: 0;
  }
`;
export const MetaLine = styled.span`
  flex: 0 0 27px;
  height: 1px;
  background: currentColor;
`;
export const SectionTitle = styled.h2`
  margin-top: 19px !important;
  font-size: clamp(35px, 4.2vw, 56px);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.055em;
  word-break: keep-all;
`;
export const SectionDescription = styled.p`
  margin-top: 16px !important;
  color: #778b7a;
  font-size: 15px;
  line-height: 1.8;
  word-break: keep-all;
`;
export const RightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;
export const RightsCard = styled.article`
  position: relative;
  min-height: 298px;
  padding: clamp(27px, 3.4vw, 47px);
  background: #fffefa;
  border: 1px solid rgba(39, 76, 55, 0.11);
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(31, 65, 45, 0.08);
    border-color: rgba(44, 80, 56, 0.28);
  }
  @media (max-width: 720px) {
    min-height: 240px;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`;
export const CardTop = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 36px;
`;
export const CardNumber = styled.span`
  font: italic 400 42px/0.9 ${serif};
  color: #95ab92;
`;
export const CardMark = styled.span`
  color: #9db49d;
  font-size: 19px;
  opacity: 0.75;
`;
export const CardTitle = styled.h3`
  color: ${forest};
  font-size: clamp(19px, 1.75vw, 24px);
  font-weight: 600;
  line-height: 1.55;
  letter-spacing: -0.035em;
  word-break: keep-all;
`;
export const CardBody = styled.p`
  margin-top: 16px !important;
  max-width: 480px;
  color: #607565;
  font-size: 14px;
  line-height: 2;
  word-break: keep-all;
  white-space: pre-line;
  overflow-wrap: anywhere;
`;
export const CardBottomLine = styled.span`
  display: block;
  margin-top: 28px;
  width: 38px;
  height: 1px;
  background: #a8bda8;
`;
export const DutiesSection = styled.section`
  position: relative;
  isolation: isolate;
  padding: clamp(83px, 9vw, 134px) clamp(22px, 6vw, 96px)
    clamp(96px, 10vw, 150px);
  background: ${forestDeep};
  color: #f5f3e9;
  scroll-margin-top: 90px;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    width: 690px;
    height: 690px;
    border-radius: 50%;
    border: 1px solid rgba(198, 215, 186, 0.1);
    right: -260px;
    top: -350px;
    pointer-events: none;
    box-shadow:
      0 0 0 90px rgba(197, 209, 187, 0.015),
      0 0 0 180px rgba(197, 209, 187, 0.01);
    z-index: -1;
  }
`;
export const DutiesInner = styled.div`
  width: min(100%, 1200px);
  margin: 0 auto;
`;
export const DutiesIntro = styled.div`
  margin-bottom: clamp(36px, 5vw, 61px);
`;
export const DutiesTitle = styled.h2`
  margin-top: 22px !important;
  font-size: clamp(35px, 4.2vw, 56px);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 1.25;
`;
export const DutiesDescription = styled.p`
  margin-top: 14px !important;
  color: #b9cbb9;
  font-size: 15px;
  line-height: 1.8;
  word-break: keep-all;
`;
export const DutiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
  @media (max-width: 930px) {
    grid-template-columns: 1fr;
  }
`;
export const DutyCard = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 317px;
  padding: clamp(29px, 3vw, 43px);
  border: 1px solid rgba(219, 231, 212, 0.2);
  background: rgba(255, 255, 255, 0.045);
  transition:
    background 0.3s ease,
    transform 0.3s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.075);
    transform: translateY(-4px);
  }
  @media (max-width: 930px) {
    min-height: 235px;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`;
export const DutyNumber = styled.span`
  font: italic 400 43px/0.95 ${serif};
  color: #adc2ab;
  margin-bottom: 47px;
  @media (max-width: 930px) {
    margin-bottom: 22px;
  }
`;
export const DutyTitle = styled.h3`
  color: #f6f4eb;
  font-size: 20px;
  line-height: 1.5;
  font-weight: 500;
  letter-spacing: -0.025em;
  word-break: keep-all;
`;
export const DutyBody = styled.p`
  color: #c9d7c8;
  font-size: 14px;
  line-height: 1.95;
  margin-top: 15px !important;
  margin-bottom: 30px !important;
  white-space: pre-line;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;
export const DutyArrow = styled.span`
  display: block;
  margin-top: auto;
  font-size: 19px;
  color: #c3d0bd;
  text-align: right;
`;
export const ClosingSection = styled.section`
  background: #f6f3eb;
  padding: clamp(72px, 9vw, 125px) clamp(22px, 6vw, 96px) 104px;
`;
export const ClosingInner = styled.div`
  width: min(100%, 1050px);
  margin: 0 auto;
  text-align: center;
`;
export const ClosingHeadline = styled.h2`
  font: italic 400 clamp(49px, 6vw, 83px)/1.05 ${serif};
  letter-spacing: -0.05em;
  color: #6e8b73;
`;
export const ClosingText = styled.p`
  max-width: 655px;
  margin: 20px auto 0 !important;
  color: #526e5b;
  line-height: 1.95;
  font-size: 14px;
  word-break: keep-all;
`;
export const DraftNote = styled.aside`
  margin: 76px auto 0;
  padding: 24px 26px;
  text-align: left;
  border: 1px solid rgba(53, 89, 63, 0.2);
  background: rgba(255, 255, 255, 0.48);
  color: #66796a;
  font-size: 12px;
  line-height: 1.85;
  & strong {
    display: block;
    color: #334d3a;
    font-weight: 600;
    margin-bottom: 7px;
  }
  & p + p {
    margin-top: 4px;
  }
`;
export const LegalNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  column-gap: 23px;
  row-gap: 12px;
  margin-top: 44px;
  padding-top: 25px;
  border-top: 1px solid rgba(36, 69, 53, 0.15);
`;
export const LegalLink = styled(Link)<{ $active: boolean }>`
  color: ${({ $active }) => ($active ? forest : "#738575")} !important;
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  line-height: 1.7;
  text-decoration: ${({ $active }) =>
    $active ? "underline" : "none"} !important;
  text-underline-offset: 5px;
  &:hover {
    text-decoration: underline !important;
  }
`;
export const BackHome = styled(Link)`
  display: inline-flex;
  gap: 14px;
  align-items: center;
  margin-top: 38px;
  padding-bottom: 8px;
  border-bottom: 1px solid #8aa28d;
  color: ${forest} !important;
  font-size: 12px;
  font-weight: 600;
  & span {
    font-size: 16px;
  }
  &:hover {
    color: #6b8d72 !important;
  }
`;
