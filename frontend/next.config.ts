import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['movie-db-storage.s3.ap-southeast-1.amazonaws.com'],
  }
  /* config options here */
};

export default nextConfig;
