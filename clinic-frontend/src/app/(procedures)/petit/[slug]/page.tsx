import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PetitDetailView from "@/components/procedures/PetitDetailView";
import { getPetitPreviewPage } from "@/data/detail/petitPreview";
import { getPublicDetailPage } from "@/lib/detail/getPublicDetailPage";

import type { DetailPageData } from "@/types/detail";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
};

export const dynamic = "force-dynamic";

async function loadPage({
  params,
  searchParams,
}: Props): Promise<DetailPageData | null> {
  const { slug } = await params;
  const query = await searchParams;
  const preview =
    process.env.NODE_ENV !== "production" &&
    (query.preview === "1" || process.env.DETAIL_PREVIEW_MODE === "true");

  return preview
    ? getPetitPreviewPage("petit", slug)
    : getPublicDetailPage("petit", slug);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const page = await loadPage(props);
  if (!page) return { title: "페이지를 찾을 수 없습니다" };
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.hero.description,
  };
}

export default async function PetitProcedurePage(props: Props) {
  const page = await loadPage(props);
  if (!page) notFound();
  return <PetitDetailView page={page} />;
}
