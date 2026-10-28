import styled, { keyframes } from 'styled-components';

const ink = "#233c2e";
const dark = "#1b3528";
const cream = "#f5f3ed";
const hairline = "rgba(35, 60, 46, 0.17)";
const serif =
  '"Cormorant Garamond", "Baskerville", "Times New Roman", Georgia, serif';
const sans =
  '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';

const arrive = keyframes`
  from { opacity: 0; transform: translate3d(0, 20px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
`;

export const Main = styled.main`
  --brand-ink: ${ink};
  --brand-dark: ${dark};
  --brand-paper: ${cream};
  --brand-line: ${hairline};
  --brand-serif: ${serif};
  --brand-sans: ${sans};
  width: 100%;
  overflow: clip;
  background: ${cream};
  color: ${ink};
  font-family: ${sans};
  -webkit-font-smoothing: antialiased;

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
    outline: 2px solid #8b9d85;
    outline-offset: 5px;
  }

  /* JS가 활성화된 뒤에만 reveal을 적용 — JS 미실행 시 콘텐츠는 그대로 보입니다. */
  &[data-brand-motion="on"] [data-brand-reveal] {
    opacity: 0;
    transform: translate3d(0, 32px, 0);
    transition:
      opacity 900ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 1100ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  &[data-brand-motion="on"] [data-brand-reveal][data-brand-visible="true"] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  &[data-brand-motion="on"] [data-brand-reveal]:nth-child(2) {
    transition-delay: 100ms;
  }
  &[data-brand-motion="on"] [data-brand-reveal]:nth-child(3) {
    transition-delay: 180ms;
  }

  &[data-brand-motion="on"] [data-brand-parallax] img {
    transform: translate3d(0, var(--brand-parallax-y, 0px), 0) scale(1.075);
    transition:
      transform 170ms ease-out,
      filter 950ms ease;
    will-change: transform;
  }
  &[data-brand-motion="on"] [data-brand-parallax]:hover img {
    transform: translate3d(0, var(--brand-parallax-y, 0px), 0) scale(1.105);
  }

  @media (max-width: 768px) {
    &[data-brand-motion="on"] [data-brand-parallax] img {
      transform: none;
      will-change: auto;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    & *,
    & *::before,
    & *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
    &[data-brand-motion="on"] [data-brand-reveal],
    &[data-brand-motion="on"] [data-brand-parallax] img {
      opacity: 1 !important;
      transform: none !important;
      will-change: auto !important;
    }
  }
`;

export const Hero = styled.section`
  min-height: min(980px, 100svh);
  padding: 88px clamp(24px, 5.2vw, 100px) 0;
  background: #f4f2eb;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 768px) {
    min-height: auto;
    padding: 68px 0 0;
  }
`;

export const HeroNavigation = styled.div`
  position: absolute;
  z-index: 7;
  left: clamp(24px, 5.2vw, 100px);
  right: clamp(24px, 5.2vw, 100px);
  top: 89px; /* 공통 Header 아래: Hero 콘텐츠 시작 전 */
  @media (max-width: 768px) {
    left: 24px;
    right: 0;
    top: 73px;
  }
`;

export const HeroCanvas = styled.div`
  width: 100%;
  max-width: 1740px;
  margin: 0 auto;
  min-height: min(775px, calc(100svh - 146px));
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
  align-items: stretch;
  gap: clamp(20px, 2.8vw, 50px);
  padding-top: 35px; /* 상단 텍스트 내비게이션과 본문 분리 */

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: 14px;
    min-height: 670px;
  }
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-height: 0;
    padding-top: 46px;
  }
`;

export const HeroCopy = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  padding: clamp(42px, 5.4vw, 95px) 0 clamp(44px, 4.5vw, 76px);
  z-index: 2;

  @media (max-width: 768px) {
    padding: 48px 24px 44px;
  }
`;

export const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  white-space: nowrap;
  color: #51695a;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.19em;
  animation: ${arrive} 900ms 90ms both;
  @media (max-width: 420px) {
    font-size: 8px;
    gap: 9px;
  }
`;

