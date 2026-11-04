"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AdminTranslation,
  CmsType,
  contentI18nApi,
  ContentStatus,
  SourceOption,
  TranslationLocale,
} from "@/lib/admin/contentI18nApi";

import * as S from "./ContentTranslation.styles";

const types: { type: CmsType; label: string }[] = [
  { type: "EVENT", label: "이벤트" },
  { type: "FAQ", label: "FAQ" },
  { type: "DETAIL_CATEGORY", label: "시술 분류" },
  { type: "DETAIL_PAGE", label: "시술 상세페이지" },
  { type: "DETAIL_SECTION", label: "시술 상세 섹션" },
];
const langs: { lang: TranslationLocale; label: string }[] = [
  { lang: "en", label: "EN · English" },
  { lang: "ja", label: "JP · 日本語" },
  { lang: "zh-CN", label: "CN · 简体中文" },
  { lang: "zh-TW", label: "TW · 繁體中文" },
];
const fields: Record<
  CmsType,
  { key: string; label: string; long?: boolean }[]
> = {
  EVENT: [{ key: "title", label: "이벤트 제목" }],
  FAQ: [
    { key: "categoryName", label: "카테고리명" },
    { key: "question", label: "질문" },
    { key: "answer", label: "답변", long: true },
  ],
  DETAIL_CATEGORY: [
    { key: "name", label: "분류명" },
    { key: "description", label: "설명", long: true },
  ],
  DETAIL_PAGE: [
    { key: "title", label: "상세페이지 제목" },
    { key: "heroEyebrow", label: "Hero Eyebrow" },
    { key: "heroTitle", label: "Hero 제목" },
    { key: "heroDescription", label: "Hero 설명", long: true },
    { key: "heroImageAlt", label: "Hero 이미지 대체 텍스트" },
    { key: "seoTitle", label: "SEO 제목" },
    { key: "seoDescription", label: "SEO 설명", long: true },
  ],
  DETAIL_SECTION: [
    { key: "title", label: "섹션 제목" },
    { key: "eyebrow", label: "섹션 Eyebrow" },
    { key: "content", label: "섹션 상세 본문 JSON", long: true },
  ],
};

