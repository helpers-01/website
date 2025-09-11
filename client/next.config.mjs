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
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

export default nextConfig
