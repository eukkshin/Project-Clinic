import axios from 'axios';

import type {
  DetailCategory,
  DetailPage,
  DetailSection,
  DetailStatus,
  PagePayload,
  SectionPayload,
} from "@/types/adminDetail";

/** HttpOnly 관리자 세션 쿠키를 브라우저가 보내도록 withCredentials 사용. */
const client = axios.create({
  baseURL: `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "")}/api/admin/detail`,
  withCredentials: true,
  timeout: 15000,
});
type Result<T> = { success: boolean; data: T; message?: string };
const get = async <T>(url: string) =>
  (await client.get<Result<T>>(url)).data.data;
const post = async <T>(url: string, data: unknown) =>
  (await client.post<Result<T>>(url, data)).data.data;
const put = async <T>(url: string, data: unknown) =>
  (await client.put<Result<T>>(url, data)).data.data;
const patch = async <T>(url: string, data: unknown) =>
  (await client.patch<Result<T>>(url, data)).data.data;
const del = async <T>(url: string) =>
  (await client.delete<Result<T>>(url)).data.data;

export const detailApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await client.post<
      Result<{
        url: string;
        fileName: string;
        width: number;
        height: number;
        bytes: number;
      }>
    >("/images", formData, { timeout: 60000 });
    return response.data.data;
  },
  categories: () => get<DetailCategory[]>("/categories"),
  addCategory: (p: Omit<DetailCategory, "categoryId">) =>
    post<{ categoryId: number }>("/categories", p),
  editCategory: (id: number, p: Omit<DetailCategory, "categoryId">) =>
    put(`/categories/${id}`, p),
  deleteCategory: (id: number) => del(`/categories/${id}`),
  pages: () => get<DetailPage[]>("/pages"),
  getPage: (id: number) =>
    get<DetailPage & { sections: DetailSection[] }>(`/pages/${id}`),
  addPage: (p: PagePayload) => post<{ pageId: number }>("/pages", p),
  editPage: (id: number, p: PagePayload) => put(`/pages/${id}`, p),
  deletePage: (id: number) => del(`/pages/${id}`),
  setPageStatus: (id: number, status: DetailStatus) =>
    patch(`/pages/${id}/status`, { status }),
  reorderPages: (orderedIds: number[]) => put("/pages/order", { orderedIds }),
  sections: (id: number) => get<DetailSection[]>(`/pages/${id}/sections`),
  addSection: (id: number, p: SectionPayload) =>
    post<{ sectionId: number }>(`/pages/${id}/sections`, p),
  editSection: (id: number, p: SectionPayload) => put(`/sections/${id}`, p),
  deleteSection: (id: number) => del(`/sections/${id}`),
  setSectionVisible: (id: number, isVisible: "Y" | "N") =>
    patch(`/sections/${id}/visibility`, { isVisible }),
  reorderSections: (id: number, orderedIds: number[]) =>
    put(`/pages/${id}/sections/order`, { orderedIds }),
};

export function detailErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401)
      return "관리자 로그인 세션이 만료되었어요. 다시 로그인해 주세요.";
    if (status === 403)
      return "관리자 권한이 없거나 요청 출처가 허용되지 않았어요.";
    if (status === 503)
      return (
        error.response?.data?.message ??
        "백엔드 요청 처리 중 오류가 발생했어요."
      );
    return (
      error.response?.data?.message ??
      error.message ??
      "서버에 연결할 수 없습니다."
    );
  }
  return error instanceof Error
    ? error.message
    : "알 수 없는 오류가 발생했습니다.";
}
