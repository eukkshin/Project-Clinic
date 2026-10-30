import styled from 'styled-components';

// 사용자 방문예약 페이지와 동일한 컬러·타이포그래피·구분선 계열
const green = "#19382e";
const greenSoft = "#315243";
const ivory = "#f8f6ef";
const muted = "#7f8b7e";
const gold = "#af9370";
const line = "#deded3";
const serif = 'var(--ahns-display, "Cormorant Garamond", Georgia, serif)';
const sans = '"Pretendard", Arial, sans-serif';

export const Page = styled.main`
  min-height: 100svh;
  padding-top: 88px;
  background: ${ivory};
  color: ${green};
  font-family: ${sans};
  @media (max-width: 768px) {
    padding-top: 68px;
  }
`;

export const Inner = styled.div`
  width: min(1320px, calc(100% - 72px));
  min-height: calc(100svh - 88px);
  margin: 0 auto;
  padding: 34px 0 44px;
  display: grid;
  grid-template-columns: minmax(260px, 0.83fr) minmax(0, 1.17fr);
  align-items: center;
  gap: clamp(42px, 6vw, 110px);
  @media (max-width: 1020px) {
    grid-template-columns: 1fr;
    align-items: start;
    padding: 40px 0 80px;
    gap: 28px;
  }
  @media (max-width: 600px) {
    width: calc(100% - 36px);
    padding: 24px 0 54px;
  }
  @media (max-width: 768px) {
    min-height: calc(100svh - 68px);
  }
`;

export const Aside = styled.aside`
  align-self: center;
  min-width: 0;
  @media (max-width: 1020px) {
    align-self: stretch;
  }
`;
export const Eyebrow = styled.p`
  color: ${gold};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  margin: 0 0 clamp(27px, 3.5vw, 49px);
  @media (max-width: 1020px) {
    margin-bottom: 18px;
  }
`;
export const SectionNo = styled.p`
  color: #879688;
  font-size: 10px;
  letter-spacing: 0.2em;
  margin: 0 0 17px;
`;
export const Title = styled.h1`
  margin: 0;
  font: 400 clamp(55px, 5.8vw, 93px)/0.98 ${serif};
  letter-spacing: -0.048em;
  white-space: normal;
  em {
    color: ${gold};
    font-weight: 400;
    font-style: italic;
  }
  @media (max-width: 1140px) {
    font-size: clamp(48px, 5.3vw, 75px);
  }
  @media (max-width: 600px) {
    font-size: clamp(46px, 11vw, 72px);
  }
`;
export const Subtitle = styled.h2`
  margin: 26px 0 10px;
  font-size: clamp(17px, 1.7vw, 21px);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 1.55;
  @media (max-width: 1020px) {
    margin-top: 18px;
  }
`;
export const Description = styled.p`
  margin: 0;
  max-width: 430px;
  color: ${muted};
  font-size: 12px;
  line-height: 1.95;
  word-break: keep-all;
`;
export const Steps = styled.div`
  margin-top: 35px;
  max-width: 375px;
  border-top: 1px solid ${line};
  @media (max-width: 1020px) {
    display: none;
  }
`;
export const Step = styled.div`
  display: flex;
  gap: 18px;
  align-items: center;
  border-bottom: 1px solid ${line};
  padding: 12px 2px;
  span {
    color: ${gold};
    font: 400 21px/0.9 ${serif};
    min-width: 32px;
  }
  p {
    margin: 0;
    color: ${greenSoft};
    font-size: 12px;
  }
`;
export const AsideLink = styled.a`
  margin-top: 24px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: ${muted};
  font-size: 11px;
  text-decoration: none;
  span {
    color: ${green};
    border-bottom: 1px solid ${green};
    padding-bottom: 2px;
  }
  &:hover span {
    color: ${gold};
    border-color: ${gold};
  }
  &:focus-visible {
    outline: 2px solid ${gold};
    outline-offset: 3px;
  }
  @media (max-width: 1020px) {
    margin-top: 14px;
  }
`;

export const FormShell = styled.section`
  min-width: 0;
  background: #fff;
  border: 1px solid #e5e5d9;
  box-shadow: 0 16px 45px rgba(29, 55, 35, 0.045);
`;
export const Form = styled.form`
  position: relative;
  padding: clamp(25px, 3vw, 43px);
  @media (max-width: 600px) {
    padding: 23px 18px 27px;
  }
`;
export const FormTop = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${line};
`;
export const FormEyebrow = styled.p`
  margin: 0 0 7px;
  font-size: 9px;
  color: ${gold};
  font-weight: 700;
  letter-spacing: 0.18em;
