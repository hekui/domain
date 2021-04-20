// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  // parser: 'babel-eslint',
  // parserOptions: {
  //   sourceType: 'module',
  //   ecmaVersion: 6
  // },
  parserOptions: {
    "parser": "babel-eslint",
    "ecmaVersion": 2017,
    "sourceType": 'module'
  },
  env: {
    browser: false,
    node: true,
    es6: true
  },
  // https://github.com/standard/standard/blob/master/docs/README-zhcn.md
  // https://eslint.vuejs.org/rules/
  extends: [
    'standard',
    'plugin:vue/strongly-recommended',
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  'rules': {
    // 要求或禁止(默认)使用拖尾逗号 https://cn.eslint.org/docs/rules/comma-dangle
    'comma-dangle': 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-before-function-paren': 0, // 函数前空格
    // 
    'prefer-promise-reject-errors': 0,
    'no-tabs': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-closing-bracket-newline': 'off',
  },
  globals: {
    $: true,
    location: true,
    localStorage: true,
    editormd: true,
    FormData: true,
    WebSocket: true,
  }
}


