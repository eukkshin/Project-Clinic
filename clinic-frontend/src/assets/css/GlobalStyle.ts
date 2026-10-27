"use client";

import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
:root {
  --ahns-display: var(--font-cormorant), "Cormorant Garamond", Georgia, serif;
  --ahns-body: "Pretendard Variable", Pretendard, -apple-system,
    BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
}
body, button, input, textarea, select {
  font-family: var(--ahns-body);
}
body { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
:focus-visible { outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) {
  html:focus-within { scroll-behavior: auto !important; }
}

html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}

*, *::before, *::after {
    box-sizing: border-box;
}
a{
    text-decoration: none;
    color: inherit;
}

ul, ol, li {
    list-style: none;
    margin: 0;
    padding: 0;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  }

::selection {
    background-color: #69826B;
    color: #F5F2E9;
  }
  
   html {
    color-scheme: light;
  }

  html, body {
    scrollbar-width: thin;
    scrollbar-color: #69826B #F5F2E9;
  }

  html::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  html::-webkit-scrollbar-track {
    background-color: #F5F2E9 !important;
  }

  html::-webkit-scrollbar-thumb {
    background-color: #69826B !important;
    border-radius: 10px;
    border: 2px solid #F5F2E9;
    background-clip: padding-box;
    transition: background-color 0.15s ease-in-out;
  }

  html::-webkit-scrollbar-thumb:hover {
    background-color: #244535 !important;
  }

`;
