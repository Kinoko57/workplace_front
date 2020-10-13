import axios from 'axios'
// import store from '../store'
// import {
//   setToken
// } from '../store/auth'
import {
  MessageBox,
  Indicator
} from 'mint-ui'
import router from '../router'
// create an axios instance
let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = '/api'
} else {
  baseURL = process.env.BASE_URL
}
// 创建axios实例
const service = axios.create({
  baseURL, // api 的 base_url
  withCredentials: true,
  transformRequest: [function (data) {
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    ret = ret.substring(0, ret.length - 1)
    return ret
  }],
  // 设置全局的请求次数，请求的间隙
  retry: 4, // 请求次数
  retryInterval: 3000, // 求期间隙
  timeout: 10000 // request timeout
})
var storage = window.localStorage
console.log('打印token')
console.log(storage.getItem('token'), 'token')

// 封装请求拦截
service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // config.headers['Cookie'] = ''
    config.headers['Token'] = storage.getItem('token')
    if (storage.getItem('token') === null) {
      config.headers['Cache-Control'] = 'no-cache' // 是浏览器通知服务器：本地没有缓存数据
    }
    // if (storage.getItem('token') != null) { // 如果token不为null，否则传token给后台
    //   config.headers['Token'] = storage.getItem('token')
    // } else {
    //   console.log('清空Token')
    //   config.headers['Token'] = ''
    // }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
// respone拦截器 封装响应拦截，判断token是否过期
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    if (response.isSuccess) {
      return response.data
    }
    const res = response.data
    if (res.isSuccess) {
      return response.data
    } else {
      if (res.isLogin === false) {
        // storage.clear()
        // console.log(storage)
        // storage.setItem('token', null)
        // storage.setItem('isLogin', false)
        // storage.setItem('routeLeft', 'true')
        // storage.setItem('routeRight', 'false')
        // storage.setItem('showGuide', 1)
        // storage.setItem('noUpdate', 1)
        // storage.setItem('bindCid', null)
        storage.setItem('isLogin', false)
        // router.push({
        //   path: '/login?back=1'
        // })
        // window.location.reload()
        // window.plus.nativeUI.confirm('您的登录状态失效了，请前往重新登录', function (e) {
        //   if (e.index === 0 || e.index === '0') {
        //     router.push({
        //       path: '/login?back=1'
        //     })
        //     window.location.reload()
        //   }
        // }, {
        //   'title': '提示',
        //   'buttons': ['确定', '取消'],
        //   'verticalAlign': 'center'
        // })
        // MessageBox({
        //   title: '提示',
        //   message: '您当前未登陆，是否立即前往登陆?',
        //   showCancelButton: true,
        //   closeOnClickModal: false
        // }).then(config => {
        //   if (config === 'confirm') {
        //     router.push({
        //       path: '/login?back=1'
        //     })
        //     window.location.reload()
        //   }
        // })
      }
      // var url = location.href.split('/')
      // if (res.isLogin === false && url[url.length - 1] !== 'member') {
      //   MessageBox({
      //     title: '提示',
      //     message: '您当前未登陆，是否立即前往登陆?',
      //     showCancelButton: true,
      //     closeOnClickModal: false
      //   }).then(config => {
      //     if (config === 'confirm') {
      //       router.push({
      //         path: '/login'
      //       })
      //     }
      //   })
      // }
    }
    return response.data
  },
  function axiosRetryInterceptor(error) {
    var config = error.config
    // 如果配置不存在或重试属性未设置，抛出promise错误
    if (!config || !config.retry) return Promise.reject(error)

    // 检查重新请求的次数是否超过我们设定的请求次数
    config.retryCount = config.retryCount || 0

    // 检查重新请求的次数是否超过我们设定的请求次数
    if (config.retryCount >= config.retry) {
      console.log(config.retryCount)
      console.log(config.retry)
      // Reject with the error
      return Promise.reject(error)
    }

    // 重新请求的次数自增
    config.retryCount += 1

    // 创建新的Promise来处理重新请求的间隙
    var backoff = new Promise(function(resolve) {
      console.log('接口' + config.url + '请求超时，重新请求')
      if (document.querySelector('.nav-footer') != null) {
        document.querySelector('.nav-footer').style.display = 'block'
      }
      Indicator.close()
      if (storage.getItem('network') == true || storage.getItem('network') == 'true') {
        MessageBox({
          title: '提示',
          message: '网络超时，请稍后再试！',
          showCancelButton: false,
          closeOnClickModal: false
        }).then(config => {
          if (config === 'confirm') {
            console.log('点击确定重连')
            setTimeout(function() {
              resolve()
            }, config.retryInterval || 1)
          }
        })
      }
    })

    // 返回axios的实体，重试请求
    return backoff.then(function() {
      console.log(config)
      return axios(config)
    })

    // console.log('err' + error)
    // console.log(typeof error)
    // console.log(error + '')
    // let msg = error + ''
    // if (msg.indexOf('timeout') != -1) {
    //   // if (document.querySelector('.nav-footer') != null) {
    //   //   document.querySelector('.nav-footer').style.display = 'block'
    //   // }
    //   Indicator.close()
    //   MessageBox({
    //     title: '提示',
    //     message: '网络超时，请稍后再试！',
    //     showCancelButton: true,
    //     closeOnClickModal: false
    //   }).then(config => {
    //     if (config === 'confirm') {
    //       console.log(router.history.current)
    //       console.log('自动重连')
    //     }
    //   })
    // }
    // return Promise.reject(error)
  }
)

export default service
