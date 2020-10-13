// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Global from '@/utils/global'
import store from './store'

// import Vconsole from 'vconsole'
// if (process.env.NODE_ENV != 'development') {
//   let vConsole = new Vconsole()
// }

import '@/utils/fastclick.js'

import '@/utils/rem.js'
import '@/styles/iconfont.css'
import '@/styles/public.css'
// import '@/styles/index.scss' // 全局样式
// import '../static/css/face.css'
// import '../static/css/base.css'

import 'vux/src/styles/weui/widget/weui_cell/weui_cell_global.less';
import 'vux/src/styles/weui/widget/weui_cell/weui_check.less';
import 'vux/src/styles/weui/icon/weui_icon_font.less';

import './permission.js'

import {
  ToastPlugin,
  LoadingPlugin,
  WechatPlugin,
  ConfirmPlugin,
  AlertPlugin,
  XHeader,
  Cell,
  Group,
  XInput,
  Datetime,
  InlineLoading,
  Scroller,
  LoadMore,
  XTable
} from 'vux'

if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body);
	}, false);
}
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(WechatPlugin)
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.component('x-header', XHeader)
Vue.component('cell', Cell)
Vue.component('group', Group)
Vue.component('x-input', XInput)
Vue.component('datetime', Datetime)
Vue.component('inline-loading', InlineLoading)
Vue.component('scroller', Scroller)
Vue.component('load-more', LoadMore)
Vue.component('x-table', XTable)
// 设置图表分辨率
Vue.prototype.$devicePixelRatio = 2
import MyStep from '@/components/myStep/index'
import MyScroller from '@/components/myScroller/index'
import MyMap from '@/components/map'
import MyCheck from '@/components/checklist'
// 全局方法集

Vue.prototype.Global = new Global(Vue)

Vue.config.productionTip = false
Vue.component('MyStep', MyStep)
Vue.component('MyScroller', MyScroller)
Vue.component('MyMap', MyMap)
Vue.component('MyCheck', MyCheck)
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
