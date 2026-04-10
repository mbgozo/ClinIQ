/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@cliniq/ui", "@cliniq/shared-types"],
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;

