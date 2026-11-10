import "bootstrap/dist/css/bootstrap.min.css";

import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Cormorant_Garamond } from "next/font/google";

import ConditionalLayout from "@/components/layout/ConditionalLayout";
import SmoothScroll from "@/components/layout/SmoothScroll";
import QueryProvider from "@/components/provider/QueryProvider";
import StyledComponentsRegistry from "@/lib/registry";
import { getSiteOrigin } from "@/lib/seo/publicMetadata";
import { GlobalStyle } from "@/styles/global";
import { ToastProvider } from "@/ui/feedback/toast/ToastContext";

import type { Metadata } from "next";
// 영문 디스플레이: Next.js가 Google Font를 빌드 시 내려받아 자체 호스팅한다.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: "variable",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  ...(getSiteOrigin() ? { metadataBase: new URL(getSiteOrigin()!) } : {}),
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      data-scroll-behavior="auto"
      className={cormorant.variable}
    >
      <head>
        {/* Pretendard Variable: 공식 동적 서브셋 CSS. 한글만 필요한 글리프를 내려받는다. */}
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/sun-typeface/SUITE@2/fonts/variable/woff2/SUITE-Variable.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <StyledComponentsRegistry>
            <GlobalStyle />
            <QueryProvider>
              <ToastProvider>
                <ConditionalLayout>
                  <SmoothScroll>{children}</SmoothScroll>
                </ConditionalLayout>
              </ToastProvider>
            </QueryProvider>
          </StyledComponentsRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
