"use client";

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

import * as S from '@/assets/css/components/dropdown/HeaderNavDropdown.styles';

export interface NavSubmenuItem {
  name: string;
  url: string;
}

export interface HeaderMenuItem {
  id: number;
  name: string;
  url: string;
  children?: NavSubmenuItem[];
}

function safeHref(url: string): string {
  const value = url.trim();
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return "/";
}

interface Props {
  menu: HeaderMenuItem;
  active: boolean;
  pathname: string;
  transparent: boolean;
  dark?: boolean;
}

/** 데스크톱용. 가로폭이 좁고 위에서 아래로 펼쳐지는 메뉴. */
export default function HeaderNavDropdown({
  menu,
  active,
  pathname,
  transparent,
  dark = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, 200);
  };

  useEffect(() => {
    if (!open) return;
    const onOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onOutside);
    return () => document.removeEventListener("pointerdown", onOutside);
  }, [open]);

  const items: NavSubmenuItem[] = [
    // 기존 상위 메뉴 URL을 반드시 보존한다.
    { name: menu.children?.length ? "전체 보기" : menu.name, url: menu.url },
    ...(menu.children ?? []),
  ];

  useEffect(() => {
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    };
  }, []);

  return (
    <S.NavRoot
      ref={rootRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onBlurCapture={(event) => {
        if (
          !event.relatedTarget ||
          !event.currentTarget.contains(event.relatedTarget as Node)
        ) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <S.NavTrigger
        ref={triggerRef}
        type="button"
        $active={active}
        $open={open}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{menu.name}</span>
      </S.NavTrigger>

      <S.NavPanel
        id={panelId}
        $open={open}
        $transparent={transparent}
        $dark={dark}
        aria-hidden={!open}
        inert={!open}
      >
        <S.NavPanelInner>
          {items.map((item, index) => {
            const href = safeHref(item.url);
            const selected =
              href !== "/" &&
              (pathname === href ||
                pathname.startsWith(`${href.replace(/\/$/, "")}/`));
            return (
              <S.DropdownLink
                as={Link}
                key={`${index}-${item.url}`}
                href={href}
                $active={selected}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                <span>{item.name}</span>
              </S.DropdownLink>
            );
          })}
        </S.NavPanelInner>
      </S.NavPanel>
    </S.NavRoot>
  );
}
