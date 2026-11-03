import styled from "styled-components";
import {
  adminCardTitleCss,
  adminFullWidthPageHeaderCss,
  adminForestPageTitleCss,
  adminGridCss,
  adminRankEventCardCss,
  adminSaveButtonCss,
  adminSetNavCardHeaderCss,
} from "./shared";

import { FlexCenter } from "@/styles/mixins";

export const ToneContainer = styled.div`
  width: 100%;
  ${FlexCenter};
  flex-direction: column;
`;

export const TonePageHeader = styled.div`
  ${adminFullWidthPageHeaderCss}
`;

export const TonePageTitle = styled.h2`
  ${adminForestPageTitleCss}
`;

export const ToneSaveButton = styled.button`
  ${adminSaveButtonCss}
`;

export const ToneCardGrid = styled.div`
  ${adminGridCss}
`;

export const ToneSettingsCard = styled.div`
  ${adminRankEventCardCss}
`;

export const ToneCardHeader = styled.div`
  ${adminSetNavCardHeaderCss}
`;

export const ToneCardTitle = styled.h6`
  ${adminCardTitleCss}
`;

export const ToneCardBody = styled.div`
  padding: 1.5rem;
  color: #738079;

  p {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }
`;

export const ToneColorOptionWrapper = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

interface ToneColorBoxProps {
  $color: string;
  $isActive: boolean;
}
export const ToneColorBox = styled.div<ToneColorBoxProps>`
  ${FlexCenter}
  width: 5rem;
  height: 5rem;
  background-color: ${(props) => props.$color};
  border-radius: 0.5rem;
  cursor: pointer;
  transition:
    box-shadow 0.3s ease-in-out,
    border 0.15s ease-in-out;
  box-shadow: ${(props) =>
    props.$isActive
      ? "0 0 0 0.1rem rgba(0, 0, 0, 0.5)"
      : "0 3px 18px rgba(21, 54, 37, 0.055)"};

  border: ${(props) =>
    props.$isActive ? "5px solid #fff" : "1px solid rgba(59, 122, 87, 0.1)"};

  ${(props) =>
    !props.$isActive &&
    `
    &:hover {
      transform: scale(0.98);
    }
  `}
`;

export const ToneToggleWrapper = styled.div`
  display: flex;
  background-color: #e8eeea;
  border-radius: 0.5rem;
  padding: 0.3rem;
  width: fit-content;
  margin-bottom: 1.5rem;
`;

interface ToneModeButtonProps {
  $isActive: boolean;
  $isDark?: boolean;
}
export const ToneModeButton = styled.button<ToneModeButtonProps>`
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-direction: column;
  transition:
    background-color 0.3s ease-in-out,
    color 0.3s ease-in-out;
  background-color: ${(props) =>
    props.$isActive ? (props.$isDark ? "#202020" : "#fff") : "transparent"};
  color: ${(props) =>
    props.$isActive ? (props.$isDark ? "#fff" : "#202020") : "#738079"};

  font-weight: 600;
  cursor: pointer;
`;

export const ToneSelectedText = styled.div`
  font-size: 0.9rem;
  border-top: 1px solid #e8eeea;
  padding-top: 1rem;
  strong {
    color: #34453c;
  }
`;
