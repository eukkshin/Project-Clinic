import { API_ORIGIN } from "@/lib/api/config";

export interface AccountProfile {
  userId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  joinedAt?: string | null;
}
export interface AccountPreferences {
  mailAgreed: boolean;
  snsAgreed: boolean;
}

export class AccountApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "AccountApiError";
  }
}

type JsonEnvelope<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_ORIGIN}/api/mypage/${path}`, {
      ...options,
      credentials: "include",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new AccountApiError(
      "서버와 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      0,
    );
  }
  const body = (await res.json().catch(() => ({}))) as Partial<JsonEnvelope<T>>;
  if (!res.ok || body.success !== true) {
    const fallback =
      res.status === 401
        ? "로그인 세션이 만료되었습니다. 다시 로그인해 주세요."
        : res.status === 403
          ? "접근 권한이 없습니다."
          : "요청을 처리하지 못했습니다.";
    throw new AccountApiError(body.message || fallback, res.status);
  }
  return body.data as T;
}

export const accountApi = {
  getProfile(signal?: AbortSignal) {
    return request<AccountProfile>("me", { signal });
  },
  getPreferences(signal?: AbortSignal) {
    return request<AccountPreferences>("account/preferences", { signal });
  },
  setPreferences(value: AccountPreferences) {
    return request<AccountPreferences>("account/preferences", {
      method: "PATCH",
      body: JSON.stringify(value),
    });
  },
  changePassword(currentPassword: string, newPassword: string) {
    return request<void>("account/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
  requestEmailChange(currentPassword: string, newEmail: string) {
    return request<void>("account/email/request", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newEmail }),
    });
  },
  withdrawAccount(password: string) {
    return request<void>("account/withdraw", {
      method: "POST",
      body: JSON.stringify({ password, confirmation: "WITHDRAW" }),
    });
  },
  confirmEmailChange(token: string) {
    return request<{ email: string }>("account/email/confirm", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },
};
