/**
 * AHNS localization for existing Korean navigation labels and canonical paths.
 * Do NOT modify menu URLs, IDs or admin-provided unknown labels.
 */
export type NavigationMessageKey =
  | "about"
  | "eyes"
  | "nose"
  | "antiAging"
  | "petit"
  | "community"
  | "brand"
  | "philosophy"
  | "doctors"
  | "facilities"
  | "safety"
  | "location"
  | "notice"
  | "events"
  | "reviews"
  | "beforeAfter"
  | "onlineConsultation"
  | "qna"
  | "vlog"
  | "all"
  | "expand";

const names: Record<string, NavigationMessageKey> = {
  병원소개: "about",
  눈성형: "eyes",
  코성형: "nose",
  동안성형: "antiAging",
  쁘띠시술: "petit",
  커뮤니티: "community",
  브랜드소개: "brand",
  진료철학: "philosophy",
  의료진소개: "doctors",
  진료환경: "facilities",
  안전시스템: "safety",
  오시는길: "location",
  공지사항: "notice",
  이벤트: "events",
  시술후기: "reviews",
  전후사진: "beforeAfter",
  온라인상담: "onlineConsultation",
  "Q&A": "qna",
  VLOG: "vlog",
};

const knownPaths: Record<string, NavigationMessageKey> = {
  "/about/brand": "brand",
  "/about/philosophy": "philosophy",
  "/about/doctors": "doctors",
  "/about/facilities": "facilities",
  "/about/safety": "safety",
  "/about/location": "location",
  "/community/notice": "notice",
  "/community/events": "events",
  "/community/reviews": "reviews",
  "/community/before-after": "beforeAfter",
  "/community/consultation": "onlineConsultation",
  "/community/qna": "qna",
  "/community/vlog": "vlog",
};

export function localizeNavigationLabel(
  name: string,
  url: string,
  level: "top" | "child",
  translate: (key: NavigationMessageKey) => string,
): string {
  const normalizedName = name.replace(/\s+/g, "").toUpperCase();
  const byName = names[normalizedName] ?? names[name.replace(/\s+/g, "")];
  // Primary menu titles should prefer their known name over an umbrella route.
  if (byName) return translate(byName);
  const path = url.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  if (level === "child" && knownPaths[path]) return translate(knownPaths[path]);
  return name;
}
