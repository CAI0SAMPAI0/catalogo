import type { NextConfig } from "next";

const rawBackend =
  process.env.API_URL ||
  process.env.BACKEND_URL ||
  "http://127.0.0.1:8000";

const backendBase = rawBackend.replace(/\/$/, "");
const backendApiUrl = backendBase.endsWith("/api")
  ? backendBase
  : `${backendBase}/api`;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
