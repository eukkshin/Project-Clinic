import CommunityExperience from "@/components/community/CommunityExperience";
import { publicPageMetadata } from "@/lib/seo/publicMetadata";

export async function generateMetadata() {
  return publicPageMetadata("/community/before-after");
}

export default function Page() {
  return <CommunityExperience kind="before-after" />;
}
