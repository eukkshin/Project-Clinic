import styled from "styled-components";

import {
  BoxShadow,
  FlexBetween,
  FlexCenter,
  FlexColumn,
  FlexStart,
  TransitionAll,
} from "../Common.styles";

export const NewsContainer = styled.div`
  width: 100%;
`;

export const NewsPageHeader = styled.header`
  ${FlexBetween}
  width: 100%;
  margin-bottom: 1.5rem;
`;

export const NewsPageTitle = styled.h2`
  font-size: 1.5rem;
  color: #5a5c69;
  font-weight: 700;
  margin: 0;
`;

export const NewsSaveButton = styled.button`
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

export const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.8fr;
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const NewsLeftColumn = styled.div`
  ${FlexColumn}
  gap: 1.5rem;
  width: 100%;
`;

export const NewsCard = styled.div`
  border-radius: 0.35rem;
  ${BoxShadow};
  border: 1px solid rgba(59, 122, 87, 0.1);
  overflow: hidden;
`;

export const NewsCardHeader = styled.header`
  background-color: #f8f9fc;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(59, 122, 87, 0.1);
`;

export const NewsCardTitle = styled.h6`
  margin: 0;
  font-weight: 700;
  color: #1b4d3e;
`;

export const NewsCardBody = styled.div`
  padding: 1.5rem;
  color: #858796;
`;

export const NewsFormGroup = styled.div`
  ${FlexColumn}
  width: 100%;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const NewsLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #5a5c69;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const NewsInput = styled.input`
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

export const NewsFileInputWrapper = styled.div`
  gap: 1rem;
  ${FlexStart}

  .file-name {
    font-size: 0.9rem;
    color: #858796;
    border-bottom: 1px solid #d1d3e2;
    padding-bottom: 0.5rem;
  }
`;

export const NewsFileInput = styled.input`
  display: none;
`;

export const NewsFileLabel = styled.label`
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

export const NewsPreviewCircle = styled.div``;

export const NewsAddButton = styled.button`
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

export const NewsRightColumn = styled.div`
  ${FlexColumn}
  width: 100%;
`;

export const NewsTableWrapper = styled.div`
  width: 100%;
  ${FlexStart}
  padding: 1.5rem;
`;

const TableRowBase = `
  display: table;
  table-layout: fixed;
  width: 100%;
`;

export const NewsTable = styled.table`
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
          width: 20%;
        }
        &:nth-child(2) {
          width: 20%;
        }
        &:nth-child(3) {
          width: 40%;
        }
        &:nth-child(4) {
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
          width: 20%;
        }
        &:nth-child(2) {
          width: 20%;
        }
        &:nth-child(3) {
          width: 40%;
        }
        &:nth-child(4) {
          width: 10%;
        }
      }
    }
  }
`;

export const NewsActionBtn = styled.button`
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

  margin: 0;
  padding: 0;

  &:hover:not(:disabled) {
    background-color: #e1ede8;
  }

  &:disabled {
    color: rgba(59, 122, 87, 0.3);
    background-color: #f8f9fc;
    cursor: default;
  }
`;

export const NewsThumbnail = styled.div`
  ${FlexCenter}
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  color: #5a5c69;
  background-color: #d1d3e2;
  font-size: 0.85rem;
  margin: 0 auto;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const NewsDeleteBtn = styled.button`
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
