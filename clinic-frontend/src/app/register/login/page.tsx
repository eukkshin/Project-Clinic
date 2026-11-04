import LoginPageClient from "@/components/auth/LoginPageClient";
import { authPageMetadata } from "@/lib/auth/pageMetadata";

export const generateMetadata = () => authPageMetadata("login");

export default function LoginPage() {
  return <LoginPageClient />;
}
