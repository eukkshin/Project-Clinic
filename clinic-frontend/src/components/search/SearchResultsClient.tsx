"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { FiArrowUpRight, FiSearch } from "react-icons/fi";

import { defaultLocale, isAppLocale } from "@/i18n/config";
import { localizedPath } from "@/i18n/url";
import { API_ORIGIN } from "@/lib/api/config";
import { recordSearchKeyword } from "@/lib/search/recordSearchKeyword";
import * as S from "@/styles/search/SearchResults.styles";

type GroupKey = "procedures" | "faq" | "events" | "vlog";
type FilterKey = "all" | GroupKey;

type SearchItem = {
  id: string;
  type: GroupKey;
  label: string;
  title: string;
  description: string;
  href: string | null;
};

type SearchGroup = {
  section: GroupKey;
  label: string;
  items: SearchItem[];
};

type SearchResponse = {
  success: true;
  query: string;
  groups: SearchGroup[];
  total: number;
  partial: boolean;
};

const filters: FilterKey[] = ["all", "procedures", "faq", "events", "vlog"];

const labelKeys: Record<
  FilterKey,
  "all" | "procedures" | "faq" | "events" | "videos"
> = {
  all: "all",
  procedures: "procedures",
  faq: "faq",
  events: "events",
  vlog: "videos",
};

const englishTags: Record<GroupKey, string> = {
  procedures: "PROCEDURE",
  faq: "FAQ",
  events: "EVENT",
  vlog: "AHNS VLOG",
};

