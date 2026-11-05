"use client";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => string;
      remove: (id: string) => void;
      reset: (id: string) => void;
    };
  }
}
/** NEXT_PUBLIC_TURNSTILE_SITE_KEY가 설정된 경우에만 Cloudflare Turnstile을 표시합니다. */
export const consultCaptchaEnabled = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
);
export default function ConsultCaptcha({
  onToken,
  resetKey = 0,
}: {
  onToken: (value: string) => void;
  resetKey?: number;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey || !divRef.current) return;
    let alive = true;
    const mount = () => {
      if (!alive || widgetRef.current || !divRef.current || !window.turnstile)
        return;
      widgetRef.current = window.turnstile.render(divRef.current, {
        sitekey: siteKey,
        callback: (token) => onToken(token),
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };
    let script = document.querySelector<HTMLScriptElement>(
      "script[data-ahns-turnstile]",
    );
    if (!script) {
      script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.dataset.ahnsTurnstile = "true";
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      document.head.appendChild(script);
    }
    script.addEventListener("load", mount);
    mount();
    return () => {
      alive = false;
      script?.removeEventListener("load", mount);
      if (widgetRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetRef.current);
        } catch {}
      }
      widgetRef.current = null;
    };
  }, [onToken]);
  useEffect(() => {
    if (resetKey === 0) return;
    onToken("");
    if (widgetRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetRef.current);
      } catch {}
    }
  }, [resetKey, onToken]);
  return consultCaptchaEnabled ? (
    <div
      style={{ margin: "10px 0", minHeight: 65 }}
      ref={divRef}
      aria-label="자동 상담 신청 방지 인증"
    />
  ) : null;
}
