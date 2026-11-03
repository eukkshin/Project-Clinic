"use client";
import { API_ORIGIN } from "@/lib/api/config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiImage, FiPlus, FiSave, FiTrash2, FiType } from "react-icons/fi";

import { Popup } from "@/components/ui/Popup";
import * as S from "@/styles/admin/NavSetting.styles";

interface MenuItem {
  id: number;
  name: string;
  url: string;
}

export default function NavPage() {
  const [logoType, setLogoType] = useState<"TEXT" | "IMAGE">("TEXT");
  const [logoText, setLogoText] = useState<string>("성형외과 로고");
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);

  // 상태관리 팝업
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  //생명주기
  useEffect(() => {
    const fetchNavSettings = async () => {
      try {
        const response = await axios.get(`${API_ORIGIN}/api/admin/nav`);
        if (response.data.success) {
          const dbData = response.data.data;
          setLogoType(dbData.LOGO_TYPE);
          setLogoText(dbData.LOGO_TEXT);
          setLogoFileName(dbData.LOGO_FILE);

          if (dbData.MENUS && dbData.MENUS !== "[]") {
            setMenus(JSON.parse(dbData.MENUS));
          } else {
            //DB에 메뉴가 비어있으면 초기 기본값 세팅
            setMenus([
              { id: 1, name: "병원소개", url: "/" },
              { id: 2, name: "눈성형", url: "/" },
              { id: 3, name: "코성형", url: "/" },
              { id: 4, name: "동안성형", url: "/" },
              { id: 5, name: "쁘띠시술", url: "/" },
              { id: 6, name: "커뮤니티", url: "/" },
            ]);
          }
        }
      } catch (error) {
        console.error("설정 로드 실패:", error);
      }
    };
    fetchNavSettings();
  }, []);

  // 로고 이미지 파일 선택핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
      setLogoFileName(e.target.files[0].name);
    }
  };

  // 추가 삭제 변경 핸들러
  const handleAddMenu = () => {
    // 기존 목록이 있으면 가장 큰 id 번호 + 1, 없으면 1로 시작
    const nextId =
      menus.length > 0 ? Math.max(...menus.map((m) => m.id)) + 1 : 1;
    setMenus([...menus, { id: nextId, name: "", url: "" }]);
  };

  const handleRemoveMenu = (id: number) => {
    setMenus(menus.filter((menu) => menu.id !== id));
  };

  const handleMenuChange = (
    id: number,
    field: keyof MenuItem,
    value: string,
  ) => {
    setMenus(
      menus.map((menu) =>
        menu.id === id ? { ...menu, [field]: value } : menu,
      ),
    );
  };

  const handleSave = async () => {
    let finalFileName = logoFileName;
    try {
      if (logoType === "IMAGE" && logoFile) {
        const formData = new FormData();
        formData.append("logoImage", logoFile);

        const uploadRes = await axios.post(
          `${API_ORIGIN}/api/admin/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        if (uploadRes.data.success) {
          finalFileName = uploadRes.data.fileName;
        }
      }

      const payload = {
        logo: {
          type: logoType,
          text: logoType === "TEXT" ? logoText : null,
          fileName: logoType === "IMAGE" ? finalFileName : null,
        },
        menus: menus,
      };

      await axios.put(`${API_ORIGIN}/api/admin/nav`, payload);
      console.log("DB에 저장될 데이터", payload, finalFileName);
      setIsPopupOpen(true);
    } catch (error) {
      alert("설정 저장에 실패했습니다");
    }
  };

  return (
    <>
      <S.SetNavContainer>
        <S.SetNavPageHeader className="admin-page-header">
          <div className="admin-page-title-block">
            <span className="admin-page-eyebrow">WEBSITE / NAVIGATION</span>
            <S.SetNavPageTitle>네비게이션 관리</S.SetNavPageTitle>
            <p className="admin-page-description">
              사이트 메뉴 구성과 표시 순서를 관리합니다.
            </p>
          </div>
          <S.SetNavSaveButton
            className="admin-primary-action"
            onClick={handleSave}
          >
            <FiSave size={18} />
            저장하기
          </S.SetNavSaveButton>
        </S.SetNavPageHeader>
        <S.SetNavContentGrid className="admin-page-grid">
          <S.SetNavCard className="admin-panel">
            <S.SetNavCardHeader className="admin-panel-head">
              <S.SetNavCardTitle>상단 로고 설정</S.SetNavCardTitle>
            </S.SetNavCardHeader>
            <S.SetNavCardBody className="admin-panel-body">
              <p>웹사이트 최상단에 표시될 로고의 형태를 선택하세요.</p>
              <S.SetNavRadioGroup>
                <S.SetNavRadioLabel
                  $isActive={logoType === "TEXT"}
                  onClick={() => setLogoType("TEXT")}
                >
                  <FiType size={18} />
                  텍스트 로고
                </S.SetNavRadioLabel>
                <S.SetNavRadioLabel
                  $isActive={logoType === "IMAGE"}
                  onClick={() => setLogoType("IMAGE")}
                >
                  <FiImage size={18} />
                  이미지 로고
                </S.SetNavRadioLabel>
              </S.SetNavRadioGroup>
              <S.SetNavFileInputWrapper>
                {logoType === "TEXT" ? (
                  <>
                    <S.SetNavLabel>텍스트 입력</S.SetNavLabel>
                    <S.SetNavInput
                      type="text"
                      placeholder="로고 텍스트를 입력해주세요"
                      name="logoText"
                      value={logoText || ""}
                      onChange={(e) => setLogoText(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <S.SetNavLabel>이미지 파일 선택</S.SetNavLabel>
                    <S.SetNavFileInput
                      type="file"
                      name="logoFile"
                      accept="image/*"
                      onChange={handleFileChange}
                      id="logo-upload"
                    />
                    <S.SetNavFileLabel htmlFor="logo-upload">
                      파일선택
                    </S.SetNavFileLabel>
                    <span className="file-name">
                      {logoFileName || "선택된 파일이 없습니다"}
                    </span>
                  </>
                )}
              </S.SetNavFileInputWrapper>
            </S.SetNavCardBody>
          </S.SetNavCard>

          <S.SetNavCard className="admin-panel">
            <S.SetNavCardHeader className="admin-panel-head">
              <S.SetNavCardTitle>카테고리 및 URL 설정</S.SetNavCardTitle>
            </S.SetNavCardHeader>
            <S.SetNavCardBody className="admin-panel-body">
              <p>
                사용자가 클릭할 네비게이션 메뉴 이름과 이동할 주소를 입력하세요.
              </p>
              <S.SetNavMenuList>
                {menus.map((menu, index) => (
                  <S.SetNavMenuItem
                    className="admin-repeat-row"
                    key={`${menu.id}-${index}`}
                  >
                    <div className="menu-number">{index + 1}</div>
                    <S.SetNavInput
                      type="text"
                      placeholder="메뉴명(예: 시술안내)"
                      value={menu.name}
                      onChange={(e) =>
                        handleMenuChange(menu.id, "name", e.target.value)
                      }
                    />
                    <S.SetNavInput
                      type="text"
                      placeholder="URL(예: /treatment)"
                      value={menu.url}
                      onChange={(e) =>
                        handleMenuChange(menu.id, "url", e.target.value)
                      }
                    />
                    <S.SetNavDeleteButton
                      className="admin-delete-action"
                      onClick={() => handleRemoveMenu(menu.id)}
                    >
                      <FiTrash2 size={18} />
                    </S.SetNavDeleteButton>
                  </S.SetNavMenuItem>
                ))}
              </S.SetNavMenuList>
              <S.NavAddButton
                className="admin-outline-action"
                onClick={handleAddMenu}
              >
                <FiPlus size={18} />새 카테고리 추가
              </S.NavAddButton>
            </S.SetNavCardBody>
          </S.SetNavCard>
        </S.SetNavContentGrid>
      </S.SetNavContainer>
      <Popup
        isOpen={isPopupOpen}
        title="저장 완료"
        onClose={() => setIsPopupOpen(false)}
        onConfirm={() => setIsPopupOpen(false)}
      >
        네비게이션 설정이 성공적으로 저장되었습니다.
      </Popup>
    </>
  );
}
