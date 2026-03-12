import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      new URL("http://45.143.62.174:8086/**"),
      new URL("http://45.143.62.174:8071/**"),
    ],
  },

};

export default nextConfig;
