import type { NextConfig } from "next";

const FTP_DOMAIN = process.env.FTP_DOMAIN as string;

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: FTP_DOMAIN,
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
