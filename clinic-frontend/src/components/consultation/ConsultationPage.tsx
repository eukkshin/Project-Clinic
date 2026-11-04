"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

import { submitGuestConsult } from "@/lib/consultation/api";
import * as S from "@/styles/consultation/Consultation.styles";
import { CONSULT_DEPARTMENTS, ConsultDepartment } from "@/types/consultation";

const initial = {
  name: "",
  phone: "",
  department: "" as ConsultDepartment | "",
  title: "",
  content: "",
  website: "",
};

type ValidationMessages = Record<
  "name" | "phone" | "department" | "title" | "content" | "consent",
  string
>;
function validate(
  form: typeof initial,
  consent: boolean,
  messages: ValidationMessages,
): string | null {
  if (!/^[가-힣a-zA-Z\s]{2,50}$/.test(form.name.trim())) return messages.name;
  if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(form.phone.replace(/\s/g, "")))
    return messages.phone;
  if (!CONSULT_DEPARTMENTS.includes(form.department as ConsultDepartment))
    return messages.department;
  if (form.title.trim().length < 4 || form.title.trim().length > 120)
    return messages.title;
  if (form.content.trim().length < 10 || form.content.trim().length > 3000)
    return messages.content;
  if (!consent) return messages.consent;
  return null;
}

export default function ConsultationPage() {
  const t = useTranslations("Consultation");
  const departmentLabels: Record<ConsultDepartment, string> = {
    눈성형: t("deptEyes"),
    코성형: t("deptNose"),
    안면윤곽: t("deptContour"),
    동안성형: t("deptAntiAging"),
    리프팅: t("deptLifting"),
    쁘띠시술: t("deptPetit"),
    "기타 상담": t("deptOther"),
  };
  const [form, setForm] = useState(initial);
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<number | null>(null);
  const pendingRef = useRef(false);

  function set(field: keyof typeof initial, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingRef.current) return;

    const problem = validate(form, consent, {
      name: t("nameInvalid"),
      phone: t("phoneInvalid"),
      department: t("departmentRequired"),
      title: t("titleInvalid"),
      content: t("contentInvalid"),
      consent: t("consentRequired"),
    });
    if (problem) {
      setError(problem);
      return;
    }

    pendingRef.current = true;
    setPending(true);
    setError("");
    try {
      const result = await submitGuestConsult({
        name: form.name.trim(),
        phone: form.phone.replace(/\s/g, "").trim(),
        department: form.department as ConsultDepartment,
        title: form.title.trim(),
        content: form.content.trim(),
        privacyConsent: true,
        website: form.website,
      });
      setReceipt(result.id);
      setForm(initial);
      setConsent(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("submitFailed"));
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }

  return (
    <S.Page>
      <S.Inner>
        <S.Aside>
          <S.Eyebrow>AHNS · PRIVATE CONSULTATION</S.Eyebrow>
          <S.SectionNo>01 / PERSONAL CONSULTATION</S.SectionNo>
          <S.Title>
            Private
            <br />
            <em>Consultation.</em>
          </S.Title>
          <S.Subtitle>{t("subtitle")}</S.Subtitle>
          <S.Description>{t("description")}</S.Description>

          <S.Steps aria-label={t("stepsAria")}>
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
          </S.Steps>
          <S.AsideLink as={Link} href="/reservation">
            {t("visitIntro")} <span>{t("visitLink")} ↗</span>
          </S.AsideLink>
        </S.Aside>

        <S.FormShell>
          {receipt !== null ? (
            <S.Success role="status">
              <S.SuccessMark aria-hidden="true">✓</S.SuccessMark>
              <S.FormEyebrow>REQUEST RECEIVED</S.FormEyebrow>
              <S.SuccessTitle>{t("received")}</S.SuccessTitle>
              <S.SuccessText>
                {t("receiptNo")} <strong>{receipt}</strong>
                <br />
                {t("receivedMessage")}
              </S.SuccessText>
              <S.Submit type="button" onClick={() => setReceipt(null)}>
                {t("another")} <span aria-hidden="true">↗</span>
              </S.Submit>
            </S.Success>
          ) : (
            <S.Form onSubmit={(event) => void submit(event)} noValidate>
              <S.FormTop>
                <div>
                  <S.FormEyebrow>YOUR MESSAGE</S.FormEyebrow>
                  <S.FormTitle>{t("formTitle")}</S.FormTitle>
                </div>
                <S.FormIndex>01 — 03</S.FormIndex>
              </S.FormTop>

              <S.TwoCol>
                <S.Field>
                  <label htmlFor="consult-name">
                    {t("name")} <b>*</b>
                  </label>
                  <input
                    id="consult-name"
                    name="name"
                    autoComplete="name"
                    maxLength={50}
                    required
                    placeholder={t("namePlaceholder")}
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </S.Field>
                <S.Field>
                  <label htmlFor="consult-phone">
                    {t("phone")} <b>*</b>
                  </label>
                  <input
                    id="consult-phone"
                    name="tel"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={20}
                    required
                    placeholder="010-0000-0000"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </S.Field>
              </S.TwoCol>

              <S.TwoCol>
                <S.Field>
                  <label htmlFor="consult-department">
                    {t("procedure")} <b>*</b>
                  </label>
                  <select
                    id="consult-department"
                    required
                    value={form.department}
                    onChange={(e) => set("department", e.target.value)}
                  >
                    <option value="">{t("selectDepartment")}</option>
                    {CONSULT_DEPARTMENTS.map((department) => (
                      <option key={department} value={department}>
                        {departmentLabels[department]}
                      </option>
                    ))}
                  </select>
                </S.Field>
                <S.Field>
                  <label htmlFor="consult-title">
                    {t("subject")} <b>*</b>
                  </label>
                  <input
                    id="consult-title"
                    maxLength={120}
                    required
                    placeholder={t("subjectPlaceholder")}
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                  />
                </S.Field>
              </S.TwoCol>

              <S.Field>
                <label htmlFor="consult-content">
                  {t("message")} <b>*</b>
                </label>
                <S.TextareaWrap>
                  <textarea
                    id="consult-content"
                    maxLength={3000}
                    minLength={10}
                    required
                    rows={4}
                    placeholder={t("messagePlaceholder")}
                    value={form.content}
                    onChange={(e) => set("content", e.target.value)}
                  />
                  <S.CharCount>{form.content.length} / 3,000</S.CharCount>
                </S.TextareaWrap>
              </S.Field>

              <S.Privacy>
                <label>
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span>
                    <strong>{t("privacyAgree")}</strong> {t("required")}
                  </span>
                </label>
                <details>
                  <summary>{t("privacyDetails")}</summary>
                  <p>
                    {t("privacyItems")}
                    <br />
                    {t("privacyPurpose")}
                    <br />
                    {t("privacyRetention")}
                  </p>
                </details>
              </S.Privacy>

              {/* 자동화된 스팸 제출을 판별하는 비가시성 필드 */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                }}
              >
                <label htmlFor="consult-website">Website</label>
                <input
                  id="consult-website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                />
              </div>

              {error && <S.Error role="alert">{error}</S.Error>}
              <S.Submit type="submit" disabled={pending}>
                {pending ? t("submitting") : t("submit")}
                <span aria-hidden="true">↗</span>
              </S.Submit>
              <S.Notice>{t("notice")}</S.Notice>
            </S.Form>
          )}
        </S.FormShell>
      </S.Inner>
    </S.Page>
  );
}
