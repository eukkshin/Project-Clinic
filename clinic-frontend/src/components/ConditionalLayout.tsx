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

// 🚀 [수정] Styled-Component를 컴포넌트 함수 외부로 이동시켰습니다.
// 이렇게 해야 페이지가 재렌더링되어도 스타일 정의를 중복 생성하지 않아 가볍고 빠릅니다.
const MainWrapper = styled.main<{ $isAdminProps: boolean }>`
  padding-top: ${(props) => (props.$isAdminProps ? "0px" : "90px")};
  min-height: calc(100vh - 579px);

  @media (max-width: 1024px) {
    padding-top: ${(props) => (props.$isAdminProps ? "0px" : "60px")};
    min-height: calc(100vh - 549px);
  }
`;

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

  return (
    <>
      {!isAdmin && <EventPopup />}
      {/* 관리자 페이지가 아닐때만 헤더(상단메뉴를 보여줌) */}
      {!isAdmin && !AdminBoardPage && <Header />}

      <MainWrapper $isAdminProps={isAdmin || AdminBoardPage}>
        {children}
      </MainWrapper>

      {!isAdmin && !AdminBoardPage && <Footer />}
      {!isAdmin && !AdminBoardPage && <QuickConsultBar />}
    </>
  );
}
