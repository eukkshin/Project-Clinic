"use client";

import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import * as S from "@/assets/css/components/Selfies.styles";

// ScrollTrigger는 GSAP의 추가 기능이다.
// 일반 gsap.to()와 달리 '스크롤 위치에 따라 애니메이션을 시작'할 때 필요하다.
gsap.registerPlugin(ScrollTrigger);

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/**
 * [1] Express API에서 내려오는 원본 데이터.
 * 관리자 페이지가 사용하던 DB 필드명을 그대로 사용한다.
 *
 * 이 프로젝트의 백엔드에는 GET /api/admin/selfies가 있으며,
 * SELFIE_IDX, FILE_NAME, LIKES, VIEWS, IS_ACTIVE 필드를 사용한다.
 */
interface SelfieApiItem {
  SELFIE_IDX: number;
  FILE_NAME: string;
  LIKES: number | string | null;
  VIEWS: number | string | null;
  IS_ACTIVE: "Y" | "N" | null;
}

// API의 data는 외부에서 온 값이다.
// 타입을 선언했다고 서버의 실제 값까지 자동 검증되는 건 아니다.
interface SelfieApiResponse {
  success: boolean;
  data: unknown;
}

/**
 * [2] 프론트엔드에서 사용할 데이터.
 * DB 필드명보다 이해하기 쉬운 이름으로 변환해서 사용한다.
 */
interface SelfieItem {
  id: number;
  imageUrl: string;
  likes: number;
  views: number;
}

type LoadingStatus = "loading" | "ready" | "error";

// 숫자가 아닌 데이터가 들어오더라도 화면에 NaN이 표시되지 않도록 처리한다.
function toSafeCount(value: number | string | null): number {
  const count = Number(value);
  return Number.isFinite(count) && count >= 0 ? Math.floor(count) : 0;
}

/**
 * [3] API 데이터가 화면에 사용하기 적절한지 검사한다.
 * TypeScript의 타입만 믿지 않고 실제 값도 검사해야 런타임 오류를 예방할 수 있다.
 */
function isSelfieApiItem(value: unknown): value is SelfieApiItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Partial<SelfieApiItem>;
  return (
    typeof item.SELFIE_IDX === "number" &&
    Number.isFinite(item.SELFIE_IDX) &&
    typeof item.FILE_NAME === "string" &&
    item.FILE_NAME.trim().length > 0
  );
}

const numberFormatter = new Intl.NumberFormat("ko-KR");

