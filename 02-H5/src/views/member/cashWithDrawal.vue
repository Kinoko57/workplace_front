<template>
    <!--pages/cashWithdrawal/cashWithdrawal.wxml-->
<div>
    <div v-if="showCard">
      <common-header :h_title="h_title" :showback="true" :bgcolor="head_color"></common-header>
      <div style='height:0.9rem' id="card"></div>
      <div :class="allowScroll?'c_cash':'c_cash_fixed c_cash'">
          <div class='c_cash_card' v-if="showCash"  @click="choseCard('chose')" >
              <div :style="{backgroundImage: 'url(' + bank_first.cardbg+ ')'}" class='c_cash_card_l'></div>
              <div class='c_cash_card_c'>
                  <span>{{bank_first.bank}}</span>
                  <span>{{banCodeNum}}</span>
              </div>
              <div class='c_cash_card_r'>
                  <i class="iconfont icon-iconfontjiantou5"></i>
              </div>
          </div>
          <div class='c_cash_card_null' v-else @click='goBank'>
              <div class='c_cash_card_null_l'>
                  暂无银行卡请前去绑定
              </div>
              <div class='c_cash_card_r'>
                <i class="iconfont icon-iconfontjiantou5"></i>
              </div>
          </div>
          <div class="c_cash_center">
              <span class='c_text'>提现金额</span>
              <div class='c_cashwi'>
                <span>￥</span><input placeholder='请输入提现金额' class="place-holder" type='text' maxlength="14" v-model.trim="iptMoney" @input='foucsipt'/>
              </div>
          </div>
          <div class='c_cash_cost' v-if="iptMoney!=''&&costInfo.fee!=0.00">
            <div class='c_cash_cost_month' v-if="costInfo.fee!='0.00'">
              <span  class='txt2'> 手续费：￥{{costInfo.fee}}</span>
            </div>
          </div>
          <div class='c_cash_bottom'>
              <div class='c_cash_month'>
                可提现金额：<span>￥{{cashInfo.can_money}}</span>
              </div>
              <div class='c_cash_all' @click='cashWithall'>
                <span>全部提现</span>
              </div>
          </div>
          <div class='c_cash_free'>
            <span>本月免费提现剩余{{count}}次</span>
          </div>
          <div class="c_cash_explain">
              <div class='c_cash_explain_title'>
                  <span>提现说明</span>
              </div>
              <div class='c_cash_explain_content'>
                  <pre class="space">{{rulesTitle}}</pre>
              </div>
          </div>
          <!-- <div style="height:1.68rem" v-if='is_iphonex'></div> -->
          <div class="c_footer">
              <div @click='cashWith' class='c_footer_cash'>提现 <span v-if="is_cutdown">{{timeCode}}</span></div>
              <!-- <span class='modeMask' v-if="showMask"></span> -->
          </div>
      </div>
      <!--提现提示框 绑定银行卡-->
      <div class='bank_bg'  @click='hiddenBank' v-if='tobank'></div>
      <div class='rulesDetail' v-if='tobank'>
          <div class='rules_head'>绑定银行卡</div>
          <div class='rules_richtext' style="height: 100px;">
            <span>暂时没有可提现的银行卡，请前去绑定</span>
          </div>
          <div class='rules_btn'>
            <button @click='hiddenBank'>取消</button>
            <button @click='goBank'>确定</button>
          </div>
      </div>
    </div>
    <div class='check_bg' v-if="showCkeck"></div>
    <div class='checkCode' v-if="showCkeck">
      <!--请输入验证码 -->
      <div class="check">
        <div class='iptCode'>请输入短信验证码</div>
          <div class='content'>
            <div v-for="(item,index) in length" :key="index">
              <span class='iptbox' @click='tap(index)'><span  v-if="value.length>=index+1?value[index]:''">{{value[index]}}</span></span>
            </div>
          </div>
          <input name="password" ref='inputVal' class='ipt' :maxlength="length" autocomplete="off" autofocus="autofocus" @input="focus" type="number"/>
          <div class="chect_btn">
            <button class="btn-area" @click="formSubmit">确认</button>
          </div>
      </div>
      <div class='check_close' @click='closeCheck'>
        <i class='iconfont icon-bohui'></i>
      </div>
    </div>
