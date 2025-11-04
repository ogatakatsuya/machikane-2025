import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      exclude: /icon\.svg$/,
      use: ["@svgr/webpack"],
    });
    config.watchOptions = {
      poll: 300,
      aggregateTimeout: 300,
    };

    // Externalize @sparticuz/chromium to prevent webpack bundling issues
    config.externals = config.externals || [];
    config.externals.push("@sparticuz/chromium");

    return config;
  },
};

export default nextConfig;
