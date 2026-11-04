"use client";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { getReservationAvailability } from "@/lib/reservation/api";
import * as S from "@/styles/reservation/Reservation.styles";

import type { ReservationDay } from "@/types/reservation";

const KST_OFFSET = 9 * 60 * 60 * 1000;
const kstToday = () =>
  new Date(Date.now() + KST_OFFSET).toISOString().slice(0, 10);
const monthOf = (date: string) => date.slice(0, 7);
const offsetMonth = (month: string, offset: number) => {
  const [year, mm] = month.split("-").map(Number);
  return new Date(Date.UTC(year, mm - 1 + offset, 1)).toISOString().slice(0, 7);
};
// Display format changes by locale; backend dates stay in YYYY-MM-DD.
const displayLocales: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
};
const formatDate = (date: string, locale: string) =>
  date
    ? new Intl.DateTimeFormat(displayLocales[locale] ?? "ko-KR", {
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${date}T00:00:00Z`))
    : "";

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
  const t = useTranslations("Reservation");
  const locale = useLocale();
  const weekdays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = new Date(Date.UTC(2024, 0, 1 + index)); // Monday first
        return new Intl.DateTimeFormat(displayLocales[locale] ?? "ko-KR", {
          weekday: "short",
          timeZone: "UTC",
        }).format(date);
      }),
    [locale],
  );
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
            reason instanceof Error ? reason.message : t("availabilityFailed"),
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
  }, [month, refreshKey, attempt, t]);

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
            aria-label={t("prevMonth")}
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
            aria-label={t("nextMonth")}
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
          {weekdays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </S.CalendarWeek>
        <S.CalendarGrid aria-label={t("calendarAria", { month })}>
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
              aria-label={`${day.date}, ${day.availableCount ? t("availableTimes", { count: day.availableCount }) : t("fullyBookedAria")}`}
              onClick={() => onChange({ date: day.date, time: "" })}
            >
              <span>{Number(day.date.slice(-2))}</span>
              <small>
                {day.slots.length === 0
                  ? t("closed")
                  : day.availableCount
                    ? t("availableCount", { count: day.availableCount })
                    : t("full")}
              </small>
            </S.CalendarDay>
          ))}
        </S.CalendarGrid>
        <S.CalendarLegend>{t("calendarLegend")}</S.CalendarLegend>
        {loading && (
          <S.FieldHint role="status">{t("loadingAvailability")}</S.FieldHint>
        )}
        {error && (
          <S.Message $error role="alert">
            {error}{" "}
            <button
              type="button"
              onClick={() => setAttempt((count) => count + 1)}
            >
              {t("reload")}
            </button>
          </S.Message>
        )}
      </S.CalendarShell>
      {activeDay && (
        <S.SlotSection>
          <S.SlotHeading>
            {t("selectTime", { date: formatDate(selected.date, locale) })}
          </S.SlotHeading>
          <S.TimeGrid role="group" aria-label={t("timeGroup")}>
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
                    ? t("slotAvailable")
                    : slot.reason === "booked"
                      ? t("slotBooked")
                      : slot.reason === "blocked"
                        ? t("slotBlocked")
                        : t("slotClosed")}
                </small>
              </S.SlotButton>
            ))}
          </S.TimeGrid>
          {!activeDay.slots.length && <S.FieldHint>{t("noHours")}</S.FieldHint>}
        </S.SlotSection>
      )}
    </>
  );
}
