import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ADR-OMK-001 / ADR-SUPABASE-001 — Standalone output for Dokploy.
  // `output: 'standalone'` produces a self-contained `server.js` in `.next/standalone`
  // that bundles the Next.js server + only the required node_modules. This is the
  // Next.js equivalent of the Vite+Express pattern in OMK: a single small image
  // that the Dokploy stack deploys per mode (internal vs saas).
  output: "standalone",
};

export default nextConfig;
