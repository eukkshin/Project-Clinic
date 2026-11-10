import SafetyPage from "@/components/about/pages/SafetyPage";
import { publicPageMetadata } from "@/lib/seo/publicMetadata";

export async function generateMetadata() {
  return publicPageMetadata("/about/safety");
}

export default function Page() {
  return <SafetyPage />;
}
