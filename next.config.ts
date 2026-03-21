/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Force the root to be the current directory
    root: '.',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
    // Fix for 10MB body limit in middleware/API routes
    middlewareClientMaxBodySize: 50 * 1024 * 1024,
  },
};

module.exports = nextConfig;