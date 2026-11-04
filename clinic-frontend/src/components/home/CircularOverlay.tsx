"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import * as S from "@/components/home/CircularOverlay.styles";
import { loadCommunity } from "@/lib/community/client";

import type { AppLocale } from "@/i18n/config";

// GSAP 기본 패키지에는 스크롤 감지 기능이 없다.

// ScrollTrigger를 등록해야 pin, start, end 같은 옵션을 사용할 수 있다.

gsap.registerPlugin(ScrollTrigger);

/** 공개 콘텐츠 API의 데이터만 사용합니다. 관리자 API는 호출하지 않습니다. */
interface EventData {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
}

const priceInquiry: Record<AppLocale, string> = {
  ko: "가격 문의",
  en: "Price on request",
  ja: "価格はお問い合わせください",
  "zh-CN": "价格请咨询",
  "zh-TW": "價格請洽詢",
};

/** 가격 원문은 번역하지 않으며, 비어 있는 경우 안내 문구만 현지화합니다. */
function formatPrice(value: string, locale: AppLocale): string {
  return value.trim() || priceInquiry[locale];
}

/**

 * Ahn's 이벤트 섹션

 *

 * 화면 구성

 * ┌─────────────────┬────────────────────────────┐

 * │ 왼쪽 제목(pin)   │ 오른쪽 첫 번째 대표 이벤트  │

 * │ The Most        │ 그 아래 작은 이벤트 카드들  │

 * │ Wanted.         │                            │

 * └─────────────────┴────────────────────────────┘

 *

 * 주의: 섹션 전체에 pin을 사용하지 않는다.

 * 왼쪽 제목만 고정하고, 오른쪽 카드는 일반적인 세로 스크롤로 이동한다.

 */

