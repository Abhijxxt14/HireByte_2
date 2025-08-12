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
    // Note: we're using a CDN for the pdf.js worker to avoid issues with Next.js.
    // If you want to host it locally, you'll need to configure this plugin.
    // config.plugins.push(
    //   new copy({
    //     patterns: [
    //       {
    //         from: path.join(
    //           __dirname,
    //           'node_modules/pdfjs-dist/build/pdf.worker.min.mjs'
    //         ),
    //         to: path.join(__dirname, 'public'),
    //       },
    //     ],
    //   })
    // );
    return config;
  },
};

export default nextConfig;
