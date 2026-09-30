"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiCheck, FiMoon, FiSave, FiSun } from "react-icons/fi";

import * as S from "@/assets/css/admin/Admin.style";
import { Popup } from "@/components/modal/Popup";

export default function TonePage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTone, setIsSelectedTone] = useState<"BLUE" | "PINK" | "GREEN">(
    "BLUE",
  );
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchTone = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/admin/tone",
        );
        if (response.data.success) {
          const dbData = response.data.data;
          if (dbData.PRIMARY_TONE) setIsSelectedTone(dbData.PRIMARY_TONE);
          if (dbData.IS_DARKMODE) setIsDarkMode(dbData.IS_DARKMODE === "Y");
        }
      } catch (error) {
        console.error("테마 설정 불러오기 실패: ", error);
      }
    };
    fetchTone();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        primaryTone: selectedTone,
        isDarkMode: isDarkMode ? "Y" : "N",
      };
      const response = await axios.put(
        "http://localhost:4000/api/admin/tone",
        payload,
      );
      if (response.data.success) {
        setIsPopupOpen(true);
      }
      console.log("DB에 저장될 데이터: ", payload);
    } catch (error) {
      console.error("테마 설정 저장 실패: ", error);
      alert("테마 설정 저장 실패");
    }
  };

  return (
    <>
      <S.ToneContainer>
        <S.TonePageHeader>
          <S.TonePageTitle>톤앤매너 관리</S.TonePageTitle>
          <S.ToneSaveButton onClick={handleSave}>
            <FiSave size={18} />
            저장하기
          </S.ToneSaveButton>
        </S.TonePageHeader>
        <S.ToneCardGrid>
          <S.ToneSettingsCard>
            <S.ToneCardHeader>
              <S.ToneCardTitle>브랜드 메인 컬러(TONE)</S.ToneCardTitle>
            </S.ToneCardHeader>
            <S.ToneCardBody>
              <p>웹사이트 전체에 적용될 주요 색상을 선택하세요</p>
              <S.ToneColorOptionWrapper>
                <S.ToneColorBox
                  $color="#4e73df"
                  $isActive={selectedTone === "BLUE"}
                  onClick={() => setIsSelectedTone("BLUE")}
                >
                  {selectedTone === "BLUE" && (
                    <FiCheck size={30} color="#fff" />
                  )}
                </S.ToneColorBox>
                <S.ToneColorBox
                  $color="#e83e8c"
                  $isActive={selectedTone === "PINK"}
                  onClick={() => setIsSelectedTone("PINK")}
                >
                  {selectedTone === "PINK" && (
                    <FiCheck size={30} color="#fff" />
                  )}
                </S.ToneColorBox>
                <S.ToneColorBox
                  $color="#1b4d3e"
                  $isActive={selectedTone === "GREEN"}
                  onClick={() => setIsSelectedTone("GREEN")}
                >
                  {selectedTone === "GREEN" && (
                    <FiCheck size={30} color="#fff" />
                  )}
                </S.ToneColorBox>
              </S.ToneColorOptionWrapper>
              <S.ToneSelectedText>
                현재 선택된 톤 :
                <strong>
                  {selectedTone === "BLUE"
                    ? "트러스트 블루(Blue)"
                    : selectedTone === "PINK"
                      ? "러블리 핑크(Pink)"
                      : "브런스윅 그린(Green)"}
                </strong>
              </S.ToneSelectedText>
            </S.ToneCardBody>
          </S.ToneSettingsCard>
          {/* Dark Mode 설정 카드 */}
          <S.ToneSettingsCard>
            <S.ToneCardHeader>
              <S.ToneCardTitle>다크모드(Dark Mode)</S.ToneCardTitle>
            </S.ToneCardHeader>
            <S.ToneCardBody>
              <p>사용자 화면의 다크모드 기본 상태를 설정합니다.</p>
              <S.ToneToggleWrapper>
                <S.ToneModeButton
                  $isActive={!isDarkMode}
                  $isDark={false}
                  onClick={() => setIsDarkMode(false)}
                >
                  <FiSun size={20} />
                  라이트모드
                </S.ToneModeButton>
                <S.ToneModeButton
                  $isActive={isDarkMode}
                  $isDark={true}
                  onClick={() => setIsDarkMode(true)}
                >
                  <FiMoon size={20} />
                  다크모드
                </S.ToneModeButton>
              </S.ToneToggleWrapper>
              <S.ToneSelectedText>
                현재 선택된 모드 :
                <strong>
                  {isDarkMode ? "다크모드" : "라이트모드(기본값)"}
                </strong>
              </S.ToneSelectedText>
            </S.ToneCardBody>
          </S.ToneSettingsCard>
        </S.ToneCardGrid>
      </S.ToneContainer>
      <Popup
        isOpen={isPopupOpen}
        title="저장 완료"
        onClose={() => setIsPopupOpen(false)}
        onConfirm={() => setIsPopupOpen(false)}
      >
        톤앤매너 설정이 성공적으로 저장되었습니다.
      </Popup>
    </>
  );
}
