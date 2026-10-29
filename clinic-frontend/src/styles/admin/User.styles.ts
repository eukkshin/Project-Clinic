import styled from "styled-components";

import { FlexBetween, FlexCenter, TransitionAll } from "../Common.styles";

// -----------------------------------------
// 🎯 회원 관리 (Users) 전용 스타일
// -----------------------------------------

export const UserContainer = styled.div`
  width: 100%;
`;

export const UserPageHeader = styled.div`
  ${FlexBetween}
  margin-bottom: 1.5rem;
`;

export const UserPageTitle = styled.h1`
  font-size: 1.5rem;
  color: #5a5c69;
  font-weight: 700;
  margin: 0;
`;

export const UserFilterCard = styled.div`
  background-color: #fff;
  border-radius: 0.35rem;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  border: 1px solid #e3e6f0;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: flex-end;
`;

export const UserInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const UserInput = styled.input`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: #5a5c69;
  border: 1px solid #d1d3e2;
  border-radius: 0.35rem;
  outline: none;
  width: 280px;

  &:focus {
    border-color: #1b4d3e;
  }
`;

export const UserSearchButton = styled.button`
  background-color: #1b4d3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.35rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #246652;
  }
`;

export const UserTableCard = styled.div`
  background-color: #fff;
  border-radius: 0.35rem;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  border: 1px solid #e3e6f0;
  overflow: hidden;
`;

export const UserCardHeader = styled.div`
  background-color: #f8f9fc;
  border-bottom: 1px solid #e3e6f0;
  padding: 1rem 1.25rem;
`;

export const UserCardTitle = styled.h6`
  margin: 0;
  font-weight: 700;
  color: #1b4d3e;
`;

export const UserTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  color: #858796;
  font-size: 0.95rem;

  th {
    background-color: #f8f9fc;
    color: #5a5c69;
    font-weight: 700;
    padding: 1rem;
    border-bottom: 1px solid #e3ecf0;
    white-space: nowrap;
    box-shadow: 0 2px 6px -2px rgba(90, 92, 105, 0.12);
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #e3e6f0;
    vertical-align: middle;

    strong {
      color: #5a5c69;
    }
  }

  tbody tr:hover {
    background-color: #f8f9fc;
  }
`;

// 상태 표시 배지 (정상: 초록색, 정지: 빨간색)
export const UserStatusBadge = styled.span<{ $status: string }>`
  background-color: ${(props) =>
    props.$status === "정상" ? "#e2f1e5" : "#fcebe8"};
  color: #2d6040;
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

export const UserDeleteActionBtn = styled.button`
  background: transparent;
  border: none;
  color: #fcebe8;
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
