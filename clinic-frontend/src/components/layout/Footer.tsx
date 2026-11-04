"use client";

import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { FaInstagram, FaRegCommentDots, FaYoutube } from "react-icons/fa6";
import { RiKakaoTalkLine } from "react-icons/ri";

import * as S from "@/components/layout/Footer.styles";
import { localizedPath, stripLocalePrefix } from "@/i18n/url";
import { isAppLocale, defaultLocale } from "@/i18n/config";
import { legalKinds, legalPaths, legalUi } from "@/lib/legal/content";
import { API_ORIGIN } from "@/lib/api/config";

import HospitalMap from "./HospitalMap";

/*
 * Footer.tsx — AHN'S FOOTER
 * ----------------------------------------------------------
 * [기획]
 * PC: 왼쪽 = 병원 정보/진료시간/연락처, 오른쪽 = 큰 지도
 * 모바일: 병원 정보 → 지도 → 하단 정보 순서
 *
 * [서버 연동]
 * 관리자 페이지에서 등록한 회사 정보/진료시간/Family 사이트를
 * GET /api/admin/footer 하나로 받아온다. 값은 하드코딩하지 않는다.
 *
 * [주의]
 * 기존 코드의 '스킨케어' 진료시간은 DB와 관계없이 모든 항목에
 * 반복 표시되는 고정값이어서 제거했다. 실제 등록된 시간만 표시한다.
 */

interface CompanyInfo {
  name: string;
  address: string;
  clinicName: string;
  phone: string;
  email: string;
  locationUrl: string;
}

interface ScheduleData {
  id: number;
  departments: string;
  weekday: string;
  night: string;
  weekend: string;
}

interface FamilySiteData {
  id: number;
  name: string;
  url: string;
}

interface FooterResponse {
  success: boolean;
  data?: {
    companyInfo?: Partial<CompanyInfo>;
    schedules?: ScheduleData[];
    familySites?: FamilySiteData[];
  };
}

const API_URL = API_ORIGIN;
const INITIAL_COMPANY: CompanyInfo = {
  name: "",
  address: "",
  clinicName: "",
  phone: "",
  email: "",
  locationUrl: "",
};

// DB 데이터에 사용자가 입력한 URL이 올 수 있으므로 안전한 프로토콜만 허용한다.
function safeExternalUrl(value?: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function safePhoneHref(value: string) {
  // tel 링크에는 문자나 공백이 아닌 전화번호에 필요한 기호만 남긴다.
  const normalized = value.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : null;
}

/**
 * Add links here. Hovering an icon expands its own pill to the left.
 * `icon` accepts emoji strings or React icons (e.g. <FaInstagram /> with an import).
 * Keep empty until you decide which links to show.
 */
type QuickLink = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
};

