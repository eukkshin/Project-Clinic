import { publicPageMetadata } from "@/lib/seo/publicMetadata";
import FacilitiesPage from "@/components/about/pages/FacilitiesPage";

export async function generateMetadata() {
  return publicPageMetadata("/about/facilities");
}

export default function Page() {
  return <FacilitiesPage />;
}
