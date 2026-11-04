"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import * as S from "@/components/layout/Footer.styles";

/**
 * HospitalMap
 * - 관리자 DB에서 전달받은 주소만 사용 (임의 좌표 없음)
 * - NAVER / KAKAO / GOOGLE 탭 전환
 * - 실제 지도는 뷰포트 근처에서만 로드
 * - 데스크톱: 휠만 사용하면 페이지 스크롤, Ctrl + 휠이면 지도 줌
 * - 확대/축소 버튼은 지도 SDK 기본 UI를 사용
 */
type MapProvider = "naver" | "kakao" | "google";
type MapStatus = "loading" | "ready" | "error";

/**
 * 지도의 일반 휠 스크롤에만 표시하는 안내 레이어.
 * pointer-events:none이므로 페이지 스크롤/지도 드래그를 방해하지 않는다.
 * Footer.styles.ts는 변경하지 않고 이 파일 안에서만 스타일을 관리한다.
 */
const ScrollZoomOverlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 24px;
  background: rgba(13, 29, 24, 0.68);
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  color: #fff;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
  pointer-events: none;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const ScrollZoomGuide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  text-align: center;
  font-family: "Pretendard", "Noto Sans KR", "Malgun Gothic", sans-serif;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.24);

  .zoom-hint-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    border: 1px solid rgba(255, 255, 255, 0.54);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    font-size: 25px;
    line-height: 1;
  }

  .zoom-hint-label {
    margin: 0;
    font-size: clamp(14px, 2vw, 18px);
    font-weight: 600;
    letter-spacing: -0.035em;
    line-height: 1.6;
  }

  kbd {
    display: inline-block;
    margin-right: 3px;
    padding: 2px 9px;
    border: 1px solid rgba(255, 255, 255, 0.62);
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.12);
    color: inherit;
    font: inherit;
    font-size: 0.82em;
    font-weight: 700;
    vertical-align: 1px;
  }
