import type { Metadata } from "next";
import AccountSettingsClient from "@/components/mypage/account-settings/AccountSettingsClient";

export const metadata: Metadata = {
  title: "계정 설정 | AHNS",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function AccountSettingsPage() {
  return <AccountSettingsClient />;
}
