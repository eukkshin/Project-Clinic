import PhilosophyPage from "@/components/about/pages/PhilosophyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "진료 철학 | AHN'S",
  description: "AHN'S 병원소개 - 진료 철학",
};

export default function Page() {
  return <PhilosophyPage />;
}
