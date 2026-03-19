// shell/next.config.js
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');
process.env.NEXT_PRIVATE_LOCAL_WEBPACK = 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'shell',
        filename: 'static/chunks/remoteEntry.js',
        remotes: {
          // URLs corretas para Vite micro-frontends
          mfUsers: 'mfUsers@http://localhost:3002/assets/remoteEntry.js',
          mfAnalytics: 'mfAnalytics@http://localhost:3001/assets/remoteEntry.js',
        },
        shared: {
          react: { singleton: true, eager: true, requiredVersion: false },
          'react-dom': { singleton: true, eager: true, requiredVersion: false },
          '@emotion/react': { singleton: true, requiredVersion: false },
          '@emotion/styled': { singleton: true, requiredVersion: false },
          '@mui/material': { singleton: true, requiredVersion: false },
        },
      })
    );

    return config;
  },
  experimental: {
    esmExternals: false,
  },
};

module.exports = nextConfig;
