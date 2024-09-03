const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dotenv = require('dotenv')
const path = require("path");
const webpack = require("webpack");
dotenv.config()

module.exports = (config) => {
    const conf = {...config, node: { crypto: true, stream: true, buffer: true }};

    conf.plugins = [...conf.plugins,
      new webpack.DefinePlugin({
        CLIENT_KEY: JSON.stringify(process.env.CLIENT_KEY),
        ENV: JSON.stringify(process.env.ENV),
        BASE_URL: JSON.stringify(process.env.BASE_URL),
      }),
    ]
    if (process.env.CLIENT_KEY) {

      conf.plugins.push(
      new MiniCssExtractPlugin({
        filename: process.env.CLIENT_KEY,
        chunkFilename: "[name].css",
      }),
    );
    const cssPath = path.join(
      __dirname,
      `src/branding/${process.env.CLIENT_KEY}/mixins.scss`
    );

    conf.module.rules.push({
      test: cssPath,
      use: [
       MiniCssExtractPlugin.loader,
        { loader: "css-loader", options: { sourceMap: false }},
      ]
    });

    conf.entry = {
      ...conf.entry,
      [process.env.CLIENT_KEY]: [cssPath],
    };
    return conf;
  }
}
