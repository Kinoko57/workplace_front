<template>
    <div>
        <common-header :h_title="h_title" :showback="true" :bgcolor='head_color' :r_title="r_title" :showrtext="true" @goright='gowhere'></common-header>
        <div class="my_wal" v-if="showMyal">
            <div style='height:0.9rem'></div>
            <div class="my_wal_t">
                <span>¥{{myWalInfo.total_money}}</span>
                <span>总金额</span>
            </div>
            <div class="my_wal_b">
                <div class="my_wal_b_l" @click="goCash">
                    <span class="my_wal_b_l_Num">¥{{myWalInfo.income}}</span>
                    <div class="my_wal_b_l_text">
                        <span>可提现</span>
                        <i class="iconfont icon-iconfontjiantou5"></i>
                    </div>
                </div>
                <div class="my_wal_b_r">
                    <span class="my_wal_b_l_Num">¥{{myWalInfo.stay_wind}}</span>
                    <div class="my_wal_b_l_text">
                        <span>待结算</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import commonHeader from 'common/common-header'
import {
  Indicator
} from 'mint-ui'
import {
  getWalInfo
} from '@/api/share'
export default {
  name: 'MyWallet',
  components: {
    commonHeader
  },
  data() {
    return {
      h_title: '我的钱包',
      r_title: '明细',
      head_color: {
        background: '#fff',
        color: '#000'
      },
      myWalInfo: {},
      imgPath: process.env.FilE_URL,
      showMyal: false
    }
  },
  mounted() {
    this.getWalletInfo()
  },
  methods: {
    getWalletInfo() {
      Indicator.open('加载中...')
      const that = this
      getWalInfo().then(res => {
        if (res.isSuccess) {
          Indicator.close()
          that.showMyal = true
          that.myWalInfo = res.data.money
        }
      })
    },
    gowhere() {
      this.$router.togo({
        path: '/walletDetail'
      })
    },
    goCash() {
      this.$router.togo({
        path: '/cashWithDrawal'
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~styles/index.less';
@import '~styles/variable.less';
.my_wal{
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    background:rgba(250,250,252,1);
}
.my_wal_t{
    width:750/100rem;
    height:224/100rem;
    color: #fff;
    text-align: center;
    background-image: url('http://share.gongzhugou.com/static/image/xcx_img/shop/mywal_bg.png');
    background-size: cover;
}
.my_wal_t span:nth-child(1){
    height:58/100rem;
    font-size:48/100rem;
    font-weight:bold;
    line-height:58/100rem;
    display: block;
    width: 100%;
    text-align: center;
    padding-top: 0.6rem
}
.my_wal_t span:nth-child(2){
    height:34/100rem;
    font-size:24/100rem;
    font-weight:400;
    color:rgba(255,255,255,0.85);
    line-height:34/100rem;
    display: inline-block;
}
.my_wal_b{
    width:750/100rem;
    height:150/100rem;
    background:rgba(255,255,255,1);
    box-shadow:0/100rem 4/100rem 20/100rem 0/100rem rgba(202,204,218,0.25);
    border-radius:8/100rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.my_wal_b .my_wal_b_l{
  width: 50%;
}
.my_wal_b .my_wal_b_r{
width: 50%;
}
.my_wal_b .my_wal_b_l_Num{
    height:38/100rem;
    font-size:32/100rem;
    font-weight:bold;
    color:rgba(0,0,0,0.85);
    line-height:38/100rem;
    display: block;
    width: 100%;
    text-align: center;
}
.my_wal_b .my_wal_b_l_text{
    height:32/100rem;
    font-size:22/100rem;
    font-weight:400;
    color:rgba(0,0,0,0.5);
    line-height:32/100rem;
    text-align: center;
    margin-top: 0.06rem;
}
</style>