export default function SearchResultsClient() {
  const tSearch = useTranslations("Search");
  const currentLocale = useLocale();
  const locale = isAppLocale(currentLocale) ? currentLocale : defaultLocale;
  const router = useRouter();
  const params = useSearchParams();
  const query = (params.get("q") ?? "").trim();

  const [input, setInput] = useState(query);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [active, setActive] = useState<FilterKey>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setInput(query);
    setActive("all");
  }, [query]);

  useEffect(() => {
    if (!query || query.length > 60) {
      setData(null);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError("");
    setData(null);

    fetch(
      `${API_ORIGIN}/api/search?q=${encodeURIComponent(query)}&locale=${encodeURIComponent(locale)}`,
      {
        signal: controller.signal,
      },
    )
      .then(async (response) => {
        const json: unknown = await response.json();
        if (
          !response.ok ||
          !json ||
          typeof json !== "object" ||
          !("success" in json) ||
          json.success !== true
        ) {
          throw new Error(tSearch("loadFailed"));
        }
        return json as SearchResponse;
      })
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            cause instanceof Error ? cause.message : tSearch("searchFailed"),
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [query, locale, tSearch]);

  const visibleGroups = useMemo(
    () =>
      (data?.groups ?? []).filter(
        (group) =>
          group.items.length > 0 &&
          (active === "all" || group.section === active),
      ),
    [data, active],
  );

  const visibleCount = visibleGroups.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = input.trim().replace(/\s+/g, " ").slice(0, 60);
    if (!term) return;

    // GET 검색 결과 조회와 별개로, 실제 폼 제출만 인기검색어에 집계합니다.
    recordSearchKeyword(term);
    router.push(localizedPath(`/search?q=${encodeURIComponent(term)}`, locale));
  }

  return (
    <S.Page>
      {/* 상단: 불필요한 타이틀/설명을 제거하고 검색바만 유지 */}
      <S.SearchHero>
        <S.SearchForm onSubmit={submit} role="search">
          <FiSearch aria-hidden="true" size={20} />
          <S.SearchInput
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={60}
            placeholder={tSearch("searchInputPrompt")}
            aria-label={tSearch("searchInput")}
          />
          <S.SubmitButton
            type="submit"
            disabled={!input.trim()}
            aria-label={tSearch("searchButtonLabel")}
          >
            <span>{tSearch("searchButton")}</span>
            <FiArrowUpRight aria-hidden="true" size={17} />
          </S.SubmitButton>
        </S.SearchForm>
      </S.SearchHero>

      <S.Body>
        {!query ? (
          <S.State role="status">{tSearch("searchIntro")}</S.State>
        ) : (
          <>
            <S.ResultHeading>
              <div>
                <S.SmallLabel>01 / SEARCH RESULTS</S.SmallLabel>
                <h1>
                  <strong>‘{query}’</strong> {tSearch("resultsSuffix")}
                </h1>
              </div>
              <S.ResultCount aria-live="polite">
                {loading
                  ? tSearch("searching")
                  : data
                    ? tSearch("totalCount", {
                        count: active === "all" ? data.total : visibleCount,
                      })
                    : "—"}
              </S.ResultCount>
            </S.ResultHeading>

            <S.Filters role="group" aria-label={tSearch("filtersLabel")}>
              {filters.map((filter) => (
                <S.FilterButton
                  key={filter}
                  type="button"
                  $active={active === filter}
                  aria-pressed={active === filter}
                  onClick={() => setActive(filter)}
                >
                  {tSearch(labelKeys[filter])}
                </S.FilterButton>
              ))}
            </S.Filters>

            {loading && <S.State role="status">{tSearch("fetching")}</S.State>}
            {error && <S.State role="alert">{error}</S.State>}

            {!loading && !error && data && (
              <>
                {data.partial && (
                  <S.Warning role="status">{tSearch("partialError")}</S.Warning>
                )}

                {visibleCount === 0 ? (
                  <S.State role="status">{tSearch("emptyResult")}</S.State>
                ) : (
                  visibleGroups.map((group, groupIndex) => (
                    <S.Group key={group.section}>
                      <S.GroupTitle>
                        <div>
                          <S.GroupNumber>
                            {String(groupIndex + 1).padStart(2, "0")}
                          </S.GroupNumber>
                          <h2>{tSearch(labelKeys[group.section])}</h2>
                        </div>
                        <span>{group.items.length} RESULTS</span>
                      </S.GroupTitle>

                      {group.section === "faq" ? (
                        <S.FaqList>
                          {group.items.map((item) => (
                            <S.FaqItem key={item.id}>
                              <S.FaqInitial aria-hidden="true">Q.</S.FaqInitial>
                              <S.FaqContent>
                                {item.href ? (
                                  <S.FaqTitle
                                    as={Link}
                                    href={localizedPath(item.href, locale)}
                                  >
                                    {item.title}
                                    <FiArrowUpRight
                                      aria-hidden="true"
                                      size={16}
                                    />
                                  </S.FaqTitle>
                                ) : (
                                  <S.FaqTitle as="span">
                                    {item.title}
                                  </S.FaqTitle>
                                )}
                                {item.description && (
                                  <S.FaqDescription>
                                    {item.description}
                                  </S.FaqDescription>
                                )}
                              </S.FaqContent>
                            </S.FaqItem>
                          ))}
                        </S.FaqList>
                      ) : (
                        <S.CardGrid>
                          {group.items.map((item) => (
                            <S.Card key={item.id}>
                              <S.CardEyebrow>
                                {englishTags[item.type]}
                              </S.CardEyebrow>
                              {item.href ? (
                                <S.CardTitle
                                  as={Link}
                                  href={localizedPath(item.href, locale)}
                                >
                                  {item.title}
                                  <S.CardArrow aria-hidden="true">
                                    <FiArrowUpRight size={18} />
                                  </S.CardArrow>
                                </S.CardTitle>
                              ) : (
                                <S.CardTitle as="div">{item.title}</S.CardTitle>
                              )}
                              {item.description && (
                                <S.CardDescription>
                                  {item.description}
                                </S.CardDescription>
                              )}
                              {!item.href && (
                                <S.UnlinkedNote>
                                  {tSearch("detailPreparing")}
                                </S.UnlinkedNote>
                              )}
                            </S.Card>
                          ))}
                        </S.CardGrid>
                      )}
                    </S.Group>
                  ))
                )}
              </>
            )}
          </>
        )}
      </S.Body>
    </S.Page>
  );
}
