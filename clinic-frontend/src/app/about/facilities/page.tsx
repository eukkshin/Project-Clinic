import FacilitiesPage from "@/components/about/pages/FacilitiesPage";
import { publicPageMetadata } from "@/lib/seo/publicMetadata";

export async function generateMetadata() {
  return publicPageMetadata("/about/facilities");
}

export default function Page() {
  return <FacilitiesPage />;
}
