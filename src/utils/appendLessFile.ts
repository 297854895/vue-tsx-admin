// 添加主题色热编译的less文件
export default () => {
  if (document.getElementById('lessColorFile')) return
  // 加载 less
  const colorLess = document.createElement('link')
  colorLess.setAttribute('id', 'lessColorFile')
  colorLess.setAttribute('rel', 'stylesheet/less')
  colorLess.setAttribute('href', '/color.less')
  // 加载less config
  const lessConfig = document.createElement('script')

  lessConfig.innerHTML = `
    window.less = {
      async: true,
      env: 'production',
      javascriptEnabled: true
    };
  `
  document.body.appendChild(colorLess)
  document.body.appendChild(lessConfig)
}
