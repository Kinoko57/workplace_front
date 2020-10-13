<template>
  <div>
     <!-- :showleft="true" @concartAction="openConcart" -->
    <common-header :h_title="h_title" :showback="false" :showmore='true'></common-header>
    <div class='member_head'></div>
    <!-- <span class="zhiCustomBtn contact_style" @click="openConcart" v-if="show_contact">
      <i class='iconfont icon-kefu1'></i>
    </span> -->
    <div class='member'>
      <div class='m_header'>
        <div :class="userInfo.isShow == 0 ? 'm_info':'div_hidden'" @click="showLogin">
          <span class='login_btn'>
            <img :src="avatarUrl" class='m_avatar' />
          </span>
          <span class='login_btn'>
            登录
          </span>
        </div>
        <div :class="userInfo.isShow == 1 ? 'm_info_login':'div_hidden'">
          <img :src="userInfo.avatar" class='m_avatar' mode='scaleToFill' @click="goPage('/personCenter')" />
          <div class='m_info_title'>
            <!-- <span>{{userInfo.username}}</span> -->
            <div class='m_info_name'>
              <span>{{userInfo.nickname}}</span>
            </div>
            <div class='m_info_level'>
              <!-- <div style='display:inline-flex;align-items:center;' @click='showLevel'>
                <i class='iconfont icon-huiyuanquanyi'></i>
                <span>{{userInfo.level}}</span>
              </div> -->
              <div style='display:inline-flex;align-items:center;margin-left:0.16rem;'>
                <i class='iconfont icon-jifen1'></i>
                <span>{{$store.state.home.score}}</span>
              </div>
            </div>
          </div>
          <div class='m_score'>
            <!-- <span>总积分:{{score}}</span> -->
            <!-- <i class='iconfont icon-qiandaojiluchaxun'></i> -->
            <i class='iconfont icon-iconqiandaowenzi' data-url='../mySignIn/mySignIn' @click='goSign'></i>
            <!-- <i class='iconfont icon-qiandao'></i> -->
            <!-- <img src='@/assets/img/member/signIn.png' style='width:214/100rem;height:56/100rem;' mode='aspectFit' data-url='../mySignIn/mySignIn' @click='linkGo'></img> -->
          </div>
        </div>
      </div>
      <div class='m_vip' v-if="userInfo.level_id=='0'&&isShare==1">
        <div class='m_vip_con' @click="goPage('/asShoper')">
          <div class='m_vip_con_l'>
            <i class='iconfont icon-vip'></i><span>VIP会员</span>
          </div>
          <div class='m_vip_con_r'>
            <span>立即成为会员</span><i class='iconfont icon-youjiantou1'></i>
          </div>
        </div>
      </div>
      <div class='m_body'>
        <div class='m_order'>
          <div class='m_order_top'>
            <span>我的订单</span>
            <div class='m_order_right' @click="linkGo('/order',0,0)">
              <span>查看全部订单</span>
              <i class='iconfont icon-youjiantou1'></i>
            </div>
          </div>
          <div class='m_order_more'>
            <div class='has_msg' @click='linkGo(item.link,item.id,item.typeId)' v-for='(item,index) in orderNav'
              :key='index'>
              <img :src='item.imgUrl' class='more_icon' />
              <div :class="(userInfo.isShow == 1&&item.num>0&&item.typeId!==7) ? ' msg_bg ':'msg_bg_hidden '">
                <span>{{item.num}}</span>
              </div>
              <span>{{item.name}}</span>
            </div>
          </div>
        </div>
        <div class='toChose' @click="goUrl(adverSrc.href_id,adverSrc.href,adverSrc.href_type)"
          v-if="adverSrc.img!=''&&adverSrc.img!=undefined">
          <img :src='adverSrc.img' />
        </div>
        <div class='m_birthday' v-if='is_birthday'>
          <img :src="birthday_img" alt="" @click="goBirth">
        </div>
        <div class='m_more_feature'>
          <div class='m_more_f_top'>
            <div @click="goPage('/myColl')">
              <img :src='imgPath+"member/shoucang.png"' class='more_icons' />
              <span>我的收藏</span>
            </div>
            <div @click="goPage('/myFootprint')">
              <img :src='imgPath+"member/zuji.png"' class='more_icons' />
              <span>我的足迹</span>
            </div>
            <div @click="goPage('/myCoupon')">
              <img :src='imgPath+"member/quan.png"' class='more_icons' />
              <span>我的优惠券</span>
            </div>
            <div @click="goPage('/editInfo?code=address&codename=我的地址&isInput=1')">
              <img :src='imgPath+"member/dizhi.png"' class='more_icons' />
              <span>收货地址</span>
            </div>
          </div>
          <div class='m_more_f_top'>
            <div class='newsNav' @click="goPage('/news')">
              <!-- <i class='iconfont icon-yuandianzhong1' v-if='newNews'></i> -->
              <div :class="$store.state.home.news ? ' msg_bg ':'msg_bg_hidden '">
                <span>{{$store.state.home.newsnum}}</span>
              </div>
              <img :src='imgPath+"member/xiaoxi.png"' class='more_icons' />
              <span>消息中心</span>
            </div>
            <div class="zhiCustomBtn" @click="openConcart">
              <img :src='imgPath+"member/set.png"' class='more_icons' />
              <span>客服中心</span>
            </div>
            <div @click="goPage('/myScore')">
              <img :src='imgPath+"member/jifen.png"' class='more_icons' />
              <span>我的积分</span>
            </div>
            <div @click="goPage('/myComment')">
              <img :src='imgPath+"member/pingjia.png"' class='more_icons' />
              <span>我的评价</span>
            </div>
          </div>
          <div class='m_more_f_bottom'>
            <div @click="goPage('/mytryOut')">
              <img :src='imgPath+"member/shiyong.png"' class='more_icons' />
              <span>我的试用</span>
            </div>
            <div @click="goPage('/groupBy')">
              <img :src='imgPath+"member/tuan.png"' class='more_icons' />
              <span>我的拼团</span>
            </div>
            <div @click="goPage('/myGift')">
              <img :src='imgPath+"member/zeng.png"' class='more_icons' />
              <span>我的赠品</span>
            </div>
            <div @click="goPage('/myGiftList')">
              <img :src='imgPath+"member/gift.png"' class='more_icons' />
              <span>我的奖品</span>
            </div>
          </div>
        </div>
      </div>
      <!-- <include src="../footer/footer.wxml" /> -->
    </div>
    <div class='vipDetail_bg' v-if='vipShow'></div>
    <div class='vipDetail' v-if='vipShow'>
      <div class='vip_head'>会员等级规则说明</div>
      <div class='richspan' style="height: 4rem; ">
        <!-- <template is="wxParse" data="wxParseData:proDetail.nodes" /> -->
        <span>{{vipTitle}}</span>
      </div>
      <div class='vip_btn' @click='hiddenVip'>
        <mt-button size='small'>我知道了</mt-button>
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
            <span>{{item.rebate}}</span>
          </div> -->
          <img :src='imgPath+"shop/level_bg.png"' alt="" srcset="" class="share_bg">
        </div>
        <div class='a_shoper_btn' @click='toUse'>
          <button>去下单</button>
        </div>
      </div>
    </div>
    <!-- 弹出框-->
    <!-- <div class='login_model_bg' v-if='loginModel' @click='exitLogin'>
    </div>
    <div class='login_model' v-if='loginModel'>
      <div @click="loginApp" class='login_content'>
        <img src='@/assets/img/member/wx_login.png' />
        <span>微信一键登陆</span>
      </div>
    </div> -->
  </div>
