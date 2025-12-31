import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  reactStrictMode: true,

  // Exclude server-only packages from client bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        buffer: false,
      };
      
      // Exclude server-only modules from client bundle
      config.externals = [
        ...config.externals || [],
        'bcrypt',
        'mysql2',
      ];
    }
    return config;
  },

  // Image Optimization (14.1)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Code Splitting & Bundle Optimization (14.2, 14.4)
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'react-type-animation'],
  },

  // Compiler Options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Performance
  poweredByHeader: false,
  compress: true,

  turbopack: {},
};

export default nextConfig;
