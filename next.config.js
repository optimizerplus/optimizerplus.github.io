/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isProd ? '/optimizerpluswebsite' : '',
  assetPrefix: isProd ? '/optimizerpluswebsite/' : '',
  images: {
    unoptimized: true,
  },
  // Next.js 16 optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Next.js 16 new features
  serverExternalPackages: [],
  bundlePagesRouterDependencies: true,
  // Performance optimizations
  modularizeImports: {
    'framer-motion': {
      transform: 'framer-motion/{{member}}',
    },
  },
}

module.exports = nextConfig
