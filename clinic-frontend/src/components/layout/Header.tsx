"use client";

import axios from "axios";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaCalendarCheck,
  FaGlobe,
  FaPhone,
  FaRegCommentDots,
  FaRegUser,
} from "react-icons/fa6";

import { handleLoginLinkClick } from "@/components/auth/openLoginModal";
import AccountDropdown from "@/components/dropdown/AccountDropdown";
import HeaderNavDropdown from "@/components/dropdown/HeaderNavDropdown";
import HeaderSearch from "@/components/dropdown/HeaderSearch";
import * as SL from "@/components/dropdown/HeaderSearchLayout.styles";
import MobileProcedureSubmenu from "@/components/dropdown/MobileProcedureSubmenu";
import LanguageDropdown from "@/components/i18n/LanguageDropdownI18n";
import * as S from "@/components/layout/Header.styles";
import { stripLocalePrefix } from "@/i18n/url";
import { API_ORIGIN } from "@/lib/api/config";
import { usePublishedProcedureMenus } from "@/lib/detail/usePublishedProcedureMenus";
import { localizeNavigationLabel } from "@/lib/i18n/localizeNavigation";
import { withAboutNavigation } from "@/lib/navigation/aboutNavigation";
import { withCommunityNavigation } from "@/lib/navigation/withCommunityNavigation";
import { recordSearchKeyword } from "@/lib/search/recordSearchKeyword";

