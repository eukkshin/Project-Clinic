import styled from "styled-components";

import {
  BoxShadow,
  FlexBetween,
  FlexCenter,
  FlexColumn,
  FlexEnd,
  FlexStart,
  TransitionAll,
} from "../Common.styles";

export const ConsultContainer = styled.div`
  width: 100%;
`;

export const ConsultPageHeader = styled.header`
  ${FlexBetween}
  width: 100%;
  margin-bottom: 1.5rem;
`;

export const ConsultPageTitle = styled.h2`
  font-size: 1.5rem;
  color: #5a5c69;
  font-weight: 700;
  margin: 0;
`;

export const ConsultFilterCard = styled.div`
  border-radius: 0.35rem;
  ${BoxShadow};
  border: 1px solid rgba(59, 122, 87, 0.1);
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

export const ConsultInputGroup = styled.div`
  ${FlexEnd}
  width: 100%;
  gap: 0.5rem;

  padding: 1rem;
`;

export const ConsultInput = styled.input`
  width: 300px;
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

export const ConsultSearchButton = styled.button`
  ${FlexCenter};
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 0.35rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  ${BoxShadow};
  ${TransitionAll};
  background-color: #1b4d3e;

  &:hover {
    background-color: #246652;
  }
`;

export const ConsultTableCard = styled.div`
  border-radius: 0.35rem;
  ${BoxShadow};
  border: 1px solid rgba(59, 122, 87, 0.1);
  overflow: hidden;
`;

export const ConsultCardHeader = styled.header`
  background-color: #f8f9fc;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(59, 122, 87, 0.1);
`;

export const ConsultCardTitle = styled.h6`
  margin: 0;
  font-weight: 700;
  color: #1b4d3e;
`;

export const ConsultTableWrapper = styled.div`
  width: 100%;
  ${FlexStart}
`;

const TableRowBase = `
  display: table;
  table-layout: fixed;
  width: 100%;
`;

export const ConsultTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    tr {
      ${TableRowBase}
      th {
        font-size: 0.9rem;
        color: #5a5c69;
        font-weight: 700;
        padding: 12px 8px;
        white-space: nowrap;
        border-bottom: 1px solid #eaecf0;
        text-align: center;
        vertical-align: middle;
        box-shadow: 0 2px 6px -2px rgba(90, 92, 105, 0.12);

        &:nth-child(1) {
          width: 10%;
        }
        &:nth-child(2) {
          width: 10%;
        }
        &:nth-child(3) {
          width: 20%;
        }
        &:nth-child(4) {
          width: 20%;
        }
        &:nth-child(5) {
          width: 20%;
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
        color: #858796;
        padding: 12px 8px;
        white-space: nowrap;
        border-bottom: 1px solid #eaecf0;

        text-align: center;
        vertical-align: middle;

        &:nth-child(1) {
          width: 10%;
        }
        &:nth-child(2) {
          width: 10%;
        }
        &:nth-child(3) {
          width: 20%;
        }
        &:nth-child(4) {
          width: 20%;
        }
        &:nth-child(5) {
          width: 20%;
        }
        &:nth-child(6) {
          width: 10%;
        }
      }
    }
  }
`;

interface ConsultStatusBadgeProps {
  $status: string;
}
export const ConsultStatusBadge = styled.span<ConsultStatusBadgeProps>`
  background-color: ${(props) =>
    props.$status === "대기중" ? "#b78103" : "#1a73e8"};
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

export const ConsultDeleteActionBtn = styled.button`
  background: transparent;
  border: none;
  color: #e74a3b;
  cursor: pointer;
  ${FlexCenter}
  width: 36px;
  height: 36px;

  ${TransitionAll};
  border-radius: 50%;

  margin: 0 auto;

  &:hover {
    background-color: #fdeaea;
    color: #ff4d4f;
  }
`;
