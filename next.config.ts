import type {NextConfig} from 'next';
import path from 'path';
import copy from 'copy-webpack-plugin';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.plugins.push(
      new copy({
        patterns: [
          {
            from: path.join(
              __dirname,
              'node_modules/pdfjs-dist/build/pdf.worker.min.mjs'
            ),
            to: path.join(__dirname, 'public'),
          },
        ],
      })
    );
    return config;
  },
};

export default nextConfig;
