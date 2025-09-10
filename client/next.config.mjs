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
  // Disable static optimization to avoid SSR issues
  experimental: {
    serverComponentsExternalPackages: [],
  },
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

export default nextConfig
