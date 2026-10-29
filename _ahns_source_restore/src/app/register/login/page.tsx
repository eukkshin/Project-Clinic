"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

import * as S from "@/assets/css/auth/Auth.styles";
import { Popup } from "@/components/modal/Popup";

import AuthBrandPanel from "../AuthBrandPanel";

type LoginForm = { userId: string; userPw: string };
type PopupConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
};

type LoginResponse = {
  isAdmin?: number | string | boolean;
  userName?: string;
  message?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({
    userId: "",
    userPw: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [popupConfig, setPopupConfig] = useState<PopupConfig>({
    isOpen: false,
    title: "",
    message: "",
  });

  const openPopup = (
    title: string,
    message: string,
    onConfirm?: () => void,
  ) => {
    setPopupConfig({ isOpen: true, title, message, onConfirm });
  };
  const closePopup = () => {
    setPopupConfig((previous) => ({ ...previous, isOpen: false }));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name !== "userId" && name !== "userPw") return;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  // 기존 Express POST /api/login 및 userId/userPw 계약을 그대로 유지한다.
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    if (!formData.userId.trim() || !formData.userPw) {
      openPopup("입력 오류", "아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: formData.userId.trim(),
          userPw: formData.userPw,
        }),
      });

      // 서버가 에러 시 HTML을 반환하더라도 처리할 수 있도록 방어한다.
      const result = (await response.json().catch(() => ({}))) as LoginResponse;

      if (!response.ok) {
        openPopup("로그인 실패", result.message || "로그인에 실패했습니다.");
        return;
      }

      const isAdminUser = Number(result.isAdmin) === 1;

      if (!isAdminUser && result.userName) {
        localStorage.setItem("userName", result.userName);

        window.dispatchEvent(new Event("login-success"));
      }

      const targetPath = isAdminUser ? "/admin" : "/";
      const successMessage = isAdminUser
        ? "관리자 계정으로 로그인하셨습니다. 관리자 페이지로 이동하여 다시 로그인해주세요."
        : "로그인에 성공했습니다!";

      // 기존 분기/이동 정책을 바꾸지 않고 팝업 확인 후 이동한다.
      openPopup("로그인 성공", successMessage, () => {
        closePopup();
        router.push(targetPath);
      });
    } catch (error) {
      console.error("로그인 요청 실패:", error);
      openPopup("서버 오류", "서버와 통신하는 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <S.AuthShell>
        <S.AuthLayout>
          <AuthBrandPanel mode="login" />
          <S.FormSurface aria-labelledby="login-title">
            <S.FormContent>
              <S.Topline>
                <span>MEMBER ACCESS / 01</span>
                <S.TextLink href="/">홈으로 돌아가기 ↗</S.TextLink>
              </S.Topline>
              <S.Kicker>WELCOME BACK</S.Kicker>
              <S.Heading id="login-title">다시 만나서 반가워요.</S.Heading>
              <S.Lead>
                Ahn&apos;s의 특별한 서비스가 기다리고 있어요.
                <br />
                로그인하고 당신만의 이야기를 이어가세요.
              </S.Lead>

              <S.Form onSubmit={handleLogin} noValidate>
                <S.Field>
                  <S.Label htmlFor="login-user-id">아이디</S.Label>
                  <S.TextInput
                    id="login-user-id"
                    type="text"
                    autoComplete="username"
                    name="userId"
                    value={formData.userId}
                    placeholder="아이디를 입력해 주세요"
                    onChange={handleChange}
                  />
                </S.Field>
                <S.Field>
                  <S.Label htmlFor="login-user-pw">비밀번호</S.Label>
                  <S.InputWrap>
                    <S.InputWithButton
                      id="login-user-pw"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      name="userPw"
                      value={formData.userPw}
                      placeholder="비밀번호를 입력해 주세요"
                      onChange={handleChange}
                    />
                    <S.InsideButton
                      type="button"
                      aria-label={
                        showPassword ? "비밀번호 숨기기" : "비밀번호 표시"
                      }
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? "숨기기" : "보기"}
                    </S.InsideButton>
                  </S.InputWrap>
                </S.Field>
                <S.FormLinks>
                  <S.TextLink href="/find">비밀번호를 잊으셨나요?</S.TextLink>
                </S.FormLinks>
                <S.Button type="submit" disabled={submitting}>
                  {submitting ? "로그인 중..." : "로그인하기  ↗"}
                </S.Button>
              </S.Form>

              <S.FormFooter>
                아직 Ahn&apos;s 회원이 아니신가요?{" "}
                <S.TextLink href="/register/terms">회원가입하기 →</S.TextLink>
              </S.FormFooter>
            </S.FormContent>
          </S.FormSurface>
        </S.AuthLayout>
      </S.AuthShell>

      <Popup
        isOpen={popupConfig.isOpen}
        title={popupConfig.title}
        onClose={closePopup}
        onConfirm={popupConfig.onConfirm}
      >
        {popupConfig.message}
      </Popup>
    </>
  );
}
