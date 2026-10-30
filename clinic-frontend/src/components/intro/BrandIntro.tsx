"use client";

import gsap from 'gsap';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import HangulTyping from '@/components/ui/TypingText';

import * as S from './BrandIntro.styles';

const TAGLINE = "가장 당신다운 아름다움을 위하여";
// 기존 HangulTyping이 글자 조합을 담당한다. 새 타이핑 로직을 만들지 않는다.
const TYPE_SPEED = 35;
const EXIT_AT = 2.3;

type BrandIntroProps = {
  /** 기존 V4 app/page.tsx의 서버 유입 경로 판별 결과를 그대로 사용한다. */
  shouldPlay: boolean;
};

export default function BrandIntro({ shouldPlay }: BrandIntroProps) {
  // SSR 첫 페인트에서도 불투명한 배경이 즉시 렌더되도록 초기값에 props 사용.
  const [visible, setVisible] = useState(shouldPlay);
  const [typingStarted, setTypingStarted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const exitTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const exitingRef = useRef(false);

  const finish = useCallback(() => {
    setVisible(false);
    // React 커밋/브라우저 페인트가 끝난 뒤 무거운 메인 스크롤 효과 시작.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("ahns:intro-finished"));
      });
    });
  }, []);

  const exit = useCallback(
    (quick = false) => {
      if (exitingRef.current) return;
      exitingRef.current = true;
      introTimelineRef.current?.kill();

      const root = rootRef.current;
      const wash = washRef.current;
      if (!root || !wash) {
        finish();
        return;
      }

      const k = quick ? 0.45 : 1;
      const tl = gsap.timeline({ onComplete: finish });
      exitTimelineRef.current = tl;

      // Soft Light Dissolve: filter, blur, clip-path, width, left 등의
      // 큰 레이아웃·페인트 비용을 만드는 속성은 애니메이션하지 않는다.
      tl.to(
        [
          brandRef.current,
          eyebrowRef.current,
          titleRef.current,
          lineRef.current,
          typingRef.current,
          galleryRef.current,
          footerRef.current,
          skipRef.current,
        ].filter(Boolean),
        { opacity: 0, y: -4, duration: 0.25 * k, ease: "power1.inOut" },
        0,
      );
      // 최대 0.22의 밝은 레이어로 은은한 빛만 연출 (전면 백색 화면 X).
      tl.to(
        wash,
        { opacity: 0.22, duration: 0.33 * k, ease: "sine.out" },
        0.05 * k,
      );
      tl.to(
        root,
        { opacity: 0, duration: 0.72 * k, ease: "sine.inOut" },
        0.12 * k,
      );
      tl.to(
        wash,
        { opacity: 0, duration: 0.42 * k, ease: "sine.inOut" },
        0.48 * k,
      );
    },
    [finish],
  );

  useEffect(() => {
    if (!visible) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    // 서버의 외부 링크 판별이 애매한 브라우저에서 재로딩/뒤로가기는 건너뛴다.
    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navigation?.type === "reload" || navigation?.type === "back_forward") {
      finish();
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    const beforeHtmlOverflow = html.style.overflow;
    const beforeBodyOverflow = body.style.overflow;
    const focusedBefore = document.activeElement;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });

    const intro = gsap.timeline({ defaults: { ease: "power2.out" } });
    introTimelineRef.current = intro;
    intro.fromTo(
      brandRef.current,
      { opacity: 0, y: -6 },
      { opacity: 1, y: 0, duration: 0.4 },
      0.06,
    );
    intro.fromTo(
      eyebrowRef.current,
      { opacity: 0, y: 7 },
      { opacity: 1, y: 0, duration: 0.38 },
      0.18,
    );
    intro.fromTo(
      titleRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.25,
    );
    intro.fromTo(
      galleryRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.27,
    );
    intro.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.48 },
      0.56,
    );
    intro.fromTo(
      typingRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2 },
      0.69,
    );
    intro.fromTo(
      footerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      0.6,
    );
    intro.call(() => setTypingStarted(true), [], 0.73);
    intro.call(() => exit(), [], EXIT_AT);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") exit(true);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      intro.kill();
      exitTimelineRef.current?.kill();
      window.removeEventListener("keydown", onKeyDown);
      html.style.overflow = beforeHtmlOverflow;
      body.style.overflow = beforeBodyOverflow;
      if (focusedBefore instanceof HTMLElement && focusedBefore.isConnected) {
        focusedBefore.focus({ preventScroll: true });
      }
    };
  }, [visible, exit, finish]);

  if (!visible) return null;

  return (
    <>
      <S.Overlay
        ref={rootRef}
        id="ahns-brand-intro"
        role="dialog"
        aria-modal="true"
        aria-label="AHNS 브랜드 인트로"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2147483000,
          width: "100%",
          height: "100dvh",
          overflow: "hidden",
          opacity: 1,
          background: "#F6F3ED",
        }}
      >
        <S.LeftPane>
          <S.Header ref={brandRef}>
            <S.Logotype>
              AHNS<span>.</span>
            </S.Logotype>
            <S.HeaderMeta>
              PRIVATE AESTHETIC
              <br />
              SEOUL, KOREA
            </S.HeaderMeta>
          </S.Header>
          <S.MainCopy>
            <S.Eyebrow ref={eyebrowRef}>
              THE AHNS PHILOSOPHY <span>— 01</span>
            </S.Eyebrow>
            <S.Title ref={titleRef}>
              The art of
              <br />
              <em>being you.</em>
            </S.Title>
            <S.Hairline ref={lineRef} />
            <S.KoreanLine ref={typingRef}>
              {typingStarted && (
                <HangulTyping text={TAGLINE} speed={TYPE_SPEED} />
              )}
            </S.KoreanLine>
          </S.MainCopy>
          <S.Footer ref={footerRef}>
            <S.FooterRule />
            <S.FooterText>CRAFTED WITH INTENTION</S.FooterText>
            <S.FooterNo>EST. SEOUL</S.FooterNo>
          </S.Footer>
        </S.LeftPane>

        <S.RightPane aria-hidden="true">
          <S.GalleryFrame ref={galleryRef}>
            <S.GalleryScene>
              <Image
                src="/images/ahns-intro-architecture.webp"
                alt=""
                fill
                sizes="(max-width: 700px) 0px, 43vw"
                quality={90}
                priority
                className="ahns-intro-architecture-image"
              />
              <S.GalleryTexture />
            </S.GalleryScene>
            <S.GalleryTop>AHNS / A SPACE TO BE YOURSELF</S.GalleryTop>
            <S.GalleryCaption>
              <span>01 / FORM &amp; SPACE</span>
              <em>Quietly, refined.</em>
            </S.GalleryCaption>
          </S.GalleryFrame>
        </S.RightPane>

        <S.Skip ref={skipRef} type="button" onClick={() => exit(true)}>
          SKIP <span aria-hidden="true">↗</span>
        </S.Skip>
      </S.Overlay>
      <S.LightWash ref={washRef} aria-hidden="true" />
    </>
  );
}