export const FineDot = styled.span`
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #78947d;
  flex: none;
`;

export const EyebrowDivider = styled.span`
  width: 24px;
  height: 1px;
  background: #9db0a0;
  flex: none;
`;

export const HeroTitle = styled.h1`
  max-width: 1020px;
  margin: auto -9vw auto 0 !important;
  padding: 24px 0 38px;
  font-family: ${serif};
  font-weight: 400;
  font-size: clamp(86px, 9.6vw, 172px);
  line-height: 0.87;
  letter-spacing: -0.08em;
  color: #21392b;
  word-break: keep-all;
  overflow-wrap: break-word;
  white-space: nowrap;
  animation: ${arrive} 1.05s 220ms both;

  em {
    color: #78917a;
    font-style: italic;
    font-weight: 400;
    letter-spacing: -0.09em;
  }
  @media (max-width: 1350px) {
    font-size: clamp(77px, 8.7vw, 135px);
  }
  @media (max-width: 1100px) {
    font-size: clamp(68px, 9vw, 100px);
  }
  @media (max-width: 768px) {
    font-size: clamp(67px, 12vw, 112px);
    margin: 73px -10px 70px 0 !important;
    padding: 0;
    white-space: normal;
  }
  @media (max-width: 420px) {
    font-size: clamp(59px, 12vw, 78px);
    margin: 60px -8px 60px 0 !important;
  }
`;

export const HeroBottom = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  animation: ${arrive} 1s 400ms both;

  @media (max-width: 1100px) {
    align-items: start;
    flex-direction: column;
    gap: 25px;
  }
  @media (max-width: 768px) {
    gap: 28px;
  }
`;

export const HeroKorean = styled.p`
  font-size: clamp(22px, 1.6vw, 29px);
  font-weight: 400;
  line-height: 1.52;
  letter-spacing: -0.06em;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;
export const HeroDescription = styled.p`
  margin-top: 22px !important;
  font-size: 13px;
  font-weight: 300;
  line-height: 2;
  color: #647568;
  letter-spacing: -0.02em;
`;
export const DiscoverLink = styled.a`
  border-bottom: 1px solid #345440;
  padding-bottom: 12px;
  min-width: 190px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: none;
  gap: 15px;
  font-size: 10px;
  letter-spacing: 0.12em;
  font-weight: 600;
  transition:
    color 0.3s ease,
    border-color 0.3s ease;
  &:hover {
    color: #79917a;
    border-color: #79917a;
  }
  @media (max-width: 768px) {
    min-width: 180px;
    align-self: flex-start;
  }
`;
export const DiscoverIcon = styled.span`
  font-family: ${sans};
  font-size: 18px;
  font-weight: 300;
  line-height: 1;
`;

export const HeroVisual = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  padding-top: clamp(42px, 4.2vw, 70px);
  padding-right: clamp(10px, 2.6vw, 48px);
  padding-bottom: clamp(34px, 3.4vw, 65px);
  min-width: 0;
  animation: ${arrive} 1.2s 130ms both;

  @media (max-width: 768px) {
    height: min(118vw, 670px);
    padding: 0 22px 40px 58px;
  }
`;
export const HeroVisualBackdrop = styled.div`
  position: absolute;
  inset: 0 -7vw 0 30%;
  background: #dde4d6;
  opacity: 0.76;
  @media (max-width: 768px) {
    inset: 5% 0 0 35%;
  }
`;
export const HeroPortrait = styled.div`
  position: relative;
  width: 100%;
  min-height: 580px;
  overflow: hidden;
  background: #d8dcd0;
  img {
    object-fit: cover;
    object-position: 48% 50%;
    filter: saturate(0.76) contrast(0.97);
    transition:
      transform 1.4s cubic-bezier(0.2, 1, 0.25, 1),
      filter 1.4s ease;
  }
  &:hover img {
    transform: scale(1.035);
    filter: saturate(0.9) contrast(0.99);
  }
  @media (max-width: 768px) {
    min-height: 0;
    height: 100%;
  }
