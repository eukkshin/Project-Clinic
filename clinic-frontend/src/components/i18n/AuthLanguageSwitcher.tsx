"use client";

import { useLocale } from "next-intl";

import LanguageDropdown from "@/components/dropdown/LanguageDropdown";
import { useChangeLocale } from "@/components/i18n/useChangeLocale";
import { localeToLanguage } from "@/i18n/config";

export default function AuthLanguageSwitcher({
  inModal = false,
  beforeChange,
}: {
  inModal?: boolean;
  beforeChange?: () => void;
}) {
  const locale = useLocale();
  const changeLocale = useChangeLocale();
  return (
    <LanguageDropdown
      defaultLanguage={localeToLanguage(locale)}
      onChange={(language) => {
        beforeChange?.();
        if (inModal) sessionStorage.setItem("ahns:reopen-login-modal", "1");
        void changeLocale(language).catch((error: unknown) => {
          if (inModal) sessionStorage.removeItem("ahns:reopen-login-modal");
          console.error("Could not change authentication locale", error);
        });
      }}
    />
  );
}
