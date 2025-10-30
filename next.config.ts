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
  serverExternalPackages: ['@prisma/client', '@prisma/engines'],
  turbopack: {},
};

export default nextConfig;