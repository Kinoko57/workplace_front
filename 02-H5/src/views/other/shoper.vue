<template>
  <div>
    <common-header :h_title="h_title" :showback="false" :bgcolor='head_color' :showleft="true"  @concartAction="openConcart"></common-header>
    <div v-if="showlevel" style='background:#FAFAFC'>
      <div class="shper_bottom">
        <div id='shper_bottom' style='height:0.9rem'></div>
        <return-top @returnTop='goTop'></return-top>
        <div class='m_header'>
          <div class="m_info_login">
            <img :src="userInfo.avatar" class='m_avatar' mode='scaleToFill' @click='linkGo' />
            <div class='m_info_title'>
              <div class='m_info_name'>
                <span>{{userInfo.nickname}}</span>
              </div>
              <div class='m_info_level'>
                <!-- <span class='m_info_Id'>VIP会员-{{userInfo.level_name}}</span> -->
                <span class='m_info_Id'>{{userInfo.level_name}}</span>
              </div>
            </div>
            <div class='m_score' @click='toQrcode'>
              <div class='m_score_l'>
                <img :src="imgPath+'shoper/qr.png'" />
                <span>二维码</span>
              </div>
            </div>
            <div class='m_score' @click='toPoster'>
              <div class='m_score_l'>
                <img :src="imgPath+'shoper/user.png'" />
                <span>邀请</span>
              </div>
            </div>

          </div>
        </div>
        <!-- <div class="wallet-wrap">
            <div class="wallet-container">
              <div class="wallet-total">
                <span class="money">{{membeInfo.money}}</span>
                <label>总金额/元</label>
                <div class="my-wallet" @click='myCash'>
                  <span class="my-wallet-text">我的钱包</span>
                  <i class="iconfont arrow-right"></i>
                </div>
                <div class="arrow-top"></div>
              </div>
              <div class="wallet-info">
                <div class="wallet-info-item">
                  <span>{{membeInfo.money_freeze}}</span>
                  <label>待结算金额/元</label>
                </div>
                <div class="wallet-info-item">
                  <span>{{membeInfo.can_money}}</span>
                  <label>可提现金额/元</label>
                </div>
              </div>
            </div>

          </div> -->
        <div class="wallet-info-block">
          <div class="info-wallet">
            <div @click="goLink('/myIncome')">
              <p class="num">{{membeInfo.total_money}}</p>
              <p>累计收益/元</p>
            </div>
            <div @click="goLink('/saleOrder?type=')">
              <p class="num">{{todayOrders}}</p>
              <p>今日订单/笔</p>
            </div>
            <div @click="goLink('/myWallet')">
              <p class="num">{{membeInfo.money}}</p>
              <p>钱包/元</p>
            </div>
          </div>
        </div>
        <div class="fans-wrap">
          <div class="fans-header">
            <div class="title">
              <i class="icon icon-fans"></i>
              <span>我的会员/粉丝</span>
            </div>
            <!-- <div class="toolbar">
                <span>查看所有</span>
                <i class="arrow-right gray"></i>
              </div> -->
          </div>
          <div class="fans-body">
            <div class="fans-info">
              <div class="fans-info-item" @click="toNewFans('today','1')">
                <span>{{today}}</span>
                <label>今日新增/人</label>
              </div>
              <div class="fans-info-item" @click="toNewFans('all','1')">
                <span>{{fancNum}}</span>
                <label>会员总数/人</label>
              </div>
              <div class="fans-info-item" @click="toNewFans('all','0')">
                <span>{{backday}}</span>
                <label>粉丝总数/人</label>
              </div>
            </div>
          </div>
        </div>
        <div class="notice-wrap" v-if="noticeList.length>0">
          <div class="notice-header">
            <div class="title">
              <i class="icon icon-notice"></i>
              <span>用户公告</span>
            </div>
          </div>
          <div class="notice-body">
            <div class="notice-item" v-for="(item,index) in noticeList" :key="index"
              @click="viewDetail(item.id,item.title)">
              <div class="notice-title">{{item.title}}</div>
              <div class="notice-desc">
                <span class="notice-summary" v-if="item.summary!=null || item.summary!=''">{{item.summary}}</span>
                <span class='notice-time'>{{item.createtime}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="ad" @click="goUrl(ad.href_id,ad.href,ad.href_type)" v-if="ad.img!=''">
          <img :src="ad.img">
        </div>
        <div class="invite-gift" v-if="giftList.length>0">
          <div class="invite-title">
            <p>
              <img class="member-icon left" :src="imgPath+'asShoper/icon-left.png'" />
              <span>分享礼包给好友 下单即可升级会员</span>
              <img class="member-icon right" :src="imgPath + 'asShoper/icon-right.png'" />
            </p>
          </div>
          <div class="gift-wrap">
            <div class="gift-list">
              <div class="gift-item" v-for="(item, index) in giftList" :key="index">
                <div class="gift-box" @click="goGiftDetail('normal',item.goods_id)">
                  <img :src="item.img" v-if="item.img!=''" />
                  <div v-else style="height: 3.3rem;"></div>
                  <div class="gift-name">{{item.name}}</div>
                  <div class="gift-price"><span class="price">￥{{item.price_sell}}</span><!--<span class="market">￥{{item.price_market}}</span>--></div>
                </div>
              </div>
            </div>
            <div class='order-foot'>
              <span>—————— 我是有底线的 ——————</span>
            </div>
        </div>
        </div>
      </div>
      <!-- <div class="goIndex" @click='goIndex'>
          <i class='iconfont icon-home'></i>
        </div> -->
      <div class='asshoper'></div>
      <!-- <include src="../footerTab/footerTab.wxml" /> -->
    </div>
  </div>
</template>
<script>
import commonHeader from 'common/common-header'
import returnTop from '@/components/return-top'
import fansImg from '@/assets/img/asShoper/fans.png'
import memberImg from '@/assets/img/asShoper/member.png'
import {
  addCarofPro
} from '@/api/index'
import {
  getShoperMoney,
  getShoperFans,
  getShoperList,
  getShoperAd,
  getShoperNoticeList,
  memberGiftList
} from '@/api/share'
import {
  mapMutations
} from 'vuex'
import {
  Indicator,
  Toast,
  Button
} from 'mint-ui'
export default {
  name: 'Shoper',
  data() {
    return {
      head_color: {
        color: '#000',
        background: '#FCD9BB'
      },
      fansImg: fansImg,
      memberImg: memberImg,
      h_title: '会员中心',
      show_tips: false,
      isShare: 0,
      showlevel: false,
      imgPath: process.env.FilE_URL,
      // is_iphonex: app.globalData.phoneType,
      isMember: false,
      rulesTitle: '',
      shoperShow: false,
      autoplay: false,
      interval: 3000,
      duration: 3000,
      isTop: true,
      memShop_total: 0,
      total_amout: 0,
      memShop: [],
      noticeList: [],
      membeInfo: {
        total_money: 0.00,
        money: 0.00
      },
      giftList: [],
      fancNum: 0,
      today: 0,
      backday: 0,
      navNtn: 0,
      avatarUrl: process.env.FilE_URL + 'member/avatar.png',
      score: 0,
      todayOrders: 0,
      userInfo: {
        avatar: '',
        nickname: '',
        username: '',
        level_id: '0',
        isShow: 0
      },
      rwcode: false,
      notice_length: '',
      ad: {
        title: '',
        img: '',
        href: '',
        type: '',
        href_type: '',
        href_id: ''
      }
    }
  },
  components: {
    Indicator,
    Toast,
    Button,
    commonHeader,
    returnTop
  },
  mounted() {

  },
  activated() {
    this.userInfo = this.$store.state.home.userInfo
    this.isMember = this.$store.state.home.is_member
    this.isShare = this.$store.state.home.is_share
    this.getFansNum()
    this.getVipList()
    this.getVipInfo()
    this.getnotceList()
    this.getAd()
    this.getList()
  },
  methods: {
    ...mapMutations({
      setCarPro: 'SET_CARPRO'
    }),
    getList() {
      let that = this
      memberGiftList().then(res => {
        Indicator.close()
        if (res.isSuccess) {
          console.log(res)
          that.giftList = res.data.gift
        }
      })
    },
    toNewFans(type, isMember) {
      this.$router.togo({
        path: '/todayNew?type=' + type
      })
      var storage = window.localStorage
      storage.setItem('type', isMember)
    },
    goGiftDetail(type, id) {
      this.$router.togo({
        path: '/newPeopleDetail?type=' + type + '&id=' + id + '&form=share'
      })
    },
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
    // 获取金额信息
    getVipInfo() {
      const that = this
      getShoperMoney().then(res => {
        if (res.isSuccess) {
          that.membeInfo = res.data.member
          that.userInfo.uid = res.data.member.uid
        }
      })
    },
    // 获取粉丝数量
    getFansNum: function () {
      Indicator.open('加载中...')
      const that = this
      getShoperFans().then(res => {
        if (res.isSuccess) {
          Indicator.close()
          that.showlevel = true
          that.fancNum = res.data.mem_new
          that.todayOrders = res.data.today_orders1
          that.today = res.data.today_fans
          that.backday = res.data.fans_new
        }
      })
    },
    // 获取会员公告列表，只取前10条，不足前10条，全部取出，超出3条数据 滚动
    getnotceList() {
      const that = this
      getShoperNoticeList().then(res => {
        if (res.isSuccess) {
          that.noticeList = res.rows
          if (res.rows.length > 3) {
            that.autoplay = true
            that.notice_length = 3
            that.notic_height = 198
          } else {
            that.autoplay = false
            that.notice_length = res.rows.length
            that.notic_height = 66 * res.rows.length
          }
        }
      })
    },
    // 获取广告图
    getAd() {
      var obj = {
        type: 3
      }
      getShoperAd(obj).then(res => {
        if (res.isSuccess) {
          let ad = res.data.ad
          this.ad = ad
        }
      })
    },
    // 获取会员超值购列表
    getVipList() {
      getShoperList().then(res => {
        if (res.isSuccess) {
          let arr = res.data.rows
          this.memShop = arr
        }
      })
    },
    // 跳转到海报页
    toPoster() {
      this.$router.togo({
        path: '/poster'
      })
    },
    toQrcode() {
      this.$router.togo({
        path: '/myQrcode'
      })
    },
    // 跳转到我的钱包页面
    // myCash() {
    //   this.$router.togo({
    //     path: '/myWallet'
    //   })
    // },
    goLink(url) {
      this.$router.togo({
        path: url
      })
    },
    // 回到顶部
    goTop() {
      console.log('回到顶部')
      document.getElementById('shper_bottom').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    // 跳转到礼包专区
    // goGift() {
    //   this.$router.togo({
    //     path: '/giftPackage'
    //   })
    // },
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
            path: arr[arr.length - 1]
          })
          // wx.reLaunch({
          //   url: path
          // })
        } else if (path.indexOf('lottery') != -1) {
          // 抽奖页不需要返回
          this.$router.replace({
            path: arr[arr.length - 1]
          })
        } else {
          this.$router.togo({
            path: arr[arr.length - 1]
          })
        }
      }
    },
    // 回到首页
    goIndex() {
      this.$router.togo({
        path: '/index'
      })
    },
    // 跳转到个人中心
    linkGo() {
      this.$router.togo({
        path: '/personCenter'
      })
    },
    // 跳转到公告详情
    viewDetail(id, name) {
      this.$router.togo({
        path: '/noticeDetail?id=' + id + '&name=' + name
      })
    },
    // 跳转到商品详情
    goDetail(id) {
      this.$router.togo({
        path: '/proDetail?type=normal&id=' + id
      })
    },
    // 添加购物车
    addCar(id, type) {
      const that = this
      var obj = {
        pid: id,
        quantity: 1,
        checked: 0,
        deal_type: type
      }
      addCarofPro(obj).then(res => {
        if (res.isSuccess) {
          if (that.$store.state.home.carpro === '') {
            that.setCarPro([id])
          } else {
            var carList = that.$store.state.home.carpro
            for (var i = 0; i < carList.length; i++) {
              if (carList[i] === id) {
                break
              }
            }
            if (i >= carList.length) {
              carList.push(id)
            }
            that.setCarPro(carList)
          }
          Toast({
            message: '加入购物车成功',
            iconClass: 'iconfont icon-dui1',
            icon: 'success'
          })
        } else {
          Toast({
            message: res.msg,
            duration: 1000
          })
        }
      })
    }
  }
}

