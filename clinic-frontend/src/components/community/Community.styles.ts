import styled, { keyframes } from "styled-components";

export const palette = {
  forest: "#1B3528",
  darker: "#12291E",
  ink: "#273C31",
  sage: "#87988A",
  muted: "#758378",
  ivory: "#F7F5EF",
  sand: "#ECE8DF",
  white: "#FFFDF8",
  line: "rgba(31,58,43,.16)",
};
const serif = '"Noto Serif KR", "Nanum Myeongjo", Georgia, serif';
const display = '"Cormorant Garamond", "Iowan Old Style", Georgia, serif';

export const Page = styled.main`
  min-height: 100vh;
  overflow: clip;
  background: ${palette.ivory};
  color: ${palette.ink};
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
  figure {
    margin: 0;
  }
  button,
  input,
  select,
  textarea {
    font: inherit;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  button {
    cursor: pointer;
  }
  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 2px solid #67866c;
    outline-offset: 4px;
  }

  &[data-c-motion="on"] [data-c-reveal] {
    opacity: 0;
    transform: translate3d(0, 28px, 0);
    transition:
      opacity 0.95s cubic-bezier(0.21, 0.98, 0.25, 1),
      transform 1.1s cubic-bezier(0.21, 0.98, 0.25, 1);
  }
  &[data-c-motion="on"] [data-c-reveal][data-c-visible="true"] {
    opacity: 1;
    transform: none;
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      animation: none !important;
      transition: none !important;
    }
    [data-c-reveal] {
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;
export const Container = styled.div`
  width: min(calc(100% - 9vw), 1380px);
  margin: 0 auto;
  @media (max-width: 700px) {
    width: calc(100% - 40px);
  }
`;
export const TopBar = styled.nav`
  width: min(calc(100% - 9vw), 1380px);
  margin: 0 auto;
  padding: 118px 0 25px;
  display: flex;
  gap: 40px;
  align-items: center;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding-top: 100px;
  }
  @media (max-width: 700px) {
    width: calc(100% - 40px);
    padding-top: 84px;
  }
`;
export const NavTitle = styled.span`
  flex: none;
  font-size: 10px;
  font-weight: 650;
  letter-spacing: 0.22em;
  white-space: nowrap;
  span {
    padding-left: 13px;
    color: #9ea89c;
  }
`;
export const NavTrack = styled.div`
  display: flex;
  gap: clamp(15px, 1.65vw, 29px);
  align-items: center;
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
export const NavLink = styled.a<{ $active: boolean }>`
  position: relative;
  flex: none;
  padding: 10px 0 12px;
  font-size: 12px;
  line-height: 1;
  font-weight: ${({ $active }) => ($active ? 650 : 400)};
  color: ${palette.ink};
  opacity: ${({ $active }) => ($active ? 1 : 0.63)};
  transition: opacity 0.25s ease;
  &::after {
    content: "";
    position: absolute;
    height: 1px;
    bottom: 5px;
    left: 0;
    right: 0;
    background: currentColor;
    transform-origin: left;
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transition: transform 0.3s ease;
  }
  &:hover {
    opacity: 1;
  }
  &:hover::after {
    transform: scaleX(1);
  }
`;
export const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 10px;
  font-weight: 650;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  &::before {
    content: "";
    display: block;
    width: 27px;
    height: 1px;
    background: currentColor;
    opacity: 0.6;
  }
`;
export const Display = styled.h1`
  font-family: ${serif};
  font-weight: 450;
  letter-spacing: -0.087em;
  line-height: 1.36;
  font-size: clamp(39px, 5.7vw, 87px);
  word-break: keep-all;
  em {
    font-family: ${display};
    font-weight: 400;
    font-size: 1.12em;
    font-style: italic;
    letter-spacing: -0.065em;
  }
`;
export const Lead = styled.p`
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 2.08;
  color: #607467;
  word-break: keep-all;
