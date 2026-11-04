import type { Metadata } from "next";
import { ReservationsView } from "@/components/mypage/MyPageViews";

export const metadata: Metadata = {
  title: "예약 내역 | AHNS",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function Page() {
  return <ReservationsView />;
}
