import { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals = [...(config.externals || []), { bufferutil: 'bufferutil', 'utf-8-validate': 'utf-8-validate' }];
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
