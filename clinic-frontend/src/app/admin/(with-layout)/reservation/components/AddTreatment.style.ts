
import styled , {keyframes} from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// 모달 등장
const scaleUp = keyframes`
  from {
    opacity: 0;
    transform: scale(0.94) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

// 전체 화면 오버레이
export const TreatmentOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 24px;
  box-sizing: border-box;

  background: rgba(15, 25, 19, 0.32);

  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);

  animation: ${fadeIn} 200ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// // 시술 추가 모달 본체
// export const TreatmentModal = styled.div`
//   position: relative;
//   isolation: isolate;

//   width: 100%;
//   max-width: 560px;
//   max-height: min(760px, calc(100dvh - 48px));

//   display: flex;
//   flex-direction: column;

//   overflow: hidden;
//   box-sizing: border-box;

//   border-radius: 26px;

//   background:
//     radial-gradient(
//       ellipse at 6% -25%,
//       rgba(255, 255, 255, 0.96),
//       transparent 52%
//     ),
//     radial-gradient(
//       ellipse at 105% 110%,
//       rgba(157, 195, 167, 0.28),
//       transparent 62%
//     ),
//     linear-gradient(
//       148deg,
//       rgba(255, 255, 255, 0.91),
//       rgba(244, 250, 242, 0.86) 55%,
//       rgba(230, 242, 230, 0.82)
//     );

//   border: 1px solid rgba(255, 255, 255, 0.9);

//   -webkit-backdrop-filter: blur(30px) saturate(160%);
//   backdrop-filter: blur(30px) saturate(160%);

//   box-shadow:
//     0 32px 85px rgba(13, 41, 28, 0.24),
//     0 12px 32px rgba(27, 67, 43, 0.08),
//     inset 0 2px 0 rgba(255, 255, 255, 0.9);

//   animation: ${scaleUp} 250ms
//     cubic-bezier(0.16, 1, 0.3, 1) both;

//   // 유리 내부 테두리
//   &::before {
//     content: "";
//     position: absolute;
//     inset: 5px;
//     z-index: 0;

//     border: 1px solid rgba(255, 255, 255, 0.3);
//     border-radius: 21px;

//     pointer-events: none;
//   }

//   @media (max-width: 600px) {
//     max-height: calc(100dvh - 36px);
//     border-radius: 23px;

//     &::before {
//       border-radius: 18px;
//     }
//   }

//   @media (prefers-reduced-motion: reduce) {
//     animation: none;
//   }
// `;

export const TreatmentModal = styled.div`
  position: relative;
  isolation: isolate;

  width: 100%;
  max-width: 560px;
  max-height: min(760px, calc(100dvh - 48px));

  display: flex;
  flex-direction: column;

  overflow: hidden;
  box-sizing: border-box;

  border-radius: 28px;

  color: #1d1d1f;

  /* 맑고 투명한 유리 */
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.96) 0%,
      rgba(255, 255, 255, 0.88) 45%,
      rgba(248, 251, 248, 0.91) 100%
    );

  border: 1px solid rgba(255, 255, 255, 0.95);

  -webkit-backdrop-filter: blur(40px) saturate(180%);
  backdrop-filter: blur(40px) saturate(180%);

  box-shadow:
    0 35px 90px rgba(0, 0, 0, 0.16),
    0 12px 30px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 1),
    inset 0 -1px 0 rgba(255, 255, 255, 0.7);

  animation: ${scaleUp} 300ms
    cubic-bezier(0.16, 1, 0.3, 1) both;

  /* 유리 내부 가장자리 */
  &::before {
    content: "";

    position: absolute;
    inset: 5px;

    z-index: 0;

    border: 1px solid rgba(255, 255, 255, 0.65);
    border-radius: 23px;

    pointer-events: none;
  }

  /* 상단 빛 반사 */
  &::after {
    content: "";

    position: absolute;
    top: 0;
    left: 15%;
    right: 15%;

    height: 1px;

    background: rgba(255, 255, 255, 1);
    filter: blur(1px);

    pointer-events: none;
  }

  @media (max-width: 600px) {
    max-height: calc(100dvh - 36px);
    border-radius: 24px;

    &::before {
      border-radius: 19px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;


// 상단 유리 반사
export const GlassShine = styled.div`
  position: absolute;
  top: 0;
  left: 12%;
  right: 12%;

  height: 2px;
  z-index: 3;

  pointer-events: none;

  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.95),
    transparent
  );
