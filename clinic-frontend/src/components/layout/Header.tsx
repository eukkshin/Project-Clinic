"use client";

import { API_ORIGIN } from "@/lib/api/config";
import axios from "axios";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaGlobe, FaPhone, FaRegCommentDots, FaRegUser } from "react-icons/fa6";

import * as SL from "@/components/dropdown/HeaderSearchLayout.styles";
import * as S from "@/components/layout/Header.styles";
import { usePublishedProcedureMenus } from "@/lib/detail/usePublishedProcedureMenus";
import { withAboutNavigation } from "@/lib/navigation/aboutNavigation";
import { withCommunityNavigation } from "@/lib/navigation/withCommunityNavigation";

import AccountDropdown from "@/components/dropdown/AccountDropdown";
import HeaderNavDropdown from "@/components/dropdown/HeaderNavDropdown";
import HeaderSearch from "@/components/dropdown/HeaderSearch";
import LanguageDropdown from "@/components/dropdown/LanguageDropdown";
import MobileProcedureSubmenu from "@/components/dropdown/MobileProcedureSubmenu";

/*
 * Header.tsx — Premium Ahn's Navigation
 * ----------------------------------------------------------
 * [기존 기능 보존]
 * - GET /api/admin/nav: 로고 종류, 로고 파일, 메뉴
 * - GET /api/admin/tone: 강조 색상, 다크 모드
 * - 스크롤 아래로 내리면 숨김 / 위로 올리면 등장
 * - 모바일 전체 화면 메뉴 + GSAP 순차 등장 + ESC 닫기
 * - 로그인 링크 / 관리자 파일 서버 이미지
 *
 * [개선]
 * - Hero 위: 얇고 투명한 헤더
 * - 일반 섹션: 크림/딥그린 반투명 배경
 * - 가짜 언어 변경 버튼/동작하지 않는 pill 버튼은 제거
 * - 상담 예약 CTA는 실제 연락 정보가 있는 Footer 위치로 이동
 * - 전화번호는 임의로 하드코딩하지 않고 관리자 Footer API에서 읽음
 */

interface MenuItem {
  id: number;
  name: string;
  url: string;
  children?: { name: string; url: string }[];
}
interface NavSettings {
  LOGO_TYPE?: "TEXT" | "IMAGE";
  LOGO_TEXT?: string;
  LOGO_FILE?: string;
  MENUS?: string | MenuItem[];
}
interface ToneSettings {
  PRIMARY_TONE?: string;
  IS_DARKMODE?: string;
}
interface FooterSettings {
  companyInfo?: { phone?: string };
}

const API_URL = API_ORIGIN;

const DEFAULT_MENUS: MenuItem[] = [
  { id: 1, name: "병원소개", url: "/" },
  { id: 2, name: "눈성형", url: "/" },
  { id: 3, name: "코성형", url: "/" },
  { id: 4, name: "동안성형", url: "/" },
  { id: 5, name: "쁘띠시술", url: "/" },
  { id: 6, name: "커뮤니티", url: "/" },
];

