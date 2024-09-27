/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.pexels.com"],
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
};

export default nextConfig;
