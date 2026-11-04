"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { FormEvent, useState } from "react";

import AuthLanguageSwitcher from "@/components/i18n/AuthLanguageSwitcher";
import { API_ORIGIN } from "@/lib/api/config";
import * as S from "@/styles/auth/PasswordRecovery.styles";

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
  const tRecovery = useTranslations("PasswordRecovery");
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
      setError(tRecovery("invalidLink"));
      return;
    }
    if (!validPassword(password)) {
      setError(tRecovery("passwordRulesError"));
      return;
    }
    if (password !== confirm) {
      setError(tRecovery("passwordMismatch"));
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
        throw new Error(data.message || tRecovery("changeFailed"));
      setDone(true);
      setPassword("");
      setConfirm("");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : tRecovery("serverError"),
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
        <S.StoryDescription>{tRecovery("resetStory")}</S.StoryDescription>
        <S.BrandSignature>AHNS.</S.BrandSignature>
      </S.Story>
      <S.FormSide>
        <div style={{ position: "fixed", top: 18, right: 22, zIndex: 99 }}>
          <AuthLanguageSwitcher />
        </div>
        <S.FormContainer>
          <S.StepLabel>ACCOUNT RECOVERY / 02</S.StepLabel>
          <S.FormTitle>{tRecovery("resetTitle")}</S.FormTitle>
          <S.FormDescription>{tRecovery("resetDescription")}</S.FormDescription>
          {done ? (
            <>
              <S.Notice role="status">{tRecovery("changedNotice")}</S.Notice>
              <S.SecondaryLink as={Link} href="/register/login">
                {tRecovery("goToLogin")} ↗
              </S.SecondaryLink>
            </>
          ) : !tokenPresent ? (
            <>
              <S.Notice $error role="alert">
                {tRecovery("badLinkNotice")}
              </S.Notice>
              <S.SecondaryLink as={Link} href="/find">
                ← {tRecovery("requestAgain")}
              </S.SecondaryLink>
            </>
          ) : (
            <S.Form onSubmit={onSubmit} noValidate>
              <S.Field>
                <S.FieldLabel htmlFor="reset-password">
                  {tRecovery("newPassword")}
                </S.FieldLabel>
                <S.InputWrap>
                  <S.PasswordInput
                    id="reset-password"
                    type={visible ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={tRecovery("passwordPlaceholder")}
                    required
                    disabled={pending}
                  />
                  <S.Visibility
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={
                      visible
                        ? tRecovery("hidePassword")
                        : tRecovery("showPassword")
                    }
                  >
                    {visible ? tRecovery("hide") : tRecovery("show")}
                  </S.Visibility>
                </S.InputWrap>
                <S.FieldHint
                  $error={password.length > 0 && !validPassword(password)}
                >
                  {tRecovery("rulesHint")}
                </S.FieldHint>
              </S.Field>
              <S.Field>
                <S.FieldLabel htmlFor="reset-confirm">
                  {tRecovery("confirmPassword")}
                </S.FieldLabel>
                <S.InputWrap>
                  <S.PasswordInput
                    id="reset-confirm"
                    type={visible ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder={tRecovery("confirmPlaceholder")}
                    required
                    disabled={pending}
                  />
                  <S.Visibility
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={
                      visible
                        ? tRecovery("hidePassword")
                        : tRecovery("showPassword")
                    }
                  >
                    {visible ? tRecovery("hide") : tRecovery("show")}
                  </S.Visibility>
                </S.InputWrap>
                {mismatch && (
                  <S.FieldHint $error>
                    {tRecovery("passwordMismatch")}
                  </S.FieldHint>
                )}
                {matches && (
                  <S.FieldHint $success>
                    {tRecovery("passwordMatches")}
                  </S.FieldHint>
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
                <span>
                  {pending
                    ? tRecovery("changing")
                    : tRecovery("changePassword")}
                </span>
                <span aria-hidden="true">↗</span>
              </S.SubmitButton>
            </S.Form>
          )}
          <S.Rule />
          <S.Steps aria-label={tRecovery("stepsLabel")}>
            <span>01 · {tRecovery("requestEmailStep")}</span>
            <span>—</span>
            <span data-active="true">02 · {tRecovery("newPasswordStep")}</span>
          </S.Steps>
        </S.FormContainer>
      </S.FormSide>
    </S.Shell>
  );
}
