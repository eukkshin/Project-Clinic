"use client";

import { usePathname } from "next/navigation";
import React from "react";

import AuthModalHost from "@/components/auth/AuthModalHost";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import EventPopup from "@/components/ui/EventPopup";
import QuickConsultBar from "@/components/ui/QuickConsultBar";
import { stripLocalePrefix } from "@/i18n/url";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const rawPathname = usePathname() ?? "/";

  // 다국어 경로 및 마지막 슬래시 정규화
  const pathname = stripLocalePrefix(rawPathname).replace(/\/+$/, "") || "/";

  // 관리자 및 계정 찾기 페이지
  const isAdmin =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/find" ||
    pathname.startsWith("/find/");

  // 게시판 상세 페이지
  const isBoardPage = /^\/board\/.+/.test(pathname);

  // 회원가입 페이지 (로그인 모달은 제외)
  const isRegisterPage =
    pathname === "/register" ||
    (pathname.startsWith("/register/") && pathname !== "/register/login");

  // 상담 및 예약 페이지
  const isConRes = pathname === "/consultation" || pathname === "/reservation";

  const showCommonLayout = !isAdmin && !isBoardPage && !isRegisterPage;

  return (
    <>
      {!isAdmin && <EventPopup />}

      {showCommonLayout && <Header />}

      {children}

      {showCommonLayout && !isConRes && <Footer />}

      {showCommonLayout && <QuickConsultBar />}

      {showCommonLayout && <AuthModalHost />}
    </>
  );
}
