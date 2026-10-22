import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    styledComponents: true,
  },
  turbopack: {
    root: './', // 또는 실제 프로젝트 루트 경로 지정
  },
};

export default nextConfig;
