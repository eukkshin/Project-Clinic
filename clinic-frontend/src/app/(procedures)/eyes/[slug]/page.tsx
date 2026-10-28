import type { Metadata } from "next";
import { notFound } from 'next/navigation';

import DetailLayout from '@/components/detail/DetailLayout';
import { getPreviewDetailPage } from '@/data/detail/preview';
import { getPublicDetailPage } from '@/lib/detail/getPublicDetailPage';

import type { DetailPageData } from "@/types/detail";

interface Props {
  params: Promise<{ slug: string }>;
}

// 관리자 저장 후 새로고침하면 Express에서 최신 공개 데이터를 받습니다.
export const dynamic = "force-dynamic";

const previewEnabled =
  process.env.NODE_ENV !== "production" &&
  process.env.DETAIL_PREVIEW_MODE === "true";

async function loadPage(slug: string): Promise<DetailPageData | null> {
  if (previewEnabled) return getPreviewDetailPage("eyes", slug);
  return getPublicDetailPage("eyes", slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await loadPage(slug);
  if (!page) return { title: "페이지를 찾을 수 없습니다" };
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.hero.description,
  };
}

/** Next.js 16 App Router: default export는 반드시 React 컴포넌트여야 합니다. */
export default async function EyesDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = await loadPage(slug);
  if (!page) notFound();
  return <DetailLayout page={page} />;
}
