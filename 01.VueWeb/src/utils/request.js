import axios from 'axios'
import {
  Message, MessageBox
} from 'element-ui'
import store from '@/store'
import { removeCookie, removeToken } from '@/utils/auth'
let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = '/index.php'
} else {
  baseURL = ''
  // process.env.BASE_API
}
// create an axios instance
const service = axios.create({
  baseURL, // api 的 base_url
  withCredentials: true,
  transformRequest: [function(data) {
    let ret = ''
    for (const it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    ret = ret.substring(0, ret.length - 1)
    return ret
  }],
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // Do something before request is sent
    // if (getCookie('token') !== undefined) {
    //   // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    //   config.headers['token'] = getCookie('token')
    // }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    // console.log(response)
    if (response.status === 200) {
      // 请求成功
      const res = response.data
      if (res.status === 'success') {
        return res
      }
      if (res.code === 200 || res.code === '200') {
        return res
      }
      if (res.code === '202') {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // store.dispatch('FedLogOut').then(() => {
          //   location.reload() // 为了重新实例化vue-router对象 避免bug
          // })
          removeCookie('crm_token')
          removeCookie('crm_account')
          removeToken()
          window.localStorage.removeItem('changePwd')
          window.localStorage.removeItem('roleList')
          window.localStorage.removeItem('username')
          window.localStorage.setItem('logout', 1)
          store.commit('SET_ROUTERS', undefined)
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
        return Promise.reject('error')
      }
      if (res.code === '201') {
        Message({
          message: '您当前没有权限访问，请联系管理员  ',
          type: 'error',
          duration: 2000
        })
        return Promise.reject('error')
      }
      return response
    } else {
      Message({
        message: '请求错误',
        type: 'error',
        duration: 1000
      })
    }
    return response
  },
  // response => {
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: '网络超时，请稍后刷新重试~',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
