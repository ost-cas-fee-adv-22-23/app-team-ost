/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cas-fee-advanced-ocvdad.zitadel.cloud',
        port: '',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/qwacker-api-prod-data/**',
      },
      {
        protocol: 'https',
        hostname: 'newinzurich.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      // todo: caching
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
};

// Use required import like in the tutorial: https://www.npmjs.com/package/next-pwa
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA(nextConfig);
