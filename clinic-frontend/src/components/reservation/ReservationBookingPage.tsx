"use client";

import Link from 'next/link';
import { FormEvent, useState } from 'react';

import { useMyPageData } from '@/components/mypage/useMyPageData';
import { createReservation } from '@/lib/reservation/api';
import * as S from '@/styles/reservation/Reservation.styles';
import {
    RESERVATION_DEPARTMENTS, ReservationDepartment, ReservationResponse
} from '@/types/reservation';

import ReservationCalendar, { CalendarSelection } from './ReservationCalendar';

import type { MyProfile } from "@/types/mypage";

export default function ReservationBookingPage() {
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
    retry,
  } = useMyPageData<MyProfile>("me");
  const [department, setDepartment] = useState<ReservationDepartment | "">("");
  const [selection, setSelection] = useState<CalendarSelection>({
    date: "",
    time: "",
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [memo, setMemo] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState<ReservationResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setError("");
    if (
      !profile ||
      !department ||
      !selection.date ||
      !selection.time ||
      !consent
    ) {
      setError(
        "회원 정보, 상담 분야, 예약 시간, 안내 사항 동의를 확인해 주세요.",
      );
      return;
    }
    setSubmitting(true);
    try {
      const result = await createReservation({
        department,
        date: selection.date,
        time: selection.time,
        memo: memo.trim(),
      });
      setSubmitted(result);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "예약을 완료하지 못했습니다.",
      );
      // 다른 사용자가 방금 예약한 경우 남은 시간 목록을 즉시 갱신합니다.
      setSelection({ date: selection.date, time: "" });
      setRefreshKey((value) => value + 1);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setSubmitted(null);
    setError("");
    setMemo("");
    setDepartment("");
    setSelection({ date: "", time: "" });
    setConsent(false);
    setRefreshKey((value) => value + 1);
  }
  return (
    <S.Page>
      <S.Hero>
        <S.Eyebrow>AHNS · PRIVATE RESERVATION</S.Eyebrow>
        <S.HeroTitle>
          Visit <em>Reservation.</em>
        </S.HeroTitle>
        <S.HeroSub>
          원하시는 날짜와 빈 시간대를 직접 선택하세요.
          <br />
          예약 가능 시간에 신청하면 즉시 확정됩니다.
        </S.HeroSub>
      </S.Hero>
      <S.Inner>
        <S.Aside>
          <S.SectionNo>01 / PERSONAL APPOINTMENT</S.SectionNo>
          <S.AsideTitle>
            A moment
            <br />
            for <em>you.</em>
          </S.AsideTitle>
          <S.AsideDesc>
            달력에서 예약 가능한 날짜를 선택한 뒤 희망 시간과 상담 분야를 지정해
            주세요. 한 시간대에는 한 건의 방문 상담만 예약할 수 있습니다.
          </S.AsideDesc>
          <S.AsideSteps>
            <S.Step>
              <span>01.</span>
              <p>로그인 회원정보 확인</p>
            </S.Step>
            <S.Step>
              <span>02.</span>
              <p>날짜와 예약 가능 시간 선택</p>
            </S.Step>
            <S.Step>
              <span>03.</span>
              <p>신청과 동시에 예약 확정</p>
            </S.Step>
          </S.AsideSteps>
          <S.HelpLink href="/mypage/reservations">내 예약 확인 ↗</S.HelpLink>
        </S.Aside>
        <S.FormShell>
          {submitted ? (
            <S.Result role="status">
              <S.ResultSymbol>✓</S.ResultSymbol>
              <S.SectionNo>RESERVATION CONFIRMED</S.SectionNo>
              <S.ResultTitle>예약이 확정되었습니다.</S.ResultTitle>
              <S.ResultDesc>
                예약번호 {submitted.id}
                <br />
                {submitted.department} · {selection.date} {selection.time}
                <br />
                예약 상태: <strong>예약확정</strong>
              </S.ResultDesc>
              <S.ActionRow>
                <S.SolidLink href="/mypage/reservations">
                  내 예약 내역 ↗
                </S.SolidLink>
                <S.GhostButton type="button" onClick={reset}>
                  다른 일정 예약
                </S.GhostButton>
              </S.ActionRow>
            </S.Result>
          ) : (
            <>
              <S.FormTop>
                <S.FormTitle>방문 상담 예약</S.FormTitle>
                <S.FormIndex>01 — 04</S.FormIndex>
              </S.FormTop>
              <S.Form onSubmit={(event) => void handleSubmit(event)} noValidate>
                <S.Fieldset>
                  <S.FieldTitle as="legend">01. 예약자 정보</S.FieldTitle>
                  {profileLoading ? (
                    <S.Message role="status">
                      회원 정보를 확인하고 있습니다...
                    </S.Message>
                  ) : profile ? (
                    <S.ProfileCard>
                      <S.ProfileName>{profile.name} 님</S.ProfileName>
                      <S.ProfileText>
                        연락처 · {profile.phone || "등록되지 않음"}
                      </S.ProfileText>
                      <S.ProfileText>
                        이메일 · {profile.email || "등록되지 않음"}
                      </S.ProfileText>
                    </S.ProfileCard>
                  ) : (
                    <>
                      <S.Message $error role="alert">
                        {profileError || "로그인이 필요합니다."}
                      </S.Message>
                      <S.ActionRow>
                        <S.SolidLink href="/login">로그인하기 ↗</S.SolidLink>
                        <S.GhostButton type="button" onClick={retry}>
                          다시 확인
                        </S.GhostButton>
                      </S.ActionRow>
                    </>
                  )}
                </S.Fieldset>
                <S.Fieldset>
                  <S.FieldTitle as="legend">
                    02. 상담 분야 <S.Required>*</S.Required>
                  </S.FieldTitle>
                  <S.ChoiceGrid>
                    {RESERVATION_DEPARTMENTS.map((item) => (
                      <S.ChoiceButton
                        key={item}
                        type="button"
                        $active={department === item}
                        aria-pressed={department === item}
                        onClick={() => setDepartment(item)}
                      >
                        {item}
                      </S.ChoiceButton>
                    ))}
                  </S.ChoiceGrid>
                </S.Fieldset>
                <S.Fieldset>
                  <S.FieldTitle as="legend">
                    03. 방문 날짜와 시간 <S.Required>*</S.Required>
                  </S.FieldTitle>
                  <ReservationCalendar
                    selected={selection}
                    onChange={setSelection}
                    refreshKey={refreshKey}
                  />
                  <S.FieldHint>
                    예약시간은 병원에서 설정한 예시 운영시간을 기준으로
                    제공됩니다. 운영시간 확정 후 관리자와 협의해 변경해 주세요.
                  </S.FieldHint>
                </S.Fieldset>
                <S.Fieldset>
                  <S.FieldTitle as="legend">04. 요청사항 (선택)</S.FieldTitle>
                  <S.Textarea
                    maxLength={1000}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="예약에 필요한 요청사항을 남겨주세요. 민감한 의료정보는 입력하지 않는 것을 권장합니다."
                  />
                  <S.FieldHint>{memo.length} / 1000자</S.FieldHint>
                </S.Fieldset>
                <S.Consent>
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span>
                    예약 접수 및 연락을 위해 회원 이름과 연락처를 사용하는 데
                    동의합니다. 빈 시간대 예약은 즉시 확정되며, 일정 변경과
                    취소는 내 예약에서 확인할 수 있습니다.
                  </span>
                </S.Consent>
                {error && (
                  <S.Message $error role="alert">
                    {error}
                  </S.Message>
                )}
                <S.SubmitButton
                  disabled={
                    submitting ||
                    profileLoading ||
                    !profile ||
                    !selection.time ||
                    !consent
                  }
                  type="submit"
                >
                  {submitting ? "예약 확정 처리 중..." : "상담 예약 확정하기 ↗"}
                </S.SubmitButton>
                <S.FieldHint>
                  동시 예약 요청이 발생하면 서버에서 선착순으로 확정하므로,
                  선택한 시간이 방금 마감되었을 수 있습니다.
                </S.FieldHint>
                <S.FieldHint>
                  로그인 계정에 등록된 연락처가 정확한지 확인해 주세요.{" "}
                  <Link href="/mypage">회원 정보 확인</Link>
                </S.FieldHint>
              </S.Form>
            </>
          )}
        </S.FormShell>
      </S.Inner>
    </S.Page>
  );
}
