import styled from "styled-components";

/**
 * QuickConsultBar · Frosted Sage Glass
 *
 * 배경이 살짝 보이는 '유리'의 핵심은 background의 알파값과 backdrop-filter다.
 * blur만 강하게 주면 내용이 지저분해 보여서 흰빛 반투명 배경과 함께 사용한다.
 * 모바일에서는 기존처럼 상담바를 숨긴다(1024px 이하).
 */
export const BarWrapper = styled.aside`
  position: fixed;
  left: 50%;
  bottom: max(16px, env(safe-area-inset-bottom));
  z-index: 10010;
  width: min(1640px, calc(100% - 48px));
  transform: translateX(-50%);

  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 24px;
  background: rgba(238, 245, 237, 0.74);
  backdrop-filter: blur(26px) saturate(145%);
  -webkit-backdrop-filter: blur(26px) saturate(145%);
  box-shadow:
    0 16px 50px rgba(18, 49, 33, 0.15),
    0 2px 12px rgba(18, 49, 33, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  color: #284634;

  @media (max-width: 1350px) {
    width: calc(100% - 30px);
    border-radius: 20px;
  }

  @media (max-width: 1024px) {
    display: none;
  }

  @media (prefers-reduced-transparency: reduce) {
    background: #eaf1e8;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
`;

export const BarInner = styled.div`
  position: relative;
  min-height: 104px;
  display: flex;
  align-items: center;
  gap: clamp(20px, 2.2vw, 42px);
  padding: 18px 65px 18px 34px;

  @media (max-width: 1350px) {
    padding: 16px 56px 16px 24px;
    gap: 18px;
  }
`;

export const Identity = styled.div`
  flex: 0 0 auto;
  min-width: 190px;
  padding-right: 21px;
  border-right: 1px solid rgba(43, 76, 54, 0.22);

  @media (max-width: 1350px) {
    min-width: 150px;
    padding-right: 16px;
  }
`;

export const IdentityEyebrow = styled.span`
  display: block;
  margin-bottom: 5px;
  color: #738e79;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.2em;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: clamp(17px, 1.45vw, 22px);
  line-height: 1.3;
  font-weight: 500;
  letter-spacing: -0.065em;
`;

export const IdentityCaption = styled.p`
  margin: 5px 0 0;
  font-size: 11px;
  color: #6f8675;
  letter-spacing: -0.02em;

  @media (max-width: 1180px) {
    display: none;
  }
`;

export const ConsultForm = styled.form`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: flex-end;
  gap: 11px;
`;

export const Field = styled.div`
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 8px;
  min-width: 0;

  &:nth-child(3) {
    flex: 1.2 1 0;
  }
`;

export const FieldLabel = styled.label`
  padding-left: 3px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #4f7058;
`;

const inputCommon = `
  width: 100%;
  min-width: 0;
  height: 43px;
  padding: 0 14px;
  border: 1px solid rgba(102, 136, 106, .22);
  border-radius: 11px;
  background: rgba(255, 255, 255, .61);
  color: #264536;
  font-family: inherit;
  font-size: 12px;
  outline: none;
  transition: background .24s ease, border-color .24s ease, box-shadow .24s ease;
  &:hover { background: rgba(255,255,255,.8); }
  &:focus-visible {
    background: rgba(255,255,255,.95);
    border-color: rgba(79,119,87,.75);
    box-shadow: 0 0 0 3px rgba(119,151,123,.14);
  }
`;

export const Input = styled.input`
  ${inputCommon}
  &::placeholder {
    color: #86998a;
  }
`;

export const Select = styled.select<{ $placeholder: boolean }>`
  ${inputCommon}
  padding-right: 30px;
  color: ${({ $placeholder }) => ($placeholder ? "#86998a" : "#264536")};
  cursor: pointer;

  /* 운영체제마다 다른 기본 셀렉트 화살표 대신 간단한 chevron 표시 */
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23627e68' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: 15px;
  background-position: right 11px center;

  option {
    color: #264536;
  }
`;

export const ActionGroup = styled.div`
  min-width: 163px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  white-space: nowrap;
`;

export const Checkbox = styled.input`
  accent-color: #426b4b;
  width: 14px;
  height: 14px;
  margin: 0;
  cursor: pointer;
`;

export const AgreeText = styled.span`
  font-size: 10px;
  color: #56705c;
`;

export const SubmitBtn = styled.button`
  min-width: 0;
  height: 43px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 11px;
  padding: 0 15px;
  border: 1px solid #274c35;
  border-radius: 11px;
  background: #274c35;
  color: #f8faf3;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;

  &:hover:not(:disabled) {
    background: #345d40;
    box-shadow: 0 8px 18px rgba(36, 77, 48, 0.16);
    transform: translateY(-2px);
  }
  &:disabled {
    opacity: 0.52;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid #4d7459;
    outline-offset: 3px;
  }
`;

export const CloseBtn = styled.button`
  position: absolute;
  right: 17px;
  top: 16px;
  width: 29px;
  height: 29px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(67, 103, 74, 0.22);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.43);
  color: #617967;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    background 0.25s ease;

  &:hover {
    transform: rotate(90deg);
    background: rgba(255, 255, 255, 0.92);
  }
  &:focus-visible {
    outline: 2px solid #426b4b;
    outline-offset: 3px;
  }
`;

export const Feedback = styled.p<{ $error: boolean }>`
  position: absolute;
  right: 20px;
  bottom: calc(100% + 8px);
  max-width: min(440px, 95vw);
  margin: 0;
  padding: 11px 17px;
  border: 1px solid ${({ $error }) => ($error ? "#efccba" : "#b5d2ba")};
  border-radius: 12px;
  background: ${({ $error }) => ($error ? "#fff6ef" : "#f0f7ee")};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.09);
  color: ${({ $error }) => ($error ? "#904c35" : "#31583d")};
  font-size: 12px;
  line-height: 1.6;
`;
