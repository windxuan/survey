module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    // 跨域方案A: 开发接口代理
    proxy: {
      '/api': {
        target: 'http://192.168.6.163:8080/',
        ws: true,
        changeOrigin: false
      }
    }
  }
}
