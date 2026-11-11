import CommunityExperience from "@/components/community/CommunityExperience";
import { publicPageMetadata } from "@/lib/seo/publicMetadata";

export async function generateMetadata() {
  return publicPageMetadata("/community/events");
}

export default function Page() {
  return <CommunityExperience kind="events" />;
}
