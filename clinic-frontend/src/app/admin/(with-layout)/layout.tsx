"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FiActivity,
  FiAward,
  FiCamera,
  FiChevronLeft,
  FiChevronRight,
  FiClipboard,
  FiCompass,
  FiExternalLink,
  FiFeather,
  FiFilm,
  FiGrid,
  FiHelpCircle,
  FiLayers,
  FiLayout,
  FiLogOut,
  FiMenu,
  FiMessageSquare,
  FiRadio,
  FiShield,
  FiUsers,
  FiVideo,
} from "react-icons/fi";

import * as A from "@/assets/css/admin/AdminShell.styles";
import { AdminWorkspaceTheme } from "@/assets/css/admin/AdminWorkspace.styles";
import { Popup } from "@/components/modal/Popup";

const menuGroups = [
  {
    label: "OVERVIEW",
    items: [{ href: "/admin/root", title: "운영 현황", icon: FiGrid }],
  },
  {
    label: "OPERATIONS",
    items: [
      { href: "/admin/users", title: "회원 관리", icon: FiUsers },
      {
        href: "/admin/consultations",
        title: "상담신청 관리",
        icon: FiMessageSquare,
      },
      { href: "/admin/boards", title: "게시판 관리", icon: FiClipboard },
    ],
  },
  {
    label: "SITE CONTENT",
    items: [
      { href: "/admin/carousel", title: "메인 비주얼", icon: FiFilm },
      { href: "/admin/nav", title: "네비게이션", icon: FiCompass },
      { href: "/admin/pop", title: "메인 팝업", icon: FiLayers },
      { href: "/admin/news", title: "카테고리 아이콘", icon: FiRadio },
      { href: "/admin/self", title: "셀피", icon: FiCamera },
      { href: "/admin/event", title: "이벤트 랭킹", icon: FiAward },
      { href: "/admin/vlog", title: "VLOG 영상", icon: FiVideo },
      { href: "/admin/safety", title: "안전 시스템", icon: FiShield },
    ],
  },
  {
    label: "SITE SETTINGS",
    items: [
      { href: "/admin/tone", title: "톤앤매너", icon: FiFeather },
      { href: "/admin/footer", title: "푸터", icon: FiLayout },
    ],
  },
] as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [popupConfig, setPopupConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: undefined as (() => void) | undefined,
  });
  const activeGroup = menuGroups.find((group) =>
    group.items.some(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
    ),
  );
  const activeItem = activeGroup?.items.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
  );
  const closePopup = () =>
    setPopupConfig((prev) => ({ ...prev, isOpen: false }));
  // Keep the original logout/cookie and Popup confirmation behavior.
  const handleLogoutClick = () => {
    document.cookie = "admin_token=; path=/; max-age=0;";
    setPopupConfig({
      isOpen: true,
      title: "로그아웃",
      message: "안전하게 로그아웃 되었습니다.",
      onConfirm: () => {
        router.push("/admin");
        closePopup();
      },
    });
  };

  return (
    <>
      <AdminWorkspaceTheme />
      <A.Shell className="ahns-ops-shell">
        <A.SidebarScrim
          type="button"
          aria-label="관리자 메뉴 닫기"
          $open={mobileOpen}
          onClick={() => setMobileOpen(false)}
        />
        <A.Sidebar $collapsed={collapsed} $mobileOpen={mobileOpen}>
          <A.Brand
            $collapsed={collapsed}
            href="/admin/root"
            onClick={() => setMobileOpen(false)}
          >
<<<<<<< HEAD
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
            <FiHelpCircle size={20} />
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

          <S.AdminNavItem
            $isCollapsed={isCollapsed}
            onClick={() => router.push("/admin/qna")}
          >
            <FiMessageSquare size={20} />
            {!isCollapsed && <span>Q&A관리</span>}
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
=======
            <A.BrandMark>A</A.BrandMark>
            {!collapsed && (
              <A.BrandText>
                <strong>AHN'S</strong>
                <small>ADMIN WORKSPACE</small>
              </A.BrandText>
            )}
          </A.Brand>
          <A.Navigation aria-label="관리자 메뉴">
            {menuGroups.map((group) => (
              <A.NavigationGroup key={group.label}>
                <A.NavigationLabel $collapsed={collapsed}>
                  {collapsed ? "· · ·" : group.label}
                </A.NavigationLabel>
                {group.items.map(({ href, title, icon: Icon }) => {
                  const active =
                    pathname === href || pathname.startsWith(href + "/");
                  return (
                    <A.NavItem
                      href={href}
                      key={href}
                      $active={active}
                      $collapsed={collapsed}
                      aria-current={active ? "page" : undefined}
                      title={collapsed ? title : undefined}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon aria-hidden="true" />
                      {!collapsed && <span>{title}</span>}
                    </A.NavItem>
                  );
                })}
              </A.NavigationGroup>
            ))}
          </A.Navigation>
          <A.SidebarBottom>
            {!collapsed && (
              <A.SidebarHint>
                <strong>AHN'S OPERATIONS</strong>
                <p>고객과 콘텐츠를 하나의 워크스페이스에서 관리하세요.</p>
              </A.SidebarHint>
            )}
            <A.CollapseButton
              type="button"
              aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
              {!collapsed && "메뉴 접기"}
            </A.CollapseButton>
          </A.SidebarBottom>
        </A.Sidebar>
        <A.Workspace>
          <A.Topbar>
            <A.TopbarLead>
              <A.MobileMenuButton
                type="button"
                aria-label="관리자 메뉴 열기"
                onClick={() => setMobileOpen(true)}
              >
                <FiMenu size={19} />
              </A.MobileMenuButton>
              <A.TopbarTitle>
                <strong>{activeItem?.title ?? "관리자 워크스페이스"}</strong>
                <small>AHN'S / {activeGroup?.label ?? "ADMIN"}</small>
              </A.TopbarTitle>
            </A.TopbarLead>
            <A.TopbarActions>
              <A.SiteLink
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                title="사이트 새 창에서 열기"
              >
                <FiExternalLink size={15} />
                <span>사이트 보기</span>
              </A.SiteLink>
              <A.Operator>
                <A.OperatorAvatar>AD</A.OperatorAvatar>
                <A.OperatorText>
                  <strong>최고관리자</strong>
                  <small>Administrator</small>
                </A.OperatorText>
              </A.Operator>
              <A.Logout type="button" onClick={handleLogoutClick}>
                <FiLogOut size={15} />
                <span>로그아웃</span>
              </A.Logout>
            </A.TopbarActions>
          </A.Topbar>
          <A.Main className="ahns-ops-main">{children}</A.Main>
        </A.Workspace>
      </A.Shell>
>>>>>>> dev
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
