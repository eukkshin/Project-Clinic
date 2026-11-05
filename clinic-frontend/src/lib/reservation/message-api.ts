import { API_ORIGIN } from "@/lib/api/config";

export type MessageChannel = "SMS" | "KAKAO";
export type MessageEvent = "CREATED" | "RESCHEDULED" | "CANCELLED" | "REMINDER";
export type MessageState =
  | "QUEUED"
  | "PROCESSING"
  | "ACCEPTED"
  | "FAILED"
  | "UNKNOWN"
  | "SKIPPED"
  | "CANCELLED";
export interface MessagingPolicy {
  enabled: boolean;
  channel: MessageChannel;
  sendCreated: boolean;
  sendRescheduled: boolean;
  sendCancelled: boolean;
  sendReminder: boolean;
  reminderHours: 12 | 24 | 48 | 72;
  startHour: number;
  endHour: number;
  providerReady: boolean;
  transport: string;
}
export type EditablePolicy = Pick<
  MessagingPolicy,
  | "enabled"
  | "channel"
  | "sendCreated"
  | "sendRescheduled"
  | "sendCancelled"
  | "sendReminder"
  | "reminderHours"
  | "startHour"
  | "endHour"
>;
export interface MessageHistory {
  id: number;
  reservationId: number;
  eventType: MessageEvent;
  slotKey: string;
  dueAtKst: string;
  channel: MessageChannel;
  state: MessageState;
  attempts: number;
  error: string | null;
  acceptedAt: string | null;
  createdAt: string;
}
const origin = API_ORIGIN.replace(/\/$/, "");
async function get<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(
    `${origin}/api/admin/reservation-messages${path}`,
    {
      credentials: "include",
      cache: "no-store",
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    },
  );
  const body = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
    data?: T;
  } | null;
  if (!response.ok || body?.success !== true)
    throw new Error(
      body?.message || `요청에 실패했습니다. (HTTP ${response.status})`,
    );
  return body.data as T;
}
export const getMessagingPolicy = () => get<MessagingPolicy>("/settings");
export const updateMessagingPolicy = (policy: EditablePolicy) =>
  get<MessagingPolicy>("/settings", {
    method: "PUT",
    body: JSON.stringify(policy),
  });
export const getMessageHistory = (limit = 40) =>
  get<MessageHistory[]>(`/?limit=${limit}`);
export const retryMessage = (id: number, confirmedProviderCheck = false) =>
  get<void>(`/${id}/retry`, {
    method: "POST",
    body: JSON.stringify({ confirmedProviderCheck }),
  });
