/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/crm',
  outputFileTracingRoot: new URL('.', import.meta.url).pathname,
  reactStrictMode: true,
  experimental: { optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@tabler/icons-react'] },
};

export default nextConfig;
