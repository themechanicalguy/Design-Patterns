const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

module.exports = {
  reactStrictMode: true,
  webpack(config: any, { isServer }: { isServer: any }) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "prod-listing",
        filename: "remoteEntry.js",
        remotes: {},
        exposes: {
          "./Products": "./utils/product-helper.ts",
        },
        shared: {},
      })
    );
    if (!isServer) {
      config.output.publicPath = "http://localhost:3000/_next/";
    }
    return config;
  },
};
