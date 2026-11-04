"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import { handleLoginLinkClick } from "@/components/auth/openLoginModal";
import { useMyPageData } from "@/components/mypage/useMyPageData";
import { createReservation } from "@/lib/reservation/api";
import * as S from "@/styles/reservation/Reservation.styles";
import {
  RESERVATION_DEPARTMENTS,
  ReservationDepartment,
  ReservationResponse,
} from "@/types/reservation";

import ReservationCalendar, { CalendarSelection } from "./ReservationCalendar";

import type { MyProfile } from "@/types/mypage";

export default function ReservationBookingPage() {
  const t = useTranslations("Reservation");
  const departmentLabels: Record<ReservationDepartment, string> = {
    "눈 성형": t("deptEyes"),
    "코 성형": t("deptNose"),
    리프팅: t("deptLifting"),
    "피부·쁘띠": t("deptSkin"),
    "기타 상담": t("deptOther"),
  };
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

  // Keep the reservation form open and reload the member profile after modal login.
  useEffect(() => {
    window.addEventListener("login-success", retry);
    return () => window.removeEventListener("login-success", retry);
  }, [retry]);

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
      setError(t("validationError"));
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
      setError(reason instanceof Error ? reason.message : t("submitFailed"));
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
          {t("heroSub1")}
          <br />
          {t("heroSub2")}
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
          <S.AsideDesc>{t("asideDesc")}</S.AsideDesc>
          <S.AsideSteps>
            <S.Step>
              <span>01.</span>
              <p>{t("step1")}</p>
            </S.Step>
            <S.Step>
              <span>02.</span>
              <p>{t("step2")}</p>
            </S.Step>
            <S.Step>
              <span>03.</span>
              <p>{t("step3")}</p>
            </S.Step>
          </S.AsideSteps>
          <S.HelpLink href="/mypage/reservations">
            {t("myReservations")} ↗
          </S.HelpLink>
        </S.Aside>
        <S.FormShell>
          {submitted ? (
            <S.Result role="status">
              <S.ResultSymbol>✓</S.ResultSymbol>
              <S.SectionNo>RESERVATION CONFIRMED</S.SectionNo>
              <S.ResultTitle>{t("confirmed")}</S.ResultTitle>
              <S.ResultDesc>
                {t("reservationNo", { id: submitted.id })}
                <br />
                {departmentLabels[
                  submitted.department as ReservationDepartment
                ] ?? submitted.department}{" "}
                · {selection.date} {selection.time}
                <br />
                {t("status")} <strong>{t("statusConfirmed")}</strong>
              </S.ResultDesc>
              <S.ActionRow>
                <S.SolidLink href="/mypage/reservations">
                  {t("history")} ↗
                </S.SolidLink>
                <S.GhostButton type="button" onClick={reset}>
                  {t("bookAnother")}
                </S.GhostButton>
              </S.ActionRow>
            </S.Result>
          ) : (
            <>
              <S.FormTop>
                <S.FormTitle>{t("formTitle")}</S.FormTitle>
                <S.FormIndex>01 — 04</S.FormIndex>
              </S.FormTop>
              <S.Form onSubmit={(event) => void handleSubmit(event)} noValidate>
                <S.Fieldset>
                  <S.FieldTitle as="legend">
                    01. {t("personalInfo")}
                  </S.FieldTitle>
                  {profileLoading ? (
                    <S.Message role="status">{t("loadingProfile")}</S.Message>
                  ) : profile ? (
                    <S.ProfileCard>
                      <S.ProfileName>
                        {profile.name}
                        {t("memberSuffix")}
                      </S.ProfileName>
                      <S.ProfileText>
                        {t("phone")} · {profile.phone || t("notRegistered")}
                      </S.ProfileText>
                      <S.ProfileText>
                        {t("email")} · {profile.email || t("notRegistered")}
                      </S.ProfileText>
                    </S.ProfileCard>
                  ) : (
                    <>
                      <S.Message $error role="alert">
                        {profileError || t("loginRequired")}
                      </S.Message>
                      <S.ActionRow>
                        <S.SolidLink
                          href="/register/login"
                          onClick={handleLoginLinkClick}
                        >
                          {t("login")} ↗
                        </S.SolidLink>
                        <S.GhostButton type="button" onClick={retry}>
                          {t("retry")}
                        </S.GhostButton>
                      </S.ActionRow>
                    </>
                  )}
                </S.Fieldset>
                <S.Fieldset>
                  <S.FieldTitle as="legend">
                    02. {t("department")} <S.Required>*</S.Required>
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
                        {departmentLabels[item]}
                      </S.ChoiceButton>
                    ))}
                  </S.ChoiceGrid>
                </S.Fieldset>
                <S.Fieldset>
                  <S.FieldTitle as="legend">
                    03. {t("dateTime")} <S.Required>*</S.Required>
                  </S.FieldTitle>
                  <ReservationCalendar
                    selected={selection}
                    onChange={setSelection}
                    refreshKey={refreshKey}
                  />
                  <S.FieldHint>{t("hoursNote")}</S.FieldHint>
                </S.Fieldset>
                <S.Fieldset>
                  <S.FieldTitle as="legend">04. {t("memo")}</S.FieldTitle>
                  <S.Textarea
                    maxLength={1000}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder={t("memoPlaceholder")}
                  />
                  <S.FieldHint>
                    {t("characters", { count: memo.length })}
                  </S.FieldHint>
                </S.Fieldset>
                <S.Consent>
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span>{t("consent")}</span>
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
                  {submitting ? t("submitting") : `${t("submit")} ↗`}
                </S.SubmitButton>
                <S.FieldHint>{t("conflictNote")}</S.FieldHint>
                <S.FieldHint>
                  {t("contactNote")}{" "}
                  <Link href="/mypage">{t("checkProfile")}</Link>
                </S.FieldHint>
              </S.Form>
            </>
          )}
        </S.FormShell>
      </S.Inner>
    </S.Page>
  );
}
