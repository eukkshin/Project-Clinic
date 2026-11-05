"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiRefreshCw,
  FiSlash,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import { Popup } from "@/components/ui/Popup";
import {
  addManualReservation,
  addReservationBlock,
  cancelAdminReservation,
  getAdminReservations,
  getReservationAvailability,
  getReservationStatusHistory,
  markReminderContacted,
  removeReservationBlock,
  setReservationAttendance,
} from "@/lib/reservation/api";
import * as S from "@/styles/reservation/AdminReservation.styles";
import {
  AdminReservationData,
  AttendanceAction,
  AvailabilityCalendar,
  RESERVATION_DEPARTMENTS,
  ReservationDepartment,
  ReservationStatusHistory,
} from "@/types/reservation";

const nowKst = () =>
  new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10);

const monthShift = (month: string, offset: number) => {
  const [year, m] = month.split("-").map(Number);
  return new Date(Date.UTC(year, m - 1 + offset, 1)).toISOString().slice(0, 7);
};

interface Confirmation {
  title: string;
  message: string;
  action: () => Promise<unknown>;
  success: string;
  afterSuccess?: () => void;
}

export default function AdminReservationsPage() {
  const [month, setMonth] = useState(() => nowKst().slice(0, 7));
  const [date, setDate] = useState(() => nowKst());
  const [time, setTime] = useState("");
  const [availability, setAvailability] = useState<AvailabilityCalendar | null>(
    null,
  );
  const [adminData, setAdminData] = useState<AdminReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [department, setDepartment] = useState<ReservationDepartment>(
    RESERVATION_DEPARTMENTS[0],
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");
  const [memo, setMemo] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [attendanceReason, setAttendanceReason] = useState("");
  const [historyFor, setHistoryFor] = useState<number | null>(null);
  const [statusHistory, setStatusHistory] = useState<
    ReservationStatusHistory[]
  >([]);

  const refresh = useCallback(() => setRefreshKey((value) => value + 1), []);
  useEffect(() => {
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    Promise.all([
      getReservationAvailability(month),
      getAdminReservations(month),
    ])
      .then(([calendar, admin]) => {
        if (!alive) return;
        setAvailability(calendar);
        setAdminData(admin);
      })
      .catch((cause: unknown) => {
        if (alive)
          setError(
            cause instanceof Error
              ? cause.message
              : "목록을 조회하지 못했습니다.",
          );
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [month, refreshKey]);

  const selectedDay = availability?.days.find((day) => day.date === date);
  const selectedBookings = useMemo(
    () =>
      (adminData?.reservations ?? [])
        .filter((r) => r.slotDate === date)
        .sort((a, b) => a.slotTime.localeCompare(b.slotTime)),
    [adminData, date],
  );
  const selectedBlocks = useMemo(
    () => (adminData?.blocks ?? []).filter((b) => b.BLOCK_DATE === date),
    [adminData, date],
  );
  const blankCount = useMemo(() => {
    const [year, m] = month.split("-").map(Number);
    return (new Date(Date.UTC(year, m - 1, 1)).getUTCDay() + 6) % 7;
  }, [month]);
  const monthDisplay = `${month.slice(0, 4)}년 ${Number(month.slice(5))}월`;
  const readyReminders = (adminData?.reservations ?? []).filter(
    (r) => r.reminderState === "READY",
  ).length;
  const activeReservations = selectedBookings.filter((booking) =>
    ["예약확정", "예약대기"].includes(booking.status),
  ).length;

  async function toggleAttendanceHistory(id: number) {
    if (historyFor === id) {
      setHistoryFor(null);
      return;
    }
    try {
      const rows = await getReservationStatusHistory(id);
      setStatusHistory(rows);
      setHistoryFor(id);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "예약 판정 이력 조회 실패",
      );
    }
  }
  function askAttendance(
    bookingId: number,
    customerName: string,
    action: AttendanceAction,
  ) {
    const text = attendanceReason.trim();
    if (
      (action === "NO_SHOW" || action === "REVOKE_NO_SHOW") &&
      (text.length < 5 || text.length > 500)
    ) {
      setError("노쇼·판정 취소 시 사유를 최소 5자 이상 입력해 주세요.");
      return;
    }
    const name =
      action === "VISITED"
        ? "방문 완료"
        : action === "NO_SHOW"
          ? "노쇼 확정"
          : "노쇼 판정 취소";
    askConfirm({
      title: name,
      message: `${customerName} 님의 예약을 '${name}' 처리하시겠습니까? 이력에 담당자와 사유가 기록됩니다.`,
      action: () => setReservationAttendance(bookingId, action, text),
      success: `${name} 처리했습니다.`,
      afterSuccess: () => {
        setAttendanceReason("");
        setHistoryFor(null);
      },
    });
  }

  async function execute(operation: Confirmation) {
    if (pending) return;
    setPending(true);
    setError("");
    setMessage("");

    try {
      await operation.action();
      operation.afterSuccess?.();
      setMessage(operation.success);
      refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "작업을 처리하지 못했습니다.",
      );
    } finally {
      setPending(false);
    }
  }

  function askConfirm(options: Confirmation) {
    if (!pending) setConfirmation(options);
  }

  function confirmCurrentAction() {
    if (!confirmation || pending) return;
    const operation = confirmation;
    setConfirmation(null);
    void execute(operation);
  }

  function switchMonth(delta: number) {
    const next = monthShift(month, delta);
    setMonth(next);
    setDate(`${next}-01`);
    setTime("");
    setMessage("");
  }

  function handleBlock(fullDay: boolean) {
    if (!date || (!fullDay && !time)) return;
    const blockTime = fullDay ? "ALL" : time;
    askConfirm({
      title: "예약 차단 확인",
      message: `${date} ${fullDay ? "하루 전체" : `${time} 시간`}을 예약 불가로 설정하시겠습니까?\n확정된 예약이 있다면 차단할 수 없습니다.`,
      action: () =>
        addReservationBlock({ date, time: blockTime, reason: reason.trim() }),
      success: "예약 불가 설정이 저장되었습니다.",
    });
  }

  function handleManual(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date || !time || !name.trim() || !phone.trim()) {
      setError("날짜, 시간, 예약자 이름, 연락처를 모두 입력해 주세요.");
      return;
    }

    const payload = {
      date,
      time,
      name: name.trim(),
      phone: phone.trim(),
      userId: userId.trim() || undefined,
      memo: memo.trim(),
      department,
    };

    askConfirm({
      title: "수동 예약 등록",
      message: `${date} ${time}에 ${payload.name} 님의 방문 예약을 확정하시겠습니까?`,
      action: () => addManualReservation(payload),
      success: "예약자를 추가하고 예약을 확정했습니다.",
      afterSuccess: () => {
        setName("");
        setPhone("");
        setUserId("");
        setMemo("");
        setTime("");
      },
    });
  }

  return (
    <>
      <S.Page>
        <S.Top className="admin-page-header">
          <div className="admin-page-title-block">
            <S.Eyebrow className="admin-page-eyebrow">
              OPERATIONS / RESERVATIONS
            </S.Eyebrow>
            <S.PageTitle>방문 예약 관리</S.PageTitle>
            <S.PageDescription className="admin-page-description">
              달력으로 예약 현황을 확인하고 예약 불가 설정, 수동 등록, 강제
              취소를 관리합니다.
            </S.PageDescription>
          </div>
          <S.HeaderActions>
            <S.Counter>
              이번 달 예약 {adminData?.reservations.length ?? 0}건 · 하루 전
              안내 대기 {readyReminders}건
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
        {message && <S.Banner role="status">{message}</S.Banner>}
        {loading && (
          <S.Banner role="status">
            달력과 예약 내역을 불러오는 중입니다...
          </S.Banner>
        )}

        <S.Layout className="admin-page-grid">
          {/* 왼쪽: 예약 달력과 시간대 선택 */}
          <S.Column className="admin-editor-column">
            <S.Panel className="admin-panel">
              <S.PanelHead className="admin-panel-head">
                <S.PanelTitle>예약 캘린더</S.PanelTitle>
                <S.Button
                  type="button"
                  $compact
                  onClick={refresh}
                  disabled={loading || pending}
                >
                  <FiRefreshCw size={14} aria-hidden="true" /> 새로고침
                </S.Button>
              </S.PanelHead>
              <S.PanelBody className="admin-panel-body">
                <S.MonthControl>
                  <S.Button
                    type="button"
                    $compact
                    onClick={() => switchMonth(-1)}
                    aria-label="이전 달"
                  >
                    <FiChevronLeft size={17} /> 이전
                  </S.Button>
                  <S.MonthLabel aria-live="polite">{monthDisplay}</S.MonthLabel>
                  <S.Button
                    type="button"
                    $compact
                    onClick={() => switchMonth(1)}
                    aria-label="다음 달"
                  >
                    다음 <FiChevronRight size={17} />
                  </S.Button>
                </S.MonthControl>

                <S.WeekGrid aria-hidden="true">
                  {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                    <S.WeekName key={day}>{day}</S.WeekName>
                  ))}
                </S.WeekGrid>
                <S.CalendarGrid aria-label="관리자 예약 달력">
                  {Array.from({ length: blankCount }, (_, index) => (
                    <div key={`blank-${index}`} />
                  ))}
                  {availability?.days.map((day) => (
                    <S.CalendarDay
                      key={day.date}
                      type="button"
                      $active={date === day.date}
                      $unavailable={day.availableCount === 0}
                      aria-pressed={date === day.date}
                      aria-label={`${day.date}, ${day.availableCount ? `예약 가능 ${day.availableCount}개` : "예약 불가"}`}
                      onClick={() => {
                        setDate(day.date);
                        setTime("");
                        setMessage("");
                      }}
                    >
                      {Number(day.date.slice(-2))}
                      <small>
                        {day.availableCount
                          ? `${day.availableCount}개 가능`
                          : "마감/불가"}
                      </small>
                    </S.CalendarDay>
                  ))}
                </S.CalendarGrid>
                <S.Legend>
                  <S.LegendItem $color="#638974">예약 가능</S.LegendItem>
                  <S.LegendItem $color="#abb9ae">마감/종료</S.LegendItem>
                  <S.LegendItem $color="#b45e58">관리자 차단</S.LegendItem>
                </S.Legend>

                <S.Divider />
                <S.SectionTitle>{date} · 시간대 선택</S.SectionTitle>
                <S.Description>
                  시간대를 누르면 차단하거나 수동 예약할 시간을 선택할 수
                  있습니다. 마감된 시간은 기존 예약을 먼저 취소해야 합니다.
                </S.Description>
                <S.TimeGrid>
                  {selectedDay?.slots.map((slot) => (
                    <S.TimeButton
                      key={slot.time}
                      type="button"
                      $active={time === slot.time}
                      $available={slot.available}
                      $reason={slot.reason}
                      aria-pressed={time === slot.time}
                      onClick={() => setTime(slot.time)}
                    >
                      {slot.time}
                      <small>
                        {slot.available
                          ? "예약 가능"
                          : slot.reason === "booked"
                            ? "예약 마감"
                            : slot.reason === "blocked"
                              ? "차단됨"
                              : "접수 종료"}
                      </small>
                    </S.TimeButton>
                  ))}
                </S.TimeGrid>
                {!selectedDay?.slots.length && (
                  <S.Description>
                    이 날짜에는 설정된 예약 가능 시간이 없습니다.
                  </S.Description>
                )}
              </S.PanelBody>
            </S.Panel>

            {/* 왼쪽 아래: 예약 불가 설정 */}
            <S.Panel className="admin-panel">
              <S.PanelHead className="admin-panel-head">
                <S.PanelTitle>예약 불가 설정</S.PanelTitle>
                <S.Counter>{selectedBlocks.length}건 차단</S.Counter>
              </S.PanelHead>
              <S.PanelBody className="admin-panel-body">
                <S.Description>
                  휴진일은 하루 전체 차단, 개인 일정은 특정 시간만 차단할 수
                  있습니다.
                </S.Description>
                <S.Label
                  className="admin-form-field"
                  htmlFor="reservation-block-reason"
                >
                  차단 사유 (선택)
                  <S.Input
                    id="reservation-block-reason"
                    maxLength={200}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="예: 휴진 / 원장님 일정"
                  />
                </S.Label>
                <S.ControlRow>
                  <S.Button
                    type="button"
                    $danger
                    disabled={pending || !date}
                    onClick={() => handleBlock(true)}
                  >
                    <FiSlash size={15} aria-hidden="true" /> 하루 전체 차단
                  </S.Button>
                  <S.Button
                    type="button"
                    $danger
                    disabled={pending || !date || !time}
                    onClick={() => handleBlock(false)}
                  >
                    <FiSlash size={15} aria-hidden="true" />{" "}
                    {time || "선택 시간"} 차단
                  </S.Button>
                </S.ControlRow>
                <S.Divider />
                <S.SectionTitle>현재 차단 목록</S.SectionTitle>
                {selectedBlocks.length === 0 ? (
                  <S.Description>
                    선택 날짜에 설정된 차단 내역이 없습니다.
                  </S.Description>
                ) : (
                  <S.BlockList>
                    {selectedBlocks.map((block) => (
                      <S.BlockItem key={block.ID}>
                        <div>
                          <strong>
                            {block.BLOCK_TIME === "ALL"
                              ? "하루 전체"
                              : block.BLOCK_TIME}{" "}
                            예약 불가
                          </strong>
                          <small>{block.REASON || "사유 없음"}</small>
                        </div>
                        <S.Button
                          type="button"
                          $compact
                          disabled={pending}
                          onClick={() =>
                            askConfirm({
                              title: "예약 차단 해제",
                              message: `${date} ${block.BLOCK_TIME === "ALL" ? "하루 전체" : block.BLOCK_TIME} 차단을 해제하시겠습니까?`,
                              action: () => removeReservationBlock(block.ID),
                              success: "차단을 해제했습니다.",
                            })
                          }
                        >
                          <FiX size={14} aria-hidden="true" /> 해제
                        </S.Button>
                      </S.BlockItem>
                    ))}
                  </S.BlockList>
                )}
              </S.PanelBody>
            </S.Panel>
          </S.Column>

          {/* 오른쪽: 예약 목록과 수동 추가 */}
          <S.Column className="admin-record-column">
            <S.Panel className="admin-panel">
              <S.PanelHead className="admin-panel-head">
                <S.PanelTitle>{date} 예약자 현황</S.PanelTitle>
                <S.Counter>활성 예약 {activeReservations}건</S.Counter>
              </S.PanelHead>
              <S.PanelBody
                className="admin-panel-body"
                style={{ paddingBottom: 10 }}
              >
                <S.Description>
                  방문 여부는 직원이 실제로 확인하고 기록해 주세요. 예약시간
                  경과만으로 노쇼가 자동 확정되지는 않습니다.
                </S.Description>
                <S.Label
                  className="admin-form-field"
                  htmlFor="attendance-reason"
                >
                  방문/노쇼 처리 사유 (노쇼 또는 판정 취소는 5자 이상 필수)
                  <S.Textarea
                    id="attendance-reason"
                    value={attendanceReason}
                    maxLength={500}
                    placeholder="예: 예약시간 30분 경과, 연락 2회 시도 후 미방문 확인"
                    onChange={(e) => setAttendanceReason(e.target.value)}
                  />
                </S.Label>
              </S.PanelBody>
              {selectedBookings.length === 0 ? (
                <S.EmptyState>
                  선택한 날짜에 등록된 예약 내역이 없습니다.
                </S.EmptyState>
              ) : (
                <S.TableWrapper className="admin-table-scroll">
                  <S.Table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>시간</th>
                        <th>예약자 / 연락처</th>
                        <th>상담 분야</th>
                        <th>상태</th>
                        <th>관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            <strong>{booking.slotTime}</strong>
                          </td>
                          <td>
                            <S.PersonCell>
                              <strong>{booking.name}</strong>
                              <small>{booking.phone || "연락처 미기재"}</small>
                              {booking.memo && (
                                <small>요청: {booking.memo}</small>
                              )}
                              {(booking.noShowCount ?? 0) >= 2 && (
                                <small
                                  style={{ color: "#ad5951", fontWeight: 700 }}
                                >
                                  최근 1년 노쇼 {booking.noShowCount}회 · 관리자
                                  검토
                                </small>
                              )}
                            </S.PersonCell>
                          </td>
                          <td>{booking.department}</td>
                          <td>
                            <S.StatusBadge $status={booking.status}>
                              {booking.status}
                            </S.StatusBadge>
                            <S.SourceText>
                              {booking.source === "MANUAL"
                                ? "관리자 등록"
                                : "회원 예약"}
                              {booking.visitConfirmedAt
                                ? " · 방문 예정 확인됨"
                                : " · 고객 미확인"}
                            </S.SourceText>
                            {booking.reminderState === "PENDING" && (
                              <S.SourceText>
                                방문 전날 안내 예정 ·{" "}
                                {booking.reminderDueAtKst?.replace(" ", " ")}{" "}
                                (KST)
                              </S.SourceText>
                            )}
                            {booking.reminderState === "READY" && (
                              <S.SourceText
                                style={{ color: "#a45a2a", fontWeight: 700 }}
                              >
                                하루 전 안내 대기 · 아직 문자 미발송
                              </S.SourceText>
                            )}
                            {booking.reminderState === "CONTACTED" && (
                              <S.SourceText>직원 직접 안내 완료</S.SourceText>
                            )}
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 5,
                              }}
                            >
                              {["예약대기", "예약확정"].includes(
                                booking.status,
                              ) &&
                                Date.now() >=
                                  new Date(
                                    `${booking.slotDate}T${booking.slotTime}:00+09:00`,
                                  ).getTime() -
                                    2 * 60 * 60 * 1000 && (
                                  <S.Button
                                    type="button"
                                    $compact
                                    disabled={pending}
                                    onClick={() =>
                                      askAttendance(
                                        booking.id,
                                        booking.name,
                                        "VISITED",
                                      )
                                    }
                                  >
                                    방문완료
                                  </S.Button>
                                )}
                              {["예약대기", "예약확정"].includes(
                                booking.status,
                              ) &&
                                Date.now() >=
                                  new Date(
                                    `${booking.slotDate}T${booking.slotTime}:00+09:00`,
                                  ).getTime() +
                                    30 * 60 * 1000 && (
                                  <S.Button
                                    type="button"
                                    $compact
                                    $danger
                                    disabled={pending}
                                    onClick={() =>
                                      askAttendance(
                                        booking.id,
                                        booking.name,
                                        "NO_SHOW",
                                      )
                                    }
                                  >
                                    노쇼
                                  </S.Button>
                                )}
                              {booking.status === "노쇼" && (
                                <S.Button
                                  type="button"
                                  $compact
                                  disabled={pending}
                                  onClick={() =>
                                    askAttendance(
                                      booking.id,
                                      booking.name,
                                      "REVOKE_NO_SHOW",
                                    )
                                  }
                                >
                                  노쇼 판정 취소
                                </S.Button>
                              )}
                              {booking.reminderState === "READY" && (
                                <S.Button
                                  type="button"
                                  $compact
                                  disabled={pending}
                                  onClick={() =>
                                    askConfirm({
                                      title: "직접 안내 완료 기록",
                                      message: `${booking.name} 님에게 전화·문자 등으로 실제 안내한 경우에만 완료 처리하세요. 시스템은 메시지를 자동 발송하지 않습니다.`,
                                      action: () =>
                                        markReminderContacted(booking.id),
                                      success: "직접 안내 완료로 기록했습니다.",
                                    })
                                  }
                                >
                                  직접 안내 완료
                                </S.Button>
                              )}
                              <S.Button
                                type="button"
                                $compact
                                disabled={pending}
                                onClick={() =>
                                  void toggleAttendanceHistory(booking.id)
                                }
                              >
                                이력
                              </S.Button>
                            </div>
                            {["예약대기", "예약확정"].includes(
                              booking.status,
                            ) ? (
                              <S.Button
                                type="button"
                                $danger
                                $compact
                                disabled={pending}
                                onClick={() =>
                                  askConfirm({
                                    title: "예약 강제 취소",
                                    message: `${booking.name} 님의 ${booking.slotDate} ${booking.slotTime} 예약을 강제 취소하시겠습니까?`,
                                    action: () =>
                                      cancelAdminReservation(booking.id),
                                    success: "예약을 강제 취소했습니다.",
                                  })
                                }
                              >
                                <FiTrash2 size={14} aria-hidden="true" /> 취소
                              </S.Button>
                            ) : (
                              <span aria-label="처리할 작업 없음">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </S.Table>
                </S.TableWrapper>
              )}
              {historyFor !== null && (
                <S.PanelBody
                  className="admin-panel-body"
                  style={{ borderTop: "1px solid #e4eae5" }}
                >
                  <S.SectionTitle>예약 #{historyFor} 처리 이력</S.SectionTitle>
                  {statusHistory.length === 0 ? (
                    <S.Description>
                      방문/노쇼 처리 이력이 없습니다.
                    </S.Description>
                  ) : (
                    statusHistory.map((item) => (
                      <S.Description
                        key={item.id}
                        style={{ marginTop: 9, whiteSpace: "pre-wrap" }}
                      >
                        {new Date(item.createdAt).toLocaleString("ko-KR")} ·{" "}
                        {item.adminId}
                        <br />
                        {item.from} → {item.to} · {item.reason}
                      </S.Description>
                    ))
                  )}
                </S.PanelBody>
              )}
            </S.Panel>

            <S.Panel className="admin-panel">
              <S.PanelHead className="admin-panel-head">
                <S.PanelTitle>예약자 수동 추가</S.PanelTitle>
              </S.PanelHead>
              <S.PanelBody className="admin-panel-body">
                <S.Description>
                  달력에서 날짜와 시간을 선택한 뒤 등록하면 즉시 예약이
                  확정됩니다. 회원 아이디를 입력하면 해당 회원 마이페이지에도
                  연결됩니다.
                </S.Description>
                <S.Fields onSubmit={handleManual}>
                  <S.FieldRow>
                    <S.Label
                      className="admin-form-field"
                      htmlFor="manual-reservation-date"
                    >
                      선택 날짜
                      <S.Input
                        id="manual-reservation-date"
                        value={date}
                        readOnly
                      />
                    </S.Label>
                    <S.Label
                      className="admin-form-field"
                      htmlFor="manual-reservation-time"
                    >
                      선택 시간
                      <S.Input
                        id="manual-reservation-time"
                        value={time || "달력에서 시간을 선택하세요"}
                        readOnly
                      />
                    </S.Label>
                  </S.FieldRow>
                  <S.FieldRow>
                    <S.Label
                      className="admin-form-field"
                      htmlFor="manual-reservation-name"
                    >
                      예약자 이름
                      <S.Input
                        id="manual-reservation-name"
                        required
                        maxLength={80}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="예약자 이름"
                      />
                    </S.Label>
                    <S.Label
                      className="admin-form-field"
                      htmlFor="manual-reservation-phone"
                    >
                      연락처
                      <S.Input
                        id="manual-reservation-phone"
                        required
                        type="tel"
                        maxLength={30}
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="010-0000-0000"
                      />
                    </S.Label>
                  </S.FieldRow>
                  <S.FieldRow>
                    <S.Label
                      className="admin-form-field"
                      htmlFor="manual-reservation-user-id"
                    >
                      회원 아이디 (선택)
                      <S.Input
                        id="manual-reservation-user-id"
                        maxLength={50}
                        value={userId}
                        onChange={(event) => setUserId(event.target.value)}
                        placeholder="회원 연동 시 입력"
                      />
                    </S.Label>
                    <S.Label
                      className="admin-form-field"
                      htmlFor="manual-reservation-department"
                    >
                      상담 분야
                      <S.Select
                        id="manual-reservation-department"
                        value={department}
                        onChange={(event) =>
                          setDepartment(
                            event.target.value as ReservationDepartment,
                          )
                        }
                      >
                        {RESERVATION_DEPARTMENTS.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </S.Select>
                    </S.Label>
                  </S.FieldRow>
                  <S.Label
                    className="admin-form-field"
                    htmlFor="manual-reservation-memo"
                  >
                    요청사항 (선택)
                    <S.Textarea
                      id="manual-reservation-memo"
                      maxLength={1000}
                      value={memo}
                      onChange={(event) => setMemo(event.target.value)}
                      placeholder="전달 사항을 입력하세요"
                    />
                  </S.Label>
                  <S.FormActions>
                    <S.Button
                      type="submit"
                      $primary
                      disabled={pending || !date || !time}
                      className="admin-primary-action"
                    >
                      <FiPlus size={16} aria-hidden="true" />{" "}
                      {pending ? "처리 중..." : "예약자 추가 및 즉시 확정"}
                    </S.Button>
                  </S.FormActions>
                </S.Fields>
              </S.PanelBody>
            </S.Panel>
          </S.Column>
        </S.Layout>
      </S.Page>

      <Popup
        isOpen={confirmation !== null}
        title={confirmation?.title || "확인"}
        onClose={() => setConfirmation(null)}
        onConfirm={confirmCurrentAction}
      >
        {confirmation?.message || ""}
      </Popup>
    </>
  );
}
