import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { localizedPath } from "@/i18n/url";
import { normalizeLocale } from "@/i18n/config";

export default async function AboutPage() {
  const locale = normalizeLocale(await getLocale()) || "ko";
  redirect(localizedPath("/about/brand", locale));
}
