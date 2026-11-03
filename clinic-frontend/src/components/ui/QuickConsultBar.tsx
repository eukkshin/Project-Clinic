"use client";

import { API_ORIGIN } from "@/lib/api/config";
import axios from "axios";
import { FormEvent, useState } from "react";
import { FiArrowUpRight, FiX } from "react-icons/fi";

import * as S from "@/components/ui/QuickConsultBar.styles";

/** 실제 백엔드 주소를 환경변수로 바꾸더라도 동일하게 작동한다. */
const API_URL = API_ORIGIN;

/** 사용자가 선택한 상담 항목은 기존 API의 department 문자열로 전송한다. */
const DEPARTMENTS = ["눈 성형", "코 성형", "동안 성형", "쁘띠 시술"] as const;

interface QuickConsultResponse {
  success?: boolean;
  message?: string;
}

export default function QuickConsultBar() {
  // 닫기 버튼을 누르면 바를 숨긴다. 새로고침하면 다시 열린다는 기존 동작을 유지한다.
  const [isOpen, setIsOpen] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

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
      setMessage("이름을 입력해 주세요.");
      setMessageType("error");
      return;
    }
    if (!/^\d{9,11}$/.test(trimmedPhone) || /^(\d)\1{8,}$/.test(trimmedPhone)) {
      setMessage("연락처는 숫자 9~11자리로 입력해 주세요.");
      setMessageType("error");
      return;
    }
    if (!department) {
      setMessage("상담 분야를 선택해 주세요.");
      setMessageType("error");
      return;
    }
    if (!isAgreed) {
      setMessage("개인정보 수집·이용에 동의해 주세요.");
      setMessageType("error");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      // 기존 빠른 상담 API 경로와 전송 필드는 변경하지 않았다.
      const { data } = await axios.post<QuickConsultResponse>(
        `${API_URL}/api/consult/quick`,
        { name: trimmedName, phone: trimmedPhone, department },
      );

      if (!data.success) {
        throw new Error(data.message || "상담 접수에 실패했습니다.");
      }

      setName("");
      setPhone("");
      setDepartment("");
      setIsAgreed(false);
      setMessageType("success");
      setMessage(
        "상담 신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.",
      );
    } catch (error) {
      console.error("빠른 상담 신청 실패:", error);
      setMessageType("error");
      setMessage(
        "상담 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <S.BarWrapper aria-label="빠른 상담 신청 영역">
      <S.BarInner>
        <S.Identity>
          <S.IdentityEyebrow>AHN'S CONSULTATION</S.IdentityEyebrow>
          <S.Title>가볍게 남겨주세요.</S.Title>
          <S.IdentityCaption>아름다움에 관한 첫 번째 이야기</S.IdentityCaption>
        </S.Identity>

        <S.ConsultForm onSubmit={handleSubmit}>
          <S.Field>
            <S.FieldLabel htmlFor="quick-consult-name">이름</S.FieldLabel>
            <S.Input
              id="quick-consult-name"
              type="text"
              autoComplete="name"
              placeholder="성함을 입력해 주세요"
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
            <S.FieldLabel htmlFor="quick-consult-phone">연락처</S.FieldLabel>
            <S.Input
              id="quick-consult-phone"
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              placeholder="숫자만 입력"
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
              상담 분야
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
                분야를 선택해 주세요
              </option>
              {DEPARTMENTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </S.Select>
          </S.Field>

          <S.ActionGroup>
            <S.CheckboxLabel>
              <S.Checkbox
                type="checkbox"
                checked={isAgreed}
                onChange={(event) => setIsAgreed(event.target.checked)}
                required
              />
              <S.AgreeText>개인정보 수집·이용 동의</S.AgreeText>
            </S.CheckboxLabel>
            <S.SubmitBtn
              type="submit"
              disabled={
                isSubmitting ||
                !isAgreed ||
                !name.trim() ||
                !phone.trim() ||
                !department
              }
            >
              {isSubmitting ? "접수 중..." : "빠른 상담 신청"}
              <FiArrowUpRight aria-hidden="true" size={17} />
            </S.SubmitBtn>
          </S.ActionGroup>
        </S.ConsultForm>

        <S.CloseBtn
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="빠른 상담바 닫기"
          title="닫기"
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
