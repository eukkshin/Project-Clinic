import { publicPageMetadata } from "@/lib/seo/publicMetadata";
import SafetyPage from "@/components/about/pages/SafetyPage";

export async function generateMetadata() {
  return publicPageMetadata("/about/safety");
}

export default function Page() {
  return <SafetyPage />;
}
