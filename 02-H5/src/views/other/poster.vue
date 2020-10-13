<template>
  <div>
    <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header>
    <!-- <div id="qrcode" ref="qrcode" style="position:fixed;left:0;top:0;z-index:999;border:4px solid #f20;width:1.2rem;height:1.2rem"></div> -->
    <div class='poster' v-if="isShow">
      <div class='poster_bg'></div>
      <div class="poster_swiper" id="poster_swiper" style='height:100%'>
        <swiper :options="swiperOption" class="swiper_wraper" v-if="posterList.length > 0" ref="mySwiper">
          <swiper-slide class='wiper_item' v-for="(item,index) in posterList" :key="index">
            <div class="slide-image" ref="imageTofile">
                <div class='slide-content'>
                  <img :src="item.img" class='image' ref="active_bg_img"/>
                  <div class="m_info_login">
                    <img :src="avatar" class='m_avatar' mode='scaleToFill' @click='linkGo' ref="active_head_img"/>
                    <div class='m_info_title'>
                      <div class='m_info_name'>
                        <span>{{userInfo.nickname}}</span>
                      </div>
                    </div>
                  </div>
                  <div class='erweima'>
                    <!-- <div class='erweima_l'>
                      </div> -->
                    <img :src='erweima' class='erweima_l'  ref="active_code"/>
                    <div class='erweima_r'>
                      <img :src="princess"  ref="active_princess"/>
                    </div>
                  </div>
                </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="poster_b">
        <button class='poster_b_wx' @click='share'>
          <img :src="imgPath+'com/icon_wx.png'" />
          <span>分享好友</span>
        </button>
        <button class='poster_b_save' @click='saveImg'>
          <img :src="imgPath+'com/icon-save.png'" />
          <span>保存图片</span>
        </button>
        <!-- <button class='poster_b_save' open-type="openSetting" bindopensetting='handleSetting' v-if='!openSettingBtnHidden'>
            <img :src="imgPath+'com/icon-save.png'"/>
            <span>去授权</span>
          </button> -->
      </div>
    </div>
  </div>
