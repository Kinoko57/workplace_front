<template>
    <div>
        <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header>
        <div class="wallet_detail" v-if="showWalDetail">
            <return-top @returnTop='goTop'></return-top>
            <div id='wallet_detail' style='height:0.9rem'></div>
            <div class='wallet_detail_nav'>
                <div @click='etailedType("2")' :class="detailType=='2'?'text_active':'text1'" id='2'>支出</div>
                <div @click='etailedType("1")' :class="detailType=='1'?'text_active':'text1'" id='1'>收入</div>
            </div>
            <div style="height:0.97rem"></div>
            <div class='wallet_detail_wraper' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30" infinite-scroll-immediate-check='autoOpen'>
              <div class="wallet_detail_listwraper">
                <div class='wallet_detail_list' v-for="(item,index) in detail_list" :key="index">
                    <div class='wallet_detail_list_l'>
                        <span class="text_tit">{{item.type_title}}</span>
                        <span class="text_time">{{item.createtime}}</span>
                    </div>
                    <div class='wallet_detail_list_r'>
                        <span v-if="detailType==='2'" class="rede_money">-￥{{item.money}}</span>
                        <span v-if="detailType==='1'" class="add_money">+￥{{item.money}}</span>
                    </div>
                </div>
              </div>
              <div class='more_load' v-if='!loading'>
                <mt-spinner type="fading-circle"></mt-spinner>
              </div>
              <div class='list_bottom' v-if='total>0&&detail_list.length==total'>—————— 我是有底线的 ——————</div>
              <div class='center' v-if='hasData==false'>
                <img :src='nullImg'/>
                <span>没有发现任何数据哦~</span>
              </div>
            </div>
        </div>
    </div>
</template>
<script>
import commonHeader from 'common/common-header'
import returnTop from '@/components/return-top'
import nullImg from '@/assets/img/null/fans_null.png'
import {
  InfiniteScroll,
  Indicator,
  Spinner,
  Button

} from 'mint-ui'
import {
  getWaldetaiInfo
} from '@/api/share'
export default {
  name: 'WalletDetail',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Spinner,
    returnTop,
    Button
  },
  data() {
    return {
      h_title: '钱包明细',
      head_color: {
        background: '#fff',
        color: '#000'
      },
      nullImg: nullImg,
      imgPath: process.env.FilE_URL,
      page: 1,
      limit: 10,
      total: 0,
      proType: 'scan',
      loading: true,
      hasData: true,
      detail_list: [],
      detailType: '2',
      showWalDetail: false
    }
  },
  mounted() {
    this.getWalInfo()
  },
  methods: {
    getWalInfo() {
      Indicator.open('加载中...')
      const that = this
      var obj = {
        type: that.detailType,
        page: that.page,
        limit: that.limit
      }
      getWaldetaiInfo(obj).then(res => {
        if (res.isSuccess) {
          Indicator.close()
          that.showWalDetail = true
          that.total = res.data.total
          if (res.data.rows.length > 0) {
            that.hasData = true
            that.loading = false
            if (res.data.rows.length < that.limit) {
              that.loading = true
            }
            that.detail_list = res.data.rows
          } else {
            that.hasData = false
          }
        }
      })
    },
    etailedType(id) {
      this.detailType = id
      this.total = 0
      this.loading = true
      this.page = 1
      document.getElementById('wallet_detail').scrollIntoView(false)
      this.hasData = true
      this.detail_list = []
      this.hasData = true
      this.getWalInfo()
    },
    loadMore() {
      this.loading = true
      var that = this
      let info = {
        type: that.detailType,
        limit: that.limit,
        page: ++that.page
      }
      console.log(info)
      console.log('zslfjsdlkfjsdl;kf')
      getWaldetaiInfo(info).then(res => {
        if (res.isSuccess) {
          Indicator.close()
          that.total = res.data.total
          if (res.data.rows.length > 0) {
            that.loading = false
            that.detail_list = that.detail_list.concat(res.data.rows)
            if (res.data.rows.length < that.limit) {
              that.loading = true
            }
          } else {

          }
        } else {
          that.total = 0
          that.detail_list = []
          that.loading = true
        }
      })
    },
    goTop() {
      console.log('回到顶部')
      document.getElementById('wallet_detail').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~styles/index.less';
@import '~styles/variable.less';
.wallet_detail{
    width: 100%;
    overflow-x: hidden;
}
.wallet_detail_nav {
  position: fixed;
  z-index: 50;
  width: 100%;
  width:750/100rem;
  height:96/100rem;
  background: -webkit-linear-gradient(top,rgb(250,250,252) 10%,rgb(255,255,255) 58%,rgb(255, 255, 255) 100%);
  display: flex;
  justify-content: space-around;
  box-shadow:0 4/100rem 20/100rem 0/100rem #fafafc;
  border-bottom: 1/100rem solid rgba(232, 232, 232, 1)
}
.wallet_detail_nav div {
    height:92/100rem;
    font-size:28/100rem;
    font-weight:400;
    color:rgba(51,51,51,0.85);
    line-height:92/100rem;
    width: 50%;
    text-align: center;
}
.wallet_detail_nav .text_active {
  border-bottom: 4/100rem solid #E8C192;
  color:rgba(232,193,146,1);
}
.wallet_detail_wraper{
    margin-top: 0.15rem;
    margin-bottom: 0.15rem;
    overflow-y: scroll;
    height: calc(100vh - 2.17rem);
}
.wallet_detail_listwraper{
    width:750/100rem;
    background:rgba(255,255,255,1);
}
.wallet_detail_wraper .wallet_detail_list{
    height:140/100rem;
    overflow: hidden;
    padding: 0 34/100rem;
    border-bottom: 1/100rem solid rgba(232, 232, 232, 1)
}
.wallet_detail_wraper .wallet_detail_list:last-child{
    border-bottom:0
}
.wallet_detail_list .wallet_detail_list_l{
    float: left;
}
.wallet_detail_list .wallet_detail_list_r{
    float: right;
}
.wallet_detail_list .wallet_detail_list_l .text_tit{
    font-size:28/100rem;
    font-weight:400;
    color:rgba(0,0,0,0.85);
    display: block;
    padding-top: 30/100rem;
}
.wallet_detail_list .wallet_detail_list_l .text_time{
    font-size:24/100rem;
    font-weight:400;
    color:rgba(0,0,0,0.4);
    display: inline-block;
    padding-top: 8/100rem;
}
.wallet_detail_list  .wallet_detail_list_r .rede_money{
    height:40/100rem;
    font-size:28/100rem;
    font-weight:400;
    color:rgba(109,212,0,1);
    line-height:40/100rem;
    display: inline-block;
    padding-top: 0.4rem;
}
.wallet_detail_list  .wallet_detail_list_r .add_money{
    font-size:28/100rem;
    font-weight:400;
    color:rgba(223,174,115,1);
    display: inline-block;
    padding-top: 0.4rem;
}
// 底部样式
  .more_load {
    display: flex;
    justify-content: center;
  }

  .list_bottom {
    height: 84/100rem;
    line-height: 84/100rem;
    text-align: center;
    font-size: 23.97/100rem;
    color: #bebebe;
  }
   .center {
    text-align: center;
    width: 100%;
    padding-top: 0.8rem;
  }
  .center img{
    display: inline-block;
    width: 400/100rem;
    height: 400/100rem;
  }
  .center span{
    width: 100%;
    display: inline-block;
    text-align: center;
    padding-top: 0.1rem;
    color: #999
  }
</style>