`;
export const HeroSlide = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  pointer-events: ${({ $active }) => ($active ? "auto" : "none")};
  transition: opacity 1150ms cubic-bezier(0.22, 1, 0.36, 1);
  img {
    object-fit: cover;
    object-position: center;
  }
`;

export const HeroVisualCaption = styled.div`
  position: absolute;
  bottom: 13px;
  right: clamp(10px, 2.6vw, 48px);
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #718577;
  font-size: 9px;
  letter-spacing: 0.14em;
  @media (max-width: 768px) {
    bottom: 17px;
    right: 22px;
    left: 58px;
    font-size: 8px;
  }
`;
export const HeroSlideControls = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  button {
    display: inline-grid;
    place-items: center;
    width: 25px;
    height: 25px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #526c59;
    cursor: pointer;
    font-size: 17px;
    font-family: ${sans};
    transition:
      opacity 260ms ease,
      transform 260ms ease;
  }
  button:hover {
    opacity: 0.65;
    transform: translateX(2px);
  }
  button:focus-visible {
    outline: 2px solid #718f73;
    outline-offset: 2px;
  }
  @media (max-width: 420px) {
    gap: 7px;
  }
`;

export const HeroDecorativeMark = styled.span`
  position: absolute;
  top: 18px;
  right: clamp(4px, 2.5vw, 48px);
  color: rgba(40, 70, 48, 0.22);
  font-family: ${serif};
  font-size: 56px;
  font-style: italic;
  letter-spacing: -0.08em;
  pointer-events: none;
  @media (max-width: 768px) {
    display: none;
  }
`;
export const HeroFootnote = styled.div`
  width: 100%;
  max-width: 1740px;
  margin: auto auto 0;
  border-top: 1px solid ${hairline};
  min-height: 59px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #6c806e;
  font-size: 9px;
  letter-spacing: 0.15em;
  span:nth-child(2) {
    display: flex;
    align-items: center;
    gap: 18px;
  }
  @media (max-width: 768px) {
    min-height: 56px;
    padding: 0 24px;
    span:first-child {
      display: none;
    }
  }
`;
export const ScrollArrow = styled.span`
  font-size: 17px;
  line-height: 1;
  color: ${ink};
`;

export const SectionFrame = styled.div`
  width: min(calc(100% - clamp(48px, 10.4vw, 200px)), 1620px);
  margin: 0 auto;
  @media (max-width: 768px) {
    width: calc(100% - 48px);
  }
`;
export const SectionMarker = styled.div`
  display: flex;
  gap: 19px;
  align-items: center;
  color: #65806b;
  font-size: 10px;
  letter-spacing: 0.17em;
  font-weight: 500;
`;
export const MarkerLine = styled.span`
  display: block;
  width: 48px;
  height: 1px;
  background: #9aaa9e;
`;

export const StorySection = styled.section`
  padding: clamp(105px, 11.7vw, 205px) 0 70px;
  background: #f8f7f2;
  scroll-margin-top: 90px;
  @media (max-width: 768px) {
    padding: 110px 0 50px;
    scroll-margin-top: 68px;
  }
`;
export const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.68fr;
  gap: clamp(40px, 8vw, 145px);
  margin-top: 52px;
  align-items: end;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 45px;
  }
`;
export const StoryHeading = styled.h2`
  font-family: ${sans};
  font-size: clamp(42px, 4.7vw, 78px);
  line-height: 1.46;
  letter-spacing: -0.075em;
  font-weight: 300;
  em {
    font-style: normal;
    font-weight: 500;
    color: #7b927a;
  }
  @media (max-width: 768px) {
    font-size: clamp(37px, 8vw, 59px);
    line-height: 1.43;
  }
`;
export const StoryBody = styled.div`
  padding-bottom: 2px;
  p {
    margin-top: 20px;
    color: #5a6a5d;
    font-size: 15px;
    font-weight: 300;
    line-height: 2.12;
    letter-spacing: -0.035em;
    word-break: keep-all;
  }
  @media (max-width: 768px) {
    p {
      font-size: 14px;
      line-height: 2;
    }
  }
`;
export const StoryBodyLabel = styled.span`
  color: #516856;
  font-size: 10px;
  letter-spacing: 0.15em;
  font-weight: 600;
`;
export const StorySignature = styled.div`
  font-family: ${serif};
  font-style: italic;
  font-size: 46px;
  line-height: 1;
  letter-spacing: -0.06em;
  color: #6b886f;
  margin-top: 37px;
`;
export const StoryBottomLine = styled.div`
  border-top: 1px solid ${hairline};
  margin-top: clamp(86px, 10.4vw, 185px);
  padding-top: 25px;
  display: flex;
  justify-content: space-between;
  color: #8c9a8a;
  font-size: 10px;
  letter-spacing: 0.18em;
  @media (max-width: 768px) {
    margin-top: 84px;
    font-size: 8px;
    gap: 5px;
  }
`;

