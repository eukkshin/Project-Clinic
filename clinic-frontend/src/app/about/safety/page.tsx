import SafetyPage from "@/components/about/pages/SafetyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "안전 시스템 | AHN'S",
  description: "AHN'S 병원소개 - 안전 시스템",
};

export default function Page() {
  return <SafetyPage />;
}
