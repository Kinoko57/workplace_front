// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/*eslint-disable*/
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import App from './App'
import Vuex from 'vuex'
import store from './store'
import router from './router'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import '@/styles/index.css'
import '@/styles/public.css'
import '@/styles/iconfont.css'
import FastClick from 'fastclick'
import '../static/js/flexible.js'
// import {
//   wxConfig
// } from '@/api/index'
// import {
//   setToken,
//   getToken
// } from '@/store/auth'
// import { Message } from 'element-ui'
// import wx from 'weixin-js-sdk'
Vue.prototype.HOST = '/api'
import {
  Cell,
  Checklist,
  Navbar,
  TabItem
} from 'mint-ui';
// 剪切板复制
VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)
import Vconsole from 'vconsole'
if (process.env.DEV_ENV == 'development') {
  let vConsole = new Vconsole()
}
Vue.component(Cell.name, Cell);
Vue.component(Checklist.name, Checklist);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
// 顶部导航栏
import LyTab from '@/components/LyTab/index'
Vue.component('LyTab', LyTab)
// 返回顶部组件 
import returnTop from '@/components/return-top'
Vue.component('returnTop', returnTop)

// import base from './base'
// Vue.use(base)
console.log(process.env.BASE_URL)
var storage = window.localStorage
storage.setItem('leaveIndex', false)
storage.setItem('routeNum', 1)
console.log(storage.getItem('showGuide'))
if (storage.getItem('showGuide') == undefined || storage.getItem('showGuide') == null) {
  storage.setItem('showGuide', 0) // 安装完软件显示引导页
}
if(storage.getItem('bindCid') == undefined || storage.getItem('bindCid') == null){
  storage.setItem('bindCid', false)
}
storage.setItem('showConcart', 0) // 隐藏客服按钮

if (storage.getItem('isLogin') == undefined || storage.getItem('isLogin') == null) {
  storage.setItem('isLogin', false) // 设置是否登录初始值
}



//页面跳转 回到顶部
router.afterEach((to, from, next) => {
  // window.scrollTo(0, 0);
  window.localStorage.setItem('showFooter', true)
});

// let pagescreenHeight = ''
// if (window.plus) {
//   pagescreenHeight = window.screen.availHeight - window.plus.navigator.getStatusbarHeight()
// } else {
//   pagescreenHeight = window.screen.availHeight
// }

// 判断是否显示底部栏
/*window.addEventListener('resize', function() {
  let screenHeight = ''
  if(window.plus){
    screenHeight = window.screen.availHeight - window.plus.navigator.getStatusbarHeight()
  }else{
    screenHeight = window.screen.availHeight
  }
  if(window.innerHeight < pagescreenHeight){
    if(router.history.current.path.indexOf('addCard')!=-1){
      if(document.querySelector('.invalid') != null){
        document.querySelector('.invalid').style.display = 'none'
      }
    }
    if(router.history.current.path.indexOf('editAddr')!=-1){
      if(document.querySelector('.invalid') != null){
        document.querySelector('.invalid').style.display = 'none'
      }
    }
  }else{
    if(router.history.current.path.indexOf('editAddr')!=-1){
      if(document.querySelector('.invalid') != null){
        document.querySelector('.invalid').style.display = 'block'
      }
    }
    if(router.history.current.path.indexOf('addCard')!=-1){
      if(document.querySelector('.invalid') != null){
        document.querySelector('.invalid').style.display = 'block'
      }
    }
  }
  if (window.innerHeight < screenHeight) {
    console.log("隐藏底部栏")
    if(document.querySelector('.nav-footer') != null){
      document.querySelector('.nav-footer').style.display = 'none'
    }
    if(router.history.current.path.indexOf('car')!=-1){
      if(document.querySelector('.car_edit_more') != null){
        document.querySelector('.car_edit_more').style.display = 'none'
      }
      if(document.querySelector('.car_score') != null){
        document.querySelector('.car_score').style.display = 'none'
      }
    }
  } else {
    if(document.querySelector('.nav-footer') != null){
      document.querySelector('.nav-footer').style.display = 'block'
    }
    if(router.history.current.path.indexOf('car')!=-1){
      if(document.querySelector('.car_edit_more') != null){
        document.querySelector('.car_edit_more').style.display = 'flex'
      }
      if(document.querySelector('.car_score') != null){
        document.querySelector('.car_score').style.display = 'flex'
      }
    }
    if(router.history.current.path.indexOf('editAddr')!=-1){
      if(document.querySelector('.invalid') != null){
        document.querySelector('.invalid').style.display = 'block'
      }
    }
    if(router.history.current.path.indexOf('addCard')!=-1){
      if(document.querySelector('.invalid') != null){
        document.querySelector('.invalid').style.display = 'block'
      }
    }
   
  }
}, false)*/

