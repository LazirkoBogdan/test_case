import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

export default (_env, argv) => {
  return {
    stats: "minimal", // Keep console output easy to read.
    entry: "./src/main.ts", // Your program entry point

    // Your build destination
    output: {
      path: path.resolve(process.cwd(), "dist"),
      filename: "bundle.js",
      clean: true,
    },

    // Config for your testing server
    devServer: {
      compress: true,
      allowedHosts: "all", // If you are using WebpackDevServer as your production server, please fix this line!
      static: false,
      client: {
        logging: "warn",
        overlay: {
          errors: true,
          warnings: false,
        },
        progress: true,
      },
      port: 5143,
      host: "0.0.0.0",
    },

    // Web games are bigger than pages, disable the warnings that our game is too big.
    performance: { hints: false },

    // Enable sourcemaps while debugging
    devtool: argv.mode === "development" ? "eval-source-map" : undefined,

    // Minify the code when making a final build
    optimization: {
      minimize: argv.mode === "production",
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 6,
            compress: { drop_console: true },
            output: { comments: false, beautify: false },
          },
        }),
      ],
    },

    // Explain webpack how to do Typescript
    module: {
      rules: [
        {
          test: /\.ts(x)?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(png)$/,
          type: "asset/resource",
        },
        {
          test: /\.(mp3)$/,
          type: "asset/resource",
        },
        {
          test: /\.(glb)$/,
          type: "asset/resource",
        },
      ],
    },
    resolve: {
      alias: {
        '@sharedTypes': path.resolve(__dirname, 'src/types/index'), // ← додаємо псевдонім
        '@core': path.resolve(__dirname, 'src/Core'),
        '@utils': path.resolve(__dirname, 'src/Utils/index.ts'),
        "@config": path.resolve(__dirname, 'src/config.ts'),
        '@constants': path.resolve(__dirname, 'src/Constants'),
        '@components': path.resolve(__dirname, 'src/Components'),
      },

      extensions: [".tsx", ".ts", ".js"],
    },

    plugins: [
      // Copy our static assets to the final build
      new CopyPlugin({
        patterns: [{ from: "public/" }],
      }),

      // Make an index.html from the template
      new HtmlWebpackPlugin({
        template: "./index.ejs",
        hash: false,
        minify: false,
      }),
    ],
  };
};