export const Manifesto = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.03fr) minmax(0, 0.97fr);
  min-height: clamp(670px, 64vw, 930px);
  background: ${dark};
  color: #f5f3ec;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
export const ManifestoImageWrap = styled.div`
  position: relative;
  min-height: 630px;
  overflow: hidden;
  background: #4e6256;
  img {
    object-fit: cover;
    object-position: 48% center;
    filter: saturate(0.66) contrast(0.94);
    transition: transform 1.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  &:hover img {
    transform: scale(1.025);
  }
  @media (max-width: 768px) {
    min-height: 104vw;
  }
`;
export const ImageIndex = styled.span`
  position: absolute;
  left: clamp(28px, 4vw, 75px);
  bottom: 35px;
  color: rgba(255, 255, 255, 0.83);
  font-size: 9px;
  letter-spacing: 0.17em;
`;
export const ManifestoContent = styled.div`
  padding: clamp(65px, 6.2vw, 110px) clamp(38px, 6vw, 116px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 768px) {
    padding: 86px 24px 100px;
  }
`;
export const ManifestoTopline = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 10px;
  letter-spacing: 0.18em;
  color: #a9b8a7;
  span:first-child {
    color: #e2e5da;
  }
`;
export const ManifestoTitle = styled.h2`
  margin-top: clamp(72px, 8vw, 155px) !important;
  font-family: ${serif};
  font-weight: 400;
  font-size: clamp(66px, 6.5vw, 123px);
  line-height: 0.95;
  letter-spacing: -0.07em;
  white-space: nowrap;
  em {
    color: #a8b8a5;
    font-style: italic;
    font-weight: 400;
  }
  @media (max-width: 1300px) {
    font-size: clamp(63px, 6vw, 95px);
  }
  @media (max-width: 900px) {
    font-size: clamp(51px, 6.1vw, 80px);
  }
  @media (max-width: 768px) {
    margin-top: 57px !important;
    font-size: clamp(58px, 11vw, 98px);
  }
  @media (max-width: 390px) {
    font-size: 53px;
  }
`;
export const ManifestoKorean = styled.p`
  margin-top: 60px !important;
  font-size: clamp(21px, 1.6vw, 27px);
  font-weight: 300;
  line-height: 1.7;
  letter-spacing: -0.045em;
  @media (max-width: 768px) {
    margin-top: 48px !important;
  }
`;
export const ManifestoDescription = styled.p`
  max-width: 430px;
  margin-top: 20px !important;
  color: #b9c6ba;
  font-size: 13px;
  font-weight: 300;
  line-height: 2.05;
  letter-spacing: -0.025em;
  word-break: keep-all;
`;
export const ManifestoRule = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 70px;
  background: rgba(245, 243, 237, 0.24);
`;
export const ManifestoClosing = styled.p`
  margin-top: 24px !important;
  font-size: 9px;
  letter-spacing: 0.15em;
  color: #a1b2a4;
`;

export const ValuesSection = styled.section`
  background: #f8f7f2;
  padding: clamp(104px, 10vw, 185px) 0 clamp(110px, 12vw, 200px);
`;
export const ValuesIntro = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 38px;
  margin-top: 66px;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: start;
    gap: 27px;
    margin-top: 54px;
  }
`;
export const ValuesOverline = styled.p`
  color: #879a88;
  font-size: 10px;
  letter-spacing: 0.15em;
  margin-bottom: 28px !important;
