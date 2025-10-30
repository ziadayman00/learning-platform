import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['laravelnews.s3.amazonaws.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/engines'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client',
        '@prisma/engines': 'commonjs @prisma/engines',
      });
      
      // Copy Prisma engines
      config.plugins = config.plugins || [];
      config.plugins.push(
        require('copy-webpack-plugin')({
          patterns: [
            {
              from: 'node_modules/.prisma/client/*.node',
              to: './',
              flatten: true,
              noErrorOnMissing: true,
            },
          ],
        })
      );
    }
    return config;
  },
};

export default nextConfig;