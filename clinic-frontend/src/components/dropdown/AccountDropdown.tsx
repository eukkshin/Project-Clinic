"use client";

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

import * as S from '@/assets/css/components/dropdown/AccountDropdown.styles';

interface AccountDropdownProps {
  userName: string;
  onLogout: () => void;
  transparent?: boolean;
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
  transparent = false,
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
  const links: { title: string; href?: string }[] = [
    { title: "마이페이지", href: myPageHref },
    { title: "예약 내역", href: reservationsHref },
    { title: "내 상담 내역", href: consultationsHref },
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
        <S.TriggerName>{userName}님</S.TriggerName>
        <S.Chevron $open={open} aria-hidden="true">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
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
          $transparent={transparent}
        >
          <S.GlassShine aria-hidden="true" />
          <S.ProfileSection>
            <S.ProfileEyebrow>MY ACCOUNT</S.ProfileEyebrow>
            <S.ProfileName>{userName}님, 환영합니다.</S.ProfileName>
            <S.ProfileCaption>AHN&apos;S PERSONAL EXPERIENCE</S.ProfileCaption>
          </S.ProfileSection>

          <S.MenuDivider />
          <S.MenuItems>
            {links.map(({ title, href }) =>
              href ? (
                <S.MenuLink
                  as={Link}
                  key={title}
                  href={href}
                  onClick={handleNavigate}
                >
                  <S.MenuLabel>{title}</S.MenuLabel>
                </S.MenuLink>
              ) : (
                <S.MenuUnavailable key={title} aria-disabled="true">
                  <S.MenuLabel>{title}</S.MenuLabel>
                  <S.ComingSoon>준비 중</S.ComingSoon>
                </S.MenuUnavailable>
              ),
            )}
          </S.MenuItems>

          <S.MenuDivider />

          <S.LogoutButton type="button" onClick={handleLogout}>
            <S.MenuLabel>로그아웃</S.MenuLabel>
          </S.LogoutButton>
          <S.GlassBottom aria-hidden="true" />
        </S.GlassPanel>
      )}
    </S.AccountRoot>
  );
}