</template>
<script>
import commonHeader from 'common/common-header'
import {
  getPostImg,
  getPosterQR,
  getImageBase64
} from '@/api/share'
import {
  Toast,
  Indicator
} from 'mint-ui'
import {
  transformArrayBufferToBase64
} from '@/store/pubilc.js'
import 'swiper/dist/css/swiper.css'
import html2canvas from 'html2canvas'
import QRCode from 'qrcodejs2'
import img from '@/assets/img/poster_logo.png'
import {
  swiper,
  swiperSlide
} from 'vue-awesome-swiper'
export default {
  name: 'Poster',
  components: {
    swiper,
    swiperSlide,
    Indicator,
    commonHeader,
    QRCode,
    html2canvas,
    transformArrayBufferToBase64,
    Toast
  },
  data() {
    return {
      h_title: '公主购',
      save_code_img: true,
      head_color: {
        color: '#000',
        background: '#f3c0a2'
      },
      avatar: '',
      userInfo: {},
      erweima: '',
      htmlUrl: '',
      fileUrl: '',
      posterList: [],
      princess: '',
      height: '',
      page: 1,
      sharewx: '',
      showImg: true,
      imgPath: process.env.FilE_URL,
      swiperCurrent: 0,
      isShow: false,
      swiperOption: {
        loop: true,
        initialSlide: 0,
        // loopAdditionalSlides: 3,
        autoplay: false,
        slidesPerView: 'auto',
        centeredSlides: true,
        observer: true,
        observerParents: true,
        // spaceBetween: 20,
        speed: 2000,
        on: {
          slideChangeTransitionEnd: function () {
            this.swiperCurrent = this.realIndex
          }
        }
      }
    }
  },
  mounted() {
    let that = this
    this.userInfo = this.$store.state.home.userInfo
    getImageBase64({
      url: this.userInfo.avatar
    }).then(res => {
      if (res.isSuccess) {
        that.avatar = res.data
      }
    })
    let baseUrl = process.env.FilE_URL + 'com/logo.png'
    getImageBase64({
      url: baseUrl
    }).then(res => {
      if (res.isSuccess) {
        that.princess = res.data
      }
    })
    that.getShareCode()
    that.getPostList()
    // 获取用户信息
    let System = window.plus
    if (System !== undefined || System !== 'undefined') {
      System.share.getServices(function (s) {
        let shares = {}
        for (var i in s) {
          var t = s[i]
          shares[t.id] = t
        }
        that.sharewx = shares['weixin']
        console.log(that.sharewx)
      }, function (e) {
        console.log('获取分享服务列表失败：' + e.message)
      })
    }
  },
  methods: {
    saveImg() {
      this.$nextTick(() => {
        const that = this
        Indicator.open('图片保存中...')
        console.log(document.getElementsByClassName('swiper-slide-active')[0].children[0].children[0])
        var _canvas = document.createElement('canvas')
        // var _canvas = document.getElementById('canvas')
        var ctx = _canvas.getContext('2d')
        var getPixelRatio = function (context) { // 获取设备的PixelRatio
          var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1
          return (window.devicePixelRatio || 1) / backingStore
        }
        var ratio = getPixelRatio(ctx)
        ctx.scale(ratio, ratio)
        // var w = dom.offsetWidth
        // var h = dom.offsetHeight
        _canvas.width = 307 * ratio
        _canvas.height = 475 * ratio
        _canvas.style.width = 307 * ratio + 'px'
        _canvas.style.height = 475 * ratio + 'px'
        let bgImg = that.$refs.active_bg_img[that.$refs.mySwiper.swiper.realIndex]
        let headImg = that.$refs.active_head_img[that.$refs.mySwiper.swiper.realIndex]
        let codeImg = that.$refs.active_code[that.$refs.mySwiper.swiper.realIndex]
        let princessImg = that.$refs.active_princess[that.$refs.mySwiper.swiper.realIndex]
        // 绘制海报底部背景图
        ctx.drawImage(bgImg, 0, 0, 307 * ratio, 380 * ratio)
        // 绘制头像
        var width = 40
        var height = 40
        var circle = {
          x: 307 / 2 - width / 2,
          y: height / 2,
          r: width / 2
        }
        // ctx.clearRect(circle.x * ratio, 4 * ratio, width * ratio, height * ratio)
        // 开始路径画圆,剪切处理
        ctx.save()
        ctx.beginPath()
        ctx.arc(circle.x * ratio + 20 * ratio, 24 * ratio, circle.r * ratio, 0, Math.PI * 2, false)
        // 剪切路径
        ctx.clip()
        ctx.drawImage(headImg, circle.x * ratio, 4 * ratio, width * ratio, height * ratio)
        // 恢复状态
        ctx.restore()

        // 绘制昵称
        // 文字填充颜色
        ctx.fillStyle = '#fff'
        ctx.lineWidth = 1 * ratio
        ctx.font = 12 * ratio + 'px Adobe Ming Std'
        var arr = that.userInfo.nickname.split('')
        let nameArr = ''
        if (arr.length > 11) {
          for (let i = 0; i < arr.length; i++) {
            if (i < 11) {
              nameArr += arr[i]
            }
          }
          nameArr += '...'
        } else {
          nameArr = that.userInfo.nickname
        }
        var len = ctx.measureText(nameArr).width
        console.log(307 * ratio / 2)
        ctx.fillText(nameArr, 307 * ratio / 2 - len / 2, (height * 1.5) * ratio)

        // 绘制空白区域的底部
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 380 * ratio, 307 * ratio, 95 * ratio)

        // 绘制二维码
        ctx.drawImage(codeImg, 45 * ratio, (380 + 15) * ratio, 65 * ratio, 65 * ratio)

        // 绘制标语图片
        ctx.drawImage(princessImg, 130 * ratio, (380 + 65 / 2) * ratio, 158 * ratio, 35 * ratio)
        let url = _canvas.toDataURL('image/png')
        that.htmlUrl = url
        that.toSave(that.htmlUrl)
      })
    },
    toSave(url) {
      let type = 'png'
      let that = this
      let imgData = url
      let bitmap = new plus.nativeObj.Bitmap()
      let filename = 'news_share_' + (new Date()).getTime() + '.' + type
      console.log(bitmap)
      bitmap.loadBase64Data(imgData)
      // 保存Bitmap图片
      bitmap.save(
        '_doc/' + filename, {
          overwrite: true
        },
        function (i) {
          // 保存到系统相册
          plus.gallery.save(
            i.target,
            function (d) {
              Indicator.close()
              console.log('保存图片成功：' + JSON.stringify(d))
              // 销毁Bitmap图片
              that.fileUrl = '_doc/' + filename
              bitmap.clear()
              Toast({
                message: '图片已保存到相册',
                iconClass: 'iconfont icon-dui1',
                duration: 2000
              })
            },
            function (e) {
              Indicator.close()
              // 销毁Bitmap图片
              console.log('加载Base64图片数据失败：' + JSON.stringify(e))
              bitmap.clear()
              console.log('保存失败', i)
            }
          )
        },
        function () {
          bitmap.clear()
        }
      )
    },
    getShareCode() {
      const that = this
      // let baseURL = ''
      let storage = window.localStorage
      let url = process.env.BASE_URL + '/share/index.html?uid=' + storage.getItem('token').split(';')[0].split('=')[1] + '&time=' + new Date().getTime()
      var obj = {
        url: url
      }
      console.log(url)
      getPosterQR(obj).then(res => {
        that.erweima = 'data:image/png;base64,' + transformArrayBufferToBase64(res)
      })
    },
    share() {
      let System = window.plus
      // 正式 gh_a0cfbcaf8fa2 测试 gh_05718de312bd
      // if (img === false) {
      let img = '_www/img/mp.png'
      // }
      let storage = window.localStorage
      // eslint-disable-next-line camelcase
      let baseURL = ''
      if (process.env.NODE_ENV === 'development') {
        baseURL = '/api'
      } else {
        baseURL = process.env.BASE_URL
      }
      let url = baseURL + 'share/index.html?uid='
      let shareId = storage.getItem('token').split(';')[0].split('=')[1]
      // eslint-disable-next-line camelcase
      let shareUrl = url + shareId + '&time=' + new Date().getTime()
      let msg = {
        type: 'web',
        title: '您的好友诚邀你成为公主购VIP会员，开通会员可享更多优惠权益。',
        thumbs: [img],
        content: '公主购：一个专注省钱的会员制电商平台~',
        href: shareUrl,
        // miniProgram: {
        //   id: 'gh_a0cfbcaf8fa2',
        //   path: shareUrl,
        //   webUrl: 'http://uniapp.dcloud.io',
        //   type: 0
        // },
        extra: {
          scene: 'WXSceneSession'
        }
      }
      this.sharewx ? this.isAuth(msg) : System.nativeUI.alert('当前环境不支持微信分享操作!')
    },
    isAuth(msg) {
      console.log('判断是否授权')
      console.log(msg)
      if (this.sharewx.authenticated) {
        this.shareAction(msg)
      } else {
        this.sharewx.authorize(function () {
          this.shareAction(msg)
        }, function (e) {
          console.log(e)
          if (e.code == -8) {
            Toast({
              message: '检测到您未安装微信，请通过应用商店下载',
              duration: 1000
            })
          }
          console.log('认证授权失败')
        })
      }
    },
    shareAction(msg) {
      console.log('开始分享')
      console.log(msg)
      this.sharewx.send(msg, function () {
        console.log('分享成功！')
        // Toast({
        //   message: '分享成功',
        //   iconClass: 'iconfont icon-dui1',
        //   duration: 1000
        // })
      }, function (e) {
        console.log('失败失败啊' + e.message)
      })
    },
    linkGo() {
      let storage = window.localStorage
      if (storage.getItem('isLogin') === true || storage.getItem('isLogin') === 'true') {
        this.$router.togo({
          path: '/personCenter'
        })
      }
    },
    getPostList() {
      const that = this
      Indicator.open('加载中...')
      // 请求海报列表
      getPostImg().then(res => {
        if (res.isSuccess) {
          Indicator.close()
          that.isShow = true
          if (res.data.length > 0) {
            that.posterList = res.data
          }
        }
      })
    }
  }
}

