import "bootstrap/dist/css/bootstrap.min.css";

import { Cormorant_Garamond } from "next/font/google";
import { GlobalStyle } from "@/assets/css/GlobalStyle";
import ConditionalLayout from "@/components/ConditionalLayout";
import StyledComponentsRegistry from "@/lib/registry";
import QueryProvider from "@/components/provider/QueryProvider";
import { ToastProvider } from "@/ui/feedback/toast/ToastContext";

// 영문 디스플레이: Next.js가 Google Font를 빌드 시 내려받아 자체 호스팅한다.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: "variable",
  style: ["normal", "italic"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" data-scroll-behavior="smooth" className={cormorant.variable}>
      <head>
        {/* Pretendard Variable: 공식 동적 서브셋 CSS. 한글만 필요한 글리프를 내려받는다. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <StyledComponentsRegistry>
          <GlobalStyle />
          <QueryProvider>
            <ToastProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </ToastProvider>
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
