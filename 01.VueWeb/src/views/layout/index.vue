<template>
  <div class="app-wrapper">
    <!-- -->
    <div class="main_scroll">
      <headbar/>
      <div v-if="$route.path!='/dashboard/index'" class="app-body">
        <layout/>
      </div>
      <div v-else class="app-body app-dashboard">
        <dashboard/>
      </div>

    </div>
  </div>
</template>

<script>
import { Layout, Headbar, ThreeLevelView, menubar } from './components'
import Dashboard from '@/views/dashboard/index.vue'
export default {
  name: 'Box',
  components: {
    Dashboard,
    Headbar,
    Layout,
    ThreeLevelView,
    menubar
  },
  mounted() {
    console.log(this.$route.path)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-wrapper {
  height: calc(100vh - 100px);
  position: relative;
  top: 70px;
  width: 100%;
  .main_scroll {
  height: calc(100vh - 100px);
  // overflow-y: scroll;
  .app-body{
    height: calc(100vh - 100px);
    position: absolute;
    top: 20px;
    width: 100%;
    min-width: 1024px;
    // left: 50%;
    // transform: translateX(-50%);
    padding: 0 100px;
  }
  .app-dashboard{
    position: relative;
  }
  // &.mobile.openSidebar {
  //   position: fixed;
  //   top: 0;
  // }
  .main-scroll-menu{
    overflow: scroll;
    overflow-x: hidden;
    height: calc( 100vh - 70px);
  }
  }
}
</style>
