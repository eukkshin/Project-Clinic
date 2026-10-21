"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import * as S from "@/assets/css/components/Footer.style";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
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

export default function Footer() {
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
          `${API_URL}/api/admin/footer`,
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
    <S.FooterWrapper id="site-footer-contact">
      <S.FooterInner>
        <S.FooterTopLabel>
          <span>AHN&apos;S PLASTIC SURGERY</span>
          <span>CONTACT &amp; LOCATION — 06</span>
        </S.FooterTopLabel>

        {/* 핵심 요청: 왼쪽 병원 정보 / 오른쪽 큰 지도 */}
        <S.MainGrid>
          <S.InfoColumn>
            <S.IntroSmall>WE ARE HERE FOR YOU</S.IntroSmall>
            <S.IntroTitle>
              Find Your
              <br />
              <em>Own Beauty.</em>
            </S.IntroTitle>
            <S.IntroDescription>
              당신만의 아름다움을 찾아가는 여정.
              <br />그 시작을 함께하겠습니다.
            </S.IntroDescription>

            <S.ContactGroup>
              <S.ContactLabel>CONTACT</S.ContactLabel>
              {phoneHref ? (
                <S.PhoneAnchor href={phoneHref}>
                  {companyInfo.phone}
                </S.PhoneAnchor>
              ) : (
                <S.ContactPlaceholder>
                  {loading ? "연락처를 불러오는 중..." : "전화번호 등록 예정"}
                </S.ContactPlaceholder>
              )}
              {emailHref && (
                <S.EmailAnchor href={emailHref}>
                  {companyInfo.email}
                </S.EmailAnchor>
              )}
            </S.ContactGroup>

            <S.ContactGroup>
              <S.ContactLabel>CLINIC INFORMATION</S.ContactLabel>
              <S.ClinicTitle>{clinicName}</S.ClinicTitle>
              <S.AddressText>
                {companyInfo.address ||
                  (loading ? "주소를 불러오는 중..." : "주소 등록 예정")}
              </S.AddressText>
              {locationLink && (
                <S.SimpleTextLink
                  href={locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  오시는 길 바로가기<span aria-hidden="true">↗</span>
                </S.SimpleTextLink>
              )}
            </S.ContactGroup>

            {schedules.length > 0 && (
              <S.HoursGroup>
                <S.ContactLabel>OPENING HOURS</S.ContactLabel>
                {schedules.map((schedule) => (
                  <S.HoursItem key={schedule.id}>
                    <strong>{schedule.departments}</strong>
                    {schedule.weekday && <span>평일　{schedule.weekday}</span>}
                    {schedule.night && <span>야간　{schedule.night}</span>}
                    {schedule.weekend && (
                      <span>토요일　{schedule.weekend}</span>
                    )}
                  </S.HoursItem>
                ))}
              </S.HoursGroup>
            )}
          </S.InfoColumn>

          {/* 지도 Provider 전환 기능은 HospitalMap.tsx에 독립 구현 */}
          <HospitalMap address={companyInfo.address} clinicName={clinicName} />
        </S.MainGrid>

        <S.FooterBottom>
          <S.FooterLegal>
            <strong>{clinicName}</strong>
            {companyInfo.address && <span>{companyInfo.address}</span>}
            {companyInfo.phone && <span>대표전화 {companyInfo.phone}</span>}
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

        <S.BottomWordmark aria-hidden="true">AHN&apos;S</S.BottomWordmark>
      </S.FooterInner>

      {/* 퀵 메뉴도 실제 동작이 있는 항목만 사용한다. */}
      <S.FloatingActions aria-label="빠른 메뉴">
        {phoneHref && (
          <S.FloatPhone href={phoneHref} aria-label="전화 상담">
            ☎
          </S.FloatPhone>
        )}
        <S.FloatTop
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="페이지 맨 위로"
        >
          ↑
        </S.FloatTop>
      </S.FloatingActions>
    </S.FooterWrapper>
  );
}
