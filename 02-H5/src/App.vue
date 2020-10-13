<template>
  <div id="app">
    <transition :name="transitionName">
      <!-- IndexRoute -->
      <keep-alive :include="['IndexRoute','NewPeople','SureOrder','UseCoupon']">
        <router-view class="Router" :key="$route.fullPath" v-if="$route.path=='/sureOrder'||$route.path=='/useCoupon'"></router-view>
        <router-view class="Router" v-else></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
// import store from './store/'
export default {
  name: 'App',
  data() {
    return {
      transitionName: ''
    }
  },
  created() {
  },
  methods: {
  },
  watch: {
    $route(val) {
      console.log(val)
      console.log(window.localStorage.getItem('routeLeft'))
      console.log(window.localStorage.getItem('routeRight'))
      if (window.localStorage.getItem('routeLeft') === 'true') {
        this.transitionName = 'slideleft'
      } else {
        this.transitionName = 'slideright'
      }
    }
  }
}
</script>

<style lang="less">
@import "~styles/variable.less";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.Router {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: @body-bg-color;;
  transition: all .5s ease;
  -webkit-transition: all .5s ease;
  -moz-transition: all .5s ease;
}
.slideleft-enter,
 .slideright-leave-active {
  opacity: 1;
  transform: translate3d(90% 0, 0);
  -webkit-transform: translate3d(90%, 0, 0);
  -moz-transform: translate3d(90%, 0, 0);
}
.slideleft-leave-active,
.slideright-enter {
 opacity: 1;
 transform: translate3d(-90% 0, 0);
 -webkit-transform: translate3d(-90%, 0, 0);
 -moz-transform: translate3d(-90%, 0, 0);
}
</style>
