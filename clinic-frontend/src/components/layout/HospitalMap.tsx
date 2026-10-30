"use client";
/// <reference types="kakao.maps.d.ts" />
import { useEffect, useRef, useState } from "react";

import * as S from "@/components/layout/Footer.styles";

/*
 * HospitalMap.tsx
 * ----------------------------------------------------------
 * [역할]
 * - Footer 오른쪽에 큰 네이버/카카오 지도를 표시한다.
 * - 상단 탭을 클릭하면 실제 지도를 바꾼다.
 * - 지도 좌표를 임의로 정하지 않는다. 관리자 DB의 주소를 지오코딩한다.
 *
 * [동작 순서]
 * 1) Footer가 관리자 API에서 병원 주소를 가져온다.
 * 2) HospitalMap이 화면 근처에 들어오면 지도 SDK를 지연 로드한다.
 * 3) 선택한 지도 SDK가 주소를 위도/경도로 변환한다.
 * 4) 해당 좌표에 지도 + 마커를 그린다.
 * 5) 네이버/카카오 탭을 누르면 기존 지도를 버리고 새 지도를 만든다.
 *
 * [보안]
 * NEXT_PUBLIC_... 키는 브라우저에 공개되는 지도용 식별자다.
 * 제공업체 콘솔에서 실제 운영 도메인과 localhost 허용 도메인을 등록해야 한다.
 * 서버 비밀 키(Admin/REST secret 등)는 절대 NEXT_PUBLIC_로 보내지 말 것.
 */

type MapProvider = "naver" | "kakao";
type MapStatus = "loading" | "ready" | "error";

interface HospitalMapProps {
  address: string;
  clinicName: string;
}

/*
 * 외부 지도 라이브러리는 npm 패키지가 아닌 외부 스크립트로 로드한다.
 * TypeScript가 window.naver / window.kakao의 모양을 알 수 있도록
 * 실제 사용하는 최소 API만 정의했다. (any 사용하지 않음)
 */
interface NaverNamespace {
  maps: {
    LatLng: new (latitude: number, longitude: number) => unknown;
    Map: new (
      element: HTMLElement,
      options: Record<string, unknown>,
    ) => unknown;
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
    ) => unknown;
    Marker: new (options: Record<string, unknown>) => {
      setMap(map: unknown): void;
    };

    services: {
      Status: { OK: unknown };
      Geocoder: new () => {
        addressSearch(
          address: string,
          callback: (
            result: { x: string; y: string }[],
            status: unknown,
          ) => void,
        ): void;
      };
    };
  };
}

type MapWindow = Window & {
  naver?: NaverNamespace;
  kakao?: KakaoNamespace;
};

/*
 * 같은 페이지에 지도 두 종류를 번갈아 불러와도 <script> 태그가
 * 중복 생성되지 않도록 모듈 단위에서 Promise를 기억한다.
 */
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
          "지도 SDK를 불러오지 못했습니다. 도메인 및 API 키를 확인해 주세요.",
        ),
      );
    };
    document.head.appendChild(script);
  });

  // 실패한 상태까지 영구 캐시하지 않는다. 재시도할 수 있어야 하기 때문이다.
  scriptCache.set(id, promise);
  void promise.catch(() => scriptCache.delete(id));
  return promise;
}

function validCoordinate(value: number): boolean {
  return Number.isFinite(value);
}

/*
 * [외부 지도 열기]
 * 검색어는 DB에 등록된 실제 주소를 사용하며, 좌표를 만들어내지 않는다.
 * API 키 설정 전에도 사용자가 길찾기를 이어갈 수 있도록 제공한다.
 */
function getExternalMapUrl(provider: MapProvider, address: string) {
  const query = encodeURIComponent(address.trim());
  return provider === "naver"
    ? `https://map.naver.com/p/search/${query}`
    : `https://map.kakao.com/link/search/${query}`;
}