/**
 *监听浏览器点击返回前进操作动画
 *浏览器端使用需要注意路由path的创建，二级应该在一级的基础上添加
 *如一级/Home，则二级为/Home/Detail，依次往后加，如果是app的话可忽略以下代码
 */
let init = 0
window.addEventListener('popstate', function (e) {
  init++
  if (init < 2) {
    router.beforeEach((to, from, next) => {
      console.log(to)
      let arr1 = to.path.split('/')
      let arr2 = from.path.split('/')
      if (arr1.length === 2) {
        if (arr1[1].length === 0) {
          arr1.splice(1, 1)
        }
      }
      if (arr2.length === 2) {
        if (arr2[1].length === 0) {
          arr2.splice(1, 1)
        }
      }
      if (arr1.length < arr2.length) {
        router.togoback()
      } else {
        router.togoin()
      }
      next()
    })
  }
}, false)
let whiteRouter = ['/', '/login','/saleOrder','/myIncome','/shareMember','/inviteFans','/walletDetail','/myWallet', '/todayNew', '/customerDetail', '/historyEarnings', '/returnsDetailed', '/network', '/other', '/set', '/index', '/hotPush', '/findDetail', '/typeList', '/car', '/proList', '/flashSale', '/tryOut', '/myGroupBy', '/lottery', '/proDetail', '/proDetailRec', '/tryDetail', '/scanCode', '/groupResult', '/vipBirthday', '/giftPackage', '/newPeople', '/newPeopleDetail', '/myCard', '/cashWithDrawal', '/addCard', '/activityList', '/phoneLogin', '/bind', '/protocol', '/noticeDetail', '/guidePage', '/err']
let yellowRouter = ['/fansList', '/poster']
let yellowRouter1 = ['/shoper']
let darkRouter = ['/asShoper']
let redRouter = ['/mySignIn']
let blueRouter = ['/chat']
// 登录白名单
let whiteLogin = ['/', '/network', '/login', '/index', '/hotPush', '/member', '/proList', '/findDetail', '/flashSale', '/tryOut', '/myGroupBy', '/type', '/other', '/set', '/lottery', '/scanCode', '/groupResult', '/search', '/activityList', '/phoneLogin', '/bind', '/protocol', '/proDetail', '/typeList', '/proDetailRec', '/err', '/guidePage']

router.beforeEach((to, from, next) => {
  window.localStorage.setItem('showFooter', false)
  setTimeout(function () {
    console.log('判断是否登录' + storage.getItem('isLogin'))
    if (whiteRouter.indexOf(to.path) !== -1) {
      console.log('白色主题')
      if (window.plus) {
        let plus = window.plus
        plus.navigator.setStatusBarBackground('#f9f9f9')
        window.plus.navigator.setStatusBarStyle('dark')
      }
    } else if (darkRouter.indexOf(to.path) !== -1) {
      console.log('黑色主题')
      if (window.plus) {
        let plus = window.plus
        plus.navigator.setStatusBarBackground('#000000')
        window.plus.navigator.setStatusBarStyle('light')
      }
    } else if (yellowRouter.indexOf(to.path) !== -1) {
      console.log('黄色主题')
      if (window.plus) {
        let plus = window.plus
        plus.navigator.setStatusBarBackground('#f3c0a2')
        window.plus.navigator.setStatusBarStyle('dark')
      }
    } else if (yellowRouter1.indexOf(to.path) !== -1) {
      console.log('会员黄色主题')
      if (window.plus) {
        let plus = window.plus
        plus.navigator.setStatusBarBackground('#FCD9BB')
        window.plus.navigator.setStatusBarStyle('dark')
      }
    } else if (redRouter.indexOf(to.path) !== -1) {
      console.log('签到红色主题')
      if (window.plus) {
        let plus = window.plus
        plus.navigator.setStatusBarBackground('#ec346A')
        window.plus.navigator.setStatusBarStyle('light')
      }
    } else if (blueRouter.indexOf(to.path) !== -1) {
      console.log('签到红色主题')
      if (window.plus) {
        let plus = window.plus
        plus.navigator.setStatusBarBackground('#09aeb0')
        window.plus.navigator.setStatusBarStyle('light')
      }
    } else {
      console.log('其余紫红色主题')
      if (window.plus) {
        let plus = window.plus
        plus.navigator.setStatusBarBackground('#ff4e79')
        window.plus.navigator.setStatusBarStyle('light')
      }
    }
    if (window.plus) {
      let plus = window.plus
      if (plus.networkinfo.getCurrentType() != plus.networkinfo.CONNECTION_UNKNOW && plus.networkinfo.getCurrentType() != plus.networkinfo.CONNECTION_NONE) {
        console.log('当前有网络')
        storage.setItem('network', true)
      }
    }
    if (storage.getItem('network') == false || storage.getItem('network') == 'false') {
      router.push({
        path: '/network'
      })
    } else {
      if (whiteLogin.indexOf(to.path) == -1 && (storage.getItem('isLogin') === 'false' || storage.getItem('isLogin') === false)) {
        window.plus.nativeUI.confirm('您当前未登录，是否立即前往登录', function (e) {
          if (e.index === 0 || e.index === '0') {
            router.push({
              path: '/login?back=1'
            })
          } else {
            router.go(-1)
          }
        }, {
          'title': '提示',
          'buttons': ['确定', '取消'],
          'verticalAlign': 'center'
        })
      }
    }

  }, 100)
  next()
})

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    console.log(targetPath)
    location.reload();
    // router.replace(targetPath);
  }
});


