module.exports = {
  // baseUrl: './',
  publicPath: './',
  lintOnSave: false,
  productionSourceMap: process.env.VUE_APP_CURRENTMODE === 'test' ? true : false, // 测试打包需要调试文件，正式打包不需要
  outputDir: process.env.VUE_APP_CURRENTMODE, // 打包后的文件名
  devServer: {
    port: 8080,
    // port: 9000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://61.144.244.211:16680/',
        // target: 'http://61.144.244.38:16680/', // 正式
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('expose1')
      .test(/\.swf$/i)
      .use('flash')
      .loader('file-loader')
      .end()

    // 查看打包文件体积大小
    // config
    //   .plugin('webpack-bundle-analyzer')
    //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  }
}

