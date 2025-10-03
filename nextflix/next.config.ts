import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
    qualities: [16, 32, 48, 64, 75, 90, 96, 100],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
