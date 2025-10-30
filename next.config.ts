import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['laravelnews.s3.amazonaws.com'],
  },
  // Force Prisma to be treated as external package
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/engines'],
  },
};

export default nextConfig;