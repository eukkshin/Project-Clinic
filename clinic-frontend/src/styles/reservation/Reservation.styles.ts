import Link from 'next/link';
import styled, { keyframes } from 'styled-components';

const green = "#19382e";
const greenSoft = "#315243";
const ivory = "#f8f6ef";
const muted = "#7f8b7e";
const gold = "#af9370";
const line = "#deded3";
const serif = '"Cormorant Garamond", Georgia, serif';
const sans = '"Pretendard", Arial, sans-serif';

const appear = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Page = styled.main`
  min-height: 100vh;
  padding-top: 104px;
  background: ${ivory};
  color: ${green};
  font-family: ${sans};
  @media (max-width: 768px) {
    padding-top: 76px;
  }
`;
export const Hero = styled.section`
  position: relative;
  overflow: hidden;
  background: ${green};
  color: #f8f7ed;
  padding: clamp(72px, 8vw, 116px) 24px clamp(72px, 8vw, 112px);
  text-align: center;
  isolation: isolate;
  &::before {
    content: "";
    position: absolute;
    width: 720px;
    aspect-ratio: 1;
    border: 1px solid #ffffff20;
    border-radius: 50%;
    top: -410px;
    right: -140px;
    z-index: -1;
    box-shadow:
      0 0 0 120px #ffffff05,
      0 0 0 260px #ffffff04;
  }
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 20% 90%, #53705e66, transparent 60%);
    z-index: -1;
  }
`;
export const Eyebrow = styled.p`
  color: #d5bf9d;
  letter-spacing: 0.3em;
  font-size: 11px;
  font-weight: 600;
  margin: 0 0 19px;
`;
export const HeroTitle = styled.h1`
  font: 400 clamp(58px, 9vw, 112px)/0.96 ${serif};
  letter-spacing: -0.045em;
  margin: 0;
  em {
    color: #cfb48d;
    font-style: italic;
  }
`;
export const HeroSub = styled.p`
  color: #e2e7dc;
  font-size: 13px;
  line-height: 1.95;
  margin: 27px auto 0;
  max-width: 580px;
`;
export const Inner = styled.div`
  width: min(1180px, calc(100% - 64px));
  margin: 0 auto;
  padding: 76px 0 126px;
  display: grid;
  grid-template-columns: minmax(240px, 0.8fr) minmax(0, 1.5fr);
  gap: clamp(35px, 6vw, 100px);
  align-items: start;
  @media (max-width: 900px) {
    display: block;
    padding-top: 54px;
  }
  @media (max-width: 560px) {
    width: calc(100% - 36px);
    padding-bottom: 78px;
  }
`;
export const Aside = styled.aside`
  position: sticky;
  top: 142px;
  @media (max-width: 900px) {
    position: static;
    margin-bottom: 39px;
  }
`;
export const SectionNo = styled.p`
  letter-spacing: 0.22em;
  font-size: 10px;
  color: ${gold};
  font-weight: 700;
  margin: 0 0 18px;
`;
export const AsideTitle = styled.h2`
  font: 400 clamp(40px, 5vw, 64px)/1.06 ${serif};
  letter-spacing: -0.035em;
  margin: 0 0 21px;
  em {
    color: ${gold};
    font-style: italic;
  }
`;
export const AsideDesc = styled.p`
  color: ${muted};
  font-size: 13px;
  line-height: 2;
  margin: 0 0 29px;
  max-width: 380px;
`;
export const AsideSteps = styled.div`
  border-top: 1px solid ${line};
  padding-top: 21px;
  display: grid;
  gap: 19px;
`;
export const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  span {
    color: ${gold};
    font: italic 24px ${serif};
  }
  p {
    margin: 0;
    font-size: 12px;
    color: ${greenSoft};
  }
`;
export const HelpLink = styled(Link)`
  display: inline-block;
  color: ${green};
  font-size: 12px;
  border-bottom: 1px solid ${gold};
  margin-top: 30px;
  padding-bottom: 6px;
  text-decoration: none;
`;
export const FormShell = styled.div`
  border: 1px solid #deddd2;
  background: #fffefa;
  box-shadow: 0 22px 64px #233e2b0b;
  animation: ${appear} 0.7s both;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
