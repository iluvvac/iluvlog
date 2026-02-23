/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Tambahkan ini untuk mengakui penggunaan webpack kustom di Next.js 16
  turbopack: {}, 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Hapus blok experimental.turbo karena menyebabkan error unrecognized key
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;