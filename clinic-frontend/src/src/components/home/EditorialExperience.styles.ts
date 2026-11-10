import styled, { createGlobalStyle } from "styled-components";

/* Spotlight changes the paint of card/link overlays; never the GSAP-controlled
   Track/Section transforms. Animations stop when reduced-motion is requested. */
export const EditorialEffects = createGlobalStyle`
  [data-editorial-spotlight] { --editorial-x: 50%; --editorial-y: 50%; }
  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    [data-editorial-spotlight] { position: relative; }
    [data-editorial-spotlight]::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 5;
      pointer-events: none;
      background: radial-gradient(circle 270px at var(--editorial-x) var(--editorial-y),
        rgba(255,255,255,.18), rgba(255,255,255,.055) 42%, transparent 77%);
      opacity: 0;
      transition: opacity .45s ease;
    }
    [data-editorial-spotlight]:hover::after,
    [data-editorial-spotlight]:focus-visible::after { opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    [data-editorial-spotlight]::after { display: none !important; }
  }
`;

export const PageProgress = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  pointer-events: none;
  z-index: 10000;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  width: 100%;
  height: 100%;
  transform: scaleX(0);
  transform-origin: left center;
  background: linear-gradient(90deg, #cad9bb, #6f9778, #244535);
  box-shadow: 0 0 14px rgba(130, 173, 137, .5);
  will-change: transform;
`;
