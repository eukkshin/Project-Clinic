"use client";

import {
  EditorialEffects,
  PageProgress,
  ProgressFill,
} from "@/components/home/EditorialExperience.styles";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Public homepage editorial detail animations.
 * Existing Hero/Category/Event pin timelines are untouched. This only animates
 * labelled child text/decor and renders a non-interactive scroll progress line.
 */
export default function EditorialExperience() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = progressRef.current;
    if (!line) return;
    let frame = 0;
    const measure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const scrollable = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        line.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / scrollable))})`;
      });
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = document.querySelector<HTMLElement>("[data-editorial-home]");
    if (!canvas) return;
    const animations: gsap.core.Tween[] = [];
    const registered = new WeakSet<Element>();
    let frame = 0;
    const register = () => {
      canvas
        .querySelectorAll<HTMLElement>(
          "[data-editorial-reveal], [data-editorial-rule]",
        )
        .forEach((element) => {
          if (registered.has(element)) return;
          registered.add(element);
          const isRule = element.hasAttribute("data-editorial-rule");
          animations.push(
            gsap.fromTo(
              element,
              isRule
                ? { scaleX: 0, transformOrigin: "left center" }
                : { opacity: 0, y: 23, filter: "blur(4px)" },
              isRule
                ? {
                    scaleX: 1,
                    duration: 1.25,
                    ease: "power3.out",
                    scrollTrigger: {
                      trigger: element,
                      start: "top 92%",
                      once: true,
                    },
                  }
                : {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 1.05,
                    ease: "power3.out",
                    scrollTrigger: {
                      trigger: element,
                      start: "top 89%",
                      once: true,
                    },
                  },
            ),
          );
        });
    };
    register();
    // API-loaded content can mount after the first render. Observe child additions
    // only (not GSAP's frame-by-frame style attribute updates).
    const observer = new MutationObserver(() => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(register);
    });
    observer.observe(canvas, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.kill());
    };
  }, []);

  useEffect(() => {
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const canvas = document.querySelector<HTMLElement>("[data-editorial-home]");
    if (!canvas) return;
    let frame = 0;
    const track = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const card = target.closest<HTMLElement>("[data-editorial-spotlight]");
      if (!card) return;
      const x = event.clientX;
      const y = event.clientY;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--editorial-x", `${x - rect.left}px`);
        card.style.setProperty("--editorial-y", `${y - rect.top}px`);
      });
    };
    canvas.addEventListener("pointermove", track, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove", track);
    };
  }, []);

  return (
    <>
      <EditorialEffects />
      <PageProgress aria-hidden="true">
        <ProgressFill ref={progressRef} />
      </PageProgress>
    </>
  );
}
