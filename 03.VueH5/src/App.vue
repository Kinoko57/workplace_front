<template>
  <div id="app">
    <!-- <div class="v_console_show" @click="v_console_click"></div> -->
    <!-- <loading v-model="isLoading"/> -->
    <router-view></router-view>
  </div>
</template>

<script>
  import {
    Loading
  } from 'vux'
  import {
    mapState
  } from 'vuex'
  export default {
    name: 'App',
    data() {
      return {
        v_console_num: 0,
      }
    },
    components: {
      Loading
    },
    computed: {
      ...mapState({
        // isLoading: state => state.route.isLoading
      })
    },
    created() {
      // setTimeout(function () {
      //   console.log('隐藏console')
      //   document.querySelector('#__vconsole').style.display = 'none'
      //   document.querySelector('#__vconsole .vc-switch').style.display = 'none'
      // }, 100)
    },
    methods: {
      // v_console_click() {
      //   this.v_console_num++
      //   console.log(this.v_console_num)
      //   if (this.v_console_num >= 4 && document.querySelector('#__vconsole')) {
      //     document.querySelector('#__vconsole').style.display = 'block'
      //     document.querySelector('#__vconsole .vc-switch').style.display = 'block'
      //     this.v_console_num = 0
      //     alert('01-15.1.0')
      //   }
      // }
    }
  }

</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/tap.less';

  #app {
    font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  body {
    // background-color: #f3f3f3;
    background-color: #f9f9f9;
  }

  html,
  body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }

  #__vconsole {
    display: none;
    .vc-switch{
      display: none;
    }
  }

  .v_console_show {
    position: fixed;
    top: 0;
    left: 0;
    height: 40px;
    width: 40px;
    z-index: 100;
  }

</style>
