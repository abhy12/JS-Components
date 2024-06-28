import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
const __dirname = import.meta.dirname;
import { EsbuildPlugin } from "esbuild-loader";
import webpack from "webpack";
import { readFileSync } from "fs";
const copyrightHeader = readFileSync( "./copyright-header.txt", { encoding: 'utf-8', flag: 'r' } );

export default ( _, argv ) => {
   const environment = argv.mode;
   const envOutputDir = environment === 'development' ? 'examples' : 'src/components';
   const isMin = environment === 'development' ? '' : '.min';

   return  {
      entry: {
         accordion: {
            import: './src/components/accordion/index.ts',
            filename: './accordion/accordion' + isMin + '.js',
            library: {
               name: 'JscAccordion',
               type: 'window',
               export: 'default',
            },
         },
         slider: {
            import: './src/components/slider/index.ts',
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
         new webpack.BannerPlugin({
            banner: ( args ) => {
               if( environment === 'development' ) return '';

               const baseDir = './src/components/';
               const entryName = args.chunk.getEntryOptions().name;
               const entryDir = baseDir + entryName + '/package.json';
               const { version, name, author, homepage, description } = JSON.parse( readFileSync( entryDir ) );

               let header = copyrightHeader.toString().replaceAll( /{pkg\.name}/g, name );
               header = header.replaceAll( /{pkg\.version}/g, version );
               header = header.replaceAll( /{pkg\.author}/g, author );
               header = header.replaceAll( /{pkg\.description}/g, description );
               header = header.replaceAll( /{pkg\.url}/g, homepage );

               return header;
            }
         }),
      ],
      resolve: {
         extensions: ['.tsx', '.ts', '.js', '.css'],
      },
      output: {
         // filename: '[name]/[name].min.js',
         path: path.resolve( __dirname, envOutputDir),
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
}