import type {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from "react";

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

/**
 * 기존 HeaderSearch의 입력창과 추천 UI는 그대로 사용합니다.
 * HeaderSearch 컴포넌트 내부를 수정하지 않고 제출 이벤트만 처리합니다.
 */
const HEADER_SEARCH_INPUT_SELECTOR = [
  'input[type="search"]',
  'input[role="searchbox"]',
  'input[name="q"]',
  'input[name="query"]',
  'input[type="text"]',
  "input:not([type])",
].join(", ");

function findHeaderSearchInput(root: ParentNode): HTMLInputElement | null {
  return root.querySelector<HTMLInputElement>(HEADER_SEARCH_INPUT_SELECTOR);
}

export default function Header() {
  const tHeader = useTranslations("Header");
  const tAuth = useTranslations("Auth");
  const tNavigation = useTranslations("Navigation");
  const pathname = stripLocalePrefix(usePathname());

  const router = useRouter();

  const isHome = pathname === "/";

  const [logoType, setLogoType] = useState<"TEXT" | "IMAGE">("TEXT");

  const [logoText, setLogoText] = useState("Ahn's");

  const [logoFileName, setLogoFileName] = useState("");

  const [menus, setMenus] = useState<MenuItem[]>(
    withCommunityNavigation(withAboutNavigation(DEFAULT_MENUS)),
  );

  const publishedMenus = usePublishedProcedureMenus(menus);

  // DB labels can be Korean: localize only recognized labels at render time.
  // The original menu object remains unchanged for API, navigation rules and URLs.
  const localizedMenus = publishedMenus.map((menu) => ({
    ...menu,
    name: localizeNavigationLabel(menu.name, menu.url, "top", tNavigation),
    children: menu.children?.map((child) => ({
      ...child,
      name: localizeNavigationLabel(
        child.name,
        child.url,
        "child",
        tNavigation,
      ),
    })),
  }));

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

  const contactHref = "/consultation";

  const reservationHref = "/reservation";

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // 헤더 중앙 메뉴/검색 UI의 레이아웃을 수정하지 않고 통합검색 이동만 연결.
  const navigateToIntegratedSearch = useCallback(
    (rawQuery: string): boolean => {
      const query = rawQuery.replace(/\s+/g, " ").trim().slice(0, 60);
      if (!searchOpen || !query) return false;

      recordSearchKeyword(query);
      setSearchOpen(false);
      setMenuOpen(false);
      setHidden(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
      return true;
    },
    [router, searchOpen],
  );

  // 검색 입력창이 form 내부에 있으면 Enter와 submit 버튼의 제출 이벤트를 처리.
  const handleSearchSubmitCapture = useCallback(
    (event: FormEvent<HTMLElement>) => {
      if (!searchOpen || !(event.target instanceof HTMLFormElement)) return;
      const input = findHeaderSearchInput(event.target);
      if (!input || input.getAttribute("aria-activedescendant")) return;
      if (!input.value.trim()) return;

      event.preventDefault();
      event.stopPropagation();
      navigateToIntegratedSearch(input.value);
    },
    [navigateToIntegratedSearch, searchOpen],
  );

  // 별도의 form이 없는 검색창도 Enter 제출 가능.
  const handleSearchKeyDownCapture = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (!searchOpen || event.key !== "Enter" || event.nativeEvent.isComposing)
        return;
      if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)
        return;
      if (!(event.target instanceof HTMLInputElement)) return;
      const input = event.target;
      if (input.closest("form") || !input.matches(HEADER_SEARCH_INPUT_SELECTOR))
        return;
      if (input.getAttribute("aria-activedescendant") || !input.value.trim())
        return;

      event.preventDefault();
      event.stopPropagation();
      navigateToIntegratedSearch(input.value);
    },
    [navigateToIntegratedSearch, searchOpen],
  );

  // form 밖의 명시적인 검색 실행 버튼에도 대응.
  // 기존 열기/닫기 버튼은 가로채지 않습니다.
  const handleSearchClickCapture = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      if (!searchOpen || !(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>("button");
      if (!button || button.closest("form")) return;
      if (
        !button.matches(
          'button[data-search-submit="true"], button[aria-label="검색하기"], button[aria-label="통합검색"]',
        )
      )
        return;

      const input = findHeaderSearchInput(event.currentTarget);
      if (
        !input ||
        input.getAttribute("aria-activedescendant") ||
        !input.value.trim()
      )
        return;

      event.preventDefault();
      event.stopPropagation();
      navigateToIntegratedSearch(input.value);
    },
    [navigateToIntegratedSearch, searchOpen],
  );

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

  const handleLogout = useCallback(async () => {
    try {
      // 1. 백엔드에 로그아웃 요청

      const response = await fetch(`${API_URL}/api/logout`, {
        method: "POST",

        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("로그아웃 API 요청 실패");
      }

      // 2. 브라우저에 저장한 표시용 사용자 정보 삭제

      window.localStorage.removeItem("userName");

      // 3. Header 로그인 상태 초기화

      setUserName(null);

      // 4. 모바일 메뉴 닫기

      setMenuOpen(false);

      // 5. 다른 컴포넌트에 로그아웃 알림

      window.dispatchEvent(new Event("logout-success"));

      // 6. 메인 페이지로 이동

      router.replace("/");

      router.refresh();
    } catch (error) {
      console.error("로그아웃 오류:", error);

      window.alert("로그아웃에 실패했습니다. 다시 시도해 주세요.");
    }
  }, [router]);

  // [1] 관리자 설정을 네트워크에서 가져온다. 서로 독립적이므로 Promise.allSettled 사용.

  useEffect(() => {
    const controller = new AbortController();

    const fetchSettings = async () => {
      const results = await Promise.allSettled([
        axios.get<{ success: boolean; data: NavSettings }>(
          `${API_URL}/api/public/site/nav`,

          { signal: controller.signal },
        ),

        axios.get<{ success: boolean; data: ToneSettings }>(
          `${API_URL}/api/public/site/tone`,

          { signal: controller.signal },
        ),

        axios.get<{ success: boolean; data: FooterSettings }>(
          `${API_URL}/api/public/site/footer`,

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

  // [2] 사용자의 스크롤 방향을 감지한다. 잦은 깜빡임을 막기 위해 임계값을 둔다.

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

  // [3] 페이지가 바뀔 때 열린 모바일 메뉴를 자동으로 닫는다.

  useEffect(() => {
    // URL 이동 결과로 모바일 메뉴가 열린 채 남지 않게 정리한다.

    // eslint-disable-next-line react-hooks/set-state-in-effect

    setMenuOpen(false);

    setSearchOpen(false);
  }, [pathname]);

  // [4] 모바일 메뉴를 열면 GSAP으로 메뉴가 아래에서 차례로 올라온다.

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

  // [5] 모바일 메뉴가 열렸을 때 배경 페이지가 뒤에서 움직이지 않도록 한다.

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

    const clean = url.replace(/\/+$/, "");

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
        <S.HeaderInner $searchOpen={searchOpen}>
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

          <S.NavGroup aria-label={tHeader("mainNavigation")}>
            {localizedMenus.map((menu) => (
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

          <SL.SearchUtilGroup
            $searchOpen={searchOpen}
            onSubmitCapture={handleSearchSubmitCapture}
            onKeyDownCapture={handleSearchKeyDownCapture}
            onClickCapture={handleSearchClickCapture}
          >
            <S.DesktopOnly $searchOpen={searchOpen}>
              {/* 검색 열림 상태에서 CTA 텍스트만 아이콘으로 축소 */}
              <S.HeaderActionRow $searchOpen={searchOpen}>
                {searchOpen ? (
                  <>
                    <S.CompactHeaderLink
                      as={Link}
                      href={contactHref}
                      aria-label={tHeader("consultationShort")}
                      title={tHeader("consultationShort")}
                      onClick={() => setSearchOpen(false)}
                    >
                      <FaRegCommentDots size={17} aria-hidden="true" />
                    </S.CompactHeaderLink>
                    {userName && (
                      <S.CompactHeaderLink
                        as={Link}
                        href={reservationHref}
                        aria-label={tHeader("visitReservation")}
                        title={tHeader("visitReservation")}
                        onClick={() => setSearchOpen(false)}
                      >
                        <FaCalendarCheck size={16} aria-hidden="true" />
                      </S.CompactHeaderLink>
                    )}
                  </>
                ) : (
                  <>
                    <S.ConsultationEditorialLink
                      as={Link}
                      href={contactHref}
                      aria-label={tHeader("consultationShort")}
                      title={tHeader("consultationShort")}
                    >
                      <FaPhone size={13} aria-hidden="true" />
                      <span>{tHeader("consultationShort")}</span>
                    </S.ConsultationEditorialLink>

                    {userName && (
                      <>
                        <S.ActionDivider aria-hidden="true" />
                        <S.ReservationEditorialLink
                          as={Link}
                          href={reservationHref}
                          aria-label={tHeader("visitReservation")}
                          title={tHeader("visitReservation")}
                          $onHero={transparent && !isBrandPage}
                          $inverse={isDark && !transparent}
                        >
                          {tHeader("visitReservation")}
                          <span aria-hidden="true">→</span>
                        </S.ReservationEditorialLink>
                      </>
                    )}
                  </>
                )}
              </S.HeaderActionRow>

              {userName ? (
                <SL.CompactAccount
                  $compact={searchOpen}
                  className="ahns-compact-tool"
                >
                  <AccountDropdown
                    userName={userName}
                    onLogout={handleLogout}
                    transparent={transparent}
                  />

                  {searchOpen && (
                    <SL.CoverIcon
                      aria-hidden="true"
                      style={{ pointerEvents: "none" }}
                    >
                      <FaRegUser size={16} />
                    </SL.CoverIcon>
                  )}
                </SL.CompactAccount>
              ) : (
                <SL.CompactAction
                  $compact={searchOpen}
                  className="ahns-compact-tool"
                >
                  <S.IconLink
                    as={Link}
                    href="/register/login"
                    onClick={handleLoginLinkClick}
                    aria-label={tAuth("login")}
                    title={tAuth("login")}
                  >
                    <FaRegUser size={16} />

                    {!searchOpen && <span aria-hidden="true">↗</span>}
                  </S.IconLink>
                </SL.CompactAction>
              )}

              <SL.CompactLanguage
                $compact={searchOpen}
                className="ahns-compact-tool"
              >
                <LanguageDropdown transparent={transparent} />

                {searchOpen && (
                  <SL.CoverIcon
                    aria-hidden="true"
                    style={{ pointerEvents: "none" }}
                  >
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
              menus={localizedMenus}
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
            EXPLORE AHN'S
          </S.MobileMenuCaption>

          <S.MobileNav aria-label="모바일 주 메뉴">
            {localizedMenus.map((menu, index) => (
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
                onClick={(event) => { closeMenu(); handleLoginLinkClick(event); }}
                title={tAuth("login")}
                aria-label={tAuth("login")}
              >
                <FaRegUser /> ↗
              </Link>
            )}

            <Link href={contactHref} onClick={closeMenu}>
              CONTACT ↗
            </Link>

            {userName && (
              <Link href={reservationHref} onClick={closeMenu}>
                {tHeader("visitReservation")} ↗
              </Link>
            )}
          </S.MobileMenuFooter>
        </S.MobileMenuInner>
      </S.MobileMenuOverlay>
    </>
  );
}
