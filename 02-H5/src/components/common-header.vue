<template>
  <div class="header-box" :style='bgcolor'>
     <!-- :class="{'kefu-style':showleft}" -->
    <div class="left-icon">
      <span v-if="showback" @click="back" class="iconfont icon-jiantouarrowhead7" :style='bgcolor'></span>
      <!-- <span v-if="showleft"  class="zhiCustomBtn" @click="openConcart" style='background: rgb(255, 78, 121);color: rgb(255, 255, 255);display: inline-flex;align-items: center;'>
        <img :src="icon" alt="" srcset="">
      </span> -->
    </div>
    <div class="header-tittle">
      <span v-if="showinput">
        <cus-input></cus-input>
      </span>
      <span v-if="!showinput" class="title_content">{{h_title}}</span>
    </div>
    <div class="right-icon" :class="{'kefu-style':showleft}">
      <span v-if="showmore" class="iconfont icon-shezhi2" @click='goSet'></span>
      <span v-if="showrtext" @click='goright'>{{r_title}}</span>
      <!-- background: rgb(255, 78, 121); -->
      <span v-if="showleft"  class="zhiCustomBtn" @click="openConcart" style='color: rgb(255, 255, 255);display: inline-flex;align-items: center;'>
        <img :src="icon" alt="" srcset="">
      </span>
    </div>
  </div>
</template>

<script>
import cusInput from 'common/cus-input'
import kefuIcon from '@/assets/img/icon_kefu.png'
export default {
  data() {
    return {
      icon: kefuIcon,
      userInfo: {}
    }
  },
  props: {
    showright: {
      type: Boolean,
      default: false
    },
    showleft: {
      type: Boolean,
      default: false
    },
    showinput: {
      type: Boolean,
      default: false
    },
    h_title: {
      type: String,
      default: '标题'
    },
    r_title: {
      type: String,
      default: '副标题'
    },
    showback: {
      type: Boolean,
      default: true
    },
    showmore: {
      type: Boolean,
      default: false
    },
    showrtext: {
      type: Boolean,
      default: false
    },
    bgcolor: {
      type: Object,
      default: function() {
        return {
          background: '#ff4e79',
          color: '#ffffff'
        }
      }
    }
  },
  mounted() {
    this.userInfo = this.$store.state.home.userInfo
  },
  methods: {
    back() {
      this.$router.goBack()
    },
    goSet() {
      this.$router.togo({
        path: '/set'
      })
    },
    goright() {
      this.$emit('goright')
    },
    openConcart() {
      this.$emit('concartAction')
      // console.log('展开聊天框')
      // console.log(this.userInfo)
      // var storage = window.localStorage
      // storage.setItem('leaveApp', true)
      // let plus = window.plus
      // if (window.plus != undefined) {
      //   plus.navigator.setStatusBarBackground('#f9f9f9')
      //   window.plus.navigator.setStatusBarStyle('dark')
      // }
      // let url =
      //     'https://www.sobot.com/chat/h5/index.html?sysNum=563069f6a21c4723b6a05d5ab9a6146d&back=1&titleFlag=1&uname=' +
      //     this.userInfo.nickname + '&face=' + this.userInfo.avatar + '&partnerId=' + this.userInfo.uid
      // window.open(url)
    }
  },
  components: {
    cusInput
  }
}

</script>

<style lang="less" scoped>
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .header-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.9rem;
    line-height: 0.9rem;
    font-size: @base-header-size;
    display: flex;
    z-index: 100;
    // padding: 0.1rem 0.26rem;
    .left-icon {
      position: relative;
      flex: 1;
      display: inline-flex;
      align-items: center;
      .iconfont{
        font-size: 0.42rem;
        padding-left: 0.03rem;
      }
    }
    .kefu-style{
      justify-content: center;
      img{
        width: 0.48rem;
      }
    }

    .header-tittle {
      flex: 3;
      text-align: center;
      line-height: 0.9rem;
    }
    .header-tittle .title_content{
      display: inline-block;
      width: 4.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center
    }
    .right-icon {
      position: relative;
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      .iconfont{
        font-size: 0.42rem;
        color: #fff;
      }
    }
  }

</style>
