import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // O Sanity Studio do site antigo deixa de existir; pode ter sido crawleado.
      { source: "/studio/:path*", destination: "/pt", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
