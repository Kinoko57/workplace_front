'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_URL: '"https://apishenshou.71360.com/"'
  // BASE_URL: '"https://share.gongzhugou.com/"',
  BASE_URL: '"https://ssxcx-test.nbseo.cn/"',
  FilE_URL: '"https://share.gongzhugou.com/static/image/xcx_img/"'
  // BASE_URL: '"http://shenshouxcx.com/"'
})
