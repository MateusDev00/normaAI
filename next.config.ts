// next.config.js - ATUALIZADO
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remover configuração problemática
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;