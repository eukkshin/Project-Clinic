"use Client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import * as S from "@/assets/css/Style.style";

import GlobeIcon from "./icons/GlobeIcon";
import UserIcon from "./icons/UserIcon";

interface MenuItem {
  id: number;
  name: string;
  url: string;
}

export default function Header() {
  const [logoType, setLogoType] = useState<"TEXT" | "IMAGE">("TEXT");
  const [logoText, setLogoText] = useState<string>("Ahn's");
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [menus, setMenus] = useState<MenuItem[]>([]);

  //톤앤매너
  const [themeColor, setThemeColor] = useState<string>("#fecbec");
  const [isDark, setIsDark] = useState<boolean>(false);

  const [hide, setHide] = useState(false);
  const [pageY, setPageY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollY } = window;

      if (scrollY > pageY && scrollY > 50) {
        setHide(true);
      } else if (scrollY < pageY) {
        setHide(false);
      }

      setPageY(scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pageY]);

  useEffect(() => {
    const fetchNavSettings = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/admin/nav");
        if (response.data.success) {
          const dbData = response.data.data;
          console.log("=== 백엔드가 보내준 원본 데이터 구조 ===", dbData);
          setLogoType(dbData.LOGO_TYPE);
          setLogoText(dbData.LOGO_TEXT || "");
          setLogoFileName(dbData.LOGO_FILE || "");

          if (dbData.MENUS && dbData.MENUS !== "[]") {
            setMenus(JSON.parse(dbData.MENUS));
          } else {
            setMenus([
              { id: 1, name: "병원소개", url: "/" },
              { id: 2, name: "눈성형", url: "/" },
              { id: 3, name: "코성형", url: "/" },
              { id: 4, name: "동안성형", url: "/" },
              { id: 5, name: "쁘띠시술", url: "/" },
              { id: 6, name: "커뮤니티", url: "/" },
            ]);
          }
        } else {
          setMenus([
            { id: 1, name: "병원소개", url: "/" },
            { id: 2, name: "눈성형", url: "/" },
            { id: 3, name: "코성형", url: "/" },
            { id: 4, name: "동안성형", url: "/" },
            { id: 5, name: "쁘띠시술", url: "/" },
            { id: 6, name: "커뮤니티", url: "/" },
          ]);
        }
      } catch (error) {
        console.error("헤더 네비게이션 로드 실패: ", error);
        setMenus([
          { id: 1, name: "병원소개", url: "/" },
          { id: 2, name: "눈성형", url: "/" },
          { id: 3, name: "코성형", url: "/" },
          { id: 4, name: "동안성형", url: "/" },
          { id: 5, name: "쁘띠시술", url: "/" },
          { id: 6, name: "커뮤니티", url: "/" },
        ]);
      }
    };
    fetchNavSettings();
  }, []);

  useEffect(() => {
    const fetchThemeSetting = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/admin/tone",
        );
        if (response.data.success) {
          const dbData = response.data.data;
          setThemeColor(
            dbData.PRIMARY_TONE === "PINK"
              ? "#e83e8c"
              : dbData.PRIMARY_TONE === "GREEN"
                ? "#1b4d3e"
                : "#4e73df",
          );
          setIsDark(dbData.IS_DARKMODE === "Y");
        }
      } catch (error) {
        console.error("테마 설정 불러오기 실패: ", error);
      }
    };
    fetchThemeSetting();
  }, []);

  const bgColor = isDark ? "#1a1a1a" : "#fff";
  const textColor = isDark ? "#fff" : "#333";

  return (
    <>
      <S.HeaderWrapper
        $isHide={hide}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderColor: bgColor,
        }}
      >
        <S.HeaderInner>
          {/* 로고 영역 */}
          <S.LogoGroup>
            <Link href="/">
              {logoType === "TEXT" ? (
                <S.Logo style={{ color: textColor }}>{logoText}</S.Logo>
              ) : (
                <S.LogoImg
                  src={`http://localhost:4000/images/${logoFileName}`}
                  alt="성형외과 웹사이트 로고"
                />
              )}
            </Link>
          </S.LogoGroup>

          {/* 메인 네비게이션 영역 */}
          <S.NavGroup>
            {menus.map((menu, index) => (
              <Link href={menu.url || "/"} key={menu.id}>
                <S.NavItem $active={index === 1} style={{ color: textColor }}>
                  {menu.name}
                </S.NavItem>
              </Link>
            ))}
          </S.NavGroup>

          {/* 유틸리티 영역 */}
          <S.UtilGroup>
            <S.DesktopOnly>
              <S.PhoneButton
                href="tel:02-932-2222"
                style={{
                  backgroundColor: isDark ? "#2a2a2a" : "#fff",
                  color: textColor,
                  borderColor: isDark ? "#444" : "#ddd",
                }}
              >
                TEL.<span>02.932.2222</span>
              </S.PhoneButton>
              <S.CtaButtton
                style={{
                  backgroundColor: isDark ? "#2a2a2a" : "#fff",
                  color: textColor,
                  borderColor: isDark ? "#444" : "#ddd",
                }}
              >
                상담예약
              </S.CtaButtton>
              <S.IconButton
                aria-label="Language"
                style={{
                  backgroundColor: isDark ? "#2a2a2a" : "#fff",
                  color: textColor,
                  borderColor: isDark ? "#444" : "#ddd",
                }}
              >
                <GlobeIcon />
              </S.IconButton>
              <S.IconButton
                aria-label="My page"
                style={{
                  backgroundColor: isDark ? "#2a2a2a" : "#fff",
                  color: textColor,
                  borderColor: isDark ? "#444" : "#ddd",
                }}
              >
                <Link href="/register/login">
                  <UserIcon />
                </Link>
              </S.IconButton>
            </S.DesktopOnly>
            {/* 모바일 화면에만 나타나는 요소들 */}
            <S.MobilePillButton
              style={{
                backgroundColor: isDark ? "#2a2a2a" : "#fff",
                color: textColor,
                borderColor: isDark ? "#444" : "#ddd",
              }}
            >
              Men's
            </S.MobilePillButton>
            <S.MobilePillButton
              style={{
                backgroundColor: isDark ? "#2a2a2a" : "#fff",
                color: textColor,
                borderColor: isDark ? "#444" : "#ddd",
              }}
            >
              breast
            </S.MobilePillButton>

            <S.HamburgerButton aria-label="Mobile Menu">
              <span style={{ backgroundColor: textColor }}></span>
              <span style={{ backgroundColor: textColor }}></span>
              <span style={{ backgroundColor: textColor }}></span>
            </S.HamburgerButton>
          </S.UtilGroup>
        </S.HeaderInner>
      </S.HeaderWrapper>
    </>
  );
}
