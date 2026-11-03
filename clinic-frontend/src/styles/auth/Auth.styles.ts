import Link from "next/link";
import styled, { css, keyframes } from "styled-components";

const enter = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const surface = css`
  background: #fffefa;
  border: 1px solid rgba(47, 82, 59, 0.1);
  box-shadow: 0 22px 72px rgba(38, 62, 44, 0.07);
`;

// 인증 페이지에만 적용한다. 기존 Sub.styles의 다른 페이지를 건드리지 않는다.
export const AuthShell = styled.main`
  --auth-forest: #284b37;
  --auth-sage: #6d896f;
  --auth-ink: #283c2d;
  --auth-muted: #829185;
  --auth-line: #dfe7dd;
  color: var(--auth-ink);
  background: #f5f6f0;
  min-height: 100svh;
  padding: clamp(12px, 2vw, 32px);
  box-sizing: border-box;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export const AuthLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(380px, 0.96fr) minmax(480px, 1.04fr);
  gap: clamp(12px, 1.5vw, 22px);
  max-width: 1540px;
  margin: 0 auto;
  align-items: stretch;
  min-height: min(840px, calc(100svh - 64px));

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  }
  @media (max-width: 800px) {
    display: flex;
    flex-direction: column;
    min-height: initial;
  }
`;

export const BrandPanel = styled.aside`
  position: sticky;
  top: 20px;
  align-self: start;
  isolation: isolate;
  overflow: hidden;
  min-height: min(850px, calc(100svh - 40px));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(30px, 4vw, 65px);
  border-radius: 18px;
  background:
    radial-gradient(
      ellipse at 75% 24%,
      rgba(185, 207, 178, 0.22) 0,
      transparent 37%
    ),
    radial-gradient(
      ellipse at 0% 85%,
      rgba(171, 194, 164, 0.15) 0,
      transparent 48%
    ),
    linear-gradient(150deg, #375b43 0%, #234534 57%, #1c382b 100%);
  color: #f7f7ef;

  &::before {
    content: "";
    position: absolute;
    width: 78%;
    aspect-ratio: 1;
    border: 1px solid rgba(239, 245, 231, 0.18);
    border-radius: 50%;
    right: -37%;
    top: 9%;
    z-index: -1;
    box-shadow:
      0 0 0 58px rgba(244, 247, 235, 0.025),
      0 0 0 116px rgba(244, 247, 235, 0.017);
  }
  &::after {
    content: "A";
    position: absolute;
    bottom: 5%;
    right: 4%;
    z-index: -1;
    font:
      italic 380px/1 Georgia,
      "Times New Roman",
      serif;
    color: rgba(238, 244, 230, 0.045);
    pointer-events: none;
  }
  @media (max-width: 800px) {
    position: relative;
    top: auto;
    min-height: 240px;
    padding: 28px;
    border-radius: 14px;
    gap: 28px;
    &::after {
      font-size: 200px;
    }
  }
  @media (max-width: 480px) {
    min-height: 205px;
    padding: 24px;
  }
`;

export const BrandHome = styled(Link)`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #f7f7ef;
  text-decoration: none;
  letter-spacing: 0.18em;
  font:
    500 22px/1.2 Georgia,
    "Times New Roman",
    serif;
  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 5px;
  }
`;

export const BrandHomeMark = styled.span`
  display: grid;
  place-items: center;
  border: 1px solid rgba(248, 251, 240, 0.6);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font:
    italic 20px Georgia,
    serif;
`;

export const BrandHero = styled.div`
  padding-top: clamp(30px, 8vh, 110px);
  animation: ${enter} 0.85s both;
  @media (max-width: 800px) {
    padding-top: 0;
  }
`;

export const BrandEyebrow = styled.p`
  font-size: 11px;
  letter-spacing: 0.23em;
  font-weight: 600;
  color: #c9d9c8;
  margin: 0 0 26px;
  @media (max-width: 800px) {
    display: none;
  }
`;

export const BrandTitle = styled.h1`
  font:
    400 clamp(48px, 5.1vw, 87px)/1.05 Georgia,
    "Times New Roman",
    serif;
  letter-spacing: -0.055em;
  margin: 0;
  white-space: pre-line;
  em {
    font-weight: 400;
    font-style: italic;
    color: #d5e5cb;
  }
  @media (max-width: 800px) {
    font-size: clamp(37px, 6vw, 53px);
  }
  @media (max-width: 480px) {
    font-size: 37px;
  }
`;

export const BrandDescription = styled.p`
  font-size: 13px;
  line-height: 1.95;
  color: #cfddd0;
  margin: 27px 0 0;
  letter-spacing: -0.02em;
  @media (max-width: 800px) {
    margin-top: 14px;
    font-size: 12px;
  }
`;

