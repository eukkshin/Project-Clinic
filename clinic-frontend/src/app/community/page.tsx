import CommunityExperience from "@/components/community/CommunityExperience";
import { publicPageMetadata } from "@/lib/seo/publicMetadata";

export async function generateMetadata() {
  return publicPageMetadata("/community");
}

export default function CommunityPage() {
  return <CommunityExperience />;
}
