import { publicPageMetadata } from "@/lib/seo/publicMetadata";
import DoctorsPage from "@/components/about/pages/DoctorsPage";

export async function generateMetadata() {
  return publicPageMetadata("/about/doctors");
}

export default function Page() {
  return <DoctorsPage />;
}
