<template>
    <div class="phoneLogin">
        <common-header :h_title="h_title" :showback="is_back" :bgcolor='head_color'></common-header>
        <div style='height:0.9rem'></div>
        <div class="content">
            <div class="phoneInfo">
                <h1>登录</h1>
                <p>未注册过的手机将自动注册</p>
            </div>
            <div class="phoneFrom">
                <div :class="isPhoneShowRed?'form-item showRed':'form-item showW'" style="padding-right:0.32rem">
                    <img :src="phoneImg">
                    <input type='number' style="padding-left: 0.16rem" @blur="noClose" v-model="phoneNumber" placeholder="请输入11位手机号">
                    <div class="close" v-show="phoneNumber!==''" @click="clearInfo">
                        <img :src="clearImg" alt="">
                    </div>
                </div>
                <div :class="isCodeShowRed?'form-item showRed':'form-item showW'">
                    <img :src="suoImg">
                    <input type='number' style="padding-left: 0.16rem" @blur="noClose" v-model="codeNum" placeholder="请输入6位验证码">
                    <button :class="!isShowTime ? 'codeClick':'codeTime' " v-if="!isShowTime" class="codeClick" @click="getCodeNum">获取验证码</button>
                    <button v-else class="codeTime">{{timeCode}}</button>
                </div>
            </div>
            <div class="argessInfo">
                <div class="info">
                    <div @click="agreement">
                        <img v-if="!argess" :src="criImg" alt="">
                        <img v-else :src="argessImg" alt="">
                    </div>
                    <p>阅读并同意<span @click="readAgreement">《公主购服务协议》</span></p>
                </div>
            </div>
            <div class="login">
                <button :class="!isLogin ? 'noLogin':'okLogin' " @click="loginApp">登录</button>
            </div>
        </div>
    </div>
</template>

