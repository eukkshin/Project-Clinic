import styled from "styled-components";
import {
  adminAddButtonCss,
  adminCardTitleCss,
  adminDeleteBtnCss,
  adminForestPageTitleCss,
  adminBorderedCardHeaderCss,
  adminInputCss,
  adminLabelCss,
  adminColumnCss,
  adminPageHeaderCss,
  adminTableWrapperCss,
} from "./shared";

import { BoxShadow, FlexCenter, TransitionAll } from "@/styles/mixins";

// -----------------------------------------
// 🎯 AdminVlog 관리 전용 스타일
// -----------------------------------------

export const AdminVlogContainer = styled.div`
  width: 100%;
`;

export const AdminVlogPageHeader = styled.div`
  ${adminPageHeaderCss}
`;

export const AdminVlogPageTitle = styled.h1`
  ${adminForestPageTitleCss}
`;

export const AdminVlogSaveButton = styled.button`
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

export const AdminVlogGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const AdminVlogLeftColumn = styled.div`
  ${adminColumnCss}
`;

export const AdminVlogRightColumn = styled.div`
  ${adminColumnCss}
`;

export const AdminVlogCard = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 18px rgba(21, 54, 37, 0.055);
  border: 1px solid #e4eae5;
  overflow: hidden;
`;

export const AdminVlogCardHeader = styled.div`
  ${adminBorderedCardHeaderCss}
`;

export const AdminVlogCardTitle = styled.h6`
  ${adminCardTitleCss}
`;

export const AdminVlogCardBody = styled.div`
  padding: 1.5rem;
  color: #738079;
`;

export const AdminVlogFormGroup = styled.div`
  margin-bottom: 1.2rem;
`;

export const AdminVlogLabel = styled.label`
  ${adminLabelCss}
`;

export const AdminVlogInput = styled.input`
  ${adminInputCss}
`;

export const AdminVlogFileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .file-name {
    font-size: 0.85rem;
    color: #738079;
    word-break: break-all;
  }
`;

export const AdminVlogFileInput = styled.input`
  display: none;
`;

export const AdminVlogFileLabel = styled.label`
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

// 💡 유튜브 영상처럼 가로가 긴 16:9 비율의 미리보기 영역
export const AdminVlogPreviewRect = styled.div`
  width: 160px;
  height: 90px;
  border-radius: 0.25rem;
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

export const AdminVlogAddButton = styled.button`
  ${adminAddButtonCss}
`;

export const AdminVlogTableWrapper = styled.div`
  ${adminTableWrapperCss}
`;

export const AdminVlogTable = styled.table`
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

// 💡 리스트 내부의 16:9 썸네일
export const AdminVlogThumbnail = styled.div`
  width: 100px;
  height: 56px;
  border-radius: 0.25rem;
  background-color: #e8eeea;
  margin: 0 auto;
  overflow: hidden;
  ${FlexCenter}
  font-size: 0.7rem;
  color: #97a69d;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AdminVlogRankBadge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background-color: #eaf2f4;
  color: #6b9b96;
  ${FlexCenter}
  font-size: 0.85rem;
  font-weight: 800;

  ${BoxShadow}
`;

export const AdminVlogActionBtn = styled.button`
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
    background-color: #f7f9f7;
    cursor: default;
  }
`;

export const AdminVlogDeleteBtn = styled.button`
  ${adminDeleteBtnCss}
`;
