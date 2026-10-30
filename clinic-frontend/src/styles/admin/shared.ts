"use client";

import {
  BoxShadow,
  FlexBetween,
  FlexCenter,
  FlexColumn,
  FlexStart,
  TransitionAll,
} from "@/styles/mixins";
import { css } from "styled-components";

// Exact shared declarations; individual elements and variant styles stay in their feature files.
export const adminPageHeaderCss = css`
  ${FlexBetween}
  margin-bottom: 1.5rem;
`;

export const adminPageTitleCss = css`
  font-size: 1.5rem;
  color: #5a5c69;
  font-weight: 700;
  margin: 0;
`;

export const adminColumnCss = css`
  display: flex;
  flex-direction: column;
`;

export const adminCardHeaderCss = css`
  background-color: #f8f9fc;
  border-bottom: 1px solid #e3e6f0;
  padding: 1rem 1.25rem;
`;

export const adminCardTitleCss = css`
  margin: 0;
  font-weight: 700;
  color: #1b4d3e;
`;

export const adminTableWrapperCss = css`
  width: 100%;
  overflow-x: auto;
  padding: 1rem;
`;

export const adminFullWidthPageHeaderCss = css`
  ${FlexBetween}
  width: 100%;
  margin-bottom: 1.5rem;
`;

export const adminForestPageTitleCss = css`
  font-size: 1.5rem;
  color: #34453c;
  font-weight: 700;
  margin: 0;
`;

export const adminRankEventCardCss = css`
  border-radius: 12px;
  ${BoxShadow};
  border: 1px solid rgba(59, 122, 87, 0.1);
  overflow: hidden;
  background-color: #fff;
`;

export const adminAddButtonCss = css`
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

export const adminDeleteBtnCss = css`
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

export const adminBorderedCardHeaderCss = css`
  background-color: #f7f9f7;
  border-bottom: 1px solid #e4eae5;
  padding: 1rem 1.25rem;
`;

export const adminLabelCss = css`
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #34453c;
  margin-bottom: 0.5rem;
`;

export const adminInputCss = css`
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

export const adminSaveButtonCss = css`
  ${FlexCenter};
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 12px;
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

export const adminSetNavCardHeaderCss = css`
  background-color: #f7f9f7;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(59, 122, 87, 0.1);
`;

export const adminSetNavLabelCss = css`
  font-size: 0.85rem;
  font-weight: 700;
  color: #34453c;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const adminSetNavInputCss = css`
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  background-color: #fff;
  border: 1px solid rgba(59, 122, 87, 0.3);
  border-radius: 12px;
  outline: none;
  ${TransitionAll}

  &:focus {
    border-color: #1b4d3e;
  }
`;

export const adminFileInputWrapperCss = css`
  gap: 1rem;
  ${FlexStart}

  .file-name {
    font-size: 0.9rem;
    color: #738079;
    border-bottom: 1px solid #d6e0d8;
    padding-bottom: 0.5rem;
  }
`;

export const adminFileLabelCss = css`
  background-color: #fff;
  border: 1px solid #d6e0d8;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #34453c;
  cursor: pointer;
  ${TransitionAll};

  &:hover {
    background-color: #f7f9f7;
  }
`;

export const adminNewsLeftColumnCss = css`
  ${FlexColumn}
  gap: 1.5rem;
  width: 100%;
`;

export const adminFormGroupCss = css`
  ${FlexColumn}
  width: 100%;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const adminGridCss = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
