import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from external sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    // Image optimization - optimized for 40dvh images
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200], // Removed 1920+ (too large for 40dvh display)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    minimumCacheTTL: 60 * 60 * 24 * 365, // Cache for 1 year
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['swiper'],
  },
  
  // Compile optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
