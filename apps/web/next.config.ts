import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@orby/ui', '@orby/types'],
};

export default nextConfig;
