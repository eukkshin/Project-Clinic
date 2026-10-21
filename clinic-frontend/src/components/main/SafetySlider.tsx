"use client";

import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import * as S from "@/assets/css/components/SafetySlider.styles";

/*
 * SafetySlider — AHN'S SAFETY ARCHIVE
 *
 * [기획 의도]
 * 기존의 작은 이미지 카드 슬라이더와 다르게,
 * "왼쪽 대형 사진 + 오른쪽 번호형 목록"으로 안전 콘텐츠를 보여준다.
 *
 * PC: 왼쪽 대형 사진은 CSS position:sticky로 화면에 남아 있고,
 *     오른쪽 목록을 스크롤하면 연결된 대표 사진이 바뀐다.
 * 모바일: 이미지가 화면 위쪽에 남지 않으므로 각 항목 안에 사진을 직접 출력한다.
 *
 * [유지하는 기능]
 * Express GET /api/admin/safety, 관리자 업로드 이미지,
 * TITLE / DESCRIPTION / FILE_NAME / SORT_ORDER 데이터
 *
 * [선택 이유]
 * 이 페이지는 위쪽에서 Hero·CategoryNav·이벤트 섹션이 pin을 쓰고 있다.
 * 여기에서 ScrollTrigger pin을 또 추가하면 스크롤 점프 원인이 될 수 있다.
 * 따라서 실제 위치 고정은 CSS sticky, GSAP은 목록 진입 효과와 이미지 선택만 담당한다.
 */

gsap.registerPlugin(ScrollTrigger);

// 서버의 미디어 파일은 Next public/에 저장하지 않는다.
// Express가 `/images/파일명`으로 실제 이미지를 제공한다.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// 관리자 백엔드가 전달하는 데이터의 원본 컬럼명이다.
interface SafetyApiItem {
  SAFETY_IDX: number;
  TITLE: string;
  DESCRIPTION: string | null;
  FILE_NAME: string;
  SORT_ORDER?: number | null;
  IS_ACTIVE?: string | null;
}

interface SafetyApiResponse {
  success: boolean;
  data: unknown;
}

// UI 컴포넌트에서 읽기 쉬운 데이터 형태로 한 번 변환한다.
interface SafetyItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  order: number | null;
}

type LoadStatus = "loading" | "ready" | "error";

/**
 * TypeScript 인터페이스만 선언했다고 외부 API 응답이 검증되지는 않는다.
 * 실제 실행 도중 필수값이 있는지 검사해, 잘못된 한 항목 때문에
 * 전체 페이지가 중단되는 일을 막는다.
 */
function isSafetyApiItem(value: unknown): value is SafetyApiItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<SafetyApiItem>;

  return (
    typeof item.SAFETY_IDX === "number" &&
    Number.isFinite(item.SAFETY_IDX) &&
    typeof item.TITLE === "string" &&
    item.TITLE.trim().length > 0 &&
    typeof item.FILE_NAME === "string" &&
    item.FILE_NAME.trim().length > 0
  );
}

/**
 * 이 프로젝트의 page.tsx는 `import { SafetySlider } ...`로 가져오므로
 * 반드시 이름 있는 export를 유지한다.
 */
