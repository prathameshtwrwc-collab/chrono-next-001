import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "fonts.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "fonts.gstatic.com",
      },
    ],
  },
};

export default nextConfig;
