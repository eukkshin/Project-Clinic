"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  FaArrowUpRightFromSquare,
  FaMagnifyingGlass,
  FaXmark,
} from "react-icons/fa6";

import * as S from "@/components/dropdown/HeaderSearch.styles";
import PopularSearches from "@/components/dropdown/PopularSearches";
import { recordSearchKeyword } from "@/lib/search/recordSearchKeyword";

interface MenuItem {
  id: number;
  name: string;
  url: string;
  children?: { name: string; url: string }[];
}

interface SearchEntry {
  key: string;
  name: string;
  parent?: string;
  url: string;
}

interface HeaderSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menus: MenuItem[];
  transparent?: boolean;
}

const clean = (value: string) =>
  value.toLocaleLowerCase("ko-KR").replace(/\s+/g, "");

function safeHref(value: string): string {
  const url = value.trim();
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return "";
}

export default function HeaderSearch({
  open,
  onOpenChange,
  menus,
  transparent = false,
}: HeaderSearchProps) {
  const router = useRouter();
  const tSearch = useTranslations("Search");
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = "ahns-header-search-panel";

  const entries = useMemo<SearchEntry[]>(() => {
    const list: SearchEntry[] = [];

    for (const menu of menus) {
      list.push({
        key: `main-${menu.id}`,
        name: menu.name,
        url: safeHref(menu.url),
      });

      for (let index = 0; index < (menu.children?.length ?? 0); index++) {
        const item = menu.children![index];
        list.push({
          key: `sub-${menu.id}-${index}`,
          name: item.name,
          parent: menu.name,
          url: safeHref(item.url),
        });
      }
    }

    return list;
  }, [menus]);

  const trimmed = query.trim();
  const matches = useMemo(() => {
    if (!trimmed) return [];
    const needle = clean(trimmed);
    return entries
      .filter((item) =>
        clean(`${item.parent ?? ""} ${item.name}`).includes(needle),
      )
      .slice(0, 9);
  }, [entries, trimmed]);

  const close = () => {
    onOpenChange(false);
    setQuery("");
  };

  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => inputRef.current?.focus());

    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        onOpenChange(false);
        setQuery("");
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onOpenChange(false);
        setQuery("");
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.replace(/\s+/g, " ").trim().slice(0, 60);
    if (!term) return;

    // 현재 Header.tsx에 상위 onSubmitCapture가 있으면 그쪽에서 먼저
    // 제출을 처리하고 전파를 중단합니다. 이 코드는 단독 사용 시 대비용입니다.
    recordSearchKeyword(term);
    close();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <S.SearchRoot ref={rootRef} $open={open} role="search" data-lenis-prevent>
      <S.SearchForm $open={open} onSubmit={handleSubmit}>
        {open && (
          <S.SearchInput
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tSearch("placeholder")}
            aria-label={tSearch("searchInput")}
            autoComplete="off"
            enterKeyHint="search"
          />
        )}
        <S.SearchToggle
          ref={triggerRef}
          type="button"
          onClick={() => (open ? close() : onOpenChange(true))}
          aria-label={open ? tSearch("searchClose") : tSearch("searchOpen")}
          title={open ? tSearch("searchClose") : tSearch("searchButton")}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
        >
          {open ? <FaXmark size={17} /> : <FaMagnifyingGlass size={17} />}
        </S.SearchToggle>
      </S.SearchForm>

      {open && (
        <S.SearchPanel
          id={panelId}
          aria-label={tSearch("searchInSite")}
          $transparent={transparent}
        >
          {trimmed ? (
            <>
              <S.PanelHeader>
                <S.PanelEyebrow>AHN&apos;S SEARCH</S.PanelEyebrow>
                <S.PanelTitle>{tSearch("menuShortcut")}</S.PanelTitle>
                <S.PanelNote>{tSearch("enterHint")}</S.PanelNote>
              </S.PanelHeader>

              {matches.length ? (
                <S.ResultList>
                  {matches.map((item) => (
                    <li key={item.key}>
                      {item.url && item.url !== "/" ? (
                        <S.ResultLink as={Link} href={item.url} onClick={close}>
                          <span>
                            <S.ResultTitle>{item.name}</S.ResultTitle>
                            {item.parent && (
                              <S.ResultParent>{item.parent}</S.ResultParent>
                            )}
                          </span>
                          <FaArrowUpRightFromSquare
                            size={11}
                            aria-hidden="true"
                          />
                        </S.ResultLink>
                      ) : (
                        <S.ResultDisabled
                          type="button"
                          onClick={() => {
                            setQuery(item.name);
                            inputRef.current?.focus();
                          }}
                          title={tSearch("unavailableLink")}
                        >
                          <span>
                            <S.ResultTitle>{item.name}</S.ResultTitle>
                            {item.parent && (
                              <S.ResultParent>{item.parent}</S.ResultParent>
                            )}
                          </span>
                          <S.Preparing>{tSearch("preparing")}</S.Preparing>
                        </S.ResultDisabled>
                      )}
                    </li>
                  ))}
                </S.ResultList>
              ) : (
                <S.EmptyState>
                  {tSearch("menuEmpty", { query: trimmed })}
                </S.EmptyState>
              )}
              <S.PanelFooter>{tSearch("menuFooter")}</S.PanelFooter>
            </>
          ) : (
            <PopularSearches enabled={open} onNavigate={close} />
          )}
        </S.SearchPanel>
      )}
    </S.SearchRoot>
  );
}
