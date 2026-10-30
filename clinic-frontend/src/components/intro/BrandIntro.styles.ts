import styled from "styled-components";

const cream = "#F6F3ED";
const ink = "#233B32";
const bronze = "#987751";
const display = 'var(--ahns-display, "Cormorant Garamond", Georgia, serif)';
const sans = 'var(--ahns-body, "Pretendard Variable", sans-serif)';

export const Overlay = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 57fr) minmax(0, 43fr);
  box-sizing: border-box;
  max-width: 100%;
  isolation: isolate;
  color: ${ink};
  background: ${cream};
  overflow: clip;
  @media (max-width: 700px) { grid-template-columns: minmax(0, 1fr); }
  @media (prefers-reduced-motion: reduce) { display: none; }
`;

export const LeftPane = styled.section`
  position: relative;
  min-width: 0;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(28px, 3.2vw, 58px) clamp(28px, 5.3vw, 100px) clamp(27px, 3vw, 54px);
  @media (max-width: 900px) { padding-inline: clamp(24px, 4vw, 46px); }
  @media (max-width: 700px) { padding: 30px 25px 28px; }
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  opacity: 0;
`;
export const Logotype = styled.div`
  font: 500 clamp(38px, 3.1vw, 53px)/0.86 ${display};
  letter-spacing: -0.075em;
  span { color: ${bronze}; }
`;
export const HeaderMeta = styled.div`
  font: 500 9px/1.6 ${sans};
  letter-spacing: 0.17em;
  color: #87968c;
  text-align: right;
`;
export const MainCopy = styled.div`
  min-width: 0;
  width: 100%;
  margin: auto 0;
  padding-block: clamp(34px, 6vh, 100px);
`;
export const Eyebrow = styled.p`
  margin: 0 0 clamp(18px, 2.6vw, 41px);
  color: ${bronze};
  font: 500 10px/1.6 ${sans};
  letter-spacing: 0.17em;
  opacity: 0;
  span { color: #A4ACA1; margin-left: 8px; }
`;
export const Title = styled.h1`
  margin: 0;
  font: 400 clamp(62px, 7vw, 138px)/0.98 ${display};
  letter-spacing: -0.062em;
  white-space: nowrap;
  opacity: 0;
  em { font-style: italic; font-weight: 400; color: #587263; }
  @media (max-width: 1250px) { font-size: clamp(59px, 7vw, 102px); }
  @media (max-width: 850px) { font-size: clamp(54px, 7.5vw, 82px); }
  @media (max-width: 700px) {
    font-size: clamp(59px, 12.7vw, 100px);
    white-space: normal;
  }
  @media (max-width: 380px) { font-size: clamp(52px, 12vw, 72px); }
`;
export const Hairline = styled.div`
  margin: clamp(25px, 3vw, 45px) 0 clamp(18px, 2vw, 28px);
  width: min(180px, 40%);
  height: 1px;
  background: ${bronze};
  transform: scaleX(0);
  transform-origin: left;
`;
export const KoreanLine = styled.div`
  min-height: 2em;
  color: ${bronze};
  font-family: "Paperlogy", "SUITE Variable", ${sans};
  font-size: clamp(18px, 1.63vw, 26px);
  line-height: 1.65;
  font-weight: 400;
  letter-spacing: -0.028em;
  word-break: keep-all;
  white-space: pre-wrap;
  opacity: 0;
  @media (max-width: 700px) { font-size: clamp(17px, 4vw, 22px); }
`;
export const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  color: #819085;
  opacity: 0;
`;
export const FooterRule = styled.div`
  flex-shrink: 0;
  width: clamp(34px, 7vw, 93px);
  height: 1px;
  background: #A8B2A5;
`;
export const FooterText = styled.span`
  font: 500 9px/1.4 ${sans};
  letter-spacing: 0.18em;
`;
export const FooterNo = styled.span`
  margin-left: auto;
  white-space: nowrap;
  font: 500 9px/1.4 ${sans};
  letter-spacing: 0.14em;
`;

/* C안 — 승인한 Architectural Gallery 사진으로 변경: 이미지 1장만 사용. */
export const RightPane = styled.aside`
  position: relative;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  background: #e4e0d5;
  @media (max-width: 700px) { display: none; }
`;
export const GalleryFrame = styled.div`
  position: absolute;
  inset: clamp(19px, 2.4vw, 48px);
  overflow: hidden;
  background: #e7e1d5;
  opacity: 0;
`;
export const GalleryScene = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #e7e1d5;

  .ahns-intro-architecture-image {
    display: block;
    object-fit: cover;
    object-position: center 45%;
    user-select: none;
    -webkit-user-drag: none;
  }
`;
export const GalleryTexture = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(24, 33, 26, .10),
    transparent 23%,
    transparent 59%,
    rgba(23, 28, 22, .42)
  );
`;
export const GalleryTop = styled.div`
  position: absolute;
  z-index: 2;
  top: clamp(26px, 3vw, 54px);
  left: clamp(24px, 3vw, 54px);
  color: #53645b;
  font: 500 9px/1.5 ${sans};
  letter-spacing: .15em;
`;
export const GalleryCaption = styled.div`
  position: absolute;
  z-index: 2;
  left: clamp(24px, 3vw, 54px);
  bottom: clamp(32px, 4vw, 78px);
  display: flex;
  flex-direction: column;
  gap: 9px;
  color: #fbf8f0;
  text-shadow: 0 2px 12px rgba(28,29,25,.16);
  span { font: 500 9px/1.4 ${sans}; letter-spacing: .2em; }
  em { font: italic 400 clamp(32px, 3.6vw, 64px)/1.1 ${display}; letter-spacing: -.04em; }
`;
export const Skip = styled.button`
  position: absolute;
  top: clamp(25px, 3.1vw, 56px);
  right: clamp(28px, 4.2vw, 72px);
  z-index: 5;
  border: 0;
  padding: 7px 0;
  background: transparent;
  color: ${ink};
  cursor: pointer;
  font: 500 10px ${sans};
  letter-spacing: .2em;
  span { margin-left: 9px; font-size: 16px; vertical-align: -2px; }
  &:focus-visible { outline: 2px solid ${bronze}; outline-offset: 4px; }
  @media (max-width: 700px) { top: 25px; right: 25px; }
`;
export const LightWash = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2147483001;
  width: 100%;
  height: 100dvh;
  pointer-events: none;
  opacity: 0;
  background: #fffdf7;
  @media (prefers-reduced-motion: reduce) { display: none; }
`;
