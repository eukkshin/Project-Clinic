import styled, { css } from "styled-components";

// 기존 MyPage.styles.ts의 Root/Hero/MainGrid/Sidebar/Heading 스타일을
// AccountSettingsClient에서 그대로 사용합니다. 이 파일은 새 폼에 필요한 요소만 정의합니다.
const forest = "#294737";
const gold = "#B09F77";
const soft = "#F5F3ED";
const border = "#E0E5DC";
const muted = "#748477";

export const Intro = styled.section`
  margin-bottom: 32px;
  padding: clamp(26px, 4vw, 38px);
  background: ${forest};
  color: #f9f8f2;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  &::after {
    content: "";
    width: 220px;
    height: 220px;
    position: absolute;
    right: -70px;
    bottom: -125px;
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 50%;
    box-shadow:
      0 0 0 36px rgba(255, 255, 255, 0.028),
      0 0 0 72px rgba(255, 255, 255, 0.018);
  }
`;
export const IntroEyebrow = styled.p`
  margin: 0 0 15px;
  color: #bfd1c1;
  letter-spacing: 0.18em;
  font-size: 10px;
`;
export const IntroHeading = styled.h2`
  margin: 0;
  font-size: clamp(21px, 3vw, 29px);
  font-weight: 500;
  letter-spacing: -0.04em;
`;
export const IntroDescription = styled.p`
  margin: 10px 0 0;
  font-size: 12px;
  line-height: 1.85;
  color: #d5e1d5;
`;
export const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 28px;
`;
export const Tab = styled.button<{ $active: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? forest : border)};
  background: ${({ $active }) => ($active ? forest : "#FFF")};
  color: ${({ $active }) => ($active ? "#FFF" : forest)};
  border-radius: 999px;
  padding: 11px 17px;
  font:
    500 12px "Pretendard",
    Arial,
    sans-serif;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
  &:hover {
    border-color: ${forest};
  }
  &:focus-visible {
    outline: 2px solid ${gold};
    outline-offset: 3px;
  }
`;
export const Panel = styled.section`
  border: 1px solid ${border};
  background: #fff;
  border-radius: 12px;
  padding: clamp(22px, 3.5vw, 34px);
  margin-bottom: 17px;
`;
export const SectionEyebrow = styled.p`
  margin: 0 0 7px;
  font-size: 10px;
  letter-spacing: 0.15em;
  color: ${gold};
  font-weight: 600;
`;
export const SectionTitle = styled.h2`
  margin: 0;
  font-size: clamp(19px, 2.5vw, 24px);
  color: ${forest};
  font-weight: 600;
  letter-spacing: -0.04em;
`;
export const SectionDescription = styled.p`
  margin: 10px 0 26px;
  color: ${muted};
  font-size: 12px;
  line-height: 1.85;
`;
export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: minmax(110px, 150px) minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #eef0e9;
  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;
export const InfoName = styled.span`
  font-size: 12px;
  color: #8c988b;
`;
export const InfoContent = styled.div`
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 500;
  color: ${forest};
  overflow-wrap: anywhere;
`;
export const Micro = styled.span`
  display: inline-flex;
  font-size: 10px;
  font-weight: 500;
  color: #809080;
  padding: 5px 8px;
  border: 1px solid #dfe7de;
  background: #f6f8f3;
  border-radius: 5px;
`;
export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;
export const Field = styled.div<{ $full?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${({ $full }) =>
    $full &&
    css`
      grid-column: 1 / -1;
    `}
`;
export const FieldLabel = styled.label`
  font-size: 12px;
  color: #526a57;
  font-weight: 600;
`;
export const TextInput = styled.input`
  display: block;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  height: 48px;
  padding: 0 14px;
  background: #fcfcfa;
  border: 1px solid ${border};
  border-radius: 6px;
  color: ${forest};
  font:
    13px "Pretendard",
    Arial,
    sans-serif;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
  &::placeholder {
    color: #a4b0a3;
  }
  &:hover {
    border-color: #b8c9b6;
  }
  &:focus {
    outline: none;
    border-color: #7c9b83;
    background: #fff;
  }
  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(135, 157, 135, 0.13);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 22px;
`;
export const Primary = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 9px;
  min-height: 44px;
  padding: 12px 21px;
  background: ${forest};
  color: white;
  border: 1px solid ${forest};
  border-radius: 6px;
  font:
    500 12px "Pretendard",
    Arial,
    sans-serif;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
  &:hover:not(:disabled) {
    background: #40604b;
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${gold};
    outline-offset: 3px;
  }
`;
export const Note = styled.p`
  margin: 17px 0 0;
  padding: 13px 16px;
  background: ${soft};
  color: #69796d;
  border-radius: 6px;
  line-height: 1.85;
  font-size: 11px;
`;
export const Alert = styled.div<{ $error?: boolean }>`
  margin-bottom: 18px;
  padding: 14px 16px;
  border-radius: 6px;
  border: 1px solid ${({ $error }) => ($error ? "#EDD3CD" : "#DDE8D8")};
  background: ${({ $error }) => ($error ? "#FFF8F6" : "#F4F8F1")};
  color: ${({ $error }) => ($error ? "#9F4D45" : "#315841")};
  font-size: 12px;
  line-height: 1.7;
`;
export const ConsentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid #eef0e9;
  &:last-child {
    border-bottom: 0;
  }
`;
export const ConsentName = styled.h3`
  margin: 0 0 7px;
  font-size: 13px;
  font-weight: 600;
  color: ${forest};
`;
export const ConsentDescription = styled.p`
  margin: 0;
  font-size: 11px;
  line-height: 1.75;
  color: ${muted};
`;
export const Switch = styled.input`
  appearance: none;
  -webkit-appearance: none;
  flex: 0 0 auto;
  width: 45px;
  height: 26px;
  border-radius: 99px;
  border: 1px solid #c4d3c2;
  background: #d7ded4;
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;
  &::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    top: 2px;
    left: 2px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 1px 4px rgba(15, 40, 30, 0.12);
    transition: transform 0.2s ease;
  }
  &:checked {
    background: ${forest};
    border-color: ${forest};
  }
  &:checked::after {
    transform: translateX(19px);
  }
  &:focus-visible {
    outline: 2px solid ${gold};
    outline-offset: 3px;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
