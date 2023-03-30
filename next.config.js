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

module.exports = nextConfig;
