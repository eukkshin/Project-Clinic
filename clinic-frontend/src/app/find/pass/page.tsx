"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

import { Popup } from "@/components/ui/Popup";
import { API_ORIGIN } from "@/lib/api/config";
import * as S from "@/styles/auth/FindPassword.styles";

function MockPassPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🎯 이전 페이지에서 URL에 달아 보낸 userId를 쏙 빼옵니다.
  const userId = searchParams.get("userId");

  // 이름과 휴대폰 번호 (DB에 있는 정보와 맞는지 확인용)
  const [authData, setAuthData] = useState({
    userName: "",
    phone: "",
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
    setAuthData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMockAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authData.userName || !authData.phone) {
      openPopup("입력 오류", "이름과 휴대폰 번호를 모두 입력해 주세요.");
      return;
    }

    try {
      // 🎯 백엔드의 '이메일 발송 API'로 데이터를 쏩니다! (포트는 4000번)
      const response = await fetch(`${API_ORIGIN}/api/send-reset-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          userName: authData.userName,
          phone: authData.phone, // 필요하다면 백엔드에서 폰 번호도 같이 검증하도록 추가 가능합니다
        }),
      });

      const result = await response.json();

      if (response.ok) {
        openPopup(
          "발송 완료",
          "본인인증 완료! 등록된 이메일로 비밀번호 재설정 링크가 발송되었습니다.",
          () => {
            router.push("/terms");
          },
        );
      } else {
        openPopup(
          result.message || "인증 실패",
          "인증에 실패했습니다. 입력하신 정보를 다시 확인해 주세요.",
        );
        return;
      }
    } catch (error) {
      console.error("인증 및 발송 에러:", error);
      openPopup("서버 오류", "서버와 통신 중 오류가 발생했습니다.");
      return;
    }
  };

  return (
    <>
      <S.PwWrapper>
        <S.LeftSection>
          <S.Header>
            <S.LeftTitle>Ahn's</S.LeftTitle>
            <S.Divider />
            <S.LeftDescription>휴대폰 본인인증 페이지입니다.</S.LeftDescription>
          </S.Header>
        </S.LeftSection>
        {/* 💡 카드를 살짝 좁게 만들어서 진짜 모바일 인증창 같은 느낌을 줍니다 */}
        <S.RightSection>
          <S.Card style={{ maxWidth: "400px" }}>
            <S.Header>
              <S.PwTitle>휴대폰 본인인증</S.PwTitle>
              <S.Description>
                안전한 비밀번호 변경을 위해
                <br />
                가입 시 등록한 정보를 입력해 주세요.
              </S.Description>
            </S.Header>

            <S.Form onSubmit={handleMockAuth}>
              <S.PwCol>
                <S.PwInput
                  type="text"
                  name="userName"
                  placeholder=""
                  value={authData.userName}
                  onChange={handleChange}
                />
                <label htmlFor="userName">이름 (실명 입력)</label>
              </S.PwCol>
              <S.PwCol>
                <S.PwInput
                  type="text"
                  name="phone"
                  placeholder=""
                  value={authData.phone}
                  onChange={handleChange}
                />
                <label htmlFor="phone">휴대폰 번호 (숫자만 입력)</label>
              </S.PwCol>

              {/* 인증창 느낌을 내기 위해 버튼 색상을 살짝 다르게 줄 수도 있습니다 */}
              <S.AuthButton type="submit">PASS 인증하기</S.AuthButton>

              <S.PwButton
                type="button"
                onClick={() => router.back()}
                style={{
                  backgroundColor: "#858796",
                  borderColor: "#858796",
                  marginTop: "0",
                }}
              >
                취소
              </S.PwButton>
            </S.Form>
          </S.Card>
        </S.RightSection>
      </S.PwWrapper>
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

export default function MockPassPage() {
  return (
    <Suspense fallback={<p role="status">페이지를 불러오는 중입니다.</p>}>
      <MockPassPageContent />
    </Suspense>
  );
}
