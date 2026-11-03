"use client";

import { API_ORIGIN } from "@/lib/api/config";
import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import * as S from "@/components/home/VlogSlider.styles";

// ScrollTrigger는 GSAP 기본 애니메이션과 달리 스크롤 위치를 기준으로 실행하는 플러그인이다.
// Hero/CategoryNav에서 이미 사용하더라도 모듈별로 등록해 두면 이 파일만 보아도 의존성을 알 수 있다.
gsap.registerPlugin(ScrollTrigger);

// 기존 Express 서버를 그대로 사용한다. 환경변수를 설정하면 배포 환경에서도 재사용할 수 있다.
const API_URL = API_ORIGIN;

/** [1] 기존 관리자 백엔드(GET /api/admin/vlogs)의 실제 컬럼명. */
interface VlogApiItem {
  VLOG_IDX: number;
  TITLE: string;
  FILE_NAME: string;
  VIDEO_URL: string | null;
  IS_ACTIVE?: string | null;
}

interface VlogApiResponse {
  success: boolean;
  data: unknown;
}

/** [2] 화면에서는 DB 컬럼명 대신 간결하고 명확한 이름을 사용한다. */
interface VlogItem {
  id: number;
  title: string;
  thumbnail: string;
  videoUrl: string | null;
}

type RequestStatus = "loading" | "ready" | "error";

/**
 * TypeScript의 interface는 서버에서 받은 데이터를 런타임에 검사해 주지 않는다.
 * 외부 데이터의 필수 필드를 직접 검사하여 잘못된 응답 때문에 페이지가 중단되지 않게 한다.
 */
function isVlogApiItem(value: unknown): value is VlogApiItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<VlogApiItem>;
  return (
    typeof item.VLOG_IDX === "number" &&
    Number.isFinite(item.VLOG_IDX) &&
    typeof item.TITLE === "string" &&
    item.TITLE.trim().length > 0 &&
    typeof item.FILE_NAME === "string" &&
    item.FILE_NAME.trim().length > 0
  );
}

/**
 * DB에 입력된 영상 주소를 검증한다.
 * - javascript: 같은 위험한 프로토콜은 통과시키지 않는다.
 * - 올바른 주소만 클릭할 수 있도록 하고, 주소가 없는 영상은 비활성화 상태로 표시한다.
 */
function getSafeVideoUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

/**
 * 유튜브 주소만 iframe에 넣을 수 있도록 영상 ID를 추출한다.
 * 예: watch?v=..., youtu.be/..., /shorts/..., /live/... 모두 지원한다.
 * 다른 도메인의 영상은 임의로 iframe에 넣지 않고 원래 주소를 새 탭에서 연다.
 */
function getYoutubeEmbedUrl(videoUrl: string): string | null {
  try {
    const url = new URL(videoUrl);
    const host = url.hostname
      .toLowerCase()
      .replace(/^www\./, "")
      .replace(/^m\./, "");
    const path = url.pathname.split("/").filter(Boolean);

    let videoId: string | null = null;
    if (host === "youtu.be") {
      videoId = path[0] ?? null;
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (path[0] === "watch") videoId = url.searchParams.get("v");
      else if (["shorts", "embed", "live"].includes(path[0] ?? "")) {
        videoId = path[1] ?? null;
      }
    }

    // 유튜브 영상 ID는 11자리의 영문·숫자·하이픈·밑줄 조합이다.
    if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return null;
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  } catch {
    return null;
  }
}

/**
 * 기존 page.tsx는 `import { VlogSlider } ...` 형태로 불러온다.
 * 그러므로 기존과 동일하게 named export를 유지한다.
 */
