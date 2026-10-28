import type { Metadata } from "next";
import { notFound } from 'next/navigation';

import NoseDetailView from '@/components/detail/NoseDetailView';
import { getNosePreviewPage } from '@/data/detail/nosePreview';
import { getPublicDetailPage } from '@/lib/detail/getPublicDetailPage';

import type { DetailPageData } from "@/types/detail";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
};

// 관리자에서 공개한 데이터는 매 요청마다 최신 데이터를 조회합니다.
export const dynamic = "force-dynamic";

async function loadPage({
  params,
  searchParams,
}: Props): Promise<DetailPageData | null> {
  const { slug } = await params;
  const query = await searchParams;
  // 개발 환경에서만 ?preview=1 사용. 운영 환경에서는 DB 공개 데이터만 렌더링.
  const demo =
    process.env.NODE_ENV !== "production" &&
    (query.preview === "1" || process.env.DETAIL_PREVIEW_MODE === "true");

  return demo
    ? getNosePreviewPage("nose", slug)
    : getPublicDetailPage("nose", slug);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const page = await loadPage(props);
  if (!page) return { title: "페이지를 찾을 수 없습니다" };
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.hero.description,
  };
}

export default async function NoseDetailPage(props: Props) {
  const page = await loadPage(props);
  if (!page) notFound();

  return <NoseDetailView page={page} />;
}
