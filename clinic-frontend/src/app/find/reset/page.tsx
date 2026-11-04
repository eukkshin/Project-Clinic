import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { authPageMetadata } from "@/lib/auth/pageMetadata";

export const generateMetadata = () => authPageMetadata("reset");

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  return <ResetPasswordForm token={token} />;
}