</template>
<script>
import {
  mapMutations,
  mapGetters
} from 'vuex'
import {
  Button,
  Toast
} from 'mint-ui'
import {
  getPersonInfo,
  getMemberRule,
  getOrderNum,
  getCarList,
  getNewsRead,
  getShowShare
  //, appLogin
} from '@/api/index'
import {
  getAdvByShare,
  shoplevel,
  closehit
} from '@/api/share'
import commonHeader from 'common/common-header'
// import pay from '@/assets/img/member/pay.png'
// import ship from '@/assets/img/member/ship.png'
// import receipt from '@/assets/img/member/receipt.png'
// import evals from '@/assets/img/member/eval.png'
// import after from '@/assets/img/member/after_sale.png'
// import avatar from '@/assets/img/member/avatar.png'
// import headerBg from '@/assets/img/member/m_header_bg.png'
// import msg from '@/assets/img/member/msg.png'
// import sets from '@/assets/img/member/set.png'
export default {
  name: 'Member',
  components: {
    commonHeader,
    Button,
    Toast
  },
  data() {
    return {
      zhiManager: '',
      shoper: false,
      rebate: '',
      shoperList: [{
        src: process.env.FilE_URL + 'shop/shop1.png',
        title: '自购省钱',
        whoshop: '自己购买',
        rebate: '购物省5%～35%'
      },
      {
        src: process.env.FilE_URL + 'shop/shop2.png',
        title: '分享赚钱',
        whoshop: '粉丝购买',
        rebate: '推广赚5%～35%'
      }
      ],
      show_contact: false,
      adverSrc: {},
      imgPath: process.env.FilE_URL,
      isMember: this.$store.state.home.is_member,
      isShare: this.$store.state.home.is_share,
      h_title: '个人中心',
      navNtn: 5,
      header_bg: process.env.FilE_URL + 'member/headerBg.png',
      avatarUrl: process.env.FilE_URL + 'member/avatar.png',
      // score: 0,
      newNews: false,
      news_num: 0,
      refuse: false,
      vipTitle: '',
      loginModel: false,
      orderNav: [{
        id: 1,
        typeId: 1,
        imgUrl: process.env.FilE_URL + 'member/pay.png',
        link: '/myOrder',
        name: '待付款',
        num: 0
      },
      {
        id: 2,
        typeId: 5,
        imgUrl: process.env.FilE_URL + 'member/ship.png',
        link: '/myOrder',
        name: '待发货',
        num: 0
      },
      {
        id: 3,
        typeId: 2,
        imgUrl: process.env.FilE_URL + 'member/receipt.png',
        link: '/myOrder',
        name: '待收货',
        num: 0
      },
      {
        id: 5,
        typeId: 6,
        imgUrl: process.env.FilE_URL + 'member/eval.png',
        link: '/myOrder',
        name: '待评价',
        num: 0
      },
      {
        id: 4,
        typeId: 7,
        imgUrl: process.env.FilE_URL + 'member/after_sale.png',
        link: '/myOrder',
        name: '退换/售后',
        num: 0
      }
      ],
      vipShow: false,
      memRule: '',
      userInfo: {
        avatar: '',
        nickname: '',
        level_id: '',
        username: '',
        isShow: 0
      },
      // apiUrl: apiUrl,
      // hiddenlogin: hiddenlogin,
      orderList: [{
        imgurl: '',
        orderStates: '',
        id: ''
      }],
      aweixin: '',
      birthday_img: '',
      is_birthday: false
    }
  },
  created() {
  },
  mounted() {

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
    openConcart() {
      let that = this
      if (window.localStorage.getItem('isLogin') === 'true' || window.localStorage.getItem('isLogin') === true) {
        console.log('展开聊天框')
        console.log(this.userInfo)
        var storage = window.localStorage
        storage.setItem('leaveApp', true)
        let url = 'https://www.sobot.com/chat/h5/index.html'
        // let url =
        //   'https://www.sobot.com/chat/h5/index.html?sysNum=563069f6a21c4723b6a05d5ab9a6146d&back=1&titleFlag=1&uname=' +
        //   this.userInfo.nickname + '&face=' + this.userInfo.avatar + '&partnerId=' + this.userInfo.uid
        // window.open(url)
        that.$router.togo({
          path: '/chat',
          name: 'Chat',
          params: {
            url: url,
            sysNum: '563069f6a21c4723b6a05d5ab9a6146d',
            back: 1,
            titleFlag: 1,
            uname: this.userInfo.nickname,
            face: this.userInfo.avatar,
            partnerId: this.userInfo.uid
          }
        })
      } else {
        window.plus.nativeUI.confirm('您当前未登录，是否立即前往登录', function (e) {
          if (e.index === 0 || e.index === '0') {
            that.$router.togo({
              path: '/login?back=1'
            })
          }
        }, {
          'title': '提示',
          'buttons': ['确定', '取消'],
          'verticalAlign': 'center'
        })
      }
    },
    getInfo() {
      var that = this
      getPersonInfo().then(res => {
        if (res.isSuccess) {
          let userInfo = {}
          userInfo.avatar = res.data.image
          userInfo.uid = res.data.uid
          userInfo.level = res.data.rankName
          userInfo.isShow = 1
          userInfo.nickname = res.data.nickname
          userInfo.isbind = res.data.bindPhone
          userInfo.level_id = res.data.level_id
          userInfo.level_name = res.data.levelName
          userInfo.inviter = res.data.inviter
          userInfo.is_first = res.data.is_first
          that.setUserInfo(userInfo)
          that.setScore(res.data.point)
          that.setInviter(res.data.inviter)
          if (res.data.mobile !== '' && res.data.mobile !== null) {
            that.setIsbind(true)
          } else {
            that.setIsbind(false)
          }
          if (res.data.level_id !== 0 && res.data.level_id !== '0') {
            that.setMember(true)
          } else {
            that.setMember(false)
          }
          that.userInfo = that.$store.state.home.userInfo
          // that.show_contact = true
          // if (that.$store.state.home.is_share === 1 || that.$store.state.home.is_share === '1') {
          that.getShoper()
          // }
        }
      })
      for (var j = 0; j < that.orderNav.length; j++) {
        that.orderNav[j].num = 0
      }
      getOrderNum().then(res => {
        if (res.isSuccess) {
          if (res.isSuccess) {
            for (var i = 0; i < res.data.length; i++) {
              for (var j = 0; j < that.orderNav.length; j++) {
                if (res.data[i].type === that.orderNav[j].typeId) {
                  that.orderNav[j].num = res.data[i].num
                }
              }
            }
          } else {
            for (let j = 0; j < that.orderNav.length; j++) {
              that.orderNav[j].num = 0
            }
          }
        }
      })
      getCarList({
        p: 1,
        limit: 10
      }).then(res => {
        if (res.isSuccess) {
          // that.total_amout = res.data.rows_total
          that.setCarnum(res.data.rows_total)
        }
      })
      getNewsRead().then(res => {
        if (res.isSuccess) {
          // 判断是否签到
          if (res.data.is_sign === 1 || res.data.is_sign === '1') {
            // that.isSign = true
            that.setIssign(true)
          } else {
            that.setIssign(false)
            // that.isSign = false
          }
          // 判断是否生日
          if (res.data.is_birthday === 1 || res.data.is_birthday === '1') {
            that.is_birthday = true
            that.birthday_img = res.data.birthday_img
          } else {
            that.is_birthday = false
            that.birthday_img = ''
          }
          // 判断是否有新消息
          if (res.data.num > 0) {
            that.setNews(true)
            that.setNewsnum(res.data.num)
          } else {
            that.setNews(false)
            that.setNewsnum(0)
          }
        }
      })
      getShowShare().then(res => {
        if (res.isSuccess) {
          if (res.data.status == 0) {
            that.isShare = 0
            that.setShowShare(0)
          } else {
            that.isShare = 1
            that.setShowShare(1)
          }
        } else {
          console.log('判断用户是否是直邀失败')
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
            // that.rebate = res.data.profit
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
          that.getuser('/proList?type=key&price=asc&virtual_id=&value=')
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
          this.setScore(res.data.point)
          that.userInfo = that.$store.state.home.userInfo
          if (res.data.level_id !== 0 || res.data.level_id !== '0') {
            this.$store.state.home.is_member = true
          } else {
            this.$store.state.home.is_member = false
          }
          // 获取新用户信息 不确定是否从全局获取
          if (window.localStorage.getItem('token')) {
            that.userInfo = that.$store.state.home.userInfo
          }
          this.$router.replace({
            path: linkurl
          })
        }
      })
    },
    getAdv() {
      const that = this
      getAdvByShare(4).then(res => {
        if (res.isSuccess) {
          that.adverSrc = res.data.ad
        }
      })
    },
    showLogin() {
      this.$router.togo({
        path: '/login?back=1'
      })
    },
    goBirth() {
      this.$router.togo({
        path: '/vipBirthday'
      })
    },
    // 广告位跳转
    goUrl(id, href, type) {
      console.log(href)
      var arr = href.split('/')
      if (type == 1) {
        // 商品详情
        this.$router.togo({
          path: '/proDetail?type=normal&id=' + id
        })
      } else if (type == 0) {
        // 跳转分类
        if (id != 0) {
          // app.globalData.firstForm = 1
          // app.globalData.choseNav = id
          this.$router.replace({
            path: '/poster'
          })
          // wx.reLaunch({
          //   url: '../proType/proType'
          // })
        }
      } else {
        let path = href
        if (path.indexOf('hotPush') != -1 || path.indexOf('index') != -1 || path.indexOf('myCar') != -1 || path
          .indexOf('proType') != -1 || path.indexOf('memberCenter') != -1 || path.indexOf('shoper') != -1) {
          // 跳转底部栏
          this.$router.replace({
            path: '/' + arr[arr.length - 1]
          })
          // wx.reLaunch({
          //   url: path
          // })
        } else if (path.indexOf('lottery') != -1) {
          // 抽奖页不需要返回
          this.$router.replace({
            path: '/' + arr[arr.length - 1]
          })
        } else {
          this.$router.togo({
            path: '/' + arr[arr.length - 1]
          })
        }
      }
    },
    linkGo(link, id, tid) {
      let that = this
      if (window.localStorage.getItem('isLogin') === 'true' || window.localStorage.getItem('isLogin') === true) {
        that.$router.togo({
          path: link,
          name: 'Order',
          params: {
            id: id,
            tid: tid
          }
        })
      } else {
        window.plus.nativeUI.confirm('您当前未登录，是否立即前往登录', function (e) {
          if (e.index === 0 || e.index === '0') {
            that.$router.togo({
              path: '/login?back=1'
            })
          }
        }, {
          'title': '提示',
          'buttons': ['确定', '取消'],
          'verticalAlign': 'center'
        })
      }
    },
    goPage(url) {
      let that = this
      if (window.localStorage.getItem('isLogin') === 'true' || window.localStorage.getItem('isLogin') === true) {
        that.$router.togo({
          path: url
        })
      } else {
        window.plus.nativeUI.confirm('您当前未登录，是否立即前往登录', function (e) {
          if (e.index === 0 || e.index === '0') {
            that.$router.togo({
              path: '/login?back=1'
            })
          }
        }, {
          'title': '提示',
          'buttons': ['确定', '取消'],
          'verticalAlign': 'center'
        })
      }
    },
    goSign(e) {
      let that = this
      if (window.localStorage.getItem('isLogin') === 'true' || window.localStorage.getItem('isLogin') === true) {
        if (this.$store.state.home.isbind === 'false' || this.$store.state.home.isbind === false) {
          that.$router.replace({
            path: '/bind?visit=5'
          })
        } else {
          that.$router.togo({
            path: '/mySignIn'
          })
        }
      } else {
        window.plus.nativeUI.confirm('您当前未登录，是否立即前往登录', function (e) {
          if (e.index === 0 || e.index === '0') {
            that.$router.togo({
              path: '/login?back=1'
            })
          }
        }, {
          'title': '提示',
          'buttons': ['确定', '取消'],
          'verticalAlign': 'center'
        })
      }
    },
    showLevel() {
      var that = this
      that.vipShow = true
      getMemberRule().then(res => {
        if (res.isSuccess) {
          // that.memRule = res.member_rule
          that.vipTitle = res.member_rule
        }
      })
    },
    hiddenVip() {
      this.vipShow = false
    }
  },
  computed: {
    ...mapGetters([])
  },
  destroyed() {
    console.log('离开页面')
    if (document.getElementById('ZCPanel') != null) {
      // 移除组件ZCPanel
      var box = document.getElementById('ZCPanel')
      box.remove()
    }
  },
  activated() {
    console.log(this.$store.state)
    let storage = window.localStorage
    // 获取个人信息,订单数量,消息数量，是否签到
    console.log(storage.getItem('isLogin'))
    if (storage.getItem('isLogin') === true || storage.getItem('isLogin') === 'true') {
      this.isShare = this.$store.state.home.is_share
      this.getInfo()
      this.getAdv()
    }
    let that = this
    let System = window.plus
    if (System) {
      System.navigator.setStatusBarBackground('#ff4e79')
      System.navigator.setStatusBarStyle('light')
      // if(storage.getItem('leaveApp')!=undefined&&storage.getItem('leaveApp')==true){
      //   System.navigator.setStatusBarBackground('#ff4e79')
      //   System.navigator.setStatusBarStyle('light')
      // }else{
      //   System.navigator.setStatusBarBackground('#ff4e79')
      //   System.navigator.setStatusBarStyle('light')
      // }

      System.oauth.getServices(
        function (services) {
          let auths = services
          console.log(auths)
          if (services[0].id === 'weixin') {
            that.aweixin = services[0]
          }
        },
        function (e) {
          console.log('获取分享服务列表失败：' + e.message + ' - ' + e.code)
        }
      )
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .member_head {
    height: 0.9rem;
  }

  .contact_style {
    position: fixed;
    width: 0.8rem;
    height: 0.8rem;
    background: rgba(0, 0, 0, 0.5);
    left: 0.16rem;
    bottom: 20%;
    border-radius: 50%;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .contact_style i {
    color: #fff;
    font-size: 0.46rem;
  }

  .member {
    position: relative;
    background: #f2f2f2;
    overflow: scroll;
    /* height:100vh; */
  }

  .m_header {
    height: 200/100rem;
    width: 702/100rem;
    position: relative;
    z-index: 20;
    /* top: 28/100rem; */
    padding: 0 26/100rem;
    background: #ff4e79;
  }

  /* 头部会员信息 */

  .m_info {
    padding-top: 36/100rem;
    margin-left: 20/100rem;
    display: flex;
    align-items: center;
  }

  .m_info .m_avatar {
    width: 122/100rem;
    height: 122/100rem;
    margin-right: 50/100rem;
  }

  .m_info .login_btn {
    margin: 0;
    padding: 0;
    background: transparent;
  }

  .m_info .login_btn::after {
    border: none;
  }

  .m_info span {
    font-size: 40/100rem;
    color: #fff;
    margin-right: 30/100rem;
    // line-height: 1.22rem;
  }

  /* 登陆成功后的会员信息 */

  .m_info_login {
    margin-left: 20/100rem;
    display: flex;
    align-items: center;
    /* align-items: flex-end; */
    height: 200/100rem;
    justify-content: space-between;
    padding-right: 24/100rem;
  }

  .m_info_login .m_avatar {
    width: 122/100rem;
    height: 122/100rem;
    margin-right: 24/100rem;
    margin-bottom: 12/100rem;
    border-radius: 50%;
  }

  .m_info_login .m_info_title {
    /* width: 260/100rem; */
    /* margin-right: 140/100rem; */
    width: 400/100rem;
    /* display: inline-flex; */
  }

  .m_info_login .m_info_title .m_info_name {
    font-size: 30/100rem;
    font-weight: bold;
    color: #fff;
    /* display: block; */
    margin-left: 14/100rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    width: 3rem;
  }

  .m_info_login .m_info_title .m_info_level {
    display: flex;
    justify-content: flex-start;
  }

  .m_info_login .m_info_title .m_info_level span {
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #fff;
  }

  .m_info_login .m_info_title .m_info_level .iconfont {
    font-size: 40/100rem;
    /* color: #f5cd19; */
    color: #ffe790;
    display: inline-flex;
  }

  .m_score {
    text-align: center;
  }

  .m_score .iconfont {
    font-size: 84/100rem;
    color: #fff;
  }

  .m_score span {
    font-size: 60/100rem;
    color: #fff;
    font-weight: bold;
    display: block;
  }

  .div_hidden {
    display: none;
  }

  /*升级会员信息*/
  .m_vip {
    background: #fff;
    position: relative;
    padding: 60/100rem 20/100rem 40/100rem;
    color: #fff;
  }

  .m_vip_con {
    height: 94/100rem;
    // background: -webkit-linear-gradient(left, #f3c0a2, #fbd8bd);
    background: #ff4e79;
    border-radius: 47/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 94/100rem;
    font-size: 28/100rem;
  }

  .m_vip_con .m_vip_con_l {
    padding-left: 36/100rem;
  }

  .m_vip_con .m_vip_con_l i {
    font-size: 40/100rem;
    padding-right: 10/100rem;
    vertical-align: middle;
    color: #fff;
  }

  .m_vip_con .m_vip_con_r {
    padding-right: 16/100rem;
  }

  .m_vip_con .m_vip_con_r i {
    color: #fff;
  }

  .m_vip_con .m_vip_con_l i {
    font-size: 40/100rem;
    padding-right: 10/100rem;
    vertical-align: middle;
    color: #fff;
  }

  .closeVip {
    position: absolute;
    top: 0;
    right: 20/100rem;
  }

  /*广告位*/
  .toChose {
    margin-top: 20/100rem;
    /* margin-bottom: 12/100rem; */
  }

  .toChose img {
    width: 100%;
    vertical-align: middle;
  }

  /* 中间部分 */

  .m_order {
    height: 260/100rem;
    padding: 0 26/100rem;
    padding-top: 24/100rem;
    background: #fff;
  }

  .m_order_top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90/100rem;
    // line-height: 90/100rem;
    border-bottom: 1px solid #e4e4e4;
  }

  .m_order .m_order_top span {
    color: #444;
    font-size: 32/100rem;
  }

  .m_order_top .m_order_right {
    float: right;
    display: flex;
    align-items: center;
  }

  .m_order_top .m_order_right span {
    /* font-size: 20/100rem;
  color: #c4c4c4; */
    font-size: 24/100rem;
    color: #999;
  }

  .m_order_top .m_order_right i {
    display: flex;
    align-items: center;
    color: #bebebe;
  }

  .m_order_more {
    text-align: center;
  }

  .m_order_more div {
    display: inline-block;
    text-align: center;
    /* margin: 30/100rem 26/100rem; */
    width: 20%;
    margin: 30/100rem 0;
  }

  .m_order_more .more_icon {
    width: 58/100rem;
    height: 48/100rem;
  }

  .m_order_more span {
    display: block;
    font-size: 26/100rem;
    color: #504448;
    text-align: center;
  }

  .m_birthday {
    width: 100%;
    height: 1.82rem;
    margin-top: 0.24rem;
    text-align: center;

  }

  .m_birthday img {
    // width: 100%;
    height: 1.82rem;
  }

  /* 消息数量定位 */

  .has_msg {
    position: relative;
  }

  .has_msg .msg_bg {
    position: absolute;
    margin: 0;
    top: -0.1rem;
    right: 30/100rem;
    width: 30/100rem;
    height: 30/100rem;
    border-radius: 50%;
    background: #f43530;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .msg_bg_hidden {
    position: absolute;
    top: -14/100rem;
    right: -2/100rem;
    margin: 0;
    z-index: -1;
  }

  .has_msg .msg_bg span {
    font-size: 14/100rem;
    color: #fff;
    text-align: center;
  }

  .m_more_feature {
    background: #fff;
    margin-top: 24/100rem;
    margin-bottom: 1rem;
    /* height: 372/100rem; */
    padding: 0 26/100rem;
  }

  .m_more_f_top {
    border-bottom: 1px solid #e4e4e4;
    padding: 30/100rem 0;
    /* text-align: center; */
    display: flex;
    justify-content: space-between;
  }

  .m_more_f_top .newsNav {
    position: relative;
  }

  .newsNav .msg_bg {
    position: absolute;
    margin: 0;
    top: 0;
    right: 38/100rem;
    text-align: center;
    width: 30/100rem;
    height: 30/100rem;
    border-radius: 50%;
    background: #f43530;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .msg_bg_hidden {
    position: absolute;
    top: -14/100rem;
    right: -2/100rem;
    margin: 0;
    z-index: -1;
  }

  .newsNav .msg_bg span {
    font-size: 14/100rem;
    color: #fff;
    text-align: center;
  }

  /* .newsNav .iconfont {
  position: absolute;
  font-size: 24/100rem;
  color: #f43530;
  top: -7/100rem;
  display: inline-flex;
  right: 25%;
} */

  .m_more_f_bottom {
    padding: 30/100rem 0;
    /* text-align: center; */
    display: flex;
    justify-content: space-between;
  }

  .m_more_f_top div {
    display: inline-block;
    text-align: center;
    width: 22%;
    margin-top: 24/100rem;
    margin-bottom: 15/100rem;
    /* margin-left: 7/100rem; */
  }

  .m_more_f_bottom div {
    display: inline-block;
    text-align: center;
    width: 22%;
    margin-top: 24/100rem;
    margin-bottom: 15/100rem;
    /* margin-left: 7/100rem; */
  }

  .m_more_feature .more_icons {
    // width: 58/100rem;
    height: 58/100rem;
  }

  .m_more_feature span {
    display: block;
    font-size: 26/100rem;
    color: #444;
    text-align: center;
  }

  /* 空白的块，解决底部导航占领高度 */

  .vipDetail_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 50;
  }

  .vipDetail {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    /* height: 50%; */
    z-index: 100;
    background: #fff;
    border-radius: 20/100rem;
  }

  .vip_head {
    text-align: center;
    margin: 40/100rem 0;
  }

  .richspan {
    /* margin: 20/100rem; */
    width: 90%;
    margin: 0 auto;
    overflow: scroll;
  }

  .richspan span {
    font-size: 30/100rem;
    font-weight: bold;
    color: #666;
    word-wrap: break-word;
    width: 96%;
    display: block;
  }

  .vip_btn {
    margin: 20/100rem;
    text-align: center;
  }

  .vip_btn button {
    background: #ff4e79;
    color: #fff;
    font-size: 28/100rem;
    border-radius: 20/100rem;
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
    text-align: center;
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

  .login_model_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 50;
  }

  .login_model {
    width: 570/100rem;
    height: 510/100rem;
    position: fixed;
    margin: auto;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 60;
    background: #fff;
    text-align: center;
  }

  .login_model .login_content {
    text-align: center;
    margin-top: 1rem;
  }

  .login_content img {
    width: 192/100rem;
    height: 192/100rem;
    margin-top: 40/100rem;
  }

  .login_content span {
    font-size: 0.28rem;
    color: #333;
    display: block;
    text-align: center;
  }

</style>