var xhr = null;
let wgtVer = '';
let minVer = '';
let HighVer = '';
if (window.plus) {
  console.log('校验通过是app')
  plusReady();
} else {
  document.addEventListener('plusready', plusReady, false)
}

function plusReady() {
  // 判断当前是否有网络
  if (plus.networkinfo.getCurrentType() != plus.networkinfo.CONNECTION_UNKNOW && plus.networkinfo.getCurrentType() != plus.networkinfo.CONNECTION_NONE) {
    console.log('当前有网络')
    window.localStorage.setItem('network', true)
  }
  // 获取本地应用资源版本号  
  plus.runtime.getProperty(plus.runtime.appid, function (inf) {
    wgtVer = inf.version
    console.log('设备信息')
    console.log(inf)
    console.log("当前应用版本：" + wgtVer);
    storage.setItem('version_code', wgtVer)
  });

  // 页面加载时触发  获取应用标识
  setTimeout(function(){
    var pinf = plus.push.getClientInfo();
    var cid = pinf.clientid; //客户端标识  
    console.log("获取客户端标识cid")
    console.log(pinf)
    console.log(cid)
    if(cid!=null){
      window.localStorage.setItem('cid',cid)
    }
  },100)

  //监听系统通知栏消息点击事件  
  plus.push.addEventListener('click', function (msg) {
    //处理点击消息的业务逻辑代码  
    console.log('点击消息栏通知')
    router.togo({
      path: '/walletDetail'
    })
    console.log(msg)
  }, false);
  //监听接收透传消息事件  
  plus.push.addEventListener('receive', function (msg) {
    //处理透传消息的业务逻辑代码  
    console.log('处理透传消息')
    console.log(msg)
    console.log(msg.title)
    // let info = JSON.parse(msg.content)
    // console.log(info)
    // window.plus.nativeUI.confirm(info.body, function (e) {
    //   if (e.index > 0) {
    //     console.log("点击取消了")
    //   } else {
    //     if(info.type=='benefits'){
    //       router.togo({
    //         path: '/myWallet'
    //       })
    //     }
    //   }
    // }, {
    //   'title': msg.title,
    //   'buttons': ['立即前往', '取消'],
    //   'verticalAlign': 'center'
    // })
  }, false);

  sendXhr()
  // Android处理返回键
  plus.key.addEventListener('backbutton', function () {
    console.log(router)
    let num = parseInt(storage.getItem('routeNum'))
    if (num > 1) {
      --num;
      storage.setItem('routeNum', num);
      storage.setItem('routeLeft', 'false');
      storage.setItem('routeRight', 'true');
      if (router.history.current.path.indexOf('proDetail') != -1 || router.history.current.path.indexOf('proDetailRec') != -1 || router.history.current.path.indexOf('newPeopleDetail') != -1) {
        console.log("从商品详情页返回")
        window.localStorage.setItem('backDetail', true)
      }
      router.go(-1);
    } else {
      window.plus.nativeUI.confirm('确定退出？', function (e) {
        if (e.index > 0) {
          console.log("点击取消了")
        } else {
          storage.setItem('noUpdate', 0)
          plus.runtime.quit();
        }
      }, {
        'title': '公主购',
        'buttons': ['确定', '取消'],
        'verticalAlign': 'center'
      })
    }

  }, false);
  // }
  // 关闭启动界面
  // plus.navigator.setStatusBarBackground('#F3F3F3');
  setTimeout(function () {
    plus.navigator.closeSplashscreen();
  }, 200);
}

function sendXhr() {
  // 后台获取最低版本号，和最新版本号
  if (xhr) {
    return;
  }
  xhr = new plus.net.XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        let res = JSON.parse(xhr.responseText)
        if (res.isSuccess) {
          console.log(res.data.apk)
          minVer = res.data.apk.after_versions
          HighVer = res.data.apk.new_versions
          console.log("最低版本" + minVer)
          console.log("最新版本" + HighVer)
          console.log("当前版本" + wgtVer)
          // compareVersion 版本比较，相等为0 ,-1是小于，1是大于
          // 判断是否版本更新
          isUpdate()
        }
      } else {
        console.log("xhr请求失败：" + xhr.status)
      }
    }
  }
  // 初始化HTTP请求
  xhr.open("GET", process.env.BASE_URL + "?m=index&a=appversions");
  xhr.send();

}

