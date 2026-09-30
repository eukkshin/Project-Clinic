"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FiAward,
  FiCamera,
  FiClipboard,
  FiCompass,
  FiFeather,
  FiFilm,
  FiGrid,
  FiLayers,
  FiLayout,
  FiLogOut,
  FiMessageSquare,
  FiRadio,
  FiShield,
  FiUsers,
  FiVideo,
} from "react-icons/fi";

import * as S from "@/assets/css/admin/Admin.style";
import { Popup } from "@/components/modal/Popup";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);

  //Sidebar 접힘/펼침 상태관리
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const handleLogoutClick = () => {
    document.cookie = "admin_token=; path=/; max-age=0;";
    openPopup("로그아웃", "안전하게 로그아웃 되었습니다.", () => {
      router.push("/admin");
      closePopup();
    });
  };

  return (
    <>
      <S.AdminContainer>
        <S.AdminSidebar $isCollapsed={isCollapsed}>
          <S.AdminSidebarBrand
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/root")}
          >
            {isCollapsed ? "관리자" : "관리자 패널"}
          </S.AdminSidebarBrand>

          <S.AdminNavItem
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/dashboard")}
          >
            <FiGrid size={20} />
            {!isCollapsed && <span>대시보드</span>}
          </S.AdminNavItem>

          <S.AdminNavItem
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/users")}
          >
            <FiUsers size={20} />
            {!isCollapsed && <span>회원관리</span>}
          </S.AdminNavItem>

          <S.AdminNavItem
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/boards")}
          >
            <FiClipboard size={20} />
            {!isCollapsed && <span>게시판관리</span>}
          </S.AdminNavItem>

          <S.AdminNavItem
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/consultations")}
          >
            <FiMessageSquare size={20} />
            {!isCollapsed && <span>상담신청관리</span>}
          </S.AdminNavItem>

          <S.AdminNavItem
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/tone")}
          >
            <FiFeather size={20} />
            {!isCollapsed && <span>톤앤매너관리</span>}
          </S.AdminNavItem>

          <S.AdminNavItem
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/nav")}
          >
            <FiCompass size={20} />
            {!isCollapsed && <span>네비게이션관리</span>}
          </S.AdminNavItem>

          <S.AdminNavItem
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/carousel")}
          >
            <FiFilm size={20} />
            {!isCollapsed && <span>슬라이드관리</span>}
          </S.AdminNavItem>

          <S.AdminNavItem
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/pop")}
          >
            <FiLayers size={20} />
            {!isCollapsed && <span>팝업관리</span>}
          </S.AdminNavItem>

          <S.AdminNavItem
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/news")}
          >
            <FiRadio size={20} />
            {!isCollapsed && <span>뉴스티커관리</span>}
          </S.AdminNavItem>

          <S.AdminNavItem
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/self")}
          >
            <FiCamera size={20} />
            {!isCollapsed && <span>셀피관리</span>}
          </S.AdminNavItem>

          <S.AdminNavItem
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/event")}
          >
            <FiAward size={20} />
            {!isCollapsed && <span>이벤트랭킹관리</span>}
          </S.AdminNavItem>

          <S.AdminNavItem
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/vlog")}
          >
            <FiVideo size={20} />
            {!isCollapsed && <span>VLOG관리</span>}
          </S.AdminNavItem>

          <S.AdminNavItem
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/safety")}
          >
            <FiShield size={20} />
            {!isCollapsed && <span>안전마취관리</span>}
          </S.AdminNavItem>

          <S.AdminNavItem
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/footer")}
          >
            <FiLayout size={20} />
            {!isCollapsed && <span>푸터관리</span>}
          </S.AdminNavItem>

          <S.SidebarTogglerWrapper>
            <S.SidebarToggler onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? "▶" : "◀"}
            </S.SidebarToggler>
          </S.SidebarTogglerWrapper>
        </S.AdminSidebar>

        <S.AdminContentWrapper>
          <S.AdminTopBar>
            <S.AdminTopbarBrand>성형외과 관리시스템</S.AdminTopbarBrand>
            <S.AdminTopbarRight>
              <S.AdminTopBarUser>최고관리자님</S.AdminTopBarUser>
              <S.AdminLogoutBtn onClick={handleLogoutClick}>
                <FiLogOut size={16} />
                로그아웃
              </S.AdminLogoutBtn>
            </S.AdminTopbarRight>
          </S.AdminTopBar>
          <S.AdminMain>{children}</S.AdminMain>
        </S.AdminContentWrapper>
      </S.AdminContainer>
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
