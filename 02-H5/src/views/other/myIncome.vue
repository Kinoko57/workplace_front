<template>
    <div>
        <common-header :h_title="h_title" :r_title="r_title" :showrtext="true" :showback="true" :bgcolor='head_color' @goright='gowhere'></common-header>
        <div class="my_income" v-if="showIncome">
            <div style='height:0.9rem'></div>
            <div class="my_income_t_wraper">
                <div class="my_income_t">
                    <div class="my_income_t_l">
                        <span class="benefit_cash">¥{{allcash}}</span>
                        <span class="benefit_text">累计收益/元</span>
                        <span class="benedetail_text" @click="goCashDetai">明细<i class="iconfont icon-youjiantou1"></i></span>
                    </div>
                    <div class="my_income_t_r">
                        <span class="benefit_cash">¥{{monthcash}}</span>
                        <span class="benefit_text">本月收益/元</span>
                    </div>
                </div>
            </div>
            <div class="my_income_b">
                <div class="my_income_b_tit">
                    <span>累计收益来源分布</span>
                    <span></span>
                </div>
                <div class="my_income_b_cashwraper">
                    <div class="my_income_b_cash" @click="goLink(shopmoney.type)">
                        <img :src="imgPath+'shop/pro_cash.png'" alt=""/>
                        <div class="my_income_b_cash_r">
                            <div class="my_income_b_cash_tit">
                                <span class="bigtit">商品佣金<span class="yuan">(元)</span></span>
                            </div>
                            <div class="my_income_b_cash_right">
                                <span>￥{{shopmoney.money}}</span>
                                <i class="iconfont icon-iconfontjiantou5"></i>
                            </div>
                            <span class="smalltit">自购或销售非礼包商品所赚的佣金</span>
                        </div>
                    </div>
                    <div class="my_income_b_cash" @click="goLink(giftmoney.type)">
                        <img :src="imgPath+'shop/gift_cash.png'" alt=""/>
                        <div class="my_income_b_cash_r">
                            <div class="my_income_b_cash_tit">
                                <span class="bigtit">礼包佣金<span class="yuan">(元)</span></span>
                            </div>
                            <div class="my_income_b_cash_right">
                                <span>￥{{giftmoney.money}}</span>
                                <i class="iconfont icon-iconfontjiantou5"></i>
                            </div>
                            <span class="smalltit">销售礼包商品所赚的佣金</span>
                        </div>
                    </div>
                    <div class="my_income_b_cash" @click="goLink(extendmoney.type)">
                        <img :src="imgPath+'shop/spread_cash.png'" alt=""/>
                        <div class="my_income_b_cash_r">
                            <div class="my_income_b_cash_tit">
                                <span class="bigtit">推广佣金<span class="yuan">(元)</span></span>
                            </div>
                            <div class="my_income_b_cash_right">
                                <span>￥{{extendmoney.money}}</span>
                                <i class="iconfont icon-iconfontjiantou5"></i>
                            </div>
                            <span class="smalltit">邀请的会员销售礼包和普通商品为你贡献的佣金</span>
                        </div>
                    </div>
                    <div class="my_income_b_cash" @click="goLink(platformmoney.type)">
                        <img :src="imgPath+'shop/platform_cash.png'" alt=""/>
                        <div class="my_income_b_cash_r">
                            <div class="my_income_b_cash_tit">
                                <span class="bigtit">平台奖励<span class="yuan">(元)</span></span>
                            </div>
                            <div class="my_income_b_cash_right">
                                <span>￥{{platformmoney.money}}</span>
                                <i class="iconfont icon-iconfontjiantou5"></i>
                            </div>
                            <span class="smalltit">平台奖励的会员销售礼包和普通商品为你贡献的佣金</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import commonHeader from 'common/common-header'
