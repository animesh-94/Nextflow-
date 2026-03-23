const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "60mb",
    },
    proxyClientMaxBodySize: "60mb",
  },
};

module.exports = nextConfig;