export function VlogSlider() {
  // DB에서 받아온 영상 목록, 요청 상태, 현재 대표로 선택한 영상 번호.
  const [videos, setVideos] = useState<VlogItem[]>([]);
  const [status, setStatus] = useState<RequestStatus>("loading");
  const [activeIndex, setActiveIndex] = useState(0);
  const [retryKey, setRetryKey] = useState(0);

  // 유튜브 영상 팝업에 표시할 iframe URL. null이면 팝업을 렌더링하지 않는다.
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [portalReady, setPortalReady] = useState(false);

  // GSAP이 애니메이션을 적용할 실제 DOM 요소를 기억한다.
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // 실행 순서 1: 서버에서 관리자 영상 목록을 가져온다.
  useEffect(() => {
    const controller = new AbortController();

    const fetchVlogs = async () => {
      setStatus("loading");
      try {
        const response = await axios.get<VlogApiResponse>(
          `${API_URL}/api/admin/vlogs`,
          { signal: controller.signal },
        );

        if (!response.data.success || !Array.isArray(response.data.data)) {
          throw new Error("Vlog API 응답 형식이 올바르지 않습니다.");
        }

        const formatted: VlogItem[] = response.data.data
          .filter(isVlogApiItem)
          // IS_ACTIVE가 제공되는 API만 해당 값을 확인한다. 없는 기존 API와도 호환된다.
          .filter((item) => item.IS_ACTIVE !== "N")
          .map((item) => ({
            id: item.VLOG_IDX,
            title: item.TITLE.trim(),
            // 이미지는 Next public 폴더가 아니라 기존 Express의 /images 경로를 이용한다.
            thumbnail: `${API_URL}/images/${encodeURIComponent(item.FILE_NAME)}`,
            videoUrl: getSafeVideoUrl(item.VIDEO_URL),
          }));

        if (controller.signal.aborted) return;
        setVideos(formatted);
        setActiveIndex(0);
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Vlog 영상 로드 실패:", error);
        setVideos([]);
        setStatus("error");
      }
    };

    void fetchVlogs();
    // 컴포넌트가 사라지면 미완료 HTTP 요청을 취소하여 잘못된 setState를 방지한다.
    return () => controller.abort();
  }, [retryKey]);

  // 모달(createPortal)은 document.body가 존재하는 브라우저에서만 렌더링한다.
  // 서버 렌더링 중 document 접근 오류가 발생하지 않도록 useEffect 안에서 준비한다.
  useEffect(() => setPortalReady(true), []);

  // 실행 순서 2: 데이터가 준비되면 GSAP으로 섹션의 등장 애니메이션을 만든다.
  useEffect(() => {
    if (status !== "ready" || !sectionRef.current || videos.length === 0)
      return;

    const section = sectionRef.current;
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      // gsap.context는 섹션 안에서 만든 애니메이션과 ScrollTrigger를 한 번에 정리한다.
      const context = gsap.context(() => {
        gsap.fromTo(
          "[data-vlog-heading]",
          { y: 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 82%", once: true },
          },
        );

        gsap.fromTo(
          "[data-vlog-main]",
          { y: 55, opacity: 0, clipPath: "inset(5% 0% 7% 0% round 18px)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0% round 3px)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 72%", once: true },
          },
        );

        gsap.fromTo(
          "[data-vlog-list]",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            delay: 0.08,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 70%", once: true },
          },
        );
      }, section);

      return () => context.revert();
    });

    // API 응답 후 DOM 높이가 확정된 시점에 하단 섹션의 ScrollTrigger 위치도 재측정한다.
    // 여기에는 pin이 없어서 기존 Hero/CategoryNav의 고정 효과와 충돌하지 않는다.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(frame);
      media.revert();
    };
  }, [status, videos.length]);

  // 실행 순서 3: 목록에서 다른 영상을 선택하면 대표 영역만 바꾼다.
  // 선택 동작 자체는 애니메이션이 끝날 때까지 기다리지 않아 즉시 반응한다.
  const chooseVideo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const moveSelection = useCallback(
    (direction: -1 | 1) => {
      setActiveIndex((previous) => {
        if (videos.length === 0) return 0;
        return (previous + direction + videos.length) % videos.length;
      });
    },
    [videos.length],
  );

  /**
   * 실행 순서 4: 대표 영상의 재생 버튼을 클릭했을 때만 영상을 로드한다.
   * - 유튜브 링크: 페이지 안의 팝업 iframe으로 재생
   * - 그 외 웹 링크: 새 탭에서 열어 원본 서비스의 재생 방식을 유지
   * - 주소가 없는 경우: 버튼 자체를 렌더링하지 않음
   */
  const playVideo = useCallback((videoUrl: string | null) => {
    if (!videoUrl) return;
    const youtubeEmbed = getYoutubeEmbedUrl(videoUrl);

    if (youtubeEmbed) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setEmbedUrl(youtubeEmbed);
      return;
    }

    window.open(videoUrl, "_blank", "noopener,noreferrer");
  }, []);

  const closeVideo = useCallback(() => setEmbedUrl(null), []);

  // 유튜브 팝업이 열릴 때 배경 스크롤을 막고, ESC 키로 닫을 수 있게 한다.
  // 닫힐 때 iframe이 DOM에서 제거되어 영상 소리까지 즉시 정지한다.
  useEffect(() => {
    if (!embedUrl) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeVideo();
      if (event.key === "Tab") {
        // 이 모달에서 사용자가 키보드로 이동할 수 있는 버튼은 닫기 버튼 하나다.
        // 포커스가 뒤에 있는 본문으로 빠지지 않도록 유지한다.
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = before;
      window.removeEventListener("keydown", onKeyDown);
      // DOM 정리 뒤에 사용자가 클릭했던 버튼으로 키보드 포커스를 돌린다.
      previousFocusRef.current?.focus();
    };
  }, [embedUrl, closeVideo]);

  const selected = videos[activeIndex] ?? null;
  const isReady = status === "ready";

  return (
    <S.Section ref={sectionRef} aria-labelledby="ahns-vlog-heading">
      <S.Inner>
        {/* 시네마 콘셉트: 잡지의 커다란 헤드라인과 간결한 메타 정보 */}
        <S.Header data-vlog-heading>
          <S.HeaderLeft>
            <S.Eyebrow>
              <span /> 04 / AHN'S VLOG
            </S.Eyebrow>
            <S.Title id="ahns-vlog-heading">
              Clinic <em>Vlog.</em>
            </S.Title>
            <S.Description>
              아름다움을 만드는 순간과 그 안에 담긴 이야기.
              <br />
              안스의 일상을 영상으로 만나보세요.
            </S.Description>
          </S.HeaderLeft>
          <S.HeaderRight>
            <S.SectionCount>04 / FILM ARCHIVE</S.SectionCount>
            <S.HeaderRule data-editorial-rule />
            <S.HeaderSignature>BEYOND THE FRAME — AHN'S</S.HeaderSignature>
          </S.HeaderRight>
        </S.Header>

        {status === "loading" ? (
          <S.StatusPanel role="status">
            LOADING THE FILM ARCHIVE...
          </S.StatusPanel>
        ) : status === "error" ? (
          <S.StatusPanel role="alert">
            영상을 불러오지 못했습니다.
            <S.RetryButton
              type="button"
              onClick={() => setRetryKey((v) => v + 1)}
            >
              다시 시도 ↗
            </S.RetryButton>
          </S.StatusPanel>
        ) : videos.length === 0 ? (
          <S.StatusPanel>등록된 영상이 없습니다.</S.StatusPanel>
        ) : (
          <S.CinemaLayout>
            {/* 왼쪽: 선택된 영상 한 개를 크게 보여 준다. */}
            <S.MainColumn data-vlog-main>
              <S.Stage ref={stageRef} data-editorial-spotlight>
                {selected && (
                  <>
                    <Image
                      key={selected.id}
                      src={selected.thumbnail}
                      alt={selected.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 75vw"
                      style={{ objectFit: "cover" }}
                      priority={false}
                    />
                    <S.StageShade aria-hidden="true" />
                    <S.StageTop>
                      <S.StageTopLabel>
                        THE AHN'S FILM COLLECTION
                      </S.StageTopLabel>
                      <S.StageTopNumber>
                        {String(activeIndex + 1).padStart(2, "0")} /{" "}
                        {String(videos.length).padStart(2, "0")}
                      </S.StageTopNumber>
                    </S.StageTop>
                    {selected.videoUrl && (
                      <S.PlayButton
                        type="button"
                        onClick={() => playVideo(selected.videoUrl)}
                        aria-label={`${selected.title} 영상 재생`}
                      >
                        <S.PlayTriangle aria-hidden="true">▶</S.PlayTriangle>
                        <span>PLAY FILM</span>
                      </S.PlayButton>
                    )}
                    <S.StageBottom>
                      <S.StageKicker>
                        FEATURED STORY —{" "}
                        {String(activeIndex + 1).padStart(2, "0")}
                      </S.StageKicker>
                      <S.StageTitle>{selected.title}</S.StageTitle>
                      <S.StageBottomLine>
                        AHN'S PLASTIC SURGERY <span>↗</span>
                      </S.StageBottomLine>
                    </S.StageBottom>
                  </>
                )}
              </S.Stage>
              <S.StageFoot>
                <S.FootHint>SELECT A STORY FROM THE COLLECTION</S.FootHint>
                <S.FootNavigation>
                  <S.ArrowButton
                    type="button"
                    onClick={() => moveSelection(-1)}
                    aria-label="이전 영상 선택"
                    disabled={videos.length < 2}
                  >
                    ←
                  </S.ArrowButton>
                  <S.ArrowButton
                    type="button"
                    onClick={() => moveSelection(1)}
                    aria-label="다음 영상 선택"
                    disabled={videos.length < 2}
                  >
                    →
                  </S.ArrowButton>
                </S.FootNavigation>
              </S.StageFoot>
            </S.MainColumn>

            {/* 오른쪽: 다른 영상을 고르는 목록. 영상 개수와 관계없이 세로 스크롤이 가능하다. */}
            <S.Playlist data-vlog-list aria-label="영상 목록">
              <S.PlaylistHeader>
                <S.PlaylistTitle>THE COLLECTION</S.PlaylistTitle>
                <S.PlaylistCount>
                  {String(videos.length).padStart(2, "0")} FILMS
                </S.PlaylistCount>
              </S.PlaylistHeader>
              <S.PlaylistItems>
                {videos.map((video, index) => (
                  <S.PlaylistButton
                    key={video.id}
                    type="button"
                    $selected={activeIndex === index}
                    onClick={() => chooseVideo(index)}
                    aria-pressed={activeIndex === index}
                    aria-label={`${video.title} 대표 영상으로 선택`}
                  >
                    <S.ListImage>
                      <Image
                        src={video.thumbnail}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 30vw, 160px"
                        style={{ objectFit: "cover" }}
                      />
                      <S.ListImageOverlay aria-hidden="true" />
                    </S.ListImage>
                    <S.ListDetail>
                      <S.ListIndex>
                        FILM {String(index + 1).padStart(2, "0")}
                      </S.ListIndex>
                      <S.ListTitle>{video.title}</S.ListTitle>
                      <S.ListFoot>
                        {video.videoUrl ? "WATCH THE STORY" : "PREVIEW ONLY"}
                      </S.ListFoot>
                    </S.ListDetail>
                    <S.ListArrow aria-hidden="true">↗</S.ListArrow>
                  </S.PlaylistButton>
                ))}
              </S.PlaylistItems>
              <S.PlaylistFooter>
                AN ONGOING VISUAL STORY OF AHN'S.
              </S.PlaylistFooter>
            </S.Playlist>
          </S.CinemaLayout>
        )}

        {/* 하단에는 별도의 두꺼운 테두리를 두지 않아 다음 섹션으로 자연스럽게 이어진다. */}
        <S.BottomLine>
          <span>AHN'S VISUAL DIARY</span>
          <span>
            {isReady
              ? `${String(videos.length).padStart(2, "0")} STORIES`
              : "FILM ARCHIVE"}
          </span>
        </S.BottomLine>
      </S.Inner>

      {/* 클릭하기 전에는 iframe을 만들지 않는다. 불필요한 외부 영상 로딩을 줄인다. */}
      {portalReady &&
        embedUrl &&
        createPortal(
          <S.ModalBackdrop
            onMouseDown={(event) => {
              // 영상 바깥 배경을 눌렀을 때만 닫는다. 영상 자체 클릭은 무시한다.
              if (event.target === event.currentTarget) closeVideo();
            }}
          >
            <S.ModalPanel
              role="dialog"
              aria-modal="true"
              aria-label="안스 영상 재생"
            >
              <S.ModalHeader>
                <S.ModalLabel>NOW PLAYING · AHN'S VISUAL JOURNAL</S.ModalLabel>
                <S.ModalClose
                  ref={closeRef}
                  type="button"
                  onClick={closeVideo}
                  aria-label="영상 닫기"
                >
                  ✕
                </S.ModalClose>
              </S.ModalHeader>
              <S.IframeFrame>
                <iframe
                  src={embedUrl}
                  title={`${selected?.title ?? "Ahn's"} 영상`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </S.IframeFrame>
            </S.ModalPanel>
          </S.ModalBackdrop>,
          document.body,
        )}
    </S.Section>
  );
}
