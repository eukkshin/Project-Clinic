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
  color: #5a5c69;
  font-weight: 700;
  margin: 0;
`;

export const FooterSaveButton = styled.button`
  background-color: #1b4d3e;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 0.35rem;
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
  border-radius: 0.35rem;
  ${BoxShadow}
  border: 1px solid rgba(59, 122, 87, 0.1);
  overflow: hidden;
  height: fit-content;
`;

export const FooterCardHeader = styled.div`
  background-color: #f8f9fc;
  border-bottom: 1px solid #e3e6f0;
  padding: 1rem 1.25rem;
`;

export const FooterCardTitle = styled.h6`
  margin: 0;
  font-weight: 700;
  color: #1b4d3e;
`;

export const FooterCardBody = styled.div`
  padding: 1.5rem;
  color: #858796;
`;

export const FooterFormGroup = styled.div`
  margin-bottom: 1.2rem;
  width: 100%;
`;

export const FooterLabel = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #5a5c69;
  margin-bottom: 0.5rem;
`;

export const FooterInput = styled.input`
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  color: #5a5c69;
  background-color: #fff;
  border: 1px solid #d1d3e2;
  border-radius: 0.35rem;
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
  color: #e74a3b;
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
    background-color: #fdeaea;
    color: #ff4d4f;
  }
`;

export const FooterAddButton = styled.button`
  border: 1px dashed rgba(59, 122, 87, 0.3);
  color: #5a5c69;
  padding: 1rem;
  width: 100%;
  border-radius: 0.35rem;
  font-weight: 600;
  ${TransitionAll};
  ${FlexCenter}
  gap: 0.5rem;
  background-color: #f8f9fc;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background-color: #fff;
    border-color: #1b4d3e;
    color: #1b4d3e;
  }
`;
