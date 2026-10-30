import styled from "styled-components";
import {
  adminAddButtonCss,
  adminCardTitleCss,
  adminFullWidthPageHeaderCss,
  adminForestPageTitleCss,
  adminFileInputWrapperCss,
  adminFileLabelCss,
  adminFormGroupCss,
  adminGridCss,
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

export const PopContainer = styled.div`
  width: 100%;
`;

export const PopPageHeader = styled.header`
  ${adminFullWidthPageHeaderCss}
`;

export const PopPageTitle = styled.h2`
  ${adminForestPageTitleCss}
`;

export const PopSaveButton = styled.button`
  ${adminSaveButtonCss}
`;

export const PopGrid = styled.div`
  ${adminGridCss}
`;

export const PopLeftColumn = styled.div`
  ${adminNewsLeftColumnCss}
`;

export const PopCard = styled.div`
  ${adminRankEventCardCss}
`;

export const PopCardHeader = styled.header`
  ${adminSetNavCardHeaderCss}
`;

export const PopCardTitle = styled.h6`
  ${adminCardTitleCss}
`;

export const PopCardBody = styled.div`
  padding: 1.5rem;
  color: #738079;
`;

export const PopFormGroup = styled.div`
  ${adminFormGroupCss}
`;

export const PopLabel = styled.label`
  ${adminSetNavLabelCss}
`;

export const PopInput = styled.input`
  ${adminSetNavInputCss}
`;

export const PopFileInputWrapper = styled.div`
  ${adminFileInputWrapperCss}
`;

export const PopFileInput = styled.input`
  display: none;
`;

export const PopFileLabel = styled.label`
  ${adminFileLabelCss}
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
  ${adminAddButtonCss}
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
