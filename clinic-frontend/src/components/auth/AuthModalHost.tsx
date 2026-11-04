"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import * as S from "@/components/auth/LoginModal.styles";
import LoginSplitView from "@/components/auth/LoginSplitView";

export default function AuthModalHost() {
  const t = useTranslations("Auth");
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = sessionStorage.getItem("ahns:reopen-login-modal");
    if (saved === "1") {
      sessionStorage.removeItem("ahns:reopen-login-modal");
      setOpen(true);
    }
    const onOpen = () => {
      setClosing(false);
      setOpen(true);
    };
    window.addEventListener("ahns:open-login-modal", onOpen);
    return () => window.removeEventListener("ahns:open-login-modal", onOpen);
  }, []);

  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 230);
    return () => window.clearTimeout(timer);
  }, [closing]);

  const closeDialog = () => setClosing(true);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current
      ?.querySelector<HTMLInputElement>('input[name="userId"]')
      ?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      // 기존 로그인 성공/오류 Popup을 띄운 동안에는 해당 Popup의 키보드 동작을 우선한다.
      const otherModal =
        document.querySelectorAll('[role="dialog"][aria-modal="true"]').length >
        1;
      if (otherModal) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setClosing(true);
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const elements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((item) => item.getClientRects().length > 0);
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [open]);

  if (!mounted || !open) return null;
  return createPortal(
    <S.Backdrop
      data-lenis-prevent
      data-closing={closing}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <S.Dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("modalLabel")}
        aria-labelledby={titleId}
        tabIndex={-1}
        data-closing={closing}
        data-lenis-prevent
      >
        <LoginSplitView
          mode="modal"
          headingId={titleId}
          onClose={closeDialog}
          onSuccess={closeDialog}
        />
      </S.Dialog>
    </S.Backdrop>,
    document.body,
  );
}
