const path = require( "path" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const { EsbuildPlugin } = require( "esbuild-loader" );

///ENVIRONMENT
const environment = process.env.NODE_ENV.trim();
const envOutputDir = environment === 'development' ? 'examples' : 'src/components';
const isMin = environment === 'development' ? '' : '.min';

module.exports = {
   entry: {
      accordion: {
         import : './src/components/accordion/accordion.ts',
         filename: './accordion/accordion' + isMin +'.js'
      },
      slider: {
         import: './src/components/slider/slider.ts',
         filename: './slider/slider' + isMin + '.js',
      },
   },
   module: {
      rules: [
         {
            // Match js, jsx, ts & tsx files
            test: /\.[jt]sx?$/,
            loader: 'esbuild-loader',
            options: {
               // JavaScript version to compile to
               target: 'es2015'
            }
         },
         {
            test: /\.css$/i,
            use: [
               MiniCssExtractPlugin.loader,
               "css-loader"
            ],
         },
      ],
   },
   plugins: [
      new MiniCssExtractPlugin({
         filename: './[name]/[name]' + isMin + '.css',
      }),
   ],
   resolve: {
      extensions: ['.tsx', '.ts', '.js', '.css'],
   },
   output: {
      // filename: '[name]/[name].min.js',
      path: path.resolve( __dirname, envOutputDir ),
      iife: true,
      clean: false,
   },
   devtool: 'source-map',
   optimization: {
      // minimize: true,
      minimizer: [
         new EsbuildPlugin({
            // target: 'esnext',
            // minifyIdentifiers: false,
            // keepNames: true,
            css: true,
         }),
      ],
   },
   cache: false,
}
