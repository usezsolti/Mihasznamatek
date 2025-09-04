import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Ideiglenesen kikapcsolva
  },
  typescript: {
    ignoreBuildErrors: true, // Ideiglenesen kikapcsolva
  },
}

export default nextConfig
