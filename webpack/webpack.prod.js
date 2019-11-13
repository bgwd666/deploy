const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //提取css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //混淆js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(baseConfig,{
  mode: 'production',
  output: {
    filename: '[name].[contenthash:10].js',
  },
  optimization: {             
    usedExports: true,  // production模式下默认开启 //摇树优化  引用但未使用的将删除
    // 配置代码分割
    splitChunks: {
      // 要分割哪些模块：all（推荐）, async(默认，只分隔异步代码), and initial
      // chunks: 'all'
      cacheGroups: {
        vendors: false,
        default: false,
        commons: {
          minSize: 30000,
          minChunks: 3,
          reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
        cache: true,
        parallel: true, // 开启并行压缩，充分利用cpu
        sourceMap: false, //引用源
        extractComments: false, // 移除注释
        uglifyOptions: {
          warnings: false,
          compress: {
            unused: true,
            drop_console: true, //删除console
            drop_debugger: true
          },
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
        preset: ['default', {
              discardComments: { //对注释的处理
                  removeAll: true,
              },
              // autoprefixer: { disable: true },
              normalizeUnicode: false //避免使用 unicode-range 的时候会产生乱码
          }]
        },
        canPrint: true //是否打印处理过程中的日志
      })
    ]
  },
   // 开启调试
  // devtool: 'source-map', 
  module: {
    rules: [
      {
        test: /\.(c|sc)ss$/,
        use: [{loader: MiniCssExtractPlugin.loader}, 'css-loader','postcss-loader','sass-loader']
      }
    ]
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].chunk.css' 
    })
  ]
});