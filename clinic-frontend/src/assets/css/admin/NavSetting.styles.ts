import styled, { keyframes, Keyframes } from "styled-components";

import {
  BoxShadow,
  FlexBetween,
  FlexCenter,
  FlexStart,
  TransitionAll,
} from "../Common.styles";

export const SetNavContainer = styled.div`
  width: 100%;
`;

export const SetNavPageHeader = styled.header`
  ${FlexBetween}
  width: 100%;
  margin-bottom: 1.5rem;
`;

export const SetNavPageTitle = styled.h2`
  font-size: 1.5rem;
  color: #5a5c69;
  font-weight: 700;
  margin: 0;
`;

export const SetNavSaveButton = styled.button`
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
  border-radius: 0.35rem;
  ${BoxShadow};
  border: 1px solid rgba(59, 122, 87, 0.1);
  overflow: hidden;
  max-height: fit-content;
`;

export const SetNavCardHeader = styled.div`
  background-color: #f8f9fc;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(59, 122, 87, 0.1);
`;

export const SetNavCardTitle = styled.h6`
  margin: 0;
  font-weight: 700;
  color: #1b4d3e;
`;

export const SetNavCardBody = styled.div`
  padding: 1.5rem;
  color: #858796;

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
  border-radius: 0.35rem;
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

export const SetNavInputWrapper = styled.div`
  ${FlexCenter};
  gap: 1rem;
  background-color: #f8f9fc;
  padding: 1.5rem;
  border-radius: 0.35rem;
  border: 1px solid #e3e6f0;
`;

export const SetNavLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #5a5c69;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const SetNavInput = styled.input`
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  background-color: #fff;
  border: 1px solid rgba(59, 122, 87, 0.3);
  border-radius: 0.35rem;
  outline: none;
  ${TransitionAll}

  &:focus {
    border-color: #1b4d3e;
  }
`;

export const SetNavFileInputWrapper = styled.div`
  gap: 1rem;
  ${FlexStart}

  .file-name {
    font-size: 0.9rem;
    color: #858796;
    border-bottom: 1px solid #d1d3e2;
    padding-bottom: 0.5rem;
  }
`;

export const SetNavFileInput = styled.input`
  display: none;
`;

export const SetNavFileLabel = styled.label`
  background-color: #fff;
  border: 1px solid #d1d3e2;
  padding: 0.5rem 1rem;
  border-radius: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #5a5c69;
  cursor: pointer;
  ${TransitionAll};

  &:hover {
    background-color: #f8f9fc;
  }
`;

export const SetNavMenuList = styled.div`
  ${FlexCenter};
  gap: 1rem;
  flex-wrap: wrap;
  background-color: #f8f9fc;
  padding: 1rem;
  border-radius: 0.35rem;
  border: 1px solid #e3e6f0;

  .menu-number {
    font-weight: 900;
    color: #1b4d3e;
    width: 20px;
  }
`;

export const SetNavMenuItem = styled.div`
  ${FlexCenter}
  gap: 1rem;
  background-color: #f8f9fc;
  border-radius: 0.35rem;
  border: 1px solid #e3e6f0;
  padding: 1rem;
  box-sizing: border-box;
  ${BoxShadow}
`;

export const SetNavDeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #e74a3b;
  cursor: pointer;
  ${FlexCenter}
  padding: 0.5rem;
  ${TransitionAll};
  border-radius: 50%;

  &:hover {
    background-color: #fdeaea;
    color: #ff4d4f;
  }
`;

export const NavAddButton = styled.button`
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
