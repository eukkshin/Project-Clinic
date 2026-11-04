import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

import en from "../messages/en.json";
import ja from "../messages/ja.json";
import ko from "../messages/ko.json";
import zhCN from "../messages/zh-CN.json";
import zhTW from "../messages/zh-TW.json";
import { defaultLocale, isAppLocale, localeCookieName } from "./config";

const dictionaries = { ko, en, ja, "zh-CN": zhCN, "zh-TW": zhTW };

export default getRequestConfig(async () => {
  // 프록시가 검증하여 주입한 locale 헤더가 쿠키보다 우선합니다.
  const [requestHeaders, cookieStore] = await Promise.all([
    headers(),
    cookies(),
  ]);
  const pathLocale = requestHeaders.get("x-ahns-locale");
  const savedLocale = cookieStore.get(localeCookieName)?.value;
  const locale = isAppLocale(pathLocale)
    ? pathLocale
    : isAppLocale(savedLocale)
      ? savedLocale
      : defaultLocale;
  return { locale, messages: dictionaries[locale], timeZone: "Asia/Seoul" };
});
