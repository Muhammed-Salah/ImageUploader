import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/display",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
