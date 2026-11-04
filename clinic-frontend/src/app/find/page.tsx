import FindPasswordForm from "@/components/auth/FindPasswordForm";
import { authPageMetadata } from "@/lib/auth/pageMetadata";

export const generateMetadata = () => authPageMetadata("find");

export default function FindPage() {
  return <FindPasswordForm />;
}
