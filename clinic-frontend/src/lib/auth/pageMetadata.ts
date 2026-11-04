import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type AuthPage = "login" | "register" | "find" | "reset";

const metadataKeys = {
  login: ["loginTitle", "loginDescription"],
  register: ["registerTitle", "registerDescription"],
  find: ["findTitleMeta", "findDescriptionMeta"],
  reset: ["resetTitleMeta", "resetDescriptionMeta"],
} as const;

/** Public authentication pages remain directly accessible, but are not indexed. */
export async function authPageMetadata(page: AuthPage): Promise<Metadata> {
  const t = await getTranslations("Auth");
  const [titleKey, descriptionKey] = metadataKeys[page];
  return {
    title: t(titleKey),
    description: t(descriptionKey),
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
    ...(page === "reset" ? { referrer: "no-referrer" as const } : {}),
  };
}
