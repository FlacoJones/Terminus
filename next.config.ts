import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Set the workspace root to this directory to avoid lockfile detection issues
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
