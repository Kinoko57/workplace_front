<template>
    <div>
      <!-- <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header> -->
      <!-- <return-top @returnTop='goTop'></return-top> -->
      <!-- <div style='height:0.9rem'></div> -->
      <iframe :src="openUrl" class="chat_bg"></iframe>
    </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  Toast
} from 'mint-ui'
export default {
  name: 'Chat',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Toast
  },
  data() {
    return {
      h_title: '公主购',
      openUrl: '',
      head_color: {
        background: '#09aeb0',
        color: '#fff'
      }
    }
  },
  mounted() {
    //   #09aeb0
    // Indicator.open('加载中...')
    let System = window.plus
    if (System) {
      System.navigator.setStatusBarBackground('#09aeb0')
      System.navigator.setStatusBarStyle('light')
    }
    console.log(this.$route.params)
    let opt = this.$route.params
    console.log(opt)
    let url = opt.url + '?sysNum=' + opt.sysNum
    for (let i in opt) {
      if (i != 'url') {
        url += '&' + i + '=' + opt[i]
      }
    }
    this.openUrl = url
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~styles/index.less';
@import '~styles/variable.less';
.chat_bg{
    width: 100%;
    // height: calc(100vh - 0.9rem);
    height: 100vh;
}
.wrap .header-back{
  display: block;
}
.wrap .header-back .tabbar-status-close{
  display: block;
}
</style>
