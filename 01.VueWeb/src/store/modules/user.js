import { loginByUsername, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken, removeCookie } from '@/utils/auth'

const user = {
  state: {
    userInfo: {},
    status: '',
    code: '',
    unReads: 0,
    helpShow: false,
    dockingShow: false,
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    menubarRouters: { children: [], full: true },
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_USERINFO: (state, code) => {
      state.userInfo = code
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_UNREADS: (state, code) => {
      state.unReads = code
    },
    SET_HELPSHOW: (state, code) => {
      state.helpShow = code
    },
    SET_DOCKINGSHOW: (state, code) => {
      state.dockingShow = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SWITCHMENUBAR: (state, val) => {
      // 切换内容导航
      state.menubarRouters = val
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      console.log(userInfo)
      const account = userInfo.account.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(account, userInfo.password).then(response => {
          if (response.data.code === 200) {
            const data = response.data
            commit('SET_TOKEN', data.token)
            setToken(response.data.token)
            resolve()
          } else {
            reject('err: roles must be a non-null array !')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data

          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }

          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 用户主动登出
    LogOut({ commit, state }) {
      commit('SET_TOKEN', '')
      removeCookie('crm_token')
      removeCookie('crm_account')
      window.localStorage.removeItem('changePwd')
      window.localStorage.removeItem('roleList')
      window.localStorage.removeItem('username')
      removeToken()
      // return new Promise((resolve, reject) => {
      //   logout(state.token).then(() => {
      //     commit('SET_TOKEN', '')
      //     commit('SET_ROLES', [])
      //     window.localStorage.removeItem('changePwd')
      //     window.localStorage.removeItem('roleList')
      //     window.localStorage.removeItem('username')
      //     removeCookie('crm_token')
      //     removeCookie('crm_account')
      //     removeToken()
      //     resolve()
      //   }).catch(error => {
      //     reject(error)
      //   })
      // })
    },

    // token失效前端被动登出或修改密码主动退出
    FedLogOut({ commit }) {
      commit('SET_TOKEN', '')
      removeCookie('crm_token')
      removeCookie('crm_account')
      window.localStorage.removeItem('changePwd')
      window.localStorage.removeItem('roleList')
      window.localStorage.removeItem('username')
      removeToken()
      // return new Promise(resolve => {
      //   commit('SET_TOKEN', '')
      //   removeCookie('crm_token')
      //   removeCookie('crm_account')
      //   window.localStorage.removeItem('changePwd')
      //   window.localStorage.removeItem('roleList')
      //   window.localStorage.removeItem('username')
      //   removeToken()
      //   resolve()
      // })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
