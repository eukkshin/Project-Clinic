import type {
  DetailPage,
  DetailSection,
  DetailSectionContent,
  DetailStatus,
  PagePayload,
  SectionPayload,
  SectionType,
  Visible,
} from "@/types/adminDetail";

export const SECTION_NAMES: Record<SectionType, string> = {
  INTRO: "시술 소개",
  FEATURES: "시술 특징",
  PROCESS: "진행 과정",
  GALLERY: "이미지 갤러리",
  FAQ: "자주 묻는 질문",
  TEXT: "일반 텍스트",
  CTA: "상담 유도",
};
export const LAYOUT_OPTIONS: Partial<
  Record<SectionType, { value: string; label: string }[]>
> = {
  INTRO: [
    { value: "", label: "기존 디자인 (이미지 오른쪽)" },
    { value: "image-left", label: "이미지 왼쪽 / 설명 오른쪽" },
    { value: "comparison", label: "2열 비교형" },
  ],
  TEXT: [
    { value: "", label: "기존 디자인 (이미지 오른쪽)" },
    { value: "image-left", label: "이미지 왼쪽 / 설명 오른쪽" },
    { value: "comparison", label: "2열 비교형" },
  ],
  FEATURES: [
    { value: "", label: "기존 특징 카드형" },
    { value: "rows", label: "세로 리스트형" },
  ],
  PROCESS: [
    { value: "", label: "기존 단계 카드형" },
    { value: "timeline", label: "세로 타임라인형" },
  ],
};
export const STATUS_NAMES: Record<DetailStatus, string> = {
  DRAFT: "임시저장",
  PUBLISHED: "공개",
  HIDDEN: "숨김",
};
export const isSlug = (value: string) =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const toLines = (value: string) =>
  value
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

