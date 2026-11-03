import type { Metadata } from "next";
import ConsultationPage from '@/components/consultation/ConsultationPage';

export const metadata: Metadata = {
  title: "1:1 상담문의 | AHNS 성형외과",
  description:
    "AHNS 성형외과의 프라이빗 1:1 상담. 로그인 없이 궁금한 시술과 상담 내용을 남겨 주세요.",
};

export default function Page() {
  return <ConsultationPage />;
}
