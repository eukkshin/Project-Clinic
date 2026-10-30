export type ReservationStatus = "예약대기" | "예약확정" | "방문완료" | "취소";
export type ConsultationStatus = "대기중" | "상담중" | "상담완료";

export interface MyProfile {
  userId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  joinedAt?: string | null;
}
export interface MyReservation {
  id: string | number;
  department: string;
  scheduledAt: string;
  status: ReservationStatus;
  createdAt?: string | null;
  memo?: string | null;
}
export interface MyConsultation {
  id: string | number;
  title: string;
  department?: string | null;
  status: ConsultationStatus;
  createdAt: string;
  content: string;
  response?: string | null;
}
