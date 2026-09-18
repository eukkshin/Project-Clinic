"use client";
//이동하기 위해서
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DaumPostcode from "react-daum-postcode";

import * as S from "@/assets/old/Sub.styles";
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

  const handleLogin = async () => {
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
        const isAdminUser = Number(result.isAdmin) === 1;

        // 1. 관리자 유저일 때와 일반 유저일 때의 목적지와 메시지를 분리합니다.
        const targetPath = isAdminUser ? "/admin" : "/";
        const successMessage = isAdminUser
          ? "관리자 계정으로 로그인하셨습니다. 관리자 페이지로 이동하여 다시 로그인해주세요."
          : "로그인에 성공했습니다!";

        // 2. 팝업은 한 번만 띄우고, 확인을 누르면 각자의 목적지로 이동시킵니다.
        openPopup("로그인 성공", successMessage, () => {
          router.push(targetPath);
          closePopup(); // 이동하면서 안전하게 팝업을 닫습니다.
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
      <S.Wrapper>
        <S.FormContainer>
          <S.PageTitle>로그인</S.PageTitle>
          <S.FormGroup>
            <S.Label>아이디</S.Label>
            <S.Input
              type="text"
              placeholder="아이디를 입력해주세요"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              onKeyDown={handleLogin}
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>비밀번호</S.Label>
            <S.Input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              name="userPw"
              value={formData.userPw}
              onChange={handleChange}
              onKeyDown={handleLogin}
            />
          </S.FormGroup>
          <S.LinkGroup>
            <S.StyledLink onClick={() => router.push("/register/terms")}>
              계정이 없으신가요? 회원가입&rarr;
            </S.StyledLink>
            <S.StyledLink onClick={() => router.push("/find")}>
              비밀번호를 잊으셨나요? 비밀번호 찾기&rarr;
            </S.StyledLink>
          </S.LinkGroup>

          <S.ButtonGroup>
            <S.Button $variant="solid" onClick={handleLogin}>
              로그인
            </S.Button>
          </S.ButtonGroup>
        </S.FormContainer>
      </S.Wrapper>
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