`;
export const MainHero = styled.section`
  position: relative;
  ${Container} {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    min-height: clamp(610px, 71vh, 860px);
    align-items: center;
    gap: clamp(30px, 4vw, 75px);
  }
  @media (max-width: 860px) {
    ${Container} {
      grid-template-columns: 1fr;
      padding-bottom: 70px;
      gap: 35px;
    }
  }
`;
export const HeroCopy = styled.div`
  padding: 42px 0 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 34px;
  ${Display} {
    max-width: 730px;
  }
  ${Lead} {
    max-width: 400px;
  }
  @media (max-width: 860px) {
    padding: 30px 0 0;
    gap: 24px;
  }
`;
export const HeroPhotoFrame = styled.div`
  position: relative;
  height: clamp(460px, 53vw, 690px);
  margin-top: 25px;
  overflow: hidden;
  background: #d4d5c7;
  isolation: isolate;
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(245, 244, 236, 0.3), transparent 46%),
      linear-gradient(0deg, rgba(22, 48, 32, 0.14), transparent 48%);
    pointer-events: none;
  }
  img {
    object-fit: cover;
    object-position: center 44%;
    transition: transform 1.6s cubic-bezier(0.2, 0.9, 0.3, 1);
  }
  &:hover img {
    transform: scale(1.035);
  }
  @media (max-width: 860px) {
    height: min(68vw, 560px);
    margin: 0;
  }
`;
export const PhotoCaption = styled.div`
  position: absolute;
  z-index: 2;
  right: 26px;
  bottom: 25px;
  color: white;
  font-family: ${display};
  font-size: 26px;
  font-style: italic;
  letter-spacing: 0.065em;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.25);
`;
export const HeroCounter = styled.span`
  font-family: ${display};
  font-size: 19px;
  letter-spacing: 0.07em;
  color: ${palette.muted};
`;
export const TextLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 20px;
  width: max-content;
  padding: 0 0 10px;
  border-bottom: 1px solid ${palette.ink};
  font-size: 12px;
  letter-spacing: 0.03em;
  font-weight: 550;
  span {
    font-size: 18px;
    transition: transform 0.25s;
  }
  &:hover span {
    transform: translate(4px, -3px);
  }
`;
export const Section = styled.section`
  padding: clamp(80px, 9vw, 150px) 0;
`;
export const SectionHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: clamp(35px, 4vw, 65px);
  h2 {
    font-family: ${serif};
    font-size: clamp(28px, 3.2vw, 50px);
    font-weight: 450;
    letter-spacing: -0.065em;
    line-height: 1.5;
  }
  p {
    font-size: 13px;
    line-height: 1.9;
    color: ${palette.muted};
  }
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
export const MainFeature = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  min-height: 460px;
  background: ${palette.forest};
  color: #f7f5ed;
  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;
