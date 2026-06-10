import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow ngrok for local testing
  allowedDevOrigins: ['atonal-evelia-biodynamic.ngrok-free.dev'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
};

export default nextConfig;