`;

// 모달 내부 전체 영역
export const TreatmentForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 100%;
  color: #24352b;
`;
// 헤더
export const ModalHeader = styled.header`
  position: relative;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;

  padding: 30px 32px 22px;

  border-bottom: 1px solid rgba(36, 79, 57, 0.08);

  @media (max-width: 600px) {
    padding: 25px 22px 18px;
  }
`;

export const ModalHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const ModalEyebrow = styled.span`
  color: #829889;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
`;

export const ModalTitle = styled.h2`
  margin: 0;

  color: #264536;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.7px;
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 34px;
  height: 34px;
  flex-shrink: 0;

  border: 1px solid rgba(36, 79, 57, 0.1);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.55);
  color: #738277;

  cursor: pointer;

  transition: all 180ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    color: #244f39;
    transform: rotate(90deg);
  }
`;

// 폼 영역
export const TreatmentFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;
export const ModalBody = styled.div`
  position: relative;
  z-index: 1;

  flex: 1;
  min-height: 0;

  overflow-y: auto;
  overscroll-behavior: contain;

  padding: 0px 32px 28px;

  @media (max-width: 600px) {
    padding: 18px 22px 24px;
  }
`;

// 하단 버튼 영역
export const ModalFooter = styled.div`
  position: relative;
  z-index: 1;

  display: flex;
  justify-content: flex-end;
  gap: 10px;

  padding: 18px 32px 24px;

  border-top: 1px solid rgba(36, 79, 57, 0.08);

  background: rgba(255, 255, 255, 0.2);

  @media (max-width: 600px) {
    padding: 16px 22px 20px;
  }
`;

// 등록 버튼
export const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;

  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 13px;

  background: linear-gradient(135deg, #315f43, #244f39);

  color: #fff;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  box-shadow: 0 6px 16px rgba(36, 79, 57, 0.18);

  transition: all 180ms ease;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #3c7050, #2b5a3d);
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(36, 79, 57, 0.22);
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
//-------------------------------------
// 제목과 설명
export const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 4px;
`;

export const FormTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 750;
  letter-spacing: -0.7px;
  color: #173c2a;
`;

export const FormDescription = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #829087;
`;

// 입력 항목 배치
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 520px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 15px;
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

export const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 650;
  color: #425449;
`;

export const RequiredMark = styled.span`
  margin-left: 4px;
  color: #c45c52;
`;

// 카테고리 / 시술 / 횟수 선택
export const Select = styled.select`
  width: 100%;
  min-height: 46px;
  padding: 0 13px;
  border: 1px solid #dce5dc;
  border-radius: 11px;
  outline: none;
  background: #fff;
  color: #304438;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    border-color: #a7bbaa;
  }

  &:focus {
    border-color: #47775a;
    box-shadow: 0 0 0 3px rgba(71, 119, 90, 0.12);
  }

  &:disabled {
    background: #f3f6f2;
    color: #a0aaa2;
    cursor: not-allowed;
  }
`;

export const PriceBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid #d6e4d6;
  border-radius: 11px;
  background: #f3f7f1;
`;

// export const PriceInput = styled.input`
//   flex: 1;
//   min-width: 0;
//   width: 100%;
//   height: 100%;
//   padding: 0;
//   border: none;
//   outline: none;
//   background: transparent;
//   color: #244f39;
//   font-size: 16px;
//   font-weight: 600;

//   /* 숫자 입력창 기본 화살표 제거 */
//   &::-webkit-inner-spin-button,
//   &::-webkit-outer-spin-button {
//     -webkit-appearance: none;
//     margin: 0;
//   }

//   &[type='number'] {
//     appearance: textfield;
//     -moz-appearance: textfield;
//   }
// `;

export const PriceInput = styled.input`
  flex: 1;
  min-width: 0;
  width: 100%;

  border: none !important;
  outline: none;
  box-shadow: none !important;
  background: transparent !important;

  padding: 0;
  color: #244f39;
  font-size: 16px;
  font-weight: 600;

  &:focus {
    border: none;
    outline: none;
    box-shadow: none;
    background: transparent;
  } 

   /* 숫자 입력창 기본 화살표 제거 */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
     -webkit-appearance: none;
     margin: 0;
   }

   &[type='number'] {
     appearance: textfield;
     -moz-appearance: textfield;
   }
`;
export const PriceUnit = styled.span`
  flex-shrink: 0;
  color: #577461;
  font-size: 13px;
  font-weight: 600;
`;

// 결제 수단 선택
export const PaymentOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 400px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const PaymentOption = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 10px;
  border: 1px solid #dce5dc;
  border-radius: 11px;
  background: #fff;
  color: #657369;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s,
    color 0.2s;

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }

  &:has(input:checked) {
    border-color: #47775a;
    background: #eff5ed;
    color: #244f39;
    box-shadow: inset 0 0 0 1px #47775a;
  }

  &:has(input:focus-visible) {
    outline: 3px solid rgba(71, 119, 90, 0.2);
    outline-offset: 2px;
  }

  &:hover {
    border-color: #8eaa94;
  }
