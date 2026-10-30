"use client";

import Link from 'next/link';
import { FormEvent, useRef, useState } from 'react';

import { submitGuestConsult } from '@/lib/consultation/api';
import * as S from '@/styles/consultation/Consultation.styles';
import { CONSULT_DEPARTMENTS, ConsultDepartment } from '@/types/consultation';

const initial = {
  name: "",
  phone: "",
  department: "" as ConsultDepartment | "",
  title: "",
  content: "",
  website: "",
};

function validate(form: typeof initial, consent: boolean): string | null {
  if (!/^[가-힣a-zA-Z\s]{2,50}$/.test(form.name.trim()))
    return "성함을 2~50자로 입력해 주세요.";
  if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(form.phone.replace(/\s/g, "")))
    return "연락처를 정확히 입력해 주세요.";
  if (!CONSULT_DEPARTMENTS.includes(form.department as ConsultDepartment))
    return "관심 시술을 선택해 주세요.";
  if (form.title.trim().length < 4 || form.title.trim().length > 120)
    return "상담 제목은 4~120자로 입력해 주세요.";
  if (form.content.trim().length < 10 || form.content.trim().length > 3000)
    return "상담 내용은 10~3,000자로 입력해 주세요.";
  if (!consent) return "개인정보 수집 및 이용에 동의해 주세요.";
  return null;
}

export default function ConsultationPage() {
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

    const problem = validate(form, consent);
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
      setError(
        cause instanceof Error
          ? cause.message
          : "상담 신청에 실패했습니다. 다시 시도해 주세요.",
      );
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
          <S.Subtitle>아름다움의 시작은, 당신의 이야기로부터.</S.Subtitle>
          <S.Description>
            고민하고 있는 시술이나 궁금한 점을 편안하게 남겨 주세요. 로그인 없이
            신청할 수 있으며, 담당자가 내용을 확인한 후 연락드리겠습니다.
          </S.Description>

          <S.Steps aria-label="상담 진행 절차">
            <S.Step>
              <span>01.</span>
              <p>상담 내용 작성</p>
            </S.Step>
            <S.Step>
              <span>02.</span>
              <p>담당자 확인</p>
            </S.Step>
            <S.Step>
              <span>03.</span>
              <p>개별 상담 안내</p>
            </S.Step>
          </S.Steps>
          <S.AsideLink as={Link} href="/reservation">
            날짜를 직접 선택하고 싶다면 <span>방문예약 ↗</span>
          </S.AsideLink>
        </S.Aside>

        <S.FormShell>
          {receipt !== null ? (
            <S.Success role="status">
              <S.SuccessMark aria-hidden="true">✓</S.SuccessMark>
              <S.FormEyebrow>REQUEST RECEIVED</S.FormEyebrow>
              <S.SuccessTitle>상담이 접수되었습니다.</S.SuccessTitle>
              <S.SuccessText>
                접수번호 <strong>{receipt}</strong>
                <br />
                입력하신 연락처로 담당자가 상담을 안내해 드리겠습니다.
              </S.SuccessText>
              <S.Submit type="button" onClick={() => setReceipt(null)}>
                다른 상담 신청하기 <span aria-hidden="true">↗</span>
              </S.Submit>
            </S.Success>
          ) : (
            <S.Form onSubmit={(event) => void submit(event)} noValidate>
              <S.FormTop>
                <div>
                  <S.FormEyebrow>YOUR MESSAGE</S.FormEyebrow>
                  <S.FormTitle>1:1 상담 신청</S.FormTitle>
                </div>
                <S.FormIndex>01 — 03</S.FormIndex>
              </S.FormTop>

              <S.TwoCol>
                <S.Field>
                  <label htmlFor="consult-name">
                    성함 <b>*</b>
                  </label>
                  <input
                    id="consult-name"
                    name="name"
                    autoComplete="name"
                    maxLength={50}
                    required
                    placeholder="성함을 입력해 주세요"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </S.Field>
                <S.Field>
                  <label htmlFor="consult-phone">
                    연락처 <b>*</b>
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
                    관심 시술 <b>*</b>
                  </label>
                  <select
                    id="consult-department"
                    required
                    value={form.department}
                    onChange={(e) => set("department", e.target.value)}
                  >
                    <option value="">상담 분야 선택</option>
                    {CONSULT_DEPARTMENTS.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </S.Field>
                <S.Field>
                  <label htmlFor="consult-title">
                    상담 제목 <b>*</b>
                  </label>
                  <input
                    id="consult-title"
                    maxLength={120}
                    required
                    placeholder="문의 제목을 입력해 주세요"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                  />
                </S.Field>
              </S.TwoCol>

              <S.Field>
                <label htmlFor="consult-content">
                  상담 내용 <b>*</b>
                </label>
                <S.TextareaWrap>
                  <textarea
                    id="consult-content"
                    maxLength={3000}
                    minLength={10}
                    required
                    rows={4}
                    placeholder="문의하실 내용을 남겨 주세요. 주민등록번호, 병력 등 민감한 정보는 입력하지 마세요."
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
                    <strong>개인정보 수집 및 이용에 동의합니다.</strong> (필수)
                  </span>
                </label>
                <details>
                  <summary>수집 및 이용 안내 보기</summary>
                  <p>
                    수집 항목: 성함, 연락처, 관심 시술, 상담 제목 및 내용.
                    <br />
                    이용 목적: 상담 접수와 개별 연락.
                    <br />
                    보유 기간: 운영 중인 개인정보 처리방침에 따릅니다. 실제 운영
                    전 정확한 보유기간과 개인정보 처리방침을 확정하여 고지해야
                    합니다.
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
                {pending ? "상담을 접수하고 있습니다…" : "상담 신청하기"}
                <span aria-hidden="true">↗</span>
              </S.Submit>
              <S.Notice>
                상담은 예약 확정이 아니며, 신청 내용은 공개되지 않습니다.
              </S.Notice>
            </S.Form>
          )}
        </S.FormShell>
      </S.Inner>
    </S.Page>
  );
}
