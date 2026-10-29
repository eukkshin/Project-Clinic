import type { Metadata } from "next";
import DoctorsPage from '@/components/about/pages/DoctorsPage';

export const metadata: Metadata = {
  title: "의료진 소개 | AHN'S",
  description: "AHN'S 병원소개 - 의료진 소개",
};

export default function Page() {
  return <DoctorsPage />;
}
