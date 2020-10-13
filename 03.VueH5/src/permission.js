import router from './router'
import store from './store'

router.beforeEach(function (to, from, next) {
  // console.log(store)
  window.document.title = to.meta.title
  // store.commit('updateLoadingStatus', {isLoading: true})
  next()
})

router.afterEach(function (to) {
  // store.commit('updateLoadingStatus', {isLoading: false})
})