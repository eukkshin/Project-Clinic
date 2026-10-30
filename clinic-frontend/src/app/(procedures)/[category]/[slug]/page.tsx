import type { Metadata } from "next";
import { notFound } from "next/navigation";

import DetailLayout from "@/components/procedures/DetailLayout";
import { getPublicDetailPage } from "@/lib/detail/getPublicDetailPage";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

// 기존 generateStaticParams()의 demo 고정 목록 대신 모든 DB 등록 slug를 허용합니다.
// 관리자에서 수정하고 새로고침하면 즉시 DB의 최신 공개 데이터가 표시됩니다.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const page = await getPublicDetailPage(category, slug);
  if (!page) return { title: "페이지를 찾을 수 없습니다" };

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.hero.description,
  };
}

export default async function ProcedureDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const page = await getPublicDetailPage(category, slug);

  // DRAFT, HIDDEN, 비공개 카테고리, 존재하지 않는 페이지는 404입니다.
  if (!page) notFound();

  return <DetailLayout page={page} />;
}
