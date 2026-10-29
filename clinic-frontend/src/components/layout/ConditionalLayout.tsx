"use client";

import { usePathname } from "next/navigation";
import React from "react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import EventPopup from "@/components/ui/EventPopup";
import QuickConsultBar from "@/components/ui/QuickConsultBar";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // pathname변수에 현재 주소를 저장
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/find");
  // ⭕ 백틱(`)을 사용해 문자열과 변수를 합칩니다.
  const AdminBoardPage = /^\/board\/.+/.test(pathname);
  const isAuthPage =
    pathname === "/register/login" || pathname === "/register/terms";

  return (
    <>
      {!isAdmin && <EventPopup />}
      {/* 관리자 페이지가 아닐때만 헤더(상단메뉴를 보여줌) */}
      {!isAdmin && !AdminBoardPage && !isAuthPage && <Header />}

      {children}

      {!isAdmin && !AdminBoardPage && !isAuthPage && <Footer />}
      {!isAdmin && !AdminBoardPage && !isAuthPage && <QuickConsultBar />}
    </>
  );
}
