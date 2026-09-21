"use client";
import React, { useState } from "react";
import { FiImage, FiPlus, FiSave, FiTrash2, FiType } from "react-icons/fi";

import * as S from "@/assets/css/Style.style";
import { Popup } from "@/components/modal/Popup";

interface MenuItem {
  id: number;
  name: string;
  url: string;
}

export default function NavPage() {
  const [logoType, setLogoType] = useState<"TEXT" | "IMAGE">("TEXT");
  const [logoText, setLogoText] = useState<string>("Ahn's");
  const [logoFileName, setLogoFileName] = useState<string>("");

  //시안과 똑같이 설정해야됨 (엄격하게)
  const [menus, setMenus] = useState<MenuItem[]>([
    { id: Date.now(), name: "병원소개", url: "/" },
    { id: Date.now(), name: "눈성형", url: "/" },
    { id: Date.now(), name: "코성형", url: "/" },
    { id: Date.now(), name: "동안성형", url: "/" },
    { id: Date.now(), name: "쁘띠시술", url: "/" },
    { id: Date.now(), name: "커뮤니티", url: "/" },
  ]);

  //상태관리 팝업
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  //로고 이미지 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFileName(e.target.files[0].name);
    }
  };

  //추가 삭제 변경 핸들러
  const handleAddMenu = () => {
    setMenus([...menus, { id: Date.now(), name: "", url: "" }]);
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

  const handleSave = () => {
    const payload = {
      logo: {
        type: logoType,
        text: logoText === "TEXT" ? logoText : null,
        fileName: logoFileName === "IMAGE" ? logoFileName : null,
      },
      menus: menus,
    };
    console.log("DB에 저장될 데이터: ", payload);
    setIsPopupOpen(true);
  };

  return (
    <>
      <S.SetNavContainer>
        <S.SetNavPageHeader>
          <S.SetNavPageTitle>네비게이션 관리</S.SetNavPageTitle>
          <S.SetNavSaveButton onClick={handleSave}>
            <FiSave size={18} />
            저장하기
          </S.SetNavSaveButton>
        </S.SetNavPageHeader>
        <S.SetNavContentGrid>
          <S.SetNavCard>
            <S.SetNavCardHeader>
              <S.SetNavCardTitle>상단 로고 설정</S.SetNavCardTitle>
            </S.SetNavCardHeader>
            <S.SetNavCardBody>
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
                      value={logoText}
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

          <S.SetNavCard>
            <S.SetNavCardHeader>
              <S.SetNavCardTitle>카테고리 및 URL 설정</S.SetNavCardTitle>
            </S.SetNavCardHeader>
            <S.SetNavCardBody>
              <p>
                사용자가 클릭할 네비게이션 메뉴 이름과 이동할 주소를 입력하세요.
              </p>
              <S.SetNavMenuList>
                {menus.map((menu, index) => (
                  <S.SetNavMenuItem key={`${menu.id}-${index}`}>
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
                        handleMenuChange(menu.id, "name", e.target.value)
                      }
                    />
                    <S.SetNavDeleteButton
                      onClick={() => handleRemoveMenu(menu.id)}
                    >
                      <FiTrash2 size={18} />
                    </S.SetNavDeleteButton>
                  </S.SetNavMenuItem>
                ))}
              </S.SetNavMenuList>
              <S.NavAddButton onClick={handleAddMenu}>
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
