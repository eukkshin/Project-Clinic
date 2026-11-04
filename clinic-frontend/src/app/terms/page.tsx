import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";

// 공개 전 병원 승인이 필요한 초안입니다. 검토 완료 시 robots 설정을 변경합니다.
export const metadata: Metadata = {
  title: "이용약관 | AHN'S",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LegalDocument kind="terms" />;
}
