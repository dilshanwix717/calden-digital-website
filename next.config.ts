import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AVIF first, WebP fallback. Required by the performance budget.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Deliberately absent: typescript.ignoreBuildErrors and
  // eslint.ignoreDuringBuilds. The performance budget requires type and lint
  // errors to fail the build. Do not add them to unblock a broken build.
};

export default nextConfig;
