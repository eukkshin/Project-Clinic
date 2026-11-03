import LocationPage from "@/components/about/pages/LocationPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오시는 길 | AHN'S",
  description: "AHN'S 병원소개 - 오시는 길",
};

export default function Page() {
  return <LocationPage />;
}
