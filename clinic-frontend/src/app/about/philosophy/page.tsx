import { publicPageMetadata } from "@/lib/seo/publicMetadata";
import PhilosophyPage from "@/components/about/pages/PhilosophyPage";

export async function generateMetadata() {
  return publicPageMetadata("/about/philosophy");
}

export default function Page() {
  return <PhilosophyPage />;
}
