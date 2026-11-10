"use client";

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import HospitalMap from './HospitalMap';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // 관리자 페이지에서는 Lenis 실행하지 않음
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Lenis 스크롤과 ScrollTrigger 동기화
    lenis.on("scroll", ScrollTrigger.update);

    // ticker 함수를 변수로 저장
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      // 등록한 함수와 동일한 참조로 제거
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
