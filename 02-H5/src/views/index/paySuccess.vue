<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem'></div>
    <div class='pay_success'>
      <div class='pay_body'>
        <div class='pay_title'>
          <i class='iconfont icon-duihaocheckmark17'></i>
          <div>
            <span class='pay_states'>支付成功！</span>
            <span class='pay_info'>您的订单已提交仓库，即将配送</span>
          </div>
        </div>
        <div class='pay_addr'>
          <div>
            <span>收件人</span> {{addrInfo.ship_name}} {{addrInfo.ship_mobile}}
          </div>
          <div>
            <span>收件地址</span> {{addrInfo.ship_area}}{{addrInfo.ship_addr}}
          </div>
        </div>
        <div class='pay_btn'>
          <mt-button size='small' @click='showOrder'>查看订单</mt-button>
          <mt-button size='small' @click='buy'>继续购物</mt-button>
        </div>
        <img :src='payImg' style='width:100%;height:1.82rem;' v-if="payImg!=''&&payImg!=null" />
      </div>
    </div>
    <!--成为店主弹出框-->
    <div class='a_shoper_bg' v-if="shoper"></div>
    <div class="a_shoper" v-if="shoper">
      <div class='a_shoper_dia'>
        <i class='iconfont icon-close' @click='closeShoper'></i>
        <div class='a_shoper_tit'>
          <span class='a_shoper_tit_t'>恭喜你 成功升级为<span class='shoper_light'>会员</span>!</span>
          <!-- <span class='a_shoper_tit_b'>享有以下权利</span> -->
        </div>
        <div class='a_shoper_share'>
          <!-- <div v-for="(item,index) in shoperList" :key="index" class='sharlist'>
            <img :src="item.src" />
            <span class='a_title'>{{item.title}}</span>
            <span>{{item.whoshop}}</span>
            <span>最高返利{{rebate}}%</span>
          </div> -->
           <img :src='imgPath+"shop/level_bg.png"' alt="" srcset="" class="share_bg">
        </div>
        <div class='a_shoper_btn' @click='toUse'>
          <button>去下单</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  Toast
} from 'mint-ui'
import {
  getMyaddrList,
  getPersonInfo
} from '@/api/index'
import {
  shoplevel,
  closehit
} from '@/api/share'
  // import {
  //   countDown
  // } from '@/store/pubilc.js'
  // import {
  //   parseTime
  // } from '@/store/pubilc.js'
  // import {
  //   setToken,
  //   getToken
  // } from '@/store/auth'
