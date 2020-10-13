import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@/utils/auth' // getToken from cookie

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration
const routeList = router.options.routes

// 按钮权限
function btnPermission(btnKey) {
  let roleInfo = []
  if (window.localStorage.getItem('roleList') !== null && window.localStorage.getItem('roleList') !== undefined) {
    roleInfo = JSON.parse(window.localStorage.getItem('roleList'))
  }
  return roleInfo.includes(btnKey)
}
// 字段判空
function nullStyle(btnKey) {
  if (btnKey == '' || btnKey == 'null' || btnKey == 'undefined' || btnKey == null || btnKey == undefined) {
    return true
  } else {
    return false
  }
}
const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
router.beforeEach((to, from, next) => {
  console.log('2019-05-24,9:07')
  NProgress.start() // start progress bar
  if (getToken()) { // determine if there has token
    console.log(store.getters.permission_routers)
    if (store.getters.permission_routers === undefined) {
      // 路由权限
      for (const i in routeList) {
        if (window.localStorage.getItem('roleList') !== null && window.localStorage.getItem('roleList') !== undefined) {
          const roleInfo = JSON.parse(window.localStorage.getItem('roleList'))
          routeList[i].hidden = false
          if (routeList[i].children !== undefined) {
            if (routeList[i].children.length > 0) {
              let flag = true
              for (const j in routeList[i].children) {
                if (routeList[i].children[j].key !== undefined) {
                  routeList[i].children[j].hidden = !roleInfo.includes(routeList[i].children[j].key)
                  if (routeList[i].children[j].hidden === false) {
                    flag = false
                  }
                }
              }
              if (flag) {
                routeList[i].hidden = true
              }
            }
          }
          store.commit('SET_ROUTERS', routeList)
        }
      }
    }
    // console.log(window.localStorage.getItem('changePwd'))
    if (to.path === '/dashboard') {
      // if (window.localStorage.getItem('reload') === '1') {
      //   window.location.reload()
      //   window.localStorage.setItem('reload', '0')
      // }
      if (window.localStorage.getItem('changePwd') === '1') {
        next({
          path: '/usercenter/changepassword'
        })
      } else {
        next()
      }
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else if (to.path === '/usercenter/changepassword') {
      next()
      NProgress.done()
    } else {
      if (window.localStorage.getItem('changePwd') === '1') {
        next({
          path: '/usercenter/changepassword'
        })
      } else {
        next()
      }
      NProgress.done()
    }
    // }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})
router.afterEach(() => {
  NProgress.done() // finish progress bar
})

export {
  btnPermission,
  nullStyle
}
