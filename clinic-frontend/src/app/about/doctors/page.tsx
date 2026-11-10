import DoctorsPage from "@/components/about/pages/DoctorsPage";
import { publicPageMetadata } from "@/lib/seo/publicMetadata";

export async function generateMetadata() {
  return publicPageMetadata("/about/doctors");
}

export default function Page() {
  return <DoctorsPage />;
}
