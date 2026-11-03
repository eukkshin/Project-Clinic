import styled, { keyframes } from "styled-components";

const appear = keyframes`
  from { opacity: 0; transform: translateY(14px) scale(.985); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

/**
 * EventPopup · Soft Editorial Card
 * 밝은 아이보리/세이지 컬러로 상담바와 톤을 통일한다.
 * 팝업 내용은 별도 DB/API에서 가져오기 때문에 스타일만으로 내용을 꾸며내지 않는다.
 */
export const PopupLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10020;
  pointer-events: none; /* PC에서 팝업 주변을 클릭할 수 있도록 한다. */

  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    overflow-y: auto;
    padding: max(38px, env(safe-area-inset-top)) 16px
      max(36px, env(safe-area-inset-bottom));
    background: rgba(10, 32, 19, 0.4);
    backdrop-filter: blur(7px);
    -webkit-backdrop-filter: blur(7px);
    pointer-events: auto;
  }
`;

export const PopupContainer = styled.article<{ $top: number; $left: number }>`
  position: fixed;
  top: ${({ $top }) => `${$top}px`};
  left: ${({ $left }) => `${$left}px`};
  display: flex;
  flex-direction: column;
  width: 380px;
  max-height: calc(100dvh - 60px);
  overflow: hidden;
  border: 1px solid rgba(248, 250, 242, 0.85);
  border-radius: 18px;
  background: #f7f8f2;
  color: #2c4b36;
  box-shadow:
    0 20px 70px rgba(11, 36, 23, 0.23),
    0 3px 12px rgba(11, 36, 23, 0.08);
  pointer-events: auto;
  animation: ${appear} 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 1024px) {
    position: relative;
    top: auto;
    left: auto;
    width: min(100%, 420px);
    max-height: none;
    flex: none;
    border-radius: 17px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const ImageArea = styled.div`
  position: relative;
  flex: 0 1 auto;
  overflow: hidden;
  background: #e3e9df;
`;

export const PopupLink = styled.a`
  display: block;
  color: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid #547e5c;
    outline-offset: -3px;
  }
  &:hover img {
    transform: scale(1.025);
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

/** 일반 img를 사용한다. next/image의 fill에 필요한 위치 기준이 없어 생기는 경고도 없다. */
export const PopupImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  max-height: 40vh;
  object-fit: contain;
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  background: #e7ebe3;

  @media (max-width: 1024px) {
    max-height: 34vh;
  }
`;

export const ImageBadge = styled.span`
  position: absolute;
  left: 17px;
  top: 17px;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 30px;
  background: rgba(239, 244, 236, 0.7);
  backdrop-filter: blur(10px);
  color: #30503a;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.13em;
  pointer-events: none;
`;

export const ImageLinkCaption = styled.span`
  position: absolute;
  right: 16px;
  bottom: 15px;
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 8px 11px;
  border-radius: 30px;
  background: rgba(33, 69, 43, 0.85);
  color: white;
  font-size: 10px;
  pointer-events: none;
`;

export const FormWrapper = styled.div`
  padding: 22px 24px 20px;
  overflow-y: auto;
  min-height: 0;
  background: linear-gradient(150deg, #fcfcf8 0%, #edf2e9 100%);

  @media (max-width: 1024px) {
    padding: 20px 19px 17px;
    overflow: visible;
  }
`;

export const FormHeading = styled.div`
  margin-bottom: 18px;
`;

export const Eyebrow = styled.span`
  display: block;
  margin-bottom: 8px;
  color: #819a84;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.2em;
`;

export const FormTitle = styled.h3`
  margin: 0;
  color: #2e4d38;
  font-size: 21px;
  line-height: 1.35;
  font-weight: 500;
  letter-spacing: -0.055em;
`;

export const FormCaption = styled.p`
  margin: 7px 0 0;
  color: #78917d;
  font-size: 11px;
  line-height: 1.6;
`;

export const ConsultForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

export const InputGroup = styled.div`
  display: flex;
  gap: 9px;
  min-width: 0;
`;

export const Input = styled.input`
  flex: 1 1 0;
  min-width: 0;
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #d6e1d5;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.87);
  color: #2f4c39;
  font: inherit;
  font-size: 12px;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: #90a093;
  }
  &:focus-visible {
    border-color: #6c9475;
    box-shadow: 0 0 0 3px rgba(100, 140, 109, 0.13);
  }
`;

export const ConsentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
`;

export const PrivacyLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

export const PrivacyCheckbox = styled.input`
  accent-color: #497551;
  width: 15px;
  height: 15px;
  margin: 0;
  cursor: pointer;
`;

export const PrivacyText = styled.span`
  color: #5f7a66;
  font-size: 11px;
`;

export const FormFeedback = styled.p`
  margin: 0;
  color: #a34d42;
  font-size: 11px;
  line-height: 1.5;
`;

export const SubmitBtn = styled.button`
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;
  border: 1px solid #2b5137;
  border-radius: 10px;
  background: #2b5137;
  color: #f9fbf5;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.25s ease,
    transform 0.25s ease;

  &:hover:not(:disabled) {
    background: #3d6847;
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.48;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid #618a6a;
    outline-offset: 3px;
  }
`;

export const FooterWrapper = styled.div`
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 24px;
  border-top: 1px solid #e3e9df;
  background: #f7f8f2;

  @media (max-width: 1024px) {
    padding: 10px 19px;
  }
`;

export const FooterSmall = styled.span`
  font-size: 9px;
  letter-spacing: 0.17em;
  color: #9bafa0;
`;

export const CloseLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #748c79;
  font-size: 11px;
  white-space: nowrap;
  cursor: pointer;
`;

export const CloseCheckbox = styled.input`
  width: 15px;
  height: 15px;
  margin: 0;
  accent-color: #517557;
  cursor: pointer;
`;

export const CloseBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding: 5px 0 5px 8px;
  border: 0;
  background: transparent;
  color: #55745e;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #1f3e2b;
  }
  &:focus-visible {
    outline: 2px solid #618a6a;
    outline-offset: 3px;
  }
`;
