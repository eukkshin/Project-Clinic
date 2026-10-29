import styled from "styled-components";

import {
  BoxShadow,
  FlexBetween,
  FlexCenter,
  TransitionAll,
} from "../Common.styles";

// VLOG 관리자와 동일한 패널 / 타이포그래피 / 폼 / 테이블 디자인입니다.
// 기존 QnA CRUD, 카테고리, 순서 변경을 위해 필요한 컴포넌트는 별도로 유지합니다.

export const AdminQnAContainer = styled.div`
  width: 100%;
  min-width: 0;
`;

export const AdminQnAPageHeader = styled.div`
  ${FlexBetween}
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const AdminQnAPageTitle = styled.h1`
  margin: 0;
  color: #34453c;
  font-size: 1.5rem;
  font-weight: 700;
`;

export const AdminQnASaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 12px;
  background-color: #1b4d3e;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: 0 0.125rem 0.25rem rgba(58, 59, 69, 0.2);
  transition: background-color 0.2s;

  &:hover { background-color: #246652; }
  &:focus-visible { outline: 2px solid #69826b; outline-offset: 3px; }
`;

export const AdminQnAGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
  gap: 1.5rem;

  @media (max-width: 1200px) { grid-template-columns: minmax(0, 1fr); }
`;

export const AdminQnALeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const AdminQnARightColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const AdminQnACard = styled.div`
  width: 100%;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  border: 1px solid #e4eae5;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 3px 18px rgba(21, 54, 37, 0.055);
`;

export const AdminQnACardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  min-height: 54px;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e4eae5;
  background-color: #f7f9f7;

  @media (max-width: 600px) { flex-wrap: wrap; }
`;

export const AdminQnACardTitle = styled.h6`
  margin: 0;
  color: #1b4d3e;
  font-size: 0.95rem;
  font-weight: 700;
`;

export const AdminQnACardBody = styled.div`
  padding: 1.5rem;
  color: #738079;
`;

export const AdminQnAFormGroup = styled.div`
  margin-bottom: 1.2rem;
`;

export const AdminQnALabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #34453c;
  font-size: 0.85rem;
  font-weight: 700;
`;

const fieldStyle = `
  width: 100%;
  padding: 0.6rem 1rem;
  border: 1px solid #d6e0d8;
  border-radius: 12px;
  outline: none;
  box-sizing: border-box;
  background-color: #fff;
  color: #34453c;
  font: inherit;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #1b4d3e;
    box-shadow: 0 0 0 3px rgba(27, 77, 62, 0.08);
  }

  &::placeholder { color: #98a79d; }
`;

export const AdminQnAInput = styled.input`
  ${fieldStyle}
`;

export const AdminQnASelect = styled.select`
  ${fieldStyle}
  cursor: pointer;
`;

export const AdminQnATextarea = styled.textarea`
  ${fieldStyle}
  min-height: 135px;
  resize: vertical;
  line-height: 1.65;
`;

export const AdminQnACustomCategoryWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const AdminQnACategoryAddButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.45rem 0.8rem;
  border: 1px solid rgba(59, 122, 87, 0.3);
  border-radius: 10px;
  background: #fff;
  color: #34453c;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  ${TransitionAll}

  &:hover { background: #e8eeea; border-color: #1b4d3e; }
`;

export const AdminQnAButtonWrapper = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.7rem;
  flex-wrap: wrap;

  > button { flex: 1 1 140px; }
`;

export const AdminQnAAddButton = styled.button`
  ${FlexCenter}
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  border: 1px dashed rgba(59, 122, 87, 0.3);
  border-radius: 12px;
  background-color: #f7f9f7;
  color: #34453c;
  font-weight: 600;
  cursor: pointer;
  ${TransitionAll}

  &:hover { background-color: #fff; border-color: #1b4d3e; color: #1b4d3e; }
`;

export const AdminQnACancelButton = styled.button`
  ${FlexCenter}
  gap: 0.35rem;
  padding: 0.6rem 0.9rem;
  border: 1px solid #d6e0d8;
  border-radius: 12px;
  background: #fff;
  color: #738079;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  ${TransitionAll}

  &:hover { background: #e8eeea; color: #34453c; }
`;

export const AdminQnATableHeaderSelect = styled.select`
  width: min(170px, 100%);
  max-width: 100%;
  padding: 0.4rem 0.65rem;
  border: 1px solid #d6e0d8;
  border-radius: 10px;
  background: #fff;
  color: #34453c;
  font-size: 0.82rem;
  outline: none;
  cursor: pointer;
  &:focus { border-color: #1b4d3e; }
`;

export const AdminQnATableWrapper = styled.div`
  width: 100%;
  max-height: 660px;
  padding: 1rem;
  overflow: auto;
`;

export const AdminQnATable = styled.table`
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  color: #738079;
  text-align: center;
  font-size: 0.9rem;

  th {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 0.8rem;
    border-bottom: 1px solid #eaecf0;
    background: #fff;
    color: #34453c;
    font-weight: 700;
    white-space: nowrap;
    box-shadow: 0 2px 10px rgba(21, 54, 37, 0.055);
  }

  td {
    padding: 1rem 0.5rem;
    border-bottom: 1px solid #e8eeea;
    vertical-align: middle;
  }
`;

export const AdminQnARankRow = styled.div`
  ${FlexCenter}
  gap: 0.8rem;
`;

export const AdminQnARankControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
`;

export const AdminQnARankBadge = styled.div`
  ${FlexCenter}
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  border-radius: 50%;
  background-color: #eaf2f4;
  color: #6b9b96;
  font-size: 0.85rem;
  font-weight: 800;
  ${BoxShadow}
`;

export const AdminQnAActionGroup = styled.div`
  ${FlexCenter}
  gap: 0.4rem;
`;

export const AdminQnAActionBtn = styled.button`
  ${FlexCenter}
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #1b4d3e;
  cursor: pointer;
  ${TransitionAll}

  &:hover:not(:disabled) { background-color: #e1ede8; }
  &:disabled { background-color: #f7f9f7; color: rgba(59, 122, 87, 0.3); cursor: default; }
`;

export const AdminQnAEditBtn = styled(AdminQnAActionBtn)`
  color: #1b4d3e;
`;

export const AdminQnADeleteBtn = styled.button`
  ${FlexCenter}
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #bf6059;
  cursor: pointer;
  ${TransitionAll}

  &:hover { background-color: #fff0ee; color: #ff4d4f; }
`;

export const AdminQnACategoryBadge = styled.span`
  display: inline-block;
  max-width: 100%;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background: #e8eeea;
  color: #1b4d3e;
  font-size: 0.78rem;
  font-weight: 650;
  overflow-wrap: anywhere;
`;

export const AdminQnACellQuestion = styled.strong`
  display: block;
  margin-bottom: 0.35rem;
  color: #34453c;
  overflow-wrap: anywhere;
`;

export const AdminQnACellSummary = styled.div`
  display: -webkit-box;
  overflow: hidden;
  color: #738079;
  font-size: 0.8rem;
  line-height: 1.55;
  overflow-wrap: anywhere;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;
