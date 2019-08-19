module.exports = {
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  chainWebpack: config => {
    // 修改plugin插件陪日志
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'vue-tsx-admin'
        args[0].template = './public/index.ejs'
        return args
      })
    // 修改loader
    config
      .module
      .rule('less')
      .oneOf('normal')
      .test(/src.+\.less/)
      .use('css-loader')
      .tap(args => {
        return {
          ...args,
          localIdentName: '[path]-[local]-[hash:base64:5]',
          modules: true
        }
      })
    // 处理node_modules下的less文件
    config
      .module
      .rule('less')
      .oneOf('lib-less')
      .test(/node_modules.+\.less/)
      .use('style-loader')
      .loader('style-loader')
    config
      .module
      .rule('less')
      .oneOf('lib-less')
      .use('css-loader')
      .loader('css-loader')

    config
      .module
      .rule('less')
      .oneOf('lib-less')
      .use('less-loader')
      .loader('less-loader')
      .tap(() => ({
        javascriptEnabled: true
      }))
  }
}
