const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
   entry: {
      accordion: {
         import : './src/components/accordion/accordion.ts',
      },
      slider: {
         import: './src/components/slider/slider.ts',
      }
   },
   module: {
      rules: [
         {
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
         },
      ],
   },
   resolve: {
      extensions: ['.tsx', '.ts', '.js'],
   },
   output: {
      filename: '[name]/[name].min.js',
      path: path.resolve( __dirname, 'dist' ),
      iife: false,
      clean: true,
   },
   devtool: 'source-map',
   optimization: {
      minimize: true,
      minimizer: [
         new TerserPlugin({
            terserOptions: {
               mangle: {
                  keep_classnames: true,
               }
            },
         }),
      ],
   },
   mode: 'production',
   cache: false,
}
