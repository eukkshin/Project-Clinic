import styled from "styled-components";

import { FlexBetween, FlexCenter, TransitionAll } from "../Common.styles";

// -----------------------------------------
// 🎯 게시판 관리 (Board Admin) 전용 스타일
// -----------------------------------------

export const BoardContainer = styled.div`
  width: 100%;
`;

export const BoardPageHeader = styled.div`
  ${FlexBetween}
  margin-bottom: 1.5rem;
`;

export const BoardPageTitle = styled.h1`
  font-size: 1.5rem;
  color: #5a5c69;
  font-weight: 700;
  margin: 0;
`;

export const BoardSaveButton = styled.button`
  background-color: #1b4d3e;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 0.35rem;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0 0.125rem 0.25rem 0 rgba(58, 59, 69, 0.2);
  transition: background-color 0.2s;

  &:hover {
    background-color: #246652;
  }
`;

export const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr; /* 좌측 폼보다 우측 테이블을 좀 더 넓게 */
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const BoardLeftColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BoardRightColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BoardCard = styled.div`
  background-color: #fff;
  border-radius: 0.35rem;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  border: 1px solid #e3e6f0;
  overflow: hidden;
`;

export const BoardCardHeader = styled.div`
  background-color: #f8f9fc;
  border-bottom: 1px solid #e3e6f0;
  padding: 1rem 1.25rem;
`;

export const BoardCardTitle = styled.h6`
  margin: 0;
  font-weight: 700;
  color: #1b4d3e;
`;

export const BoardCardBody = styled.div`
  padding: 1.5rem;
  color: #858796;
`;

export const BoardFormGroup = styled.div`
  margin-bottom: 1.2rem;
`;

export const BoardLabel = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #5a5c69;
  margin-bottom: 0.5rem;
`;

export const BoardInput = styled.input`
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

// 💡 새로 추가된 Select(콤보박스) 스타일
export const BoardSelect = styled.select`
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  color: #5a5c69;
  background-color: #fff;
  border: 1px solid #d1d3e2;
  border-radius: 0.35rem;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;

  &:focus {
    border-color: #1b4d3e;
  }
`;

export const BoardAddButton = styled.button`
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

export const BoardTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 1rem;
`;

export const BoardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  color: #858796;
  font-size: 0.9rem;

  th {
    color: #5a5c69;
    font-weight: 700;
    padding: 0.8rem;
    border-bottom: 1px solid #e3ecf0;
    white-space: nowrap;
    box-shadow: 0 2px 6px -2px rgba(90, 92, 105, 0.12);
  }

  td {
    padding: 1rem 0.5rem;
    border-bottom: 1px solid #eaecf4;
    vertical-align: middle;

    strong {
      color: #5a5c69;
      font-size: 1rem;
    }
  }
`;

// 스킨 타입별로 색상을 다르게 보여주는 배지
export const BoardTypeBadge = styled.span<{ $type: string }>`
  background-color: ${(props) => {
    if (props.$type === "갤러리형") return "#dcece7";
    if (props.$type === "FAQ형") return "#f7ecd6";
    return "#e9eee9"; // 일반게시판
  }};
  color: #355a40;
  padding: 0.25rem 0.6rem;
  border-radius: 0.2rem;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  user-select: none;
`;

export const BoardActionBtn = styled.button`
  background: transparent;
  border: none;
  color: #5a5c69;
  cursor: pointer;
  ${FlexCenter}
  ${TransitionAll};
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 0;

  margin: 0;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background-color: #eaecf4;
    color: #5a5c69;
  }
`;

export const BoardDeleteBtn = styled.button`
  background: transparent;
  border: none;
  color: #e74a3b;
  cursor: pointer;
  ${FlexCenter}
  ${TransitionAll};
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 0;

  margin: 0;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background-color: #fdeaea;
    color: #ff4d4f;
  }
`;
