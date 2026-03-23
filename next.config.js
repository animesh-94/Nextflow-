const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "120mb",
    },
    proxyClientMaxBodySize: "120mb",
  },
};

module.exports = nextConfig;