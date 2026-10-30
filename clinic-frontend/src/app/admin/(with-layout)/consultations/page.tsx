import type { Metadata } from "next";
import AdminConsultPage from '@/components/admin/AdminConsultPage';

export const metadata: Metadata = {
  title: "상담관리 | AHNS Admin",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <AdminConsultPage />;
}
