"use client";

import { NoseDetailTheme } from '@/components/procedures/NoseDetail.styles';
import DetailLayout from '@/components/procedures/DetailLayout';

import type { DetailPageData } from "@/types/detail";

/** Styled-Components는 Next.js Client Component 경계 안에서 렌더링합니다. */
export default function NoseDetailView({ page }: { page: DetailPageData }) {
  return (
    <NoseDetailTheme>
      <DetailLayout page={page} />
    </NoseDetailTheme>
  );
}
