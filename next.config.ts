import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    // Fixes the "absolute path" warning in Vercel/iad1 logs
    root: path.resolve(__dirname),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
    // Updated name for Next.js 16 Proxy architecture
    proxyClientMaxBodySize: '50mb',
  },
};

export default nextConfig;