</script>
<style lang="less">
  .cansImg {
    position: absolute;
    opacity: 0;
  }

  #poster_swiper {
    position: fixed;
    width: 100%;
    z-index: 4;
    overflow: hidden;
  }

  #poster_swiper .swiper_wraper {
    height: 950/100rem;
    position: relative;
    top: 50%;
    transform: translateY(-58%);
    -webket-transform: translateY(-58%);
  }

  #poster_swiper .wiper_item {
    position: relative;
    z-index: 3;
    width: 82%;
    transform: scale(0.9);
    background: #fff;
    position: relative;
    border-radius: 20/100rem;
    transition: all 0.2s linear 0s;
  }

  #poster_swiper .wiper_item .slide-image {
    width: 100%;
    display: block;
    height: 100%;
    position: relative;
    border-radius: 20/100rem;
    overflow: hidden;
    background: #fff;
  }
  #poster_swiper .wiper_item .slide-image .share_content{
    width: 100%;
    display: block;
    height: 100%;
  }
  #poster_swiper .wiper_item .slide-image .image {
    position: relative;
    width: 100%;
    display: block;
    margin: 0 auto;
    height: 760/100rem;
  }

  #poster_swiper /deep/.swiper-slide-active {
    transform: none !important;
    transition: all 0.2s linear 0s !important;
    background: #fff !important;
    border-radius: 20/100rem !important;
  }

  .poster {
    position: fixed;
    width: 100%;
    height: 100%;
  }

  .poster_b {
    /* padding: 32/100rem 0; */
    padding: 24/100rem 0;
    position: fixed;
    bottom: 0;
    background: #fff;
    z-index: 1120;
    width: 100%;
    text-align: center;
  }

  .poster_b button {
    background: none;
    display: inline-block;
    line-height: normal;
  }

  .poster_b_wx {
    text-align: center;
    width: 3.5rem;
    padding: 0;
    margin: 0;
  }

  .poster_b_wx img {
    width: 122/100rem;
    height: 122/100rem;
    margin-bottom: 15/100rem;
  }

  .poster_b_wx span {
    display: block;
    text-align: center;
    width: 100%;
    font-size: 24/100rem;
    color: #5d5d5d;
  }

  .poster_b_save {
    text-align: center;
    width: 3.5rem;
    padding: 0;
    margin: 0;
  }

  .poster_b_save img {
    width: 122/100rem;
    height: 122/100rem;
    margin-bottom: 15/100rem;
  }

  .poster_b_save span {
    display: block;
    font-size: 24/100rem;
    color: #5d5d5d;
    text-align: center;
    width: 100%;
  }

  #poster_swiper .m_info_login {
    /* background: #FFF; */
    display: block;
    /* width: 100%; */
    width: 200/100rem;
    top: 10/100rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    /* padding: 25/100rem 0 0 20/100rem; */
  }

  #poster_swiper .m_avatar {
    display: inline-block;
    border-radius: 50%;
    width: 80/100rem;
    height: 80/100rem;
    background: #fff;
    vertical-align: middle;

  }

  #poster_swiper .m_info_title {
    font-size: 24/100rem;
    color: #fff;
  }

  #poster_swiper .m_info_title .m_info_name {
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-top: 0.05rem
  }

  #poster_swiper .erweima {
    display: block;
    // position: absolute;
    // bottom: 0;
    overflow: hidden;
    background: #fff;
    width: 100%;
    height: 190/100rem;
    /* padding: 40/100rem 0; */
  }

  #poster_swiper .erweima .erweima_l {
    float: left;
    width: 130/100rem;
    height: 130/100rem;
    margin-left: 60/100rem;
    margin-top: 30/100rem;
  }

  #poster_swiper .erweima .erweima_r {
    float: left;
    margin-left: 45/100rem;
    margin-top: 59/100rem;
  }

  #poster_swiper .erweima .erweima_r img {
    width: 316/100rem;
    height: 70/100rem;
  }

</style>
