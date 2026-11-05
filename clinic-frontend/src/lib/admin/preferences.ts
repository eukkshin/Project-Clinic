"use client";

import { useCallback, useEffect, useState } from "react";

export type AdminLandingPage =
  | "/admin/root"
  | "/admin/consultations"
  | "/admin/reservations";

export type AdminPreferences = {
  soundEnabled: boolean;
  soundVolume: number;
  popupEnabled: boolean;
  desktopEnabled: boolean;
  showUnreadBadge: boolean;
  quietHoursEnabled: boolean;
  quietStart: string;
  quietEnd: string;
  notificationLimit: 10 | 20 | 50;
  landingPage: AdminLandingPage;
};

export const defaultAdminPreferences: AdminPreferences = {
  soundEnabled: false,
  soundVolume: 35,
  popupEnabled: true,
  desktopEnabled: false,
  showUnreadBadge: true,
  quietHoursEnabled: false,
  quietStart: "19:00",
  quietEnd: "09:00",
  notificationLimit: 20,
  landingPage: "/admin/root",
};

const KEY = "ahns_admin_preferences_v1";
const CHANGE_EVENT = "ahns-admin-preferences-changed";
const LANDING_PAGES: readonly string[] = [
  "/admin/root",
  "/admin/consultations",
  "/admin/reservations",
];
const LIMITS = [10, 20, 50];
const HHMM = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function validate(input: unknown): AdminPreferences {
  const value = (input && typeof input === "object" ? input : {}) as Record<
    string,
    unknown
  >;
  const defaults = defaultAdminPreferences;
  const boolean = (key: keyof AdminPreferences) =>
    typeof value[key] === "boolean"
      ? (value[key] as boolean)
      : (defaults[key] as boolean);
  return {
    soundEnabled: boolean("soundEnabled"),
    soundVolume:
      typeof value.soundVolume === "number" &&
      Number.isFinite(value.soundVolume)
        ? Math.min(100, Math.max(0, Math.round(value.soundVolume)))
        : defaults.soundVolume,
    popupEnabled: boolean("popupEnabled"),
    desktopEnabled: boolean("desktopEnabled"),
    showUnreadBadge: boolean("showUnreadBadge"),
    quietHoursEnabled: boolean("quietHoursEnabled"),
    quietStart:
      typeof value.quietStart === "string" && HHMM.test(value.quietStart)
        ? value.quietStart
        : defaults.quietStart,
    quietEnd:
      typeof value.quietEnd === "string" && HHMM.test(value.quietEnd)
        ? value.quietEnd
        : defaults.quietEnd,
    notificationLimit:
      typeof value.notificationLimit === "number" &&
      LIMITS.includes(value.notificationLimit)
        ? (value.notificationLimit as AdminPreferences["notificationLimit"])
        : defaults.notificationLimit,
    landingPage:
      typeof value.landingPage === "string" &&
      LANDING_PAGES.includes(value.landingPage)
        ? (value.landingPage as AdminLandingPage)
        : defaults.landingPage,
  };
}

export function readAdminPreferences(): AdminPreferences {
  if (typeof window === "undefined") return defaultAdminPreferences;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? validate(JSON.parse(raw) as unknown) : defaultAdminPreferences;
  } catch {
    return defaultAdminPreferences;
  }
}

export function saveAdminPreferences(value: AdminPreferences): void {
  if (typeof window === "undefined") return;
  const safe = validate(value);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(safe));
  } catch {
    /* private browsing / restricted storage */
  }
  window.dispatchEvent(
    new CustomEvent<AdminPreferences>(CHANGE_EVENT, { detail: safe }),
  );
}

export function useAdminPreferences() {
  const [preferences, setPreferences] = useState<AdminPreferences>(
    defaultAdminPreferences,
  );
  useEffect(() => {
    setPreferences(readAdminPreferences());
    const onStorage = (event: StorageEvent) => {
      if (event.key === KEY || event.key === null)
        setPreferences(readAdminPreferences());
    };
    const onChange = () => setPreferences(readAdminPreferences());
    window.addEventListener("storage", onStorage);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CHANGE_EVENT, onChange);
    };
  }, []);
  const updatePreferences = useCallback((patch: Partial<AdminPreferences>) => {
    saveAdminPreferences({ ...readAdminPreferences(), ...patch });
  }, []);
  const resetPreferences = useCallback(
    () => saveAdminPreferences(defaultAdminPreferences),
    [],
  );
  return { preferences, updatePreferences, resetPreferences };
}

export function withinQuietHours(
  preferences: AdminPreferences,
  now = new Date(),
): boolean {
  if (!preferences.quietHoursEnabled) return false;
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Seoul",
  }).format(now);
  const { quietStart: start, quietEnd: end } = preferences;
  if (start === end) return true;
  return start < end
    ? time >= start && time < end
    : time >= start || time < end;
}

// Web Audio API로 만든 짧은 오리지널 2음 차임. 미리듣기 버튼 등 사용자 동작 이후 재생 가능.
export function playAdminChime(volume: number): void {
  if (typeof window === "undefined") return;
  try {
    const w = window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    };
    const Ctx = w.AudioContext ?? w.webkitAudioContext;
    if (!Ctx) return;
    const audio = new Ctx();
    if (audio.state === "suspended") void audio.resume();
    const base = audio.currentTime + 0.015;
    for (const [index, frequency] of [659.25, 880].entries()) {
      const start = base + index * 0.16;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, (volume / 100) * 0.12),
        start + 0.02,
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.25);
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(start);
      osc.stop(start + 0.26);
    }
    window.setTimeout(() => {
      void audio.close().catch(() => {});
    }, 850);
  } catch {
    /* audio blocked or unsupported */
  }
}
