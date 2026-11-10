import LocationPage from "@/components/about/pages/LocationPage";
import { publicPageMetadata } from "@/lib/seo/publicMetadata";

export async function generateMetadata() {
  return publicPageMetadata("/about/location");
}

export default function Page() {
  return <LocationPage />;
}
