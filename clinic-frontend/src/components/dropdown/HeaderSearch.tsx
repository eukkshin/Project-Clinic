"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  FaArrowUpRightFromSquare,
  FaMagnifyingGlass,
  FaXmark,
} from "react-icons/fa6";

import * as S from "@/assets/css/components/dropdown/HeaderSearch.styles";

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

// 관리자에서 실제 인기 검색어 API를 연결하기 전까지 사용할 임시 노출 목록.
// 실시간 인기순위라고 가정하거나 서버 순위인 것처럼 표시하지 않는다.
const RECOMMENDED_TERMS = [
  "눈성형",
  "코성형",
  "동안성형",
  "쁘띠시술",
  "병원소개",
];
const clean = (text: string) =>
  text.toLocaleLowerCase("ko-KR").replace(/\s+/g, "");

function safeHref(value: string) {
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
    // 열리는 CSS transition 이후에도 포커스가 정확하게 입력창에 머물도록 한다.
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
    // 아직 프로젝트에 /search 라우트가 없으므로 존재하지 않는 URL을 만들지 않는다.
    event.preventDefault();
    const target = matches.find((item) => item.url && item.url !== "/");
    if (target) {
      close();
      if (/^https?:\/\//i.test(target.url)) window.location.assign(target.url);
      else router.push(target.url);
    }
  };

  return (
    <S.SearchRoot ref={rootRef} $open={open} role="search">
      <S.SearchForm $open={open} onSubmit={handleSubmit}>
        {open && (
          <S.SearchInput
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="무엇을 찾으시나요?"
            aria-label="사이트 메뉴 검색어 입력"
            autoComplete="off"
            enterKeyHint="search"
          />
        )}
        <S.SearchToggle
          ref={triggerRef}
          type="button"
          onClick={() => (open ? close() : onOpenChange(true))}
          aria-label={open ? "검색 닫기" : "검색 열기"}
          title={open ? "검색 닫기" : "검색"}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
        >
          {open ? <FaXmark size={17} /> : <FaMagnifyingGlass size={17} />}
        </S.SearchToggle>
      </S.SearchForm>

      {open && (
        <S.SearchPanel
          id={panelId}
          aria-label="사이트 검색"
          $transparent={transparent}
        >
          <S.PanelHeader>
            <S.PanelEyebrow>AHN&apos;S SEARCH</S.PanelEyebrow>
            <S.PanelTitle>{trimmed ? "검색 결과" : "인기 검색어"}</S.PanelTitle>
            {!trimmed && (
              <S.PanelNote>추천 검색어 · 순위 데이터 연결 전</S.PanelNote>
            )}
          </S.PanelHeader>

          {trimmed ? (
            matches.length ? (
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
                        onClick={() => setQuery(item.name)}
                        title="아직 연결된 메뉴 주소가 없습니다"
                      >
                        <span>
                          <S.ResultTitle>{item.name}</S.ResultTitle>
                          {item.parent && (
                            <S.ResultParent>{item.parent}</S.ResultParent>
                          )}
                        </span>
                        <S.Preparing>페이지 준비 중</S.Preparing>
                      </S.ResultDisabled>
                    )}
                  </li>
                ))}
              </S.ResultList>
            ) : (
              <S.EmptyState>
                “{trimmed}”와 일치하는 메뉴가 없습니다.
              </S.EmptyState>
            )
          ) : (
            <S.PopularList>
              {RECOMMENDED_TERMS.map((term, index) => (
                <li key={term}>
                  <S.PopularButton
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      inputRef.current?.focus();
                    }}
                  >
                    <S.PopularIndex>
                      {String(index + 1).padStart(2, "0")}
                    </S.PopularIndex>
                    <span>{term}</span>
                    <FaMagnifyingGlass size={11} aria-hidden="true" />
                  </S.PopularButton>
                </li>
              ))}
            </S.PopularList>
          )}
          <S.PanelFooter>검색 대상: 관리자 메뉴 및 하위 메뉴</S.PanelFooter>
        </S.SearchPanel>
      )}
    </S.SearchRoot>
  );
}
