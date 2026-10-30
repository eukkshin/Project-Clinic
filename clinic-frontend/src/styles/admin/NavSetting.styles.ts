import styled from "styled-components";
import {
  adminCardTitleCss,
  adminFullWidthPageHeaderCss,
  adminForestPageTitleCss,
  adminFileInputWrapperCss,
  adminFileLabelCss,
  adminSaveButtonCss,
  adminSetNavCardHeaderCss,
  adminSetNavInputCss,
  adminSetNavLabelCss,
} from "./shared";

import { BoxShadow, FlexCenter, TransitionAll } from "@/styles/mixins";

export const SetNavContainer = styled.div`
  width: 100%;
`;

export const SetNavPageHeader = styled.header`
  ${adminFullWidthPageHeaderCss}
`;

export const SetNavPageTitle = styled.h2`
  ${adminForestPageTitleCss}
`;

export const SetNavSaveButton = styled.button`
  ${adminSaveButtonCss}
`;

export const SetNavContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 2fr);
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const SetNavCard = styled.div`
  border-radius: 12px;
  ${BoxShadow};
  border: 1px solid rgba(59, 122, 87, 0.1);
  overflow: hidden;
  max-height: fit-content;
  background-color: #fff;
`;

export const SetNavCardHeader = styled.div`
  ${adminSetNavCardHeaderCss}
`;

export const SetNavCardTitle = styled.h6`
  ${adminCardTitleCss}
`;

export const SetNavCardBody = styled.div`
  padding: 1.5rem;
  color: #738079;

  p {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }
`;

export const SetNavRadioGroup = styled.div`
  display: flex;

  border-radius: 0.5rem;
  padding: 0.3rem;

  margin-bottom: 1.5rem;
  gap: 0.5rem;
`;

interface SetNavRadioLabelProps {
  $isActive: boolean;
}
export const SetNavRadioLabel = styled.div<SetNavRadioLabelProps>`
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 12px;
  ${FlexCenter}
  gap: 0.5rem;
  flex-direction: column;
  transition:
    background-color 0.3s ease-in-out,
    color 0.2s ease-in-out;

  border: ${(props) =>
    props.$isActive ? "1px solid #1b4d3e" : "1px solid rgba(59, 122, 87, 0.3)"};
  background-color: ${(props) => (props.$isActive ? "#fff" : "transparent")};
  color: ${(props) => (props.$isActive ? "#1b4d3e" : "rgba(59, 122, 87, 0.3)")};

  font-weight: 600;
  cursor: pointer;
`;

export const SetNavLabel = styled.label`
  ${adminSetNavLabelCss}
`;

export const SetNavInput = styled.input`
  ${adminSetNavInputCss}
`;

export const SetNavFileInputWrapper = styled.div`
  ${adminFileInputWrapperCss}
`;

export const SetNavFileInput = styled.input`
  display: none;
`;

export const SetNavFileLabel = styled.label`
  ${adminFileLabelCss}
`;

export const SetNavMenuList = styled.div`
  ${FlexCenter};
  gap: 1rem;
  flex-wrap: wrap;
  background-color: #f7f9f7;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e4eae5;

  .menu-number {
    font-weight: 900;
    color: #1b4d3e;
    width: 20px;
  }
`;

export const SetNavMenuItem = styled.div`
  ${FlexCenter}
  gap: 1rem;
  background-color: #f7f9f7;
  border-radius: 12px;
  border: 1px solid #e4eae5;
  padding: 1rem;
  box-sizing: border-box;
  ${BoxShadow}
`;

export const SetNavDeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #bf6059;
  cursor: pointer;
  ${FlexCenter}
  padding: 0.5rem;
  ${TransitionAll};
  border-radius: 50%;
  white-space: nowrap;
  overflow: hidden;
  flex-shrink: 0;

  &:hover {
    background-color: #fff0ee;
    color: #ff4d4f;
  }
`;

export const NavAddButton = styled.button`
  border: 1px dashed rgba(59, 122, 87, 0.3);
  color: #34453c;
  padding: 1rem;
  margin-top: 1rem;
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
