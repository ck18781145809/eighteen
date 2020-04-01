/*
 * babel@7
 * npm install --save-dev @babel/core @babel/cli @babel/preset-env
 * npm install --save @babel/polyfill
 * */

module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3 //  推荐使用 core-js@3 版本，因为有更多 JS 的新特性
      }
    ]
  ]
}
