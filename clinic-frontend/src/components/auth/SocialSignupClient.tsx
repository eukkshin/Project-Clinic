"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";

import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import AuthLanguageSwitcher from "@/components/i18n/AuthLanguageSwitcher";
import { AppLocale, defaultLocale, isAppLocale } from "@/i18n/config";
import { localizedPath } from "@/i18n/url";
import { API_ORIGIN } from "@/lib/api/config";
import {
  CONSENT_POLICY_VERSION,
  registrationConsentCopy,
} from "@/lib/auth/registrationConsent";
import * as S from "@/styles/auth/Auth.styles";

const copy = {
  ko: {
    heading: "소셜 회원가입 완료",
    intro:
      "소셜 계정 인증이 완료되었습니다. 회원 정보를 입력하고 약관을 확인해 주세요.",
    name: "이름",
    id: "로그인 아이디",
    password: "비밀번호 (8자 이상)",
    confirm: "비밀번호 확인",
    email: "이메일",
    phone: "휴대전화번호 (선택)",
    submit: "회원가입 완료",
    pending: "인증 상태를 확인하고 있습니다.",
    expired:
      "소셜 인증이 만료되었거나 유효하지 않습니다. 로그인부터 다시 진행해 주세요.",
    mismatch: "비밀번호가 일치하지 않습니다.",
    bad: "입력 내용을 확인해 주세요.",
    fail: "가입을 완료하지 못했습니다. 다시 시도해 주세요.",
    conflict:
      "이미 사용 중인 회원 정보입니다. 기존 계정으로 로그인하여 소셜 계정을 연결해 주세요.",
    terms: "이용약관",
    privacy: "개인정보처리방침",
    login: "로그인으로 돌아가기",
    working: "처리 중...",
  },
  en: {
    heading: "Complete social sign-up",
    intro:
      "Your social account was verified. Enter your member details and review the policies.",
    name: "Name",
    id: "Username",
    password: "Password (8+ characters)",
    confirm: "Confirm password",
    email: "Email",
    phone: "Phone (optional)",
    submit: "Create account",
    pending: "Checking your sign-up session.",
    expired: "Your social sign-up session expired. Please start again.",
    mismatch: "Passwords do not match.",
    bad: "Please check the form.",
    fail: "Could not complete sign-up. Try again.",
    conflict:
      "Account information already in use. Sign in to link your social account.",
    terms: "Terms",
    privacy: "Privacy policy",
    login: "Back to sign-in",
    working: "Submitting...",
  },
  ja: {
    heading: "ソーシャル会員登録",
    intro:
      "アカウント認証が完了しました。会員情報を入力し、規約をご確認ください。",
    name: "氏名",
    id: "ログインID",
    password: "パスワード（8文字以上）",
    confirm: "パスワード確認",
    email: "メール",
    phone: "電話番号（任意）",
    submit: "登録する",
    pending: "認証情報を確認しています。",
    expired: "認証期限が切れました。ログインからやり直してください。",
    mismatch: "パスワードが一致しません。",
    bad: "入力内容をご確認ください。",
    fail: "登録できませんでした。もう一度お試しください。",
    conflict:
      "この会員情報は使用済みです。既存のアカウントでログインして連携してください。",
    terms: "利用規約",
    privacy: "個人情報保護方針",
    login: "ログインへ",
    working: "処理中...",
  },
  "zh-CN": {
    heading: "完成社交账号注册",
    intro: "已验证社交账号，请填写会员资料并阅读条款。",
    name: "姓名",
    id: "登录账号",
    password: "密码（至少8位）",
    confirm: "确认密码",
    email: "电子邮箱",
    phone: "手机号码（选填）",
    submit: "完成注册",
    pending: "正在检查认证状态。",
    expired: "认证已过期，请重新登录。",
    mismatch: "两次输入的密码不一致。",
    bad: "请检查填写的信息。",
    fail: "注册失败，请重试。",
    conflict: "会员信息已被使用，请登录现有账号后进行关联。",
    terms: "服务条款",
    privacy: "隐私政策",
    login: "返回登录",
    working: "提交中...",
  },
  "zh-TW": {
    heading: "完成社群帳號註冊",
    intro: "社群帳號驗證成功，請填寫會員資料並閱讀條款。",
    name: "姓名",
    id: "登入帳號",
    password: "密碼（至少8字元）",
    confirm: "確認密碼",
    email: "電子郵件",
    phone: "手機號碼（選填）",
    submit: "完成註冊",
    pending: "正在確認驗證狀態。",
    expired: "驗證已過期，請重新登入。",
    mismatch: "兩次密碼不一致。",
    bad: "請確認輸入內容。",
    fail: "註冊失敗，請重試。",
    conflict: "會員資料已被使用，請登入既有帳號後綁定。",
    terms: "服務條款",
    privacy: "隱私權政策",
    login: "返回登入",
    working: "處理中...",
  },
} satisfies Record<AppLocale, Record<string, string>>;

