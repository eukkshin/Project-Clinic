import type { Metadata } from "next";
import PatientRightsDocument from "@/components/legal/PatientRightsDocument";

// 최종 병원 운영 정보 검토·승인 전에는 검색엔진 색인 방지 상태를 유지합니다.
export const metadata: Metadata = {
  title: "환자의 권리와 의무 | AHN'S",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PatientRightsDocument />;
}
