"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import * as S from "@/assets/css/components/dropdown/AccountDropdown.styles";

type AccountIconKind = "user" | "calendar" | "message" | "logout";

function AccountIcon({ kind }: { kind: AccountIconKind }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === "user" && (
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5.5 20c.5-3.2 2.8-5 6.5-5s6 1.8 6.5 5" />
        </>
      )}
      {kind === "calendar" && (
        <>
          <rect x="3.5" y="5" width="17" height="15.5" rx="2.3" />
          <path d="M7.5 3.5v3M16.5 3.5v3M3.5 10h17" />
        </>
      )}
      {kind === "message" && (
        <path d="M20.5 11.5a8.5 8.5 0 0 1-8.5 8.5 8.9 8.9 0 0 1-4-.95l-4.5 1 1.05-4.3A8.5 8.5 0 1 1 20.5 11.5Z" />
      )}
      {kind === "logout" && (
        <>
          <path d="M10 4.5H6A2.5 2.5 0 0 0 3.5 7v10A2.5 2.5 0 0 0 6 19.5h4" />
          <path d="M13 7.5 17.5 12 13 16.5M8 12h9.5" />
        </>
      )}
    </svg>
  );
}

interface AccountDropdownProps {
  userName: string;
  onLogout: () => void;
  /** Header 모바일 전체 메뉴 안에 표시할 때 true */
  mobile?: boolean;
  /** 메뉴 선택 후 모바일 내비게이션을 닫는 기존 함수 */
  onNavigate?: () => void;
  /** 실제 페이지가 구현되었을 때만 전달. 없으면 '준비 중'으로 표시 */
  myPageHref?: string;
  reservationsHref?: string;
  consultationsHref?: string;
}

export default function AccountDropdown({
  userName,
  onLogout,
  mobile = false,
  onNavigate,
  myPageHref,
  reservationsHref,
  consultationsHref,
}: AccountDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const handleNavigate = () => {
    setOpen(false);
    onNavigate?.();
  };

  const handleLogout = () => {
    setOpen(false);
    onNavigate?.();
    onLogout();
  };

  const links: { title: string; icon: AccountIconKind; href?: string }[] = [
    { title: "마이페이지", icon: "user", href: myPageHref },
    { title: "예약 내역", icon: "calendar", href: reservationsHref },
    { title: "내 상담 내역", icon: "message", href: consultationsHref },
  ];

  return (
    <S.AccountRoot ref={rootRef} $mobile={mobile}>
      <S.AccountTrigger
        ref={buttonRef}
        type="button"
        $mobile={mobile}
        $open={open}
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
      >
        <S.Avatar aria-hidden="true">{userName.charAt(0)}</S.Avatar>
        <S.TriggerName>{userName}님</S.TriggerName>
        <S.Chevron $open={open} aria-hidden="true">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </S.Chevron>
      </S.AccountTrigger>

      {open && (
        <S.GlassPanel
          id={menuId}
          role="region"
          aria-label="회원 계정 메뉴"
          $mobile={mobile}
        >
          <S.GlassShine aria-hidden="true" />
          <S.ProfileSection>
            <S.ProfileEyebrow>MY ACCOUNT</S.ProfileEyebrow>
            <S.ProfileName>{userName}님, 환영합니다.</S.ProfileName>
            <S.ProfileCaption>AHN&apos;S PERSONAL EXPERIENCE</S.ProfileCaption>
          </S.ProfileSection>

          <S.MenuDivider />
          <S.MenuItems>
            {links.map(({ title, icon, href }) =>
              href ? (
                <S.MenuLink
                  as={Link}
                  key={title}
                  href={href}
                  onClick={handleNavigate}
                >
                  <S.MenuIcon>
                    <AccountIcon kind={icon} />
                  </S.MenuIcon>
                  <S.MenuLabel>{title}</S.MenuLabel>
                  <S.MenuArrow aria-hidden="true">↗</S.MenuArrow>
                </S.MenuLink>
              ) : (
                <S.MenuUnavailable key={title} aria-disabled="true">
                  <S.MenuIcon>
                    <AccountIcon kind={icon} />
                  </S.MenuIcon>
                  <S.MenuLabel>{title}</S.MenuLabel>
                  <S.ComingSoon>준비 중</S.ComingSoon>
                </S.MenuUnavailable>
              ),
            )}
          </S.MenuItems>
          <S.MenuDivider />
          <S.LogoutButton type="button" onClick={handleLogout}>
            <S.MenuIcon>
              <AccountIcon kind="logout" />
            </S.MenuIcon>
            <S.MenuLabel>로그아웃</S.MenuLabel>
            <S.MenuArrow aria-hidden="true">↗</S.MenuArrow>
          </S.LogoutButton>
          <S.GlassBottom aria-hidden="true" />
        </S.GlassPanel>
      )}
    </S.AccountRoot>
  );
}
