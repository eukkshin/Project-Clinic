"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { FormEvent, useState } from "react";

import AuthLanguageSwitcher from "@/components/i18n/AuthLanguageSwitcher";
import { API_ORIGIN } from "@/lib/api/config";
import * as S from "@/styles/auth/PasswordRecovery.styles";

type ApiResponse = { success?: boolean; message?: string };

export default function FindPasswordForm() {
  const tRecovery = useTranslations("PasswordRecovery");
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
      setError(tRecovery("idAndEmailRequired"));
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
      if (!response.ok) throw new Error(data.message || tRecovery("tryAgain"));
      setSubmitted(true);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : tRecovery("requestError"),
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
        <S.StoryDescription>{tRecovery("findStory")}</S.StoryDescription>
        <S.BrandSignature>AHNS.</S.BrandSignature>
      </S.Story>
      <S.FormSide>
        <div style={{ position: "fixed", top: 18, right: 22, zIndex: 99 }}>
          <AuthLanguageSwitcher />
        </div>
        <S.FormContainer>
          <S.StepLabel>ACCOUNT RECOVERY / 01</S.StepLabel>
          <S.FormTitle>{tRecovery("findTitle")}</S.FormTitle>
          <S.FormDescription>{tRecovery("findDescription")}</S.FormDescription>
          {submitted ? (
            <S.Notice role="status">{tRecovery("sentNotice")}</S.Notice>
          ) : (
            <S.Form onSubmit={onSubmit} noValidate>
              <S.Field>
                <S.FieldLabel htmlFor="recovery-id">
                  {tRecovery("userId")}
                </S.FieldLabel>
                <S.Input
                  id="recovery-id"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder={tRecovery("idPlaceholder")}
                  autoComplete="username"
                  required
                  maxLength={50}
                  disabled={pending}
                />
              </S.Field>
              <S.Field>
                <S.FieldLabel htmlFor="recovery-email">
                  {tRecovery("email")}
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
                <span>
                  {pending ? tRecovery("processing") : tRecovery("requestLink")}
                </span>
                <span aria-hidden="true">↗</span>
              </S.SubmitButton>
            </S.Form>
          )}
          <S.Rule />
          <S.Steps aria-label={tRecovery("stepsLabel")}>
            <span data-active="true">01 · {tRecovery("requestEmailStep")}</span>
            <span>—</span>
            <span>02 · {tRecovery("newPasswordStep")}</span>
          </S.Steps>
          <S.SecondaryLink as={Link} href="/register/login">
            ← {tRecovery("backToLogin")}
          </S.SecondaryLink>
        </S.FormContainer>
      </S.FormSide>
    </S.Shell>
  );
}
