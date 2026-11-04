import ReservationBookingPage from "@/components/reservation/ReservationBookingPage";
import { publicPageMetadata } from "@/lib/seo/publicMetadata";

export async function generateMetadata() {
  return publicPageMetadata("/reservation");
}
export default function Page() {
  return <ReservationBookingPage />;
}
