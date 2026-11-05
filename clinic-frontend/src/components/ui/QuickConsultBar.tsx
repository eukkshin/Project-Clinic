"use client";

import axios from "axios";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { FiArrowUpRight, FiX } from "react-icons/fi";

import ConsultCaptcha, {
  consultCaptchaEnabled,
} from "@/components/security/ConsultCaptcha";
import * as S from "@/components/ui/QuickConsultBar.styles";
import { API_ORIGIN } from "@/lib/api/config";

/** 실제 백엔드 주소를 환경변수로 바꾸더라도 동일하게 작동한다. */
const API_URL = API_ORIGIN;

/** 사용자가 선택한 상담 항목은 기존 API의 department 문자열로 전송한다. */
const DEPARTMENTS = ["눈 성형", "코 성형", "동안 성형", "쁘띠 시술"] as const;

interface QuickConsultResponse {
  success?: boolean;
  message?: string;
}

export default function QuickConsultBar() {
  const tQuick = useTranslations("QuickConsult");
  // 닫기 버튼을 누르면 바를 숨긴다. 새로고침하면 다시 열린다는 기존 동작을 유지한다.
  const [isOpen, setIsOpen] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);

  // 비동기 POST가 중복 호출되는 일을 방지하고 결과를 화면에 표시한다.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 브라우저 기본 form 제출/페이지 새로고침 방지
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    // 인풋에도 required를 주지만, 전송 직전 한 번 더 검사한다.
    if (!trimmedName) {
      setMessage(tQuick("nameRequired"));
      setMessageType("error");
      return;
    }
    if (!/^\d{9,11}$/.test(trimmedPhone) || /^(\d)\1{8,}$/.test(trimmedPhone)) {
      setMessage(tQuick("phoneInvalid"));
      setMessageType("error");
      return;
    }
    if (!department) {
      setMessage(tQuick("departmentRequired"));
      setMessageType("error");
      return;
    }
    if (!isAgreed) {
      setMessage(tQuick("agreementRequired"));
      setMessageType("error");
      return;
    }
    if (consultCaptchaEnabled && !captchaToken) {
      setMessage("자동 신청 방지 인증을 완료해 주세요.");
      setMessageType("error");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      // 기존 빠른 상담 API 경로와 전송 필드는 변경하지 않았다.
      const { data } = await axios.post<QuickConsultResponse>(
        `${API_URL}/api/consult/quick`,
        {
          name: trimmedName,
          phone: trimmedPhone,
          department,
          privacyConsent: isAgreed,
          captchaToken,
        },
      );

      if (!data.success) {
        throw new Error(data.message || tQuick("submitFailed"));
      }

      setName("");
      setPhone("");
      setDepartment("");
      setIsAgreed(false);
      setMessageType("success");
      setMessage(tQuick("submitted"));
    } catch (error) {
      console.error("빠른 상담 신청 실패:", error);
      setMessageType("error");
      setMessage(tQuick("submitError"));
    } finally {
      setIsSubmitting(false);
      setCaptchaReset((v) => v + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <S.BarWrapper aria-label={tQuick("regionLabel")}>
      <S.BarInner>
        <S.Identity>
          <S.IdentityEyebrow>AHN'S CONSULTATION</S.IdentityEyebrow>
          <S.Title>{tQuick("title")}</S.Title>
          <S.IdentityCaption>{tQuick("caption")}</S.IdentityCaption>
        </S.Identity>

        <S.ConsultForm onSubmit={handleSubmit}>
          <S.Field>
            <S.FieldLabel htmlFor="quick-consult-name">
              {tQuick("name")}
            </S.FieldLabel>
            <S.Input
              id="quick-consult-name"
              type="text"
              autoComplete="name"
              placeholder={tQuick("namePlaceholder")}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (message) setMessage("");
              }}
              maxLength={40}
              required
            />
          </S.Field>

          <S.Field>
            <S.FieldLabel htmlFor="quick-consult-phone">
              {tQuick("phone")}
            </S.FieldLabel>
            <S.Input
              id="quick-consult-phone"
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              placeholder={tQuick("phonePlaceholder")}
              value={phone}
              maxLength={11}
              onChange={(event) => {
                setPhone(event.target.value.replace(/\D/g, ""));
                if (message) setMessage("");
              }}
              required
            />
          </S.Field>

          <S.Field>
            <S.FieldLabel htmlFor="quick-consult-department">
              {tQuick("department")}
            </S.FieldLabel>
            <S.Select
              id="quick-consult-department"
              value={department}
              onChange={(event) => {
                setDepartment(event.target.value);
                if (message) setMessage("");
              }}
              $placeholder={!department}
              required
            >
              <option value="" disabled>
                {tQuick("departmentPlaceholder")}
              </option>
              {DEPARTMENTS.map((item, index) => (
                <option key={item} value={item}>
                  {tQuick(
                    ["eyes", "nose", "antiAging", "petit"][index] as
                      | "eyes"
                      | "nose"
                      | "antiAging"
                      | "petit",
                  )}
                </option>
              ))}
            </S.Select>
          </S.Field>

          <ConsultCaptcha onToken={setCaptchaToken} resetKey={captchaReset} />
          <S.ActionGroup>
            <S.CheckboxLabel>
              <S.Checkbox
                type="checkbox"
                checked={isAgreed}
                onChange={(event) => setIsAgreed(event.target.checked)}
                required
              />
              <S.AgreeText>{tQuick("agreement")}</S.AgreeText>
            </S.CheckboxLabel>
            <S.SubmitBtn
              type="submit"
              disabled={
                isSubmitting ||
                !isAgreed ||
                !name.trim() ||
                !phone.trim() ||
                !department ||
                (consultCaptchaEnabled && !captchaToken)
              }
            >
              {isSubmitting ? tQuick("submitting") : tQuick("submit")}
              <FiArrowUpRight aria-hidden="true" size={17} />
            </S.SubmitBtn>
          </S.ActionGroup>
        </S.ConsultForm>

        <S.CloseBtn
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label={tQuick("closeBar")}
          title={tQuick("close")}
        >
          <FiX size={17} aria-hidden="true" />
        </S.CloseBtn>
      </S.BarInner>

      {message && (
        <S.Feedback
          $error={messageType === "error"}
          role="status"
          aria-live="polite"
        >
          {message}
        </S.Feedback>
      )}
    </S.BarWrapper>
  );
}
