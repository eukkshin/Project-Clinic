"use client";

import { createGlobalStyle } from "styled-components";

import { color, motion } from "@/styles/tokens";

export const GlobalStyle = createGlobalStyle`
:root {
  --ahns-display: var(--font-cormorant), "Cormorant Garamond", Georgia, serif;
  --ahns-body: "Pretendard Variable", Pretendard, -apple-system,
    BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
  --color-brand: ${color.brand.primary};
  --color-ink: ${color.brand.ink};
  --color-cream: ${color.canvas.cream};
}

html.lenis, html.lenis body {
  height: auto !important; 
}

.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis-smooth [data-lenis-prevent] {
  scroll-behavior: contain;
}

body, button, input, textarea, select {
  font-family: var(--ahns-body);
}

body { 
  -webkit-font-smoothing: antialiased; 
  -moz-osx-font-smoothing: grayscale;
}

:focus-visible { outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  html:focus-within { scroll-behavior: auto !important; }
}

html, body {
    margin: 0;
    padding: 0;
    width: 100%;
}

*, *::before, *::after {
    box-sizing: border-box;
}

a {
    text-decoration: none;
    color: inherit;
}

ul, ol, li {
    list-style: none;
    margin: 0;
    padding: 0;
}

::selection {
    background-color: ${color.brand.primary};
    color: ${color.canvas.cream};
}
  
html {
    color-scheme: light;
}

html, body {
    scrollbar-width: thin;
    scrollbar-color: ${color.brand.primary} ${color.canvas.cream};
}

html::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

html::-webkit-scrollbar-track {
    background-color: ${color.canvas.cream} !important;
}

html::-webkit-scrollbar-thumb {
    background-color: ${color.brand.primary} !important;
    border-radius: 10px;
    border: 2px solid ${color.canvas.cream};
    background-clip: padding-box;
    transition: background-color ${motion.fast};
}

html::-webkit-scrollbar-thumb:hover {
    background-color: ${color.brand.ink} !important;
}
`;
