import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "your-sentry-org",
  project: "devboard-frontend",
});
