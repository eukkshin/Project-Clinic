"use client";

import Link from 'next/link';
import { FormEvent, useState } from 'react';

import { API_ORIGIN } from '@/lib/api/config';
import * as S from '@/styles/auth/PasswordRecovery.styles';

type ApiResponse = { success?: boolean; message?: string };

export default function FindPasswordForm() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError("");
    const id = userId.trim();
    const address = email.trim();
    if (!id || !address) {
      setError("아이디와 가입 이메일을 모두 입력해 주세요.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch(
        `${API_ORIGIN}/api/password-recovery/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: id, email: address }),
          cache: "no-store",
        },
      );
      const data = (await response.json().catch(() => ({}))) as ApiResponse;
      if (!response.ok)
        throw new Error(data.message || "잠시 후 다시 시도해 주세요.");
      setSubmitted(true);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "요청 중 오류가 발생했습니다.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <S.Shell>
      <S.Story>
        <S.Eyebrow>AHNS · MEMBER SERVICE</S.Eyebrow>
        <S.StoryTitle>
          Find your
          <br />
          <em>way back.</em>
        </S.StoryTitle>
        <S.StoryDescription>
          다시 당신의 일상으로. 가입하신 이메일을 통해 안전하게 새 비밀번호를
          설정할 수 있도록 안내해 드립니다.
        </S.StoryDescription>
        <S.BrandSignature>AHNS.</S.BrandSignature>
      </S.Story>
      <S.FormSide>
        <S.FormContainer>
          <S.StepLabel>ACCOUNT RECOVERY / 01</S.StepLabel>
          <S.FormTitle>비밀번호 재설정</S.FormTitle>
          <S.FormDescription>
            회원가입 시 사용한 아이디와 이메일을 입력해 주세요.
            <br />
            일치하는 계정이 있다면 이메일로 재설정 링크를 보내드립니다.
          </S.FormDescription>
          {submitted ? (
            <S.Notice role="status">
              입력하신 정보와 일치하는 계정이 있다면 재설정 이메일을
              발송했습니다. 메일함과 스팸함을 확인해 주세요. 링크는 발급 후 30분
              동안 사용할 수 있습니다.
            </S.Notice>
          ) : (
            <S.Form onSubmit={onSubmit} noValidate>
              <S.Field>
                <S.FieldLabel htmlFor="recovery-id">아이디</S.FieldLabel>
                <S.Input
                  id="recovery-id"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="가입한 아이디"
                  autoComplete="username"
                  required
                  maxLength={50}
                  disabled={pending}
                />
              </S.Field>
              <S.Field>
                <S.FieldLabel htmlFor="recovery-email">
                  가입 이메일
                </S.FieldLabel>
                <S.Input
                  id="recovery-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  maxLength={100}
                  disabled={pending}
                />
              </S.Field>
              {error && (
                <S.Notice $error role="alert">
                  {error}
                </S.Notice>
              )}
              <S.SubmitButton type="submit" disabled={pending}>
                <span>{pending ? "요청 처리 중..." : "재설정 링크 받기"}</span>
                <span aria-hidden="true">↗</span>
              </S.SubmitButton>
            </S.Form>
          )}
          <S.Rule />
          <S.Steps aria-label="비밀번호 재설정 진행 단계">
            <span data-active="true">01 · 이메일 요청</span>
            <span>—</span>
            <span>02 · 새 비밀번호 설정</span>
          </S.Steps>
          <S.SecondaryLink as={Link} href="/register/login">
            ← 로그인으로 돌아가기
          </S.SecondaryLink>
        </S.FormContainer>
      </S.FormSide>
    </S.Shell>
  );
}