`;
export const ValuesTitle = styled.h2`
  font-family: ${serif};
  font-size: clamp(73px, 7.5vw, 142px);
  line-height: 0.94;
  letter-spacing: -0.078em;
  font-weight: 400;
  em {
    color: #839987;
    font-style: italic;
    font-weight: 400;
  }
  @media (max-width: 768px) {
    font-size: clamp(61px, 10vw, 100px);
  }
  @media (max-width: 430px) {
    font-size: 55px;
  }
`;
export const ValuesAside = styled.p`
  padding: 0 0 8px;
  color: #637464;
  font-size: 13px;
  line-height: 2;
  font-weight: 300;
  word-break: keep-all;
`;
export const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(25px, 3.5vw, 60px);
  margin-top: clamp(85px, 10vw, 160px);
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 52px;
    margin-top: 80px;
  }
`;
export const ValueItem = styled.article`
  border-top: 1px solid rgba(43, 69, 49, 0.36);
  padding-top: 21px;
  transition: border-color 0.35s ease;
  &:hover {
    border-top-color: #476c50;
  }
`;
export const ValueTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #78917b;
  font-size: 11px;
  letter-spacing: 0.1em;
`;
export const ValueSmallCircle = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 31px;
  height: 31px;
  border: 1px solid #c8d1c5;
  border-radius: 50%;
  font-size: 16px;
  transition: transform 0.35s ease;
  ${ValueItem}:hover & {
    transform: translate(3px, -3px);
  }
`;
export const ValueEn = styled.h3`
  margin-top: clamp(85px, 7vw, 132px) !important;
  font-family: ${serif};
  font-size: clamp(56px, 5.3vw, 90px);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.065em;
  @media (max-width: 768px) {
    margin-top: 50px !important;
  }
`;
export const ValueKo = styled.p`
  margin-top: 20px !important;
  color: #2f4b37;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.045em;
`;
export const ValueDescription = styled.p`
  max-width: 370px;
  margin-top: 20px !important;
  font-size: 13px;
  color: #68776a;
  line-height: 2.06;
  font-weight: 300;
  word-break: keep-all;
`;

export const ImageEssay = styled.section`
  background: #e6ebe1;
  padding: clamp(100px, 12vw, 190px) clamp(24px, 5.2vw, 100px)
    clamp(105px, 11vw, 180px);
  @media (max-width: 768px) {
    padding-top: 100px;
    padding-bottom: 120px;
  }
`;
export const EssayTextBlock = styled.div`
  text-align: center;
`;
export const EssayLabel = styled.p`
  font-size: 10px;
  color: #728974;
  letter-spacing: 0.19em;
`;
export const EssayTitle = styled.h2`
  margin-top: 34px !important;
  font-family: ${serif};
  font-size: clamp(80px, 8.6vw, 154px);
  line-height: 0.92;
  letter-spacing: -0.075em;
  font-weight: 400;
  em {
    font-style: italic;
    color: #78917c;
    font-weight: 400;
  }
  @media (max-width: 768px) {
    font-size: clamp(60px, 11vw, 100px);
  }
  @media (max-width: 400px) {
    font-size: 55px;
  }
`;
export const EssayDescription = styled.p`
  margin-top: 37px !important;
  color: #566e59;
  font-size: 14px;
  font-weight: 300;
  line-height: 2;
  letter-spacing: -0.025em;
`;
export const EssayPhotos = styled.div`
  display: flex;
  align-items: start;
  justify-content: center;
  gap: clamp(18px, 7vw, 125px);
  max-width: 1180px;
  margin: clamp(85px, 9vw, 150px) auto 0;
  @media (max-width: 768px) {
    gap: 16px;
    margin-top: 85px;
  }
`;
export const EssaySmallPhoto = styled.figure`
  position: relative;
  width: 37%;
  aspect-ratio: 0.83;
  margin: 135px 0 0;
  background: #bdc7b8;
  img {
    object-fit: cover;
    transition: transform 1s ease;
  }
  &:hover img {
    transform: scale(1.02);
  }
  @media (max-width: 768px) {
    width: 43%;
    margin-top: 70px;
  }
`;
export const EssayLargePhoto = styled.figure`
  position: relative;
  width: 49%;
  aspect-ratio: 0.79;
  margin: 0;
  background: #c2cdbf;
  img {
    object-fit: cover;
    object-position: 48% center;
    transition: transform 1s ease;
  }
  &:hover img {
    transform: scale(1.02);
  }
  @media (max-width: 768px) {
    width: 56%;
  }
`;
export const PhotoCaption = styled.figcaption`
  position: absolute;
  bottom: -26px;
  left: 0;
  color: #6e8373;
  font-size: 9px;
  letter-spacing: 0.15em;
  white-space: nowrap;
`;

