import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  // AVIF first, WebP fallback. Required by the performance budget.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Deliberately absent: typescript.ignoreBuildErrors and
  // eslint.ignoreDuringBuilds. The performance budget requires type and lint
  // errors to fail the build. Do not add them to unblock a broken build.
};

// Gated on ANALYZE=true so normal builds are unaffected. Run via `pnpm analyze`.
export default withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(nextConfig);
