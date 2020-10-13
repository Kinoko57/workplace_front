<template>
  <div>
    <swiper :options="swiperOption" class='swiper_bg' v-show="hasData">
      <swiper-slide v-for="(item,index) in headBg" :key='index'><img :src="item.image_pc" class='swiper_bg_img' @click="imgLink(item)"></swiper-slide>
    </swiper>
  </div>
</template>

<script>
import img1 from '@/assets/img/guide/1.png'
import img2 from '@/assets/img/guide/2.png'
import img3 from '@/assets/img/guide/3.png'
import {
  getAdvImg,
  getVersions
} from '@/api/index'
import 'swiper/dist/css/swiper.css'
import {
  swiper,
  swiperSlide
} from 'vue-awesome-swiper'
import {
  InfiniteScroll,
  Indicator,
  Swipe,
  SwipeItem,
  Lazyload,
  Toast
} from 'mint-ui'
export default {
  name: 'NavigationPage',
  components: {
    swiper,
    swiperSlide,
    Swipe,
    SwipeItem,
    Lazyload,
    Toast,
    InfiniteScroll,
    Indicator
  },
  data() {
    return {
      hasData: false,
      swiperOption: {
        autoplay: 0,
        speed: 1000,
        loop: false
      },
      headBg: [{
        image_pc: img1,
        type: 0,
        link: ''
      },
      {
        image_pc: img2,
        type: 0,
        link: ''
      },
      {
        image_pc: img3,
        type: 1,
        link: '/index'
      }
      ]
    }
  },
  mounted() {
    // getVersions().then(res => {
    //   console.log(res)
    //   let wgtVer = '1.1.0'
    //   let minVer = res.data.apk.new_versions
    //   let HighVer = res.data.apk.after_versions
    //   console.log(wgtVer)
    //   console.log(minVer)
    //   console.log(HighVer)
    //   console.log(this.compareVersion(wgtVer, minVer))
    //   console.log(this.compareVersion(wgtVer, HighVer))
    // })
    console.log('引导页')
    var storage = window.localStorage
    console.log('是否显示引导页' + storage.getItem('showGuide'))
    if (storage.getItem('showGuide') == 0) {
      this.hasData = true
    } else {
      let that = this
      getAdvImg().then(res => {
        if (res.isSuccess) {
          console.log(res)
          if (res.data.length > 0) {
            // 跳转广告页
            that.$router.replace({
              path: '/guidePage?img=' + res.data[0]
            })
          } else {
            that.$router.replace({
              path: '/index'
            })
          }
        }
      })
    }
  },
  methods: {
    // compareVersion(v1, v2) {
    //   v1 = v1.split('.')
    //   v2 = v2.split('.')
    //   const len = Math.max(v1.length, v2.length)

    //   while (v1.length < len) {
    //     v1.push('0')
    //   }
    //   while (v2.length < len) {
    //     v2.push('0')
    //   }

    //   for (let i = 0; i < len; i++) {
    //     const num1 = parseInt(v1[i])
    //     const num2 = parseInt(v2[i])

    //     if (num1 > num2) {
    //       return 1
    //     } else if (num1 < num2) {
    //       return -1
    //     }
    //   }

    //   return 0
    // },
    imgLink(data) {
      if (data.type == 1) {
        var storage = window.localStorage
        storage.setItem('showGuide', 1)
        console.log('是否显示引导页' + storage.getItem('showGuide'))
        this.$router.replace({
          path: data.link
        })
      }
    }
  }
}

</script>
<style lang="less" scoped>
  .swiper_bg {
    height: 100%;
    background: #fff;
    overflow-y: scroll;
  }

  .swiper_bg_img {
    width: 7.5rem;
  }

</style>
