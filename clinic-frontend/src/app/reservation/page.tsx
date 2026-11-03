import ReservationBookingPage from '@/components/reservation/ReservationBookingPage';

export const metadata = {
  title: "방문 상담 예약 | AHNS",
  description:
    "예약 가능한 날짜와 시간을 선택하면 방문 상담 일정이 즉시 확정됩니다.",
};
export default function Page() {
  return <ReservationBookingPage />;
}
