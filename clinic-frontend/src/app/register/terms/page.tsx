import { authPageMetadata } from "@/lib/auth/pageMetadata";

import RegisterClient from "./RegisterClient";

export const generateMetadata = () => authPageMetadata("register");

export default function RegisterPage() {
  return <RegisterClient />;
}