export const MainFeatureCopy = styled.div`
  padding: clamp(42px, 6vw, 90px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 50px;
  h2 {
    font-family: ${serif};
    font-weight: 400;
    letter-spacing: -0.06em;
    font-size: clamp(31px, 3.5vw, 55px);
    line-height: 1.55;
  }
  p {
    color: #cad6cb;
    font-size: 14px;
    line-height: 1.95;
    max-width: 430px;
  }
  ${Eyebrow} {
    color: #ccd9ca;
  }
  ${TextLink} {
    border-color: rgba(242, 246, 237, 0.7);
  }
`;
export const FeatureImage = styled.div`
  position: relative;
  min-height: 410px;
  overflow: hidden;
  img {
    object-fit: cover;
    transition: transform 1.2s;
  }
  &:hover img {
    transform: scale(1.035);
  }
  @media (max-width: 700px) {
    min-height: 290px;
  }
`;
export const LinkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid ${palette.line};
  @media (max-width: 850px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
`;
export const LinkCard = styled.a`
  position: relative;
  min-height: 285px;
  padding: 35px 26px 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  border-bottom: 1px solid ${palette.line};
  border-right: 1px solid ${palette.line};
  transition: background 0.35s;
  &:nth-child(3n) {
    border-right: none;
  }
  &:hover {
    background: #eeeee6;
  }
  .number {
    font-family: ${display};
    font-size: 21px;
    color: #8d9a8b;
  }
  h3 {
    font-family: ${serif};
    font-size: clamp(24px, 2.1vw, 31px);
    letter-spacing: -0.065em;
    font-weight: 450;
  }
  p {
    font-size: 12px;
    line-height: 1.9;
    color: ${palette.muted};
    max-width: 280px;
  }
  .arrow {
    margin-top: auto;
    font-size: 20px;
    align-self: flex-end;
    transition: transform 0.3s;
  }
  &:hover .arrow {
    transform: translate(5px, -5px);
  }
  @media (max-width: 850px) {
    &:nth-child(3n) {
      border-right: 1px solid ${palette.line};
    }
    &:nth-child(2n) {
      border-right: none;
    }
  }
  @media (max-width: 580px) {
    min-height: 205px;
    border-right: none !important;
    padding-inline: 4px;
  }
`;
export const DarkBand = styled.section`
  background: ${palette.forest};
  color: #f5f3e9;
  padding: clamp(70px, 8vw, 120px) 0;
`;
export const DarkBandInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  h2 {
    font-family: ${serif};
    font-size: clamp(29px, 4vw, 58px);
    font-weight: 420;
    letter-spacing: -0.07em;
    line-height: 1.5;
  }
  p {
    font-size: 13px;
    line-height: 2;
    color: #d4ddcf;
  }
  ${TextLink} {
    color: inherit;
    border-color: #aabba8;
  }
  @media (max-width: 800px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
export const SubHero = styled.section`
  padding: clamp(54px, 6vw, 103px) 0 clamp(65px, 7vw, 105px);
  ${Container} {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(290px, 0.38fr);
    gap: 40px;
    align-items: end;
  }
  ${Display} {
    font-size: clamp(37px, 4.9vw, 72px);
    margin: 26px 0;
  }
  ${Lead} {
    max-width: 555px;
  }
  @media (max-width: 850px) {
    ${Container} {
      grid-template-columns: 1fr;
    }
  }
`;
export const HeroIndex = styled.div`
  justify-self: end;
  align-self: end;
  font-family: ${display};
  font-size: clamp(90px, 13vw, 190px);
  line-height: 0.7;
  letter-spacing: -0.09em;
  color: #dbdfd3;
  @media (max-width: 850px) {
    display: none;
  }
`;
export const ContentRegion = styled.section`
  padding: 0 0 clamp(100px, 10vw, 160px);
  min-height: 380px;
`;
export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border-top: 1px solid ${palette.ink};
  padding: 22px 0 24px;
  @media (max-width: 650px) {
    flex-direction: column;
    align-items: stretch;
    gap: 17px;
  }
`;
export const SearchInput = styled.input`
  width: min(100%, 300px);
  border: 0;
  border-bottom: 1px solid #adb9a9;
  background: transparent;
  padding: 12px 3px;
  border-radius: 0;
  outline-offset: 2px;
  color: ${palette.ink};
  font-size: 13px;
  &::placeholder {
    color: #9ca99b;
  }
  @media (max-width: 650px) {
    width: 100%;
  }
`;
export const Count = styled.span`
  font-size: 11px;
  letter-spacing: 0.06em;
  color: ${palette.muted};
`;
export const Lines = styled.div`
  border-top: 1px solid ${palette.line};
`;
export const LineItem = styled.article`
  display: grid;
  grid-template-columns: 105px minmax(0, 1fr) 140px;
  align-items: center;
  gap: 30px;
  padding: 30px 15px;
  border-bottom: 1px solid ${palette.line};
  .tag {
    font-size: 10px;
    letter-spacing: 0.13em;
    color: ${palette.sage};
  }
  h3 {
    font-size: clamp(17px, 1.5vw, 22px);
    font-weight: 450;
    letter-spacing: -0.045em;
    line-height: 1.6;
    word-break: keep-all;
  }
  p {
    font-size: 12px;
    line-height: 1.75;
    color: ${palette.muted};
    margin-top: 9px;
  }
  time {
    text-align: right;
    font-family: ${display};
    font-size: 16px;
    color: #839184;
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 23px 0;
    time {
      text-align: left;
    }
  }
`;
export const TileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 37px 22px;
  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;
export const Tile = styled.article`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 18px;
  h3 {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.55;
    letter-spacing: -0.035em;
    word-break: keep-all;
  }
  p {
    font-size: 12px;
    line-height: 1.8;
    color: ${palette.muted};
  }
  .metadata {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    font-size: 10px;
    color: ${palette.muted};
    letter-spacing: 0.06em;
  }
`;
export const TileImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1.23;
  overflow: hidden;
  background: #e3e4da;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  &:hover img {
    transform: scale(1.05);
  }
  .fallback {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${display};
    font-size: clamp(28px, 3vw, 52px);
    color: #738677;
    font-style: italic;
  }
