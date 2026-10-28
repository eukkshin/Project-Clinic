"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
  FiFileText,
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
import { Popup } from "@/ui/modal/Popup";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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
      { href: "/admin/qna", title: "QnA 관리", icon: FiHelpCircle },
      { href: "/admin/details", title: "상세페이지", icon: FiFileText },
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
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/api/admin/session/me`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((response) => {
        if (!active) return;
        if (!response.ok) {
          router.replace("/admin");
        } else {
          setAuthChecked(true);
        }
      })
      .catch(() => {
        if (active) router.replace("/admin");
      });
    return () => {
      active = false;
    };
  }, [router]);
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
  const handleLogoutClick = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/session/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("로그아웃 실패");
      setPopupConfig({
        isOpen: true,
        title: "로그아웃",
        message: "안전하게 로그아웃 되었습니다.",
        onConfirm: () => {
          router.replace("/admin");
          closePopup();
        },
      });
    } catch (error) {
      console.error(error);
      setPopupConfig({
        isOpen: true,
        title: "로그아웃 오류",
        message: "로그아웃 요청에 실패했습니다.",
        onConfirm: undefined,
      });
    }
  };

  if (!authChecked) return null;

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