export default function Selfies() {
  const [items, setItems] = useState<SelfieItem[]>([]);
  const [status, setStatus] = useState<LoadingStatus>("loading");
  const [requestKey, setRequestKey] = useState(0);
  const [selected, setSelected] = useState<SelfieItem | null>(null);

  // 현재 보이는 위치를 나타내는 컨트롤 상태.
  // 실제 사진 이동은 브라우저의 기본 가로 스크롤이 담당한다.
  const [controls, setControls] = useState({
    index: 0,
    canPrev: false,
    canNext: false,
  });

  // useRef는 HTML 요소를 기억한다. 값이 변경돼도 불필요한 렌더링을 일으키지 않는다.
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // ────────────────────────────────────────────────────────────────
  // 1. 관리자 서버에서 갤러리 사진 조회
  // ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();

    const fetchSelfies = async () => {
      try {
        const response = await axios.get<SelfieApiResponse>(
          `${API_URL}/api/admin/selfies`,
          { signal: controller.signal },
        );

        if (!response.data.success || !Array.isArray(response.data.data)) {
          throw new Error("셀피 API 응답 형식이 올바르지 않습니다.");
        }

        const formatted: SelfieItem[] = response.data.data
          .filter(isSelfieApiItem)
          // 관리자가 비활성화한 이미지는 사용자 페이지에 노출하지 않는다.
          .filter((item) => item.IS_ACTIVE === "Y")
          .map((item) => ({
            id: item.SELFIE_IDX,
            // public 폴더가 아니라 기존 Express 서버의 이미지 제공 경로를 사용한다.
            imageUrl: `${API_URL}/images/${encodeURIComponent(item.FILE_NAME)}`,
            likes: toSafeCount(item.LIKES),
            views: toSafeCount(item.VIEWS),
          }));

        setItems(formatted);
        setStatus("ready");
      } catch (error) {
        // 다른 페이지로 이동해 요청을 취소했다면 오류로 처리하지 않는다.
        if (controller.signal.aborted) return;
        console.error("셀피 갤러리 조회 실패:", error);
        setStatus("error");
      }
    };

    void fetchSelfies();

    // 컴포넌트가 없어지면 진행 중이던 네트워크 요청을 취소한다.
    return () => controller.abort();
  }, [requestKey]);

  // ────────────────────────────────────────────────────────────────
  // 2. 가로 갤러리의 이전/다음 버튼 활성화 상태 갱신
  // ────────────────────────────────────────────────────────────────
  const updateControls = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    // 전체 너비에서 실제 보이는 너비를 빼면 '최대 스크롤 거리'가 된다.
    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const firstCard = viewport.querySelector<HTMLElement>("[data-selfie-card]");
    const gap = parseFloat(window.getComputedStyle(viewport).columnGap) || 0;
    const step = (firstCard?.getBoundingClientRect().width ?? 1) + gap;
    const index = Math.round(viewport.scrollLeft / Math.max(step, 1));

    setControls((previous) => {
      const next = {
        index,
        canPrev: viewport.scrollLeft > 4,
        canNext: viewport.scrollLeft < maxScroll - 4,
      };

      // 값이 같으면 이전 객체를 반환한다. React가 불필요하게 다시 그리지 않는다.
      if (
        previous.index === next.index &&
        previous.canPrev === next.canPrev &&
        previous.canNext === next.canNext
      ) {
        return previous;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (status !== "ready" || items.length === 0) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    // 스크롤 이벤트가 매우 빠르게 발생해도 화면 갱신은 프레임당 최대 1번 수행한다.
    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateControls);
    };

    // 카드 크기는 반응형이라 창이 바뀌면 버튼의 상태도 다시 계산해야 한다.
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(viewport);
    viewport.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      viewport.removeEventListener("scroll", handleScroll);
    };
  }, [items, status, updateControls]);

  const moveGallery = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const firstCard = viewport.querySelector<HTMLElement>("[data-selfie-card]");
    if (!firstCard) return;

    // 카드 폭 + 카드 사이 간격만큼 이동해야 카드가 한 장씩 자연스럽게 넘어간다.
    const gap = parseFloat(window.getComputedStyle(viewport).columnGap) || 0;
    const step = firstCard.getBoundingClientRect().width + gap;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    viewport.scrollBy({
      left: step * direction,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  // ────────────────────────────────────────────────────────────────
  // 3. 스크롤 등장 애니메이션: 절대 pin을 사용하지 않는다.
  // 앞의 Hero / CategoryNav는 이미 pin을 사용하므로 여기서는 자연스러운 세로 흐름만 유지한다.
  // ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (status !== "ready" || items.length === 0 || !sectionRef.current) return;

    const section = sectionRef.current;
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.fromTo(
          "[data-selfie-heading]",
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              once: true,
            },
          },
        );

        // 카드마다 등장 타이밍을 조금씩 달리해 밋밋한 느낌을 줄인다.
        gsap.utils
          .toArray<HTMLElement>("[data-selfie-card]")
          .forEach((card, index) => {
            const motion = card.querySelector("[data-selfie-motion]");
            if (!motion) return;

            gsap.fromTo(
              motion,
              { y: 34, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.85,
                delay: Math.min(index, 3) * 0.06,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 95%",
                  once: true,
                },
              },
            );
          });

        gsap.fromTo(
          section,
          {
            "--moments-y": "80px", // 처음에는 아래로 80px
            "--moments-opacity": 0, // 처음에는 보이지 않음
          },
          {
            "--moments-y": "0px", // 스크롤하면서 원래 위치로
            "--moments-opacity": 0.07, // 서서히 나타나도록

            ease: "none",

            scrollTrigger: {
              trigger: section,

              // Selfies 상단이 화면 높이의 85% 지점에 도달하면 시작
              start: "top 85%",

              // Selfies 상단이 화면 높이의 20% 지점에 도달하면 완료
              end: "top 20%",

              // 스크롤과 애니메이션을 연결하면서 부드럽게 따라감
              scrub: 0.8,

              // pin을 사용하지 않으므로 세로 스크롤을 고정하지 않음
            },
          },
        );
      }, section);

      // 리액트가 컴포넌트를 없애면 GSAP이 등록한 애니메이션도 정리한다.
      return () => context.revert();
    });

    // API 데이터를 받은 뒤 카드가 렌더링되었으므로 스크롤 위치를 한 번 다시 계산한다.
    // pin이 있는 Hero/CategoryNav 뒤에 동적 콘텐츠가 들어올 때 위치가 어긋나는 문제를 줄인다.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(frame);
      media.revert();
    };
  }, [items, status]);

  // ────────────────────────────────────────────────────────────────
  // 4. 이미지를 크게 보는 모달: ESC로 닫기, 배경 스크롤 잠금, 포커스 복원
  // ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selected) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      // 확대 화면의 초점이 뒤쪽 페이지로 넘어가지 않게 한다.
      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [selected]);

  const openPhoto = (item: SelfieItem) => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    setSelected(item);
  };

  return (
    <S.Section ref={sectionRef} aria-labelledby="selfies-title">
      <S.Inner>
        <S.Heading data-selfie-heading>
          <S.HeadingMeta>
            <S.Eyebrow>02 / AHN'S MOMENTS</S.Eyebrow>
            <S.SectionNumber>REAL MOMENTS</S.SectionNumber>
          </S.HeadingMeta>

          <S.HeadingRow>
            <S.HeadingMain>
              <S.Title id="selfies-title">
                Real <em>Stories.</em>
              </S.Title>
              <S.Description>
                안즈와 함께한, 더 특별해진 일상.
                <br />
                자연스러운 순간을 만나보세요.
              </S.Description>
            </S.HeadingMain>

            <S.Controls aria-label="갤러리 이동 버튼">
              <S.ArrowButton
                type="button"
                aria-label="이전 사진"
                onClick={() => moveGallery(-1)}
                disabled={!controls.canPrev}
              >
                ←
              </S.ArrowButton>
              <S.ArrowButton
                type="button"
                aria-label="다음 사진"
                onClick={() => moveGallery(1)}
                disabled={!controls.canNext}
              >
                →
              </S.ArrowButton>
            </S.Controls>
          </S.HeadingRow>
        </S.Heading>

        {status === "loading" ? (
          // 이미지가 도착하기 전에는 높이를 확보하여 페이지가 출렁이지 않게 한다.
          <S.StatusMessage role="status">GALLERY LOADING...</S.StatusMessage>
        ) : status === "error" ? (
          <S.StatusMessage role="status">
            갤러리를 불러오지 못했어요.
            <S.RetryButton
              type="button"
              onClick={() => {
                setStatus("loading");
                setRequestKey((old) => old + 1);
              }}
            >
              다시 시도 ↗
            </S.RetryButton>
          </S.StatusMessage>
        ) : items.length === 0 ? (
          <S.StatusMessage role="status">
            현재 공개된 갤러리 사진이 없습니다.
          </S.StatusMessage>
        ) : (
          <>
            <S.GalleryViewport
              ref={viewportRef}
              aria-label="등록된 셀피 사진 갤러리"
              tabIndex={0}
            >
              {items.map((item, index) => (
                <S.CardSlot key={item.id} data-selfie-card>
                  <S.CardMotion data-selfie-motion>
                    <S.PhotoButton
                      type="button"
                      onClick={() => openPhoto(item)}
                      aria-label={`${index + 1}번 이미지 크게 보기`}
                    >
                      <S.PhotoFrame>
                        <Image
                          src={item.imageUrl}
                          alt={`갤러리 사진 ${index + 1}`}
                          fill
                          sizes="(max-width: 640px) 78vw, (max-width: 1080px) 44vw, 29vw"
                          style={{ objectFit: "cover" }}
                        />
                        <S.PhotoIndex>
                          {String(index + 1).padStart(2, "0")}
                        </S.PhotoIndex>
                        <S.ZoomSymbol aria-hidden="true">↗</S.ZoomSymbol>
                      </S.PhotoFrame>
                    </S.PhotoButton>
                    <S.CardCaption>
                      <S.CardCaptionTitle>AHN'S MOMENTS</S.CardCaptionTitle>
                      <S.Stats>
                        <span>♡ {numberFormatter.format(item.likes)}</span>
                        <span>VIEW {numberFormatter.format(item.views)}</span>
                      </S.Stats>
                    </S.CardCaption>
                  </S.CardMotion>
                </S.CardSlot>
              ))}
            </S.GalleryViewport>

            <S.GalleryFooter>
              <S.FooterMessage>THE BEAUTY OF BEING YOU.</S.FooterMessage>
              <S.ProgressArea>
                <S.ProgressTrack>
                  <S.ProgressFill
                    style={{
                      // 총 카드 수와 현재 위치를 이용하여 진행률을 표시한다.
                      width: `${Math.min(100, ((controls.index + 1) / items.length) * 100)}%`,
                    }}
                  />
                </S.ProgressTrack>
                <S.ProgressText>
                  {String(Math.min(controls.index + 1, items.length)).padStart(
                    2,
                    "0",
                  )}
                  <span> / {String(items.length).padStart(2, "0")}</span>
                </S.ProgressText>
              </S.ProgressArea>
            </S.GalleryFooter>
          </>
        )}
      </S.Inner>

      {selected &&
        createPortal(
          <S.Lightbox
            role="dialog"
            aria-modal="true"
            aria-label="선택한 갤러리 사진 확대 보기"
            onMouseDown={(event) => {
              // 이미지를 누르면 닫히지 않고, 어두운 바깥 배경을 누를 때만 닫힌다.
              if (event.target === event.currentTarget) setSelected(null);
            }}
          >
            <S.ModalInner>
              <S.ModalImage>
                <Image
                  src={selected.imageUrl}
                  alt="선택한 갤러리 사진 확대"
                  fill
                  sizes="(max-width: 768px) 94vw, 70vw"
                  style={{ objectFit: "contain" }}
                />
              </S.ModalImage>
              <S.ModalFooter>
                <span>AHN'S MOMENTS</span>
                <span>♡ {numberFormatter.format(selected.likes)}</span>
              </S.ModalFooter>
              <S.CloseButton
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelected(null)}
                aria-label="확대 이미지 닫기"
              >
                ✕
              </S.CloseButton>
            </S.ModalInner>
          </S.Lightbox>,
          // 모달을 document.body 아래에 배치한다.
          // 부모 Section의 overflow:hidden / z-index 영향으로 잘리는 문제를 피한다.
          document.body,
        )}
    </S.Section>
  );
}
