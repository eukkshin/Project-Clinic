"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import * as S from "@/assets/css/popup/PopupLiquid.styles";

import type { ReactNode } from "react";
// 기존 Popup 사용처(login / register 등)의 props 계약을 변경하지 않습니다.
interface PopupProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  maxWidth?:string;
  eyebrow?: string;
  confirmText?: string;
  isDisabled?: boolean;
  closeOnOverlayClick?: boolean; //배경 클릭 시 닫힘 여부 (기본값 true)
  children: ReactNode;
}

export const Popup = ({
  isOpen,
  title,
  onClose,
  onConfirm,
  maxWidth,
  closeOnOverlayClick = true,
  eyebrow = "AHN'S · MESSAGE",
  confirmText = "확인",
  isDisabled = false,
  children,
}: PopupProps) => {
  // SSR/CSR에서 document.body 접근 시점이 달라지지 않도록 마운트 후 Portal을 생성합니다.
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const contentId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !mounted) return;

    const previouslyFocused = document.activeElement;
    // 열리면 '확인'에 초점을 두므로 곧바로 Enter를 눌러 다음 단계로 이동할 수 있습니다.
    // onConfirm이 없다면 '취소'에 초점을 두어 Enter로 닫을 수 있습니다.
    (onConfirm ? primaryButtonRef.current : cancelButtonRef.current)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      // Tab으로 모달 바깥의 링크/입력창에 포커스가 빠져나가지 않도록 합니다.
      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusables = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.getClientRects().length > 0);

        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (!dialog.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      if (
        event.key !== "Enter" ||
        event.repeat ||
        event.defaultPrevented ||
        event.isComposing
      ) {
        return;
      }

      const target = event.target;
      // 버튼에서 누른 Enter는 브라우저가 해당 버튼의 click을 발생시킵니다.
      // 여기서 또 실행하면 onConfirm이 두 번 호출되므로 제외합니다.
      if (target instanceof HTMLElement) {
        if (
          target.closest(
            "button, a, input, select, textarea, [contenteditable='true']",
          )
        ) {
          return;
        }
      }
      // 텍스트 영역 등에서 Enter를 누른 경우에도 기본 동작을 제공해 줍니다.
      event.preventDefault();

      if(isDisabled) return;

      if (onConfirm) onConfirm();
      else onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused.isConnected
      ) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, mounted, onClose, onConfirm, isDisabled]);

  if (!mounted || !isOpen) return null;

  // document.body에 Portal을 사용해, 부모의 transform / overflow / GSAP pin의
  // 영향을 받지 않고 항상 화면 중앙에 안정적으로 나타나도록 합니다.
  return createPortal(
    <S.PopupOverlay
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && closeOnOverlayClick) onClose();
      }}
    >
      <S.ModalPopupContainer
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={contentId}
        onMouseDown={(event) => event.stopPropagation()}
        $maxWidth={maxWidth}
      >
        <S.GlassShine aria-hidden="true" />
        <S.PopupHeader>
          <S.HeaderCopy>
            <S.Eyebrow>{eyebrow}</S.Eyebrow>
            <S.PopupTitle id={titleId}>{title}</S.PopupTitle>
          </S.HeaderCopy>
          <S.CloseIcon type="button" onClick={onClose} aria-label="팝업 닫기">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </S.CloseIcon>
        </S.PopupHeader>

        <S.PopupBody id={contentId}>{children}</S.PopupBody>

        <S.PopupFooter>
          <S.CancelButton ref={cancelButtonRef} type="button" onClick={onClose}>
            취소
          </S.CancelButton>
          {onConfirm && (
            <S.ConfirmButton
              ref={primaryButtonRef}
              type="button"
              onClick={onConfirm}
              disabled={isDisabled}
            >
              {confirmText} <span aria-hidden="true">↗</span>
            </S.ConfirmButton>
          )}
        </S.PopupFooter>
        <S.BottomGleam aria-hidden="true" />
      </S.ModalPopupContainer>
    </S.PopupOverlay>,
    document.body,
  );
};
