module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "@vue/typescript"
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "quotes": [2, "single"], //单引号
    'new-cap': 'off',
    'no-continue': 'off',
    'no-empty': 'on',
    'experimentalDecorators': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
    'guard-for-in': 'off',
    'prefer-destructuring': 'off',
    'prefer-promise-reject-errors': 'off',
    'camelcase': 'off',
    'eslint-import-resolver-typescript': {
      'extensions': ['.ts', '.tsx', '.d.ts']
    },
    'space-infix-ops': 'off',
    'import/prefer-default-export': 'off',
    'no-restricted-syntax': 0,
    'no-restricted-globals': 'off',
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-unresolved': 'off',
    'import/newline-after-import': 'off',
    'import/extensions': 'off',
    'no-param-reassign': 'off',
    'class-methods-use-this': 'off',
    'linebreak-style': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    "no-console": 0, //不禁用console
    // "no-debugger": 2, //禁用debugger
    "no-var": 0, //对var警告
    "semi": 0, //不强制使用分号
    "no-irregular-whitespace": 0, //不规则的空白不允许
    "no-trailing-spaces": 1, //一行结束后面有空格就发出警告
    "eol-last": 0, //文件以单一的换行符结束
    // "no-unused-vars": [2, {"vars": "local", "args": "after-used"}], //不能有声明后未被使用的变量或参数
    "no-underscore-dangle": 0, //标识符不能以_开头或结尾
    "no-alert": 2, //禁止使用alert confirm prompt
    "no-lone-blocks": 0, //禁止不必要的嵌套块
    "no-class-assign": 2, //禁止给类赋值
    "no-cond-assign": 2, //禁止在条件表达式中使用赋值语句
    "no-const-assign": 2, //禁止修改const声明的变量
    "no-delete-var": 2, //不能对var声明的变量使用delete操作符
    "no-dupe-keys": 2, //在创建对象字面量时不允许键重复
    "no-duplicate-case": 2, //switch中的case标签不能重复
    "no-dupe-args": 2, //函数参数不能重复
    "no-empty": 2, //块语句中的内容不能为空
    "no-func-assign": 2, //禁止重复的函数声明
    "no-invalid-this": 0, //禁止无效的this，只能用在构造器，类，对象字面量
    "no-redeclare": 2, //禁止重复声明变量
    "no-spaced-func": 2, //函数调用时 函数名与()之间不能有空格
    "no-this-before-super": 0, //在调用super()之前不能使用this或super
    "no-undef": 2, //不能有未定义的变量
    "no-use-before-define": 2, //未定义前不能使用
    "jsx-quotes": [2, "prefer-double"], //强制在JSX属性（jsx-quotes）中一致使用双引号
    'vue/attribute-hyphenation': [
      'error',
      'always'
    ],
    'vue/html-end-tags': 'error',
    'vue/html-indent': [
      'error',
      2
    ],
    'vue/html-self-closing': 'error',
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
    'vue/attributes-order': 'error',
    'vue/order-in-components': 'error'
  },
  parserOptions: {
    parser: "@typescript-eslint/parser"
  }
};
