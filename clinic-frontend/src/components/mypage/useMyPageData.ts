"use client";

import { useCallback, useEffect, useState } from "react";

import { getMyPageData, MY_PAGE_API_ENABLED } from "@/lib/mypage/api";

type Route = "me" | "reservations" | "consultations";

export function useMyPageData<T>(route: Route) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(MY_PAGE_API_ENABLED);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!MY_PAGE_API_ENABLED) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    getMyPageData<T>(route, controller.signal)
      .then(setData)
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(
            reason instanceof Error ? reason.message : "알 수 없는 오류",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [route, key]);

  const retry = useCallback(() => setKey((n) => n + 1), []);
  return { data, error, loading, retry, connected: MY_PAGE_API_ENABLED };
}
