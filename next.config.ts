import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // The source photographs are 1200×896. Next serves resized AVIF/WebP
    // variants from them; the originals in /images are never modified.
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80, 90],
    deviceSizes: [480, 640, 828, 1080, 1200, 1600, 2048],
    imageSizes: [96, 160, 256, 384],
  },
};

export default nextConfig;
