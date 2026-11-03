"use client";

import { createGlobalStyle } from 'styled-components';

/** Prevent only PAGE-level horizontal overflow. Local horizontal galleries remain scrollable. */
const HomeOverflowStyle = createGlobalStyle`
  html, body {
    max-width: 100%;
    overflow-x: clip;
  }
`;

export default function HomeOverflowGuard() {
  return <HomeOverflowStyle />;
}
