import styled from "styled-components";

import {
  BoxShadow,
  FlexBetween,
  FlexCenter,
  FlexColumn,
  FlexStart,
  TransitionAll,
} from "../Common.styles";

export const PopContainer = styled.div`
  width: 100%;
`;

export const PopPageHeader = styled.header`
  ${FlexBetween}
  width: 100%;
  margin-bottom: 1.5rem;
`;

export const PopPageTitle = styled.h2`
  font-size: 1.5rem;
  color: #34453c;
  font-weight: 700;
  margin: 0;
`;

export const PopSaveButton = styled.button`
  ${FlexCenter};
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 12px;
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

export const PopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const PopLeftColumn = styled.div`
  ${FlexColumn}
  gap: 1.5rem;
  width: 100%;
`;

export const PopCard = styled.div`
  border-radius: 12px;
  ${BoxShadow};
  border: 1px solid rgba(59, 122, 87, 0.1);
  overflow: hidden;
  background-color: #fff;
`;

export const PopCardHeader = styled.header`
  background-color: #f7f9f7;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(59, 122, 87, 0.1);
`;

export const PopCardTitle = styled.h6`
  margin: 0;
  font-weight: 700;
  color: #1b4d3e;
`;

export const PopCardBody = styled.div`
  padding: 1.5rem;
  color: #738079;
`;

export const PopFormGroup = styled.div`
  ${FlexColumn}
  width: 100%;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const PopLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #34453c;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const PopInput = styled.input`
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  background-color: #fff;
  border: 1px solid rgba(59, 122, 87, 0.3);
  border-radius: 12px;
  outline: none;
  ${TransitionAll}

  &:focus {
    border-color: #1b4d3e;
  }
`;

export const PopFileInputWrapper = styled.div`
  gap: 1rem;
  ${FlexStart}

  .file-name {
    font-size: 0.9rem;
    color: #738079;
    border-bottom: 1px solid #d6e0d8;
    padding-bottom: 0.5rem;
  }
`;

export const PopFileInput = styled.input`
  display: none;
`;

export const PopFileLabel = styled.label`
  background-color: #fff;
  border: 1px solid #d6e0d8;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #34453c;
  cursor: pointer;
  ${TransitionAll};

  &:hover {
    background-color: #f7f9f7;
  }
`;

export const PopCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #34453c;
  accent-color: #1b4d3e;
  margin-bottom: 1.5rem;
`;

export const PopAddButton = styled.button`
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

export const PopRightColumn = styled.div`
  ${FlexColumn}
  width: 100%;
`;

export const PopTableWrapper = styled.div`
  width: 100%;
  ${FlexStart}
  padding: 1.5rem;
`;

const TableRowBase = `
  display: table;
  table-layout: fixed;
  width: 100%;
`;

export const PopTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    tr {
      ${TableRowBase}
      th {
        font-size: 0.9rem;
        color: #34453c;
        font-weight: 700;
        padding: 12px 8px;
        white-space: nowrap;
        border-bottom: 1px solid #eaecf0;
        text-align: center;
        vertical-align: middle;
        box-shadow: 0 2px 10px rgba(21, 54, 37, 0.055);

        &:nth-child(1) {
          width: 20%;
        }
        &:nth-child(2) {
          width: 20%;
        }
        &:nth-child(3) {
          width: 20%;
        }
        &:nth-child(4) {
          width: 10%;
        }
        &:nth-child(5) {
          width: 10%;
        }
        &:nth-child(6) {
          width: 10%;
        }
      }
    }
  }

  tbody {
    display: block;
    max-height: 400px;
    overflow-y: auto;
    width: 100%;

    &::-webkit-scrollbar {
      width: 0px;
    }

    tr {
      ${TableRowBase}

      td {
        font-size: 0.9rem;
        color: #738079;
        padding: 12px 8px;
        white-space: nowrap;
        border-bottom: 1px solid #eaecf0;

        text-align: center;
        vertical-align: middle;

        &:nth-child(1) {
          width: 20%;
        }
        &:nth-child(2) {
          width: 20%;
        }
        &:nth-child(3) {
          width: 20%;
        }
        &:nth-child(4) {
          width: 10%;
        }
        &:nth-child(5) {
          width: 10%;
        }
        &:nth-child(6) {
          width: 10%;
        }
      }
    }
  }
`;

interface PopBadghProps {
  $color: string;
}
export const PopBadge = styled.span<PopBadghProps>`
  background-color: ${(props) => props.$color};
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  cursor: pointer;
  transition: opacity 0.2s;
  user-select: none;

  &:hover {
    opacity: 0.8;
  }
`;

export const PopDeleteBtn = styled.button`
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

  &:hover {
    background-color: #fff0ee;
    color: #ff4d4f;
  }
`;
