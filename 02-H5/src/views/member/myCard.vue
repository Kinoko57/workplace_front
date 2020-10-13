<template>
    <div v-if="showBankCard">
        <common-header :h_title="h_title" :showback="true" :bgcolor="head_color"></common-header>
        <div class='my_card' >
          <div style='height:0.9rem' id="my_card"></div>
          <return-top @returnTop='goTop'></return-top>
          <div class="overHidden">
            <div v-for="(item,index) in cardList" class='my_img' :key="index">
              <img :src='item.cardbg'  @click="choseBank(item.id)">
              <div class='bankCode'>
                <span class='bankLast'>{{item.card}}</span>
              </div>
            </div>
            <div class='addmycard'>
              <div @click='addMyCard'>
                  <span>+</span>
                  <span>添加银行卡</span>
              </div>
            </div>
            <div style="height:78/100rem"></div>
          </div>
        </div>
        <!-- 返回主页面 -->
        <div class="goIndex" @click='goIndex'>
          <i class='iconfont icon-home'></i>
        </div>
    </div>
</template>

<script>
import commonHeader from 'common/common-header'
import returnTop from '@/components/return-top'
import {
  getCardList
} from '@/api/member-new'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  Toast
} from 'mint-ui'
export default {
  name: 'MyCard',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Toast,
    returnTop
  },
  data() {
    return {
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      h_title: '我的银行卡',
      height: '',
      showBankCard: false,
      showBank: false,
      isTop: true,
      imPath: process.env.FilE_URL,
      cardList: [],
      src: process.env.FilE_URL + 'shop/share_1.png',
      animationData: {},
      brandHeight: 0
    }
  },
  mounted() {
    this.getBankList()
    console.log(this.showbank)
  },
  methods: {
    goIndex() {
      this.$router.togo({
        path: '/index'
      })
    },
    goTop() {
      console.log('回到顶部')
      document.getElementById('my_card').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    addMyCard(e) {
      this.$router.togo({
        path: '/addCard'
      })
    },
    // 得到银行卡列表
    getBankList() {
      const that = this
      Indicator.open('加载中...')
      getCardList().then(res => {
        Indicator.close()
        console.log(res, 'fsdf')
        if (res.data.bank != null && res.data.bank.length !== 0) {
          that.cardList = res.data.bank
          that.showBank = true
          that.showBankCard = true
        } else {
          that.showBank = false
          that.showBankCard = true
        }
      })
    },
    // 选择银行卡，并保存到本地
    choseBank(id) {
      console.log(id)
      const that = this
      // wx.setStorageSync('chose_bank', e.currentTarget.id)
      // wx.navigateBack({
      //   delta: 1
      // })
      window.localStorage.setItem('chose_bank', id)
      that.$router.back()
      // }
    }
  }
}
</script>

<style scoped lang="less">
    /* pages/mycard/mycard.wxss *//* pages/mycard/mycard.wxss */
.my_card{
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  border-top: 1px solid #ececec;
}
.my_card .overHidden{
    width: 100%;
    background: #fff;
}
.my_card .my_img{
  width: 686/100rem;
  text-align: center;
  position: relative;
  left: 50%;
  transform: translateX(-50%)
}
.my_card .my_img img{
  position: relative;
  top: 0;
  width: 686/100rem;
  height: 268/100rem;
  margin-top: 30/100rem;
  /* background: #ff4e79 */
}
.my_card .my_img .bankCode{
  position: absolute;
  bottom: 38/100rem;
  width: 100%;
  text-align: center;
}
.my_card .my_img .bankCode span.bankLast{
  color: #fff;
  font-size: 40/100rem;
  opacity: 1;
}
.addmycard{
  width: 100%;
  text-align: center;
}
.addmycard div{
  display: inline-block;
  text-align: center;
  width: 686/100rem;
  height: 208/100rem;
  margin-top: 30/100rem;
  background: #f3f3f3;
  border-radius: 10/100rem;
  color: #acacac;
  font-size: 40/100rem;
  margin-bottom: 80/100rem;
}
/* .addmycard view icon{
  font-size: 60/100rem;
  height: 60/100rem;
} */
.addmycard div span:nth-child(1){
  font-size: 80/100rem;
}
.addmycard div span{
  display: block;
  padding-top: 10/100rem;
  text-align: center;
}
.my_card_null{
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  text-align: center;
  padding-top: 100/100rem;
}
.my_card_null span{
  display: block;
  font-size: 30/100rem;
  color: #333;
}
.my_card_null span:nth-child(2){
  background: #ff4e79;
  width: 200/100rem;
  margin-top: 40/100rem;
  border-radius: 10/100rem;
  line-height:50/100rem;
  position: relative;
  left: 50%;
  transform: translateX(-50%)
}
</style>
