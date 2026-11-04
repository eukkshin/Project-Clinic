"use client";

import { useLocale } from "next-intl";

import LanguageDropdown from "@/components/dropdown/LanguageDropdown";
import { localeToLanguage } from "@/i18n/config";

import { useChangeLocale } from "./useChangeLocale";

export default function LanguageDropdownI18n({
  transparent = false,
  onChange,
}: {
  transparent?: boolean;
  onChange?: (language: string) => void;
}) {
  // 현재 사이트에 적용된 언어
  const locale = useLocale();

  // en -> EN, ja -> JP, zh-CN -> CN 등
  const currentLanguage = localeToLanguage(locale);

  const changeLocale = useChangeLocale();

  return (
    <LanguageDropdown
      transparent={transparent}
      defaultLanguage={currentLanguage}
      onChange={(language) => {
        void changeLocale(language)
          .then(() => {
            onChange?.(language);
          })
          .catch((error: unknown) => {
            console.error("AHNS language change failed:", error);
          });
      }}
    />
  );
}
