"use client";
import { API_ORIGIN } from "@/lib/api/config";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Popup } from "@/components/ui/Popup";
import * as S from "@/styles/admin/Login.styles";

const API_URL = API_ORIGIN;

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userId: "",
    userPw: "",
  });

  const [popupConfig, setPopupConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: undefined as (() => void) | undefined,
  });

  const openPopup = (
    title: string,
    message: string,
    onConfirm?: (() => void) | undefined,
  ) => {
    setPopupConfig({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const closePopup = () => {
    setPopupConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault(); //폼 새로고침 방지
    //입력창 비움 방지
    if (!formData.userId || !formData.userPw) {
      openPopup("입력 오류", "아이디와 비밀번호를 모두 입력해 주세요");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/session/login`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

      //분기
      if (response.ok) {
        const targetPath = "/admin/root";
        openPopup("로그인 성공", "로그인에 성공했습니다!", () => {
          closePopup();
          router.replace(targetPath);
          router.refresh();
        });
        //관리자 라면
      } else {
        openPopup("로그인 실패", result.message || "로그인에 실패했습니다");
        return;
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      openPopup("서버 오류", "서버와 통신중 오류가 발생 했습니다");
      return;
    }
  };

  return (
    <>
      <S.LoginWrapper>
        <S.LeftSection>
          <S.LoginHeader>
            <S.LeftTitle>Ahn's.</S.LeftTitle>
            <S.Divider />
            <S.LoginDescription>
              운영을 위한 단정하고 명확한 공간. <br />
              <small>
                관리자 계정으로 로그인하여 회원, 상담 및 사이트 콘텐츠를
                관리하세요.
              </small>
            </S.LoginDescription>
          </S.LoginHeader>
        </S.LeftSection>
        <S.RightSection>
          <S.LoginCard>
            <S.LoginHeader>
              <span
                style={{
                  color: "#7c987f",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: ".16em",
                }}
              >
                SECURE ACCESS
              </span>
              <S.LoginTitle>관리자 로그인</S.LoginTitle>
              <p style={{ margin: 0, color: "#809084", fontSize: 12 }}>
                관리 시스템 이용을 위해 계정 정보를 입력해주세요.
              </p>
            </S.LoginHeader>
            <S.LoginForm onSubmit={handleLogin}>
              <S.LoginCol>
                <S.LoginInput
                  type="text"
                  name="userId"
                  id="userId"
                  autoComplete="username"
                  placeholder=""
                  value={formData.userId}
                  onChange={handleChange}
                />
                <label htmlFor="userId">관리자 아이디</label>
              </S.LoginCol>
              <S.LoginCol>
                <S.LoginInput
                  type="password"
                  name="userPw"
                  id="password"
                  autoComplete="current-password"
                  placeholder=""
                  value={formData.userPw}
                  onChange={handleChange}
                />
                <label htmlFor="password">비밀번호</label>
              </S.LoginCol>

              <S.LoginButton type="submit">관리자 로그인</S.LoginButton>
            </S.LoginForm>

            <S.Divider />

            <S.LinkGroup>
              <S.StyledLink onClick={() => router.push("/register/terms")}>
                일반 회원가입
              </S.StyledLink>
            </S.LinkGroup>
          </S.LoginCard>
        </S.RightSection>
      </S.LoginWrapper>
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
