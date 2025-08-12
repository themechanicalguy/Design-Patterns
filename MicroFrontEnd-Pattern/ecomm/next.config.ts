// host-app/next.config.js
const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

module.exports = {
  reactStrictMode: true,
  webpack(config: any, { isServer }: { isServer: any }) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "ecomm",
        remotes: {
          products: `products@http://localhost:3001/remoteEntry.js`,
        },
        shared: {
          react: { singleton: true, eager: true, requiredVersion: false },
          "react-dom": { singleton: true, eager: true, requiredVersion: false },
        },
      })
    );
    return config;
  },
};
