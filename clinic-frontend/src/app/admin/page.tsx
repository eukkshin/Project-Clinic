"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import * as S from "@/assets/css/Admin.style";
import { Popup } from "@/components/modal/Popup";

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
      const response = await fetch("http://127.0.0.1:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      //분기
      if (response.ok) {
        const targetPath = result.isAdmin === 1 ? "/admin/total" : "/";
        openPopup("로그인 성공", "로그인에 성공했습니다!", () => {
          router.push(targetPath);
          closePopup();
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
        <S.LoginCard>
          <S.LoginHeader>
            <S.LoginTitle>Admin System</S.LoginTitle>
          </S.LoginHeader>

          <S.LoginForm onSubmit={handleLogin}>
            <S.LoginCol>
              <S.LoginInput
                type="text"
                name="userId"
                placeholder=""
                value={formData.userId}
                onChange={handleChange}
              />
              <label htmlFor="userId">Enter User ID...</label>
            </S.LoginCol>
            <S.LoginCol>
              <S.LoginInput
                type="password"
                name="userPw"
                placeholder=""
                value={formData.userPw}
                onChange={handleChange}
              />
              <label htmlFor="password">Password</label>
            </S.LoginCol>

            <S.CheckboxGroup>
              <S.CheckboxInput type="checkbox" id="customCheck" />
              <S.CheckboxLabel htmlFor="customCheck">
                Remember Me
              </S.CheckboxLabel>
            </S.CheckboxGroup>

            <S.LoginButton type="submit">Login</S.LoginButton>
          </S.LoginForm>

          <S.Divider />

          <S.LinkGroup>
            <S.StyledLink>Forgot Password?</S.StyledLink>
            <S.StyledLink onClick={() => router.push("/register/terms")}>
              Create an Account!
            </S.StyledLink>
          </S.LinkGroup>
        </S.LoginCard>
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
