import type { Metadata } from "next";
import BrandEditorial from '@/components/about/brand/BrandEditorial';

export const metadata: Metadata = {
  title: "브랜드 소개 | AHN'S",
  description:
    "사람을 먼저 생각하는 아름다움. AHN'S의 브랜드 스토리와 세 가지 가치를 소개합니다.",
};

export default function BrandPage() {
  return <BrandEditorial />;
}
