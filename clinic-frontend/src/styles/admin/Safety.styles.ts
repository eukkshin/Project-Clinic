import styled from "styled-components";

import { FlexBetween, FlexCenter, TransitionAll } from "../Common.styles";

// -----------------------------------------
// 🎯 안전시스템 관리 (AdminSafety) 전용 스타일
// -----------------------------------------

export const AdminSafetyContainer = styled.div`
  width: 100%;
`;

export const AdminSafetyPageHeader = styled.div`
  ${FlexBetween}
  margin-bottom: 1.5rem;
`;

export const AdminSafetyPageTitle = styled.h1`
  font-size: 1.5rem;
  color: #34453c;
  font-weight: 700;
  margin: 0;
`;

export const AdminSafetySaveButton = styled.button`
  background-color: #1b4d3e;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 12px;
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

export const AdminSafetyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const AdminSafetyLeftColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AdminSafetyRightColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AdminSafetyCard = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 18px rgba(21, 54, 37, 0.055);
  border: 1px solid #e4eae5;
  overflow: hidden;
`;

export const AdminSafetyCardHeader = styled.div`
  background-color: #f7f9f7;
  border-bottom: 1px solid #e4eae5;
  padding: 1rem 1.25rem;
`;

export const AdminSafetyCardTitle = styled.h6`
  margin: 0;
  font-weight: 700;
  color: #1b4d3e;
`;

export const AdminSafetyCardBody = styled.div`
  padding: 1.5rem;
  color: #738079;
`;

export const AdminSafetyFormGroup = styled.div`
  margin-bottom: 1.2rem;
`;

export const AdminSafetyLabel = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #34453c;
  margin-bottom: 0.5rem;
`;

export const AdminSafetyInput = styled.input`
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  color: #34453c;
  background-color: #fff;
  border: 1px solid #d6e0d8;
  border-radius: 12px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #1b4d3e;
  }
`;

// 💡 상세 설명을 위한 Textarea 컴포넌트 추가
export const AdminSafetyTextarea = styled.textarea`
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  color: #34453c;
  background-color: #fff;
  border: 1px solid #d6e0d8;
  border-radius: 12px;
  outline: none;
  box-sizing: border-box;
  resize: vertical;
  min-height: 80px;

  &:focus {
    border-color: #1b4d3e;
  }
`;

export const AdminSafetyFileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .file-name {
    font-size: 0.85rem;
    color: #738079;
    word-break: break-all;
  }
`;

export const AdminSafetyFileInput = styled.input`
  display: none;
`;

export const AdminSafetyFileLabel = styled.label`
  background-color: #fff;
  border: 1px solid #d6e0d8;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #34453c;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;

  &:hover {
    background-color: #e8eeea;
  }
`;

export const AdminSafetyPreviewRect = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid #e4eae5;
  margin-top: 1rem;
  background-color: #f7f9f7;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AdminSafetyAddButton = styled.button`
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

export const AdminSafetyTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 1rem;
`;

export const AdminSafetyTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  color: #738079;
  font-size: 0.9rem;

  th {
    color: #34453c;
    font-weight: 700;
    padding: 0.8rem;
    border-bottom: 1px solid #eaecf0;
    white-space: nowrap;
    box-shadow: 0 2px 10px rgba(21, 54, 37, 0.055);
  }

  td {
    padding: 1rem 0.5rem;
    border-bottom: 1px solid #e8eeea;
    vertical-align: middle;
  }
`;

export const AdminSafetyThumbnail = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background-color: #e8eeea;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: #97a69d;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AdminSafetyRankBadge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background-color: #e6eee9;
  color: #3d9974;
  ${FlexCenter}
  font-size: 0.85rem;
  font-weight: 800;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
`;

export const AdminSafetyActionBtn = styled.button`
  background: transparent;
  border: none;
  color: #1b4d3e;
  cursor: pointer;
  ${FlexCenter}
  padding: 0;
  ${TransitionAll}
  border-radius: 50%;
  width: 36px;
  height: 36px;

  margin: 0 auto;

  &:hover:not(:disabled) {
    background-color: #e1ede8;
  }

  &:disabled {
    color: rgba(59, 122, 87, 0.3);
    background-color: none;
    cursor: default;
  }
`;

export const AdminSafetyDeleteBtn = styled.button`
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
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background-color: #fff0ee;
    color: #ff4d4f;
  }
`;
