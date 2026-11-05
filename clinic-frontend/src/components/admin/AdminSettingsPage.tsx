"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiBell,
  FiExternalLink,
  FiMonitor,
  FiSettings,
  FiShield,
  FiVolume2,
} from "react-icons/fi";

import { playAdminChime, useAdminPreferences } from "@/lib/admin/preferences";

import * as S from "./AdminSettings.styles";
import ReservationMessagingPanel from "./ReservationMessagingPanel";

import type {
  AdminPreferences,
  AdminLandingPage,
} from "@/lib/admin/preferences";
function ToggleRow({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <S.SettingRow>
      <S.RowText>
        <strong>{title}</strong>
        <small>{description}</small>
      </S.RowText>
      <S.Toggle
        type="button"
        role="switch"
        aria-label={title}
        aria-checked={value}
        $on={value}
        onClick={() => onChange(!value)}
      />
    </S.SettingRow>
  );
}

export default function AdminSettingsPage() {
  const {
    preferences: prefs,
    updatePreferences: update,
    resetPreferences: reset,
  } = useAdminPreferences();
  const [desktopInfo, setDesktopInfo] = useState("");

  async function changeDesktop(enabled: boolean) {
    if (!enabled) {
      update({ desktopEnabled: false });
      setDesktopInfo("");
      return;
    }
    if (!("Notification" in window)) {
      setDesktopInfo("이 브라우저는 시스템 알림을 지원하지 않습니다.");
      update({ desktopEnabled: false });
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      update({ desktopEnabled: permission === "granted" });
      setDesktopInfo(
        permission === "granted"
          ? "브라우저 알림 권한을 허용했습니다."
          : "브라우저 설정에서 알림 권한을 허용해야 사용할 수 있습니다.",
      );
    } catch {
      update({ desktopEnabled: false });
      setDesktopInfo(
        "알림 권한을 요청하지 못했습니다. 브라우저 보안 설정을 확인해 주세요.",
      );
    }
  }

  const landingPages: { label: string; href: AdminLandingPage }[] = [
    { label: "운영 현황", href: "/admin/root" },
    { label: "상담신청 관리", href: "/admin/consultations" },
    { label: "예약 관리", href: "/admin/reservations" },
  ];
  const shortcuts = [
    { href: "/admin/consultations", label: "상담 관리 및 답변" },
    { href: "/admin/reservations", label: "방문 예약 및 노쇼 관리" },
    { href: "/admin/translations", label: "다국어 번역 관리" },
    { href: "/admin/tone", label: "사이트 톤앤매너" },
    { href: "/admin/nav", label: "네비게이션 관리" },
    { href: "/admin/footer", label: "푸터 및 병원 정보" },
  ];

  return (
    <S.Page>
      <S.Eyebrow>ADMIN WORKSPACE / PREFERENCES</S.Eyebrow>
      <S.Title>관리자 환경 설정</S.Title>
      <S.Intro>
        알림 수신 방식과 관리자 작업 환경을 설정할 수 있어요. 변경 내용은 바로
        적용되며 현재 브라우저에 저장됩니다.
      </S.Intro>
      <S.Grid>
        <S.Column>
          <S.Card>
            <S.CardHead>
              <FiBell size={19} />
              <div>
                <h2>실시간 알림</h2>
                <p>새 상담·예약 접수 시 표시 및 알림 방식을 관리합니다.</p>
              </div>
            </S.CardHead>
            <S.Body>
              <ToggleRow
                title="새 알림 팝업"
                description="새 상담·예약이 접수되면 우측 하단에 알림을 표시합니다."
                value={prefs.popupEnabled}
                onChange={(value) => update({ popupEnabled: value })}
              />
              <ToggleRow
                title="알림 소리"
                description="새 접수 시 짧은 알림음을 재생합니다. 기본값은 무음입니다."
                value={prefs.soundEnabled}
                onChange={(value) => update({ soundEnabled: value })}
              />
              <S.SettingRow>
                <S.RowText>
                  <strong>알림음 크기 · {prefs.soundVolume}%</strong>
                  <small>
                    기기 소리 설정과 별개로 이 알림음의 크기만 조절합니다.
                  </small>
                </S.RowText>
                <S.Range
                  aria-label="알림음 크기"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={prefs.soundVolume}
                  onChange={(event) =>
                    update({ soundVolume: Number(event.target.value) })
                  }
                />
              </S.SettingRow>
              <S.SettingRow>
                <S.RowText>
                  <strong>알림음 테스트</strong>
                  <small>
                    브라우저에서 자동 재생이 막히면 미리듣기를 먼저 실행하세요.
                  </small>
                </S.RowText>
                <S.Action
                  type="button"
                  onClick={() => playAdminChime(prefs.soundVolume)}
                >
                  <FiVolume2 /> 미리듣기
                </S.Action>
              </S.SettingRow>
              <ToggleRow
                title="읽지 않은 알림 개수"
                description="플로팅 알림 버튼에 미확인 건수 배지를 표시합니다."
                value={prefs.showUnreadBadge}
                onChange={(value) => update({ showUnreadBadge: value })}
              />
              <ToggleRow
                title="브라우저 시스템 알림"
                description="관리자 탭이 숨겨져 있을 때 OS 알림을 보냅니다. 브라우저 권한이 필요합니다."
                value={prefs.desktopEnabled}
                onChange={(value) => void changeDesktop(value)}
              />
              {desktopInfo && <S.Notice role="status">{desktopInfo}</S.Notice>}
              <ToggleRow
                title="방해금지 시간"
                description="설정한 시간에는 팝업·소리·시스템 알림을 잠시 쉬고, 접수 내역은 계속 저장합니다."
                value={prefs.quietHoursEnabled}
                onChange={(value) => update({ quietHoursEnabled: value })}
              />
              {prefs.quietHoursEnabled && (
                <S.TimeGrid>
                  <label>
                    시작 (한국시간)
                    <S.TimeInput
                      type="time"
                      value={prefs.quietStart}
                      onChange={(event) =>
                        update({ quietStart: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    종료 (한국시간)
                    <S.TimeInput
                      type="time"
                      value={prefs.quietEnd}
                      onChange={(event) =>
                        update({ quietEnd: event.target.value })
                      }
                    />
                  </label>
                </S.TimeGrid>
              )}
            </S.Body>
          </S.Card>
          <ReservationMessagingPanel />
        </S.Column>
        <S.Column>
          <S.Card>
            <S.CardHead>
              <FiMonitor size={19} />
              <div>
                <h2>작업 환경</h2>
                <p>관리자 화면에서 표시되는 항목을 설정합니다.</p>
              </div>
            </S.CardHead>
            <S.Body>
              <S.SettingRow>
                <S.RowText>
                  <strong>알림센터 목록 개수</strong>
                  <small>최신 순서로 표시할 알림의 최대 개수입니다.</small>
                </S.RowText>
                <S.Select
                  aria-label="알림 목록 최대 표시 개수"
                  value={prefs.notificationLimit}
                  onChange={(event) =>
                    update({
                      notificationLimit: Number(
                        event.target.value,
                      ) as AdminPreferences["notificationLimit"],
                    })
                  }
                >
                  <option value={10}>최근 10건</option>
                  <option value={20}>최근 20건</option>
                  <option value={50}>최근 50건</option>
                </S.Select>
              </S.SettingRow>
              <S.SettingRow>
                <S.RowText>
                  <strong>로그인 후 첫 화면</strong>
                  <small>
                    관리자 로그인 폼에서 로그인 성공 후 이동할 메뉴입니다.
                  </small>
                </S.RowText>
                <S.Select
                  aria-label="로그인 후 첫 화면"
                  value={prefs.landingPage}
                  onChange={(event) =>
                    update({
                      landingPage: event.target.value as AdminLandingPage,
                    })
                  }
                >
                  {landingPages.map((item) => (
                    <option key={item.href} value={item.href}>
                      {item.label}
                    </option>
                  ))}
                </S.Select>
              </S.SettingRow>
              <S.SettingRow>
                <S.RowText>
                  <strong>기본값 복원</strong>
                  <small>
                    이 브라우저에 저장된 관리자 환경 설정만 초기화합니다.
                  </small>
                </S.RowText>
                <S.Action
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "관리자 화면 설정을 기본값으로 되돌릴까요?",
                      )
                    )
                      reset();
                  }}
                >
                  설정 초기화
                </S.Action>
              </S.SettingRow>
            </S.Body>
          </S.Card>
          <S.Card>
            <S.CardHead>
              <FiSettings size={19} />
              <div>
                <h2>운영 관리 바로가기</h2>
                <p>자주 사용하는 사이트 운영 및 고객관리 메뉴입니다.</p>
              </div>
            </S.CardHead>
            <S.Links>
              {shortcuts.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                  <FiExternalLink size={14} />
                </Link>
              ))}
            </S.Links>
          </S.Card>
          <S.Card>
            <S.CardHead>
              <FiShield size={19} />
              <div>
                <h2>개인정보 및 보안 안내</h2>
                <p>운영 중 권한 관리와 민감정보 노출 방지 안내입니다.</p>
              </div>
            </S.CardHead>
            <S.Body>
              <S.Notice>
                알림에는 고객 이름·전화번호·상담 내용을 표시하지 않습니다.
                상세정보는 관리자 권한으로 해당 관리 페이지에 접근한 후
                확인하세요.
              </S.Notice>
              <S.Notice>
                현재 설정은 브라우저별로 저장됩니다. 다른 PC 또는 다른
                브라우저에는 자동 동기화되지 않습니다.
              </S.Notice>
              <S.Notice>
                관리자 비밀번호·계정 권한 변경과 알림 서버 운영 정책은 별도 서버
                관리 기능이 필요하며, 이 설정 화면에서는 변경하지 않습니다.
              </S.Notice>
            </S.Body>
          </S.Card>
        </S.Column>
      </S.Grid>
    </S.Page>
  );
}
