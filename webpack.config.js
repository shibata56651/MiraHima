const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackFixStyleOnlyEntries = require('webpack-fix-style-only-entries');
const LicenseCheckerWebpackPlugin = require('license-checker-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const entry = {
  'main': './_dev/js/main.ts',
};

const cssJsFunc = (mode) => {
  return {
  // メインとなるJavaScriptファイル（エントリーポイント）
  stats: {
    errorDetails: true
  },
  watch: mode === 'development',
  entry,
  devtool: 'source-map',

  // ファイルの出力設定
  output: {
    // 出力ファイル名
    filename: './common/js/[name].js',
    path: path.resolve(__dirname, 'docs'),
  },
  module: {
    rules: [
      {
        // 拡張子 .js の場合
        test: /\.ts$/,
        // test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            // Babel を利用する
            loader: 'babel-loader',
            // Babel のオプションを指定する
            options: {
              presets: [
                [
                  '@babel/preset-env'
                ]
              ]
            }
          },
          {
            // Babel を利用する
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [
      '.ts', '.js',
    ],
  },
  plugins: [
    new webpackFixStyleOnlyEntries(),
    // CSSファイルを外だしにするプラグイン
    new MiniCssExtractPlugin({
      // ファイル名を設定します
      filename: './common/css/[name]',
    }),
    new webpack.BannerPlugin({
      banner: 'For license information please see main.js.LICENSE.txt'
    }),
    new LicenseCheckerWebpackPlugin({
      filter: /(^.*[/\\]node_modules[/\\]((?:@[^/\\]+[/\\])?(?:[^@/\\][^/\\]*)))/,
      allow: 'MIT OR CC0-1.0 OR W3C-20150513 OR Apache-2.0',
      // override: licenseOverride,
      outputFilename: 'main.js.LICENSE.txt'
    }),
  ],
  optimization: {
    minimizer: [
        new TerserPlugin()
    ]
  },
  target: ['web', 'es5'],
  }
}

  module.exports = (env, argv) => {
    const {mode} = argv;

    if (mode === 'development') {
      cssJsFunc.watch = true;
    }

    const cssJsFuncString = cssJsFunc(mode);
    return cssJsFuncString;
  }