export const FormTop = styled.header`
  border-bottom: 1px solid ${line};
  padding: 34px 38px 27px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 15px;
  @media (max-width: 560px) {
    padding: 26px 20px 21px;
  }
`;
export const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.045em;
  margin: 0;
`;
export const FormIndex = styled.span`
  color: ${gold};
  font: italic 31px ${serif};
`;
export const Form = styled.form`
  padding: 35px 38px 40px;
  display: grid;
  gap: 31px;
  @media (max-width: 560px) {
    padding: 26px 20px 30px;
    gap: 27px;
  }
`;
export const Fieldset = styled.fieldset`
  margin: 0;
  border: 0;
  min-width: 0;
  padding: 0;
`;
export const FieldTitle = styled.legend`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: ${green};
  margin-bottom: 13px;
  padding: 0;
`;
export const Required = styled.span`
  color: #9e764c;
  margin-left: 4px;
`;
export const FieldHint = styled.p`
  color: ${muted};
  font-size: 11px;
  line-height: 1.8;
  margin: 9px 0 0;
`;
export const ChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  @media (max-width: 560px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
export const ChoiceButton = styled.button<{ $active: boolean }>`
  cursor: pointer;
  font: 500 12px ${sans};
  padding: 16px 7px;
  border: 1px solid ${({ $active }) => ($active ? green : line)};
  background: ${({ $active }) => ($active ? green : "#fffefa")};
  color: ${({ $active }) => ($active ? "white" : green)};
  transition:
    background 0.18s,
    border-color 0.18s,
    color 0.18s;
  &:hover {
    border-color: ${green};
  }
  &:focus-visible {
    outline: 2px solid ${gold};
    outline-offset: 2px;
  }
`;
export const TwoFields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;
export const Input = styled.input`
  display: block;
  width: 100%;
  min-height: 49px;
  box-sizing: border-box;
  padding: 12px 14px;
  background: #fffefa;
  border: 1px solid ${line};
  border-radius: 0;
  outline: none;
  color: ${green};
  font: 400 13px ${sans};
  &:focus-visible {
    border-color: ${gold};
    box-shadow: 0 0 0 1px ${gold};
  }
  &:disabled {
    color: ${muted};
    background: #f5f5ef;
  }
`;
export const Textarea = styled.textarea`
  width: 100%;
  min-height: 124px;
  box-sizing: border-box;
  padding: 15px;
  resize: vertical;
  border: 1px solid ${line};
  outline: none;
  background: #fffefa;
  border-radius: 0;
  color: ${green};
  font: 400 13px/1.8 ${sans};
  &::placeholder {
    color: #a0a89e;
  }
  &:focus-visible {
    border-color: ${gold};
    box-shadow: 0 0 0 1px ${gold};
  }
`;
export const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  @media (max-width: 560px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;
export const TimeButton = styled(ChoiceButton)`
  padding: 12px 5px;
  &:disabled {
    cursor: not-allowed;
    color: #b2b5ae;
    border-color: ${line};
    background: #f6f6f2;
  }
