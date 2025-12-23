import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow larger headers for Clerk authentication
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Image domains for external images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
  },
};

export default nextConfig;
