"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiBell, FiCheck, FiX } from "react-icons/fi";

import {
  playAdminChime,
  useAdminPreferences,
  withinQuietHours,
} from "@/lib/admin/preferences";
import { API_ORIGIN } from "@/lib/api/config";

import * as S from "./AdminNotifications.styles";

import type { AdminPreferences } from "@/lib/admin/preferences";
type AlertItem = {
  id: number;
  category: "CONSULT" | "RESERVATION";
  referenceId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
};
type Payload = {
  success: boolean;
  data?: { notifications: AlertItem[]; unread: number };
};

const target = (item: AlertItem) =>
  item.category === "CONSULT" ? "/admin/consultations" : "/admin/reservations";

export default function AdminNotifications() {
  const { preferences } = useAdminPreferences();
  const preferencesRef = useRef<AdminPreferences>(preferences);
  preferencesRef.current = preferences;
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AlertItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [toast, setToast] = useState<AlertItem | null>(null);
  const [connected, setConnected] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSoundAt = useRef(0);
  const lastNotificationId = useRef<number | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch(`${API_ORIGIN}/api/admin/notifications`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!response.ok) return;
      const body = (await response.json()) as Payload;
      if (body.success && body.data) {
        setItems(body.data.notifications);
        setUnread(body.data.unread);
      }
    } catch {
      /* SSE 재연결이나 다음 요청에서 다시 조회 */
    }
  }, []);

  useEffect(() => {
    void load();
    const source = new EventSource(
      `${API_ORIGIN}/api/admin/notifications/stream`,
      {
        withCredentials: true,
      },
    );
    const onReady = () => {
      setConnected(true);
      void load();
    };
    const onNotify = (event: MessageEvent) => {
      try {
        const alert = JSON.parse(event.data) as AlertItem;
        if (alert.category !== "CONSULT" && alert.category !== "RESERVATION")
          return;
        if (
          !Number.isSafeInteger(alert.id) ||
          alert.id === lastNotificationId.current
        )
          return;
        lastNotificationId.current = alert.id;
        const settings = preferencesRef.current;
        const isQuiet = withinQuietHours(settings);

        if (settings.popupEnabled && !isQuiet) {
          setToast(alert);
          if (toastTimer.current) clearTimeout(toastTimer.current);
          toastTimer.current = setTimeout(() => setToast(null), 7500);
        }
        // 다른 탭을 열어 둔 경우 여러 소리가 중첩되지 않도록 현재 탭에서만 재생.
        if (
          settings.soundEnabled &&
          !isQuiet &&
          document.visibilityState === "visible" &&
          document.hasFocus() &&
          Date.now() - lastSoundAt.current > 6000
        ) {
          lastSoundAt.current = Date.now();
          playAdminChime(settings.soundVolume);
        }
        if (
          settings.desktopEnabled &&
          !isQuiet &&
          document.visibilityState === "hidden" &&
          typeof Notification !== "undefined" &&
          Notification.permission === "granted"
        ) {
          try {
            const desktop = new Notification("AHN'S 관리자 새 알림", {
              body:
                alert.category === "CONSULT"
                  ? "새로운 상담이 접수되었습니다."
                  : "새로운 방문 예약이 접수되었습니다.",
              tag: `ahns-admin-notification-${alert.id}`,
            });
            desktop.onclick = () => {
              window.focus();
              desktop.close();
            };
          } catch {
            /* 브라우저 또는 운영체제 알림 차단 */
          }
        }
        void load();
      } catch {
        /* 잘못된 SSE 데이터 무시 */
      }
    };
    const onError = () => setConnected(false);
    source.addEventListener("ready", onReady);
    source.addEventListener("notification", onNotify as EventListener);
    source.addEventListener("error", onError);
    return () => {
      source.close();
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [load]);

  const markRead = async (id: number) => {
    try {
      const response = await fetch(
        `${API_ORIGIN}/api/admin/notifications/${id}/read`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );
      if (response.ok) await load();
    } catch {
      /* 다음 조회에서 다시 시도 */
    }
  };

  return (
    <S.Anchor aria-label="관리자 실시간 알림">
      {toast && (
        <S.Toast role="status" aria-live="polite">
          <S.ToastIcon>
            <FiBell size={16} />
          </S.ToastIcon>
          <div>
            <strong>
              {toast.category === "CONSULT" ? "새 상담 접수" : "새 방문 예약"}
            </strong>
            <p>{toast.message}</p>
            <Link
              href={target(toast)}
              onClick={() => {
                void markRead(toast.id);
                setToast(null);
              }}
            >
              관리 페이지로 이동
            </Link>
          </div>
          <button
            type="button"
            aria-label="팝업 닫기"
            onClick={() => setToast(null)}
          >
            <FiX />
          </button>
        </S.Toast>
      )}
      {open && (
        <S.Panel role="region" aria-label="관리자 알림센터">
          <S.Head>
            <div>
              <strong>알림센터</strong>
              <small>CONSULTATION & RESERVATION</small>
            </div>
            <button
              type="button"
              aria-label="알림센터 닫기"
              onClick={() => setOpen(false)}
            >
              <FiX />
            </button>
          </S.Head>
          <S.Status $connected={connected}>
            <span aria-hidden="true" />
            {connected
              ? "실시간 알림 연결됨"
              : "재연결 중 · 저장된 알림 확인 가능"}
          </S.Status>
          <S.List>
            {items.length === 0 ? (
              <S.Empty>새 알림이 없습니다.</S.Empty>
            ) : (
              items.slice(0, preferences.notificationLimit).map((item) => (
                <S.Alert key={item.id} $read={item.isRead}>
                  <div>
                    <S.AlertLabel>
                      {item.category === "CONSULT" ? "상담 접수" : "방문 예약"}
                    </S.AlertLabel>
                    <time>
                      {new Date(item.createdAt).toLocaleString("ko-KR")}
                    </time>
                  </div>
                  <Link
                    href={target(item)}
                    onClick={() => {
                      void markRead(item.id);
                      setOpen(false);
                    }}
                  >
                    {item.message}
                  </Link>
                  {!item.isRead && (
                    <button
                      type="button"
                      onClick={() => void markRead(item.id)}
                    >
                      <FiCheck size={13} /> 읽음 처리
                    </button>
                  )}
                </S.Alert>
              ))
            )}
          </S.List>
          <S.Foot>
            <Link href="/admin/settings" onClick={() => setOpen(false)}>
              알림 환경설정
            </Link>
            <span>
              최근 {Math.min(items.length, preferences.notificationLimit)}건
              표시
            </span>
          </S.Foot>
        </S.Panel>
      )}
      <S.BellButton
        type="button"
        aria-label={`관리자 알림, 읽지 않은 항목 ${unread}개`}
        aria-expanded={open}
        title={connected ? "실시간 알림 연결됨" : "실시간 알림 재연결 중"}
        onClick={() => {
          setOpen((value) => !value);
          void load();
        }}
      >
        <S.StyledFiIcon />
        {preferences.showUnreadBadge && unread > 0 && (
          <S.Counter>{unread > 99 ? "99+" : unread}</S.Counter>
        )}
      </S.BellButton>
    </S.Anchor>
  );
}