/** 선택한 서비스의 지도 한 개만 관리한다. 탭 전환 때 key가 바뀌어 새로 생성된다. */
function SdkMap({
  provider,
  address,
  enabled,
}: {
  provider: MapProvider;
  address: string;
  enabled: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<MapStatus>("loading");
  const [error, setError] = useState("");

  const naverKey = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID?.trim();
  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_JAVASCRIPT_KEY?.trim();
  const selectedKey = provider === "naver" ? naverKey : kakaoKey;

  useEffect(() => {
    // Footer가 화면에 가까워지기 전에는 SDK 로드를 시작하지 않는다.
    if (!enabled || !address.trim() || !selectedKey || !containerRef.current)
      return;

    let cancelled = false;
    const container = containerRef.current;

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

          /*
           * 네이버의 geocoder 서브 모듈은 기본 SDK보다 늦게 준비될 수 있다.
           * SDK 공식 문서의 onJSContentLoaded도 지원하되,
           * 제한 시간을 두어 오류 상태가 무기한 멈추지 않도록 한다.
           */
          if (!naver.maps.Service) {
            await new Promise<void>((resolve, reject) => {
              const timeout = window.setTimeout(
                () =>
                  reject(
                    new Error("네이버 주소 검색 모듈을 불러오지 못했습니다."),
                  ),
                6000,
              );
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
            // 주소 검색은 비동기 콜백이다. 그 사이 네이버 탭이 닫혔다면 중단한다.
            if (cancelled) return;

            /*
             * 중요: 네이버 API는 검색 실패 시 response 자체를 전달하지 않을 수 있다.
             * response.v2에 직접 접근하면 undefined에서 TypeError가 발생한다.
             * 따라서 상태값을 먼저 확인하고, response도 ?. 로 검사한다.
             */
            if (resultStatus !== service.Status.OK) {
              setError(
                "네이버 주소 검색에 실패했습니다. API 권한과 관리자 주소를 확인해 주세요.",
              );
              setStatus("error");
              return;
            }

            const position = response?.v2?.addresses?.[0];
            const latitude = Number(position?.y);
            const longitude = Number(position?.x);

            // 성공 응답이더라도 검색 결과가 비어 있을 수 있다.
            if (
              !position ||
              !validCoordinate(latitude) ||
              !validCoordinate(longitude)
            ) {
              setError(
                "네이버에서 주소를 찾지 못했습니다. 관리자 주소를 확인해 주세요.",
              );
              setStatus("error");
              return;
            }

            const center = new naver.maps.LatLng(latitude, longitude);
            const map = new naver.maps.Map(container, {
              center,
              zoom: 16,
              zoomControl: true,
              scrollWheel: false, // 페이지를 스크롤할 때 지도 줌이 바뀌는 문제 방지
              maxZoom: 7,
              minZoom: 21,
            });
            new naver.maps.Marker({ position: center, map });
            setStatus("ready");
          });
          return;
        }

        // 카카오 지도는 'autoload=false'를 사용하므로 load()를 직접 호출한다.
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
            setError("카카오 지도 주소 검색 모듈을 사용할 수 없습니다.");
            setStatus("error");
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
              setStatus("error");
              setError(
                "주소 검색 결과가 없습니다. 관리자 주소를 확인해 주세요.",
              );
              return;
            }
            const center = new kakao.maps.LatLng(latitude, longitude);
            const map = new kakao.maps.Map(container, {
              center,
              level: 3,
              minLevel: 1,
              maxLevel: 3,
            });
            const marker = new kakao.maps.Marker({ position: center });

            marker.setMap(map);
            setStatus("ready");
          });
        });
      } catch (cause) {
        if (cancelled) return;
        setError(
          cause instanceof Error
            ? cause.message
            : "지도를 불러오지 못했습니다.",
        );
        setStatus("error");
      }
    };

    void startMap();

    // 언마운트/탭 전환 시 이전 주소 검색 콜백이 React state를 바꾸지 못하게 차단한다.
    return () => {
      cancelled = true;
    };
  }, [address, enabled, provider, selectedKey]);

  const noKey = !selectedKey;
  const noAddress = !address.trim();

  return (
    <S.MapContent>
      {/* 지도 SDK가 실제 지도를 그리는 DOM. display:none으로 감추지 않는다. */}
      <S.MapCanvas
        ref={containerRef}
        aria-label={`${provider === "naver" ? "네이버" : "카카오"} 병원 위치 지도`}
      />

      {(!enabled || status !== "ready" || noKey || noAddress) && (
        <S.MapFallback role="status" aria-live="polite">
          <span className="map-symbol" aria-hidden="true">
            ⌖
          </span>
          <strong>
            {noAddress
              ? "병원 주소 등록이 필요합니다"
              : noKey
                ? `${provider === "naver" ? "네이버" : "카카오"} 지도 연결 준비 중`
                : status === "error"
                  ? "지도를 표시할 수 없습니다"
                  : "지도를 불러오는 중입니다"}
          </strong>
          <p>
            {noAddress
              ? "관리자 페이지에서 실제 병원 주소를 등록해 주세요."
              : noKey
                ? "환경변수에 지도 JavaScript API 키를 등록하면 이곳에 실제 지도가 나타납니다."
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
  // 푸터 최초 진입 시 카카오 지도를 보여주며, 버튼으로 네이버로 변경 가능하다.
  const [provider, setProvider] = useState<MapProvider>("kakao");
  const [enabled, setEnabled] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // 지도는 페이지 최하단에 있으므로 근처로 스크롤했을 때만 SDK를 로드한다.
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setEnabled(true);
          observer.disconnect(); // 한 번 로드했다면 계속 유지
        }
      },
      { rootMargin: "450px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <S.MapSection ref={sectionRef} aria-label="병원 위치" data-lenis-prevent>
      <S.MapHeading>
        <div>
          <S.MicroLabel>LOCATION / FIND US</S.MicroLabel>
          <S.MapTitle>
            Visit <em>Ahn&apos;s.</em>
          </S.MapTitle>
        </div>
        <S.MapTabs role="group" aria-label="지도 서비스 선택">
          <S.MapTab
            type="button"
            $selected={provider === "naver"}
            aria-pressed={provider === "naver"}
            onClick={() => setProvider("naver")}
          >
            NAVER <span>↗</span>
          </S.MapTab>
          <S.MapTab
            type="button"
            $selected={provider === "kakao"}
            aria-pressed={provider === "kakao"}
            onClick={() => setProvider("kakao")}
          >
            KAKAO <span>↗</span>
          </S.MapTab>
        </S.MapTabs>
      </S.MapHeading>

      <S.MapFrame>
        <SdkMap
          key={provider}
          provider={provider}
          address={address}
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
        {address.trim() && (
          <S.OutlineLink
            href={getExternalMapUrl(provider, address)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {provider === "naver" ? "네이버" : "카카오"} 지도에서 크게 보기{" "}
            <span aria-hidden="true">↗</span>
          </S.OutlineLink>
        )}
      </S.MapBottomBar>
    </S.MapSection>
  );
}
