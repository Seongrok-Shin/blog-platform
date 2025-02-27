/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "github.com" },
    ],
    // Disable image optimization in non-production environments to prevent fetch errors
    unoptimized: process.env.NODE_ENV !== "production",
  },
};

module.exports = nextConfig;
