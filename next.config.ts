import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static site: the press kit ships as plain files behind one link.
  output: "export",
  images: { unoptimized: true },
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
