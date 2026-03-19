// shell/next.config.js
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');
process.env.NEXT_PRIVATE_LOCAL_WEBPACK = 'true';

/** @type {import('next').NextConfig} */
const remoteEntryPath = process.env.NODE_ENV === 'development' ? '/remoteEntry.js' : '/assets/remoteEntry.js';

const nextConfig = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    if (isServer) {
      const originalExternals = config.externals;
      const reactExternals = function reactExternals({ request }, callback) {
        if (request && /^react($|\/)/.test(request)) {
          return callback(null, `commonjs ${request}`);
        }
        callback();
      };

      if (Array.isArray(originalExternals)) {
        config.externals = [...originalExternals, reactExternals];
      } else if (typeof originalExternals === 'function') {
        config.externals = [
          async (ctx, cb) => originalExternals(ctx, cb),
          reactExternals,
        ];
      } else if (originalExternals) {
        config.externals = [originalExternals, reactExternals];
      } else {
        config.externals = [reactExternals];
      }
    }

    config.plugins.push(
      new NextFederationPlugin({
        name: 'shell',
        filename: 'static/chunks/remoteEntry.js',
        remotes: {
          // URLs corretas para Vite micro-frontends
          mfUsers: `mfUsers@http://localhost:3002${remoteEntryPath}`,
          mfAnalytics: `mfAnalytics@http://localhost:3001${remoteEntryPath}`,
        },
        shared: {
          react: { singleton: true, requiredVersion: false },
          'react-dom': { singleton: true, requiredVersion: false },
          '@emotion/react': { singleton: true, requiredVersion: false },
          '@emotion/styled': { singleton: true, requiredVersion: false },
          '@mui/material': { singleton: true, requiredVersion: false },
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