`;

interface HospitalMapProps {
  address: string;
  clinicName: string;
}

interface ZoomMap {
  getZoom(): number;
  setZoom(value: number): void;
}

interface KakaoMap {
  getLevel(): number;
  setLevel(
    level: number,
    options?: { animate?: boolean | { duration: number } },
  ): void;
  setZoomable(enabled: boolean): void;
}

interface NaverNamespace {
  maps: {
    LatLng: new (latitude: number, longitude: number) => unknown;
    Map: new (
      element: HTMLElement,
      options: Record<string, unknown>,
    ) => ZoomMap;
    Marker: new (options: Record<string, unknown>) => unknown;
    Service?: {
      Status: { OK: unknown };
      geocode: (
        options: { query: string },
        callback: (
          status: unknown,
          response?: { v2?: { addresses?: { x: string; y: string }[] } } | null,
        ) => void,
      ) => void;
    };
    onJSContentLoaded?: () => void;
  };
}

interface KakaoNamespace {
  maps: {
    load: (callback: () => void) => void;
    LatLng: new (latitude: number, longitude: number) => unknown;
    Map: new (
      element: HTMLElement,
      options: Record<string, unknown>,
    ) => KakaoMap;
    Marker: new (options: Record<string, unknown>) => {
      setMap(map: KakaoMap): void;
    };
    services: {
      Status: { OK: unknown };
      Geocoder: new () => {
        addressSearch: (
          address: string,
          callback: (
            result: { x: string; y: string }[],
            status: unknown,
          ) => void,
        ) => void;
      };
    };
  };
}

interface GoogleLatLng {
  lat(): number;
  lng(): number;
}

interface GoogleMap {
  getZoom(): number | undefined;
  setZoom(zoom: number): void;
}

interface GoogleNamespace {
  maps: {
    Map: new (
      element: HTMLElement,
      options: Record<string, unknown>,
    ) => GoogleMap;
    Geocoder: new () => {
      geocode: (
        request: { address: string },
        callback: (
          results: { geometry: { location: GoogleLatLng } }[] | null,
          status: string,
        ) => void,
      ) => void;
    };
    Marker: new (options: {
      position: GoogleLatLng;
      map: GoogleMap;
      title: string;
    }) => unknown;
  };
}

type MapWindow = Window & {
  naver?: NaverNamespace;
  kakao?: KakaoNamespace;
  google?: GoogleNamespace;
  __ahnsGoogleMapsReady?: () => void;
};

// 같은 페이지에서 SDK가 중복 로딩되지 않도록 Promise를 캐시한다.
const scriptCache = new Map<string, Promise<void>>();

function loadMapScript(id: string, src: string): Promise<void> {
  const cached = scriptCache.get(id);
  if (cached) return cached;

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      reject(
        new Error(
          "지도 SDK를 불러오지 못했습니다. 지도 API 키와 허용 도메인을 확인하세요.",
        ),
      );
    };
    document.head.appendChild(script);
  });

  scriptCache.set(id, promise);
  void promise.catch(() => scriptCache.delete(id));
  return promise;
}

// Google Maps는 async 스크립트의 onload 대신 공식 callback으로 초기화 완료를 확인한다.
function loadGoogleScript(key: string): Promise<void> {
  const windowWithMaps = window as MapWindow;
  if (windowWithMaps.google?.maps) return Promise.resolve();

  const id = "ahns-google-map-sdk";
  const cached = scriptCache.get(id);
  if (cached) return cached;

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = id;
    script.async = true;
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}` +
      "&v=weekly&loading=async&callback=__ahnsGoogleMapsReady&language=ko&region=KR";

    const timeout = window.setTimeout(() => {
      if (windowWithMaps.google?.maps) {
        resolve();
      } else {
        script.remove();
        reject(
          new Error(
            "구글맵 로딩 시간이 초과되었습니다. API 키와 네트워크를 확인하세요.",
          ),
        );
      }
      delete windowWithMaps.__ahnsGoogleMapsReady;
    }, 15000);

    windowWithMaps.__ahnsGoogleMapsReady = () => {
      window.clearTimeout(timeout);
      delete windowWithMaps.__ahnsGoogleMapsReady;
      resolve();
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      delete windowWithMaps.__ahnsGoogleMapsReady;
      script.remove();
      reject(new Error("Google Maps JavaScript API를 불러오지 못했습니다."));
    };
    document.head.appendChild(script);
  });

  scriptCache.set(id, promise);
  void promise.catch(() => scriptCache.delete(id));
  return promise;
}

function validCoordinate(value: number): boolean {
  return Number.isFinite(value);
}

/**
 * 지도 캔버스의 wheel 캡처 단계에서 두 동작을 구분한다.
 * - 일반 휠: 안내 레이어만 표시, 기본 동작 차단 X (페이지 스크롤 유지)
 * - Ctrl + 휠: 안내를 숨기고, 네이버/카카오에서는 직접 줌 변경
 * - 구글: cooperative 설정에 맡겨 기본 Ctrl + 휠을 그대로 처리
 */
function bindMapWheel(
  element: HTMLElement,
  options: {
    onPlainWheel: () => void;
    onCtrlWheel: () => void;
    updateZoom?: (deltaY: number) => void;
  },
): () => void {
  let lastZoomTime = 0;
  const handleWheel = (event: WheelEvent) => {
    if (event.deltaY === 0) return;

    if (!event.ctrlKey) {
      options.onPlainWheel();
      // preventDefault()를 호출하지 않아 페이지가 그대로 스크롤된다.
      return;
    }

    options.onCtrlWheel();
    if (!options.updateZoom) return; // Google Maps cooperative가 줌 처리

    if (event.cancelable) event.preventDefault();
    const now = performance.now();
    if (now - lastZoomTime < 140) return;
    lastZoomTime = now;
    options.updateZoom(event.deltaY);
  };

  element.addEventListener("wheel", handleWheel, {
    passive: false,
    capture: true,
  });
  return () => element.removeEventListener("wheel", handleWheel, true);
}

