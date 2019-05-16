declare module '*.less' {
  const less: any;
  export default less;
}
declare module '*.svg' {
  const svg: any;
  export default svg;
}
declare module '*.png' {
  const png: any;
  export default png;
}
declare module 'less/dist/less.min.js' {
  interface lessTool {
    modifyVars: any;
    [propsName: string]: any;
  }
  const lessJS: {
    default: lessTool;
  };
  export default lessJS.default;
}
declare module 'highlight.js' {
  const hljs: any;
  export default hljs;
}
declare module 'ant-design-vue/lib/locale-provider/zh_CN' {
  const zh_CN: any;
  export default zh_CN;
}
declare module 'ant-design-vue/lib/locale-provider/zh_TW' {
  const zh_TW: any;
  export default zh_TW;
}
declare module 'ant-design-vue/lib/locale-provider/en_US' {
  const en_US: any;
  export default en_US;
}
declare module 'crypto-js' {
  const CryptoJS: any;
  export default CryptoJS;
}