export const ClosingSection = styled.section`
  position: relative;
  background: #213e2f;
  color: #f5f3ed;
  border-bottom: 1px solid rgba(255, 255, 255, 0.11);
`;
export const ClosingInterior = styled.div`
  position: relative;
  min-height: clamp(730px, 68vw, 1020px);
  width: min(calc(100% - clamp(48px, 10.4vw, 200px)), 1620px);
  margin: 0 auto;
  padding: clamp(110px, 11vw, 190px) 0 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  @media (max-width: 768px) {
    width: calc(100% - 48px);
    min-height: 750px;
    padding: 115px 0 32px;
  }
`;
export const ClosingEyebrow = styled.p`
  color: #acbead;
  font-size: 10px;
  letter-spacing: 0.22em;
`;
export const ClosingTitle = styled.h2`
  margin-top: clamp(62px, 6vw, 112px) !important;
  font-family: ${serif};
  font-size: clamp(82px, 9vw, 168px);
  line-height: 0.9;
  letter-spacing: -0.08em;
  font-weight: 400;
  em {
    color: #b2c4b0;
    font-weight: 400;
    font-style: italic;
  }
  @media (max-width: 768px) {
    font-size: clamp(62px, 12vw, 104px);
  }
  @media (max-width: 400px) {
    font-size: 54px;
  }
`;
export const ClosingKorean = styled.p`
  margin-top: 57px !important;
  font-size: 17px;
  line-height: 1.9;
  font-weight: 300;
  letter-spacing: -0.025em;
  color: #dce5d9;
  @media (max-width: 768px) {
    font-size: 15px;
    margin-top: 48px !important;
  }
`;
export const ClosingActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 50px;
  @media (max-width: 550px) {
    flex-direction: column;
    width: 100%;
  }
`;
export const PrimaryLink = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 55px;
  padding: 21px 25px;
  min-width: 224px;
  border: 1px solid #f0f1e8;
  background: #f1f1e8;
  color: #1b3528 !important;
  font-size: 12px;
  font-weight: 500;
  transition:
    background 0.3s ease,
    transform 0.3s ease;
  &:hover {
    background: #d8e1d3;
    transform: translateY(-3px);
  }
  span:last-child {
    font-size: 17px;
    font-weight: 300;
  }
  @media (max-width: 550px) {
    width: min(100%, 320px);
  }
`;
export const SecondaryLink = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 35px;
  padding: 21px 25px;
  min-width: 205px;
  border: 1px solid rgba(241, 242, 231, 0.37);
  background: transparent;
  color: #eef2e8;
  font-size: 12px;
  font-weight: 400;
  transition:
    border-color 0.3s ease,
    background 0.3s ease;
  &:hover {
    border-color: #f0f1e8;
    background: rgba(255, 255, 255, 0.08);
  }
  span:last-child {
    font-size: 17px;
    font-weight: 300;
  }
  @media (max-width: 550px) {
    width: min(100%, 320px);
  }
`;
export const ClosingFooter = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
  align-items: center;
  padding-top: 25px;
  margin-top: auto;
  border-top: 1px solid rgba(239, 244, 237, 0.16);
  color: #b4c5b5;
  font-size: 9px;
  letter-spacing: 0.15em;
  @media (max-width: 480px) {
    font-size: 8px;
    letter-spacing: 0.1em;
  }
`;
