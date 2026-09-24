import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  // Hidden page: served only at /rosalba, not linked from anywhere.
  async rewrites() {
    return [{ source: "/rosalba", destination: "/rosalba/index.html" }];
  },
};

export default nextConfig;