import {
  getMyIncomInfo
} from '@/api/share'
import {
  Toast, Indicator
} from 'mint-ui'
export default {
  name: 'MyIncome',
  components: {
    commonHeader, Toast, Indicator
  },
  data() {
    return {
      h_title: '我的收益',
      r_title: '历史收益',
      head_color: {
        background: '#fff',
        color: '#000'
      },
      showIncome: false,
      allcash: '',
      monthcash: '',
      imgPath: process.env.FilE_URL,
      shopmoney: {},
      giftmoney: {},
      extendmoney: {},
      platformmoney: {}
    }
  },
  mounted() {
    this.getIncomInfo()
  },
  methods: {
    goCashDetai() {
      this.$router.togo({
        path: '/returnsDetailed'
      })
    },
    getIncomInfo() {
      const that = this
      Indicator.open('加载中...')
      getMyIncomInfo().then(res => {
        if (res.isSuccess) {
          Indicator.close()
          that.showIncome = true
          that.allcash = res.data.money.total_money
          that.monthcash = res.data.money.month_money
          that.shopmoney = res.data.money.shopmoney
          that.giftmoney = res.data.money.giftmoney
          that.extendmoney = res.data.money.extendmoney
          that.platformmoney = res.data.money.platformmoney
        } else {
          console.log('接口请求未成功')
        }
      })
    },
    gowhere() {
      this.$router.togo({
        path: '/historyEarnings'
      })
    },
    goLink(type) {
      this.$router.togo({
        path: '/saleOrder?type=' + type
      })
    }
  }

}
</script>
<style lang="less" scoped>
@import '~styles/index.less';
@import '~styles/variable.less';
.my_income{
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    background:rgba(250,250,252,1);
}
.my_income_t_wraper{
    padding: 0.3rem 0.4rem 0;
}
.my_income_t{
    width:670/100rem;
    height:200/100rem;
    background:rgba(255,255,255,1);
    box-shadow:0/100rem 4/100rem 40/100rem 0/100rem rgba(202,204,218,0.25);
    border-radius:8/100rem;
    display: flex;
    justify-content: space-around;
}
.my_income_t .my_income_t_l{
    text-align: center;
    width: 50%;
    padding-top: 0.54rem;
}
.my_income_t .my_income_t_r{
    text-align: center;
    width: 50%;
    padding-top: 0.54rem;
}
.my_income_t .benefit_cash{
    height:38/100rem;
    font-size:32/100rem;
    display: block;
    font-weight:bold;
    color:rgba(0,0,0,0.85);
    line-height:38/100rem;
    text-align: center;
    width: 100%;
}
.my_income_t .benefit_text{
    height:34/100rem;
    font-size:24/100rem;
    font-weight:400;
    color:rgba(0,0,0,0.5);
    line-height:34/100rem;
}
.my_income_t .benedetail_text{
    display: block;
    width:88/100rem;
    font-size:24/100rem;
    font-weight:400;
    color:rgba(223,174,115,1);
    height:32/100rem;
    line-height: 32/100rem;
    border-radius:4/100rem;
    border:1/100rem solid rgba(223,174,115,1);
    text-align: center;
    margin:0 auto
}
.my_income_t .benedetail_text i{
     color:rgba(223,174,115,1);
}
.my_income_b{
    margin-top: 55/100rem;
    margin-bottom:0.1rem;
}
.my_income_b .my_income_b_tit{
    width:100%;
    margin-bottom: 0.25rem;
}
.my_income_b .my_income_b_tit span{
    display: block;
    width: 100%;
    text-align: center
}
.my_income_b .my_income_b_tit span:nth-child(1){
    position: relative;
    z-index:2;
    font-size:32/100rem;
    font-weight:600;
    color:rgba(0,0,0,0.85);
}
.my_income_b .my_income_b_tit span:nth-child(2){
    width:252/100rem;
    height:18/100rem;
    background:linear-gradient(360deg,rgba(228,207,180,1) 0%,rgba(245,241,229,1) 100%);
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    top: -0.17rem;
    z-index:1
}
.my_income_b .my_income_b_cashwraper{
    padding: 0 30/100rem;
    background: #fff;
}
.my_income_b .my_income_b_cash{
    background:rgba(255,255,255,1);
    width:100%;
    height:140/100rem;
    overflow: hidden;
}
.my_income_b .my_income_b_cash img{
    float: left;
    width:44/100rem;
    height: 44/100rem;
    margin-top: 48/100rem;
}
.my_income_b .my_income_b_cash .my_income_b_cash_r{
    float: left;
    padding-top: 0.3rem;
    padding-left: 0.2rem;
    width: 6.15rem;
}
.my_income_b .my_income_b_cash .my_income_b_cash_tit .yuan{
    padding-left: 0.2rem;
}
.my_income_b .my_income_b_cash .my_income_b_cash_tit span.bigltit{
    height:40/100rem;
    font-size:28/100rem;
    font-weight:400;
    color:rgba(0,0,0,0.85);
    line-height:40/100rem;
    display: block;
}
.my_income_b .my_income_b_cash .my_income_b_cash_r span.smalltit{
    height:34/100rem;
    display: block;
    font-size:24/100rem;
    font-weight:400;
    color:rgba(0,0,0,0.4);
    line-height:34/100rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    margin-top: -8/100rem

}
.my_income_b .my_income_b_cash .my_income_b_cash_right{
    text-align: right;
    margin-top: -0.28rem
}
.my_income_b .my_income_b_cash .my_income_b_cash_right i{
    font-size: 30/100rem;
    color:rgba(0,0,0,0.4);
}
.my_income_b .my_income_b_cash .my_income_b_cash_right span{
    font-size:30/100rem;
    color:rgba(0,0,0,0.85);
}
</style>