export const BrandBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding-top: 38px;
  border-top: 1px solid rgba(235, 243, 230, 0.2);
  color: #d1decc;
  letter-spacing: 0.13em;
  font-size: 10px;
  @media (max-width: 800px) {
    display: none;
  }
`;

export const FormSurface = styled.section`
  ${surface}
  border-radius: 18px;
  padding: clamp(26px, 5.5vw, 85px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  animation: ${enter} 0.7s 0.12s both;
  @media (max-width: 800px) {
    border-radius: 14px;
    padding: clamp(27px, 6vw, 50px);
  }
  @media (max-width: 480px) {
    padding: 28px 22px 32px;
  }
`;

/**
 * 회원가입 전용 화면 구성. 로그인 페이지의 기존 레이아웃은 변경하지 않는다.
 * 데스크톱: 한 화면 높이만 사용하고, 내부 오른쪽 폼만 스크롤한다.
 * 모바일: 기존처럼 페이지 전체가 자연스럽게 스크롤된다.
 */
export const RegisterShell = styled(AuthShell)`
  @media (min-width: 801px) {
    height: 100vh; /* 구형 브라우저 fallback */
    height: 100dvh;
    min-height: 0;
    overflow: hidden;
  }
`;

export const RegisterLayout = styled(AuthLayout)`
  @media (min-width: 801px) {
    height: 100%;
    min-height: 0;
    align-items: stretch;

    /* sticky 대신 고정된 그리드 칸: 부모 스크롤이 없어 위치가 흔들리지 않는다. */
    & > ${BrandPanel} {
      position: relative;
      top: auto;
      height: 100%;
      min-height: 0;
    }

    /* 왼쪽과 독립적으로 오른쪽 회원가입 폼만 움직인다. */
    & > ${FormSurface} {
      height: 100%;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior-y: contain;
      scrollbar-gutter: stable;
      justify-content: flex-start;
    }
  }
`;

export const FormContent = styled.div`
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
`;

export const Topline = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 38px;
  span {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    color: #718e75;
  }
  a {
    font-size: 12px;
    text-decoration: none;
    color: #546c58;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Kicker = styled.p`
  font-size: 11px;
  color: #738b74;
  letter-spacing: 0.18em;
  font-weight: 600;
  margin: 0 0 13px;
`;
export const Heading = styled.h2`
  font-size: clamp(28px, 3.1vw, 42px);
  font-weight: 500;
  letter-spacing: -0.065em;
  line-height: 1.3;
  margin: 0;
  color: #284934;
`;
export const Lead = styled.p`
  color: #829386;
  font-size: 13px;
  line-height: 1.9;
  margin: 12px 0 38px;
  word-break: keep-all;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
`;
export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;
export const Label = styled.label`
  color: #344d3b;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.015em;
  span {
    color: #9aaf9d;
    font-size: 11px;
    font-weight: 400;
    margin-left: 4px;
  }
`;

const inputStyle = css`
  display: block;
  width: 100%;
  min-width: 0;
  height: 53px;
  padding: 0 17px;
  border-radius: 8px;
  border: 1px solid #dce6d9;
  outline: none;
  background: #f9faf6;
  color: #273e2e;
  font: inherit;
  font-size: 13px;
  transition:
    background 0.22s,
    border-color 0.22s,
    box-shadow 0.22s;
  &::placeholder {
    color: #a4afa4;
  }
  &:focus {
    background: #fff;
    border-color: #83a188;
    box-shadow: 0 0 0 3px rgba(110, 151, 116, 0.12);
  }
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
  &[aria-invalid="true"] {
    border-color: #be7e77;
  }
`;
export const TextInput = styled.input`
  ${inputStyle}
`;
export const SelectInput = styled.select`
  ${inputStyle} cursor: pointer;
`;
export const InputWrap = styled.div`
  position: relative;
  min-width: 0;
`;
export const InputWithButton = styled(TextInput)`
  padding-right: 74px;
`;
export const InsideButton = styled.button`
  position: absolute;
  right: 9px;
  top: 50%;
  transform: translateY(-50%);
  height: 36px;
  padding: 0 13px;
  background: transparent;
  border: none;
  color: #6e8973;
  font-size: 12px;
  cursor: pointer;
  border-radius: 5px;
  &:focus-visible {
    outline: 2px solid #6e8973;
  }
`;
export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 19px;
`;
export const SectionHeading = styled.h3`
  color: #345840;
  font-size: 14px;
  font-weight: 650;
  letter-spacing: -0.025em;
  margin: 12px 0 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #e6ebe2;
`;
export const FieldHelp = styled.p`
  color: #7e9280;
  font-size: 11px;
  line-height: 1.6;
  margin: 0;
  &[data-error="true"] {
    color: #b56e67;
  }
  &[data-valid="true"] {
    color: #558d5f;
  }
`;
export const InlinePair = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  > * {
    min-width: 0;
  }
  > input {
    flex: 1;
  }
`;
export const DividerDash = styled.span`
  color: #a8b7a7;
  flex: 0 0 auto;
`;
export const CheckboxLabel = styled.label`
  display: inline-flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 12px;
  color: #637864;
  cursor: pointer;
  line-height: 1.65;
  input {
    accent-color: #315941;
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
    margin: 2px 0 0;
  }
`;
export const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
export const RadioPill = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 44px;
  padding: 0 17px;
  border: 1px solid #dde7db;
  border-radius: 7px;
  background: #f9faf6;
  color: #566e5a;
  font-size: 12px;
  cursor: pointer;
  &:has(input:checked) {
    border-color: #8daa91;
    background: #eaf1e7;
    color: #285038;
  }
  input {
    accent-color: #315941;
  }
`;

export const Button = styled.button<{ $secondary?: boolean }>`
  width: 100%;
  min-height: 54px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.005em;
  transition:
    background 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
  color: ${({ $secondary }) => ($secondary ? "#36543d" : "#fffef9")};
  background: ${({ $secondary }) => ($secondary ? "#f4f7f1" : "#2f563d")};
  border: 1px solid ${({ $secondary }) => ($secondary ? "#d9e4d6" : "#2f563d")};
  &:hover:not(:disabled) {
    background: ${({ $secondary }) => ($secondary ? "#e8efe5" : "#254833")};
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(37, 72, 51, 0.1);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid #779b7c;
    outline-offset: 3px;
  }
`;
export const MiniButton = styled(Button)`
  width: auto;
  flex: 0 0 auto;
  min-height: 53px;
  white-space: nowrap;
  padding: 0 17px;
`;
export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  > * {
    flex: 1;
  }
`;
export const FormLinks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`;
export const TextLink = styled(Link)`
  font-size: 12px;
  color: #57785e;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;
export const FormFooter = styled.div`
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid #e6ebe2;
  text-align: center;
  color: #7d8e7e;
  font-size: 12px;
  line-height: 1.8;
`;

// 회원가입 2단계 공통 상단 영역
export const Stepper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0 0 35px;
`;
export const StepItem = styled.div<{ $active: boolean; $done?: boolean }>`
  display: flex;
  gap: 8px;
  align-items: center;
  color: ${({ $active }) => ($active ? "#31553d" : "#a2b0a1")};
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  white-space: nowrap;
`;
export const StepCircle = styled.span<{ $active: boolean; $done?: boolean }>`
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 11px;
  color: ${({ $active, $done }) => ($active || $done ? "#fff" : "#8ca08e")};
  background: ${({ $active, $done }) =>
    $active || $done ? "#31583f" : "#edf2eb"};
`;
export const StepLine = styled.span`
  flex: 1;
  height: 1px;
  background: #d9e3d7;
`;

export const AgreeAll = styled.div`
  padding: 20px;
  border-radius: 10px;
  background: #ecf3ea;
  border: 1px solid #d7e5d3;
  margin-bottom: 20px;
  strong {
    font-size: 13px;
    color: #2e5139;
  }
`;
export const TermsCard = styled.section`
  border: 1px solid #e1e8de;
  border-radius: 10px;
  margin-bottom: 14px;
  overflow: hidden;
  background: #fff;
`;
export const TermsHeader = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  padding: 19px;
`;
export const TermsToggle = styled.button`
  border: none;
  background: none;
  font-size: 12px;
  color: #7e927e;
  cursor: pointer;
  white-space: nowrap;
  padding: 8px 0;
`;
export const TermsBody = styled.div`
  border-top: 1px solid #ecf0e9;
  padding: 17px 19px;
  max-height: 170px;
  overflow-y: auto;
  white-space: pre-wrap;
  font-size: 11px;
  line-height: 1.9;
  color: #728273;
  background: #fafbf8;
`;
export const LegalNote = styled.p`
  font-size: 11px;
  line-height: 1.8;
  color: #a17461;
  margin: 11px 0 19px;
`;

// 기존 Daum 우편번호 API를 임베드하는 접근성 있는 모달
export const ModalScrim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(14, 31, 22, 0.56);
  backdrop-filter: blur(7px);
`;
export const ModalCard = styled.div`
  width: min(530px, 100%);
  max-height: min(660px, calc(100svh - 40px));
  overflow: auto;
  background: #fffef9;
  padding: 22px;
  border-radius: 14px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.19);
`;
export const ModalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  h3 {
    font-size: 17px;
    color: #285039;
    margin: 0;
  }
`;
export const ModalClose = styled.button`
  border: none;
  background: #edf3ea;
  color: #35583f;
  padding: 9px 12px;
  border-radius: 7px;
  cursor: pointer;
`;
