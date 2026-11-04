"use client";

import Link from "next/link";
import styled from "styled-components";
import type { LegalKind } from "@/lib/legal/content";

const forest = "#213d30";
const darkForest = "#193529";
const cream = "#f7f5ef";
const muted = "#617568";
const line = "rgba(33, 61, 48, .15)";
const serif = 'var(--ahns-display, "Cormorant Garamond", Georgia, serif)';
const sans = 'var(--ahns-body, "Pretendard Variable", sans-serif)';

export const Page = styled.main`
  color: ${forest};
  background: ${cream};
  width: 100%;
  overflow: clip;
  font-family: ${sans};
  -webkit-font-smoothing: antialiased;
  & * { box-sizing: border-box; }
  & h1, & h2, & h3, & p { margin: 0; }
  & a { color: inherit; text-decoration: none; }
  & a:focus-visible { outline: 2px solid #8da68c; outline-offset: 4px; }
`;

export const Container = styled.div`
  width: min(100%, 1240px);
  margin: 0 auto;
`;

export const Hero = styled.header`
  position: relative;
  overflow: hidden;
  isolation: isolate;
  min-height: 620px;
  background: radial-gradient(ellipse at 90% 13%, rgba(164, 189, 155, .19), transparent 60%),
    linear-gradient(112deg, #fbfaf6 5%, #f3f0e6 66%, #edeade 100%);
  padding: clamp(144px, 14vw, 200px) clamp(22px, 6vw, 96px) 40px;
  @media (max-width: 780px) { min-height: 600px; padding-top: 139px; }
`;
export const HeroInner = styled(Container)`
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(290px, .75fr);
  align-items: center;
  gap: clamp(28px, 5vw, 80px);
  @media (max-width: 780px) { grid-template-columns: minmax(0, 1fr); }
`;
export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
`;
export const EyebrowRule = styled.span`
  width: 28px;
  flex: 0 0 28px;
  height: 1px;
  background: #90a790;
`;
export const Eyebrow = styled.p`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #748a79;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .15em;
  line-height: 1.8;
  margin-bottom: 30px !important;
  word-break: keep-all;
`;
export const HeroTitle = styled.h1`
  font-size: clamp(37px, 4.8vw, 67px);
  font-weight: 500;
  line-height: 1.22;
  letter-spacing: -.065em;
  word-break: keep-all;
`;
export const HeroScript = styled.p`
  font: italic 400 clamp(42px, 5.5vw, 89px)/1.1 ${serif};
  margin-top: 10px !important;
  letter-spacing: -.045em;
  color: #77907c;
  max-width: 760px;
`;
export const HeroLead = styled.p`
  margin-top: 30px !important;
  max-width: 660px;
  color: #5d7363;
  line-height: 1.95;
  font-size: clamp(14px, 1.2vw, 16px);
  word-break: keep-all;
