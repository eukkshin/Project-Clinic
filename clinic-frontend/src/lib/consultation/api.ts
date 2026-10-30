import type { ConsultRecord, ConsultResponse, ConsultStatus, CreateConsultInput } from '@/types/consultation';

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');

async function unwrap<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as ConsultResponse<T> | null;
  if (!response.ok || !body?.success) {
    if (response.status === 401) throw new Error('관리자 로그인이 필요합니다.');
    if (response.status === 403) throw new Error('이 작업을 수행할 권한이 없습니다.');
    throw new Error(body?.message || `요청에 실패했습니다. (${response.status})`);
  }
  return body.data as T;
}

export async function submitGuestConsult(data: CreateConsultInput, signal?: AbortSignal) {
  const response = await fetch(`${API_ORIGIN}/api/consult`, {
    method: 'POST', credentials: 'omit', cache: 'no-store', signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return unwrap<{ id: number }>(response);
}

export async function fetchAdminConsults(signal?: AbortSignal) {
  const response = await fetch(`${API_ORIGIN}/api/admin/consult`, {
    credentials: 'include', cache: 'no-store', signal,
  });
  const list = await unwrap<Array<Record<string, unknown>>>(response);
  return list.map(normalizeConsult);
}

function normalizeConsult(row: Record<string, unknown>): ConsultRecord {
  const str = (value: unknown) => value == null ? '' : String(value);
  const status = str(row.STATUS ?? row.status);
  return {
    id: Number(row.ID ?? row.id),
    name: str(row.NAME ?? row.name),
    phone: str(row.PHONE ?? row.phone),
    department: str(row.DEPARTMENT ?? row.department),
    title: str(row.TITLE ?? row.title),
    content: str(row.CONTENT ?? row.content),
    status: status === '상담중' || status === '상담완료' ? status : '대기중',
    createdAt: str(row.CREATED_AT ?? row.createdAt),
    userId: str(row.USER_ID ?? row.userId),
  };
}

export async function updateAdminConsultStatus(id: number, status: ConsultStatus) {
  const response = await fetch(`${API_ORIGIN}/api/admin/consult/${id}/status`, {
    method: 'PUT', credentials: 'include', cache: 'no-store',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
  });
  return unwrap<{ status: ConsultStatus }>(response);
}

export async function deleteAdminConsult(id: number) {
  const response = await fetch(`${API_ORIGIN}/api/admin/consult/${id}`, {
    method: 'DELETE', credentials: 'include', cache: 'no-store',
  });
  return unwrap<{ id: number }>(response);
}
