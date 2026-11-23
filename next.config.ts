import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  // Hidden page: served only at /rosalba, not linked from anywhere.
  // The tunnel admin develops camera RAW files with LibRaw, which runs on threads
  // (shared memory). Browsers only allow that on cross-origin isolated pages.
  async headers() {
    const isolated = [
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
    ];
    return [
      { source: "/tunel/admin", headers: isolated },
      { source: "/tunel/admin/:path*", headers: isolated },
      // The worker scripts must carry the same policy to run inside the isolated page.
      { source: "/tunel/libraw/:path*", headers: isolated },
    ];
  },
  async rewrites() {
    return [{ source: "/rosalba", destination: "/rosalba/index.html" }];
  },
};

export default nextConfig;
