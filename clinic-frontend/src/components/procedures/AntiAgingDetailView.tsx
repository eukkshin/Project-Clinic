"use client";

import { AntiAgingDetailTheme } from '@/assets/css/components/detail/AntiAgingDetail.styles';
import DetailLayout from '@/components/detail/DetailLayout';

import type { DetailPageData } from "@/types/detail";

/** 방문자 공통 컴포넌트 재사용; Hero/SideNav/FAQ 원본은 변경하지 않습니다. */
export default function AntiAgingDetailView({
  page,
}: {
  page: DetailPageData;
}) {
  return (
    <AntiAgingDetailTheme>
      <DetailLayout page={page} />
    </AntiAgingDetailTheme>
  );
}
