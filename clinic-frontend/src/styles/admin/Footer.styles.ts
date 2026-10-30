import styled from "styled-components";
import {
  adminAddButtonCss,
  adminCardTitleCss,
  adminDeleteBtnCss,
  adminForestPageTitleCss,
  adminBorderedCardHeaderCss,
  adminInputCss,
  adminLabelCss,
  adminPageHeaderCss,
} from "./shared";

import { BoxShadow, FlexCenter, FlexColumn } from "@/styles/mixins";

export const FooterAdminContainer = styled.div`
  width: 100%;
`;

export const FooterPageHeader = styled.div`
  ${adminPageHeaderCss}
`;

export const FooterPageTitle = styled.h1`
  ${adminForestPageTitleCss}
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
  ${adminBorderedCardHeaderCss}
`;

export const FooterCardTitle = styled.h6`
  ${adminCardTitleCss}
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
  ${adminLabelCss}
`;

export const FooterInput = styled.input`
  ${adminInputCss}
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
  ${adminDeleteBtnCss}
`;

export const FooterAddButton = styled.button`
  ${adminAddButtonCss}
`;
