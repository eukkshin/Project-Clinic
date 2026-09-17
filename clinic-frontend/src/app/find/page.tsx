"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import * as S from "@/assets/css/Style.style";
import { Popup } from "@/components/modal/Popup";

export default function ChangePwPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");

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

  //패스워드 변경에 필요한 4가지 상태 값
  //   const [formData, setFormData] = useState({
  //     userId: "",
  //     currentPw: "",
  //     newPw: "",
  //     newPwConfirm: "",
  //   });

  //비밀번호 검사
  //   const hasConfirmValue =
  //     formData.newPwConfirm.length > 0 && formData.newPw.length > 0;
  //   const isMatch = formData.newPw === formData.newPwConfirm;
  //   const isConfirmError = hasConfirmValue && !isMatch;
  //   const isConfirmSuccess = hasConfirmValue && isMatch;

  //값을 입력할때
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleGotoPass = async (e: React.SubmitEvent) => {
    e.preventDefault();
    //필수값 체크
    if (!userId) {
      openPopup("입력 오류", "아이디를 먼저 입력해주세요.");
      return;
    }

    router.push(`/find/pass?userId=${userId}`);

    //짝퉁 PASS페이지로 이동하면서 아이디를 몰래 달아보냄

    //새 비밀번호 일치여부 체크
    // if (!isMatch) {
    //   openPopup("새 비밀번호가 일치하지 않습니다.");
    // }

    // try {
    //   const response = await fetch(
    //     "http://127.0.0.1:4000/api/change-password",
    //     {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(formData),
    //     },
    //   );
    //   const result = await response.json();
    //   if (response.ok) {
    //     alert("비밀번호가 성공적으로 변경되었습니다.");
    //     router.push("/admin"); //변경 후 로그인페이지로..
    //   } else {
    //     alert(result.message || "비밀번호 변경에 실패했습니다.");
    //   }
    // } catch (error) {
    //   console.error("비밀번호 변경 에러:", error);
    //   alert("서버와 통신중 오류가 발생했습니다.");
    // }
  };

  return (
    <>
      <S.PwWrapper>
        <S.LeftSection>
          <S.Header>
            <S.LeftTitle>Ahn's</S.LeftTitle>
            <S.LeftDescription>비밀번호 변경 페이지입니다.</S.LeftDescription>
          </S.Header>
        </S.LeftSection>
        <S.RightSection>
          <S.Card>
            <S.Header>
              <S.PwTitle>비밀번호 변경</S.PwTitle>
              <S.Description>
                계정 보호를 위해 기본 비밀번호와 <br />
                새로운 비밀번호를 입력해주세요.
              </S.Description>
            </S.Header>
            <S.Form onSubmit={handleGotoPass}>
              <S.PwCol>
                <S.PwInput
                  type="text"
                  name="userId"
                  placeholder=""
                  value={userId}
                  onChange={handleChange}
                />
                <label htmlFor="userId">아이디</label>
              </S.PwCol>
              {/* <S.PwCol>
              <S.PwInput
                type="password"
                name="currentPw"
                placeholder=""
                value={formData.currentPw}
                onChange={handleChange}
              />
              <label htmlFor="currentPw">현재 비밀번호</label>
            </S.PwCol>
            <S.PwCol>
              <S.PwInput
                type="password"
                name="newPw"
                placeholder=""
                value={formData.newPw}
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
                value={formData.newPwConfirm}
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
            </S.PwCol> */}

              <S.PwButton type="submit">본인인증 진행하기</S.PwButton>
            </S.Form>
            <S.Divider />

            <S.LinkGroup>
              <S.StyledLink onClick={() => router.push("/register/terms")}>
                아직 계정이 없으신가요? 회원가입&rarr;
              </S.StyledLink>
              <S.StyledLink onClick={() => router.push("/admin/login")}>
                이미 계정이 있으신가요? 로그인&rarr;
              </S.StyledLink>
            </S.LinkGroup>
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
