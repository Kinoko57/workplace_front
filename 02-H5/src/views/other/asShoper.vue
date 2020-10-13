<template>
  <div>
    <common-header :h_title="h_title" :showback="false" :bgcolor='head_color'></common-header>
    <div style='height:0.9rem' id="card"></div>
    <div class='as_body'>
      <div class="as_shoper">
        <!-- <img :src="imgPath+'asShoper/top-banner-app.png'" class="top-banner"/> -->
        <div class="invite-info">
          <div class="invite-img">
            <img :src="inviteInfo.image" alt="" srcset="">
          </div>
          <div class="invite-right">
            <p class="name">Hi 我是<span>{{inviteInfo.nickname}}</span></p>
            <p class="tips">邀您成为会员，让生活更精致～</p>
          </div>
        </div>
        <div class="invite-line"></div>
        <div class="pre-member">
          <span class="pre-member-title">· 您当前可享权益 ·</span>
        </div>
        <div class="pre-member-list">
          <div class="pre-member-item">
            <i class="pre-icon one"></i>
            <span>购物积分</span>
          </div>
          <div class="pre-member-item">
            <i class="pre-icon two"></i>
            <span>优惠卡券</span>
          </div>
          <div class="pre-member-item">
            <i class="pre-icon three"></i>
            <span>免费试用</span>
          </div>
          <div class="pre-member-item">
            <i class="pre-icon four"></i>
            <span>幸运抽奖</span>
          </div>
        </div>
        <div style="padding:0 0.8rem;">
          <img src="../../assets/img/asShoper/title.png" style="width:100%" alt="">
        </div>
        <div class="panel-bg">
          <div>
            <img src="../../assets/img/asShoper/panel.png" style="width:100%;" alt="">
          </div>
          <!-- <div class='condition-list'>
          <div class="condition-item" v-for="(item, index) in conditionList" :key="index">
            <img :src="item.img"/>
              <div class="condition-item-content">
              <span class="condition-item-title">{{item.title}}</span>
              <span class="condition-item-desc">{{item.desc}}</span>
            </div>
          </div>
      </div> -->
        </div>

        <div class="member-title">
          <img class="member-icon left" :src="imgPath+'asShoper/icon-left.png'" />
          <span>升级会员 立享特权</span>
          <img class="member-icon right" :src="imgPath + 'asShoper/icon-right.png'" />
        </div>
        <div class="gift-wrap">
          <div class="gift-header">
            <img class="gift-header-tag" :src="imgPath + 'asShoper/gift-header-tag.png'" />
            <span class="gift-title">购买以下任一礼包</span>
            <button @click='goGift'>查看全部</button>
          </div>
          <div class="gift-body">
            <div class="gift-list">
              <div class="gift-item" v-for="(item, index) in giftList" :key="index"
                @click="goGiftDetail('normal',item.goods_id)">
                <div class="gift-box">
                  <img :src="item.img" />
                  <div class="gift-name">{{item.name}}</div>
                  <div class="gift-price">￥{{item.price_sell}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-bg">
        <!-- <div class="member-title" style='margin-bottom:0.36rem'>
        <img class="member-icon left" :src="imgPath + 'asShoper/icon-left.png'" style='left:1.58rem'/>
        <span>升级会员 享超多权益</span>
        <img class="member-icon right" style='right:.158rem' :src="imgPath+'asShoper/icon-right.png'"/>
      </div>
      <div class="prior-wrap">
        <div class="prior-header">
          <span class="prior-title">自购省/分享赚</span>
        </div>
        <div class="prior-body">
          <div class="prior-list">
            <div class="prior-item" v-for="(item, index) in priorList" :key="index">
              <img :src="item.gimg"/>
              <span class="prior-name">{{item.gname}}</span>
              <div class="prior-price">
                <span class="original-price">原价{{item.price_market}}</span>
                <span class="actual-price">到手价{{item.price_sell | toFix(1)}}</span>
              </div>
              <div class="prior-tag">省/赚{{item.back_rebate | toFix(0)}}</div>
            </div>
          </div>
        </div>
      </div> -->

        <div class="member-title" style='margin-bottom:0.9rem'>
          <!-- src="{{imgPath}}asShoper/icon-left.png" -->
          <img class="member-icon left" style='left:1.58rem' :src="imgPath + 'asShoper/icon-left.png'" />
          <span>公主购发展 你我见证</span>
          <img class="member-icon right" :src="imgPath + 'asShoper/icon-right.png'" style='right:1.58rem' />
        </div>
        <div class="timeline-wrap">
          <img :src="imgPath +'asShoper/timeline.png'" />
        </div>
      </div>
    </div>
    <div class="btn-wrap" v-if="isTop">
      <button @click='goGift'></button>
    </div>
    <!-- <include src="../footerTab/footerTab.wxml" /> -->
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import returnTop from '@/components/return-top'
import {
  getCarList,
  getNewsRead
} from '@/api/index'
import {
  memberGiftList,
  getInviteInfo
} from '@/api/share'
import {
  mapMutations
} from 'vuex'
import {
  Indicator,
  InfiniteScroll,
  Button
} from 'mint-ui'
export default {
  name: 'AsShoper',
  filters: {
    toFix(val, count) {
      const num = parseFloat(val)
      return num.toFixed(count)
    }
  },
  components: {
    commonHeader,
    returnTop,
    InfiniteScroll,
    Button
  },
  data() {
    return {
      isTop: false,
      useBuy: process.env.FilE_URL + 'shop/shop1.png',
      fansBuy: process.env.FilE_URL + 'shop/shop2.png',
      h_title: '升级会员',
      head_color: {
        background: '#000000',
        color: '#ffffff'
      },
      newNews: false,
      news_num: 0,
      showAsShoper: false,
      rebate: '',
      isShow: false,
      imgPath: process.env.FilE_URL,
      as_shoperClass: '',
      // is_iphonex: app.globalData.phoneType,
      isMember: this.$store.state.home.is_member,
      topNum: 0,
      shoperShow: false,
      shoper: false,
      rulesTitle: '成为会员条件',
      isShowVip: true,
      proType: 1,
      height: '',
      giftList: [],
      priorList: [],
      inviteInfo: {},
      conditionList: [{
        img: process.env.FilE_URL + 'asShoper/icon1.png',
        title: '购物省钱',
        desc: '购物省5%~35%'
      },
      {
        img: process.env.FilE_URL + 'asShoper/icon2.png',
        title: '分享赚钱',
        desc: '推广赚5%~35%'
      },
      {
        img: process.env.FilE_URL + 'asShoper/icon3.png',
        title: '创业无忧',
        desc: '一件代发无需囤货'
      },
      {
        img: process.env.FilE_URL + 'asShoper/icon4.png',
        title: '经销特权',
        desc: '海量爆品销售权'
      },
      {
        img: process.env.FilE_URL + 'asShoper/icon5.png',
        title: '创业辅导',
        desc: '专业导师指导'
      },
      {
        img: process.env.FilE_URL + 'asShoper/icon6.png',
        title: '无忧售后',
        desc: '7*24h专业客服'
      },
      {
        img: process.env.FilE_URL + 'asShoper/icon7.png',
        title: '新品试用',
        desc: '新品抢先体验'
      },
      {
        img: process.env.FilE_URL + 'asShoper/icon8.png',
        title: '专享好礼',
        desc: '专享商品及福利'
      },
      {
        img: process.env.FilE_URL + 'asShoper/icon9.png',
        title: '专享卡券',
        desc: '送礼包等额优惠券'
      }
      ],
      top: 0
    }
  },
  mounted() {
    // 自选专区
    // 获取邀请人信息
    if (this.$store.state.home.userInfo.inviter > 0) {
      this.getInfo()
    } else {
      this.inviteInfo = { image: process.env.FilE_URL + 'member/invite-head.png', nickname: '公主购官方小助手' }
    }
    this.getList()
    this.getAlways()
    this.tabScroll()
  },
  methods: {
    ...mapMutations({
      setCarnum: 'SET_CARNUM',
      setNews: 'SET_NEWS',
      setNewsnum: 'SET_NEWSNUM',
      setIssign: 'SET_ISSIGN'
    }),
    tabScroll() {
      window.addEventListener('scroll', this.handleScroll)
    },
    getInfo() {
      let that = this
      getInviteInfo().then(res => {
        if (res.isSuccess === true || res.isSuccess === 'true') {
          that.inviteInfo = res.data
        }
      })
    },
    handleScroll() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.top = scrollTop
      if (this.top >= 260) {
        this.isTop = true
      } else {
        this.isTop = false
      }
    },
    getList() {
      const that = this
      Indicator.open('加载中...')
      memberGiftList().then(res => {
        Indicator.close()
        if (res.isSuccess) {
          console.log(res)
          that.giftList = res.data.gift
          that.priorList = res.data.prior
        }
      })
    },
    goGift() {
      this.$router.togo({
        path: '/giftPackage'
      })
    },
    goGiftDetail(type, id) {
      this.$router.togo({
        path: '/newPeopleDetail?type=' + type + '&id=' + id
      })
    },
    getAlways() {
      var that = this
      // 查询购物车数量
      getCarList({
        p: 1,
        limit: 10
      }).then(res => {
        if (res.isSuccess) {
          // that.total_amout = res.data.rows_total
          that.setCarnum(res.data.rows_total)
          console.log(res, 'res')
        }
      })
      // 查询是否有新消息
      getNewsRead().then(res => {
        console.log(res, 'res2')
        // 判断是否签到
        if (res.isSuccess) {
          if (res.data.is_sign === 1 || res.data.is_sign === '1') {
            // that.isSign = true
            that.setIssign(true)
          } else {
            // that.isSign = false
            that.setIssign(false)
          }
        }
        // 判断是否生日
        if (res.data.is_birthday === 1) {
          that.is_birthday = true
          that.birthday_img = res.birthday_img
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
      })
    }
  },
  beforeDestroy() {
    // this.$refs.slider.$emit('autoplayStop')
    window.removeEventListener('scroll', this.handleScroll)
  }
}

</script>

<style scoped lang="less">
  /* pages/asShoper/asShoper.wxss */
  // @import '../footerTab/footerTab.wxss';

  .as_shoper {
    /* margin-bottom:100/100rem; */
    width: 100%;
    background-image: url('https://share.gongzhugou.com/static/image/xcx_img/asShoper/bg.png');
    background-size: cover;
    background-repeat: no-repeat;
    font-size: 0;
  }

  .invite-info {
    padding-top: 0.46rem;
    padding-left: 1.44rem;
    display: flex;
    align-items: center;
    // justify-content: center;

    .invite-img {
      width: 0.8rem;
      height: 0.8rem;
      border: 0.02rem solid rgba(223, 174, 115, 1);
      border-radius: 50%;
      margin-right: 0.2rem;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .invite-right {
      .name {
        font-size: 0.24rem;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.85);
        max-width: 4rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span{
          color: rgba(255, 255, 255, 1);
          font-weight: bold;
        }
      }

      .tips {
        font-size: 0.28rem;
        font-weight: 400;
        color: rgba(232, 193, 146, 1);
        padding-top: 0.04rem;
      }
    }

  }
  .invite-line{
    margin: 0 auto;
    margin-top: 0.4rem;
    width:6.7rem;
    height:0.02rem;
    background:linear-gradient(90deg,rgba(23,23,23,0) 0%,rgba(255,227,194,1) 50%,rgba(0,0,0,0) 100%);
  }

  .top-banner {
    width: 100%;
    height: 696/100rem;
    margin-top: 80/100rem;
    margin-bottom: 82/100rem;
  }

  .member-title {
    text-align: center;
    position: relative;
    margin-bottom: 58/100rem;
  }

  .member-title span {
    font-size: 32/100rem;
    font-weight: 500;
    color: rgba(232, 193, 146, 1);
    line-height: 44/100rem;
  }

  .member-icon {
    position: absolute;
    top: 20/100rem;
    height: 12/100rem;
    width: 40/100rem;
  }

  .member-icon.left {
    left: 178/100rem;
  }

  .member-icon.right {
    right: 174/100rem;
  }

  .gift-wrap {
    width: 670/100rem;
    margin-left: 40/100rem;
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
    height: 374/100rem;
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
    border: 2/100rem solid rgba(202, 204, 218, 0.7);
    box-sizing: border-box;
    padding: 20/100rem;
  }

  .gift-box img {
    width: 240/100rem;
    height: 240/100rem;
    display: block;
    margin-bottom: 8/100rem;
  }

  .gift-box .gift-name {
    font-size: 28/100rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 40/100rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 10/100rem;
  }

  .gift-box .gift-price {
    font-size: 36/100rem;
    color: rgba(255, 67, 67, 1);
    line-height: 44/100rem;
  }

  .bottom-bg {
    width: 100%;
    /* height: 100%; */
    background-image: url('https://share.gongzhugou.com/static/image/xcx_img/asShoper/bg2.png');
    background-size: cover;
    margin-top: -4/100rem;
    padding-top: 120/100rem;
    font-size: 0;
  }

  .prior-wrap {
    width: 670/100rem;
    margin-left: 40/100rem;
    border-radius: 12/100rem;
    border: 2/100rem solid rgba(232, 193, 146, 1);
    box-sizing: border-box;
    padding: 30/100rem 20/100rem;
    margin-bottom: 120/100rem;
  }

  .prior-header {
    text-align: center;
    margin-bottom: 48/100rem;
  }

  .prior-title {
    font-size: 32/100rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 44/100rem;
  }

  .prior-item {
    height: 60/100rem;
    width: 100%;
    margin-bottom: 30/100rem;
    display: flex;
  }

  .prior-item:last-child {
    margin-bottom: 0;
  }

  .prior-item img {
    width: 60/100rem;
    height: 60/100rem;
    border-radius: 50%;
  }

  .prior-item .prior-name {
    width: 280/100rem;
    font-size: 24/100rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.8);
    line-height: 60/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .prior-item .prior-price {
    width: 150/100rem;
    margin-left: 14/100rem;
  }

  .prior-price .original-price {
    font-size: 20/100rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    line-height: 28/100rem;
    display: block;
    text-decoration: line-through;
    margin-left: 14/100rem;
  }

  .prior-price .actual-price {
    font-size: 24/100rem;
    font-weight: 400;
    color: rgba(232, 193, 146, 1);
    line-height: 34/100rem;
    display: block;
    white-space: nowrap
  }

  .prior-item .prior-tag {
    width: 112/100rem;
    height: 40/100rem;
    margin-left: 24/100rem;
    background: rgba(232, 193, 146, 1);
    border-radius: 4/100rem;
    font-size: 24/100rem;
    font-weight: 400;
    color: rgba(79, 43, 0, 1);
    line-height: 40/100rem;
    box-sizing: border-box;
    padding: 0 4/100rem;
    white-space: nowrap;
    margin-top: 10/100rem;
    text-align: center
  }

  .condition-list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    position: relative;
    // height: 8.373333rem;
    // background-image: url('../../assets/img/asShoper/panel.png');
    // background-size: cover;
  }

  .condition-item {
    width: 33.3333%;
    // margin-bottom: 68/100rem;
    display: flex;
    box-sizing: border-box;
  }

  .condition-item:nth-child(even) {
    padding-left: 38/100rem;
  }

  .condition-item img {
    width: 80/100rem;
    height: 80/100rem;
    margin-right: 16/100rem;
  }

  .condition-item-content {
    width: 200/100rem;
  }

  .condition-item:nth-child(odd) .condition-item-content {
    width: 240/100rem;
  }

  .condition-item-title {
    display: block;
    font-size: 28/100rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 40/100rem;
  }

  .condition-item-desc {
    font-size: 24/100rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.7);
    line-height: 34/100rem;
  }

  .timeline-wrap {
    padding: 0 0.6rem;
  }

  .timeline-wrap img {
    width: 100%;
    // height: 832/100rem;
    // margin-left: 86/100rem;
    margin-bottom: 100/100rem;
  }

  .btn-wrap {
    position: fixed;
    bottom: 98/100rem;
    width: 100%;
    height: 128/100rem;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
    display: flex;
  }

  .btn-wrap button {
    height: 88/100rem;
    width: 670/100rem;
    margin: 0 auto;
    background-image: url('https://share.gongzhugou.com/static/image/xcx_img/asShoper/btn-app.png');
    background-size: cover;
    border-radius: 50/100rem;
    margin-top: 20/100rem;
    align-items: center;
  }

  .m_footertab {
    box-shadow: none;
  }

  .pre-member {
    padding-top: 0.48rem;
    margin-bottom: .56rem;
    text-align: center;
  }

  .pre-member-title {
    font-size: 0.32rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.85);
  }

  .pre-member-list {
    display: flex;
    margin-bottom: .8rem;
    justify-content: space-between;
    padding: 0 0.72rem;
  }

  .pre-member-item {
    // width: 25%;
    // display: flex;
    // flex-wrap: wrap;
    // justify-content: center;
    display: inline-block;
    text-align: center;

  }

  .pre-member-item .pre-icon {
    display: block;
    width: .5rem;
    height: .5rem;
    background-size: cover;
    margin: 0 auto;
    margin-bottom: 0.08rem;
  }

  .pre-member-item span {
    font-size: .24rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);
    display: block;
    text-align: center;
  }

  .pre-icon.one {
    background-image: url('../../assets/img/asShoper/pre_icon1.png');
  }

  .pre-icon.two {
    background-image: url('../../assets/img/asShoper/pre_icon2.png');
  }

  .pre-icon.three {
    background-image: url('../../assets/img/asShoper/pre_icon3.png');
  }

  .pre-icon.four {
    background-image: url('../../assets/img/asShoper/pre_icon4.png');
  }

  .panel-bg {
    padding: 0 .56rem;
    margin-bottom: 1.306667rem;
  }

</style>
