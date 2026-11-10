import PhilosophyPage from "@/components/about/pages/PhilosophyPage";
import { publicPageMetadata } from "@/lib/seo/publicMetadata";

export async function generateMetadata() {
  return publicPageMetadata("/about/philosophy");
}

export default function Page() {
  return <PhilosophyPage />;
}
