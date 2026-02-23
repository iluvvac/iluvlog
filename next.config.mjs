/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  turbopack: {}, 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;