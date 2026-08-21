import type { NextConfig } from "next";

// Security response headers are set in worker/index.ts, not here — vinext's
// Cloudflare build does not translate next.config `headers()` into anything
// the deployed Worker actually applies (verified: it only auto-writes a
// cache-control rule to `_headers`, and no request-time code path reads
// `config.headers` at all).
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
