/** @type {import('next').NextConfig} */
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

const nextConfig = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'shell',
        filename: 'static/chunks/remoteEntry.js',
        remotes: {
          // Em produção: substitua localhost pelas URLs de deploy
          mfAnalytics: `mfAnalytics@${
            process.env.MF_ANALYTICS_URL ?? 'http://localhost:3001'
          }/remoteEntry.js`,
          mfUsers: `mfUsers@${
            process.env.MF_USERS_URL ?? 'http://localhost:3002'
          }/remoteEntry.js`,
        },
        shared: {
          // Singleton crítico — garante uma única instância entre shell e MFs
          react: { singleton: true, requiredVersion: false },
          'react-dom': { singleton: true, requiredVersion: false },
          zustand: { singleton: true, requiredVersion: false },
        },
        extraOptions: {
          exposePages: false,
          enableImageLoaderFix: true,
          enableUrlLoaderFix: true,
          skipSharingNextInternals: false,
        },
      })
    );
    return config;
  },
};

module.exports = nextConfig;
