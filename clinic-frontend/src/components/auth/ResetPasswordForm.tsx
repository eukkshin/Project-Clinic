"use client";

import Link from 'next/link';
import { FormEvent, useState } from 'react';

import { API_ORIGIN } from '@/lib/api/config';
import * as S from '@/styles/auth/PasswordRecovery.styles';

type ApiResponse = { success?: boolean; message?: string };

type Props = { token: string };

function validPassword(value: string) {
  return (
    value.length >= 10 &&
    new TextEncoder().encode(value).length <= 72 &&
    value.trim().length > 0
  );
}

export default function ResetPasswordForm({ token }: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const matches = confirm.length > 0 && password === confirm;
  const mismatch = confirm.length > 0 && password !== confirm;
  const tokenPresent = /^[A-Za-z0-9_-]{40,100}$/.test(token);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError("");
    if (!tokenPresent) {
      setError("유효하지 않은 링크입니다. 처음부터 다시 신청해 주세요.");
      return;
    }
    if (!validPassword(password)) {
      setError(
        "비밀번호는 10자 이상, UTF-8 기준 72바이트 이하로 입력해 주세요.",
      );
      return;
    }
    if (password !== confirm) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(
        `${API_ORIGIN}/api/password-recovery/reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword: password }),
          cache: "no-store",
        },
      );
      const data = (await response.json().catch(() => ({}))) as ApiResponse;
      if (!response.ok)
        throw new Error(
          data.message || "변경에 실패했습니다. 다시 시도해 주세요.",
        );
      setDone(true);
      setPassword("");
      setConfirm("");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "서버 연결을 확인해 주세요.",
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
          A new
          <br />
          <em>beginning.</em>
        </S.StoryTitle>
        <S.StoryDescription>
          계정을 안전하게 보호하기 위해 새로운 비밀번호를 등록해 주세요.
        </S.StoryDescription>
        <S.BrandSignature>AHNS.</S.BrandSignature>
      </S.Story>
      <S.FormSide>
        <S.FormContainer>
          <S.StepLabel>ACCOUNT RECOVERY / 02</S.StepLabel>
          <S.FormTitle>새 비밀번호 설정</S.FormTitle>
          <S.FormDescription>
            이메일 링크를 통해 접속한 계정의 비밀번호를 변경합니다.
          </S.FormDescription>
          {done ? (
            <>
              <S.Notice role="status">
                비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.
              </S.Notice>
              <S.SecondaryLink as={Link} href="/register/login">
                로그인하러 가기 ↗
              </S.SecondaryLink>
            </>
          ) : !tokenPresent ? (
            <>
              <S.Notice $error role="alert">
                링크가 올바르지 않습니다. 이메일에서 다시 열거나 재설정 링크를
                새로 요청해 주세요.
              </S.Notice>
              <S.SecondaryLink as={Link} href="/find">
                ← 재설정 링크 다시 받기
              </S.SecondaryLink>
            </>
          ) : (
            <S.Form onSubmit={onSubmit} noValidate>
              <S.Field>
                <S.FieldLabel htmlFor="reset-password">
                  새 비밀번호
                </S.FieldLabel>
                <S.InputWrap>
                  <S.PasswordInput
                    id="reset-password"
                    type={visible ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="새 비밀번호를 입력해 주세요"
                    required
                    disabled={pending}
                  />
                  <S.Visibility
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={
                      visible ? "비밀번호 숨기기" : "비밀번호 표시하기"
                    }
                  >
                    {visible ? "숨기기" : "보기"}
                  </S.Visibility>
                </S.InputWrap>
                <S.FieldHint
                  $error={password.length > 0 && !validPassword(password)}
                >
                  10자 이상, UTF-8 기준 최대 72바이트
                </S.FieldHint>
              </S.Field>
              <S.Field>
                <S.FieldLabel htmlFor="reset-confirm">
                  새 비밀번호 확인
                </S.FieldLabel>
                <S.InputWrap>
                  <S.PasswordInput
                    id="reset-confirm"
                    type={visible ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="비밀번호를 다시 입력해 주세요"
                    required
                    disabled={pending}
                  />
                  <S.Visibility
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={
                      visible ? "비밀번호 숨기기" : "비밀번호 표시하기"
                    }
                  >
                    {visible ? "숨기기" : "보기"}
                  </S.Visibility>
                </S.InputWrap>
                {mismatch && (
                  <S.FieldHint $error>
                    비밀번호가 일치하지 않습니다.
                  </S.FieldHint>
                )}
                {matches && (
                  <S.FieldHint $success>비밀번호가 일치합니다.</S.FieldHint>
                )}
              </S.Field>
              {error && (
                <S.Notice $error role="alert">
                  {error}
                </S.Notice>
              )}
              <S.SubmitButton
                type="submit"
                disabled={pending || !matches || !validPassword(password)}
              >
                <span>{pending ? "변경 중..." : "비밀번호 변경하기"}</span>
                <span aria-hidden="true">↗</span>
              </S.SubmitButton>
            </S.Form>
          )}
          <S.Rule />
          <S.Steps aria-label="비밀번호 재설정 진행 단계">
            <span>01 · 이메일 요청</span>
            <span>—</span>
            <span data-active="true">02 · 새 비밀번호 설정</span>
          </S.Steps>
        </S.FormContainer>
      </S.FormSide>
    </S.Shell>
  );
}