`;
export const HeroAction = styled.a`
  display: inline-flex;
  min-height: 49px;
  margin-top: 34px;
  padding: 0 22px;
  gap: 20px;
  justify-content: space-between;
  align-items: center;
  background: ${forest};
  color: white !important;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .015em;
  transition: background .3s ease, transform .3s ease;
  & span { font-size: 17px; }
  &:hover { background: #355941; transform: translateY(-3px); }
`;
export const HeroArtwork = styled.div`
  position: relative;
  width: min(100%, 410px);
  aspect-ratio: 1;
  justify-self: end;
  display: grid;
  place-items: center;
  @media (max-width: 780px) {
    position: absolute;
    width: 280px;
    right: -84px;
    bottom: 10px;
    opacity: .22;
    z-index: -1;
    pointer-events: none;
  }
`;
export const ArtOuter = styled.div`
  position: absolute;
  inset: 0;
  border: 1px solid rgba(33, 61, 48, .24);
  border-radius: 50%;
  &::before { content: ""; position: absolute; top: 19%; left: 11%; width: 6px; height: 6px; border-radius: 50%; background: #9caf96; }
`;
export const ArtInner = styled.div`
  position: absolute;
  inset: 14%;
  border-radius: 50%;
  border: 1px solid rgba(33, 61, 48, .12);
`;
export const ArtLetter = styled.div`
  font: italic 400 clamp(170px, 18vw, 260px)/1 ${serif};
  color: rgba(59, 93, 69, .7);
  transform: translateY(-12px);
  user-select: none;
`;
export const ArtCaption = styled.div`
  position: absolute;
  right: 1%;
  bottom: 13%;
  color: #879a86;
  font-size: 10px;
  line-height: 1.75;
  letter-spacing: .22em;
  text-align: right;
`;
export const HeroFoot = styled(Container)`
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin-top: 74px;
  padding-top: 19px;
  border-top: 1px solid ${line};
  color: #859784;
  font-size: 10px;
  letter-spacing: .15em;
  word-break: keep-all;
  @media (max-width: 780px) { margin-top: 105px; flex-wrap: wrap; }
`;
export const IntroBand = styled.section`
  padding: clamp(58px, 7vw, 100px) clamp(22px, 6vw, 96px) clamp(46px, 5vw, 73px);
  scroll-margin-top: 92px;
`;
export const IntroHead = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 15px 24px;
  align-items: end;
  border-bottom: 1px solid ${line};
  padding-bottom: 34px;
`;
export const IntroKicker = styled.p`
  grid-column: 1 / -1;
  font-size: 11px;
  color: #7d9681;
  letter-spacing: .16em;
  & span { padding: 0 4px; }
`;
export const IntroTitle = styled.h2`
  font-size: clamp(27px, 3.4vw, 46px);
  line-height: 1.3;
  font-weight: 500;
  letter-spacing: -.05em;
  word-break: keep-all;
`;
export const IntroCount = styled.span`
  white-space: nowrap;
  color: #68816d;
  font: italic 400 clamp(40px, 5vw, 70px)/1 ${serif};
  & small { display: inline-block; max-width: 110px; font: 400 11px/1.5 ${sans}; font-style: normal; color: #7a907d; letter-spacing: .03em; }
`;
export const ReviewNote = styled.aside`
  margin-top: 32px;
  display: flex;
  align-items: flex-start;
  gap: 17px;
  padding: 22px 25px;
  background: #fffdf8;
  border: 1px solid rgba(43, 84, 57, .14);
`;
export const ReviewMarker = styled.span`
  flex: 0 0 26px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid #9eafa0;
  font: italic 19px ${serif};
  color: ${forest};
`;
export const ReviewCopy = styled.div`
  display: grid;
  gap: 8px;
  & strong { font-size: 13px; line-height: 1.65; color: ${forest}; font-weight: 600; }
  & span { color: #6b806f; font-size: 12px; line-height: 1.85; word-break: keep-all; }
`;
export const BodySection = styled.section<{ $variant: LegalKind }>`
  padding: 26px clamp(22px, 6vw, 96px) clamp(84px, 10vw, 140px);
  background: ${({ $variant }) => $variant === "terms" ? "#f3f2eb" : cream};
`;
export const ReadingLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(200px, .31fr) minmax(0, 1fr);
  gap: clamp(45px, 6vw, 100px);
  align-items: start;
  @media (max-width: 860px) { grid-template-columns: 1fr; gap: 33px; }
`;
export const IndexNav = styled.nav`
  @media (max-width: 860px) { border: 1px solid ${line}; padding: 24px; background: #fffdf9; }
`;
export const IndexSticky = styled.div`
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 130px);
  display: flex;
  flex-direction: column;
  @media (max-width: 860px) { position: static; max-height: 420px; }
`;
export const IndexEyebrow = styled.p`
  font: italic 400 27px/1 ${serif};
  color: #8aa08d;
  margin-bottom: 12px !important;
`;
export const IndexHeading = styled.h3`
  font-size: 14px;
  line-height: 1.5;
  font-weight: 600;
  color: ${forest};
  margin-bottom: 22px !important;
`;
export const IndexItems = styled.div`
  overflow-y: auto;
  padding-right: 8px;
  scrollbar-width: thin;
  scrollbar-color: #b8c5b5 transparent;
`;
export const IndexLink = styled.a`
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 11px 0;
  border-top: 1px solid ${line};
  font-size: 12px;
  line-height: 1.7;
  color: ${muted} !important;
  transition: color .2s ease, padding-left .2s ease;
  & span:first-child { flex: 0 0 21px; font: italic 18px/1.3 ${serif}; color: #8da68f; }
  &:hover { color: ${forest} !important; padding-left: 4px; }
`;
export const ArticleColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
export const ArticleCard = styled.article`
  padding: clamp(28px, 3vw, 44px);
  scroll-margin-top: 108px;
  border: 1px solid rgba(33, 61, 48, .13);
  background: #fffefa;
  transition: box-shadow .3s ease, border-color .3s ease, transform .3s ease;
  &:hover { box-shadow: 0 14px 40px rgba(39, 68, 45, .055); border-color: #a8baaa; transform: translateY(-2px); }
  @media (prefers-reduced-motion: reduce) { transition: none; &:hover { transform: none; } }
`;
export const ArticleHead = styled.div`
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  align-items: start;
  gap: 15px;
  padding-bottom: 23px;
  margin-bottom: 22px;
  border-bottom: 1px solid ${line};
  @media (max-width: 470px) { grid-template-columns: 1fr; gap: 10px; }
`;
export const ArticleNumber = styled.span`
  font: italic 400 44px/1 ${serif};
  color: #93ab95;
`;
export const ArticleHeading = styled.h3`
  font-size: clamp(19px, 2vw, 24px);
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -.035em;
  word-break: keep-all;
`;
export const ArticleBody = styled.p`
  color: #607367;
  font-size: clamp(13px, 1.05vw, 14px);
  line-height: 2.15;
  white-space: pre-line;
  overflow-wrap: anywhere;
  word-break: keep-all;
`;
export const TimelineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  @media (max-width: 740px) { grid-template-columns: 1fr; gap: 13px; }
`;
export const TimelineCard = styled.article`
  min-height: 300px;
  padding: clamp(30px, 4vw, 50px);
  background: #fffefa;
  border: 1px solid ${line};
  scroll-margin-top: 108px;
  display: flex;
  flex-direction: column;
  transition: transform .35s ease, box-shadow .35s ease;
  &:hover { transform: translateY(-5px); box-shadow: 0 17px 50px rgba(31, 61, 41, .08); }
  @media (max-width: 740px) { min-height: 245px; }
  @media (prefers-reduced-motion: reduce) { transition: none; &:hover { transform: none; } }
`;
export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 26px;
`;
export const CardNumber = styled.span`
  font: italic 400 53px/1 ${serif};
  color: #94ab94;
`;
export const CardIcon = styled.span`
  color: #9caf9c;
  font-size: 20px;
`;
export const CardTitle = styled.h3`
  margin-bottom: 13px !important;
  font-size: clamp(20px, 1.8vw, 24px);
  line-height: 1.55;
  letter-spacing: -.03em;
  font-weight: 600;
  word-break: keep-all;
`;
export const CardText = styled.p`
  color: #62776a;
  font-size: 14px;
  line-height: 2;
  white-space: pre-line;
  overflow-wrap: anywhere;
  word-break: keep-all;
`;
export const CardUnderline = styled.span`
  display: block;
  margin-top: auto;
  padding-top: 20px;
  width: 37px;
  border-bottom: 1px solid #aabdab;
`;
export const FeesSection = styled.section`
  padding: 0 clamp(22px, 6vw, 96px) 54px;
`;
export const FeesHeading = styled.h2`
  font-size: clamp(23px, 2.5vw, 36px);
  line-height: 1.4;
  font-weight: 500;
  letter-spacing: -.035em;
  margin-bottom: 16px !important;
`;
export const FeesDescription = styled.p`
  color: ${muted};
  font-size: 14px;
  line-height: 1.95;
  max-width: 850px;
  margin-bottom: 24px !important;
`;
export const FeesTableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${line};
  background: #fffefa;
`;
export const FeesTable = styled.table`
  width: 100%;
  min-width: 480px;
  border-collapse: collapse;
  text-align: left;
  & th { padding: 18px 23px; color: #edf4eb; background: ${darkForest}; font-size: 12px; font-weight: 500; letter-spacing: .03em; }
  & td { text-align: center; padding: 37px 22px; font-size: 13px; color: #697c6a; line-height: 1.8; }
`;
export const FeesWarning = styled.p`
  color: #7a7255;
  background: #f2eee2;
  border-left: 2px solid #b6a17a;
  padding: 20px 23px;
  font-size: 13px;
  line-height: 1.95;
  margin-top: 16px !important;
  word-break: keep-all;
`;
export const ClosingSection = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(85px, 9vw, 130px) clamp(22px, 6vw, 96px) clamp(65px, 7vw, 108px);
  background: ${darkForest};
  color: #f7f5ee;
  &::after { content: ""; position: absolute; width: 670px; height: 670px; border: 1px solid rgba(228, 235, 211, .1); border-radius: 50%; top: -400px; right: -230px; z-index: -1; pointer-events: none; }
`;
export const ClosingGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, .55fr);
  align-items: end;
  gap: 30px;
  border-bottom: 1px solid rgba(242, 246, 234, .2);
  padding-bottom: clamp(36px, 5vw, 68px);
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;
export const ClosingKicker = styled.p`
  font-size: 11px;
  letter-spacing: .2em;
  color: #a8c0a8;
  margin-bottom: 22px !important;
`;
export const ClosingTitle = styled.h2`
  font: italic 400 clamp(51px, 7.2vw, 112px)/.98 ${serif};
  letter-spacing: -.055em;
  color: #f1f0e7;
`;
export const ClosingDescription = styled.p`
  font-size: 14px;
  line-height: 2;
  color: #bed0bd;
  max-width: 365px;
  word-break: keep-all;
`;
export const OtherPolicies = styled.nav`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 11px;
  padding-top: 42px;
  @media (max-width: 850px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 510px) { grid-template-columns: 1fr; }
`;
export const PolicyLink = styled(Link)<{ $active: boolean }>`
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border: 1px solid ${({ $active }) => $active ? "rgba(235, 246, 227, .65)" : "rgba(235, 246, 227, .2)"};
  background: ${({ $active }) => $active ? "rgba(235, 246, 227, .12)" : "transparent"};
  padding: 16px 20px;
  font-size: 13px;
  line-height: 1.6;
  color: #e4ede0 !important;
  transition: border-color .3s ease, background .3s ease;
  & span:last-child { font-size: 18px; color: #a9c5ab; }
  &:hover { background: rgba(235, 246, 227, .1); border-color: rgba(235, 246, 227, .5); }
`;
export const BackHome = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 13px;
  color: #d8e8d4 !important;
  margin-top: 45px;
  border-bottom: 1px solid rgba(216, 232, 212, .7);
  padding-bottom: 8px;
  font-size: 12px;
  & span { font-size: 17px; }
`;

