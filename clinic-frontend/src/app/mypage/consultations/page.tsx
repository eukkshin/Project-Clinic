import type { Metadata } from "next";
import { ConsultationsView } from "@/components/mypage/MyPageViews";

export const metadata: Metadata = {
  title: "내 상담 내역 | AHNS",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function Page() {
  return <ConsultationsView />;
}
