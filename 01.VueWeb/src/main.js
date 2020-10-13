import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
// import './mock' // simulation data

// require 富文本框 styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'kindeditor/themes/default/default.css'

import * as filters from './filters' // global filters
import { btnPermission, nullStyle } from './permission.js' // 按钮权限和页面权限

// 自定义组件
import MySelect from '@/components/module/module_alert'
import LabelColor from '@/components/labelColor/index'
import SearchFifter from '@/components/searchFifter/index'
import ElForm from '@/components/myForm/src/form'
import ElFormItem from '@/components/myForm/src/form-item'
import MySteps from '@/components/myStep/steps'
import MyStep from '@/components/myStep/step'
import MyTabs from '@/components/myTab/index'

// 审批流步骤条
import ApprovalStep from '@/components/approvalStep/index'

// import MyTabPane from '@/components/myTabs/tab-pane';
// import MyTabs from '@/components/myTabs/tabs';
// 提示框
Vue.component('MyAlert', MySelect)
// 搜索
Vue.component('SearchFifter', SearchFifter)
Vue.component('LabelColor', LabelColor)
// 步骤条
Vue.component('MySteps', MySteps)
Vue.component('MyStep', MyStep)
// 头部筛选
Vue.component('MyTabs', MyTabs)
// form表单
Vue.component('MyForm', ElForm)
Vue.component('MyFormItem', ElFormItem)
// 审批流进度条
Vue.component('ApprovalStep', ApprovalStep)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// import {
//   setToken
// } from '@/utils/auth'
// setToken('admin')
Vue.config.productionTip = false
Vue.prototype.btnPermission = btnPermission
Vue.prototype.nullStyle = nullStyle
Vue.prototype.checkFormErr = function() {
  if (document.querySelector('.el-form-item__error')) {
    document
      .querySelector('.el-form-item__error')
      .parentNode.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    return true
  }
}
// Vue.prototype.routePermission = routePermission
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