</script>
<style lang="less" scoped>
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .arrow-right {
    width: 40/100rem;
    height: 40/100rem;
    background-image: url('https://share.gongzhugou.com/static/image/xcx_img/shoper/arrow-right.png');
    background-size: cover;
    vertical-align: middle;
  }

  .arrow-right.gray {
    background-image: url('https://share.gongzhugou.com/static/image/xcx_img/shoper/arrow-right-gray.png');
  }

  .icon {
    width: 44/100rem;
    height: 44/100rem;
    background-size: cover;
    vertical-align: middle;
    // margin-right: 12/100rem;
    display: inline-block;
    margin-top: -0.05rem;
  }

  .icon-fans {
    background-image: url('https://share.gongzhugou.com/static/image/xcx_img/shoper/fans.png');
    margin-top: -0.09rem
  }

  .icon-notice {
    background-image: url('https://share.gongzhugou.com/static/image/xcx_img/shoper/notice.png')
  }

  .icon-buy {
    background-image: url('https://share.gongzhugou.com/static/image/xcx_img/shoper/buy.png')
  }

  .shoperFixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }

  .shper_bottom {
    /* margin-bottom:10/100rem;  */
    position: relative;
    /* background: #fff; */
    overflow-x: hidden;
    left: 0;
    bottom: 10/100rem;
  }

  .m_header {
    height: 322/100rem;
    width: 100%;
    padding: 52/100rem 40/100rem 0 40/100rem;
    box-sizing: border-box;
    background: linear-gradient(180deg, rgba(252, 217, 187, 1) 0%, rgba(243, 191, 162, 1) 100%);
  }

  .m_header .remind_bg {
    position: absolute;
    width: 260/100rem;
    height: 40/100rem;
    background: #fff;
    opacity: 0.6;
    border-radius: 10/100rem;
    font-size: 20/100rem;
    right: 120/100rem;
    padding-left: 20/100rem;
    line-height: 40/100rem;
    top: 16/100rem;
  }

  .m_header .remind_bg .sanjia {
    position: absolute;
    border-right: 0/100rem solid transparent;
    border-left: 18/100rem solid transparent;
    border-top: 22/100rem solid #fff;
    bottom: -13/100rem;
    right: -1/100rem;
    transform: rotate(-20deg);
  }

  .asshoper {
    height: 98/100rem;
  }

  .asshoper_bottom {
    height: 166/100rem;
  }

  /* 头部会员信息 */

  .m_info {
    padding-top: 36/100rem;
    margin-left: 20/100rem;
    display: flex;
    align-items: center;
  }

  .m_info .m_avatar {
    width: 100/100rem;
    height: 100/100rem;
    /* margin-right: 50/100rem; */
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
    /* background: transparent */
  }

  /* 登陆成功后的会员信息 */

  .m_info_login {
    /* margin-left: 20/100rem; */
    display: flex;
    /* align-items: flex-end; */
    height: 200/100rem;
    justify-content: space-between;
  }

  .m_info_login .m_avatar {
    width: 100/100rem;
    height: 100/100rem;
    /* margin-right: 24/100rem; */
    /* margin-bottom: 10/100rem; */
    border-radius: 50%;
  }

  .m_info_login .m_info_title {
    /* width: 260/100rem; */
    /* margin-right: 140/100rem; */
    width: 300/100rem;
    padding-left: 20/100rem;
    /* display: inline-flex; */
  }

  .m_info_login .m_info_title .m_info_name {
    font-size: 30/100rem;
    font-weight: 600;
    color: rgba(0, 0, 0, .85);
    line-height: 50/100rem;
    margin-bottom: 10/100rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .m_info_login .m_info_title .m_info_level {
    font-size: 28/100rem;
    font-weight: 400;
    color: rgba(0, 0, 0, .85);
    line-height: 40/100rem;
  }

  .m_info_login .m_info_title .m_info_level .m_info_Id {
    font-size: 26/100rem;
    padding-bottom: 10/100rem;
    display: block;
    margin-top: 2/100rem;
  }

  .m_info_login .m_info_title .m_info_level .m_info_copy {
    font-size: 20/100rem;
    width: 226/100rem;
    line-height: 36/100rem;
    background: #f9bb1a;
    border-radius: 18/100rem;
    overflow: hidden;
    padding-left: 10/100rem;
    margin-left: -15/100rem;
  }

  .m_info_login .m_info_title .m_info_level .m_info_copy span:nth-child(1) {
    float: left;
  }

  .m_info_login .m_info_title .m_info_level .m_info_copy span:nth-child(2) {
    float: right;
    line-height: 36/100rem;
    background: #ffd25e;
    padding: 0 8/100rem;
    border-radius: 18/100rem;
    color: #333;
  }

  .m_score {
    /* overflow: hidden; */
    color: #fff;
    width: 110/100rem;
    font-size: 30/100rem;
    /* background: #f9bb1a; */
    border-radius: 10/100rem;
    text-align: center;
    padding-top: 8/100rem;
  }

  .m_score .m_score_l {
    width: 100%;
    text-align: center;
  }

  .m_score .m_score_l img {
    width: 48/100rem;
    height: 48/100rem;
  }

  .m_score .m_score_l span {
    display: block;
    font-size: 24/100rem;
    text-align: center;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    line-height: 34/100rem;
    margin-top: 10/100rem;
  }

  .view_hidden {
    display: none;
  }

  /* 中间部分 */
  // 新钱包样式
  .wallet-info-block {
    position: relative;
    width: 100%;
    height: 200/100rem;
    box-sizing: border-box;
    padding: 0 40/100rem;
    margin-top: -120/100rem;
    margin-bottom: 40/100rem;
  }

  .info-wallet {
    height: 2rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0.04rem 0.4rem 0 rgba(202, 204, 218, 0.25);
    border-radius: 0.08rem;
    display: flex;
    align-items: center;

    div {
      width: 33.3%;
      text-align: center;

      p {
        font-size: 0.24rem;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.5);
      }

      .num {
        font-size: 0.32rem;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.85);
      }
    }

  }

  /* 旧钱包 */

  .wallet-wrap {
    position: relative;
    width: 100%;
    height: 336/100rem;
    box-sizing: border-box;
    padding: 0 40/100rem;
    margin-top: -120/100rem;
    margin-bottom: 40/100rem;
  }

  .wallet-container {
    background: #fff;
    border-radius: 10/100rem;
  }

  .wallet-total {
    position: relative;
    width: 100%;
    height: 200/100rem;
    background-image: url('http://share.gongzhugou.com/static/image/xcx_img/shoper/wallet-bg.png');
    background-size: cover;
    overflow: hidden;
  }

  .wallet-total .money {
    display: block;
    font-size: 48/100rem;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    line-height: 58/100rem;
    margin-top: 62/100rem;
    text-align: center;
  }

  .wallet-total label {
    font-size: 28/100rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 40/100rem;
    display: block;
    text-align: center;
  }

  .my-wallet {
    position: absolute;
    top: 16/100rem;
    right: 16/100rem;
  }

  .my-wallet span {
    font-size: 28/100rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.7);
    line-height: 40/100rem;
  }

  .my-wallet .arrow-right {
    font-size: 28/100rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.7);
    line-height: 40/100rem;
    display: inline-block;
  }

  .arrow-top {
    position: absolute;
    width: 0;
    height: 0;
    border-width: 24/100rem 22/100rem;
    border-color: transparent transparent #fff transparent;
    border-style: solid;
    bottom: 0;
    left: 312/100rem;
  }

  .wallet-info {
    display: flex;
    height: 132/100rem;
    width: 100%;
    background: #fff;
    box-shadow: 0px 10px 20px 0px rgba(202, 204, 218, 0.25);
    border-radius: 0 0 8/100rem 8/100rem;
  }

  .wallet-info-item {
    width: 50%;
    height: 100%;
  }

  .wallet-info-item span {
    display: block;
    font-size: 32/100rem;
    color: rgba(0, 0, 0, 0.85);
    line-height: 38/100rem;
    text-align: center;
    margin-top: 30/100rem;
  }

  .wallet-info-item label {
    display: block;
    font-size: 24/100rem;
    font-weight: 300;
    color: rgba(0, 0, 0, 0.5);
    line-height: 34/100rem;
    text-align: center;
    margin-top: 4/100rem;
  }

  /*我的粉丝  用户公告*/
  .fans-wrap,
  .notice-wrap {
    width: 100%;
    box-sizing: border-box;
    padding: 0 40/100rem;
    margin-bottom: 40/100rem;
  }

  .fans-wrap {
    height: 218/100rem;
  }

  .fans-header,
  .notice-header {
    position: relative;
    width: 100%;
    height: 44/100rem;
    margin-bottom: 20/100rem;
  }

  .title {}

  .fans-header .title span,
  .notice-header .title span {
    font-size: 32/100rem;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 44/100rem;
    height: 44/100rem;
    display: inline-block
  }

  .toolbar {
    position: absolute;
    right: 0;
    top: 0;
  }

  .toolbar span {
    font-size: 24/100rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.3);
    line-height: 34/100rem;
  }

  .toolbar .gray {
    font-size: 24/100rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.3);
    line-height: 34/100rem;
    display: inline-block
  }

  .fans-body,
  .notice-body {
    width: 100%;
    background: #fff;
    border-radius: 8/100rem;
  }

  .fans-body {
    height: 154/100rem;
  }

  .notice-body {
    padding: 0 30/100rem;
    box-sizing: border-box;
  }

  .fans-info {
    display: flex;
  }

  .fans-info-item {
    width: 33.3333%
  }

  .fans-info-item span {
    display: block;
    font-size: 32/100rem;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
    line-height: 38/100rem;
    text-align: center;
    margin-top: 50/100rem;
  }

  .fans-info-item label {
    display: block;
    font-size: 24/100rem;
    font-weight: 300;
    color: rgba(0, 0, 0, 0.5);
    line-height: 34/100rem;
    text-align: center;
    margin-top: 4/100rem;
  }

  .notice-item {
    height: 140/100rem;
    box-sizing: border-box;
    padding: 28/100rem 0;
    border-bottom: 2/100rem #CACCDA solid;
  }

  .notice-item:last-child {
    border-bottom: none;
  }

  .notice-title {
    font-size: 28/100rem;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
    line-height: 40/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 8/100rem;
  }

  .notice-desc {
    display: flex;
  }

  .notice-summary {
    width: 436/100rem;
    font-size: 24/100rem;
    font-weight: 300;
    color: rgba(0, 0, 0, 0.5);
    line-height: 34/100rem;
    margin-right: 18/100rem;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .notice-time {
    font-size: 24/100rem;
    font-weight: 300;
    color: rgba(0, 0, 0, 0.5);
    line-height: 34/100rem;
    display: block;
    width: 156/100rem;
    white-space: nowrap;
    overflow: hidden;
  }

  // 邀请区域
  .invite-action {
    // margin: 0.36rem 0.44rem;
    margin: 0 0.44rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    img {
      width: 3.26rem;
      height: 1.5rem;
      vertical-align: middle;
    }
  }

  /*ad广告图位*/
  .ad,
  .ad img {
    width: 100%;
    height: 214/100rem;
  }

  /*超值购*/

  .prior-wrap {
    width: 100%;
    padding: 40/100rem;
    background: #FAFAFC;
    box-sizing: border-box;
  }

  .prior-header {
    margin-bottom: 30/100rem;
  }

  .prior-header span {
    font-size: 32/100rem;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 44/100rem;
  }

  .prior-list {
    display: flex;
    flex-wrap: wrap;
  }

  .prior-item {
    width: 50%;
    height: 554/100rem;
    box-sizing: border-box;
    margin-bottom: 30/100rem;
  }

  .prior-item:nth-child(odd) {
    padding-right: 14/100rem;
  }

  .prior-item:nth-child(even) {
    padding-left: 15/100rem;
  }

  .product-wrap {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 8/100rem;
    border: 2/100rem solid rgba(232, 234, 234, 1);
  }

  .product-image {
    width: 100%;
    height: 330/100rem;
    display: block;
    border-radius: 8/100rem 8/100rem 0 0;
  }

  .product-desc {
    padding: 20/100rem;
  }

  .product-name {
    height: 80/100rem;
    font-size: 28/100rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 40/100rem;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-bottom: 10/100rem;
  }

  .product-price {
    height: 44/100rem;
    width: 100%;
    margin-bottom: 10/100rem;
    display: flex;
    justify-content: space-between;
  }

  .product-price .original-price {
    font-size: 32/100rem;
    font-weight: 500;
    color: rgba(255, 67, 67, 1);
    line-height: 44/100rem;
  }

  .product-price .actual-price {
    font-size: 24/100rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    line-height: 34/100rem;
    text-decoration: line-through;
    // margin-left: 14/100rem;
  }

  .product-operate {
    display: flex;
    justify-content: space-between;
    height: 38/100rem;
  }

  .product-operate .tag {
    height: 30/100rem;
    // line-height: 30/100rem;
    background: rgba(232, 193, 146, 1);
    font-size: 20/100rem;
    font-weight: 400;
    color: rgba(79, 43, 0, 1);
    padding: 0 8/100rem;
    margin-top: 8/100rem;
  }

  .product-operate .shopping-car {
    height: 38/100rem;
    width: 38/100rem;
    background-image: url('http://share.gongzhugou.com/static/image/xcx_img/shoper/shop.png');
    background-size: cover;
  }

  /*小程序码*/

  .rwcode {
    position: fixed;
    background: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 999;
  }

  .rwcode_ma {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1000;
    width: 500/100rem;
    height: 600/100rem;
    background: #fff;
  }

  .rwcode_head {
    text-align: center;
    margin: 40/100rem 0 20/100rem;
  }

  .rwcode_ma img {
    display: block;
    width: 400/100rem;
    height: 400/100rem;
    margin: 0 auto;
  }

  /*成为店主弹出框*/

  .a_shoper_bg {
    position: fixed;
    top: 0/100rem;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
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

  .a_shoper_dia .a_shoper_tit text .shoper_light {
    // color: #f3c0a2;
    color: #a6aac9;
  }

  .a_shoper_dia .a_shoper_tit .a_shoper_tit_t {
    line-height: 108/100rem;
    display: block;
  }

  .a_shoper_dia .a_shoper_tit .a_shoper_tit_b {
    display: block;
    font-size: 30/100rem;
  }

  .a_shoper_share {
    display: flex;
    justify-content: space-around;
    padding: 0.5rem;
    padding-bottom: 0;
  }

  .a_shoper_share .share_bg {
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
    // background: #f3c0a2;
    background: rgb(166, 170, 201);
    border-radius: 36/100rem;
    color: #fff;
    font-size: 35/100rem;
  }
  .invite-gift{

  }
  .invite-title {
    text-align: center;
    position: relative;
  }

  .invite-title p{
    text-align: center;
    font-size:0.24rem;
    font-weight:500;
    color:rgba(232,193,146,1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.34rem 0;
  }

  .invite-title span {
    font-size: 32/100rem;
    font-weight: 500;
    line-height: 44/100rem;
    color:rgba(223,174,115,1);
    background:linear-gradient(90deg, rgba(232,202,161,1) 0%, rgba(200,158,108,1) 100%);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
  }

  .member-icon {
    // position: absolute;
    // top: 20/100rem;
    height: 12/100rem;
    width: 40/100rem;
  }

  .member-icon.left {
    padding-right: 0.1rem;
  }

  .member-icon.right {
    padding-left: 0.1rem;
  }

  .gift-wrap {
    // width: 670/100rem;
    // margin-left: 40/100rem;
    margin: 0 0.3rem;
    // padding-bottom: 0.58rem;
  }

  .gift-header {
    position: relative;
    width: 100%;
    height: 142/100rem;
    line-height: 142/100rem;
    background-image: url('https://share.gongzhugou.com/static/image/xcx_img/asShoper/gift-header.png');
    background-size: contain;
  }

  .gift-header-tag {
    position: absolute;
    width: 72/100rem;
    height: 162/100rem;
    left: -40/100rem;
    top: -19/100rem;
  }

  .gift-title {
    font-size: 32/100rem;
    font-weight: 500;
    color: rgba(104, 57, 0, 1);
    line-height: 44/100rem;
    padding-left: 36/100rem;
  }

  .gift-header button {
    float: right;
    width: 148/100rem;
    height: 48/100rem;
    background: rgba(232, 193, 146, 1);
    border-radius: 40/100rem;
    font-size: 24/100rem;
    font-weight: 400;
    line-height: 48/100rem;
    color: rgba(79, 43, 0, 1);
    text-align: center;
    margin: 36/100rem 36/100rem 0 0;
    padding: 0;
  }

  .gift-body {
    background: #fff;
    padding: 40/100rem;
    border-radius: 0 0 12/100rem 12/100rem;
  }

  .gift-list {
    display: flex;
    flex-wrap: wrap;
  }

  .gift-item {
    width: 50%;
    min-height: 374/100rem;
    box-sizing: border-box;
    margin-bottom: 28/100rem;
  }

  .gift-item:nth-child(odd) {
    padding-right: 15/100rem;
  }

  .gift-item:nth-child(even) {
    padding-left: 15/100rem;
  }

  .gift-box {
    height: 100%;
    border-radius: 8/100rem;
    // border: 2/100rem solid rgba(202, 204, 218, 0.7);
    box-sizing: border-box;
    // padding: 20/100rem;
    background: #fff;
  }

  .gift-box img {
    width: 100%;
    // height: 240/100rem;
    display: block;
    margin-bottom: 8/100rem;
  }

  .gift-box .gift-name {
    padding: 0 0.2rem;
    font-size: 28/100rem;
    font-weight: 400;
    color:rgba(0,0,0,0.85);
    margin-bottom: 10/100rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    height: 70/100rem;
  }

  .gift-box .gift-price {
    padding: 0 0.14rem;
    font-size: 24/100rem;
    line-height: 44/100rem;
    margin-bottom: 0.4rem;
    font-weight:400;
    color:rgba(0,0,0,0.4);
  }

  .gift-box .gift-price .price{
    font-size:0.32rem;
    font-family:PingFangSC;
    font-weight:500;
    color:rgba(255,67,67,1);
    margin-right: 0.14rem;
  }

  .gift-box .gift-price .market{
    text-decoration: line-through;
  }
    .order-foot {
    height: 84/100rem;
    line-height: 84/100rem;
    /* background: #fff; */
    text-align: center;
  }

  .order-foot span {
    font-size: 23.97/100rem;
    color: #bebebe;
  }
   .order-foots{
     width: 100%;
     text-align: center;
   }
 .order-foots img{
    display: inline-block;
    width: 750/100rem;
    height: 357/100rem;
    margin: 0.7rem 0;
  }

</style>
