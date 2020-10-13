
const app = {
  namespaced: true,
  state: {
    device: 'desktop',
    Unread: '0',
    cancelTokenArr: [] // 取消请求token数组
  },
  mutations: {
    pushToken (state, payload) {
      state.cancelTokenArr.push(payload.cancelToken)
    },
    clearToken ({ cancelTokenArr }) {
      cancelTokenArr.forEach(item => {
        Indicator.close()
        item('路由跳转取消请求')
      })
      cancelTokenArr = []
    },
    //未读消息
    ADD_UNREAD:(state, code)=>{
      state.Unread = code
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar ({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice ({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    }
  }
}

export default app

