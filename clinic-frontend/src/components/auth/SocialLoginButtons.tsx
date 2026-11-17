"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { defaultLocale, isAppLocale } from "@/i18n/config";
import { localizedPath } from "@/i18n/url";
import { API_ORIGIN } from "@/lib/api/config";

const Box = styled.div`
  display: grid;
  gap: 9px;
  margin-top: 22px;
  min-width: 0;
`;
const Lead = styled.p`
  margin: 0 0 4px;
  text-align: center;
  font-size: 12px;
  color: #6a756a;
`;
const ProviderButton = styled.button<{ $provider: string }>`
  min-height: 46px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid
    ${({ $provider }) => ($provider === "google" ? "#dadce0" : "transparent")};
  background: ${({ $provider }) =>
    $provider === "kakao"
      ? "#fee500"
      : $provider === "naver"
        ? "#03c75a"
        : "#fff"};
  color: ${({ $provider }) => ($provider === "naver" ? "#fff" : "#222")};
  font-size: 13px;
  font-weight: 600;
  transition: opacity 160ms ease;
  &:hover:not(:disabled) {
    opacity: 0.83;
  }
  &:disabled {
    opacity: 0.5;
    cursor: wait;
  }
  &:focus-visible {
    outline: 2px solid #325e42;
    outline-offset: 2px;
  }
`;

export default function SocialLoginButtons() {
  const t = useTranslations("SocialAuth");
  const activeLocale = useLocale();
  const locale = isAppLocale(activeLocale) ? activeLocale : defaultLocale;
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("social");
    if (code === "success") {
      window.dispatchEvent(new Event("login-success"));
      window.location.replace(localizedPath("/", locale));
    } else if (code) {
      setResult(code);
    }
  }, [locale]);

  const resultMessage = {
    invalidState: "errorInvalidState",
    cancelled: "errorCancelled",
    errorProvider: "errorProvider",
    errorGeneric: "errorGeneric",
    alreadyLinked: "errorAlreadyLinked",
    existingAccount: "existingAccountLead",
  } as const;
  const statusKey =
    result && result in resultMessage
      ? resultMessage[result as keyof typeof resultMessage]
      : "errorGeneric";

  // Do not expose nonfunctional buttons before the backend and provider apps are configured.
  if (process.env.NEXT_PUBLIC_SOCIAL_AUTH_ENABLED !== "true") return null;

  return (
    <Box aria-label={t("sectionLabel")}>
      {result && <Lead role="status">{t(statusKey)}</Lead>}
      <Lead>{t("sectionLabel")}</Lead>
      {(["kakao", "naver", "google"] as const).map((provider) => (
        <ProviderButton
          key={provider}
          type="button"
          $provider={provider}
          disabled={pending}
          onClick={() => {
            setPending(true);
            const url = new URL(
              `${API_ORIGIN}/api/auth/social/${provider}/start`,
            );
            url.searchParams.set("locale", locale);
            window.location.assign(url.href);
          }}
        >
          {pending ? t("redirecting") : t(provider)}
        </ProviderButton>
      ))}
    </Box>
  );
}
