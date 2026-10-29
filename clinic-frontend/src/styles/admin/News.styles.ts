import styled from "styled-components";
import {
  adminAddButtonCss,
  adminCardTitleCss,
  adminFullWidthPageHeaderCss,
  adminForestPageTitleCss,
  adminFileInputWrapperCss,
  adminFileLabelCss,
  adminFormGroupCss,
  adminNewsLeftColumnCss,
  adminRankEventCardCss,
  adminSaveButtonCss,
  adminSetNavCardHeaderCss,
  adminSetNavInputCss,
  adminSetNavLabelCss,
} from "./shared";

import {
  FlexCenter,
  FlexColumn,
  FlexStart,
  TransitionAll,
} from "@/styles/mixins";

export const NewsContainer = styled.div`
  width: 100%;
`;

export const NewsPageHeader = styled.header`
  ${adminFullWidthPageHeaderCss}
`;

export const NewsPageTitle = styled.h2`
  ${adminForestPageTitleCss}
`;

export const NewsSaveButton = styled.button`
  ${adminSaveButtonCss}
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
  ${adminNewsLeftColumnCss}
`;

export const NewsCard = styled.div`
  ${adminRankEventCardCss}
`;

export const NewsCardHeader = styled.header`
  ${adminSetNavCardHeaderCss}
`;

export const NewsCardTitle = styled.h6`
  ${adminCardTitleCss}
`;

export const NewsCardBody = styled.div`
  padding: 1.5rem;
  color: #738079;
`;

export const NewsFormGroup = styled.div`
  ${adminFormGroupCss}
`;

export const NewsLabel = styled.label`
  ${adminSetNavLabelCss}
`;

export const NewsInput = styled.input`
  ${adminSetNavInputCss}
`;

export const NewsFileInputWrapper = styled.div`
  ${adminFileInputWrapperCss}
`;

export const NewsFileInput = styled.input`
  display: none;
`;

export const NewsFileLabel = styled.label`
  ${adminFileLabelCss}
`;

export const NewsPreviewCircle = styled.div``;

export const NewsAddButton = styled.button`
  ${adminAddButtonCss}
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
    background-color: none;
    cursor: default;
  }
`;

export const NewsThumbnail = styled.div`
  ${FlexCenter}
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  color: #34453c;
  background-color: #d6e0d8;
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
  color: #bf6059;
  cursor: pointer;
  ${FlexCenter}
  width: 36px;
  height: 36px;

  ${TransitionAll};
  border-radius: 50%;

  margin: 0 auto;

  &:hover {
    background-color: #fff0ee;
    color: #ff4d4f;
  }
`;
