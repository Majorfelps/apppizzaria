/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // permitir imagens servidas pelo backend local ou por IP
    domains: ['localhost', '127.0.0.1'],
  },
  env: {
    // expõe a URL base do backend para o cliente
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333',
  },
};

module.exports = nextConfig;