/**
 * GSAP ScrollTrigger의 pin은 DOM에 pin-spacer를 추가하고 요소 위치를 바꾼다.
 * 일반 useEffect의 정리는 React가 DOM을 삭제한 뒤에 실행될 수 있다.
 * 브라우저에서는 useLayoutEffect의 정리 단계에서 먼저 pin을 되돌린다.
 * 서버에서는 useEffect를 사용하여 SSR 경고를 피한다.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function EventRanking() {
  const tHome = useTranslations("Home");
  const locale = useLocale() as AppLocale;
  const sectionRef = useRef<HTMLElement | null>(null);

  const headingRef = useRef<HTMLDivElement | null>(null);

  const [events, setEvents] = useState<EventData[]>([]);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  /**
   * 이벤트/커뮤니티에서 공통으로 쓰는 공개 다국어 API를 사용합니다.
   * 선택 언어가 바뀔 때마다 재조회하고, 이전 요청은 취소합니다.
   */
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErrorMessage("");
    setEvents([]);

    const fetchEvents = async () => {
      try {
        const result = await loadCommunity("events", controller.signal, locale);
        if (!result.connected) {
          throw new Error("이벤트 공개 API가 연결되지 않았습니다.");
        }
        const formatted: EventData[] = result.entries
          .filter((item) => item.image !== null && item.title.trim().length > 0)
          .map((item) => ({
            id: item.id,
            title: item.title.trim(),
            price: formatPrice(item.price, locale),
            imageUrl: item.image!,
          }));

        if (controller.signal.aborted) return;
        setEvents(formatted);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("이벤트 데이터 로드 실패:", error);
        setEvents([]);
        setErrorMessage("이벤트 정보를 불러오지 못했습니다.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void fetchEvents();
    return () => controller.abort();
  }, [locale]);

  /**

   * 2단계: DB 카드가 렌더링된 다음 GSAP 등록

   *

   * 이 코드가 loading을 기다리는 이유:

   * API를 기다리는 동안은 오른쪽 카드 높이가 짧아 섹션 전체 높이가 다르다.

   * 먼저 pin을 만들면 끝나는 위치가 잘못 계산될 수 있다.

   *

   * 왼쪽 pin은 데스크톱에서만 작동한다.

   * 모바일이나 움직임 감소 설정에서는 세로로 쌓인 기본 화면을 유지한다.

   */

  useIsomorphicLayoutEffect(() => {
    if (loading || !sectionRef.current || !headingRef.current) return;

    const section = sectionRef.current;

    const heading = headingRef.current;

    const media = gsap.matchMedia();

    let frameId = 0;

    // matchMedia는 조건에 맞을 때만 내부 GSAP 코드를 실행하고,

    // 조건이 바뀌면 등록했던 ScrollTrigger를 자동으로 정리해 준다.

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const cards = Array.from(
          section.querySelectorAll<HTMLElement>("[data-event-card]"),
        );

        // 카드 이미지의 등장 효과는 pin과 무관하게 모든 화면에서 사용한다.

        // 애니메이션은 현재 섹션 내부 카드에만 적용된다.

        cards.forEach((card, index) => {
          gsap.fromTo(
            card,

            { y: index === 0 ? 35 : 55, opacity: 0 },

            {
              y: 0,

              opacity: 1,

              duration: 0.95,

              ease: "power2.out",

              scrollTrigger: {
                trigger: card,

                start: "top 92%",

                once: true,
              },
            },
          );
        });
      }, section);

      return () => ctx.revert();
    });

    media.add(
      "(min-width: 1025px) and (prefers-reduced-motion: no-preference)",

      () => {
        const ctx = gsap.context(() => {
          // 섹션이 너무 짧거나 왼쪽 제목이 화면보다 높을 때는 고정하지 않는다.

          // 데이터 1개만 있을 때 불필요하게 스크롤이 멈추는 것도 예방한다.

          const topOffset = 110;

          const canPin =
            events.length >= 2 &&
            section.offsetHeight > window.innerHeight + 80 &&
            heading.offsetHeight + topOffset + 30 < window.innerHeight;

          if (!canPin) return;

          ScrollTrigger.create({
            // 제목의 맨 위가 화면 상단에서 110px 떨어진 위치에 닿으면 고정 시작.

            trigger: heading,

            start: `top top+=${topOffset}`,

            // 섹션의 끝에 도달하면 제목 고정을 해제한다.

            // pin을 포함한 스크롤 전체가 아닌, 이 섹션만 endTrigger로 지정한다.

            endTrigger: section,

            end: "bottom bottom",

            // 이미지 영역이나 섹션 전체가 아닌 왼쪽 제목 요소만 고정한다.

            pin: heading,

            // 오른쪽 카드가 세로 길이를 결정하므로 추가 빈 공간을 만들지 않는다.

            pinSpacing: false,

            invalidateOnRefresh: true,

            anticipatePin: 1,

            // 앞쪽 Hero/CategoryNav가 스크롤 길이를 계산한 뒤 정렬되도록

            // 우선순위를 낮춘다. 실제 전역 위치 갱신은 아래 refresh가 처리한다.

            refreshPriority: -10,
          });
        }, section);

        return () => ctx.revert();
      },
    );

    // DB 이미지 카드 높이 및 앞쪽 pin을 포함한 ScrollTrigger 위치 재계산.

    // requestAnimationFrame을 사용하면 React DOM 반영 이후 실행된다.

    frameId = window.requestAnimationFrame(() => {
      ScrollTrigger.sort();

      ScrollTrigger.refresh();
    });

    // 다음 페이지 이동, 데이터 변경, 모바일 화면 전환 등의 상황에서 정리.

    return () => {
      window.cancelAnimationFrame(frameId);

      media.revert();
    };
  }, [loading, events.length]);

  return (
    <S.Section ref={sectionRef} aria-labelledby="event-section-title">
      <S.Inner>
        <S.Layout>
          {/*

            왼쪽: 소개 문구. LeftColumn 자체는 원래 문서에 남아 있고,

            그 안의 Heading만 ScrollTrigger가 잠시 pin 처리한다.

          */}

          <S.LeftColumn>
            <S.Heading ref={headingRef}>
              <S.HeadingMeta>
                <S.Eyebrow>
                  <S.EyebrowLine aria-hidden="true" />
                  EXCLUSIVE OFFERS
                </S.Eyebrow>

                <S.SectionNumber>03 — EVENTS</S.SectionNumber>
              </S.HeadingMeta>

              <S.Title id="event-section-title" data-editorial-reveal>
                The Most
                <br />
                <em>Wanted.</em>
              </S.Title>

              <S.TitleRule aria-hidden="true" data-editorial-rule />

              <S.Description data-editorial-reveal>
                {tHome("eventIntroLine1")}
                <br />
                {tHome("eventIntroLine2")}
              </S.Description>

              <S.HeadingFoot>
                <S.CountNumber>
                  {String(events.length).padStart(2, "0")}
                </S.CountNumber>

                <S.CountLabel>CURATED EVENTS</S.CountLabel>
              </S.HeadingFoot>
            </S.Heading>
          </S.LeftColumn>

          {/*

            오른쪽: 관리자 DB의 이벤트 카드 목록.

            첫 번째(index===0)는 2열을 전부 차지하고,

            이후 이벤트는 2열의 작은 카드로 배치한다.

          */}

          <S.RightColumn>
            {loading ? (
              <S.Status aria-live="polite">LOADING THE COLLECTION...</S.Status>
            ) : errorMessage ? (
              <S.Status role="alert">{errorMessage}</S.Status>
            ) : events.length === 0 ? (
              <S.Status>{tHome("eventEmpty")}</S.Status>
            ) : (
              <S.EventGrid>
                {events.map((event, index) => (
                  <S.EventCard
                    key={event.id}
                    $featured={index === 0}
                    data-event-card
                  >
                    {/*

                      이벤트 API에 상세 링크가 존재하지 않는다.

                      클릭해도 동작하지 않는 가짜 링크/버튼은 넣지 않았다.

                    */}

                    <S.ImageArea>
                      <Image
                        src={event.imageUrl}
                        alt={`${event.title} 이벤트 이미지`}
                        fill
                        sizes={
                          index === 0
                            ? "(max-width: 1024px) 100vw, 57vw"
                            : "(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 27vw"
                        }
                        style={{ objectFit: "cover" }}
                      />

                      <S.ImageShade aria-hidden="true" />

                      <S.ImageTop>
                        <S.ImageIndex>
                          {String(index + 1).padStart(2, "0")}

                          <span>
                            {" "}
                            / {String(events.length).padStart(2, "0")}
                          </span>
                        </S.ImageIndex>

                        <S.ImageTag>
                          {index === 0 ? "FEATURED EVENT" : "AHN'S EDITION"}
                        </S.ImageTag>
                      </S.ImageTop>

                      <S.ImageBottom>
                        <S.ImageCaption>
                          {index === 0
                            ? "THE FEATURED SELECTION"
                            : "CURATED OFFER"}
                        </S.ImageCaption>

                        <S.ImageTitle>{event.title}</S.ImageTitle>
                      </S.ImageBottom>
                    </S.ImageArea>

                    <S.CardFooter>
                      <S.CardInfo>
                        <S.FooterIndex>
                          EDITION {String(index + 1).padStart(2, "0")}
                        </S.FooterIndex>

                        <S.FooterTitle>{event.title}</S.FooterTitle>
                      </S.CardInfo>

                      <S.Price>{event.price}</S.Price>
                    </S.CardFooter>
                  </S.EventCard>
                ))}
              </S.EventGrid>
            )}
          </S.RightColumn>
        </S.Layout>

        <S.Bottom>
          <span>YOUR BEAUTY, OUR INSPIRATION.</span>

          <span>AHN'S PLASTIC SURGERY</span>
        </S.Bottom>
      </S.Inner>
    </S.Section>
  );
}
