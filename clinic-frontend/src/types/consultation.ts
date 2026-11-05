export const CONSULT_DEPARTMENTS = [
  "눈성형",
  "코성형",
  "안면윤곽",
  "동안성형",
  "리프팅",
  "쁘띠시술",
  "기타 상담",
] as const;

export type ConsultDepartment = (typeof CONSULT_DEPARTMENTS)[number];
export type ConsultStatus = "대기중" | "상담중" | "상담완료";
export type CreateConsultInput = {
  name: string;
  phone: string;
  department: ConsultDepartment;
  title: string;
  content: string;
  privacyConsent: true;
  website?: string;
  captchaToken?: string;
};
export type ConsultRecord = {
  id: number;
  receiptNo: string;
  answer: string;
  answeredAt: string | null;
  assignedTo: string;
  name: string;
  phone: string;
  department: string;
  title: string;
  content: string;
  status: ConsultStatus;
  createdAt: string;
  userId?: string;
};
export type ConsultResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export type ConsultActivity = {
  id: number;
  kind:
    | "REPLY"
    | "STATUS_CHANGE"
    | "CALL_ATTEMPT"
    | "CALL_COMPLETED"
    | "INTERNAL_NOTE";
  text: string;
  adminId: string;
  createdAt: string;
};