`;

// 하단 버튼 영역
export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 18px;
  border-top: 1px solid #edf0eb;

  @media (max-width: 400px) {
    flex-direction: column-reverse;
  }
`;



export const CategoryOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

export const CategoryOption = styled.label<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 60px;
  padding: 10px 6px;
  border: 1px solid
    ${({ $selected }) => ($selected ? "#8eae94" : "#dedfdd")};
  border-radius: 12px;
  background: ${({ $selected }) => ($selected ? "#eff4ee" : "#fff")};
  color: ${({ $selected }) => ($selected ? "#244f39" : "#59645c")};
  cursor: pointer;
  transition: 0.2s;

  input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  span  {
    font-size: 14px;
    line-height: 1;
  }

  &:hover {
    border-color: #8eae94;
  }

  &:has(input:focus-visible) {
    outline: 3px solid rgba(71, 119, 90, 0.2);
    outline-offset: 2px;
  }
`;

// 횟수 선택 영역
export const CountOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;

  > label {
    box-sizing: border-box;
    min-height: 48px;
  }


`;

// 횟수 선택 버튼
export const CountOption = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 48px;
  padding: 10px 6px;
  border: 1px solid
    ${({ $selected }) => ($selected ? "#8eae94" : "#dedfdd")};
  border-radius: 12px;
  background: ${({ $selected }) => ($selected ? "#eff4ee" : "#fff")};
  color: ${({ $selected }) => ($selected ? "#244f39" : "#59645c")};
  font-size: 13px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 400)};
  cursor: pointer;
  transition: 0.2s;

  input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  &:hover {
    border-color: #8eae94;
  }

  &:has(input:focus-visible) {
    outline: 3px solid rgba(71, 119, 90, 0.2);
    outline-offset: 2px;
  }
`;

export const PriceField = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;

  ${PriceBox} {
    min-height: 48px;
  }
`;

export const ErrorText = styled.p`
  margin: 0;
  color: #c45c52;
  font-size: 12px;
  line-height: 1.5;
`;

export const FormError= styled.p`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 12px 14px;
  margin-bottom: 16px;

  color: #b42318;
  font-size: 13px;
  line-height: 1.5;

  background: #fef3f2;
  border: 1px solid #fecdca;
  border-radius: 10px;

  svg {
    width: 17px;
    height: 17px;
    min-width: 17px;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;
// 패키지 기본 가격 안내
export const HelperText = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  
  .description {
    color: #829087;
    font-size: 13px;
    font-weight: 400;
  }
  .price{
    color: #244f39;
    font-size: 15px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
`;

