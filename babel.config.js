module.exports = {
  presets: ["@vue/app"],
  // ant-design 按需加载
  plugins: [
    [
      "import",
      {
        'libraryName': 'ant-design-vue',
        'libraryDirectory': 'es',
        'style': true
      }
    ]
  ]
};
