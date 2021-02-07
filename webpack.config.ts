import { Configuration } from 'webpack';
import tsConfigPathPlugin from 'tsconfig-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import compression from 'compression-webpack-plugin';

const config: Configuration = {
  entry: 'src/index.tsx',
  mode: (process.env.NODE_ENV || 'development') as any,
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(css|less)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    plugins: [new tsConfigPathPlugin({ configFile: 'tsconfig.json' })] as any,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'Terrain Stamper Store',
    }),
    new compression({
      algorithm: 'brotliCompress',
      exclude: /\.(html?|txt)$/,
      filename: '[path][base].br',
    }),
    new compression({
      algorithm: 'gzip',
      exclude: /\.(html?|txt)$/,
      filename: '[path][base].gz',
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 2021,
    hot: true,
  }
};

export default config;
