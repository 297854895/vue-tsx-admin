module.exports = {
  presets: [
    [
      "@vue/app"
    ],
    [
      "@babel/preset-env",
      {
        useBuiltIns: 'entry'
      }
    ]
  ],
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
