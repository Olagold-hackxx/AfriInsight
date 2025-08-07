const nextConfig = {
  eslint: {
    dirs: ['pages', 'utils', 'components', 'app'],
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    appDir: true,
  },
}

export default nextConfig
