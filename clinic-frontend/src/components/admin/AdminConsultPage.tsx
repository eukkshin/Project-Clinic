"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiRefreshCw, FiTrash2 } from "react-icons/fi";

import { Popup } from "@/components/ui/Popup";
import {
  deleteAdminConsult,
  fetchAdminConsults,
  getAdminConsultHistory,
  saveAdminConsultActivity,
  saveAdminConsultReply,
  updateAdminConsultStatus,
} from "@/lib/consultation/api";
import * as S from "@/styles/consultation/AdminConsult.styles";

import type {
  ConsultActivity,
  ConsultRecord,
  ConsultStatus,
} from "@/types/consultation";
type Filter = "전체" | ConsultStatus;
const FILTERS: Filter[] = ["전체", "대기중", "상담중", "상담완료"];
const STATUSES: ConsultStatus[] = ["대기중", "상담중", "상담완료"];

function dateLabel(date: string) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleString("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

export default function AdminConsultPage() {
  const [rows, setRows] = useState<ConsultRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState<Filter>("전체");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [revision, setRevision] = useState(0);
  const [reply, setReply] = useState("");
  const [note, setNote] = useState("");
  const [noteKind, setNoteKind] = useState<
    "CALL_ATTEMPT" | "CALL_COMPLETED" | "INTERNAL_NOTE"
  >("CALL_ATTEMPT");
  const [history, setHistory] = useState<ConsultActivity[]>([]);

  const refresh = useCallback(() => setRevision((count) => count + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetchAdminConsults(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setRows(result);
        setSelectedId((current) =>
          current !== null && result.some((item) => item.id === current)
            ? current
            : (result[0]?.id ?? null),
        );
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            cause instanceof Error
              ? cause.message
              : "상담 목록을 불러오지 못했습니다.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [revision]);

  const counts = useMemo<Record<Filter, number>>(
    () => ({
      전체: rows.length,
      대기중: rows.filter((row) => row.status === "대기중").length,
      상담중: rows.filter((row) => row.status === "상담중").length,
      상담완료: rows.filter((row) => row.status === "상담완료").length,
    }),
    [rows],
  );

  const filtered = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("ko-KR");
    return rows.filter(
      (row) =>
        (filter === "전체" || row.status === filter) &&
        (!keyword ||
          [
            row.name,
            row.phone,
            row.department,
            row.title,
            row.receiptNo,
            String(row.id),
          ].some((value) =>
            value.toLocaleLowerCase("ko-KR").includes(keyword),
          )),
    );
  }, [rows, filter, query]);

  const selected =
    filtered.find((row) => row.id === selectedId) ?? filtered[0] ?? null;

  useEffect(() => {
    setReply(selected?.answer || "");
    setNote("");
    if (!selected?.id) {
      setHistory([]);
      return;
    }
    let active = true;
    getAdminConsultHistory(selected.id)
      .then((data) => {
        if (active) setHistory(data);
      })
      .catch(() => {
        if (active) setHistory([]);
      });
    return () => {
      active = false;
    };
  }, [selected?.id]);

  async function saveReply() {
    if (!selected || busy || reply.trim().length < 10) return;
    const id = selected.id;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await saveAdminConsultReply(id, reply.trim());
      setRows((items) =>
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                answer: reply.trim(),
                status: "상담완료",
                answeredAt: new Date().toISOString(),
              }
            : item,
        ),
      );
      setHistory(await getAdminConsultHistory(id));
      setNotice(
        "답변을 저장했어. 비회원은 접수번호와 조회코드로 확인할 수 있어.",
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "답변 저장 실패");
    } finally {
      setBusy(false);
    }
  }
  async function saveNote() {
    if (!selected || busy || note.trim().length < 2) return;
    const id = selected.id;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await saveAdminConsultActivity(id, noteKind, note.trim());
      if (noteKind === "CALL_COMPLETED")
        setRows((items) =>
          items.map((item) =>
            item.id === id ? { ...item, status: "상담완료" } : item,
          ),
        );
      else if (noteKind === "CALL_ATTEMPT")
        setRows((items) =>
          items.map((item) =>
            item.id === id && item.status === "대기중"
              ? { ...item, status: "상담중" }
              : item,
          ),
        );
      setNote("");
      setHistory(await getAdminConsultHistory(id));
      setNotice("내부 처리 기록을 저장했어.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "기록 저장 실패");
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(status: ConsultStatus) {
    if (!selected || busy || selected.status === status) return;
    const targetId = selected.id;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await updateAdminConsultStatus(targetId, status);
      setRows((items) =>
        items.map((item) =>
          item.id === targetId ? { ...item, status } : item,
        ),
      );
      setNotice("상담 처리 상태가 변경되었습니다.");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "상태를 변경하지 못했습니다.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (confirmId === null || busy) return;
    const targetId = confirmId;
    setConfirmId(null);
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await deleteAdminConsult(targetId);
      setRows((items) => items.filter((item) => item.id !== targetId));
      setSelectedId((current) => (current === targetId ? null : current));
      setNotice("상담 내역이 삭제되었습니다.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "상담 내역을 삭제하지 못했습니다.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <S.Page>
        <S.Top className="admin-page-header">
          <div className="admin-page-title-block">
            <S.Eyebrow className="admin-page-eyebrow">
              OPERATIONS / CONSULTATION
            </S.Eyebrow>
            <S.PageTitle>상담 관리</S.PageTitle>
            <S.PageDescription className="admin-page-description">
              비회원 상담 접수 내용을 확인하고 상담 진행 상태를 관리합니다.
            </S.PageDescription>
          </div>
          <S.HeaderActions>
            <S.Counter>
              전체 {counts.전체}건 · 대기 {counts.대기중}건
            </S.Counter>
            <S.BackLink as={Link} href="/admin">
              <FiArrowLeft size={14} aria-hidden="true" /> 관리자 홈
            </S.BackLink>
          </S.HeaderActions>
        </S.Top>

        {error && (
          <S.Banner $error role="alert">
            {error}
          </S.Banner>
        )}
        {notice && <S.Banner role="status">{notice}</S.Banner>}

        <S.Toolbar>
          <S.FilterGroup aria-label="상담 상태 필터">
            {FILTERS.map((item) => (
              <S.FilterButton
                key={item}
                type="button"
                $active={filter === item}
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
              >
                {item} <span>{counts[item]}</span>
              </S.FilterButton>
            ))}
          </S.FilterGroup>
          <S.ToolbarRight>
            <S.Search
              aria-label="상담 내역 검색"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="이름 · 연락처 · 제목 검색"
            />
            <S.Button
              type="button"
              onClick={refresh}
              disabled={loading || busy}
            >
              <FiRefreshCw size={14} aria-hidden="true" /> 새로고침
            </S.Button>
          </S.ToolbarRight>
        </S.Toolbar>

        <S.Layout className="admin-page-grid">
          <S.Panel className="admin-panel">
            <S.PanelHead className="admin-panel-head">
              <S.PanelTitle>상담 접수 목록</S.PanelTitle>
              <S.PanelCount>{filtered.length}건</S.PanelCount>
            </S.PanelHead>
            {loading ? (
              <S.Empty>상담 내역을 불러오는 중입니다.</S.Empty>
            ) : filtered.length === 0 ? (
              <S.Empty>조건에 맞는 상담 내역이 없습니다.</S.Empty>
            ) : (
              <S.TableWrapper className="admin-table-scroll">
                <S.Table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>상담 제목</th>
                      <th>신청자</th>
                      <th>접수일</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <S.TableRow
                        key={row.id}
                        $active={row.id === selected?.id}
                      >
                        <td>
                          <S.SelectRecord
                            type="button"
                            aria-pressed={row.id === selected?.id}
                            onClick={() => setSelectedId(row.id)}
                          >
                            <strong>{row.title}</strong>
                            <small>
                              {row.department} · {row.receiptNo}
                            </small>
                          </S.SelectRecord>
                        </td>
                        <td>
                          <S.Person>
                            <strong>{row.name}</strong>
                            <small>{row.phone}</small>
                          </S.Person>
                        </td>
                        <td>
                          <S.DateText>{dateLabel(row.createdAt)}</S.DateText>
                        </td>
                        <td>
                          <S.StatusBadge $status={row.status}>
                            {row.status}
                          </S.StatusBadge>
                        </td>
                      </S.TableRow>
                    ))}
                  </tbody>
                </S.Table>
              </S.TableWrapper>
            )}
          </S.Panel>

          <S.Panel className="admin-panel">
            <S.PanelHead className="admin-panel-head">
              <S.PanelTitle>상담 상세 및 처리</S.PanelTitle>
              <S.PanelCount>
                {selected ? selected.receiptNo : "선택된 상담 없음"}
              </S.PanelCount>
            </S.PanelHead>
            {selected ? (
              <S.PanelBody className="admin-panel-body">
                <S.DetailHeader>
                  <S.StatusBadge $status={selected.status}>
                    {selected.status}
                  </S.StatusBadge>
                  <S.DetailTitle>{selected.title}</S.DetailTitle>
                </S.DetailHeader>
                <S.DetailList>
                  <div>
                    <dt>접수일시</dt>
                    <dd>{dateLabel(selected.createdAt)}</dd>
                  </div>
                  <div>
                    <dt>신청자</dt>
                    <dd>
                      {selected.name}{" "}
                      {selected.userId && selected.userId !== "비회원"
                        ? `(${selected.userId})`
                        : "(비회원)"}
                    </dd>
                  </div>
                  <div>
                    <dt>연락처</dt>
                    <dd>
                      <a href={`tel:${selected.phone.replace(/[^\d+]/g, "")}`}>
                        {selected.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>관심 시술</dt>
                    <dd>{selected.department}</dd>
                  </div>
                </S.DetailList>
                <S.Description>
                  <strong>상담 내용</strong>
                  <p>{selected.content}</p>
                </S.Description>
                <S.EditorSection>
                  <h4>고객용 접수번호</h4>
                  <p>{selected.receiptNo}</p>
                  {selected.assignedTo && (
                    <p>담당 관리자: {selected.assignedTo}</p>
                  )}
                </S.EditorSection>
                <S.ActionLabel>처리 상태 변경</S.ActionLabel>
                <S.ActionRow>
                  {STATUSES.map((status) => (
                    <S.Button
                      key={status}
                      type="button"
                      $primary={selected.status === status}
                      disabled={busy || selected.status === status}
                      onClick={() => void changeStatus(status)}
                    >
                      {status}
                    </S.Button>
                  ))}
                </S.ActionRow>
                <S.EditorSection>
                  <h4>고객에게 보낼 답변</h4>
                  <p>
                    일반 상담 고객은 접수번호와 비밀 조회코드를 입력해 답변을
                    확인. 퀵상담은 전화 연락 기록으로 처리
                  </p>
                  <S.EditorTextArea
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder="고객에게 안내할 답변을 입력하세요."
                    maxLength={3000}
                    aria-label="상담 답변"
                  />
                  <S.ActionRow style={{ marginTop: 10 }}>
                    <S.Button
                      type="button"
                      $primary
                      disabled={busy || reply.trim().length < 10}
                      onClick={() => void saveReply()}
                    >
                      답변 저장 및 상담완료
                    </S.Button>
                  </S.ActionRow>
                </S.EditorSection>
                <S.EditorSection>
                  <h4>내부 연락 기록·메모</h4>
                  <p>내부 기록은 고객의 답변 조회 화면에 나타나지 않습니다.</p>
                  <S.EditorSelect
                    aria-label="연락 기록 유형"
                    value={noteKind}
                    onChange={(event) =>
                      setNoteKind(event.target.value as typeof noteKind)
                    }
                  >
                    <option value="CALL_ATTEMPT">전화 시도</option>
                    <option value="CALL_COMPLETED">전화 상담 완료</option>
                    <option value="INTERNAL_NOTE">내부 메모</option>
                  </S.EditorSelect>
                  <S.EditorTextArea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="연락 여부, 다음 연락 예정시간 등을 기록하세요."
                    maxLength={1000}
                    aria-label="내부 메모"
                  />
                  <S.ActionRow style={{ marginTop: 10 }}>
                    <S.Button
                      type="button"
                      disabled={busy || note.trim().length < 2}
                      onClick={() => void saveNote()}
                    >
                      처리 기록 저장
                    </S.Button>
                  </S.ActionRow>
                </S.EditorSection>
                <S.EditorSection>
                  <h4>상담 처리 이력</h4>
                  {history.length === 0 ? (
                    <p>저장된 이력이 없습니다.</p>
                  ) : (
                    <S.HistoryList>
                      {history.map((item) => (
                        <li key={item.id}>
                          <small>
                            {dateLabel(item.createdAt)} · {item.adminId} ·{" "}
                            {item.kind}
                          </small>
                          <p>{item.text}</p>
                        </li>
                      ))}
                    </S.HistoryList>
                  )}
                </S.EditorSection>
                <S.Danger
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirmId(selected.id)}
                >
                  <FiTrash2 size={14} aria-hidden="true" /> 상담 내역 삭제
                </S.Danger>
              </S.PanelBody>
            ) : (
              <S.Empty>왼쪽에서 상담 내역을 선택해 주세요.</S.Empty>
            )}
          </S.Panel>
        </S.Layout>
      </S.Page>
      <Popup
        isOpen={confirmId !== null}
        title="상담 삭제 확인"
        onClose={() => setConfirmId(null)}
        onConfirm={() => void remove()}
      >
        상담 내역을 삭제하시겠습니까? 삭제한 내역은 복구할 수 없습니다.
      </Popup>
    </>
  );
}