<script>
import phoneIcon from '@/assets/img/icon-phone2.png'
import suoIcon from '@/assets/img/icon-suo.png'
import argessIcon from '@/assets/img/icon-argess.png'
import cirIcon from '@/assets/img/icon-cir.png'
import clearIcon from '@/assets/img/clear.png'
import commonHeader from 'common/common-header'
import {
  getCodeNum,
  isGoLogin
} from '@/api/member-new'
import {
  Toast
} from 'mint-ui'
// import {
//   setToken
// } from '@/store/auth'
import {
  mapMutations,
  mapGetters
} from 'vuex'
export default {
  name: 'PhoneLogin',
  components: {
    commonHeader,
    Toast
  },
  data() {
    return {
      h_title: '',
      is_back: true,
      head_color: {
        background: 'rgba(250,250,252,1)',
        color: '#000000'
      },
      phoneImg: phoneIcon,
      suoImg: suoIcon,
      argessImg: argessIcon,
      criImg: cirIcon,
      clearImg: clearIcon,
      argess: false,
      isClear: false,
      phoneNumber: '',
      codeNum: '',
      isLogin: false,
      isShowTime: false,
      timeCode: '',
      interval: '',
      isCodeShowRed: false,
      isPhoneShowRed: false,
      lastFourNum: ''
    }
  },
  mounted() {
    var storage = window.localStorage
    console.log(storage.getItem('login_phone'))
    if (storage.getItem('login_phone') != null) {
      this.phoneNumber = storage.getItem('login_phone')
    }
    if (storage.getItem('login_code') != null) {
      this.codeNum = storage.getItem('login_code')
    }
    this.noClose()
  },
  methods: {
    ...mapMutations({
      setIsbind: 'SET_ISBIND',
      setUserInfo: 'SET_USERINFO',
      setInviter: 'SET_INVITER',
      setMember: 'SET_MEMBER',
      setShowShare: 'SET_SHARE',
      setFirst: 'SET_FIRST',
      setScore: 'SET_SCORE'
    }),
    agreement() {
      if (this.argess === false) {
        this.argess = true
      } else {
        this.argess = false
      }
    },
    readAgreement() {
      this.$router.togo({
        path: '/protocol'
      })
      if (this.codeNum !== '') {
        window.localStorage.setItem('login_code', this.codeNum)
      }
      if (this.phoneNumber !== '') {
        window.localStorage.setItem('login_phone', this.phoneNumber)
      }
    },
    noClose() {
      if (this.phoneNumber !== '' && this.phoneNumber.length === 11 && /^1[3|4|5|6|7|8|9]\d{9}$/.test(this.phoneNumber)) {
        this.isLogin = true
        this.isPhoneShowRed = true
      } else {
        this.isLogin = false
        this.isPhoneShowRed = false
      }
      if (this.codeNum !== '' && this.codeNum.length === 6) {
        this.isCodeShowRed = true
      } else {
        this.isCodeShowRed = false
      }
    },
    clearInfo() {
      this.phoneNumber = ''
      this.isLogin = false
      this.isPhoneShowRed = false
    },
    getCode() {
      let that = this
      let currentTime = 60
      that.timeCode = currentTime + '秒'
      clearInterval(that.interval)
      that.interval = setInterval(function () {
        that.timeCode = (currentTime - 1) + '秒'
        currentTime--
        if (currentTime <= 0) {
          clearInterval(that.interval)
          that.isShowTime = false
        }
      }, 1000)
    },
    getCodeNum() {
      if (this.phoneNumber === '') {
        Toast({
          message: '手机号不能为空',
          duration: 1000
        })
      } else if (this.phoneNumber.length !== 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.phoneNumber)) {
        Toast({
          message: '手机号格式不正确',
          duration: 1000
        })
      } else {
        const info = {
          phone: this.phoneNumber
        }
        getCodeNum(info).then(res => {
          console.log(res)
          if (res.isSuccess) {
            this.isShowTime = true
            this.lastFourNum = this.phoneNumber.substring(this.phoneNumber.length - 4)
            Toast({
              message: '验证码已发送至尾号' + this.lastFourNum + '的手机，请注意',
              duration: 1000
            })
            this.getCode()
          } else {
            Toast({
              message: res.msg,
              duration: 1000
            })
          }
        })
      }
    },
    loginApp() {
      const that = this
      if (that.phoneNumber === '') {
        Toast({
          message: '手机号不能为空',
          duration: 1000
        })
      } else if (that.phoneNumber.length !== 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(that.phoneNumber)) {
        Toast({
          message: '手机号格式不正确',
          duration: 1000
        })
      } else if (that.codeNum === '') {
        Toast({
          message: '验证码不能为空',
          duration: 1000
        })
      } else if (that.argess === false) {
        Toast({
          message: '请阅读并同意《公主购服务协议》',
          duration: 1000
        })
      } else {
        that.isLogin = true
        const info = {
          mobile: that.phoneNumber,
          tel_verify: that.codeNum
        }
        isGoLogin(info).then(res => {
          console.log(res)
          if (res.isSuccess) {
            var storage = window.localStorage
            storage.removeItem('login_phone')
            storage.removeItem('login_code')
            var data =
                    'uid=' +
                    res.uid +
                    ';username=' +
                    res.username +
                    ';rank=' +
                    res.rank +
                    ';token=' +
                    res.token +
                    ';source=' +
                    res.source +
                    ';sessionid=' +
                    res.sessionid
            console.log(data)
            let userInfo = {}
            userInfo.avatar = res.image
            userInfo.level = res.rankName
            userInfo.isShow = 1
            userInfo.nickname = res.nickname
            userInfo.isbind = res.bindPhone
            userInfo.level_id = res.level_id
            userInfo.level_name = res.levelName
            userInfo.inviter = res.inviter
            userInfo.is_first = res.is_first
            that.setUserInfo(userInfo)
            that.setInviter(res.inviter)
            storage.setItem('token', data)
            storage.setItem('isLogin', true)
            that.setIsbind(res.bindPhone)
            that.userInfo = that.$store.state.home.userInfo
            if (res.level_id !== 0 && res.level_id !== '0') {
              that.setMember(true)
            } else {
              that.setMember(false)
            }
            console.log('返回上一页')
            if (res.bindPhone === true) {
              // 跳转首页
              // that.$router.replace({
              //   path: '/index'
              // })
              that.$router.go(-2)
            } else {
              that.$router.replace({
                path: '/bind?visit=0'
              })
            }
          } else {
            Toast({
              message: res.msg,
              duration: 1000
            })
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters([
      'number',
      'carnum',
      'isbind',
      'score',
      'news',
      'newsnum',
      'issign'
    ])
  }
}
</script>

<style scope lang="less">
    .phoneLogin{
        background:rgba(250,250,252,1);
        height: 100%;
        width: 100%;

        .content{
          padding-left: 40/100rem;
          padding-right: 40/100rem;
          overflow-x: hidden;
        }

        .phoneInfo{
            h1{
                font-size:48/100rem;
                font-weight:600;
                color:rgba(0,0,0,0.85);
                line-height:66/100rem;
                margin-top: 40/100rem;
            }
            p{
               width: 100%;
               height: 40/100rem;
               font-size:28/100rem;
               font-weight:300;
               color:rgba(0,0,0,0.5);
               line-height:40/100rem;
               margin: 8/100rem 0 50/100rem 0;
            }
        }

        .phoneFrom{
            .showW{
                border-bottom: 1px solid #E8E8EF;
            }
            .showRed{
                border-bottom: 1px solid #ff4e79 ;
            }
            .form-item{
                height: 140/100rem;
                box-sizing: border-box;
                padding-top: 70/100rem;
                padding-left: 48/100rem;
                position: relative;

                input{
                    // width: 100%;
                    height: 70/100rem;
                    background:none;
                    outline:none;
                    border:0px;
                    width: 100%;
                }

                img{
                    position: absolute;
                    left:0;
                    bottom: 14/100rem;
                    width: 48/100rem;
                    height: 48/100rem;
                }

                .close{
                    position: absolute;
                    right:0;
                    width: 32/100rem;
                    img{
                        width: 32/100rem;
                        height: 32/100rem;
                    }
                }

                &:last-child {
                    margin-bottom: 30/100rem;
                    padding-right: 168/100rem;
                    .codeClick{
                        position: absolute;
                        right: 0;
                        bottom: 14/100rem;
                        background:rgba(248,76,118,0.8);
                        height: 52/100rem;
                        width: 168/100rem;
                        border-radius: 4/100rem;
                        color: #fff;
                        font-size: 28/100rem;
                        line-height: 54/100rem;
                    }
                    .codeTime{
                        position: absolute;
                        right: 0;
                        bottom: 14/100rem;
                        height: 52/100rem;
                        width: 168/100rem;
                        background: #E8E8EF;
                        border-radius: 4/100rem;
                        color: #000000;
                        font-size: 28/100rem;
                        line-height: 54/100rem;
                    }
                }
            }
        }

        .argessInfo{
            .info{
                height: 34/100rem;
                width: 100%;
                padding-left: 52/100rem;
                position: relative;
                margin-bottom: 36/100rem;
                p{
                    width: 100%;
                    line-height: 34/100rem;
                    font-size: 24/100rem;
                    color:rgba(0,0,0,0.5);
                    span{
                        color:#FB560A;
                    }
                }
                img{
                    position: absolute;
                    left:0;
                    width: 32/100rem;
                    height: 32/100rem;
                }
            }
        }

        .login{
            margin-top: 0.5rem;
            .noLogin{
                width:100%;
                height:92/100rem;
                background:linear-gradient(90deg,rgba(231,232,239,1) 0%,rgba(202,204,218,1) 100%);
                border-radius:46/100rem;
                font-size: 36/100rem;
                font-weight: 400;
                color: rgba(0,0,0,0.4);
                line-height:92/100rem;
                text-align: center;
            }

            .okLogin{
                width:100%;
                height:92/100rem;
                background:linear-gradient(90deg,rgba(255,78,121,1) 0%,rgba(255,43,144,1) 100%);
                border-radius:46/100rem;
                font-size: 36/100rem;
                font-weight: 400;
                color: #ffffff;
                line-height:92/100rem;
                text-align: center;
            }
        }
    }
</style>
