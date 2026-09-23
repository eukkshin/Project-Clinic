import styled from "styled-components";

import {
  BoxShadow,
  FlexBetween,
  FlexCenter,
  FlexColumn,
  FlexStart,
  TransitionAll,
} from "../Common.styles";

export const EventAdminContainer = styled.div`
  width: 100%;
`;
export const EventPageHeader = styled.header`
  ${FlexBetween}
  width: 100%;
  margin-bottom: 1.5rem;
`;

export const EventPageTitle = styled.h2`
  font-size: 1.5rem;
  color: #5a5c69;
  font-weight: 700;
  margin: 0;
`;

export const EventSaveButton = styled.button`
  background-color: #1b4d3e;
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 0.35rem;
  font-size: 0.9rem;
  font-weight: 600;
  gap: 0.5rem;
  cursor: pointer;
  ${FlexCenter}
  ${BoxShadow}
  ${TransitionAll}
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background-color: #246652;
  }
`;

export const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const EventLeftColumn = styled.div`
  ${FlexColumn}
`;
export const EventRightColumn = styled.div`
  ${FlexColumn}
`;

export const RankEventCard = styled.div`
  border-radius: 0.35rem;
  ${BoxShadow};
  border: 1px solid rgba(59, 122, 87, 0.1);
  overflow: hidden;
`;

export const EventCardHeader = styled.header`
  background-color: #f8f9fc;
  border-bottom: 1px solid rgba(59, 122, 87, 0.1);
  padding: 1rem 1.25rem;
`;

export const EventCardTitle = styled.h6`
  margin: 0;
  font-weight: 700;
  color: #1b4d3e;
`;
export const EventCardBody = styled.div`
  padding: 1.5rem;
  color: #858796;
`;
export const EventFormGroup = styled.div`
  margin-bottom: 1.5rem;
`;
export const EventLabel = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #5a5c69;
  white-space: nowrap;
  flex-shrink: 0;
  margin-bottom: 0.5rem;
`;
export const EventInput = styled.input`
  width: 100%;
  padding: 0.6rem 1rem;
  color: #5a5c69;
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

export const EventFileInputWrapper = styled.div`
  gap: 1rem;

  .file-name {
    font-size: 0.9rem;
    color: #858796;
    border-bottom: 1px solid #d1d3e2;
    padding-bottom: 0.5rem;
  }
`;
export const EventFileInput = styled.input`
  display: none;
`;
export const EventFileLabel = styled.label`
  background-color: #fff;
  border: 1px solid #d1d3e2;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  border-radius: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #5a5c69;
  cursor: pointer;
  ${TransitionAll};
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background-color: #eaecf4;
  }
`;
export const EventPreviewRect = styled.div`
  width: 120px;
  height: 150px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e3e6f0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const EventAddButton = styled.button`
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
export const EventTableWrapper = styled.div`
  width: 100%;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(27, 77, 62, 0.2);
    border-radius: 10px;
    transition: background-color 0.2s ease;
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(27, 77, 62, 0.5);
  }

  scrollbar-width: thin;
  scrollbar-color: rgba(27, 77, 62, 0.2) transparent;
`;

const TableRowBase = `
  display: table;
  table-layout: fixed;
  width: 100%;
`;

export const EventTable = styled.table`
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
          width: 20%;
        }
        &:nth-child(3) {
          width: 20%;
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
          width: 10%;
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
      }
    }
  }
`;

export const EventThumbnail = styled.div`
  ${FlexCenter}
  width: 64px;
  height: 80px;
  color: #5a5c69;
  background-color: #d1d3e2;
  font-size: 0.85rem;
  margin: 0 auto;
  overflow: hidden;
  scroll-behavior: smooth;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const EventRankBadge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background-color: #e8f5e9;
  color: #1b4d3e;
  ${FlexCenter}
  font-size: 0.85rem;
  font-weight: 800;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
`;

export const EventActionBtn = styled.button`
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
    background-color: #f8f9fc;
    cursor: default;
  }
`;

export const EventDeleteBtn = styled.button`
  background: transparent;
  border: none;
  color: #e74a3b;
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
