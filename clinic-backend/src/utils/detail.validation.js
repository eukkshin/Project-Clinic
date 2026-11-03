"use strict";

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function bad(message) {
  throw new HttpError(400, message);
}
function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function bodyObject(value) {
  if (!isObject(value)) bad("요청 본문은 JSON 객체여야 합니다.");
  return value;
}
function id(value, label = "ID") {
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 1)
    bad(`${label}는 양의 정수여야 합니다.`);
  return n;
}
function order(value) {
  const n = Number(value ?? 0);
  if (!Number.isSafeInteger(n) || n < 0 || n > 1e7)
    bad("sortOrder는 0 이상의 정수여야 합니다.");
  return n;
}
function string(value, label, { required = false, max = 1000 } = {}) {
  if ((value === undefined || value === null) && !required) return null;
  if (typeof value !== "string") bad(`${label}는 문자열이어야 합니다.`);
  const s = value.trim();
  if (required && !s) bad(`${label}를 입력하세요.`);
  if ([...s].length > max) bad(`${label}는 최대 ${max}자입니다.`);
  return s || null;
}
function slug(value, label = "slug", max = 120) {
  const s = string(value, label, { required: true, max });
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s))
    bad(`${label}는 영어 소문자·숫자·하이픈만 허용합니다.`);
  return s;
}
function yesNo(value, label = "isVisible", fallback = "Y") {
  const v = value ?? fallback;
  if (!["Y", "N"].includes(v)) bad(`${label}는 Y 또는 N이어야 합니다.`);
  return v;
}
function enumerated(value, variants, label) {
  if (!variants.includes(value))
    bad(`${label}는 ${variants.join(", ")} 중 하나여야 합니다.`);
  return value;
}
function imageUrl(value, label) {
  const v = string(value, label, { max: 1000 });

  if (!v) return v;

  // 1. /images/... 경로 허용
  const isRelative = /^\/(?!\/)/.test(v);

  // 2. HTTPS URL 허용
  const isHttps = /^https:\/\//i.test(v);

  // 3. 개발 환경에서 Express 이미지 URL 허용
  let isLocalImage = false;

  try {
    const url = new URL(v);
    const apiOrigin = new URL(
      process.env.PUBLIC_API_ORIGIN || "http://127.0.0.1:4000",
    );

    isLocalImage =
      process.env.NODE_ENV !== "production" &&
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(url.hostname) &&
      url.origin === apiOrigin.origin &&
      url.pathname.startsWith("/images/detail-cms/");
  } catch {
    // URL 형식이 아니면 기존 규칙으로 검사
  }

  if (!isRelative && !isHttps && !isLocalImage) {
    bad(
      `${label}은 /로 시작하는 경로, HTTPS URL 또는 개발 서버 이미지 URL이어야 합니다.`,
    );
  }

  return v;
}
function heroPosition(v) {
  const s = string(v ?? "center", "heroImagePosition", { max: 60 });
  if (!/^[a-z0-9.%\s-]+$/i.test(s))
    bad("heroImagePosition 값이 올바르지 않습니다.");
  return s;
}
function category(value) {
  const b = bodyObject(value);
  return {
    slug: slug(b.slug, "slug", 80),
    name: string(b.name, "name", { required: true, max: 120 }),
    description: string(b.description, "description", { max: 500 }),
    sortOrder: order(b.sortOrder),
    isVisible: yesNo(b.isVisible),
  };
}
function page(value) {
  const b = bodyObject(value);
  return {
    categoryId: id(b.categoryId, "categoryId"),
    slug: slug(b.slug),
    title: string(b.title, "title", { required: true, max: 200 }),
    sortOrder: order(b.sortOrder),
    heroEyebrow: string(b.heroEyebrow, "heroEyebrow", { max: 180 }),
    heroTitle: string(b.heroTitle, "heroTitle", { required: true, max: 300 }),
    heroDescription: string(b.heroDescription, "heroDescription", { max: 900 }),
    heroImageUrl: imageUrl(b.heroImageUrl, "heroImageUrl"),
    heroImageAlt: string(b.heroImageAlt, "heroImageAlt", { max: 300 }),
    heroImagePosition: heroPosition(b.heroImagePosition),
    seoTitle: string(b.seoTitle, "seoTitle", { max: 200 }),
    seoDescription: string(b.seoDescription, "seoDescription", { max: 500 }),
  };
}
const sectionTypes = [
  "INTRO",
  "FEATURES",
  "PROCESS",
  "GALLERY",
  "FAQ",
  "TEXT",
  "CTA",
];
function checkContent(c, type) {
  if (!isObject(c)) bad("content는 JSON 객체여야 합니다.");
  if (c.description !== undefined && typeof c.description !== "string")
    bad("content.description은 문자열이어야 합니다.");
  if (
    c.items !== undefined &&
    (!Array.isArray(c.items) || c.items.some((v) => typeof v !== "string"))
  )
    bad("content.items는 문자열 배열이어야 합니다.");
  if (
    c.images !== undefined &&
    (!Array.isArray(c.images) ||
      c.images.some(
        (v) =>
          !isObject(v) ||
          typeof v.src !== "string" ||
          typeof v.alt !== "string",
      ))
  )
    bad("content.images는 {src,alt} 배열이어야 합니다.");
  if (
    c.faqs !== undefined &&
    (!Array.isArray(c.faqs) ||
      c.faqs.some(
        (v) =>
          !isObject(v) ||
          typeof v.question !== "string" ||
          typeof v.answer !== "string",
      ))
  )
    bad("content.faqs는 {question,answer} 배열이어야 합니다.");
  for (const key of ["imageUrl", "imageAlt", "buttonLabel", "buttonHref"]) {
    if (c[key] !== undefined && typeof c[key] !== "string")
      bad(`content.${key}는 문자열이어야 합니다.`);
  }
  if (c.imageUrl) imageUrl(c.imageUrl, "content.imageUrl");
  if (c.images)
    c.images.forEach((x) => imageUrl(x.src, "content.images[].src"));
  if (
    c.buttonHref &&
    !(/^\/(?!\/)/.test(c.buttonHref) || /^https:\/\//i.test(c.buttonHref))
  )
    bad("content.buttonHref는 내부 경로 또는 HTTPS URL이어야 합니다.");
  if (type === "FAQ" && !Array.isArray(c.faqs))
    bad("FAQ 섹션에는 content.faqs 배열이 필요합니다.");
  if (["FEATURES", "PROCESS"].includes(type) && !Array.isArray(c.items))
    bad(`${type} 섹션에는 content.items 배열이 필요합니다.`);
  const json = JSON.stringify(c);
  if (Buffer.byteLength(json, "utf8") > 100_000)
    bad("content JSON은 100KB 이하로 입력하세요.");
  return json;
}
function section(value) {
  const b = bodyObject(value);
  const type = enumerated(b.type, sectionTypes, "type");
  return {
    key: slug(b.id ?? b.key ?? b.sectionKey, "sectionKey", 100),
    type,
    title: string(b.title, "title", { required: true, max: 200 }),
    eyebrow: string(b.eyebrow, "eyebrow", { max: 150 }),
    contentJson: checkContent(b.content, type),
    sortOrder: order(b.sortOrder),
    isVisible: yesNo(b.isVisible),
  };
}
function orderedIds(value) {
  const b = bodyObject(value);
  if (!Array.isArray(b.orderedIds) || b.orderedIds.length > 1000)
    bad("orderedIds 배열이 필요합니다(최대 1000개). ");
  const arr = b.orderedIds.map((v) => id(v));
  if (new Set(arr).size !== arr.length) bad("orderedIds에 중복 ID가 있습니다.");
  return arr;
}
module.exports = {
  HttpError,
  bad,
  id,
  slug,
  category,
  page,
  section,
  yesNo,
  enumerated,
  orderedIds,
};
