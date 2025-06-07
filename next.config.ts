import type { NextConfig } from "next";
import nextI18NextConfig from "./app/i18n/config";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["drive.google.com"],
  },
  i18n: nextI18NextConfig.i18n,
};

export default nextConfig;
