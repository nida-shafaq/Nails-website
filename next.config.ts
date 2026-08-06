import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",  // Cloudflare Images
      },
      {
        protocol: "https",
        hostname: "pub-*.r2.dev",       // Cloudflare R2 public buckets
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Dev placeholder images
      },
      {
        protocol: "https",
        hostname: "placehold.co", // Dynamic placeholder images
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Allow Cloudflare Workers as backend origin in dev
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination:
          process.env.NODE_ENV === "development" || !process.env.API_URL
            ? "http://localhost:8787/api/v1/:path*"
            : `${process.env.API_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
