import styled from 'styled-components';

const breakAt = "@media (max-width: 860px)";

export const Shell = styled.main`
  --ink: #233e32;
  --muted: #718276;
  --paper: #f7f6f0;
  min-height: 100svh;
  background: var(--paper);
  color: var(--ink);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  font-family: var(--ahns-body, Pretendard, sans-serif);
  ${breakAt} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Story = styled.aside`
  min-width: 0;
  min-height: 100svh;
  padding: clamp(100px, 14vh, 180px) clamp(30px, 5.8vw, 100px) 72px;
  background: #234337;
  color: #f8f6eb;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    pointer-events: none;
    width: 42vw;
    height: 42vw;
    border: 1px solid rgba(246, 242, 221, 0.15);
    border-radius: 50%;
    right: -19vw;
    bottom: -23vw;
  }
  ${breakAt} {
    min-height: auto;
    padding: 104px 24px 36px;
  }
`;

export const Eyebrow = styled.p`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  opacity: 0.75;
  margin: 0 0 22px;
`;
export const StoryTitle = styled.h1`
  font-family: var(--ahns-display, "Cormorant Garamond", Georgia, serif);
  font-weight: 400;
  font-size: clamp(57px, 6.2vw, 110px);
  letter-spacing: -0.048em;
  line-height: 0.92;
  margin: 0 0 27px;
`;
export const StoryDescription = styled.p`
  max-width: 340px;
  font-size: 14px;
  line-height: 1.95;
  color: #d6dfd7;
  margin: 0;
  word-break: keep-all;
`;
export const BrandSignature = styled.span`
  margin-top: 56px;
  font-family: var(--ahns-display, Georgia, serif);
  font-size: 21px;
  letter-spacing: -0.07em;
  ${breakAt} {
    display: none;
  }
`;

export const FormSide = styled.section`
  min-width: 0;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 116px clamp(24px, 5vw, 96px) 68px;
  ${breakAt} {
    min-height: auto;
    padding: 36px 24px 88px;
  }
`;
export const FormContainer = styled.div`
  width: 100%;
  max-width: 470px;
`;
export const StepLabel = styled.p`
  color: #9b8a66;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.21em;
  margin: 0 0 18px;
`;
export const FormTitle = styled.h2`
  margin: 0 0 12px;
  font-weight: 500;
  letter-spacing: -0.045em;
  font-size: clamp(29px, 3.1vw, 41px);
`;
export const FormDescription = styled.p`
  color: var(--muted);
  font-size: 13px;
  line-height: 1.85;
  margin: 0 0 32px;
  word-break: keep-all;
`;
export const Form = styled.form`
  display: grid;
  gap: 20px;
`;
export const Field = styled.div`
  display: grid;
  gap: 9px;
`;
export const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.01em;
`;
export const InputWrap = styled.div`
  position: relative;
`;
export const Input = styled.input`
  display: block;
  width: 100%;
  height: 54px;
  padding: 0 16px;
  border: 1px solid #d9ded6;
  border-radius: 2px;
  background: #fffefa;
  color: var(--ink);
  font: 400 14px var(--ahns-body, Pretendard, sans-serif);
  outline: none;
  transition:
    border-color 0.22s ease,
    box-shadow 0.22s ease;
  &::placeholder {
    color: #9ca79f;
  }
  &:focus-visible {
    border-color: #3c6a51;
    box-shadow: 0 0 0 3px rgba(60, 106, 81, 0.095);
  }
  &:disabled {
    opacity: 0.65;
  }
`;
export const PasswordInput = styled(Input)`
  padding-right: 92px;
`;
export const Visibility = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  padding: 7px;
  color: #597060;
  background: transparent;
  font-size: 12px;
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid #3c6a51;
  }
`;
export const FieldHint = styled.p<{ $error?: boolean; $success?: boolean }>`
  margin: 0;
  line-height: 1.65;
  font-size: 11px;
  color: ${({ $error, $success }) =>
    $error ? "#a63a3a" : $success ? "#386e4d" : "#829087"};
`;
export const SubmitButton = styled.button`
  height: 55px;
  border: 1px solid #234337;
  border-radius: 2px;
  background: #234337;
  color: #f8f6eb;
  font: 600 13px var(--ahns-body, Pretendard, sans-serif);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 0 22px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover:not(:disabled) {
    background: #345c49;
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid #234337;
    outline-offset: 3px;
  }
`;
export const Notice = styled.div<{ $error?: boolean }>`
  padding: 17px 18px;
  font-size: 13px;
  line-height: 1.8;
  border: 1px solid ${({ $error }) => ($error ? "#e7c5c0" : "#cddcd1")};
  color: ${({ $error }) => ($error ? "#813f36" : "#285340")};
  background: ${({ $error }) => ($error ? "#fff3f1" : "#ecf5ed")};
`;
export const SecondaryLink = styled.a`
  display: inline-flex;
  color: #4e6657;
  font-size: 12px;
  text-decoration: none;
  gap: 8px;
  margin-top: 24px;
  &:hover {
    text-decoration: underline;
  }
  &:focus-visible {
    outline: 2px solid #234337;
    outline-offset: 4px;
  }
`;
export const Rule = styled.hr`
  margin: 28px 0 0;
  border: none;
  border-top: 1px solid #d9ded6;
`;
export const Steps = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 29px;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: #8b9b8d;
  & > span:nth-child(2) {
    opacity: 0.4;
  }
  & > span[data-active="true"] {
    color: #234337;
    font-weight: 700;
  }
`;
