"use client";

import { useLocale, useTranslations } from "next-intl";

/** Optional visual verification; remove or stop rendering after testing. */
export default function I18nTextExample() {
  const t = useTranslations("Common");
  const locale = useLocale();
  return <p lang={locale}>{t("welcome")}</p>;
}
