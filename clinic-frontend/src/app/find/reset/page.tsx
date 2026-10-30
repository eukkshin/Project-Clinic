import type { Metadata } from "next";
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: "새 비밀번호 설정 | AHNS 성형외과",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  return <ResetPasswordForm token={token} />;
}