`;
export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
`;
export const Chip = styled.button<{ $active: boolean }>`
  border: 1px solid
    ${({ $active }) => ($active ? palette.forest : palette.line)};
  padding: 10px 17px;
  border-radius: 100px;
  background: ${({ $active }) => ($active ? palette.forest : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : palette.ink)};
  font-size: 12px;
  transition:
    background 0.25s,
    color 0.25s;
  &:hover {
    background: ${palette.forest};
    color: white;
  }
`;
export const FaqItem = styled.article`
  border-bottom: 1px solid ${palette.line};
`;
export const FaqQuestion = styled.button<{ $open: boolean }>`
  width: 100%;
  border: 0;
  background: none;
  color: ${palette.ink};
  padding: 28px 7px;
  display: flex;
  gap: 20px;
  align-items: center;
  text-align: left;
  .q {
    font-family: ${display};
    font-size: 26px;
    color: ${palette.sage};
  }
  .question {
    flex: 1;
    font-size: clamp(16px, 1.45vw, 21px);
    font-weight: 450;
    line-height: 1.6;
    letter-spacing: -0.035em;
  }
  .plus {
    font-size: 26px;
    line-height: 1;
    transition: transform 0.3s;
    transform: rotate(${({ $open }) => ($open ? "45deg" : "0")});
  }
`;
export const FaqAnswer = styled.div`
  padding: 0 55px 36px;
  font-size: 14px;
  line-height: 2;
  color: #62766a;
  white-space: pre-wrap;
  word-break: keep-all;
  @media (max-width: 650px) {
    padding-left: 7px;
    padding-right: 7px;
  }
`;
export const EmptyBox = styled.div`
  min-height: 310px;
  border-top: 1px solid ${palette.line};
  border-bottom: 1px solid ${palette.line};
  padding: 65px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 17px;
  .symbol {
    font-family: ${display};
    font-style: italic;
    font-size: 58px;
    line-height: 1;
    color: #a6b2a2;
  }
  h3 {
    font-family: ${serif};
    font-size: 23px;
    font-weight: 450;
    letter-spacing: -0.055em;
  }
  p {
    font-size: 13px;
    line-height: 1.9;
    color: ${palette.muted};
    max-width: 460px;
    word-break: keep-all;
  }
`;
export const Button = styled.button`
  border: 1px solid ${palette.forest};
  background: ${palette.forest};
  color: white;
  padding: 13px 22px;
  font-size: 12px;
  min-height: 44px;
  transition:
    background 0.25s,
    color 0.25s;
  &:hover {
    background: transparent;
    color: ${palette.forest};
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
export const ConsultGrid = styled.div`
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: clamp(36px, 7vw, 115px);
  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;
