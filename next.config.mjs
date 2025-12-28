/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  experimental: {
    serverActions: true,
    optimizeCss: true,
  },
  // Configuration pour les redirections et réécritures
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
    };
  },
  // Configuration Webpack
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false,
      };
    }

    // Optimisations de build en production
    if (!dev) {
      config.optimization.minimize = true;
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        maxAsyncRequests: 25,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            chunks: 'all',
            priority: 40,
            enforce: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/](@[^\\/]+\/)?([^\\/]+)[\\/]/, // [\\/]node_modules[\\/](?!.*\\.(?:css|scss|sass|less|styl|stylus|pcss|postcss)$).*$/
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](@[^\\/]+\/)?([^\\/]+)/
              )?.[2];
              return packageName ? `lib.${packageName.replace('@', '')}` : undefined;
            },
            priority: 30,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }

    return config;
  },
  // Configuration pour le rendu côté serveur
  outputFileTracing: true,
  // Configuration des en-têtes de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
  // Désactive le cache pour le développement
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Optimisations de production
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  httpAgentOptions: {
    keepAlive: true,
  },
};

// Configuration spécifique pour Vercel
if (process.env.VERCEL_ENV === 'production') {
  nextConfig.output = 'standalone';
  nextConfig.swcMinify = true;
  nextConfig.compress = true;
  nextConfig.optimizeFonts = true;
  nextConfig.devIndicators = {
    buildActivity: false,
  };
}

export default nextConfig;
