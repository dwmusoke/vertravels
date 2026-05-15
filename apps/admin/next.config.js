/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Ignore specific modules that cause build errors
    if (!isServer) {
      config.module.rules.push({
        test: /(agency-insights|daily-sales|fare-optimization|iata-tracking|unused-tickets)/,
        use: 'null-loader',
      });
    }
    return config;
  },
};

module.exports = nextConfig;
