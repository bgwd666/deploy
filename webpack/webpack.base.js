const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './src/main.ts',
  resolve: {
    // 这里可以配置些文件后缀，用于写路径时可省略后缀（会影响打包速度，不建议配太多）
    extensions: [ '.tsx', '.ts', '.js', 'vue']
  },
  node: { crypto: true, stream: true, fs: 'empty', net: 'empty' },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      // {
      //   test: /\.ts$/,  //eslint
      //   exclude: /node_modules/,
      //   enforce: 'pre',
      //   loader: 'tslint-loader'
      // },
      {
        // 识别.ts或.tsx文件
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: { appendTsxSuffixTo: [/\.vue$/] }
          }
        ]
      }, 
      {
        test: /\.(gif|png|jpg|jpeg|webp|svg|ttf|woff2|woff)$/,
        use: [{
          loader: 'url-loader',
          options: {
            // 当图片大于801k时，交给file-loader处理，否则url-loader会把图片src转成base64编码
            limit: 1024 * 8,
            // // 打包后的文件名  // name: '[name].[hash:8].[ext]',
            // // 打包路径 // outputPath: 'img/'
            //结合
            name: 'img/[name].[hash:8].[ext]',
          }
        }]
      }
    ]
  },
  externals: {
    // puppeteer: 'require("puppeteer")'
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
       // 设置模板title
       title: 'vue-cli',
  
       // 生成的模板名称，默认 'index.html', 规则类似output
       filename: 'index.html',
 
       // 指定生成的html文件依赖的模板
       template: './index.html',

      // 插入meta标签
      meta: {
        'apple-touch-fullscreen': 'yes',
      }
    })   
  ]
}