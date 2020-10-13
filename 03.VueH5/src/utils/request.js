import axios from 'axios'
import store from '../store'
// import {
//   MessageBox
// } from 'mint-ui'
import router from '../router'
import Vue from 'vue'
// create an axios instance
let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = '/index.php'
} else {
  baseURL = process.env.BASE_URL
}
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
  retry: 100, // 请求次数
  retryInterval: 1, // 求期间隙
  timeout: 5000 // request timeout
})
// var storage = window.localStorage
// console.log(storage.getItem('token'), 'token')
let pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken
let removePending = (ever) => {
  for (let p in pending) {
    if (pending[p].u === ever.url + '&' + ever.method) { // 当当前请求在数组中存在时执行函数体
      pending[p].f() // 执行取消操作
      pending.splice(p, 1) // 把这条记录从数组中移除
    }
  }
}
// 封装请求拦截
service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // config.headers['Token'] = storage.getItem('token')
    console.log(store)
    config.cancelToken = new axios.CancelToken(function (cancel) {
      store.commit('app/pushToken', {cancelToken: cancel})
    })
    console.log(config)
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
    if (response.status === 200) {
        // 请求成功
        const res = response.data
        if (res.status === 'success') {
          return res
        }
        if (res.code === 200 || res.code === '200') {
          return res
        }
        if(res.code===201|| res.code === '201'){
          router.push({
            path:'/warning'
          })
        }
        if(res.code===202 || res.code === '202'){
          router.push({
            path:'/error?msg=当前登录状态已失效，请关闭重试'
          })
        }
        if(res.code===0 || res.code === '0'){
          // router.push({
          //   path:'/error?msg=' + res.msg
          // })
          return res
        }
        return response
      } else {
        // Message({
        //   message: '请求错误',
        //   type: 'error',
        //   duration: 1000
        // })
      }
      return response
  },
  // error => {
  //   console.log('err' + error)
  //   /* AlertModule.show({
  //     title: '提示',
  //     content: token
  //   }) */
  //   return Promise.reject(error)
  // }
  function axiosRetryInterceptor(error) {
    var config = error.config
    console.log(config)
    // 如果配置不存在或重试属性未设置，抛出promise错误
    if (!config || !config.retry) {
      console.log('如果配置不存在或重试属性未设置，抛出promise错误')
      return Promise.reject(error)
    }

    // 检查重新请求的次数是否超过我们设定的请求次数
    config.retryCount = config.retryCount || 0

    // 检查重新请求的次数是否超过我们设定的请求次数
    if (config.retryCount >= config.retry) {
      console.log(config.retryCount)
      console.log(config.retry)
      // Reject with the error
      return Promise.reject(error)
    }
    console.log('超时重连的机制里执行一下取消操作')
    removePending(config) // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    // 重新请求的次数自增
    config.retryCount += 1
    // 创建新的Promise来处理重新请求的间隙
    var backoff = new Promise(function (resolve) {
      console.log('接口' + config.url + '请求超时，重新请求')
      // Indicator.open({
      //   text: '正在排队中，请耐心等待...',
      //   spinnerType: 'fading-circle'
      // })
      // console.log(config.retryInterval)
      // setTimeout(function() {
      //   resolve()
      // }, config.retryInterval || 1)
      let msg = "网络超时，请稍后重试~"
      let cancelBtn = '返回上一页'
      let sureBtn = '返回上一页'
      if(config.method == 'POST'){
        msg = "网络超时，请稍后重试~"
        cancelBtn = '返回上一页'
        sureBtn = '确定'
      }else{
        msg="网络超时，请刷新重试~"
        cancelBtn = '回首页'
        sureBtn = '刷新'
      }
      Vue.$vux.confirm.show({
        title: '提示',
        content: msg,
        cancelText: cancelBtn,
        confirmText: sureBtn,
        onCancel () {
          console.log('点击取消')
          if(config.method == 'post'){
            console.log(config.method+'返回上一页')
            router.back(-1)
          }else{
            console.log(config.method+'去首页')
            router.push({
              path:'/main/index'
            })
          }

        },
        onConfirm () {
          console.log('点击确定')
          if(config.method == 'post'){
            console.log(config.method+'隐藏提示')
          }else{
            console.log(config.method+'刷新')
            resolve()
          }
        }
      })
      // AlertModule.show({
      //   title: '提示',
      //   content: '网络超时，请稍后再试！',
      //   showCancelButton:false,
      //   onHide () {
      //     console.log('点击确定重连')
      //     resolve()
      //   }
      // })
    })

    // 返回axios的实体，重试请求
    return backoff.then(function () {
      config.url = config.url.replace(baseURL, '')
      console.log(config)
      if (config.data != '') {
        let obj = {}
        console.log(config.data)
        let arr = config.data.split('&')
        for (let i in arr) {
          obj[decodeURIComponent(arr[i].split('=')[0])] = decodeURIComponent(arr[i].split('=')[1])
        }
        console.log(obj)
        config.data = obj
      }
      return service(config)
    })
  }
)

export default service
