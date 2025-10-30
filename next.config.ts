import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'laravelnews.s3.amazonaws.com',
      },
    ],
  },
  // Updated for Next.js 16
  serverExternalPackages: ['@prisma/client', '@prisma/engines'],
  // Add empty turbopack config to suppress warning
  turbopack: {},
};

export default nextConfig;