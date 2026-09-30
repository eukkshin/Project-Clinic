import styled from "styled-components";

import {
  BoxShadow,
  FlexBetween,
  FlexCenter,
  TransitionAll,
} from "../Common.styles";

export const ToneContainer = styled.div`
  width: 100%;
  ${FlexCenter};
  flex-direction: column;
`;

export const TonePageHeader = styled.div`
  ${FlexBetween}
  width: 100%;
  margin-bottom: 1.5rem;
`;

export const TonePageTitle = styled.h2`
  font-size: 1.5rem;
  color: #5a5c69;
  font-weight: 700;
  margin: 0;
`;

export const ToneSaveButton = styled.button`
  ${FlexCenter};
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 0.35rem;
  font-size: 0.9rem;
  font-weight: 600;
  gap: 0.5rem;
  cursor: pointer;
  ${BoxShadow};
  ${TransitionAll};
  background-color: #1b4d3e;

  &:hover {
    background-color: #246652;
  }
`;

export const ToneCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const ToneSettingsCard = styled.div`
  border-radius: 0.35rem;
  ${BoxShadow};
  border: 1px solid rgba(59, 122, 87, 0.1);
  overflow: hidden;
  background-color: #fff;
`;

export const ToneCardHeader = styled.div`
  background-color: #f8f9fc;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(59, 122, 87, 0.1);
`;

export const ToneCardTitle = styled.h6`
  margin: 0;
  font-weight: 700;
  color: #1b4d3e;
`;

export const ToneCardBody = styled.div`
  padding: 1.5rem;
  color: #858796;

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
      : "0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)"};

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
  background-color: #eaecf4;
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
  border-radius: 0.35rem;
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
    props.$isActive ? (props.$isDark ? "#fff" : "#202020") : "#858796"};

  font-weight: 600;
  cursor: pointer;
`;

export const ToneSelectedText = styled.div`
  font-size: 0.9rem;
  border-top: 1px solid #eaecf4;
  padding-top: 1rem;
  strong {
    color: #5a5c69;
  }
`;