function getExternalMapUrl(provider: MapProvider, address: string): string {
  const query = encodeURIComponent(address.trim());
  if (provider === "naver") return `https://map.naver.com/p/search/${query}`;
  if (provider === "kakao") return `https://map.kakao.com/link/search/${query}`;
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function getProviderName(provider: MapProvider): string {
  if (provider === "naver") return "네이버";
  if (provider === "kakao") return "카카오";
  return "구글";
}

function SdkMap({
  provider,
  address,
  clinicName,
  enabled,
}: {
  provider: MapProvider;
  address: string;
  clinicName: string;
  enabled: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<MapStatus>("loading");
  const [error, setError] = useState("");
  const [showScrollHint, setShowScrollHint] = useState(false);

  const naverKey = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID?.trim();
  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_JAVASCRIPT_KEY?.trim();
  const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  const selectedKey =
    provider === "naver"
      ? naverKey
      : provider === "kakao"
        ? kakaoKey
        : googleKey;

  useEffect(() => {
    if (!enabled || !address.trim() || !selectedKey || !containerRef.current)
      return;

    let cancelled = false;
    let removeWheelHandler: (() => void) | undefined;
    let hintHideTimer: number | undefined;
    const container = containerRef.current;

    const hideScrollHint = () => {
      if (hintHideTimer !== undefined) window.clearTimeout(hintHideTimer);
      hintHideTimer = undefined;
      if (!cancelled) setShowScrollHint(false);
    };
    const showPlainWheelHint = () => {
      if (hintHideTimer !== undefined) window.clearTimeout(hintHideTimer);
      if (!cancelled) setShowScrollHint(true);
      // 휠 입력이 멈춘 뒤 650ms 동안 추가 휠이 없으면 서서히 사라짐.
      hintHideTimer = window.setTimeout(() => {
        hintHideTimer = undefined;
        if (!cancelled) setShowScrollHint(false);
      }, 650);
    };

    setShowScrollHint(false);
    setStatus("loading");
    setError("");

    const setMapError = (message: string) => {
      if (cancelled) return;
      setError(message);
      setStatus("error");
    };

    const startMap = async () => {
      try {
        if (provider === "naver") {
          await loadMapScript(
            "ahns-naver-map-sdk",
            `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(selectedKey)}&submodules=geocoder`,
          );
          if (cancelled) return;

          const naver = (window as MapWindow).naver;
          if (!naver?.maps)
            throw new Error("네이버 지도 SDK 초기화에 실패했습니다.");

          if (!naver.maps.Service) {
            await new Promise<void>((resolve, reject) => {
              const timeout = window.setTimeout(() => {
                reject(
                  new Error("네이버 주소 검색 모듈을 불러오지 못했습니다."),
                );
              }, 6000);
              const previous = naver.maps.onJSContentLoaded;
              naver.maps.onJSContentLoaded = () => {
                previous?.();
                window.clearTimeout(timeout);
                resolve();
              };
            });
          }
          if (cancelled) return;

          const service = naver.maps.Service;
          if (!service)
            throw new Error("네이버 주소 검색 모듈을 사용할 수 없습니다.");

          service.geocode({ query: address }, (resultStatus, response) => {
            if (cancelled) return;
            if (resultStatus !== service.Status.OK) {
              setMapError(
                "네이버에서 주소를 검색하지 못했습니다. 등록된 병원 주소를 확인하세요.",
              );
              return;
            }

            const position = response?.v2?.addresses?.[0];
            const latitude = Number(position?.y);
            const longitude = Number(position?.x);
            if (
              !position ||
              !validCoordinate(latitude) ||
              !validCoordinate(longitude)
            ) {
              setMapError(
                "네이버 지도에서 해당 주소의 좌표를 찾지 못했습니다.",
              );
              return;
            }

            const center = new naver.maps.LatLng(latitude, longitude);
            const map = new naver.maps.Map(container, {
              center,
              zoom: 16,
              zoomControl: true,
              scrollWheel: false,
              minZoom: 7,
              maxZoom: 21,
            });
            new naver.maps.Marker({ position: center, map });

            removeWheelHandler = bindMapWheel(container, {
              onPlainWheel: showPlainWheelHint,
              onCtrlWheel: hideScrollHint,
              updateZoom: (deltaY) => {
                // 네이버: 숫자가 커질수록 확대.
                const nextZoom = Math.max(
                  7,
                  Math.min(21, map.getZoom() + (deltaY < 0 ? 1 : -1)),
                );
                map.setZoom(nextZoom);
              },
            });
            setStatus("ready");
          });
          return;
        }

        if (provider === "kakao") {
          await loadMapScript(
            "ahns-kakao-map-sdk",
            `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(selectedKey)}&autoload=false&libraries=services`,
          );
          if (cancelled) return;

          const kakao = (window as MapWindow).kakao;
          if (!kakao?.maps?.load)
            throw new Error("카카오 지도 SDK 초기화에 실패했습니다.");

          kakao.maps.load(() => {
            if (cancelled) return;
            if (!kakao.maps.services?.Geocoder) {
              setMapError("카카오 주소 검색 모듈을 사용할 수 없습니다.");
              return;
            }

            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, (results, resultStatus) => {
              if (cancelled) return;
              const position = results?.[0];
              const latitude = Number(position?.y);
              const longitude = Number(position?.x);
              if (
                resultStatus !== kakao.maps.services.Status.OK ||
                !position ||
                !validCoordinate(latitude) ||
                !validCoordinate(longitude)
              ) {
                setMapError(
                  "카카오에서 주소를 찾지 못했습니다. 관리자 주소를 확인하세요.",
                );
                return;
              }

              const center = new kakao.maps.LatLng(latitude, longitude);
              const map = new kakao.maps.Map(container, {
                center,
                level: 3,
                // setMinLevel/setMaxLevel은 Map 생성 옵션이 아니라 메서드다.
              });
              map.setZoomable(false);
              const marker = new kakao.maps.Marker({ position: center });
              marker.setMap(map);

              removeWheelHandler = bindMapWheel(container, {
                onPlainWheel: showPlainWheelHint,
                onCtrlWheel: hideScrollHint,
                updateZoom: (deltaY) => {
                  // 카카오: 숫자가 작을수록 확대. Roadmap 1~14 레벨.
                  const nextLevel = Math.max(
                    1,
                    Math.min(14, map.getLevel() + (deltaY < 0 ? -1 : 1)),
                  );
                  map.setLevel(nextLevel, { animate: { duration: 160 } });
                },
              });
              setStatus("ready");
            });
          });
          return;
        }

        // Google Maps: 선택된 순간에만 JS API 로드. 주소는 Google Geocoder로 변환.
        await loadGoogleScript(selectedKey);
        if (cancelled) return;

        const google = (window as MapWindow).google;
        if (!google?.maps?.Map || !google.maps.Geocoder) {
          throw new Error("구글 지도 SDK 초기화에 실패했습니다.");
        }

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, resultStatus) => {
          if (cancelled) return;
          const center = results?.[0]?.geometry?.location;
          if (resultStatus !== "OK" || !center) {
            setMapError(
              "구글 주소 검색에 실패했습니다. Maps API 및 주소를 확인하세요.",
            );
            return;
          }

          const map = new google.maps.Map(container, {
            center,
            zoom: 16,
            minZoom: 7,
            maxZoom: 21,
            zoomControl: true,
            // 데스크톱 Ctrl+휠만 줌. 모바일에서는 두 손가락 제스처 허용.
            gestureHandling: "cooperative",
          });
          // 기본 Marker는 mapId 추가 설정 없이 작동하는 호환 구현.
          new google.maps.Marker({ position: center, map, title: clinicName });
          removeWheelHandler = bindMapWheel(container, {
            onPlainWheel: showPlainWheelHint,
            onCtrlWheel: hideScrollHint,
            // Google의 cooperative 옵션이 Ctrl+휠 줌을 직접 처리한다.
          });
          setStatus("ready");
        });
      } catch (cause) {
        setMapError(
          cause instanceof Error
            ? cause.message
            : "지도를 불러오지 못했습니다.",
        );
      }
    };

    void startMap();
    return () => {
      cancelled = true;
      if (hintHideTimer !== undefined) window.clearTimeout(hintHideTimer);
      removeWheelHandler?.();
    };
  }, [address, clinicName, enabled, provider, selectedKey]);

  const noKey = !selectedKey;
  const noAddress = !address.trim();

  return (
    <S.MapContent style={{ position: "relative", isolation: "isolate" }}>
      <S.MapCanvas
        ref={containerRef}
        aria-label={`${getProviderName(provider)} 병원 위치 지도`}
      />

      {/* Ctrl 없이 지도에서 휠을 돌릴 때 지도 전체를 덮는 안내. */}
      {enabled && status === "ready" && (
        <ScrollZoomOverlay $visible={showScrollHint} aria-hidden="true">
          <ScrollZoomGuide>
            <span className="zoom-hint-icon" aria-hidden="true">
              ⌕
            </span>
            <p className="zoom-hint-label">
              <kbd>Ctrl</kbd> + 스크롤로 지도 확대·축소
            </p>
          </ScrollZoomGuide>
        </ScrollZoomOverlay>
      )}

      {(!enabled || status !== "ready" || noKey || noAddress) && (
        <S.MapFallback role="status" aria-live="polite">
          <span className="map-symbol" aria-hidden="true">
            ⌖
          </span>
          <strong>
            {noAddress
              ? "병원 주소 등록이 필요합니다"
              : noKey
                ? `${getProviderName(provider)} 지도 연결 준비 중`
                : status === "error"
                  ? "지도를 표시할 수 없습니다"
                  : "지도를 불러오는 중입니다"}
          </strong>
          <p>
            {noAddress
              ? "관리자 페이지에서 실제 병원 주소를 등록해 주세요."
              : noKey
                ? `NEXT_PUBLIC_${provider === "naver" ? "NAVER_MAP_CLIENT_ID" : provider === "kakao" ? "KAKAO_MAP_JAVASCRIPT_KEY" : "GOOGLE_MAPS_API_KEY"} 환경변수를 등록해 주세요.`
                : status === "error"
                  ? error
                  : "등록된 주소를 지도 위에 표시하고 있습니다."}
          </p>
        </S.MapFallback>
      )}
    </S.MapContent>
  );
}

