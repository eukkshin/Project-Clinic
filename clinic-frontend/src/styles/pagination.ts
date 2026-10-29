import styled from "styled-components";

import { FlexCenter } from "@/styles/mixins";

export const Pagenation = styled.div`
  ${FlexCenter}
  margin-top: 20px;
  gap: 8px;
  padding-bottom: 20px;
`;

export const PagenationBtn = styled.button<{ $active: boolean }>`
  ${FlexCenter}
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background-color: ${({ $active }) => ($active ? "#333" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  cursor: pointer;
  border-radius: 4px;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};

  &:hover {
    background-color: ${({ $active }) => ($active ? "#444" : "#f5f5f5")};
    color: ${({ $active }) => ($active ? "#f5f5f5" : "#444")};
  }
`;

export const Prev = styled.button`
  ${FlexCenter}
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: #fff;
  cursor: pointer;
  white-space: nowrap;

  &:disabled {
    cursor: default;
  }

  &:hover:not(:disabled) {
    background-color: #f5f5f5;
  }
`;
export const Next = styled.button`
  ${FlexCenter}
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: #fff;
  cursor: pointer;
  white-space: nowrap;

  &:disabled {
    cursor: default;
  }

  &:hover:not(:disabled) {
    background-color: #f5f5f5;
  }
`;