function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

function isUpdate() {
  console.log('最低版本和当前版本比较' + compareVersion(wgtVer, minVer))
  console.log('最新版本和当前版本比较' + compareVersion(wgtVer, HighVer))
  if (compareVersion(wgtVer, minVer) == -1) {
    console.log('当前版本小于最低版本')
    // 当前版本小于最低版本
    window.plus.nativeUI.confirm('当前运行的版本过低，请立即升级！', function (e) {
      if (e.index > 0) {
        // 选择退出
        plus.runtime.quit();
      } else {
        downloadApp()
      }
    }, {
      'title': '提示',
      'buttons': ['升级', '退出'],
      'verticalAlign': 'center'
    })
  } else if (compareVersion(wgtVer, HighVer) == -1) {
    console.log('可以更新版本了')
    if (storage.getItem('noUpdate') != 1) {
      // 可以更新版本了
      window.plus.nativeUI.confirm('当前应用有新版本了，是否更新？', function (e) {
        if (e.index > 0) {
          console.log("点击取消了")
          storage.setItem('noUpdate', 1)
        } else {
          downloadApp()
        }
      }, {
        'title': '提示',
        'buttons': ['确定', '取消'],
        'verticalAlign': 'center'
      })
    }

  } else {
    // 当前版本大于最新发布版本
    console.log('当前版本大于等于最新发布版本')
  }
}

function downloadApp() {
  var wgtUrl = "https://share.gongzhugou.com/xcx_apk/xcx_android.apk" // 下载文件地址  
  plus.nativeUI.showWaiting("安装包正在下载...");
  plus.downloader.createDownload(wgtUrl, {
    filename: "_doc/update/"
  }, function (d, status) {
    if (status == 200) {
      console.log("下载wgt成功：" + d.filename);
      plus.nativeUI.showWaiting("应用正在更新...");
      plus.runtime.install(d.filename, {}, function () {
        plus.nativeUI.closeWaiting();
        // 未安装直接重启
        plus.runtime.restart();
        // plus.nativeUI.alert("应用资源更新完成！立即重启", function () {
        //   plus.runtime.restart();
        // });
      }, function (e) {
        plus.nativeUI.closeWaiting();
        plus.nativeUI.alert("安装更新文件失败[" + e.code + "]：" + e.message);
      });
    } else {
      //console.log("下载wgt失败！");  
      plus.nativeUI.alert("下载更新失败！请前往下载最新的应用！", function () {
        plus.runtime.openURL(wgtUrl)
      });
    }
    plus.nativeUI.closeWaiting();
  }).start();
}

document.addEventListener("netchange", function () {
  //网络状态变化
  var types = {};
  types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
  types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
  types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
  types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
  types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
  types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
  types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
  console.log(" 切换网络：" + types[plus.networkinfo.getCurrentType()])
  console.log(plus.networkinfo.CONNECTION_NONE)
  console.log(plus.networkinfo.CONNECTION_CELL4G)
  console.log(plus.networkinfo.CONNECTION_WIFI)
  console.log(plus.networkinfo.CONNECTION_UNKNOW)
  if (router.history.current.path.indexOf('index') != -1) {
    if (plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
      storage.setItem('network', false)
      router.push({
        path: '/network'
      })
      // window.plus.nativeUI.confirm('您的网络暂时不可用，请前往设置开启网络！', function (e) {
      //   console.log("没网了")
      //   plus.nativeUI.closeWaiting()
      //   if(e.index>0){

      //   }else{
      //     router.push({
      //       path: '/network'
      //     })
      //   }
      // }, {
      //   'title': '提示',
      //   'buttons': ['前往设置', '取消'],
      //   'verticalAlign': 'center'
      // })
    } else if (plus.networkinfo.getCurrentType() != plus.networkinfo.CONNECTION_UNKNOW) {
      console.log("有网络啦~")
      storage.setItem('network', true)
      isUpdate()
    }
  } else {
    if (plus.networkinfo.getCurrentType() != plus.networkinfo.CONNECTION_UNKNOW && plus.networkinfo.getCurrentType() != plus.networkinfo.CONNECTION_NONE) {
      console.log("有网络啦~")
      storage.setItem('network', true)
      isUpdate()
    }
  }

}, false);

Vue.use(Mint)
Vue.use(Vuex)
Vue.config.productionTip = false
FastClick.attach(document.body)





new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
