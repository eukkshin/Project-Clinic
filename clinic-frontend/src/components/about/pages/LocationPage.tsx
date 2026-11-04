"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import * as S from "@/components/about/location/LocationFlat.styles";
import LocationFlatMap from "@/components/about/location/LocationFlatMap";
import { AboutFrame } from "@/components/about/shared/AboutFoundation";
import HospitalMap from "@/components/layout/HospitalMap";
import {
  FLAT_LOCATION,
  flatFullAddress,
  flatKakaoUrl,
  flatNaverUrl,
} from "@/data/about/flatLocationData";
import { API_ORIGIN } from "@/lib/api/config";

type Schedule = {
  departments?: string;
  weekday?: string;
  night?: string;
  weekend?: string;
};
type FooterResponse = {
  success?: boolean;
  data?: {
    companyInfo?: { phone?: string } | null;
    schedules?: Schedule[] | null;
  } | null;
};

type IconName = "pin" | "phone" | "clock" | "train" | "bus" | "car";
function Icon({ name, size = 21 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "pin" && (
        <>
          <path d="M20 10c0 5.5-8 12-8 12S4 15.5 4 10a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="2.8" />
        </>
      )}
      {name === "phone" && (
        <path d="M6.4 3.5h3l1.5 4.3-2.1 2a15 15 0 0 0 5.5 5.5l2-2.1 4.2 1.5v3a3.3 3.3 0 0 1-3.6 3.1A18.7 18.7 0 0 1 3.2 7a3.3 3.3 0 0 1 3.2-3.5Z" />
      )}
      {name === "clock" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2.5" />
        </>
      )}
      {name === "train" && (
        <>
          <rect x="5.5" y="2.5" width="13" height="17" rx="3" />
          <path d="M5.5 10.5h13M8.5 22l2-2.5m5 0 2 2.5" />
          <path d="M9 15h.01M15 15h.01" />
        </>
      )}
      {name === "bus" && (
        <>
          <rect x="5" y="2.5" width="14" height="18" rx="3" />
          <path d="M5 10.5h14M8 21v1m8-1v1M8.5 16h.01M15.5 16h.01" />
        </>
      )}
      {name === "car" && (
        <>
          <path d="m5 10 2-5h10l2 5H5ZM4 10h16v9H4v-9ZM7 19v2m10-2v2" />
          <path d="M7.5 14.5h.01M16.5 14.5h.01" />
        </>
      )}
    </svg>
  );
}

/**
 * 기존 `/about/location` 페이지를 완전히 대체하는 플랫 지도 버전.
 * 공통 Header, Footer, ABOUT 내비게이션, 관리자 데이터 조회는 수정하지 않습니다.
 */
