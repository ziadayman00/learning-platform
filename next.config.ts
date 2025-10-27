import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['laravelnews.s3.amazonaws.com'], // هنا تحط أي دومين هتجيب منه صور
  },
};

export default nextConfig;