export function SafetySlider() {
  // 1. DB 응답으로 만든 전체 목록
  const [items, setItems] = useState<SafetyItem[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [retryCount, setRetryCount] = useState(0);

  // 2. 현재 대형 이미지로 표시할 항목. 0은 목록의 첫 번째 항목이다.
  const [activeIndex, setActiveIndex] = useState(0);

  // 3. GSAP이 실제 HTML 요소를 찾을 때 사용할 참조.
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  /* ----------------------------------------------------------------------
   * 실행 순서 1: 관리자 API 조회
   * ----------------------------------------------------------------------
   * useEffect(..., [retryCount])는 최초 마운트 때와 다시 시도 버튼을 누를 때 실행된다.
   * 컴포넌트가 없어지면 AbortController가 진행 중인 요청을 취소한다.
   */
  useEffect(() => {
    const controller = new AbortController();

    const fetchSafety = async () => {
      setStatus("loading");

      try {
        const response = await axios.get<SafetyApiResponse>(
          `${API_URL}/api/admin/safety`,
          { signal: controller.signal },
        );

        // 응답에서 data가 배열이 아니면 안전하게 오류 상태로 전환한다.
        if (!response.data.success || !Array.isArray(response.data.data)) {
          throw new Error("안전 콘텐츠 API 응답 형식이 올바르지 않습니다.");
        }

        const formatted: SafetyItem[] = response.data.data
          .filter(isSafetyApiItem)
          // 기존 DB에 IS_ACTIVE 필드가 없어도 작동하게 만든다.
          .filter((item) => item.IS_ACTIVE !== "N")
          .map((item) => ({
            id: item.SAFETY_IDX,
            title: item.TITLE.trim(),
            description:
              typeof item.DESCRIPTION === "string"
                ? item.DESCRIPTION.trim()
                : "",
            imageUrl: `${API_URL}/images/${encodeURIComponent(item.FILE_NAME)}`,
            order:
              typeof item.SORT_ORDER === "number" &&
              Number.isFinite(item.SORT_ORDER)
                ? item.SORT_ORDER
                : null,
          }));

        // 관리자 정렬 번호가 있는 경우 이를 우선 사용한다.
        // 없는 경우 기존 API가 보내 준 순서를 안정적으로 유지한다.
        // backend 응답은 SAFETY_IDX를 우선 정렬할 수 있어 여기서 보정한다.
        const hasAllOrders = formatted.every((item) => item.order !== null);
        if (hasAllOrders) {
          formatted.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }

        if (controller.signal.aborted) return;
        setItems(formatted);
        setActiveIndex(0);
        setStatus("ready");
      } catch (error) {
        // 화면이 사라져 취소된 요청은 네트워크 오류로 표시하지 않는다.
        if (controller.signal.aborted) return;
        console.error("안전 콘텐츠 로드 실패:", error);
        setItems([]);
        setStatus("error");
      }
    };

    void fetchSafety();
    return () => controller.abort();
  }, [retryCount]);

  /* ----------------------------------------------------------------------
   * 실행 순서 2: 데이터가 렌더링되면 GSAP을 등록한다.
   * ----------------------------------------------------------------------
   * GSAP은 위치를 고정하지 않는다. CSS sticky만 사용한다.
   * ScrollTrigger는 진입 애니메이션 및 스크롤 중 활성 이미지 변경에 사용한다.
   */
  useEffect(() => {
    if (status !== "ready" || items.length === 0 || !sectionRef.current) return;

    const section = sectionRef.current;
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      // context는 안쪽에서 만든 트윈/트리거를 섹션에 묶어 한 번에 정리한다.
      const context = gsap.context(() => {
        if (headingRef.current) {
          gsap.fromTo(
            headingRef.current,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: { trigger: section, start: "top 78%", once: true },
            },
          );
        }

        // 진료/이벤트 카드와 달리 목록은 작은 움직임만 준다.
        const rows = Array.from(
          section.querySelectorAll<HTMLElement>("[data-safety-row]"),
        );
        rows.forEach((row) => {
          gsap.fromTo(
            row,
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power2.out",
              scrollTrigger: { trigger: row, start: "top 91%", once: true },
            },
          );
        });
      }, section);

      return () => context.revert();
    });

    media.add(
      "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      () => {
        const context = gsap.context(() => {
          const rows = Array.from(
            section.querySelectorAll<HTMLElement>("[data-safety-row]"),
          );

          // 사용자가 목록을 아래로 읽으면 왼쪽 이미지를 해당 항목으로 전환한다.
          // onEnterBack은 다시 위로 스크롤할 때 반대 방향으로 갱신한다.
          rows.forEach((row, index) => {
            ScrollTrigger.create({
              trigger: row,
              start: "top 58%",
              end: "bottom 58%",
              onEnter: () => setActiveIndex(index),
              onEnterBack: () => setActiveIndex(index),
            });
          });
        }, section);

        return () => context.revert();
      },
    );

    // 데이터가 도착한 후 리스트 높이가 정해지므로 위치를 다시 계산한다.
    // requestAnimationFrame은 브라우저가 React 렌더링 결과를 반영할 기회를 준다.
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(frame);
      media.revert();
    };
  }, [status, items.length]);

  // 현재 선택된 항목의 이미지·제목을 크게 보여 준다.
  // DB 목록 길이가 변했을 때를 대비해 첫 항목을 대체값으로 사용한다.
  const activeItem = items[activeIndex] ?? items[0];

  return (
    <S.Section ref={sectionRef} aria-labelledby="safety-archive-heading">
      <S.Inner>
        <S.Header ref={headingRef}>
          <S.Kicker>
            <span aria-hidden="true" />
            THE AHN'S SAFETY ARCHIVE
          </S.Kicker>
          <S.Title id="safety-archive-heading">
            Care in
            <br />
            <em>Every Detail.</em>
          </S.Title>
          <S.HeaderBottom>
            <S.HeaderDescription>
              아름다움의 완성은 섬세한 과정에서 시작됩니다.
              <br />
              안스성형외과가 전하는 안전에 관한 이야기를 만나보세요.
            </S.HeaderDescription>
            <S.HeaderCounter>05 / OUR STANDARD</S.HeaderCounter>
          </S.HeaderBottom>
        </S.Header>

        {status === "loading" && (
          <S.Status role="status">SAFETY ARCHIVE LOADING...</S.Status>
        )}

        {status === "error" && (
          <S.Status role="alert">
            안전 콘텐츠를 불러오지 못했습니다.
            <S.RetryButton
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
            >
              다시 시도 <span aria-hidden="true">↗</span>
            </S.RetryButton>
          </S.Status>
        )}

        {status === "ready" && items.length === 0 && (
          <S.Status>등록된 안전 콘텐츠가 없습니다.</S.Status>
        )}

        {status === "ready" && items.length > 0 && activeItem && (
          <S.Layout>
            {/*
              왼쪽 대형 사진. PC에서는 CSS position:sticky가 동작한다.
              이미지 변경은 React state(activeIndex)로 처리한다.
            */}
            <S.StageColumn>
              <S.StickyStage>
                <S.StageMedia>
                  {/*
                    key가 바뀌면 React가 기존 사진을 제거하고 새 사진을 렌더링한다.
                    CSS에서 stageReveal 애니메이션을 적용하므로 전환이 은은하게 보인다.
                    next/image를 사용하므로 next.config.ts에 localhost:4000 remotePatterns가 필요할 수 있다.
                  */}
                  <S.StagePicture key={activeItem.id}>
                    <Image
                      src={activeItem.imageUrl}
                      alt={activeItem.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 54vw"
                      style={{ objectFit: "cover" }}
                    />
                  </S.StagePicture>
                  <S.StageShade />
                  <S.PhotoTop>
                    <span>AHN'S / SAFETY</span>
                    <span>
                      {String(activeIndex + 1).padStart(2, "0")} —{" "}
                      {String(items.length).padStart(2, "0")}
                    </span>
                  </S.PhotoTop>
                  <S.PhotoBottom>
                    <S.PhotoMicrocopy>OUR COMMITMENT</S.PhotoMicrocopy>
                    <S.PhotoTitle>{activeItem.title}</S.PhotoTitle>
                  </S.PhotoBottom>
                </S.StageMedia>
                <S.PhotoFootnote>
                  <span>BEAUTY IS MORE THAN WHAT YOU SEE.</span>
                  <span>AHN'S PLASTIC SURGERY</span>
                </S.PhotoFootnote>
              </S.StickyStage>
            </S.StageColumn>

            {/*
              오른쪽에는 관리자가 등록한 안전 콘텐츠를 실제 순서대로 표시한다.
              각 항목은 button이므로 마우스뿐 아니라 키보드로도 선택할 수 있다.
            */}
            <S.ContentColumn>
              <S.ListLabel>
                <span>OUR SAFETY PRINCIPLES</span>
                <span>{String(items.length).padStart(2, "0")} STORIES</span>
              </S.ListLabel>

              <S.List>
                {items.map((item, index) => (
                  <S.ListItem key={item.id} data-safety-row>
                    {/* 모바일에서는 sticky 사진이 멀리 있으므로 각 항목 안에 이미지를 보여 준다. */}
                    <S.MobilePicture>
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 600px) 100vw, 75vw"
                        style={{ objectFit: "cover" }}
                      />
                    </S.MobilePicture>

                    <S.ItemButton
                      type="button"
                      $active={activeIndex === index}
                      onClick={() => setActiveIndex(index)}
                      aria-pressed={activeIndex === index}
                      aria-label={`${String(index + 1).padStart(2, "0")}번 ${item.title} 이미지 보기`}
                    >
                      <S.ItemIndex>
                        {String(index + 1).padStart(2, "0")}
                      </S.ItemIndex>
                      <S.ItemBody>
                        <S.ItemTitle>{item.title}</S.ItemTitle>
                        {item.description && (
                          <S.ItemDescription>
                            {item.description}
                          </S.ItemDescription>
                        )}
                      </S.ItemBody>
                      <S.ItemArrow aria-hidden="true">↗</S.ItemArrow>
                    </S.ItemButton>
                  </S.ListItem>
                ))}
              </S.List>

              <S.Endmark>
                <span aria-hidden="true">✦</span>
                EVERY DETAIL MATTERS.
              </S.Endmark>
            </S.ContentColumn>
          </S.Layout>
        )}

        <S.Footer>
          <span>AHN'S PLASTIC SURGERY</span>
          <span>EXCELLENCE THROUGH CARE.</span>
        </S.Footer>
      </S.Inner>
    </S.Section>
  );
}
