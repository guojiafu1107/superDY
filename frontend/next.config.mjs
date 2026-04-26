/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  // 本地开发时使用API代理，静态导出时忽略
  ...(process.env.NODE_ENV === 'development' ? {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8080/api/:path*',
        },
      ];
    },
  } : {}),
};

export default nextConfig;
