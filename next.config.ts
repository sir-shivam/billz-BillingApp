import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['unsplash.com', 'example.com', 'your-image-domain.com'], // List your allowed domains here
  },
};

export default nextConfig;
