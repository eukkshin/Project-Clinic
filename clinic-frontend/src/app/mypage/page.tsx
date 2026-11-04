import type { Metadata } from "next";
import { MyPageView } from "@/components/mypage/MyPageViews";

export const metadata: Metadata = {
  title: "내 정보 | AHNS",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function Page() {
  return <MyPageView />;
}
