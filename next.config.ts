import type { NextConfig } from "next";
import nextI18NextConfig from "./next-i18next.config";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["drive.google.com"],
  },
  i18n: nextI18NextConfig.i18n,
};

export default nextConfig;