const QUICK_LINKS: QuickLink[] = [
  {
    id: "kakao",
    label: "카카오톡 상담",
    href: "https://example.com",
    icon: <RiKakaoTalkLine />,
    external: true,
  },
  {
    id: "instagram",
    label: "인스타그램",
    href: "https://instagram.com/yourid",
    icon: <FaInstagram />,
    external: true,
  },
  {
    id: "youtube",
    label: "유튜브",
    href: "https://youtube.com/yourid",
    icon: <FaYoutube />,
    external: true,
  },
];

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const tFooter = useTranslations("Footer");
  const currentLocale = useLocale();
  const locale = isAppLocale(currentLocale) ? currentLocale : defaultLocale;
  const footerRef = useRef<HTMLElement>(null);
  const quickMenuRef = useRef<HTMLDivElement>(null);
  const messageTriggerRef = useRef<HTMLButtonElement>(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [isSafety, setIsSafety] = useState(false);
  const pathname = stripLocalePrefix(usePathname());

  // 화면 맨 위에서는 TOP을 숨기고, 320px 이상 스크롤하면 아래에서 등장.
  useEffect(() => {
    const handleScroll = () => {
      const visible = window.scrollY >= 320;
      setShowTop((previous) => (previous === visible ? previous : visible));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const safety = document.getElementById("safety");
    const button = messageTriggerRef.current;

    if (!safety || !button) {
      return;
    }

    let observer: IntersectionObserver | null = null;

    const observe = () => {
      observer?.disconnect();

      const rect = button.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // 버튼 중심 좌표
      const rawCenterY = rect.top + rect.height / 2;

      // 중심 좌표를 화면 범위 안으로 제한
      const centerY = Math.max(0, Math.min(rawCenterY, viewportHeight));

      // rootMargin이 잘못된 음수 문자열이 되지 않도록 제한
      const top = Math.max(0, Math.floor(centerY - 1));

      const bottom = Math.max(0, Math.floor(viewportHeight - centerY - 1));

      observer = new IntersectionObserver(
        ([entry]) => {
          setIsSafety(entry.isIntersecting);
        },
        {
          root: null,
          rootMargin: `-${top}px 0px -${bottom}px 0px`,
          threshold: 0,
        },
      );

      observer.observe(safety);
    };

    observe();

    window.addEventListener("resize", observe);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", observe);
    };
  }, [showTop]);

  // 문자 메뉴 외부를 클릭하거나 Escape를 누르면 닫기.
  useEffect(() => {
    if (!messageOpen) return;
    const handleOutside = (event: PointerEvent) => {
      if (!quickMenuRef.current?.contains(event.target as Node)) {
        setMessageOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMessageOpen(false);
        messageTriggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [messageOpen]);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-footer-motion]",
          { opacity: 0, y: 42 },
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            duration: 1.1,
            stagger: 0.14,
            scrollTrigger: {
              trigger: "[data-footer-intro]",
              start: "top 82%",
              once: true,
            },
          },
        );
        gsap.fromTo(
          "[data-footer-wordmark]",
          { opacity: 0, yPercent: 25, letterSpacing: "0.02em" },
          {
            opacity: 1,
            yPercent: 0,
            letterSpacing: "-0.13em",
            duration: 1.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "[data-footer-wordmark]",
              start: "top 98%",
              once: true,
            },
          },
        );
      }, footer);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(INITIAL_COMPANY);
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [familySites, setFamilySites] = useState<FamilySiteData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 페이지가 이동/언마운트되는 경우 진행 중인 네트워크 요청 취소
    const controller = new AbortController();

    const fetchFooterData = async () => {
      try {
        const response = await axios.get<FooterResponse>(
          `${API_URL}/api/public/site/footer`,
          {
            signal: controller.signal,
          },
        );
        if (!response.data.success || !response.data.data) return;

        const {
          companyInfo: info,
          schedules: hours,
          familySites: sites,
        } = response.data.data;
        if (controller.signal.aborted) return;

        // 일부 필드가 빠져도 기존 값의 타입을 유지하도록 객체 병합한다.
        if (info && typeof info === "object") {
          setCompanyInfo((previous) => ({ ...previous, ...info }));
        }
        if (Array.isArray(hours)) setSchedules(hours);
        if (Array.isArray(sites)) setFamilySites(sites);
      } catch (error) {
        if (!controller.signal.aborted)
          console.error("푸터 정보 조회 실패:", error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void fetchFooterData();
    return () => controller.abort();
  }, []);

  const clinicName =
    companyInfo.clinicName || companyInfo.name || "Ahn's Plastic Surgery";
  const phoneHref = safePhoneHref(companyInfo.phone);
  const locationLink = safeExternalUrl(companyInfo.locationUrl);
  const emailHref = companyInfo.email.includes("@")
    ? `mailto:${companyInfo.email}`
    : null;

  return (
    <>
      <S.FooterWrapper ref={footerRef} id="site-footer-contact">
        <S.FooterInner>
          <S.FooterTopLabel data-footer-intro>
            <span>AHN&apos;S PLASTIC SURGERY</span>
            <span>CONTACT &amp; LOCATION — 06</span>
          </S.FooterTopLabel>

          {/* 핵심 요청: 왼쪽 병원 정보 / 오른쪽 큰 지도 */}
          <S.MainGrid>
            <S.InfoColumn>
              <S.IntroSmall data-footer-motion>
                WE ARE HERE FOR YOU
              </S.IntroSmall>
              <S.IntroTitle data-footer-motion>
                Find Your
                <br />
                <em>Own Beauty.</em>
              </S.IntroTitle>
              <S.IntroDescription data-footer-motion>
                {tFooter("introLine1")}
                <br />
                {tFooter("introLine2")}
              </S.IntroDescription>

              <S.ContactGroup data-footer-motion>
                <S.ContactLabel>CONTACT</S.ContactLabel>
                {phoneHref ? (
                  <S.PhoneAnchor href={phoneHref}>
                    {companyInfo.phone}
                  </S.PhoneAnchor>
                ) : (
                  <S.ContactPlaceholder>
                    {loading
                      ? tFooter("contactLoading")
                      : tFooter("phonePending")}
                  </S.ContactPlaceholder>
                )}
                {emailHref && (
                  <S.EmailAnchor href={emailHref}>
                    {companyInfo.email}
                  </S.EmailAnchor>
                )}
              </S.ContactGroup>

              <S.ContactGroup data-footer-motion>
                <S.ContactLabel>CLINIC INFORMATION</S.ContactLabel>
                <S.ClinicTitle>{clinicName}</S.ClinicTitle>
                <S.AddressText>
                  {companyInfo.address ||
                    (loading
                      ? tFooter("addressLoading")
                      : tFooter("addressPending"))}
                </S.AddressText>
                {locationLink && (
                  <S.SimpleTextLink
                    href={locationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tFooter("locationLink")}
                    <span aria-hidden="true">↗</span>
                  </S.SimpleTextLink>
                )}
              </S.ContactGroup>

              {schedules.length > 0 && (
                <S.HoursGroup>
                  <S.ContactLabel>OPENING HOURS</S.ContactLabel>
                  {schedules.map((schedule) => (
                    <S.HoursItem key={schedule.id}>
                      <strong>{schedule.departments}</strong>
                      {schedule.weekday && (
                        <span>
                          {tFooter("weekday")}　{schedule.weekday}
                        </span>
                      )}
                      {schedule.night && (
                        <span>
                          {tFooter("night")}　{schedule.night}
                        </span>
                      )}
                      {schedule.weekend && (
                        <span>
                          {tFooter("saturday")}　{schedule.weekend}
                        </span>
                      )}
                    </S.HoursItem>
                  ))}
                </S.HoursGroup>
              )}
            </S.InfoColumn>

            {/* 지도 Provider 전환 기능은 HospitalMap.tsx에 독립 구현 */}
            <HospitalMap
              address={companyInfo.address}
              clinicName={clinicName}
            />
          </S.MainGrid>

          <S.FooterBottom>
            <S.FooterLegal>
              <S.LegalNavigation aria-label={legalUi[locale].subtitle}>
                {legalKinds.map((kind) => (
                  <S.LegalNavigationLink
                    key={kind}
                    href={localizedPath(legalPaths[kind], locale)}
                  >
                    {legalUi[locale].nav[kind]}
                  </S.LegalNavigationLink>
                ))}
              </S.LegalNavigation>
              <strong>{clinicName}</strong>
              {companyInfo.address && <span>{companyInfo.address}</span>}
              {companyInfo.phone && (
                <span>
                  {tFooter("phonePrefix")} {companyInfo.phone}
                </span>
              )}
              {companyInfo.email && <span>{companyInfo.email}</span>}
              <span>
                © {new Date().getFullYear()} AHN&apos;S. ALL RIGHTS RESERVED.
              </span>
            </S.FooterLegal>

            {familySites.length > 0 && (
              <S.FamilyArea>
                <S.ContactLabel>FAMILY SITES</S.ContactLabel>
                <S.FamilyList>
                  {familySites.map((site) => {
                    const href = safeExternalUrl(site.url);
                    return href ? (
                      <S.FamilyLink
                        key={site.id}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {site.name} <span aria-hidden="true">↗</span>
                      </S.FamilyLink>
                    ) : null;
                  })}
                </S.FamilyList>
              </S.FamilyArea>
            )}
          </S.FooterBottom>

          <S.BottomWordmark aria-hidden="true" data-footer-wordmark>
            AHN&apos;S
          </S.BottomWordmark>
        </S.FooterInner>
      </S.FooterWrapper>

      {/* FloatingActions만 Footer 바깥으로 이동: overflow:clip의 잘림 방지 */}
      <S.FloatingActions aria-label={tFooter("quickMenu")} $isSafety={isSafety}>
        <S.QuickMessageRoot ref={quickMenuRef}>
          <S.QuickMenuList
            id="ahns-quick-message-menu"
            $open={messageOpen}
            role="group"
            aria-label={tFooter("quickLinks")}
            aria-hidden={!messageOpen}
            inert={!messageOpen}
          >
            {QUICK_LINKS.map((link, index) => (
              <S.QuickMenuEntry
                key={link.id}
                $open={messageOpen}
                $index={index}
                $total={QUICK_LINKS.length}
              >
                <S.QuickMenuLink
                  href={link.href}
                  aria-label={link.label}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  tabIndex={messageOpen ? 0 : -1}
                  onClick={() => setMessageOpen(false)}
                >
                  {/* 같은 버튼 안에서 왼쪽으로 이름이 펼쳐짐 (별도 툴팁 없음) */}
                  <S.QuickMenuLabel aria-hidden="true">
                    {link.label}
                  </S.QuickMenuLabel>
                  <S.QuickMenuIcon aria-hidden="true">
                    {link.icon}
                  </S.QuickMenuIcon>
                </S.QuickMenuLink>
              </S.QuickMenuEntry>
            ))}
          </S.QuickMenuList>

          <S.FloatMessage
            ref={messageTriggerRef}
            type="button"
            aria-label={
              messageOpen ? tFooter("closeQuickMenu") : tFooter("openQuickMenu")
            }
            aria-controls="ahns-quick-message-menu"
            aria-expanded={messageOpen}
            onClick={() => setMessageOpen((previous) => !previous)}
          >
            <span aria-hidden="true">
              <FaRegCommentDots />
            </span>
          </S.FloatMessage>
        </S.QuickMessageRoot>

        <S.TopReveal $visible={showTop} aria-hidden={!showTop}>
          <S.FloatTop
            type="button"
            tabIndex={showTop ? 0 : -1}
            onClick={() => {
              setMessageOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            $isSafety={isSafety}
            aria-label={tFooter("backToTop")}
          >
            ↑
          </S.FloatTop>
        </S.TopReveal>
      </S.FloatingActions>
    </>
  );
}
