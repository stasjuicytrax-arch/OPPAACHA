import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static site: the press kit ships as plain files behind one link.
  output: "export",
  // GitHub Pages serves the site under /OPPAACHA; set by the deploy workflow.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
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
