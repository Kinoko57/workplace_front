<template>
  <div>
    <common-header :h_title="h_title" :showback="true" :bgcolor="head_color"></common-header>
    <div style='height:0.9rem'></div>
    <div class='realName' :style='{height:height}'>
      <div class='real_body'>
          <div class="ipt_realInfo">
            <span>请填写本人真实信息，一经绑定，则无法修改</span>
          </div>
          <div class="form_body">
            <div class='section'>
                <span class='form_title text_left'>姓名</span>
                <input v-if="bind==0" placeholder='请填写姓名' @blur="validate('name',realInfo.name)" name="name" type='text' v-model.trim="realInfo.name"></input>
                <label v-if="bind==1" class="name">
                    <span class="label-1__text">{{account}}</span>
                </label>
                <div style='display:inline-block;height:1rem;line-height:1rem' v-if="bind==0">
                  <i v-if="form.name!==''" :class="form.name==true?'iconfont icon-cuowu red':'iconfont icon-succ green'"></i>
                </div>
            </div>
            <div class='section'>
                <span class='form_title text_left'>银行卡账号</span>
                <input placeholder='请输入银行卡账号' @blur="validate('cardNum', realInfo.cardNum)" name="cardNum" type='number' v-model.trim="realInfo.cardNum"/>
                <div style='display:inline-block;height:1rem;line-height:1rem'>
                  <i v-if="form.cardNum!==''" :class="form.cardNum==true?'iconfont icon-cuowu red':'iconfont icon-succ green'"></i>
                </div>
            </div>
            <div class='section'>
                <span class='form_title text_left'>所属银行</span>
                <div @click="showBankModel" style='display:inline-block;width:4rem' :class="isclose<1?'bankChose': 'bankChoseCon'">{{bankChose}}</div>
                <div  style='display:inline-block;'>
                  <i v-if="isclose>=0" :class="isclose==0?'iconfont icon-cuowu red':'iconfont icon-succ green'" size='16'></i>
                </div>
            </div>
            <div class='section'>
                <span class='form_title text_left'>身份证号</span>
                <input v-if="bind==0" placeholder='请输入身份证号' @blur="validate('idNumber', realInfo.idNumber)" name="idNumber" type='text' v-model.trim="realInfo.idNumber"></input>
                <label v-if="bind==1" class="name">
                    <span class="label-1__text">{{id_number}}</span>
                </label>
                <div style='display:inline-block;height:1rem;line-height:1rem' v-if="bind==0">
                <i v-if="form.idNumber!==''" :class="form.idNumber==true?'iconfont icon-cuowu red':'iconfont icon-succ green'"></i>
                </div>
            </div>
            <div class='section last_section'>
                <span class='form_title text_left'>预留手机号</span>
                <input placeholder='请输入开户时预留手机号' @blur="validate('phone', realInfo.phone)" name="phone" type='number' v-model.trim="realInfo.phone"/>
                <div style='display:inline-block;height:1rem;line-height:1rem'>
                <i v-if="form.phone!==''" :class="form.phone==true?'iconfont icon-cuowu red':'iconfont icon-succ green'"></i>
                </div>
            </div>
            <div class='saveInfo'>
                <button :disabled='is_cutdown'  @click="formSubmit">提交 <span v-if="is_cutdown">（{{timeCode}}）</span> </button>
            </div>
          </div>
      </div>
      <div v-if="form.$dirty" class="invalid">
        {{form.$invalidMsg}}
      </div>
      <mt-popup v-model="bankChange" position="bottom" class='editArea'>
        <div class='picker_btn'>
          <span @click="hideBank">取消</span>
          <span @click="changeBank">确认</span>
        </div>
        <mt-picker :slots="myBankSlots" @change="onBankChange" v-model='bankChose'></mt-picker>
      </mt-popup>
    </div>
    <div class='check_bg' v-if="showCkeck"></div>
    <div class='checkCode' v-if="showCkeck">
      <!--请输入验证码 -->
      <div class="check">
        <div class='iptCode'>请输入短信验证码</div>
          <div class='content'>
            <div v-for="(item,index) in length" :key="index">
              <span class='iptbox' @click='tap(index)'><span v-if="value.length>=index+1?value[index]:''">{{value[index]}}</span></span>
            </div>
          </div>
          <input name="password" ref='inputVal' class='ipt' :maxlength="length" autocomplete="off" autofocus="autofocus" @input="focus" type="number"/>
          <div class="chect_btn">
            <button class="btn-area" @click="formSubmits">确认</button>
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
  getBankList,
  ishaveCard,
  submitInfo,
  submitCode
} from '@/api/member-new'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  Toast,
  Field,
  Picker,
  Switch,
  Popup
} from 'mint-ui'
import commonHeader from 'common/common-header'
export default {
  name: 'AddCard',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Lazyload,
    Button,
    Field,
    Picker,
    Switch,
    Popup,
    Toast
  },
  data() {
    return {
      height: '',
      h_title: '添加银行卡',
      head_color: {
        background: '#ffffff',
        color: '#000000'
      },
      bankChose: '请选择所属银行',
      bankChange: false,
      myBankSlots: [{
        flex: 1,
        values: [],
        className: 'slot1',
        textAlign: 'center'
      }],
      account: '',
      id_number: '',
      bind: 0,
      imgPath: process.env.FilE_URL,
      showCkeck: false,
      length: 6, // 输入框个数
      value: '', // 输入的内容
      ispassword: false,
      inputLen: 6,
      timeCode: '',
      is_cutdown: false,
      iptValue: '',
      isclose: -1,
      realInfo: {
        id: '',
        name: null,
        bank: null,
        cardNum: null,
        phone: null,
        idNumber: null
      },
      userName: '',
      userCardNum: '',
      userPhone: '',
      userIdNumber: '',
      showBank: true,
      bank: [],
      bankList: [],
      index: 0,
      indexId: 1,
      form: {
        name: '',
        $dirty: false,
        $invalidMsg: '',
        idNumber: '',
        bank: '',
        cardNum: '',
        phone: ''
      },
      interval: '',
      bankName: ''
    }
  },
  mounted() {
    const that = this
    that.getAddList()
    // this.getAddCard()
    that.getBankBind()
  },
  methods: {
    // 设置input输入值
    focus(e) {
      let that = this
      let inputValue = e.target.value
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
    // 显示银行卡弹框
    showBankModel() {
      this.bankChange = true
    },
    // 隐藏银行卡弹框
    hideBank() {
      this.bankChange = false
      const that = this
      if (this.isclose === 1) {
        that.isclose = 1
        that.form.$dirty = false
        that.form.$invalidMsg = ''
      } else {
        that.isclose = 0
        that.form.$dirty = true
        that.form.$invalidMsg = '所属银行不能为空'
      }
    },
    // 选择银行卡
    changeBank() {
      const that = this
      that.bankChose = that.bankName
      that.bankChange = false
      var arrObj = this.bankList
      arrObj.forEach((item, index) => {
        if (that.bankChose === item.short_name) {
          console.log(item, index)
          that.index = index
          that.indexId = item.id
          that.isclose = 1
          that.form.$dirty = false
          that.form.$invalidMsg = ''
        }
      })
    },
    onBankChange(picker, values) {
      console.log(picker, values, 'picker, values')
      this.bankName = values[0]
    },
    // 60s计时器
    getCode() {
      var that = this
      var currentTime = 60
      that.timeCode = currentTime + '秒'
      clearInterval(that.interval)
      that.interval = setInterval(function () {
        that.timeCode = (currentTime - 1) + '秒'
        currentTime--
        if (currentTime <= 0) {
          clearInterval(that.interval)
          that.is_cutdown = false
        }
      }, 1000)
    },
    // 验证输入后的值是否正确
    validate(name, value) {
      this.form.$dirty = false
      this.form.$invalidMsg = ''
      if (name === 'name') {
        let reg0 = /^.{2,35}$/
        if (value === '' || value === null || /^\s+$/gi.test(value)) {
          this.form.$dirty = true
          this.form.$invalidMsg = '姓名不能为空'
          this.form.name = true
        } else {
          if (reg0.test(value) === false) {
            this.form.$dirty = true
            this.form.$invalidMsg = '姓名长度为2~35'
            this.form.name = true
          } else {
            this.form.$dirty = false
            this.form.$invalidMsg = ''
            this.form.name = false
          }
        }
      } else if (name === 'cardNum') {
        let reg1 = /^[\d]{16,19}$/
        if (value === '' || value === null) {
          this.form.$dirty = true
          this.form.$invalidMsg = '银行卡号不能为空'
          this.form.cardNum = true
        } else {
          if (reg1.test(value) === false) {
            this.form.$dirty = true
            this.form.$invalidMsg = '银行卡号格式不正确'
            this.form.cardNum = true
          } else {
            this.form.$dirty = false
            this.form.$invalidMsg = ''
            this.form.cardNum = false
          }
        }
      } else if (name === 'idNumber') {
        let reg2 = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (value === '' || value === null) {
          this.form.$dirty = true
          this.form.$invalidMsg = '身份证号不能为空'
          this.form.idNumber = true
        } else {
          if (reg2.test(value) === false) {
            this.form.$dirty = true
            this.form.$invalidMsg = '身份证号格式不正确'
            this.form.idNumber = true
          } else {
            this.form.$dirty = false
            this.form.$invalidMsg = ''
            this.form.idNumber = false
          }
        }
      } else if (name === 'phone') {
        // let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
        let reg = /^[1][0-9]{10}$/
        if (value === '' || value === null) {
          this.form.$dirty = true
          this.form.$invalidMsg = '手机号码不能为空'
          this.form.phone = true
        } else {
          console.log(reg.test(value))
          if (reg.test(value) === false) {
            this.form.$dirty = true
            this.form.$invalidMsg = '手机号码格式不正确'
            this.form.phone = true
          } else {
            this.form.$dirty = false
            this.form.$invalidMsg = ''
            this.form.phone = false
          }
        }
      } else {
        if (this.bankChose === '所属银行不能为空') {
          this.isClose = 0
          this.form.$dirty = true
          this.form.$invalidMsg = '所属银行不能为空'
        } else {
          this.form.$dirty = false
          this.form.$invalidMsg = ''
          this.isClose = 1
        }
      }
    },
    // 提交验证是否全部输入正确
    formSubmit(e) {
      const that = this
      // if (that.isclose === -1) {
      //   that.isclose = 0
      // }
      console.log(that.realInfo, '111')
      console.log(that.isclose, 'that.isclose')
      if (that.bind === 0) {
        if (that.form.name !== false) {
          that.validate('name', that.realInfo.name)
        } else if (that.form.cardNum !== false) {
          that.validate('cardNum', that.realInfo.cardNum)
        } else if (that.form.idNumber !== false) {
          that.validate('idNumber', that.realInfo.idNumber)
        } else if (that.form.phone !== false) {
          that.validate('phone', that.realInfo.phone)
        } else if (that.isclose <= 0) {
          this.validate('bank', that.bankChose)
        } else {
          console.log('全部校验通过')
          if (this.index < 0) {
            that.isclose = 0
          } else if (this.form.$invalidMsg === '') {
            that.userName = that.realInfo.name
            that.userCardNum = that.realInfo.cardNum
            that.userPhone = that.realInfo.phone
            that.userIdNumber = that.realInfo.idNumber
            Indicator.open({
              text: '提交中...',
              spinnerType: 'fading-circle'
            })
            const info = {
              name: that.realInfo.name,
              card: that.realInfo.cardNum,
              bank: that.indexId,
              mobile: that.realInfo.phone,
              id_number: that.realInfo.idNumber
            }
            console.log(that.indexId, 'that.indexId')
            submitInfo(info).then(res => {
              console.log(res, 'submit')
              if (res.isSuccess) {
                Indicator.close()
                that.is_cutdown = true
                that.showCkeck = true
                that.getCode()
              } else if (res.msg === '短信动态码验证中') {
                Indicator.close()
                that.is_cutdown = true
                that.showCkeck = true
              } else {
                Indicator.close()
                Toast({
                  message: res.msg,
                  duration: 2000
                })
                that.is_cutdown = false
                that.showCkeck = false
              }
            })
          } else {}
        }
      } else {
        if (that.form.phone !== false) {
          that.validate('cardNum', this.realInfo.cardNum)
        } else if (that.form.phone !== false) {
          that.validate('phone', this.realInfo.phone)
        } else {
          console.log('全部校验通过')
          if (that.index < 0) {
            that.isclose = 0
          } else if (that.form.$invalidMsg === '') {
            that.userName = ''
            that.userCardNum = that.realInfo.cardNum
            that.userPhone = that.realInfo.phone
            that.userIdNumber = ''
            Indicator.open({
              text: '提交中...',
              spinnerType: 'fading-circle'
            })
            const info = {
              name: that.realInfo.name,
              card: that.realInfo.cardNum,
              bank: that.indexId,
              mobile: that.realInfo.phone,
              id_number: that.realInfo.idNumber
            }
            submitInfo(info).then(res => {
              console.log(res)
              if (res.isSuccess) {
                Indicator.close()
                that.is_cutdown = true
                that.showCkeck = true
              } else if (res.msg === '短信动态码验证中') {
                Indicator.close()
                that.is_cutdown = true
                that.showCkeck = true
              } else {
                Indicator.close()
                Toast({
                  message: res.msg,
                  duration: 2000
                })
                that.is_cutdown = false
                that.showCkeck = false
              }
            })
          } else {}
        }
      }
    },
    // 提交输入验证码，添加银行卡是否成功
    formSubmits(e) {
      const that = this
      let code = this.value
      if (this.value === '') {
        that.title = '验证码不可以为空'
        that.duration = 2000
        that.icon = 'none'
      } else {
        this.closeCheck()
        console.log(e, '我是提交信息')
        Indicator.open({
          text: '提交中...',
          spinnerType: 'fading-circle'
        })
        const info = {
          verify: code
        }
        submitCode(info).then(res => {
          console.log(res)
          if (res.isSuccess) {
            Indicator.close()
            Toast({
              message: res.msg,
              duration: 1000
            })
            setTimeout(function () {
              that.$router.goBack()
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
    // 获取银行卡列表的名称
    getAddList() {
      const that = this
      getBankList().then(res => {
        console.log(res, 'getBankList')
        if (res.isSuccess) {
          let arr = res.data.bank
          let bankList = []
          arr.forEach(item => {
            bankList.push(item.short_name)
          })
          that.band = bankList
          that.myBankSlots[0]['values'] = bankList
          that.bankList = res.data.bank
        }
      })
    },
    // 判断银行卡是否绑定过 绑定过 姓名 身份证号 无法修改 1绑定
    getBankBind() {
      ishaveCard().then(res => {
        const that = this
        console.log(res, 'is')
        if (res.isSuccess) {
          if (res.data.is_added === 1) {
            that.bind = 1
            that.account = res.data.bank.account
            that.id_number = res.data.bank.id_number
            console.log(that.bind)
          } else {
            that.bind = 0
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
    /* pages/realName/realName.wxss */
.realName{
  width: 100%;
  background: #fff;
}
.real_body{
  height: 100%;
  background: #fff;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin-top: 0.9rem;
}
.real_body .form_body{
 overflow: hidden;
}
.real_body .section{
  background: #fff;
  border-top: 1px solid #e4e4e4;
  overflow: hidden;
  padding: 10/100rem 62/100rem;
  height: 100/100rem;
}
.real_body .last_section{
  border-bottom: 1px solid #e4e4e4;
}
.section .form_title {
  font-size:30/100rem;
  color: #333;
  font-weight: 600;
  float: left;
  height: 100/100rem;
  line-height: 100/100rem;
}
.section .text_left {
  width: 180/100rem;
}
.section input{
  float: left;
  font-size: 30/100rem;
  width:400/100rem;
  height:100/100rem;
  line-height: 100/100rem;
  /* width: 456/100rem; */
}
.section .red {
    color: red;
  }

.section .green {
  color: #09bb07;
}
.section .name{
  float: left;
  font-size: 30/100rem;
  width:400/100rem;
  height:100/100rem;
  line-height: 100/100rem;
}
.section picker{
  float: left;
  font-size: 30/100rem;
  width:400/100rem;
  height:100/100rem;
  line-height: 100/100rem;
}
.real_body .section input::-webkit-input-placeholder{
  color: #bebebe;
}
.bankChose{
  color: #bebebe;
  font-size: 30/100rem;
  line-height: 100/100rem;
}
.bankChoseCon{
  color: #333;
  font-size: 30/100rem;
  line-height: 100/100rem;
}
.editArea {
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 100;
    background: #fff;
    height: 40vh;
    border-top: 1px solid #e0e0e0;
  }

  .editArea .picker_btn {
    display: flex;
    justify-content: space-between;
    padding: 0.2rem 0.26rem;
    border-bottom: 1px solid #e0e0e0;
  }
/*radio按钮*/
.saveInfo {
  border: none !important;
  margin-top: 126/100rem;
}

.saveInfo button {
  width:500/100rem;
  height: 88/100rem;
  line-height: 88/100rem;
  border: none;
  background:linear-gradient(90deg,rgba(250,224,193,1) 0%,rgba(232,193,146,1) 100%);
  border-radius: 0.44rem;
  font-size:0.32rem;
  font-weight:400;
  color:rgba(79,43,0,1);
  outline: none;
  position: relative;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding-left: 14/100rem;
  padding-right: 14/100rem;
  box-sizing: border-box;
}
.ipt_realInfo{
  font-size: 24/100rem;
  color: #bebebe;
  line-height: 54/100rem;
  padding-left:62/100rem;
}
/* .ipt_ipt_realInfo_wraper{
  overflow: hidden;
  width: 100%;
}
.ipt_ipt_realInfo_wraper_l{
  float: left;
}
.ipt_ipt_realInfo_wraper_r{
  float: left;
}
.ipt_ipt_realInfo_wraper_r text{
  display: block;
} */
.invalid {
  position: fixed;
  width: 100%;
  color: #fff;
  bottom: 0;
  background: #ff4e79;
  text-align: center;
  height: 60/100rem;
  font-size: 38/100rem;
  line-height: 60/100rem;
}
.invalid_bottom{
  bottom:68/100rem;
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
  top: 10%;
  background: #fff;
  width: 480/100rem;
  z-index: 20;
  transform: translateX(-50%);
  border-radius: 10/100rem;
  padding: 0 50/100rem 40/100rem
}
.content{
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top:20/100rem;
  width: 480/100rem;
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
  // background-color:#ff4e79;
  background:linear-gradient(90deg,rgba(250,224,193,1) 0%,rgba(232,193,146,1) 100%);
  font-size:0.32rem;
  font-weight:400;
  color:rgba(79,43,0,1);
  margin: 0 auto;
}
.check_close{
  position: absolute;
  right: 20/100rem;
  top: 15/100rem;
}
.check_close i{
  color: #333;
  font-size: 40/100rem;
  display: inline-block
}
.iptCode{
  width: 100%;
  text-align: center;
  font-size: 28/100rem;
  color: #666;
  margin-top:110/100rem;
}
</style>