export const ConsultIntro = styled.div`
  h2 {
    font-family: ${serif};
    font-size: clamp(29px, 3vw, 45px);
    line-height: 1.5;
    letter-spacing: -0.06em;
    font-weight: 450;
    margin: 22px 0;
  }
  p {
    font-size: 13px;
    line-height: 2;
    color: ${palette.muted};
    max-width: 380px;
  }
  .illustration {
    margin-top: 60px;
    position: relative;
    aspect-ratio: 1.5;
    overflow: hidden;
    background: #d4dacc;
  }
  .illustration img {
    object-fit: cover;
  }
`;
export const Form = styled.form`
  border-top: 1px solid ${palette.ink};
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 29px;
  label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: -0.02em;
    display: block;
    margin-bottom: 10px;
  }
  input,
  select,
  textarea {
    width: 100%;
    background: transparent;
    color: ${palette.ink};
    border: 0;
    border-bottom: 1px solid #a5b4a5;
    border-radius: 0;
    padding: 13px 4px;
    font-size: 15px;
  }
  input::placeholder {
    color: #a2afa3;
  }
  select {
    appearance: auto;
  }
  .privacy {
    display: flex;
    gap: 11px;
    align-items: flex-start;
    font-size: 12px;
    line-height: 1.8;
    color: #60756a;
  }
  .privacy input {
    width: 16px;
    height: 16px;
    flex: none;
    margin: 2px 0 0;
    accent-color: ${palette.forest};
  }
  .privacy label {
    font-weight: 400;
    margin: 0;
    font-size: 12px;
    line-height: 1.8;
  }
  .fine {
    font-size: 11px;
    color: #879688;
    line-height: 1.8;
  }
  .message {
    font-size: 13px;
    line-height: 1.8;
  }
  .error {
    color: #b35044;
  }
  .success {
    color: #295b3b;
  }
  button {
    align-self: flex-start;
    min-width: 180px;
  }
`;
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 85px;
  border-top: 1px solid ${palette.line};
  padding-top: 25px;
  div {
    display: flex;
    flex-direction: column;
    gap: 13px;
  }
  strong {
    font-family: ${display};
    font-size: 27px;
    font-weight: 400;
  }
  span {
    font-size: 12px;
    color: ${palette.muted};
    line-height: 1.8;
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 23px;
    margin-top: 45px;
  }
`;
const dim = keyframes`from{opacity:0}to{opacity:1}`;
export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 11000;
  background: rgba(8, 25, 16, 0.86);
  backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(12px, 3vw, 50px);
  animation: ${dim} 0.25s ease;
`;
export const ModalWindow = styled.div`
  width: min(100%, 1050px);
  color: white;
  position: relative;
  iframe {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    border: 0;
    background: #0b130d;
  }
  button {
    position: absolute;
    right: 0;
    bottom: calc(100% + 13px);
    border: 1px solid #abbcaa;
    border-radius: 0;
    background: transparent;
    color: white;
    padding: 9px 15px;
    font-size: 13px;
  }
`;
export const Pages = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 40px;
  button {
    border: 1px solid ${palette.line};
    background: transparent;
    color: ${palette.ink};
    padding: 10px 15px;
    min-width: 40px;
    font-size: 12px;
  }
  button[aria-current="page"] {
    background: ${palette.forest};
    color: white;
  }
`;
export const Essay = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  min-height: 430px;
  margin-top: clamp(72px, 9vw, 138px);
  background: #eeece3;
  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;
export const EssayImage = styled.div`
  position: relative;
  min-height: 370px;
  overflow: hidden;
  background: #daded0;
  img {
    object-fit: cover;
    transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  &:hover img {
    transform: scale(1.025);
  }
  @media (max-width: 820px) {
    min-height: 260px;
  }
`;
export const EssayCopy = styled.div`
  padding: clamp(34px, 5.3vw, 86px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 30px;
  h2 {
    font-family: ${serif};
    font-weight: 450;
    font-size: clamp(27px, 2.75vw, 44px);
    letter-spacing: -0.065em;
    line-height: 1.55;
    word-break: keep-all;
  }
  p {
    font-size: 13px;
    line-height: 2.15;
    color: #65766c;
    max-width: 430px;
    word-break: keep-all;
  }
`;
