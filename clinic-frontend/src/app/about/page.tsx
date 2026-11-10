import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

import { normalizeLocale } from "@/i18n/config";
import { localizedPath } from "@/i18n/url";

export default async function AboutPage() {
  const locale = normalizeLocale(await getLocale()) || "ko";
  redirect(localizedPath("/about/brand", locale));
}
