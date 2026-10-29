import type { Metadata } from "next";
import FacilitiesPage from '@/components/about/pages/FacillitiesPage';

export const metadata: Metadata = {
  title: "진료 환경 | AHN'S",
  description: "AHN'S 병원소개 - 진료 환경",
};

export default function Page() {
  return <FacilitiesPage />;
}
