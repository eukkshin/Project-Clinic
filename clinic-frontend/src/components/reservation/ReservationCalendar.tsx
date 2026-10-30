"use client";
import { useEffect, useMemo, useState } from 'react';

import { getReservationAvailability } from '@/lib/reservation/api';
import * as S from '@/styles/reservation/Reservation.styles';

import type { ReservationDay } from "@/types/reservation";

const KST_OFFSET = 9 * 60 * 60 * 1000;
const kstToday = () =>
  new Date(Date.now() + KST_OFFSET).toISOString().slice(0, 10);
const monthOf = (date: string) => date.slice(0, 7);
const offsetMonth = (month: string, offset: number) => {
  const [year, mm] = month.split("-").map(Number);
  return new Date(Date.UTC(year, mm - 1 + offset, 1)).toISOString().slice(0, 7);
};
const formatDate = (date: string) =>
  date ? `${Number(date.slice(5, 7))}월 ${Number(date.slice(8, 10))}일` : "";

export interface CalendarSelection {
  date: string;
  time: string;
}
interface Props {
  selected: CalendarSelection;
  onChange: (selection: CalendarSelection) => void;
  refreshKey?: number;
  onAvailabilityChange?: (days: ReservationDay[]) => void;
}

export default function ReservationCalendar({
  selected,
  onChange,
  refreshKey = 0,
  onAvailabilityChange,
}: Props) {
  const [month, setMonth] = useState(() => monthOf(kstToday()));
  const [days, setDays] = useState<ReservationDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState("");
  const today = kstToday();
  const maxMonth = monthOf(
    new Date(Date.now() + 90 * 86400000 + KST_OFFSET)
      .toISOString()
      .slice(0, 10),
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setDays([]);
    setError("");
    getReservationAvailability(month)
      .then((result) => {
        if (active) {
          setDays(result.days);
          onAvailabilityChange?.(result.days);
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setDays([]);
          setError(
            reason instanceof Error
              ? reason.message
              : "예약 가능 시간 조회에 실패했습니다.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // onAvailabilityChange는 부모가 useCallback으로 감싸지 않아도 달력 요청에 영향이 없도록 제외합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, refreshKey, attempt]);

  const firstWeekday = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    return (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7; // 월요일 시작
  }, [month]);
  const activeDay = days.find((day) => day.date === selected.date);

  return (
    <>
      <S.CalendarShell>
        <S.CalendarHeader>
          <S.CalendarNav
            type="button"
            aria-label="이전 달"
            disabled={month <= monthOf(today)}
            onClick={() => {
              setMonth(offsetMonth(month, -1));
              onChange({ date: "", time: "" });
            }}
          >
            〈
          </S.CalendarNav>
          <strong>
            {month.slice(0, 4)}. {month.slice(5, 7)}
          </strong>
          <S.CalendarNav
            type="button"
            aria-label="다음 달"
            disabled={month >= maxMonth}
            onClick={() => {
              setMonth(offsetMonth(month, 1));
              onChange({ date: "", time: "" });
            }}
          >
            〉
          </S.CalendarNav>
        </S.CalendarHeader>
        <S.CalendarWeek>
          {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </S.CalendarWeek>
        <S.CalendarGrid aria-label={`${month} 예약 달력`}>
          {Array.from({ length: firstWeekday }, (_, i) => (
            <S.CalendarBlank key={`blank-${i}`} aria-hidden="true" />
          ))}
          {days.map((day) => (
            <S.CalendarDay
              type="button"
              key={day.date}
              $active={selected.date === day.date}
              $available={day.availableCount > 0}
              disabled={loading || day.availableCount === 0}
              aria-pressed={selected.date === day.date}
              aria-label={`${day.date}, ${day.availableCount ? `예약 가능 ${day.availableCount}개 시간` : "예약 마감 또는 휴무"}`}
              onClick={() => onChange({ date: day.date, time: "" })}
            >
              <span>{Number(day.date.slice(-2))}</span>
              <small>
                {day.slots.length === 0
                  ? "휴무"
                  : day.availableCount
                    ? `${day.availableCount}개 가능`
                    : "마감"}
              </small>
            </S.CalendarDay>
          ))}
        </S.CalendarGrid>
        <S.CalendarLegend>
          날짜를 선택하면 남은 예약 시간이 표시됩니다. 회색 날짜는 휴무 또는
          마감입니다.
        </S.CalendarLegend>
        {loading && (
          <S.FieldHint role="status">
            예약 가능한 날짜를 확인하고 있습니다...
          </S.FieldHint>
        )}
        {error && (
          <S.Message $error role="alert">
            {error}{" "}
            <button
              type="button"
              onClick={() => setAttempt((count) => count + 1)}
            >
              다시 조회
            </button>
          </S.Message>
        )}
      </S.CalendarShell>
      {activeDay && (
        <S.SlotSection>
          <S.SlotHeading>
            {formatDate(selected.date)} 예약 시간 선택
          </S.SlotHeading>
          <S.TimeGrid role="group" aria-label="예약 가능한 시간대">
            {activeDay.slots.map((slot) => (
              <S.SlotButton
                key={slot.time}
                type="button"
                $active={selected.time === slot.time}
                $status={
                  slot.available
                    ? "available"
                    : slot.reason === "booked"
                      ? "booked"
                      : slot.reason === "blocked"
                        ? "blocked"
                        : "closed"
                }
                disabled={!slot.available}
                aria-pressed={selected.time === slot.time}
                onClick={() =>
                  onChange({ date: selected.date, time: slot.time })
                }
              >
                {slot.time}
                <small>
                  {slot.available
                    ? "예약가능"
                    : slot.reason === "booked"
                      ? "예약마감"
                      : slot.reason === "blocked"
                        ? "예약불가"
                        : "접수종료"}
                </small>
              </S.SlotButton>
            ))}
          </S.TimeGrid>
          {!activeDay.slots.length && (
            <S.FieldHint>해당 날짜는 운영 시간이 없습니다.</S.FieldHint>
          )}
        </S.SlotSection>
      )}
    </>
  );
}
