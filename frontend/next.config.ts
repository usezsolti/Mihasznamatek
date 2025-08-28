import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Mivel statikus képeket használunk
  },
  experimental: {
    appDir: false,
  },
};

export default nextConfig;
