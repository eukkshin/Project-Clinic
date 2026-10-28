
import styled from "styled-components";

// 모달 내부 전체 영역
export const TreatmentForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 100%;
  color: #24352b;
`;

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

// 가격 입력 영역
export const PriceBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 14px;
  border: 1px solid #d6e4d6;
  border-radius: 11px;
  background: #f3f7f1;
`;

export const PriceInput = styled.input`
  width: 100%;
  min-width: 0;
  padding: 12px 0;
  border: none;
  outline: none;
  background: transparent;
  color: #244f39;
  font-size: 19px;
  font-weight: 750;
  text-align: right;

  &:focus {
    outline: none;
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
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;

  input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  span:first-of-type {
    font-size: 19px;
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

// 패키지 기본 가격 안내
export const HelperText = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
  color: #244f39;
  font-size: 13px;
  font-weight: 700;

  small {
    color: #829087;
    font-size: 11px;
    font-weight: 400;
  }
`;

