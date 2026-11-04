"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";

import {
  accountApi,
  AccountPreferences,
  AccountProfile,
} from "@/lib/mypage/account-settings-api";
import * as S from "@/styles/mypage/AccountSettings.styles";
import * as M from "@/styles/mypage/MyPage.styles";

import AccountWithdrawal from "./AccountWithdrawal";

type Tab = "profile" | "password" | "preferences" | "withdraw";
const menus = [
  { href: "/mypage", key: "navProfile" },
  { href: "/mypage/reservations", key: "navReservations" },
  { href: "/mypage/consultations", key: "navConsultations" },
  { href: "/mypage/accountsettings", key: "navSettings" },
];
function showDate(
  value: string | null | undefined,
  locale: string,
  missing: string,
) {
  if (!value) return missing;
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d);
}
function errorText(e: unknown, fallback: string) {
  return e instanceof Error ? e.message : fallback;
}
function newPasswordValid(value: string) {
  return value.length >= 10 && new TextEncoder().encode(value).length <= 72;
}

export default function AccountSettingsClient() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("AccountSettings");
  const my = useTranslations("MyPage");
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [savedPreferences, setSavedPreferences] =
    useState<AccountPreferences | null>(null);
  const [draftPreferences, setDraftPreferences] = useState<AccountPreferences>({
    mailAgreed: false,
    snsAgreed: false,
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [prefError, setPrefError] = useState("");
  const [prefSuccess, setPrefSuccess] = useState("");
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [currentEmailPassword, setCurrentEmailPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [confirmToken, setConfirmToken] = useState("");
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setLoadError("");
      try {
        const [p, pref] = await Promise.all([
          accountApi.getProfile(signal),
          accountApi.getPreferences(signal),
        ]);
        if (signal?.aborted) return;
        setProfile(p);
        setSavedPreferences(pref);
        setDraftPreferences(pref);
      } catch (e) {
        if (!signal?.aborted) setLoadError(errorText(e, t("requestFailed")));
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [t],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    // 이메일 인증 링크의 일회성 토큰을 화면 상태로만 보관하고 URL에서는 즉시 제거.
    const params = new URLSearchParams(window.location.search);
    const token = params.get("emailToken");
    if (token) {
      setConfirmToken(token);
      setTab("profile");
      const clean = new URL(window.location.href);
      clean.searchParams.delete("emailToken");
      window.history.replaceState(
        window.history.state,
        "",
        clean.pathname + clean.search + clean.hash,
      );
    }
    return () => controller.abort();
  }, [load]);

  async function submitEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (emailBusy) return;
    setEmailError("");
    setEmailSuccess("");
    const normalizedEmail = newEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setEmailError(t("emailInvalid"));
      return;
    }
    if (!currentEmailPassword) {
      setEmailError(t("currentPasswordRequired"));
      return;
    }
    setEmailBusy(true);
    try {
      await accountApi.requestEmailChange(
        currentEmailPassword,
        normalizedEmail,
      );
      setEmailSuccess(t("emailSent"));
      setCurrentEmailPassword("");
      setNewEmail("");
    } catch (error) {
      setEmailError(errorText(error, t("requestFailed")));
    } finally {
      setEmailBusy(false);
    }
  }

  async function confirmEmail() {
    if (!confirmToken || confirmBusy) return;
    setEmailError("");
    setEmailSuccess("");
    setConfirmBusy(true);
    try {
      const result = await accountApi.confirmEmailChange(confirmToken);
      setConfirmToken("");
      setEmailSuccess(t("emailChanged", { email: result.email }));
      await load();
    } catch (error) {
      setEmailError(errorText(error, t("requestFailed")));
    } finally {
      setConfirmBusy(false);
    }
  }

  async function submitPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (passwordBusy) return;
    setPasswordError("");
    if (!oldPassword) {
      setPasswordError(t("currentPasswordRequired"));
      return;
    }
    if (!newPasswordValid(newPassword)) {
      setPasswordError(t("passwordTooShort"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t("passwordMismatch"));
      return;
    }
    setPasswordBusy(true);
    try {
      await accountApi.changePassword(oldPassword, newPassword);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // 현재 세션이 서버에서 해제되므로 헤더 사용자 표시를 초기화합니다.
      window.localStorage.removeItem("userName");
      window.dispatchEvent(new Event("logout-success"));
      router.replace("/register/login");
      router.refresh();
    } catch (error) {
      setPasswordError(errorText(error, t("requestFailed")));
    } finally {
      setPasswordBusy(false);
    }
  }

  async function submitPreferences(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (savingPrefs || !savedPreferences) return;
    setPrefError("");
    setPrefSuccess("");
    setSavingPrefs(true);
    try {
      const result = await accountApi.setPreferences(draftPreferences);
      setSavedPreferences(result);
      setDraftPreferences(result);
      setPrefSuccess(t("prefSaved"));
    } catch (error) {
      setPrefError(errorText(error, t("requestFailed")));
    } finally {
      setSavingPrefs(false);
    }
  }

  const dirtyPrefs =
    savedPreferences &&
    (savedPreferences.mailAgreed !== draftPreferences.mailAgreed ||
      savedPreferences.snsAgreed !== draftPreferences.snsAgreed);

  return (
    <M.Root>
      <M.Hero>
        <M.HeroInner>
          <M.Eyebrow>PRIVATE MEMBERSHIP — AHNS</M.Eyebrow>
          <M.HeroTitle>
            Account <em>Settings.</em>
          </M.HeroTitle>
          <M.HeroDescription>{t("heroDesc")}</M.HeroDescription>
        </M.HeroInner>
      </M.Hero>
      <M.MainGrid>
        <M.Sidebar>
          <M.SidebarEyebrow>PRIVATE MEMBERSHIP</M.SidebarEyebrow>
          <M.SidebarHeading>My AHNS</M.SidebarHeading>
          <M.SidebarDescription>
            {t("sidebar1")}
            <br /> {t("sidebar2")}
          </M.SidebarDescription>
          <M.SideNav aria-label={t("sideNav")}>
            {menus.map((item) => (
              <M.SideLink
                key={item.href}
                href={item.href}
                $active={item.href === "/mypage/accountsettings"}
                aria-current={
                  item.href === "/mypage/accountsettings" ? "page" : undefined
                }
              >
                {my(item.key)}
              </M.SideLink>
            ))}
          </M.SideNav>
        </M.Sidebar>

        <M.Content>
          <S.Intro>
            <S.IntroEyebrow>ACCOUNT MANAGEMENT / 01</S.IntroEyebrow>
            <S.IntroHeading>{t("introTitle")}</S.IntroHeading>
            <S.IntroDescription>{t("introDesc")}</S.IntroDescription>
          </S.Intro>
          <S.Tabs role="tablist" aria-label={t("settingsMenu")}>
            {(
              [
                ["profile", t("tabProfile")],
                ["password", t("tabPassword")],
                ["preferences", t("tabPreferences")],
                [
                  "withdraw",
                  (
                    {
                      ko: "회원탈퇴",
                      en: "Close account",
                      ja: "会員退会",
                      "zh-CN": "注销账户",
                      "zh-TW": "註銷帳戶",
                    } as Record<string, string>
                  )[locale] ?? "회원탈퇴",
                ],
              ] as const
            ).map(([key, label]) => (
              <S.Tab
                key={key}
                type="button"
                role="tab"
                $active={tab === key}
                aria-selected={tab === key}
                onClick={() => setTab(key)}
              >
                {label}
              </S.Tab>
            ))}
          </S.Tabs>
          {loading ? (
            <S.Panel role="status">{t("loading")}</S.Panel>
          ) : loadError ? (
            <S.Panel>
              <S.Alert $error role="alert">
                {loadError}
              </S.Alert>
              <M.ButtonRow>
                <M.PlainButton
                  type="button"
                  onClick={() => {
                    void load();
                  }}
                >
                  {t("retry")}
                </M.PlainButton>
                {(!profile || loadError.includes("로그인")) && (
                  <M.PrimaryLink href="/register/login">
                    {t("login")}
                  </M.PrimaryLink>
                )}
              </M.ButtonRow>
            </S.Panel>
          ) : (
            <>
              {tab === "profile" && (
                <>
                  <S.Panel>
                    <S.SectionEyebrow>
                      01 / PERSONAL INFORMATION
                    </S.SectionEyebrow>
                    <S.SectionTitle>{t("basicTitle")}</S.SectionTitle>
                    <S.SectionDescription>
                      {t("basicDesc")}
                    </S.SectionDescription>
                    <div>
                      <S.InfoRow>
                        <S.InfoName>{t("userId")}</S.InfoName>
                        <S.InfoContent>
                          {profile?.userId || "—"}{" "}
                          <S.Micro>{t("immutable")}</S.Micro>
                        </S.InfoContent>
                      </S.InfoRow>
                      <S.InfoRow>
                        <S.InfoName>{t("name")}</S.InfoName>
                        <S.InfoContent>
                          {profile?.name || "—"}{" "}
                          <S.Micro>{t("pendingVerify")}</S.Micro>
                        </S.InfoContent>
                      </S.InfoRow>
                      <S.InfoRow>
                        <S.InfoName>{t("phone")}</S.InfoName>
                        <S.InfoContent>
                          {profile?.phone || "—"}{" "}
                          <S.Micro>{t("pendingVerify")}</S.Micro>
                        </S.InfoContent>
                      </S.InfoRow>
                      <S.InfoRow>
                        <S.InfoName>{t("currentEmail")}</S.InfoName>
                        <S.InfoContent>
                          {profile?.email || t("notRegistered")}
                        </S.InfoContent>
                      </S.InfoRow>
                      <S.InfoRow>
                        <S.InfoName>{t("joined")}</S.InfoName>
                        <S.InfoContent>
                          {showDate(profile?.joinedAt, locale, t("noInfo"))}
                        </S.InfoContent>
                      </S.InfoRow>
                    </div>
                    <S.Note>{t("identityNote")}</S.Note>
                  </S.Panel>
                  <S.Panel>
                    <S.SectionEyebrow>02 / EMAIL VERIFICATION</S.SectionEyebrow>
                    <S.SectionTitle>{t("emailTitle")}</S.SectionTitle>
                    <S.SectionDescription>
                      {t("emailDesc")}
                    </S.SectionDescription>
                    {confirmToken && (
                      <S.Alert role="status">
                        {t("emailTokenNotice")}
                        <S.Actions>
                          <S.Primary
                            type="button"
                            onClick={() => {
                              void confirmEmail();
                            }}
                            disabled={confirmBusy}
                          >
                            {confirmBusy ? t("confirming") : t("confirmEmail")}
                          </S.Primary>
                        </S.Actions>
                      </S.Alert>
                    )}
                    {emailError && (
                      <S.Alert $error role="alert">
                        {emailError}
                      </S.Alert>
                    )}
                    {emailSuccess && (
                      <S.Alert role="status">{emailSuccess}</S.Alert>
                    )}
                    <form onSubmit={submitEmail}>
                      <S.FieldGrid>
                        <S.Field $full>
                          <S.FieldLabel htmlFor="as-email">
                            {t("newEmail")}
                          </S.FieldLabel>
                          <S.TextInput
                            id="as-email"
                            type="email"
                            placeholder="new-email@example.com"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            autoComplete="email"
                            maxLength={100}
                            required
                            disabled={emailBusy}
                          />
                        </S.Field>
                        <S.Field $full>
                          <S.FieldLabel htmlFor="as-email-pw">
                            {t("currentPassword")}
                          </S.FieldLabel>
                          <S.TextInput
                            id="as-email-pw"
                            type="password"
                            value={currentEmailPassword}
                            onChange={(e) =>
                              setCurrentEmailPassword(e.target.value)
                            }
                            autoComplete="current-password"
                            required
                            disabled={emailBusy}
                          />
                        </S.Field>
                      </S.FieldGrid>
                      <S.Actions>
                        <S.Primary type="submit" disabled={emailBusy}>
                          {emailBusy ? t("sending") : t("sendEmail")}
                        </S.Primary>
                      </S.Actions>
                    </form>
                    <S.Note>{t("emailNote")}</S.Note>
                  </S.Panel>
                </>
              )}

              {tab === "password" && (
                <S.Panel>
                  <S.SectionEyebrow>03 / ACCOUNT SECURITY</S.SectionEyebrow>
                  <S.SectionTitle>{t("tabPassword")}</S.SectionTitle>
                  <S.SectionDescription>
                    {t("passwordDesc")}
                  </S.SectionDescription>
                  {passwordError && (
                    <S.Alert $error role="alert">
                      {passwordError}
                    </S.Alert>
                  )}
                  <form onSubmit={submitPassword}>
                    <S.FieldGrid>
                      <S.Field $full>
                        <S.FieldLabel htmlFor="as-current-password">
                          {t("currentPassword")}
                        </S.FieldLabel>
                        <S.TextInput
                          id="as-current-password"
                          type="password"
                          autoComplete="current-password"
                          required
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          disabled={passwordBusy}
                        />
                      </S.Field>
                      <S.Field>
                        <S.FieldLabel htmlFor="as-new-password">
                          {t("newPassword")}
                        </S.FieldLabel>
                        <S.TextInput
                          id="as-new-password"
                          type="password"
                          autoComplete="new-password"
                          minLength={10}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={passwordBusy}
                        />
                      </S.Field>
                      <S.Field>
                        <S.FieldLabel htmlFor="as-confirm-password">
                          {t("confirmPassword")}
                        </S.FieldLabel>
                        <S.TextInput
                          id="as-confirm-password"
                          type="password"
                          autoComplete="new-password"
                          minLength={10}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={passwordBusy}
                        />
                      </S.Field>
                    </S.FieldGrid>
                    <S.Actions>
                      <S.Primary type="submit" disabled={passwordBusy}>
                        {passwordBusy ? t("changing") : t("changePassword")}
                      </S.Primary>
                    </S.Actions>
                  </form>
                  <S.Note>
                    {t("passwordNote")}{" "}
                    <Link href="/find">{t("passwordResetLink")}</Link>{" "}
                    {t("passwordNoteEnd")}
                  </S.Note>
                </S.Panel>
              )}

              {tab === "withdraw" && <AccountWithdrawal />}

              {tab === "preferences" && (
                <S.Panel>
                  <S.SectionEyebrow>
                    04 / COMMUNICATION PREFERENCES
                  </S.SectionEyebrow>
                  <S.SectionTitle>{t("prefTitle")}</S.SectionTitle>
                  <S.SectionDescription>{t("prefDesc")}</S.SectionDescription>
                  {prefError && (
                    <S.Alert $error role="alert">
                      {prefError}
                    </S.Alert>
                  )}
                  {prefSuccess && (
                    <S.Alert role="status">{prefSuccess}</S.Alert>
                  )}
                  <form onSubmit={submitPreferences}>
                    <S.ConsentRow>
                      <div>
                        <S.ConsentName>{t("emailNews")}</S.ConsentName>
                        <S.ConsentDescription>
                          {t("emailNewsDesc")}
                        </S.ConsentDescription>
                      </div>
                      <S.Switch
                        type="checkbox"
                        checked={draftPreferences.mailAgreed}
                        onChange={(e) => {
                          setPrefSuccess("");
                          setDraftPreferences((p) => ({
                            ...p,
                            mailAgreed: e.target.checked,
                          }));
                        }}
                        aria-label={t("emailNews")}
                        disabled={savingPrefs}
                      />
                    </S.ConsentRow>
                    <S.ConsentRow>
                      <div>
                        <S.ConsentName>{t("snsNews")}</S.ConsentName>
                        <S.ConsentDescription>
                          {t("snsNewsDesc")}
                        </S.ConsentDescription>
                      </div>
                      <S.Switch
                        type="checkbox"
                        checked={draftPreferences.snsAgreed}
                        onChange={(e) => {
                          setPrefSuccess("");
                          setDraftPreferences((p) => ({
                            ...p,
                            snsAgreed: e.target.checked,
                          }));
                        }}
                        aria-label={t("snsNews")}
                        disabled={savingPrefs}
                      />
                    </S.ConsentRow>
                    <S.Actions>
                      <S.Primary
                        type="submit"
                        disabled={!dirtyPrefs || savingPrefs}
                      >
                        {savingPrefs ? t("saving") : t("savePrefs")}
                      </S.Primary>
                    </S.Actions>
                  </form>
                  <S.Note>{t("prefNote")}</S.Note>
                </S.Panel>
              )}
            </>
          )}
          <M.Cards>
            <M.CardLink href="/mypage">
              <M.CardNumber>01</M.CardNumber>
              <M.CardTitle>{t("cardMypage")}</M.CardTitle>
              <M.CardDescription>{t("cardMypageDesc")}</M.CardDescription>
            </M.CardLink>
            <M.CardLink href="/mypage/reservations">
              <M.CardNumber>02</M.CardNumber>
              <M.CardTitle>{t("cardReservations")}</M.CardTitle>
              <M.CardDescription>{t("cardReservationsDesc")}</M.CardDescription>
            </M.CardLink>
          </M.Cards>
        </M.Content>
      </M.MainGrid>
    </M.Root>
  );
}
