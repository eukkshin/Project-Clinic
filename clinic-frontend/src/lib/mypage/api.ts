/**
 * 개인 정보 조회 API 연결은 별도로 활성화합니다.
 * .env.local: NEXT_PUBLIC_MYPAGE_API_URL=http://localhost:4000/api/mypage
 * 반드시 백엔드가 HttpOnly 인증 쿠키로 로그인 상태를 검증하고
 * 로그인된 본인의 데이터만 반환하는 경우에만 켜세요.
 */
const BASE = (process.env.NEXT_PUBLIC_MYPAGE_API_URL ?? "").replace(/\/$/, "");
export const MY_PAGE_API_ENABLED = Boolean(BASE);
type Route = "me" | "reservations" | "consultations";

export async function getMyPageData<T>(
  route: Route,
  signal?: AbortSignal,
): Promise<T> {
  if (!BASE) throw new Error("마이페이지 API가 연결되지 않았습니다.");
  const response = await fetch(`${BASE}/${route}`, {
    headers: { Accept: "application/json" },
    method: "GET",
    credentials: "include",
    cache: "no-store",
    signal,
  });
  if (response.status === 401) throw new Error("로그인 후 다시 이용해 주세요.");
  if (response.status === 403) throw new Error("접근 권한이 없습니다.");
  if (!response.ok) throw new Error(`조회 실패 (HTTP ${response.status})`);
  const json = (await response.json()) as {
    success: boolean;
    data?: T;
    message?: string;
  };
  if (!json.success || json.data === undefined)
    throw new Error(json.message ?? "조회에 실패했습니다.");
  return json.data;
}
