export const RESERVATION_DEPARTMENTS = [
  "눈 성형",
  "코 성형",
  "리프팅",
  "피부·쁘띠",
  "기타 상담",
] as const;
export type ReservationDepartment = (typeof RESERVATION_DEPARTMENTS)[number];
export type SlotReason = "booked" | "blocked" | "closed" | null;
export interface ReservationSlot {
  time: string;
  available: boolean;
  reason: SlotReason;
}
export interface ReservationDay {
  date: string;
  availableCount: number;
  slots: ReservationSlot[];
}
export interface AvailabilityCalendar {
  month: string;
  days: ReservationDay[];
}
export interface ReservationRequest {
  department: ReservationDepartment;
  date: string;
  time: string;
  memo: string;
}
export interface ReservationResponse {
  id: number;
  department: string;
  scheduledAt: string;
  status: "예약확정";
}
export interface AdminReservation {
  id: number;
  userIdx: number | null;
  department: string;
  scheduledAt: string;
  slotDate: string;
  slotTime: string;
  status: string;
  memo: string | null;
  name: string;
  phone: string;
  source: string;
}
export interface AdminBlock {
  ID: number;
  BLOCK_DATE: string;
  BLOCK_TIME: string;
  REASON: string | null;
}
export interface AdminReservationData {
  reservations: AdminReservation[];
  blocks: AdminBlock[];
}