export default function ContentTranslationEditor() {
  const [type, setType] = useState<CmsType>("EVENT");
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<SourceOption[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [lang, setLang] = useState<TranslationLocale>("en");
  const [detail, setDetail] = useState<AdminTranslation | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [includeJson, setIncludeJson] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<ContentStatus>("MISSING");

  const loadOptions = useCallback(async (selectedType: CmsType, q: string) => {
    setError("");
    try {
      const rows = await contentI18nApi.sources(selectedType, q);
      setOptions(rows);
      setId((previous) =>
        rows.some((item) => item.id === previous)
          ? previous
          : (rows[0]?.id ?? null),
      );
    } catch (reason) {
      setOptions([]);
      setId(null);
      setError(
        reason instanceof Error ? reason.message : "원본 목록 조회 실패",
      );
    }
  }, []);

  useEffect(() => {
    void loadOptions(type, "");
  }, [loadOptions, type]);

  useEffect(() => {
    if (id === null) {
      setDetail(null);
      setForm({});
      return;
    }
    let active = true;
    setDetail(null);
    setError("");
    setMessage("");
    void contentI18nApi
      .get(type, id, lang)
      .then((data) => {
        if (!active) return;
        const initial: Record<string, string> = {};
        for (const entry of fields[type]) {
          const edited = data.payload[entry.key];
          if (entry.key === "content") {
            initial.content = JSON.stringify(
              edited ?? data.source.content ?? {},
              null,
              2,
            );
            setIncludeJson(edited != null);
          } else {
            initial[entry.key] = typeof edited === "string" ? edited : "";
          }
        }
        setForm(initial);
        setDetail(data);
        setStatus(data.status);
      })
      .catch((reason: unknown) => {
        if (active)
          setError(reason instanceof Error ? reason.message : "번역 조회 실패");
      });
    return () => {
      active = false;
    };
  }, [type, id, lang]);

  const originalLabel = useMemo(() => {
    if (!detail) return "";
    return String(
      detail.source.title ??
        detail.source.question ??
        detail.source.name ??
        "선택한 콘텐츠",
    );
  }, [detail]);

  const save = async (nextStatus: "DRAFT" | "PUBLISHED") => {
    if (id === null || !detail || busy) return;
    const payload: Record<string, unknown> = {};
    for (const { key } of fields[type]) {
      if (key === "content") {
        if (includeJson) {
          try {
            payload.content = JSON.parse(form.content || "{}");
          } catch {
            setError("본문 JSON 형식이 올바르지 않습니다.");
            return;
          }
        }
      } else if ((form[key] ?? "").trim()) {
        payload[key] = form[key].trim();
      }
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await contentI18nApi.save(type, id, lang, payload, nextStatus);
      setStatus(nextStatus);
      setMessage(
        nextStatus === "PUBLISHED"
          ? "게시 완료. 공개 사이트에 반영됩니다."
          : "초안으로 저장했습니다.",
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "저장 실패");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (
      id === null ||
      busy ||
      !window.confirm("이 언어의 번역을 삭제할까요? 한국어 원본은 유지됩니다.")
    )
      return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await contentI18nApi.remove(type, id, lang);
      const data = await contentI18nApi.get(type, id, lang);
      const reset: Record<string, string> = {};
      for (const item of fields[type])
        reset[item.key] =
          item.key === "content"
            ? JSON.stringify(data.source.content ?? {}, null, 2)
            : "";
      setDetail(data);
      setForm(reset);
      setIncludeJson(false);
      setStatus("MISSING");
      setMessage(
        "번역을 삭제했습니다. 공개 사이트에서는 한국어 원문을 사용합니다.",
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "삭제 실패");
    } finally {
      setBusy(false);
    }
  };

  return (
    <S.Root>
      <span className="eyebrow">CMS / INTERNATIONAL CONTENT</span>
      <h1>다국어 콘텐츠 관리</h1>
      <p className="description">
        한국어 원문은 기존 관리자 페이지에서 수정하고, 이곳에서는 EN·JP·CN·TW
        번역을 관리합니다. 초안은 외부에 표시되지 않으며, 검수 후 게시한 내용만
        적용됩니다.
      </p>
      <S.Panel>
        <S.Controls>
          <S.Field>
            콘텐츠 유형
            <select
              value={type}
              onChange={(event) => {
                setType(event.target.value as CmsType);
                setSearch("");
                setId(null);
              }}
            >
              {types.map((entry) => (
                <option key={entry.type} value={entry.type}>
                  {entry.label}
                </option>
              ))}
            </select>
          </S.Field>
          <S.Field>
            번역할 원본 선택 (최대 최근 150건)
            <select
              value={id ?? ""}
              disabled={!options.length}
              onChange={(event) => setId(Number(event.target.value))}
            >
              {options.length === 0 && (
                <option value="">등록된 원본이 없습니다</option>
              )}
              {options.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  #{entry.id} · {entry.label}
                </option>
              ))}
            </select>
          </S.Field>
          <S.Field>
            원본 검색
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void loadOptions(type, search);
              }}
              placeholder="검색어 입력 후 Enter"
            />
          </S.Field>
        </S.Controls>
      </S.Panel>
      <S.Panel>
        <S.Tabs aria-label="번역할 언어">
          {langs.map(({ lang: item, label }) => (
            <S.Tab
              key={item}
              type="button"
              $active={lang === item}
              aria-pressed={lang === item}
              onClick={() => setLang(item)}
            >
              {label}
            </S.Tab>
          ))}
        </S.Tabs>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <strong>{originalLabel || "콘텐츠를 선택해 주세요"}</strong>
            <br />
            <small>게시 전 의료 콘텐츠 번역을 검수하세요.</small>
          </div>
          <S.Status $published={status === "PUBLISHED"}>
            {status === "PUBLISHED"
              ? "게시됨"
              : status === "DRAFT"
                ? "초안"
                : "번역 미등록"}
          </S.Status>
        </div>
        {error && (
          <S.Message $error role="alert">
            {error}
          </S.Message>
        )}
        {message && <S.Message role="status">{message}</S.Message>}
        {!detail ? (
          <p>선택한 번역 데이터를 불러오는 중입니다.</p>
        ) : (
          <>
            {fields[type].map(({ key, label, long }) => (
              <S.Grid key={key} style={{ marginBottom: 18 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 10 }}>
                    KR / 원본 · {label}
                  </div>
                  <S.Source>
                    {key === "content"
                      ? JSON.stringify(detail.source.content ?? {}, null, 2)
                      : String(detail.source[key] ?? "(원본 없음)")}
                  </S.Source>
                </div>
                <div>
                  {key === "content" && (
                    <label
                      style={{
                        display: "block",
                        marginBottom: 10,
                        fontSize: 12,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={includeJson}
                        onChange={(event) =>
                          setIncludeJson(event.target.checked)
                        }
                      />{" "}
                      본문 JSON 번역 사용 (구조·이미지 주소·레이아웃 변경 불가)
                    </label>
                  )}
                  <S.Field>
                    {label} / {lang.toUpperCase()}
                    {long ? (
                      <textarea
                        className={key === "content" ? "code" : ""}
                        rows={key === "content" ? 13 : 5}
                        disabled={busy || (key === "content" && !includeJson)}
                        value={form[key] ?? ""}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            [key]: event.target.value,
                          }))
                        }
                        placeholder="미입력 시 한국어 원문을 사용합니다"
                      />
                    ) : (
                      <input
                        disabled={busy}
                        value={form[key] ?? ""}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            [key]: event.target.value,
                          }))
                        }
                        placeholder="미입력 시 한국어 원문을 사용합니다"
                      />
                    )}
                  </S.Field>
                </div>
              </S.Grid>
            ))}
            <S.Buttons>
              <S.Action
                type="button"
                $danger
                disabled={busy || status === "MISSING"}
                onClick={() => void remove()}
              >
                번역 삭제
              </S.Action>
              <S.Action
                type="button"
                disabled={busy}
                onClick={() => void save("DRAFT")}
              >
                초안 저장
              </S.Action>
              <S.Action
                type="button"
                $primary
                disabled={busy}
                onClick={() => void save("PUBLISHED")}
              >
                검수 완료 · 게시
              </S.Action>
            </S.Buttons>
          </>
        )}
      </S.Panel>
    </S.Root>
  );
}