`;
export const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 19px 22px;
  border: 1px solid ${line};
  background: #f6f6ef;
`;
export const ProfileName = styled.strong`
  font-size: 15px;
  font-weight: 600;
`;
export const ProfileText = styled.p`
  color: ${muted};
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  overflow-wrap: anywhere;
`;
export const Consent = styled.label`
  display: flex;
  align-items: start;
  gap: 11px;
  font-size: 12px;
  line-height: 1.8;
  cursor: pointer;
  input {
    flex: 0 0 17px;
    width: 17px;
    height: 17px;
    accent-color: ${green};
    margin: 2px 0 0;
  }
`;
export const SubmitButton = styled.button`
  cursor: pointer;
  padding: 18px 24px;
  min-height: 58px;
  border: 1px solid ${green};
  background: ${green};
  color: white;
  font: 600 13px ${sans};
  transition:
    background 0.2s,
    color 0.2s;
  &:hover:not(:disabled) {
    background: white;
    color: ${green};
  }
  &:disabled {
    opacity: 0.58;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${gold};
    outline-offset: 3px;
  }
`;
export const Message = styled.p<{ $error?: boolean }>`
  color: ${({ $error }) => ($error ? "#a23b37" : green)};
  font-size: 12px;
  line-height: 1.75;
  margin: 0;
`;
export const Result = styled.div`
  padding: clamp(28px, 5vw, 54px);
  text-align: center;
`;
export const ResultSymbol = styled.div`
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border: 1px solid #c9d4c7;
  border-radius: 50%;
  color: ${greenSoft};
  font: italic 38px ${serif};
  margin: 0 auto 21px;
`;
export const ResultTitle = styled.h2`
  font: 400 clamp(38px, 5vw, 54px)/1.1 ${serif};
  margin: 0 0 19px;
`;
export const ResultDesc = styled.p`
  font-size: 13px;
  line-height: 2;
  color: ${muted};
  margin: 0 auto 29px;
  max-width: 460px;
`;
export const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
`;
export const SolidLink = styled(Link)`
  display: inline-flex;
  padding: 14px 22px;
  background: ${green};
  color: white;
  text-decoration: none;
  font-size: 12px;
  align-items: center;
`;
export const GhostButton = styled.button`
  padding: 13px 20px;
  border: 1px solid ${line};
  background: #fffefa;
  color: ${green};
  font: 500 12px ${sans};
  cursor: pointer;
`;

// ===== 달력형 실시간 예약 UI =====
export const CalendarShell = styled.section`
  padding: 20px 18px 22px;
  border: 1px solid ${line};
  background: #fcfcf7;
  @media (max-width: 560px) {
    padding: 15px 11px;
  }
`;
export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  strong {
    font: 500 27px ${serif};
    color: ${green};
  }
`;
export const CalendarNav = styled.button`
  width: 39px;
  height: 39px;
  border: 1px solid ${line};
  background: white;
  color: ${green};
  cursor: pointer;
  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${gold};
  }
`;
export const CalendarWeek = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  text-align: center;
  margin-bottom: 5px;
  span {
    color: #7b897e;
    font-size: 11px;
    padding: 9px 0;
  }
`;
export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
`;
export const CalendarBlank = styled.div`
  min-height: 62px;
`;
export const CalendarDay = styled.button<{
  $active: boolean;
  $available: boolean;
}>`
  min-width: 0;
  min-height: 66px;
  border: 1px solid ${({ $active }) => ($active ? green : "transparent")};
  background: ${({ $active }) => ($active ? green : "transparent")};
  color: ${({ $active, $available }) =>
    $active ? "#fffefa" : $available ? green : "#b3b7ad"};
  font-family: ${sans};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  span {
    font-size: 15px;
    font-weight: 500;
  }
  small {
    font-size: 9px;
    color: ${({ $active }) => ($active ? "#d2dccf" : "#8b9b89")};
  }
  &:not(:disabled):hover {
    background: ${({ $active }) => ($active ? green : "#eef1e7")};
  }
  &:disabled {
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${gold};
    outline-offset: -2px;
  }
  @media (max-width: 560px) {
    min-height: 52px;
    gap: 3px;
    span {
      font-size: 13px;
    }
    small {
      font-size: 8px;
    }
  }
`;
export const CalendarLegend = styled.p`
  font-size: 11px;
  color: #859386;
  line-height: 1.8;
  margin: 14px 0 0;
`;
export const SlotSection = styled.div`
  margin-top: 20px;
`;
export const SlotHeading = styled.h3`
  margin: 0 0 13px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.02em;
`;
export const SlotButton = styled.button<{
  $active: boolean;
  $status: "available" | "booked" | "blocked" | "closed";
}>`
  border: 1px solid ${({ $active }) => ($active ? green : line)};
  background: ${({ $active }) => ($active ? green : "#fffefa")};
  color: ${({ $active, $status }) =>
    $active ? "white" : $status === "available" ? green : "#a9afa5"};
  min-height: 54px;
  cursor: pointer;
  padding: 7px 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  font: 500 13px ${sans};
  small {
    font-size: 9px;
    opacity: 0.9;
  }
  &:disabled {
    background: #f4f4ef;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${gold};
  }
`;
