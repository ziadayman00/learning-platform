import { NextConfig } from 'next';
import path from 'path';

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
  // Force include Prisma engine binaries in serverless functions
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/.prisma/client/**/*'],
      '/**': ['./node_modules/.prisma/client/**/*'],
    },
  },
};

export default nextConfig;