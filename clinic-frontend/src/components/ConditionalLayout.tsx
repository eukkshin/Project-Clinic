"use client";
// 브라우저의 현재 주소(URL)을 읽어야 하므로 이 파일은 클라이언트 컴포넌트로 선언합니다.
import { usePathname } from "next/navigation";
import React from "react";
import styled from "styled-components";

// 조건부로 사라져야할 컴포넌트 불러옴
import EventPopup from "./EventPopup";
import Footer from "./Footer";
import Header from "./Header";
import QuickConsultBar from "./QuickConsultBar";

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
