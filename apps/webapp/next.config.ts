import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: "/api", // für client UND server
  },
};

export default nextConfig;
