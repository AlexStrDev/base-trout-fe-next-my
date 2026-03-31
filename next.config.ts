import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  // experimental: {
  //   ppr: 'incremental', // Enable when on Next.js canary
  // },
};

export default nextConfig;
