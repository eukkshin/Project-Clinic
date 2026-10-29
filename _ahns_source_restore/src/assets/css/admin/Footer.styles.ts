import styled from "styled-components";

import {
  BoxShadow,
  FlexBetween,
  FlexCenter,
  FlexColumn,
  TransitionAll,
} from "../Common.styles";

export const FooterAdminContainer = styled.div`
  width: 100%;
`;

export const FooterPageHeader = styled.div`
  ${FlexBetween}
  margin-bottom: 1.5rem;
`;

export const FooterPageTitle = styled.h1`
  font-size: 1.5rem;
  color: #34453c;
  font-weight: 700;
  margin: 0;
`;

export const FooterSaveButton = styled.button`
  background-color: #1b4d3e;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  ${FlexCenter}
  gap: 0.5rem;
  cursor: pointer;
  ${BoxShadow}
  transition: background-color 0.2s;

  &:hover {
    background-color: #246652;
  }
`;

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const FooterCard = styled.div`
  background-color: #fff;
  border-radius: 12px;
  ${BoxShadow}
  border: 1px solid rgba(59, 122, 87, 0.1);
  overflow: hidden;
  height: fit-content;
`;

export const FooterCardHeader = styled.div`
  background-color: #f7f9f7;
  border-bottom: 1px solid #e4eae5;
  padding: 1rem 1.25rem;
`;

export const FooterCardTitle = styled.h6`
  margin: 0;
  font-weight: 700;
  color: #1b4d3e;
`;

export const FooterCardBody = styled.div`
  padding: 1.5rem;
  color: #738079;
`;

export const FooterFormGroup = styled.div`
  margin-bottom: 1.2rem;
  width: 100%;
`;

export const FooterLabel = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #34453c;
  margin-bottom: 0.5rem;
`;

export const FooterInput = styled.input`
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  color: #34453c;
  background-color: #fff;
  border: 1px solid #d6e0d8;
  border-radius: 12px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #1b4d3e;
  }
`;

export const FooterFlexRow = styled.div`
  ${FlexCenter}
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    ${FlexColumn}
    gap: 0;
  }
`;

export const FooterFamilyRow = styled.div`
  ${FlexCenter}
  gap: 0.5rem;
  margin-bottom: 0.8rem;
`;

export const FooterDeleteBtn = styled.button`
  background: transparent;
  border: none;
  color: #bf6059;
  cursor: pointer;
  ${FlexCenter}
  ${TransitionAll};
  border-radius: 50%;
  width: 36px;
  height: 36px;

  margin: 0 auto;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background-color: #fff0ee;
    color: #ff4d4f;
  }
`;

export const FooterAddButton = styled.button`
  border: 1px dashed rgba(59, 122, 87, 0.3);
  color: #34453c;
  padding: 1rem;
  width: 100%;
  border-radius: 12px;
  font-weight: 600;
  ${TransitionAll};
  ${FlexCenter}
  gap: 0.5rem;
  background-color: #f7f9f7;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background-color: #fff;
    border-color: #1b4d3e;
    color: #1b4d3e;
  }
`;