export default {
  name: 'PaySuccess',
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
      shoper: false,
      rebate: '',
      imgPath: process.env.FilE_URL,
      shoperList: [{
        src: process.env.FilE_URL + 'shop/shop1.png',
        title: '自购省钱',
        whoshop: '自己购买'
      },
      {
        src: process.env.FilE_URL + 'shop/shop2.png',
        title: '分享赚钱',
        whoshop: '粉丝购买'
      }
      ],
      h_title: '支付成功',
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      addrId: '',
      addrInfo: {},
      payImg: process.env.BASE_URL + '/static/img/payad.jpg'
    }
  },
  mounted() {
    // Indicator.open('加载中...')
    console.log(this.$route.query)
    let options = this.$route.query
    this.addrId = options.addrId
    this.getInfo()
    this.getShoper()
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM',
      setCarnum: 'SET_CARNUM',
      setIsbind: 'SET_ISBIND',
      setScore: 'SET_SCORE',
      setNews: 'SET_NEWS',
      setNewsnum: 'SET_NEWSNUM',
      setIssign: 'SET_ISSIGN',
      setUserInfo: 'SET_USERINFO',
      setInviter: 'SET_INVITER',
      setMember: 'SET_MEMBER',
      setShowShare: 'SET_SHARE'
    }),
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    showOrder: function () {
      this.$router.replace({
        path: '/order',
        name: 'Order',
        params: {
          id: 0,
          tid: 0
        }
      })
    },
    buy: function () {
      this.$router.replace({
        path: '/index'
      })
    },
    getInfo() {
      let that = this
      getMyaddrList().then(res => {
        if (res.isSuccess) {
          for (var i = 0; i < res.rows.length; i++) {
            if (that.addrId === res.rows[i].id) {
              that.addrInfo = res.rows[i]
              that.payImg = res.bgimg
            }
          }
        }
      })
    },
    getShoper() {
      var that = this
      // 判断会员的弹出框是否要出现 hint_pop：1代表是，0代表否
      shoplevel().then(res => {
        console.log(res, '111')
        if (res.isSuccess) {
          if (res.data.hint_pop === 1 || res.data.hint_pop === '1') {
            that.shoper = true
            that.rebate = res.data.profit
          } else {
            that.shoper = false
          }
        }
      })
    },
    closeShoper() {
      // 出现成为会员弹框后关闭弹窗，要请求接口，修改用户的新信息
      const that = this
      closehit().then(res => {
        console.log(res, 'shopers close')
        if (res.isSuccess) {
          that.shoper = false
          that.getuser('/index')
        }
      })
    },
    // 跳转到商品列表 会员弹框
    toUse() {
      const that = this
      closehit().then(res => {
        console.log(res, 'shopers close')
        if (res.isSuccess) {
          that.shoper = false
          // 后续修改
          that.getuser('/proList?type=key&virtual_id=&price=asc&value=')
        }
      })
    },
    getuser(linkurl) {
      const that = this
      getPersonInfo().then(res => {
        // wx.hideLoading()
        if (res.isSuccess) {
          let userInfo = {}
          userInfo.nickname = res.data.nickname
          userInfo.username = res.data.username
          userInfo.level = res.data.rankName
          userInfo.avatar = res.data.image
          userInfo.isShow = 1
          userInfo.isbind = res.data.bindPhone
          userInfo.level_id = res.data.level_id
          userInfo.level_name = res.data.levelName
          userInfo.inviter = res.data.inviter
          userInfo.is_first = res.data.is_first
          that.setUserInfo(userInfo)
          that.setScore(res.data.point)
          that.userInfo = that.$store.state.home.userInfo
          if (res.data.level_id !== 0 || res.data.level_id !== '0') {
            that.$store.state.home.is_member = true
          } else {
            that.$store.state.home.is_member = false
          }
          // 获取新用户信息 不确定是否从全局获取
          if (window.localStorage.getItem('token')) {
            that.userInfo = that.$store.state.home.userInfo
          }
          that.$router.replace({
            path: linkurl
          })
        }
      })
    }
  },
  computed: {
    ...mapGetters([])
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .pay_success {
    font-family: SimHei;
    background: #f2f2f2;
    overflow-x: hidden;
  }

  .pay_header {
    text-align: center;
    background: #f7f7f7;
    height: 94/100rem;
    line-height: 94/100rem;
  }

  .pay_header .iconfont {
    float: left;
    color: #5d5d5d;
    padding-left: 26/100rem;
  }

  .pay_header span {
    color: #393939;
    font-size: 38/100rem;
    margin-left: -26/100rem;
  }

  .pay_body {
    background: #fff;
  }

  .pay_body .pay_title {
    height: 180/100rem;
    /* line-height: 180/100rem; */
    background: #ff4e79;
    display: flex;
    padding: 0 26/100rem;
    align-items: center;
  }

  .pay_title i {
    font-size: 70/100rem;
    color: #fff;
  }

  .pay_title div {
    color: #fff;
    margin-left: 40/100rem;
  }

  .pay_title div .pay_states {
    font-size: 34/100rem;
    display: block;
  }

  .pay_title div .pay_info {
    font-size: 24/100rem;
  }

  .pay_addr {
    padding: 20/100rem 0;
    border-bottom: 2/100rem solid #e0e0e0;
    margin: 0 26/100rem;
  }

  .pay_addr div {
    font-size: 24/100rem;
    color: #444;
    padding: 5/100rem 0;
  }

  .pay_addr div span {
    color: #999;
    width: 100/100rem;
    display: inline-block;
  }

  .pay_btn {
    height: 256/100rem;
    line-height: 256/100rem;
    text-align: center;
  }

  .pay_btn button {
    color: #ff4e79;
    border: 2/100rem solid #ff4e79;
    background: #fff;
    margin: 0 30/100rem;
  }

  .pay_btn button::after {
    border: none;
  }

  /*成为店主弹出框*/
  .a_shoper_bg {
    position: fixed;
    top: 0/100rem;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    z-index: 999;
  }

  .a_shoper {
    position: fixed;
    background: #fff;
    width: 616/100rem;
    height: 710/100rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    border-radius: 10/100rem;
  }

  .a_shoper i {
    position: absolute;
    top: -70/100rem;
    right: 0;
    z-index: 2;
    color: #fff;
    font-size: 50/100rem;
  }

  .a_shoper_dia {
    position: absolute;
    z-index: 2;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    border-radius: 10/100rem;
  }

  .a_shoper_dia .a_shoper_tit {
    font-size: 48/100rem;
    color: #333;
    text-align: center;
    padding-top: 58/100rem;
  }

  .a_shoper_dia .a_shoper_tit span .shoper_light {
    color: #ff4e79;
  }

  .a_shoper_dia .a_shoper_tit .a_shoper_tit_t {
    line-height: 108/100rem;
    display: block;
    text-align: center;
  }

  .a_shoper_dia .a_shoper_tit .a_shoper_tit_b {
    display: block;
    font-size: 30/100rem;
    text-align: center;
  }

  .a_shoper_share {
    display: flex;
    justify-content: space-around;
    padding: 0.5rem;
    padding-bottom: 0;
  }
  .a_shoper_share .share_bg{
    width: 5.6rem;
    height: 2.8rem;
  }

  .a_shoper_share .sharlist {
    text-align: center;
  }

  .a_shoper_share .sharlist img {
    width: 92/100rem;
    height: 92/100rem;
  }

  .a_shoper_share .sharlist span {
    display: block;
    color: #999;
    font-size: 24/100rem;
    line-height: 34/100rem;
  }

  .a_shoper_share .sharlist .a_title {
    color: #333;
    font-size: 28/100rem;
    padding: 10/100rem 0;
  }

  .a_shoper_btn {
    margin-top: 70/100rem;
    text-align: center;
  }

  .a_shoper_btn button {
    width: 460/100rem;
    line-height: 74/100rem;
    background: #ff4e79;
    border-radius: 36/100rem;
    color: #fff;
    font-size: 35/100rem;
    border: 1px solid #ff4e79;
  }

</style>
