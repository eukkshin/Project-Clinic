"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { FiArrowUpRight, FiSearch } from "react-icons/fi";

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

const filters: { id: FilterKey; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "procedures", label: "시술정보" },
  { id: "faq", label: "FAQ" },
  { id: "events", label: "이벤트" },
  { id: "vlog", label: "영상" },
];

const groupLabels: Record<GroupKey, string> = {
  procedures: "시술 정보",
  faq: "자주 묻는 질문",
  events: "이벤트",
  vlog: "영상",
};

const englishTags: Record<GroupKey, string> = {
  procedures: "PROCEDURE",
  faq: "FAQ",
  events: "EVENT",
  vlog: "AHNS VLOG",
};

export default function SearchResultsClient() {
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

    fetch(`${API_ORIGIN}/api/search?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const json: unknown = await response.json();
        if (
          !response.ok ||
          !json ||
          typeof json !== "object" ||
          !("success" in json) ||
          json.success !== true
        ) {
          throw new Error("검색 결과를 불러오지 못했습니다.");
        }
        return json as SearchResponse;
      })
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            cause instanceof Error ? cause.message : "검색에 실패했습니다.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [query]);

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
    router.push(`/search?q=${encodeURIComponent(term)}`);
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
            placeholder="관심 있는 시술이나 키워드를 입력하세요"
            aria-label="통합검색어"
          />
          <S.SubmitButton
            type="submit"
            disabled={!input.trim()}
            aria-label="검색하기"
          >
            <span>검색</span>
            <FiArrowUpRight aria-hidden="true" size={17} />
          </S.SubmitButton>
        </S.SearchForm>
      </S.SearchHero>

      <S.Body>
        {!query ? (
          <S.State role="status">
            검색어를 입력하면 시술 정보, FAQ, 이벤트, 영상을 함께 찾아드립니다.
          </S.State>
        ) : (
          <>
            <S.ResultHeading>
              <div>
                <S.SmallLabel>01 / SEARCH RESULTS</S.SmallLabel>
                <h1>
                  <strong>‘{query}’</strong> 검색 결과
                </h1>
              </div>
              <S.ResultCount aria-live="polite">
                {loading
                  ? "검색 중"
                  : data
                    ? `총 ${active === "all" ? data.total : visibleCount}건`
                    : "—"}
              </S.ResultCount>
            </S.ResultHeading>

            <S.Filters role="group" aria-label="검색 결과 분류">
              {filters.map((filter) => (
                <S.FilterButton
                  key={filter.id}
                  type="button"
                  $active={active === filter.id}
                  aria-pressed={active === filter.id}
                  onClick={() => setActive(filter.id)}
                >
                  {filter.label}
                </S.FilterButton>
              ))}
            </S.Filters>

            {loading && (
              <S.State role="status">검색 결과를 가져오는 중입니다.</S.State>
            )}
            {error && <S.State role="alert">{error}</S.State>}

            {!loading && !error && data && (
              <>
                {data.partial && (
                  <S.Warning role="status">
                    일부 공개 콘텐츠를 불러오지 못했습니다. 잠시 후 다시 검색해
                    주세요.
                  </S.Warning>
                )}

                {visibleCount === 0 ? (
                  <S.State role="status">
                    일치하는 검색 결과가 없습니다. 다른 키워드로 검색해 보세요.
                  </S.State>
                ) : (
                  visibleGroups.map((group, groupIndex) => (
                    <S.Group key={group.section}>
                      <S.GroupTitle>
                        <div>
                          <S.GroupNumber>
                            {String(groupIndex + 1).padStart(2, "0")}
                          </S.GroupNumber>
                          <h2>{groupLabels[group.section]}</h2>
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
                                  <S.FaqTitle as={Link} href={item.href}>
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
                                <S.CardTitle as={Link} href={item.href}>
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
                                  상세 페이지 준비 중
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
