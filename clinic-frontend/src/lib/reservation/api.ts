import { API_ORIGIN } from '@/lib/api/config';

import type {
  AvailabilityCalendar,
  ReservationRequest,
  ReservationResponse,
  AdminReservationData,
} from "@/types/reservation";
const origin = API_ORIGIN.replace(/\/$/, "");

type ApiResponse<T> = { success?: boolean; message?: string; data?: T };
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${origin}${path}`, {
    credentials: "include",
    cache: "no-store",
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const payload = (await response
    .json()
    .catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !payload?.success) {
    if (response.status === 401) throw new Error("로그인이 필요합니다.");
    if (response.status === 403)
      throw new Error(payload?.message || "접근 권한이 없습니다.");
    throw new Error(
      payload?.message || `요청에 실패했습니다. (HTTP ${response.status})`,
    );
  }
  return payload.data as T;
}
export function getReservationAvailability(month: string) {
  return request<AvailabilityCalendar>(
    `/api/reservations/availability?month=${encodeURIComponent(month)}`,
  );
}
export function createReservation(data: ReservationRequest) {
  return request<ReservationResponse>("/api/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function cancelReservation(id: number | string) {
  return request<void>(
    `/api/reservations/${encodeURIComponent(String(id))}/cancel`,
    { method: "PATCH" },
  );
}
export function getAdminReservations(month: string) {
  return request<AdminReservationData>(
    `/api/admin/reservations?month=${encodeURIComponent(month)}`,
  );
}
export function addManualReservation(
  data: ReservationRequest & { name: string; phone: string; userId?: string },
) {
  return request<{ id: number }>("/api/admin/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function addReservationBlock(data: {
  date: string;
  time: string;
  reason: string;
}) {
  return request<{ id: number }>("/api/admin/reservations/blocks", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function removeReservationBlock(id: number) {
  return request<void>(`/api/admin/reservations/blocks/${id}`, {
    method: "DELETE",
  });
}
export function cancelAdminReservation(id: number) {
  return request<void>(`/api/admin/reservations/${id}/cancel`, {
    method: "PATCH",
  });
}
