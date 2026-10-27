/** Oracle DETAIL_SECTION.SECTION_TYPE */
export type DetailSectionType =
  | "INTRO"
  | "FEATURES"
  | "PROCESS"
  | "GALLERY"
  | "FAQ"
  | "TEXT"
  | "CTA";

export interface DetailSectionContent {
  description?: string;
  items?: string[];
  imageUrl?: string;
  imageAlt?: string;
  images?: { src: string; alt: string }[];
  faqs?: { question: string; answer: string }[];
  buttonLabel?: string;
  buttonHref?: string;
}
export interface DetailSectionData {
  id: string;
  type: DetailSectionType;
  title: string;
  eyebrow?: string;
  content: DetailSectionContent;
}
export interface DetailHeroData {
  eyebrow?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: string;
}
export interface DetailPageData {
  category: string;
  slug: string;
  title: string;
  hero: DetailHeroData;
  seo?: { title?: string; description?: string };
  sections: DetailSectionData[];
}
