/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/index-public',
        destination: '/',
        permanent: true,
      },
      {
        source: '/mumble-public/:id',
        destination: '/mumble/:id',
        permanent: true,
      },
    ];
  },
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
    ],
    /*
     * There is no mechanism to invalidate the cache at this time, so it's best to keep minimumCacheTTL low.:
     * https://nextjs.org/docs/api-reference/next/image#minimum-cache-ttl
     */
    minimumCacheTTL: 60,
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
