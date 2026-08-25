import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const pagesBasePath = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        assetPrefix: pagesBasePath,
      }
    : {}),
};

export default nextConfig;