export function emptyPage(categoryId = 0, sortOrder = 0): PagePayload {
  return {
    categoryId,
    slug: "",
    title: "",
    sortOrder,
    heroEyebrow: "AHN'S PLASTIC SURGERY",
    heroTitle: "",
    heroDescription: "",
    heroImageUrl: "",
    heroImageAlt: "",
    heroImagePosition: "center center",
    seoTitle: "",
    seoDescription: "",
  };
}
export function fromPage(page: DetailPage): PagePayload {
  return {
    categoryId: page.categoryId,
    slug: page.slug,
    title: page.title,
    sortOrder: page.sortOrder,
    heroEyebrow: page.hero.eyebrow || "",
    heroTitle: page.hero.title,
    heroDescription: page.hero.description || "",
    heroImageUrl: page.hero.imageUrl || "",
    heroImageAlt: page.hero.imageAlt || "",
    heroImagePosition: page.hero.imagePosition || "center center",
    seoTitle: page.seo.title || "",
    seoDescription: page.seo.description || "",
  };
}
export type SectionDraft = {
  id: string;
  type: SectionType;
  title: string;
  eyebrow: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  itemsText: string;
  layout: string;
  compareLeftTitle: string;
  compareLeftBody: string;
  compareRightTitle: string;
  compareRightBody: string;
  imagesText: string;
  faqsText: string;
  buttonLabel: string;
  buttonHref: string;
  sortOrder: number;
  isVisible: Visible;
  extras: DetailSectionContent;
};
export function emptySection(sortOrder = 0): SectionDraft {
  return {
    id: "",
    type: "INTRO",
    title: "",
    eyebrow: "",
    description: "",
    imageUrl: "",
    imageAlt: "",
    layout: "",
    compareLeftTitle: "",
    compareLeftBody: "",
    compareRightTitle: "",
    compareRightBody: "",
    itemsText: "",
    imagesText: "",
    faqsText: "",
    buttonLabel: "",
    buttonHref: "",
    sortOrder,
    isVisible: "Y",
    extras: {},
  };
}
export function fromSection(section: DetailSection): SectionDraft {
  const c = section.content ?? {};
  return {
    id: section.id,
    type: section.type,
    title: section.title,
    eyebrow: section.eyebrow || "",
    description: c.description || "",
    imageUrl: c.imageUrl || "",
    imageAlt: c.imageAlt || "",
    layout: c.layout || "",
    compareLeftTitle: c.compareLeftTitle || "",
    compareLeftBody: c.compareLeftBody || "",
    compareRightTitle: c.compareRightTitle || "",
    compareRightBody: c.compareRightBody || "",
    itemsText: (c.items || []).join("\n"),
    imagesText: (c.images || []).map((x) => `${x.src} | ${x.alt}`).join("\n"),
    faqsText: (c.faqs || [])
      .map((x) => `${x.question} | ${x.answer}`)
      .join("\n"),
    buttonLabel: c.buttonLabel || "",
    buttonHref: c.buttonHref || "",
    sortOrder: section.sortOrder,
    isVisible: section.isVisible,
    extras: c,
  };
}
export function sectionPayload(
  draft: SectionDraft,
  preview = false,
): SectionPayload {
  const base: DetailSectionContent = { ...draft.extras };
  // 종류 변경 시 이전 섹션 타입의 콘텐츠 필드는 제거하고 새 구조만 저장합니다.
  for (const key of [
    "description",
    "imageUrl",
    "imageAlt",
    "items",
    "images",
    "faqs",
    "buttonLabel",
    "buttonHref",
    "layout",
    "compareLeftTitle",
    "compareLeftBody",
    "compareRightTitle",
    "compareRightBody",
  ])
    delete base[key];
  const allowedLayouts = (LAYOUT_OPTIONS[draft.type] || []).map(
    (option) => option.value,
  );
  if (draft.layout && allowedLayouts.includes(draft.layout)) {
    base.layout = draft.layout as DetailSectionContent["layout"];
  }
  // 설명은 모든 섹션 유형에서 방문자 화면에 표시할 수 있습니다.
  if (draft.description.trim()) base.description = draft.description.trim();
  switch (draft.type) {
    case "INTRO":
    case "TEXT":
      if (draft.layout === "comparison") {
        base.compareLeftTitle = draft.compareLeftTitle.trim();
        base.compareLeftBody = draft.compareLeftBody.trim();
        base.compareRightTitle = draft.compareRightTitle.trim();
        base.compareRightBody = draft.compareRightBody.trim();
      }
      if (draft.layout !== "comparison" && draft.imageUrl.trim()) {
        base.imageUrl = draft.imageUrl.trim();
        base.imageAlt = draft.imageAlt.trim();
      }
      break;
    case "FEATURES":
    case "PROCESS":
      base.items = toLines(draft.itemsText);
      break;
    case "GALLERY":
      base.images = toLines(draft.imagesText).map((line) => {
        const i = line.indexOf("|");
        return {
          src: (i < 0 ? line : line.slice(0, i)).trim(),
          alt: (i < 0 ? "" : line.slice(i + 1)).trim(),
        };
      });
      break;
    case "FAQ":
      base.faqs = toLines(draft.faqsText).map((line) => {
        const i = line.indexOf("|");
        if (i < 1 || i === line.length - 1) {
          if (preview)
            return { question: line.trim(), answer: "답변을 입력해 주세요." };
          throw new Error("FAQ는 각 줄을 질문 | 답변 형식으로 입력해 주세요.");
        }
        return {
          question: line.slice(0, i).trim(),
          answer: line.slice(i + 1).trim(),
        };
      });
      break;
    case "CTA":
      base.buttonLabel = draft.buttonLabel.trim();
      base.buttonHref = draft.buttonHref.trim();
      break;
  }
  return {
    id: draft.id.trim(),
    type: draft.type,
    title: draft.title.trim(),
    eyebrow: draft.eyebrow.trim(),
    content: base,
    sortOrder: draft.sortOrder,
    isVisible: draft.isVisible,
  };
}
