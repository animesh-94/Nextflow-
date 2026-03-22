import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack is stable in v16, move it to the top level
  turbopack: {
    root: path.resolve(__dirname), // Fixes the absolute path warning
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
    // Updated name for the Proxy convention
    proxyClientMaxBodySize: '50mb',
  },
};

export default nextConfig;