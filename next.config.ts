import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "framerusercontent.com",
        port: "",
        pathname: "/images/**",
      },
    ],
  },

  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
