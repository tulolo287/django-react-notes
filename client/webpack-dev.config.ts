import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import 'webpack-dev-server';
import { ProxyConfigArray } from 'webpack-dev-server';

const config: webpack.Configuration = {
  mode: 'development',
  target: 'web',
  entry: { main: './src/index.tsx' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public')
    },
    hot: true,
    port: 3005,
    proxy: [
      {
        context: ['/api/v1'],
        target: 'http://127.0.0.1:8000/api/v1',
        secure: false,
      },
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html')
    })
  ]
};

export default config;