const SocialForm = styled(S.Form)`
  gap: 23px;
`;

const SocialLegal = styled.section`
  padding: 22px;
  border: 1px solid #e1e8de;
  border-radius: 10px;
  background: #fafbf8;
  display: grid;
  gap: 15px;

  p {
    color: #829386;
    font-size: 11px;
    line-height: 1.8;
    margin: -9px 0 3px 26px;
  }
  a {
    color: #466a51;
    text-underline-offset: 3px;
  }
  @media (max-width: 540px) {
    padding: 17px;
  }
`;

const SocialProvider = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 9px 13px;
  border: 1px solid #dce7d9;
  border-radius: 6px;
  background: #f0f5ed;
  color: #345840;
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.08em;
  margin: 0 0 19px;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #60846a;
  }
`;

const SocialStatus = styled.p<{ $error?: boolean }>`
  margin: 0 0 24px;
  color: ${({ $error }) => ($error ? "#ad5b53" : "#829386")};
  font-size: 13px;
  line-height: 1.85;
`;

type FormData = {
  userName: string;
  userId: string;
  userPw: string;
  confirm: string;
  email: string;
  phone: string;
  terms: boolean;
  privacy: boolean;
  marketingEmail: boolean;
  marketingSms: boolean;
};
const initial: FormData = {
  userName: "",
  userId: "",
  userPw: "",
  confirm: "",
  email: "",
  phone: "",
  terms: false,
  privacy: false,
  marketingEmail: false,
  marketingSms: false,
};

export default function SocialSignupClient() {
  const rawLocale = useLocale();
  const locale = isAppLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = copy[locale];
  const legal = registrationConsentCopy[locale];
  const [ready, setReady] = useState(false);
  const [provider, setProvider] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<FormData>(initial);
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SOCIAL_AUTH_ENABLED !== "true") {
      setError(t.expired);
      return;
    }
    const abort = new AbortController();
    fetch(`${API_ORIGIN}/api/auth/social/signup/pending`, {
      credentials: "include",
      signal: abort.signal,
    })
      .then(async (r) => {
        if (!r.ok) throw Error("expired");
        return r.json() as Promise<{ provider: string }>;
      })
      .then((result) => {
        if (!abort.signal.aborted) {
          setProvider(result.provider);
          setReady(true);
        }
      })
      .catch(() => {
        if (!abort.signal.aborted) setError(t.expired);
      });
    return () => abort.abort();
  }, [t.expired]);
  const set = (key: keyof FormData, value: string | boolean) =>
    setData((prev) => ({ ...prev, [key]: value }));
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || !ready) return;
    if (data.userPw !== data.confirm) {
      setError(t.mismatch);
      return;
    }
    if (!data.terms || !data.privacy || (data.marketingSms && !data.phone)) {
      setError(t.bad);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        `${API_ORIGIN}/api/auth/social/signup/complete`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: data.userName.trim(),
            userId: data.userId.trim(),
            userPw: data.userPw,
            email: data.email.trim(),
            phone: data.phone.trim(),
            consents: {
              terms: { agreed: data.terms, version: CONSENT_POLICY_VERSION },
              privacyNotice: {
                acknowledged: data.privacy,
                version: CONSENT_POLICY_VERSION,
              },
              marketingEmail: data.marketingEmail,
              marketingSms: data.marketingSms,
            },
          }),
        },
      );
      const result = (await response.json()) as {
        errorCode?: string;
        message?: string;
      };
      if (!response.ok) {
        setError(
          result.errorCode === "SOCIAL_SIGNUP_CONFLICT" ||
            result.errorCode === "SOCIAL_ACCOUNT_ALREADY_LINKED"
            ? t.conflict
            : result.errorCode === "SOCIAL_SIGNUP_EXPIRED"
              ? t.expired
              : result.message || t.fail,
        );
        return;
      }
      window.dispatchEvent(new Event("login-success"));
      window.location.replace(localizedPath("/", locale));
    } catch {
      setError(t.fail);
    } finally {
      setBusy(false);
    }
  }
  return (
    <S.RegisterShell data-lenis-prevent>
      <S.RegisterLayout>
        <AuthBrandPanel mode="register" />
        <S.FormSurface aria-labelledby="social-register-title">
          <S.FormContent>
            <S.Topline>
              <span>JOIN AHN&apos;S / SOCIAL</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <AuthLanguageSwitcher />
                <S.TextLink href={localizedPath("/register/login", locale)}>
                  {t.login} ↗
                </S.TextLink>
              </div>
            </S.Topline>

            <S.Kicker>BEGIN YOUR JOURNEY</S.Kicker>
            <S.Heading id="social-register-title">{t.heading}</S.Heading>
            <S.Lead>{t.intro}</S.Lead>
            {ready && <SocialProvider>{provider.toUpperCase()}</SocialProvider>}
            {!ready && (
              <SocialStatus $error={Boolean(error)} role="status">
                {error || t.pending}
              </SocialStatus>
            )}

            {ready && (
              <SocialForm onSubmit={submit}>
                <S.FormSection>
                  <S.SectionHeading>{t.heading}</S.SectionHeading>
                  <S.FieldGrid>
                    <S.Field>
                      <S.Label htmlFor="social-user-name">{t.name}</S.Label>
                      <S.TextInput
                        id="social-user-name"
                        required
                        maxLength={50}
                        autoComplete="name"
                        value={data.userName}
                        onChange={(e) => set("userName", e.target.value)}
                      />
                    </S.Field>
                    <S.Field>
                      <S.Label htmlFor="social-user-id">{t.id}</S.Label>
                      <S.TextInput
                        id="social-user-id"
                        required
                        minLength={3}
                        maxLength={50}
                        autoComplete="username"
                        value={data.userId}
                        onChange={(e) => set("userId", e.target.value)}
                      />
                    </S.Field>
                  </S.FieldGrid>
                  <S.FieldGrid>
                    <S.Field>
                      <S.Label htmlFor="social-user-password">
                        {t.password}
                      </S.Label>
                      <S.TextInput
                        id="social-user-password"
                        required
                        minLength={8}
                        maxLength={72}
                        type="password"
                        autoComplete="new-password"
                        value={data.userPw}
                        onChange={(e) => set("userPw", e.target.value)}
                      />
                    </S.Field>
                    <S.Field>
                      <S.Label htmlFor="social-confirm-password">
                        {t.confirm}
                      </S.Label>
                      <S.TextInput
                        id="social-confirm-password"
                        required
                        type="password"
                        autoComplete="new-password"
                        value={data.confirm}
                        onChange={(e) => set("confirm", e.target.value)}
                      />
                    </S.Field>
                  </S.FieldGrid>
                  <S.Field>
                    <S.Label htmlFor="social-user-email">{t.email}</S.Label>
                    <S.TextInput
                      id="social-user-email"
                      required
                      type="email"
                      maxLength={100}
                      autoComplete="email"
                      value={data.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </S.Field>
                  <S.Field>
                    <S.Label htmlFor="social-user-phone">{t.phone}</S.Label>
                    <S.TextInput
                      id="social-user-phone"
                      type="tel"
                      maxLength={20}
                      autoComplete="tel"
                      value={data.phone}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </S.Field>
                </S.FormSection>

                <S.FormSection>
                  <S.SectionHeading>
                    {t.terms} · {t.privacy}
                  </S.SectionHeading>
                  <SocialLegal>
                    <S.CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={data.terms}
                        onChange={(e) => set("terms", e.target.checked)}
                      />
                      <span>
                        {legal.termsLabel} ({legal.required})
                      </span>
                    </S.CheckboxLabel>
                    <p>
                      {legal.termsSummary}{" "}
                      <Link
                        href={localizedPath("/terms", locale)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t.terms}
                      </Link>
                    </p>
                    <S.CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={data.privacy}
                        onChange={(e) => set("privacy", e.target.checked)}
                      />
                      <span>
                        {legal.privacyLabel} ({legal.required})
                      </span>
                    </S.CheckboxLabel>
                    <p>
                      {legal.privacySummary}{" "}
                      <Link
                        href={localizedPath("/privacy", locale)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t.privacy}
                      </Link>
                    </p>
                    <S.CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={data.marketingEmail}
                        onChange={(e) =>
                          set("marketingEmail", e.target.checked)
                        }
                      />
                      <span>
                        {legal.emailMarketing} ({legal.optional})
                      </span>
                    </S.CheckboxLabel>
                    <S.CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={data.marketingSms}
                        onChange={(e) => set("marketingSms", e.target.checked)}
                      />
                      <span>
                        {legal.smsMarketing} ({legal.optional})
                      </span>
                    </S.CheckboxLabel>
                    <p>{legal.notice}</p>
                  </SocialLegal>
                </S.FormSection>

                {error && (
                  <SocialStatus $error role="alert">
                    {error}
                  </SocialStatus>
                )}
                <S.Button type="submit" disabled={busy}>
                  {busy ? t.working : t.submit}
                </S.Button>
              </SocialForm>
            )}
            <S.FormFooter>
              <S.TextLink href={localizedPath("/register/login", locale)}>
                {t.login} ↗
              </S.TextLink>
            </S.FormFooter>
          </S.FormContent>
        </S.FormSurface>
      </S.RegisterLayout>
    </S.RegisterShell>
  );
}
