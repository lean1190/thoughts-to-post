import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://oaidalleapiprodscus.blob.core.windows.net/**')]
  }
};

export default nextConfig;
