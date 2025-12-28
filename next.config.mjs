/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Important pour Netlify
  images: {
    unoptimized: true, // Désactive l'optimisation d'images pour l'export
  },
  // Désactive le cache d'images en développement
  experimental: {
    serverActions: true,
  },
  // Configuration pour les redirections et réécritures
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/.netlify/functions/server/:path*',
      },
    ];
  },
  // Configuration Webpack
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Désactive le cache pour le développement
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
