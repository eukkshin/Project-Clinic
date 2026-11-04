"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { accountApi } from "@/lib/mypage/account-settings-api";
import * as S from "@/styles/mypage/AccountSettings.styles";

const messages = {
  ko: {
    eyebrow: "05 / ACCOUNT WITHDRAWAL",
    title: "회원탈퇴",
    description:
      "계정 이용을 종료하고 모든 기기에서 로그아웃합니다. 예정된 예약이 있다면 먼저 취소하거나 병원에 문의해 주세요.",
    retention:
      "진료·상담·예약 정보는 관련 법령과 보유 기간에 따라 별도로 관리되며 회원탈퇴 즉시 전부 삭제되지는 않습니다. 개인정보 삭제 요청은 병원 개인정보 담당자에게 문의해 주세요.",
    password: "현재 비밀번호",
    confirm: "회원 서비스 탈퇴 및 로그인 종료를 이해했습니다.",
    submit: "회원탈퇴 신청",
    working: "처리 중...",
    error: "탈퇴 요청을 처리하지 못했습니다.",
  },
  en: {
    eyebrow: "05 / ACCOUNT WITHDRAWAL",
    title: "Close membership",
    description:
      "End your membership and sign out on all devices. Cancel any upcoming appointments or contact the clinic first.",
    retention:
      "Medical, consultation and booking information may be retained under applicable rules. Closing membership does not automatically erase all records. Contact the clinic for data erasure requests.",
    password: "Current password",
    confirm: "I understand my membership and access will end.",
    submit: "Close membership",
    working: "Processing...",
    error: "Unable to close membership.",
  },
  ja: {
    eyebrow: "05 / ACCOUNT WITHDRAWAL",
    title: "会員退会",
    description:
      "会員登録を終了し、すべての端末からログアウトします。今後の予約がある場合は事前に取り消すか、医院にお問い合わせください。",
    retention:
      "診療・相談・予約の情報は法令や保管期間に従って管理され、退会時にすべて削除されるわけではありません。削除請求は医院へお問い合わせください。",
    password: "現在のパスワード",
    confirm: "退会とログイン終了について理解しました。",
    submit: "退会する",
    working: "処理中...",
    error: "退会処理に失敗しました。",
  },
  "zh-CN": {
    eyebrow: "05 / ACCOUNT WITHDRAWAL",
    title: "注销会员账户",
    description:
      "结束会员服务并使所有设备退出登录。如有未来预约，请先取消或联系医院。",
    retention:
      "诊疗、咨询及预约信息可能依法保留。注销会员不代表所有记录立即删除。如需删除个人信息，请联系医院。",
    password: "当前密码",
    confirm: "我已了解会员服务和登录权限将终止。",
    submit: "注销会员",
    working: "处理中...",
    error: "注销失败。",
  },
  "zh-TW": {
    eyebrow: "05 / ACCOUNT WITHDRAWAL",
    title: "註銷會員帳戶",
    description:
      "終止會員服務並讓所有裝置登出。如有未來預約，請先取消或聯絡診所。",
    retention:
      "診療、諮詢及預約資訊可能依法保留。會員註銷不代表所有紀錄立即刪除。如需刪除個人資料，請聯絡診所。",
    password: "目前密碼",
    confirm: "我了解會員服務和登入權限將終止。",
    submit: "註銷會員",
    working: "處理中...",
    error: "註銷失敗。",
  },
} as const;

export default function AccountWithdrawal() {
  const locale = useLocale();
  const t = messages[locale as keyof typeof messages] ?? messages.ko;
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmed || !password || busy) return;
    setError("");
    setBusy(true);
    try {
      await accountApi.withdrawAccount(password);
      setPassword("");
      window.localStorage.removeItem("userName");
      window.dispatchEvent(new Event("logout-success"));
      router.replace(locale === "ko" ? "/" : `/${locale}`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <S.Panel>
      <S.SectionEyebrow>{t.eyebrow}</S.SectionEyebrow>
      <S.SectionTitle>{t.title}</S.SectionTitle>
      <S.SectionDescription>{t.description}</S.SectionDescription>
      <S.Note>{t.retention}</S.Note>
      {error && (
        <S.Alert $error role="alert">
          {error}
        </S.Alert>
      )}
      <form onSubmit={submit}>
        <S.FieldGrid>
          <S.Field $full>
            <S.FieldLabel htmlFor="withdraw-password">
              {t.password}
            </S.FieldLabel>
            <S.TextInput
              id="withdraw-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={busy}
            />
          </S.Field>
        </S.FieldGrid>
        <label
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            marginTop: 22,
            fontSize: 13,
            color: "#294737",
          }}
        >
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            disabled={busy}
          />
          <span>{t.confirm}</span>
        </label>
        <S.Actions>
          <S.Primary type="submit" disabled={busy || !confirmed || !password}>
            {busy ? t.working : t.submit}
          </S.Primary>
        </S.Actions>
      </form>
    </S.Panel>
  );
}
