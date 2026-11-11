import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // localhost is allowed by default. 127.0.0.1 is a different origin,
  // and a blocked dev websocket stops the page from hydrating.
  allowedDevOrigins: ["127.0.0.1"],
  serverExternalPackages: ["unpdf"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
