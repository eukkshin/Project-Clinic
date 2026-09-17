"use client";
import React, { useState } from "react";

import * as S from "@/assets/css/Style.style";

//공용으로 사용하기에..
interface PopupProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  children: React.ReactNode;
}

export const Popup = ({
  isOpen,
  title,
  onClose,
  onConfirm,
  children,
}: PopupProps) => {
  if (!isOpen) return null;

  return (
    <S.PopupOverlay onClick={onClose}>
      <S.ModalPopupContainer onClick={(e) => e.stopPropagation}>
        <S.PopupHeader>
          <S.PopupTitle>{title}</S.PopupTitle>
          <S.CloseIcon onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18"
                stroke="#111"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="#111"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            &times;
          </S.CloseIcon>
        </S.PopupHeader>
        <S.PopupBody>{children}</S.PopupBody>
        <S.PopupFooter>
          <S.CancelButton onClick={onClose}>취소</S.CancelButton>
          {onConfirm && (
            <S.ConfirmButton onClick={onConfirm}>확인</S.ConfirmButton>
          )}
        </S.PopupFooter>
      </S.ModalPopupContainer>
    </S.PopupOverlay>
  );
};