</div>
</template>
<script>
import {
  getCashWith,
  getCashInner,
  isCardSame,
  getCashinstructions,
  getVerificationCode
} from '@/api/member-new'
import {
  getCashService
} from '@/api/share'

import commonHeader from 'common/common-header'
import returnTop from '@/components/return-top'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  Toast,
  Spinner
} from 'mint-ui'
export default {
  name: 'CashWithDrawal',
  components: {
    InfiniteScroll,
    Button,
    Lazyload,
    Toast,
    Spinner,
    commonHeader,
    returnTop
  },
  data() {
    return {
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      costInfo: {
        fee: '0.00'
      },
      h_title: '余额提现',
      rulesTitle: '',
      is_cutdown: false,
      length: 6, // 输入框个数
      value: '', // 输入的内容
      timeCode: '',
      ispassword: false,
      inputLen: 6,
      banCodeNum: null,
      showCkeck: false,
      iptMoney: '',
      // cashMoney: '',
      showMask: false,
      imgPath: process.env.FilE_URL,
      tobank: false,
      //   is_iphonex: app.globalData.phoneType,
      cashInfo: {
      },
      moneyCash: '',
      allowScroll: true,
      bank_first: {

      },
      showCard: false,
      showCash: true,
      bankId: '',
      code: '',
      interval: '', // 定时器
      count: '',
      showCheck: true
    }
  },
  mounted() {
    // console.log(this.data.bank_first)
    if (window.localStorage.hasOwnProperty('chose_bank')) {
      if (window.localStorage.getItem('chose_bank') !== undefined && window.localStorage.getItem('chose_bank') !== '') {
        console.log('默认银行卡已选择')
        this.bankId = window.localStorage.getItem('chose_bank')
        // wx.setStorageSync('chose_bank', '')
      }
    }
    // 选择银行卡后返回带的id
    this.getBankList()
    this.getCashInfo()
    this.getFindCon()
  },
  methods: {
    // 设置input输入值
    focus(e) {
      var that = this
      var inputValue = e.target.value
      that.value = inputValue
    },
    // 是否输入获取验证码的焦点
    tap(index) {
      console.log(index)
      this.$nextTick(function () {
        // DOM 更新了
        this.$refs.inputVal.focus()
      })
    },
    // 关闭验证码弹框
    closeCheck() {
      this.showCkeck = false
      this.is_cutdown = false
      this.timeCode = 60
      this.value = ''
      clearInterval(this.interval)
    },
    // 60s计时器
    getCode(e) {
      let that = this
      let currentTime = 60
      that.timeCode = currentTime + '秒'
      clearInterval(this.interval)
      this.interval = setInterval(function () {
        that.timeCode = (currentTime - 1) + '秒'
        currentTime--
        if (currentTime <= 0) {
          clearInterval(this.interval)
          that.is_cutdown = false
        }
      }, 1000)
    },
    // 点击提现 请求接口 判断否提交成功
    cashWith() {
      const that = this
      if (this.bank_first !== undefined && this.bank_first !== '' && Object.keys(this.bank_first).length !== 0) {
        Indicator.open('加载中...')
        that.showMask = true
        const info = {
          card_id: that.bank_first.id,
          amount: that.iptMoney
        }
        getCashWith(info).then(res => {
          Indicator.close()
          if (res.isSuccess) {
            console.log(res, 'resres')
            that.showMask = false
            that.is_cutdown = true
            that.showCkeck = true
            that.getCode()
          } else {
            Toast({
              message: res.msg,
              duration: 2000
            })
            that.showMask = false
            that.is_cutdown = false
            that.showCkeck = false
          }
        })
        console.log(this.bank_first)
      } else {
        that.tobank = true
      }
    },
    // 提交输入验证码，添加银行卡是否成功
    formSubmit() {
      const that = this
      that.code = that.value
      if (that.value === '') {
        Toast({
          message: '验证码不可以为空',
          duration: 1000
        })
      } else {
        this.closeCheck()
        Indicator.open({
          text: '验证中...',
          spinnerType: 'fading-circle'
        })
        const info = {
          verify: that.code
        }
        getVerificationCode(info).then(res => {
          console.log(res, 'd')
          if (res.isSuccess) {
            Indicator.close()
            Toast({
              message: res.msg,
              duration: 1000
            })
            that.showCkeck = false
            setTimeout(function() {
              console.log('返回我的钱包')
              that.$router.replace({
                path: '/myWallet'
              })
            }, 1000)
          } else {
            Indicator.close()
            Toast({
              message: res.msg,
              duration: 1000
            })
          }
        })
      }
    },
    // 输入时获取焦点，从而判断输入金额是否为空
    foucsipt(e) {
      console.log(e.target.value.length)
      const that = this
      if (e.target.value !== '') {
        var NumValue1 = e.target.value.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
        var NumValue2 = NumValue1.replace(/^\./g, '')// 不可以以.开头
        var NumValue3 = NumValue2.replace(/\.{2,}/g, '.') // 限定只可以输入一个.
        that.iptMoney = (NumValue3.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        if (parseFloat(that.iptMoney) > parseFloat(this.cashInfo.can_money)) {
          if (that.showCheck) {
            Toast({
              message: '输入金额超过可提现金额',
              duration: 1000
            })
            that.showCheck = false
          }
        } else {
          var obj = {
            amount: that.iptMoney
          }
          that.showCheck = true
          getCashService(obj).then(res => {
            if (res.isSuccess) {
              that.costInfo = res.data
              // that.iptMoney = e.target.value
            } else {
              Toast({
                message: res.msg,
                duration: 1000
              })
            }
          })
        }
      } else {
        // that.iptMoney = e.target.value
      }
    },
    // 取消银行弹框
    hiddenBank() {
      this.tobank = false
      this.allowScroll = true
    },
    // 跳转到添加银行
    goBank() {
      this.$router.togo({
        path: '/addCard'
      })
    },
    // 跳转到银行卡
    choseCard(type) {
      this.$router.togo({
        path: '/myCard?type=' + type
      })
    },
    // 全部提现
    cashWithall() {
      const that = this
      var obj = {
        amount: that.cashInfo.can_money
      }
      getCashService(obj).then(res => {
        if (res.isSuccess) {
          that.costInfo = res.data
          that.iptMoney = that.cashInfo.can_money
        } else {
          that.iptMoney = that.cashInfo.can_money
          Toast({
            message: res.msg,
            duration: 1000
          })
        }
      })
    },
    // 获取提现金额信息
    getCashInfo() {
      const that = this
      getCashInner().then(res => {
        console.log(res, 'res')
        if (res.isSuccess) {
          that.count = res.data.count
          if (res.data.member !== null && res.data.member !== 'null') {
            that.cashInfo = res.data.member
          } else {
            that.cashInfo = {}
          }
        }
      })
    },
    // 获取银行卡列表，判断选择的银行卡与列表的银行卡相同id的银行卡想信息
    getBankList() {
      const that = this
      Indicator.open('加载中...')
      isCardSame().then(res => {
        if (res.isSuccess) {
          Indicator.close()
          console.log(res, 'dd')
          that.showCard = true
          if (that.bankId !== '' && that.bankId !== undefined) {
            var arr = res.data.bank
            var bankInfo = {}
            var code = ''
            arr.forEach(item => {
              if (item.id === that.bankId) {
                bankInfo = item
                code = item.card
              }
            })
            that.bank_first = bankInfo
            that.banCodeNum = code
          } else {
            if (res.data.bank !== null) {
              that.bank_first = res.data.bank[0]
              that.banCodeNum = res.data.bank[0].card
            } else {
              that.showCash = false
              that.bank_first = {}
            }
          }
        }
      })
    },
    getFindCon() {
      const that = this
      getCashinstructions().then(res => {
        if (res.isSuccess) {
          console.log(that.rulesTitle)
          that.rulesTitle = res.data.member_withdraw
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
    /* pages/cashWithdrawal/cashWithdrawal.wxss */
.c_cash{
  /* background:#fff; */
}
//显示扣费
.c_cash_cost{
  border-top:1px solid #e4e4e4;
  // height: 100/100rem;
  padding-left: 64/100rem;
  // line-height: 100/100rem;
  font-size: 30/100rem;
  background: #fff;
  /* color: #999 */
}
.c_cash_cost .c_cash_cost_month{
   line-height: 100/100rem;
   height: 100/100rem;
}
.c_cash_cost .c_cash_cost_month .txt2{
  display: inline-block;
  padding-right: 55/100rem;
}
.c_cash_free{
  /* padding-right: 64/100rem; */
  line-height: 100/100rem;
  // color: #e13816;
  color: #E8C192;
  padding-left:32/100rem;
  font-size: 24/100rem
}

.c_cash_fixed{
  position: fixed;
  left:0;
  top:0;
  right:0;
}
.c_cash .c_text{
  font-size: 30/100rem;
  font-family: '宋体';
  color:#333;
}
.c_cash_card{
  /* margin-top: 12/100rem; */
  overflow: hidden;
  padding: 0 64/100rem;
  height:106/100rem;
  background:#fff;
}
.c_cash_card_null{
  overflow: hidden;
  line-height: 106/100rem;
  background: #fff;
  padding: 0 64/100rem;
}
.c_cash_card_null_l{
    line-height: 106/100rem;
  float: left;
  font-size: 30/100rem;
  color:#333;
}
.c_cash_card .c_cash_card_l{
  float: left;
  width:75/100rem;
  height: 75/100rem;
  border-radius: 50%;
  margin-top: 15/100rem;
  background-repeat: no-repeat;
  background-position:-0.39rem -0.49rem;;
  background-size: 6.86rem 2.68rem;
}
.c_cash_card .c_cash_card_c{
  float: left;
  padding-top: 20/100rem;
  padding-left: 20/100rem;
}
.c_cash_card .c_cash_card_c span:nth-child(1){
  display: block;
  font-size: 28/100rem;
  color: #666;
  padding-bottom: 6/100rem;
}
.c_cash_card .c_cash_card_c span:nth-child(2){
  display: block;
  font-size:22/100rem;
  color: #dbdbdb;
}
.c_cash_card_r{
  float: right;
  line-height: 106/100rem;
  width: 100/100rem;
  text-align: right
}
.c_cash_card .c_cash_card_r i{
  color: #ccc;
  font-size: 30/100rem;
}
.c_cash_top{
  background:#fff;
  border-top:1px solid #e4e4e4;
 line-height: 100/100rem;
 padding-left: 64/100rem;
 /* margin-top: 12/100rem; */
}
.c_cash_top .c_account{
  font-family: 'Arial';
  font-size: 48/100rem;
  // color:#e13816;
  color: #E8C192;
  padding-left: 26/100rem;
}
.c_cash_center{
  background:#fff;
  border-top:1px solid #e4e4e4;
  height: 176/100rem;
  padding-left: 64/100rem;
}
.c_cash_center span{
  display: block;
}
.c_cash_center .c_text{
  line-height: 94/100rem;
}
.c_cash_center .c_cashwi{
  font-family: 'Arial';
  font-size: 60/100rem;
  color: #E8C192;
  margin-left: -15/100rem;
  margin-top: -20/100rem;
  overflow: hidden;
}
.c_cash_center .c_cashwi span{
  float: left;
  width: 60/100rem;
}

.c_cash_center .c_cashwi input{
  float: left;
  font-size: 60/100rem;
  padding-left: 20/100rem;
  width:500/100rem;
  height: 90/100rem;
  // color: #e13816;
  color: #E8C192;
}
.c_cash_center .c_cashwi input::-webkit-input-placeholder{
  font-size: 30/100rem;
  color: #999;
}
.place-holder{
  font-size: 30/100rem;
  color: #999;
  height:0.9rem;
  min-height: 0.9rem;
}
.c_cash_bottom{
  border-top:1px solid #e4e4e4;
  height: 100/100rem;
  padding-left: 64/100rem;
  clear: both;
  font-size: 30/100rem;
  background: #fff;
}
.c_cash_bottom .c_cash_month{
  line-height: 100/100rem;
  float: left;
}
.c_cash_bottom .c_cash_month text{
  padding:0 18/100rem;
}
.c_cash_bottom .c_cash_all{
  float: right;
  padding-right: 64/100rem;
  line-height: 100/100rem;
  // color: #e13816;
  color: #E8C192;
}
.c_cash_explain{
  /* background: #f6f6f6; */
  padding-left: 32/100rem;
  padding-top: 25/100rem;
}
.c_cash_explain_bottom{
  margin-bottom: 68/100rem;
}
.c_cash_explain .c_cash_explain_title{
  font-size: 30/100rem;
  color:#333;
}
.c_cash_explain .c_cash_explain_content{
  padding-right: 20/100rem;
  font-size: 28/100rem;
  color:#868686;
  line-height:50/100rem;
  padding-bottom: 160/100rem;
}
.c_cash_explain .c_cash_explain_content .space{
  white-space: pre-wrap;
  word-wrap: break-word;
}
.c_footer{
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
  height: 100/100rem;
  text-align: center;
  font-size: 40/100rem;
  color: #fff;
}
.c_footer .c_footer_cash{
  display:inline-block;
  width: 100%;
  // background: #f3c0a2;
  height: 100/100rem;
  line-height: 100/100rem;
  text-align: center;
  background:linear-gradient(90deg,rgba(250,224,193,1) 0%,rgba(232,193,146,1) 100%);
  font-size:0.32rem;
  font-weight:400;
  color:rgba(79,43,0,1);
}

.modeMask{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
   background: rgb(255, 255, 255);
   opacity: .5
}
.c_footer_bottom{
  margin-bottom: 68/100rem;
}
.c_footer span{
  line-height: 100/100rem;
}

/*规则弹框*/
.bank_bg{
  position: fixed;
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  top: 0;
  z-index:999;
}

.rulesDetail{
  position: fixed;
  left: 50%;
  top: 50%;
  padding: 0 20/100rem;
  transform: translate(-50%, -50%);
  width: 70%;
  /* height: 50%; */
  z-index: 1000;
  background: #fff;
  border-radius: 20/100rem;
}
.rules_head{
  text-align: center;
  margin: 40/100rem 0 30/100rem 0;
}
.rules_richtext{
  font-size:34/100rem;
  color: #666;
  line-height: 60/100rem;
}
.rules_richtext span{
  word-wrap:break-word;
}
.rules_btn{
   margin: 20/100rem;
   overflow: hidden;
   padding: 0 50/100rem 15/100rem;
}
.rules_btn button{
  background: #dfb68f;
  color: #fff;
  font-size: 28/100rem;
  border-radius: 20/100rem;
  width: 150/100rem;
}
.rules_btn button:nth-child(1){
  float: left;
}
.rules_btn button:nth-child(2){
  float: right
}

/*验证码输入框*/
.check_bg{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: rgba(0,0, 0, .5)
}
.checkCode{
  position: fixed;
  left: 50%;
  top: 20%;
  background: #fff;
  z-index: 20;
  transform: translateX(-50%);
  border-radius: 10/100rem;
  width: 480/100rem;
  padding: 0 50/100rem 40/100rem
}
.content{
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top:20/100rem;
  width: 480/100rem;
  /* margin-left: 40/100rem; */
}
.iptbox{
  width: 80/100rem;
  height:80/100rem;
  border-left:1/100rem solid #ddd;
  border-top:1/100rem solid #ddd;
  border-bottom:1/100rem solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-sizing: border-box
}
.iptbox:last-child{
  border-right:1/100rem solid #ddd;
}
.ipt_block{
  width: 80/100rem;
  height:80/100rem;
}
.ipt{
  // width: 0;
  height: 0
}
.chect_btn{
   width: 270/100rem;
  height:80/100rem;
  margin: 0 auto;
}
.btn-area{
  width: 270/100rem;
  height:80/100rem;
  line-height: 80/100rem;
  text-align: center;
  border-radius: 40/100rem;
  background-color:#f3c0a2;
  color:white;
  margin: 0 auto;
}
.check_close{
  position: absolute;
  right: 20/100rem;
  top: 15/100rem;
}
.check_close i{
  color: #333;
  display: inline-block;
  font-size: 40/100rem;
}
.iptCode{
  width: 100%;
  text-align: center;
  font-size: 28/100rem;
  color: #666;
  margin-top:110/100rem;
}
</style>
