import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.kevinadiwiguna.dev",
      },
      {
        protocol: "https",
        hostname: "**.cloudflare.com",
      }
    ],
  },
};

export default nextConfig;
