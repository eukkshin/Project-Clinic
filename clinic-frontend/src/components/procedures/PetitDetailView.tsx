"use client";

import DetailLayout from "@/components/procedures/DetailLayout";
import { PetitDetailTheme } from "@/components/procedures/PetitDetail.styles";

import type { DetailPageData } from "@/types/detail";

/** 공통 Hero, SideNav, FAQ, Lenis 및 Footer를 변경하지 않고 스타일만 스코프합니다. */
export default function PetitDetailView({ page }: { page: DetailPageData }) {
  return (
    <PetitDetailTheme>
      <DetailLayout page={page} />
    </PetitDetailTheme>
  );
}
