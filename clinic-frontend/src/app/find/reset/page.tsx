"use client";
import { API_ORIGIN } from "@/lib/api/config";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

import { Popup } from "@/components/ui/Popup";
import * as S from "@/styles/auth/FindPassword.styles";

export default function ResetPwPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");

  const [pwData, setPwData] = useState({
    newPw: "",
    newPwConfirm: "",
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

  const hasConfirmValue =
    pwData.newPwConfirm.length > 0 && pwData.newPw.length > 0;
  const isMatch = pwData.newPw === pwData.newPwConfirm;
  const isConfirmError = hasConfirmValue && !isMatch;
  const isConfirmSuccess = hasConfirmValue && isMatch;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPwData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetPassword = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!userId) {
      openPopup(
        "이메일 오류",
        "잘못된 접근입니다. 이메일 링크를 다시 확인해 주세요.",
      );
      return;
    }
    if (!pwData.newPw || !pwData.newPwConfirm) {
      openPopup("입력 오류", "비밀번호를 모두 입력해 주세요.");
      return;
    }

    if (pwData.newPw !== pwData.newPwConfirm) {
      openPopup("비밀번호 오류", "비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(`${API_ORIGIN}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          newPw: pwData.newPw,
          newPwConfirm: pwData.newPwConfirm,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        openPopup(
          "비밀번호 변경 성공",
          "비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해 주세요.",
          () => {
            router.push("/admin");
            closePopup();
          },
        );
      } else {
        openPopup(
          "비밀번호 변경 실패",
          result.message || "비밀번호 변경에 실패했습니다.",
        );
      }
    } catch (error) {
      console.error("비밀번호 변경 에러:", error);
      openPopup("서버 오류", "서버와 통신중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <S.PwWrapper>
        <S.LeftSection>
          <S.Header>
            <S.LeftTitle>Ahn's</S.LeftTitle>
            <S.Divider />
            <S.LeftDescription>비밀번호 변경 페이지입니다.</S.LeftDescription>
          </S.Header>
        </S.LeftSection>
        <S.RightSection>
          <S.Card>
            <S.Header>
              <S.PwTitle>새 비밀번호 설정</S.PwTitle>
              <S.Description>
                앞으로 사용할 새로운 비밀번호를 입력해 주세요.
              </S.Description>
            </S.Header>

            <S.Form onSubmit={handleResetPassword}>
              <S.PwCol>
                <S.PwInput
                  type="password"
                  name="newPw"
                  placeholder=""
                  value={pwData.newPw}
                  onChange={handleChange}
                  $isError={isConfirmError}
                  $isSuccess={isConfirmSuccess}
                />
                <label htmlFor="newPw">새 비밀번호</label>
              </S.PwCol>
              <S.PwCol>
                <S.PwInput
                  type="password"
                  name="newPwConfirm"
                  placeholder=""
                  value={pwData.newPwConfirm}
                  onChange={handleChange}
                  $isError={isConfirmError}
                  $isSuccess={isConfirmSuccess}
                />
                <label htmlFor="newPwConfirm">새 비밀번호 확인</label>

                {(isConfirmSuccess && (
                  <S.PwMessage $isSuccess>비밀번호가 일치합니다.</S.PwMessage>
                )) ||
                  (isConfirmError && (
                    <S.PwMessage $isError>
                      비밀번호가 일치하지 않습니다.
                    </S.PwMessage>
                  ))}
              </S.PwCol>

              <S.PwButton type="submit">비밀번호 변경하기</S.PwButton>
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