`;
export const FormTitle = styled.h2`
  margin: 0;
  font-size: clamp(20px, 1.8vw, 25px);
  font-weight: 600;
  letter-spacing: -0.05em;
`;
export const FormIndex = styled.span`
  color: #99a497;
  font: 400 20px/1 ${serif};
  white-space: nowrap;
`;
export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;
export const Field = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 7px;
  margin-bottom: 14px;
  label {
    color: ${green};
    font-size: 11px;
    font-weight: 600;
  }
  label b {
    font-weight: 500;
    color: ${gold};
  }
  input,
  select,
  textarea {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    border: 1px solid #d9dfd5;
    border-radius: 0;
    background: #fcfcf9;
    color: ${green};
    font: 400 12px ${sans};
    outline: none;
    padding: 0 13px;
    height: 41px;
    transition:
      border-color 0.2s ease,
      background 0.2s ease;
  }
  select {
    cursor: pointer;
    padding-right: 7px;
  }
  textarea {
    min-height: 108px;
    height: 108px;
    padding: 12px 13px 23px;
    resize: vertical;
    line-height: 1.7;
  }
  input::placeholder,
  textarea::placeholder {
    color: #a1aba0;
  }
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    border-color: ${green};
    background: #fff;
  }
`;
export const TextareaWrap = styled.div`
  position: relative;
`;
export const CharCount = styled.span`
  position: absolute;
  right: 12px;
  bottom: 9px;
  color: #8b978c;
  font-size: 9px;
  pointer-events: none;
`;
export const Privacy = styled.div`
  padding: 12px 14px;
  background: #f8f9f5;
  border: 1px solid #e3e7df;
  label {
    display: flex;
    align-items: center;
    gap: 9px;
    color: ${greenSoft};
    cursor: pointer;
    font-size: 11px;
    line-height: 1.5;
  }
  label strong {
    font-weight: 600;
  }
  label input {
    width: 15px;
    height: 15px;
    margin: 0;
    flex-shrink: 0;
    accent-color: ${green};
  }
  details {
    margin: 8px 0 0 24px;
  }
  summary {
    display: inline-block;
    list-style: none;
    color: ${muted};
    border-bottom: 1px solid #adbbae;
    cursor: pointer;
    font-size: 10px;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  p {
    margin: 9px 0 0;
    color: ${muted};
    font-size: 10px;
    line-height: 1.8;
  }
`;
export const Error = styled.p`
  margin: 13px 0 0;
  padding: 11px 13px;
  background: #fff2ed;
  color: #a74b3d;
  font-size: 11px;
  line-height: 1.6;
`;
export const Submit = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 49px;
  margin-top: 15px;
  padding: 0 18px;
  border: 1px solid ${green};
  border-radius: 0;
  background: ${green};
  color: #f8f7ef;
  cursor: pointer;
  font: 500 12px ${sans};
  transition: background 0.2s ease;
  span {
    font-size: 18px;
    transition: transform 0.2s ease;
  }
  &:hover:not(:disabled) {
    background: ${greenSoft};
  }
  &:hover:not(:disabled) span {
    transform: translate(2px, -2px);
  }
  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }
  &:focus-visible {
    outline: 2px solid ${gold};
    outline-offset: 3px;
  }
`;
export const Notice = styled.p`
  color: #859084;
  text-align: center;
  font-size: 10px;
  line-height: 1.6;
  margin: 11px 0 0;
`;
export const Success = styled.div`
  min-height: 450px;
  padding: clamp(45px, 5vw, 72px) clamp(25px, 4vw, 55px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
export const SuccessMark = styled.div`
  font: 400 58px/1 ${serif};
  color: ${gold};
  margin-bottom: 18px;
`;
export const SuccessTitle = styled.h2`
  margin: 10px 0 10px;
  font-size: 25px;
  font-weight: 600;
  letter-spacing: -0.05em;
`;
export const SuccessText = styled.p`
  color: ${muted};
  font-size: 12px;
  line-height: 2;
  strong {
    color: ${green};
  }
`;
