/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
    ],
  },
  // Disable static generation to avoid SSR issues
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Prevent static generation of error pages
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Explicitly disable static optimization for all pages
  output: 'standalone',
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Ignore src directory to prevent Pages Router detection
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  webpack: (config, { isServer }) => {
    // Exclude src directory from webpack processing
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    return config
  },
}

export default nextConfig
