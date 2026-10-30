/** /api/admin/detail API response models (Oracle DETAIL_* tables) */
export type DetailStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";
export type SectionType =
  "INTRO" | "FEATURES" | "PROCESS" | "GALLERY" | "FAQ" | "TEXT" | "CTA";
export type Visible = "Y" | "N";

export interface DetailCategory {
  categoryId: number;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isVisible: Visible;
}
export interface DetailPage {
  pageId: number;
  categoryId: number;
  category: string;
  slug: string;
  title: string;
  status: DetailStatus;
  sortOrder: number;
  hero: {
    eyebrow?: string;
    title: string;
    description?: string;
    imageUrl?: string;
    imageAlt?: string;
    imagePosition?: string;
  };
  seo: { title?: string; description?: string };
  createdAt?: string;
  updatedAt?: string;
}
export interface DetailSectionContent {
  description?: string;
  layout?:
    | "image-left"
    | "image-right"
    | "comparison"
    | "cards"
    | "rows"
    | "steps"
    | "timeline";
  compareLeftTitle?: string;
  compareLeftBody?: string;
  compareRightTitle?: string;
  compareRightBody?: string;
  items?: string[];
  imageUrl?: string;
  imageAlt?: string;
  images?: { src: string; alt: string }[];
  faqs?: { question: string; answer: string }[];
  buttonLabel?: string;
  buttonHref?: string;
  [key: string]: unknown;
}
export interface DetailSection {
  sectionId: number;
  pageId: number;
  id: string;
  type: SectionType;
  title: string;
  eyebrow?: string;
  content: DetailSectionContent;
  sortOrder: number;
  isVisible: Visible;
}
export interface PagePayload {
  categoryId: number;
  slug: string;
  title: string;
  sortOrder: number;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl: string;
  heroImageAlt: string;
  heroImagePosition: string;
  seoTitle: string;
  seoDescription: string;
}
export interface SectionPayload {
  id: string;
  type: SectionType;
  title: string;
  eyebrow: string;
  content: DetailSectionContent;
  sortOrder: number;
  isVisible: Visible;
}
