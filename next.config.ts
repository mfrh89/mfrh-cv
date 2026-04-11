import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.178.98"],
  headers: async () => process.env.NODE_ENV === 'development' ? [{
    source: '/:path*',
    headers: [
      { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate, max-age=0' },
      { key: 'Pragma', value: 'no-cache' },
      { key: 'Expires', value: '0' },
    ],
  }] : [],
  images: {
    localPatterns: [
      {
        pathname: "/api/media/file/**",
      },
    ],
  },
};

export default withPayload(nextConfig);