export default function LocationPage() {
  const t = useTranslations("About");
  const [phone, setPhone] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const apiBase = API_ORIGIN;
    fetch(`${apiBase}/api/public/site/footer`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Footer API HTTP ${response.status}`);
        return (await response.json()) as FooterResponse;
      })
      .then((result) => {
        if (controller.signal.aborted || result.success === false) return;
        const nextPhone = result.data?.companyInfo?.phone;
        if (typeof nextPhone === "string") setPhone(nextPhone.trim());
        if (Array.isArray(result.data?.schedules))
          setSchedules(result.data.schedules);
      })
      .catch(() => {
        /* API 미연결 상태: 잘못된 번호/시간을 임의로 표시하지 않음 */
      });
    return () => controller.abort();
  }, []);

  const mainSchedule = schedules.find(
    (entry) => entry.weekday || entry.night || entry.weekend,
  );
  const tel = phone.replace(/[^\d+]/g, "");
  return (
    <AboutFrame>
      <S.Page>
        <S.Content>
          <S.Intro data-about-reveal>
            <div>
              <span className="eyebrow">AHN’S PLASTIC SURGERY · LOCATION</span>
              <h1>
                {t("location.heroTitle")}
                <span className="english">Come closer.</span>
              </h1>
            </div>
            <p className="intro-description">
              {t("location.heroDesc1")}
              <br />
              {t("location.heroDesc2")}
              <br />
              {t("location.heroDesc3")}
            </p>
          </S.Intro>
          <S.MainGrid data-about-reveal>
            <LocationFlatMap />
            <S.Details>
              <S.AsideTop>
                <div className="index">01 / VISIT AHN’S</div>
                <h2>
                  {t("location.aside1")}
                  <br />
                  {t("location.aside2")}
                </h2>
                <div className="bar" />
              </S.AsideTop>
              <S.ContactGroup>
                <S.ContactRow>
                  <div className="symbol">
                    <Icon name="pin" />
                  </div>
                  <div>
                    <strong>{t("location.address")}</strong>
                    <p>
                      {FLAT_LOCATION.address}
                      <br />
                      {FLAT_LOCATION.floor}
                    </p>
                  </div>
                </S.ContactRow>
                <S.ContactRow>
                  <div className="symbol">
                    <Icon name="phone" />
                  </div>
                  <div>
                    <strong>{t("location.phone")}</strong>
                    <p>
                      {tel ? (
                        <a href={`tel:${tel}`}>{phone}</a>
                      ) : (
                        <span className="quiet">
                          {t("location.phonePending")}
                        </span>
                      )}
                    </p>
                  </div>
                </S.ContactRow>
                <S.ContactRow>
                  <div className="symbol">
                    <Icon name="clock" />
                  </div>
                  <div>
                    <strong>{t("location.hours")}</strong>
                    {mainSchedule ? (
                      <S.ScheduleLines>
                        {mainSchedule.weekday && (
                          <div>
                            <span>{t("location.weekday")}</span>
                            <b>{mainSchedule.weekday}</b>
                          </div>
                        )}
                        {mainSchedule.night && (
                          <div>
                            <span>{t("location.night")}</span>
                            <b>{mainSchedule.night}</b>
                          </div>
                        )}
                        {mainSchedule.weekend && (
                          <div>
                            <span>{t("location.weekend")}</span>
                            <b>{mainSchedule.weekend}</b>
                          </div>
                        )}
                      </S.ScheduleLines>
                    ) : (
                      <p className="quiet">{t("location.contactClinic")}</p>
                    )}
                    <small>{t("location.hoursNote")}</small>
                  </div>
                </S.ContactRow>
              </S.ContactGroup>
              <S.MapButtons>
                <a
                  href={flatKakaoUrl}
                  className="primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("location.kakaoLink")} <span aria-hidden="true">↗</span>
                </a>
                <a
                  href={flatNaverUrl}
                  className="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("location.naverLink")} <span aria-hidden="true">↗</span>
                </a>
              </S.MapButtons>
            </S.Details>
          </S.MainGrid>
          <S.Below data-about-reveal>
            <S.TransportHead>
              <div>
                <p className="small">GETTING HERE / TRANSPORTATION</p>
                <h2>{t("location.transportHeading")}</h2>
              </div>
              <p className="footnote">
                {t("location.transportDesc1")}
                <br />
                {t("location.transportDesc2")}
              </p>
            </S.TransportHead>
            <S.TransportGrid>
              <S.TransportCell>
                <span className="icon">
                  <Icon name="train" size={26} />
                </span>
                <div>
                  <h3>{t("location.subway")}</h3>
                  <div className="lines">
                    <i style={{ backgroundColor: "#3481AF" }}>4</i>
                    <i style={{ backgroundColor: "#748947" }}>7</i>
                    <span style={{ fontSize: 12, color: "#49624C" }}>
                      {t("location.subwayStop")}
                    </span>
                  </div>
                  <p>
                    {t("location.subway1")}
                    <br />
                    {t("location.subway2")}
                  </p>
                </div>
              </S.TransportCell>
              <S.TransportCell>
                <span className="icon">
                  <Icon name="bus" size={26} />
                </span>
                <div>
                  <h3>{t("location.bus")}</h3>
                  <p>
                    {t("location.bus1")}
                    <br />
                    {t("location.bus2")}
                  </p>
                </div>
              </S.TransportCell>
              <S.TransportCell>
                <span className="icon">
                  <Icon name="car" size={26} />
                </span>
                <div>
                  <h3>{t("location.car")}</h3>
                  <p>
                    {t("location.car1")}
                    <br />
                    {t("location.car2")}
                  </p>
                </div>
              </S.TransportCell>
            </S.TransportGrid>
          </S.Below>
        </S.Content>
        <S.RealMap>
          <summary>
            <span className="summary-inner">
              {t("location.mapExpand")} <i aria-hidden="true">＋</i>
            </span>
          </summary>
          <S.Content>
            <div className="map-holder">
              <HospitalMap
                address={flatFullAddress}
                clinicName={FLAT_LOCATION.clinicName}
              />
            </div>
          </S.Content>
        </S.RealMap>
        {/* 이 섹션의 끝 색상 #1B3528 = 기존 Footer 배경 그라데이션의 시작 색상 */}
        <S.FooterBridge>
          <S.Content data-about-reveal>
            <p className="overline">AHN’S · A MORE BEAUTIFUL TOMORROW</p>
            <h2>
              {t("location.footer1")}
              <br />
              {t("location.footer2")}
            </h2>
            <div className="bottomline">
              <span>AHN’S</span>
              <p>SEOUL · NOWON / PLASTIC SURGERY</p>
            </div>
          </S.Content>
        </S.FooterBridge>
      </S.Page>
    </AboutFrame>
  );
}