export default function HospitalMap({ address, clinicName }: HospitalMapProps) {
  const [provider, setProvider] = useState<MapProvider>("kakao");
  const [enabled, setEnabled] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setEnabled(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setEnabled(true);
          observer.disconnect();
        }
      },
      { rootMargin: "450px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    // 기존 data-lenis-prevent는 일반 휠 스크롤을 차단할 수 있어 제거한다.
    <S.MapSection ref={sectionRef} aria-label="병원 위치">
      <S.MapHeading>
        <div>
          <S.MicroLabel>LOCATION / FIND US</S.MicroLabel>
          <S.MapTitle>
            Visit <em>Ahn&apos;s.</em>
          </S.MapTitle>
        </div>
        <S.MapTabs
          role="group"
          aria-label="지도 서비스 선택"
          style={{ flexWrap: "wrap" }}
        >
          {(["naver", "kakao", "google"] as const).map((item) => (
            <S.MapTab
              key={item}
              type="button"
              $selected={provider === item}
              aria-pressed={provider === item}
              onClick={() => setProvider(item)}
            >
              {item.toUpperCase()} <span>↗</span>
            </S.MapTab>
          ))}
        </S.MapTabs>
      </S.MapHeading>

      <S.MapFrame>
        <SdkMap
          key={provider}
          provider={provider}
          address={address}
          clinicName={clinicName}
          enabled={enabled}
        />
        <S.MapCornerMark aria-hidden="true">
          AHN&apos;S / LOCATION
        </S.MapCornerMark>
      </S.MapFrame>

      <S.MapBottomBar>
        <div>
          <strong>{clinicName || "Ahn's Plastic Surgery"}</strong>
          <span>{address || "관리자에서 주소를 등록해 주세요."}</span>
        </div>
        {!!address.trim() && (
          <S.OutlineLink
            href={getExternalMapUrl(provider, address)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {getProviderName(provider)} 지도에서 크게 보기{" "}
            <span aria-hidden="true">↗</span>
          </S.OutlineLink>
        )}
      </S.MapBottomBar>
    </S.MapSection>
  );
}