// 관리자 메뉴 URL에 javascript: 같은 주소가 들어오는 것을 방지한다.
function safeHref(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return "/";
}
function phoneHref(phone: string) {
  const normalized = phone.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : null;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const [logoType, setLogoType] = useState<"TEXT" | "IMAGE">("TEXT");
  const [logoText, setLogoText] = useState("Ahn's");
  const [logoFileName, setLogoFileName] = useState("");
  const [menus, setMenus] = useState<MenuItem[]>(
    withCommunityNavigation(withAboutNavigation(DEFAULT_MENUS)),
  );
  const publishedMenus = usePublishedProcedureMenus(menus);
  const [accent, setAccent] = useState("#879D87");
  const [isDark, setIsDark] = useState(false);
  const [phone, setPhone] = useState("");

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // 로그인 API에서 받은 userName을 localStorage에 저장하는 기존 방식과 연결
  const [userName, setUserName] = useState<string | null>(null);

  const previousY = useRef(0);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const isBrandPage = pathname === "/about/brand";
  const transparent =
    (isHome || isBrandPage) && !scrolled && !menuOpen && !searchOpen;
  const contactHref = isHome ? "#site-footer-contact" : "/#site-footer-contact";

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const syncUserName = () => {
      setUserName(window.localStorage.getItem("userName")?.trim() || null);
    };
    syncUserName();
    window.addEventListener("login-success", syncUserName);
    window.addEventListener("logout-success", syncUserName);
    window.addEventListener("storage", syncUserName);
    return () => {
      window.removeEventListener("login-success", syncUserName);
      window.removeEventListener("logout-success", syncUserName);
      window.removeEventListener("storage", syncUserName);
    };
  }, []);

  const handleLogout = useCallback(() => {
    window.localStorage.removeItem("userName");
    setUserName(null);
    setMenuOpen(false);
    window.dispatchEvent(new Event("logout-success"));
    router.push("/");
  }, [router]);

  /* [1] 관리자 설정을 네트워크에서 가져온다. 서로 독립적이므로 Promise.allSettled 사용. */
  useEffect(() => {
    const controller = new AbortController();
    const fetchSettings = async () => {
      const results = await Promise.allSettled([
        axios.get<{ success: boolean; data: NavSettings }>(
          `${API_URL}/api/admin/nav`,
          { signal: controller.signal },
        ),
        axios.get<{ success: boolean; data: ToneSettings }>(
          `${API_URL}/api/admin/tone`,
          { signal: controller.signal },
        ),
        axios.get<{ success: boolean; data: FooterSettings }>(
          `${API_URL}/api/admin/footer`,
          { signal: controller.signal },
        ),
      ]);
      if (controller.signal.aborted) return;
      const [nav, tone, footer] = results;

      if (nav.status === "fulfilled" && nav.value.data.success) {
        const data = nav.value.data.data;
        setLogoType(data.LOGO_TYPE === "IMAGE" ? "IMAGE" : "TEXT");
        setLogoText(data.LOGO_TEXT?.trim() || "Ahn's");
        setLogoFileName(data.LOGO_FILE?.trim() || "");
        try {
          const parsed: unknown =
            typeof data.MENUS === "string"
              ? JSON.parse(data.MENUS)
              : data.MENUS;
          if (Array.isArray(parsed)) {
            const valid = parsed
              .filter(
                (item): item is MenuItem =>
                  item !== null &&
                  typeof item === "object" &&
                  typeof item.id === "number" &&
                  typeof item.name === "string" &&
                  typeof item.url === "string",
              )
              .map((item) => ({
                id: item.id,
                name: item.name,
                url: item.url,
                children: Array.isArray(item.children)
                  ? item.children.filter(
                      (child) =>
                        child !== null &&
                        typeof child === "object" &&
                        typeof child.name === "string" &&
                        typeof child.url === "string",
                    )
                  : [],
              }));
            if (valid.length) {
              setMenus(withCommunityNavigation(withAboutNavigation(valid)));
            }
          }
        } catch (error) {
          console.error("헤더 메뉴 파싱 실패:", error);
        }
      }

      if (tone.status === "fulfilled" && tone.value.data.success) {
        const data = tone.value.data.data;
        const tones: Record<string, string> = {
          GREEN: "#879D87",
          PINK: "#C68D9F",
          BLUE: "#7D9FAA",
        };
        setAccent(tones[data.PRIMARY_TONE ?? ""] ?? "#879D87");
        setIsDark(data.IS_DARKMODE === "Y");
      }

      if (footer.status === "fulfilled" && footer.value.data.success) {
        setPhone(footer.value.data.data?.companyInfo?.phone?.trim() || "");
      }
    };
    void fetchSettings();
    return () => controller.abort();
  }, []);

  /* [2] 사용자의 스크롤 방향을 감지한다. 잦은 깜빡임을 막기 위해 임계값을 둔다. */
  useEffect(() => {
    previousY.current = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const difference = currentY - previousY.current;
      setScrolled(currentY > 45);
      if (currentY < 120 || menuOpen || searchOpen) setHidden(false);
      else if (difference > 7) setHidden(true);
      else if (difference < -7) setHidden(false);
      previousY.current = currentY;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen, searchOpen]);

  /* [3] 페이지가 바뀔 때 열린 모바일 메뉴를 자동으로 닫는다. */
  useEffect(() => {
    // URL 이동 결과로 모바일 메뉴가 열린 채 남지 않게 정리한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  /* [4] 모바일 메뉴를 열면 GSAP으로 메뉴가 아래에서 차례로 올라온다. */
  useEffect(() => {
    const panel = mobilePanelRef.current;
    if (!panel || !menuOpen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-mobile-item]",
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.075,
          ease: "power3.out",
        },
      );
    }, panel);
    return () => context.revert();
  }, [menuOpen]);

  /* [5] 모바일 메뉴가 열렸을 때 배경 페이지가 뒤에서 움직이지 않도록 한다. */
  useEffect(() => {
    if (!menuOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  const isActive = (url: string) => {
    if (!url || url === "/") return false;
    const clean = url.replace(/\/$/, "");
    return pathname === clean || pathname.startsWith(`${clean}/`);
  };
  const phoneLink = phoneHref(phone);

  return (
    <>
      <S.HeaderWrapper
        $hidden={hidden && !menuOpen && !searchOpen}
        $transparent={transparent}
        $dark={isDark}
        $accent={accent}
        $brandLight={isBrandPage}
      >
        <S.HeaderInner>
          <S.LogoGroup>
            <Link href="/" onClick={closeMenu} aria-label="Ahn's 홈페이지">
              {logoType === "IMAGE" && logoFileName ? (
                <S.LogoImageBox>
                  <Image
                    src={`${API_URL}/images/${encodeURIComponent(logoFileName)}`}
                    alt={logoText || "Ahn's"}
                    fill
                    sizes="(max-width: 768px) 130px, 180px"
                    style={{ objectFit: "contain" }}
                  />
                </S.LogoImageBox>
              ) : (
                <S.Logo>{logoText}</S.Logo>
              )}
            </Link>
          </S.LogoGroup>

          <S.NavGroup aria-label="주 메뉴">
            {publishedMenus.map((menu) => (
              <HeaderNavDropdown
                key={`${pathname}-${menu.id}`}
                menu={menu}
                active={
                  isActive(menu.url) ||
                  Boolean(menu.children?.some((child) => isActive(child.url)))
                }
                pathname={pathname}
                transparent={transparent}
                dark={isDark}
              />
            ))}
          </S.NavGroup>

          <SL.SearchUtilGroup $searchOpen={searchOpen}>
            <S.DesktopOnly>
              {phoneLink && (
                <SL.CompactAction $compact={searchOpen}>
                  <S.PhoneButton
                    href={phoneLink}
                    aria-label={`전화 문의 ${phone}`}
                    title={`전화 문의 ${phone}`}
                  >
                    {searchOpen ? (
                      <FaPhone size={15} aria-hidden="true" />
                    ) : (
                      <>
                        <span>CONTACT</span> {phone}
                      </>
                    )}
                  </S.PhoneButton>
                </SL.CompactAction>
              )}

              <SL.CompactAction $compact={searchOpen}>
                <S.CtaButton
                  as={Link}
                  href={contactHref}
                  aria-label="상담문의"
                  title="상담문의"
                >
                  {searchOpen ? (
                    <FaRegCommentDots size={17} aria-hidden="true" />
                  ) : (
                    <>
                      상담문의 <span aria-hidden="true">↗</span>
                    </>
                  )}
                </S.CtaButton>
              </SL.CompactAction>

              {userName ? (
                <SL.CompactAccount $compact={searchOpen}>
                  <AccountDropdown
                    userName={userName}
                    onLogout={handleLogout}
                    transparent={transparent}
                  />
                  {searchOpen && (
                    <SL.CoverIcon aria-hidden="true">
                      <FaRegUser size={16} />
                    </SL.CoverIcon>
                  )}
                </SL.CompactAccount>
              ) : (
                <SL.CompactAction $compact={searchOpen}>
                  <S.IconLink
                    as={Link}
                    href="/register/login"
                    aria-label="로그인"
                    title="로그인"
                  >
                    <FaRegUser size={16} />
                    {!searchOpen && <span aria-hidden="true">↗</span>}
                  </S.IconLink>
                </SL.CompactAction>
              )}

              <SL.CompactLanguage $compact={searchOpen}>
                <LanguageDropdown
                  onChange={(language) => {
                    console.log("선택한 언어:", language);
                  }}
                  transparent={transparent}
                />
                {searchOpen && (
                  <SL.CoverIcon aria-hidden="true">
                    <FaGlobe size={16} />
                  </SL.CoverIcon>
                )}
              </SL.CompactLanguage>
            </S.DesktopOnly>

            <HeaderSearch
              open={searchOpen}
              onOpenChange={(next) => {
                setSearchOpen(next);
                if (next) {
                  setHidden(false);
                  setMenuOpen(false);
                }
              }}
              menus={publishedMenus}
              transparent={transparent}
            />

            <SL.MobileAction $searchOpen={searchOpen}>
              <S.MobileContactLink
                as={Link}
                href={contactHref}
                onClick={closeMenu}
              >
                CONTACT ↗
              </S.MobileContactLink>
            </SL.MobileAction>
            <S.HamburgerButton
              type="button"
              $open={menuOpen}
              aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={menuOpen}
              aria-controls="ahns-mobile-navigation"
              onClick={() => {
                setSearchOpen(false);
                setMenuOpen((previous) => !previous);
              }}
            >
              <span />
              <span />
            </S.HamburgerButton>
          </SL.SearchUtilGroup>
        </S.HeaderInner>
      </S.HeaderWrapper>

      <S.MobileMenuOverlay
        id="ahns-mobile-navigation"
        ref={mobilePanelRef}
        $open={menuOpen}
        $dark={isDark}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <S.MobileMenuInner>
          <S.MobileMenuCaption data-mobile-item>
            EXPLORE AHN&apos;S
          </S.MobileMenuCaption>
          <S.MobileNav aria-label="모바일 주 메뉴">
            {publishedMenus.map((menu, index) => (
              <div key={menu.id}>
                <S.MobileNavLink
                  as={Link}
                  key={menu.id}
                  href={safeHref(menu.url)}
                  onClick={closeMenu}
                  data-mobile-item
                >
                  <span className="number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{menu.name}</span>
                  <span className="arrow" aria-hidden="true">
                    ↗
                  </span>
                </S.MobileNavLink>
                {Boolean(menu.children?.length) && (
                  <MobileProcedureSubmenu
                    items={menu.children ?? []}
                    onNavigate={closeMenu}
                  />
                )}
              </div>
            ))}
          </S.MobileNav>
          <S.MobileMenuFooter data-mobile-item>
            {phoneLink && <a href={phoneLink}>{phone}</a>}
            {userName ? (
              <AccountDropdown
                key={menuOpen ? "mobile-menu-open" : "mobile-menu-closed"}
                mobile
                userName={userName}
                onLogout={handleLogout}
                onNavigate={closeMenu}
              />
            ) : (
              <Link
                href="/register/login"
                onClick={closeMenu}
                title="로그인"
                aria-label="로그인"
              >
                <FaRegUser /> ↗
              </Link>
            )}
            <Link href={contactHref} onClick={closeMenu}>
              CONTACT ↗
            </Link>
          </S.MobileMenuFooter>
        </S.MobileMenuInner>
      </S.MobileMenuOverlay>
    </>
  );
}
