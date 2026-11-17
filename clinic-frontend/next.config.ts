import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isStaticExport = process.env.AHNS_PRESENTATION_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport && {
    output: "export",
    basePath: "/group/three/1",
    trailingSlash: true,
  }),

  compiler: {
    styledComponents: true,
  },

  images: {
    unoptimized: isStaticExport,
    dangerouslyAllowLocalIP: !isStaticExport,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/images/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
