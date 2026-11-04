import ConsultationPage from "@/components/consultation/ConsultationPage";
import { publicPageMetadata } from "@/lib/seo/publicMetadata";

export async function generateMetadata() {
  return publicPageMetadata("/consultation");
}

export default function Page() {
  return <ConsultationPage />;
}
