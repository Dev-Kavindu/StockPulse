import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
