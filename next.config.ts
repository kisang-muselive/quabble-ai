import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    // Log during build to help debug
    if (process.env.NODE_ENV !== "production" || process.env.VERCEL) {
      console.log("🔸 Build-time API_URL:", API_URL);
      console.log("🔸 NEXT_PUBLIC_API_URL env var:", process.env.NEXT_PUBLIC_API_URL || "NOT SET");
    }

    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
      {
        source: "/wapi/:path*",
        destination: `${API_URL}/wapi/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-1-27.clubmuse.live",
      },
      {
        protocol: "https",
        hostname: "prod-canary-1-27.muse.live",
      },
    ],
  },
};

export default nextConfig;
