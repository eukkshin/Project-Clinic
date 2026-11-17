"use client";

import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";

import { defaultLocale, isAppLocale } from "@/i18n/config";
import { API_ORIGIN } from "@/lib/api/config";

const Wrapper = styled.section`
  margin-top: 24px;
  padding: 22px;
  border: 1px solid #e1e8dc;
  border-radius: 12px;
  color: #2b4836;
  h3 {
    margin: 0 0 8px;
    font-size: 18px;
  }
  p {
    font-size: 13px;
    line-height: 1.7;
  }
  label {
    display: block;
    font-size: 13px;
    margin: 12px 0 6px;
  }
  input {
    box-sizing: border-box;
    width: 100%;
    max-width: 400px;
    min-height: 42px;
    padding: 8px 12px;
    border: 1px solid #cad8ca;
    border-radius: 7px;
  }
  button {
    margin: 8px 8px 0 0;
    padding: 10px 14px;
    border: 1px solid #3f6650;
    border-radius: 7px;
    background: #fff;
    color: #21422d;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.45;
    cursor: wait;
  }
`;

type Provider = "kakao" | "naver" | "google";
const unlinkLabels = {
  ko: "연결 해제",
  en: "Disconnect",
  ja: "連携解除",
  "zh-CN": "解除关联",
  "zh-TW": "解除綁定",
} as const;
const providers: Provider[] = ["kakao", "naver", "google"];
const providerNames = {
  kakao: "providerKakao",
  naver: "providerNaver",
  google: "providerGoogle",
} as const;

export default function SocialConnections() {
  const t = useTranslations("SocialAuth");
  const activeLocale = useLocale();
  const locale = isAppLocale(activeLocale) ? activeLocale : defaultLocale;
  const [linked, setLinked] = useState<Provider[]>([]);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [linkedNotice, setLinkedNotice] = useState(false);

  useEffect(() => {
    setLinkedNotice(
      new URLSearchParams(window.location.search).get("social") === "linked",
    );
  }, []);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SOCIAL_AUTH_ENABLED !== "true") return;
    const abort = new AbortController();
    void fetch(`${API_ORIGIN}/api/auth/social/connections`, {
      credentials: "include",
      signal: abort.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("unavailable");
        const result = (await response.json()) as {
          providers?: { provider: Provider }[];
        };
        setLinked((result.providers ?? []).map((item) => item.provider));
      })
      .catch(() => {
        if (!abort.signal.aborted) setError(t("errorGeneric"));
      });
    return () => abort.abort();
  }, [t]);

  if (process.env.NEXT_PUBLIC_SOCIAL_AUTH_ENABLED !== "true") return null;

  async function link(event: FormEvent, provider: Provider) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch(
        `${API_ORIGIN}/api/auth/social/${provider}/link/start?locale=${encodeURIComponent(locale)}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword: password }),
        },
      );
      const data = (await response.json()) as {
        authorizationUrl?: string;
        errorCode?: string;
      };
      if (!response.ok || !data.authorizationUrl) {
        setError(
          data.errorCode === "SOCIAL_REAUTH_REQUIRED"
            ? t("reauthRequired")
            : t("errorGeneric"),
        );
        return;
      }
      // The backend returns a URL pinned to a known provider, never user-supplied input.
      window.location.assign(data.authorizationUrl);
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setPending(false);
      setPassword("");
    }
  }

  async function unlink(provider: Provider) {
    if (pending || !password) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch(
        `${API_ORIGIN}/api/auth/social/${provider}/unlink`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword: password }),
        },
      );
      if (!response.ok) {
        setError(
          response.status === 401 ? t("reauthRequired") : t("errorGeneric"),
        );
        return;
      }
      setLinked((previous) => previous.filter((item) => item !== provider));
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setPending(false);
      setPassword("");
    }
  }

  return (
    <Wrapper>
      <h3>{t("linkedAccounts")}</h3>
      <p>{t("linkHelp")}</p>
      {linkedNotice && <p role="status">{t("linkSuccess")}</p>}
      <form
        onSubmit={(event) => {
          const submitter = (event.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement | null;
          if (submitter?.value) void link(event, submitter.value as Provider);
        }}
      >
        <label htmlFor="social-current-password">{t("currentPassword")}</label>
        <input
          id="social-current-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <div>
          {providers.map((provider) => (
            <button
              type="submit"
              name="provider"
              value={provider}
              key={provider}
              disabled={pending || linked.includes(provider) || !password}
            >
              {t(providerNames[provider])} —{" "}
              {linked.includes(provider) ? t("connected") : t("linkAccount")}
            </button>
          ))}
        </div>
      </form>
      <div aria-label={t("linkedAccounts")}>
        {providers
          .filter((provider) => linked.includes(provider))
          .map((provider) => (
            <button
              key={provider}
              type="button"
              disabled={pending || !password}
              onClick={() => void unlink(provider)}
            >
              {t(providerNames[provider])} — {unlinkLabels[locale]}
            </button>
          ))}
      </div>
      {error && <p role="alert">{error}</p>}
    </Wrapper>
  );
}
