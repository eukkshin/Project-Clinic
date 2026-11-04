import { publicPageMetadata } from "@/lib/seo/publicMetadata";
import LocationPage from "@/components/about/pages/LocationPage";

export async function generateMetadata() {
  return publicPageMetadata("/about/location");
}

export default function Page() {
  return <LocationPage />;
}
