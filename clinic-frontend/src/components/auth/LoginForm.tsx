"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

import { Popup } from "@/components/ui/Popup";
import { defaultLocale, isAppLocale } from "@/i18n/config";
import { localizedPath } from "@/i18n/url";
import { API_ORIGIN } from "@/lib/api/config";
import * as S from "@/styles/auth/Auth.styles";

type LoginResponse = {
  isAdmin?: number | string | boolean;
  userName?: string;
  message?: string;
};

type PopupInfo = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
};

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const activeLocale = useLocale();
  const locale = isAppLocale(activeLocale) ? activeLocale : defaultLocale;
  const [data, setData] = useState({ userId: "", userPw: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [popup, setPopup] = useState<PopupInfo>({
    isOpen: false,
    title: "",
    message: "",
  });
  const openPopup = (title: string, message: string, onConfirm?: () => void) =>
    setPopup({ isOpen: true, title, message, onConfirm });
  const closePopup = () => setPopup((state) => ({ ...state, isOpen: false }));

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    if (name !== "userId" && name !== "userPw") return;
    setData((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if (!data.userId.trim() || !data.userPw) {
      openPopup(t("inputError"), t("idPwRequired"));
      return;
    }

    setPending(true);
    try {
      // Preserve the existing Express /api/login contract and session cookie.
      const response = await fetch(`${API_ORIGIN}/api/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: data.userId.trim(),
          userPw: data.userPw,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as LoginResponse;
      if (!response.ok) {
        openPopup(t("loginFailed"), result.message || t("loginFailedMsg"));
        return;
      }

      const isAdmin = Number(result.isAdmin) === 1;
      if (!isAdmin) {
        if (result.userName) localStorage.setItem("userName", result.userName);
        window.dispatchEvent(new Event("login-success"));
      }
      openPopup(
        t("loginSuccess"),
        isAdmin ? t("adminSuccessMsg") : t("loginSuccessMsg"),
        () => {
          closePopup();
          setData({ userId: "", userPw: "" });
          if (isAdmin) {
            router.push("/admin");
          } else if (onSuccess) {
            onSuccess();
            router.refresh();
          } else {
            router.push(localizedPath("/", locale));
          }
        },
      );
    } catch (error) {
      console.error("Member sign-in failed", error);
      openPopup(t("serverError"), t("serverErrorMsg"));
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <S.Form onSubmit={handleSubmit} noValidate>
        <S.Field>
          <S.Label htmlFor={onSuccess ? "dialog-login-id" : "page-login-id"}>
            {t("id")}
          </S.Label>
          <S.TextInput
            id={onSuccess ? "dialog-login-id" : "page-login-id"}
            name="userId"
            value={data.userId}
            onChange={handleChange}
            autoComplete="username"
            placeholder={t("idPlaceholder")}
            autoFocus={Boolean(onSuccess)}
            maxLength={80}
            disabled={pending}
          />
        </S.Field>
        <S.Field>
          <S.Label htmlFor={onSuccess ? "dialog-login-pw" : "page-login-pw"}>
            {t("password")}
          </S.Label>
          <S.InputWrap>
            <S.InputWithButton
              id={onSuccess ? "dialog-login-pw" : "page-login-pw"}
              type={showPassword ? "text" : "password"}
              name="userPw"
              value={data.userPw}
              onChange={handleChange}
              placeholder={t("passwordPlaceholder")}
              autoComplete="current-password"
              disabled={pending}
            />
            <S.InsideButton
              type="button"
              aria-pressed={showPassword}
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? t("hide") : t("show")}
            </S.InsideButton>
          </S.InputWrap>
        </S.Field>
        <S.FormLinks>
          <S.TextLink href={localizedPath("/find", locale)}>
            {t("forgot")}
          </S.TextLink>
        </S.FormLinks>
        <S.Button type="submit" disabled={pending}>
          {pending ? t("loggingIn") : t("loginAction") + "  ↗"}
        </S.Button>
      </S.Form>
      <S.FormFooter>
        {t("newMember")}{" "}
        <S.TextLink href={localizedPath("/register/terms", locale)}>
          {t("join")} →
        </S.TextLink>
      </S.FormFooter>
      <Popup
        isOpen={popup.isOpen}
        title={popup.title}
        onClose={closePopup}
        onConfirm={popup.onConfirm}
      >
        {popup.message}
      </Popup>
    </>
  );
}
