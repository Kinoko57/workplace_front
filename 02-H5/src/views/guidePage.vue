<template>
  <div>
    <div class="guide_bg" :hidden='isShow==false'>
      <div class="countdown">
          <ring-countdown :setTimer="3" @stopCount="returnIndex" :start="isShow" ref="child"></ring-countdown>
      </div>
      <img :src="showImg" class="guide_img" @click='goIndex' />
    </div>
  </div>
</template>
<script>
import RingCountdown from '@/components/ring-countdown.vue'
export default {
  name: 'GuidePage',
  components: {
    RingCountdown
  },
  data() {
    return {
      isTop: true,
      imgPath: process.env.FilE_URL,
      isShow: false,
      showImg: ''
    }
  },
  mounted() {
    console.log('广告页')
    var storage = window.localStorage
    storage.setItem('showAdv', 0)
    let options = this.$route.query
    if (options.img != undefined) {
      console.log('开始倒计时')
      this.isShow = true
      this.showImg = options.img
    } else {
      // 不符合条件且如果引导页没有
      this.$router.replace({
        path: '/index'
      })
    }
  },
  methods: {
    goIndex() {
      this.$refs.child.clear()
      this.$router.replace({
        path: '/index'
      })
    },
    returnIndex() {
      console.log('倒计时结束')
      this.$router.replace({
        path: '/index'
      })
    }
  }
}

</script>
<style lang="less" scoped>
  .guide_bg {
    position: relative;
    // width: 100%;
    height: 100vh;
    overflow-x: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
  }

  .countdown {
    position: absolute;
    right: 0;
    top: 0;
    height: 50px;
    width: 50px;
  }

  .countdown .prograss_bg {
    position: absolute;
    width: 40px;
    height: 40px;
  }

  .countdown .prograss_cansvas {
    width: 40px;
    height: 40px;
  }

  .guide_img {
    // width: 100%;
    height: 100%;
    vertical-align: middle;
    margin:  0 auto;

  }

</style>
