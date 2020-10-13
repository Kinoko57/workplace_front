<template>
  <div>
    <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem'></div>
    <div class='login_bg'>
      <div class='login'>
        <div class="login-bg">
          <img :src="loginImg" alt="" srcset="">
        </div>
        <!-- <div class='login_head_img'>
          <img :src="loginImg" alt="" srcset="">
        </div>
        <div class='login_head_title'>公主购商城</div> -->
        <div class="phone-btn" @click='phoneLogin'>
          <button>
            <img :src="iconPhoneImg" alt="">
            手机号快捷登录
          </button>
        </div>
        <div class='login_btn' @click='loginApp'>
          <button>
            <img :src="iconWImg" alt="">
            微信快速登录</button>
        </div>
        <!-- <div class='login_version'>
          <span>账号登录</span>
          <span>{{version}}</span>
        </div> -->
      </div>

    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import login from '@/assets/img/login-bg.png'
import iconP from '@/assets/img/icon-phone.png'
import iconW from '@/assets/img/icon-w.png'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  Toast
} from 'mint-ui'
import {
  appLogin,
  getPersonInfo
} from '@/api/index'
import {
  mapMutations,
  mapGetters
} from 'vuex'
  // import {
  //   getOrderDetail
  // } from '@/api/index'
  // import {
  //   countDown
  // } from '@/store/pubilc.js'
  // import {
  //   parseTime
  // } from '@/store/pubilc.js'
import {
  setToken
} from '@/store/auth'
export default {
  name: 'Login',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Toast
  },
  data() {
    return {
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      h_title: '登录',
      version: '1.1.0',
      loginImg: login,
      iconPhoneImg: iconP,
      iconWImg: iconW,
      aweixin: '',
      is_back: true
    }
  },
  created() {
    console.log(this.$route.query.back)
    if (this.$route.query.back !== undefined && this.$route.query.back === 1) {
      this.is_back = true
    }
    console.log('is_back的值为', this.is_back)
  },
  mounted() {
    console.log('登录页')
    let storage = window.localStorage
    if (storage.getItem('isLogin') === true || storage.getItem('isLogin') === 'true') {
      this.getInfo()
    } else {
      console.log('用户未登录')
    }
    let System = window.plus
    console.log(System.runtime.version)
    this.version = System.runtime.version
    let that = this
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
          if (res.data.mobile !== '' && res.data.mobile !== null) {
            if (that.is_back) {
              that.$router.go(-1)
            } else {
              // 跳转首页
              that.$router.replace({
                path: '/index'
              })
            }
          } else {
            // 跳转绑定手机
            that.$router.togo({
              path: '/bind?visit=0'
            })
          }
        }
      })
    },
    phoneLogin() {
      this.$router.togo({
        path: '/phoneLogin'
      })
    },
    goTop() {
      console.log('回到顶部')
      document.getElementById('coll').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    loginApp() {
      console.log(this.aweixin)
      let that = this
      var storage = window.localStorage
      if (!window.plus) {
        console.log('当前环境不支持微信登录')
        // member[uid]=113;member[username]=wx_ognZN5Q2TtAWkz6z-82dKh0zTwu4;member[rank]=1;member[token]=295ab6b5a66839d7450f519f501c4f11_1565139287;member[source]=wxxcx;sessionid=85nag945vtahl3ee2hsj892226
        storage.setItem('token',
          'uid=113;username=wx_ognZN5Q2TtAWkz6z-82dKh0zTwu4;rank=1;token=295ab6b5a66839d7450f519f501c4f11_1565139287;source=wxxcx;sessionid=85nag945vtahl3ee2hsj892226;'
        )
        storage.setItem('isLogin', true)
        setToken('member[uid]', '113')
        setToken('member[username]', 'wx_ognZN5Q2TtAWkz6z-82dKh0zTwu4')
        setToken('member[rank]', '1')
        setToken('member[token]', '295ab6b5a66839d7450f519f501c4f11_1565139287')
        setToken('member[source]', 'wxxcx')
        setToken('sessionid', '85nag945vtahl3ee2hsj892226')
        if (that.is_back) {
          that.$router.go(-1)
        } else {
          // 跳转首页
          that.$router.replace({
            path: '/index'
          })
        }
      } else {
        this.aweixin.login(
          function (e) {
            console.log(e)
            let info = {
              openid: e.target.userInfo.openid,
              uionId: e.target.userInfo.unionid,
              name: e.target.userInfo.nickname,
              iconurl: e.target.userInfo.headimgurl
            }
            appLogin(info).then(res => {
              console.log(res)
              if (res.isSuccess) {
                if (res.is_register) {
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
                    if (that.is_back) {
                      that.$router.go(-1)
                    } else {
                    // 跳转首页
                      that.$router.replace({
                        path: '/index'
                      })
                    }
                  } else {
                    that.$router.togo({
                      path: '/bind?visit=-1&openid=' + e.target.userInfo.openid + '&unionid=' + e.target.userInfo.unionid + '&name=' + e.target.userInfo.nickname + '&iconurl=' + e.target.userInfo.headimgurl
                    })
                  }
                } else {
                  that.$router.togo({
                    path: '/bind?visit=-1&openid=' + e.target.userInfo.openid + '&unionid=' + e.target.userInfo.unionid + '&name=' + e.target.userInfo.nickname + '&iconurl=' + e.target.userInfo.headimgurl
                  })
                }
              } else {
                console.log('登录失败')
              }
            })
          },
          function (e) {
            console.log('授权失败：' + JSON.stringify(e))
            if (e.code == -8) {
              Toast({
                message: '当前没有安装微信，请用其它方式登录',
                duration: 1000
              })
            }
          }, {
            scope: 'snsapi_userinfo',
            state: 'authorize test',
            appid: 'wxbc7c7b9255f2935b' // 测试 wx2484f700dcb44fad 正式 wxbc7c7b9255f2935b
          }
        )
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

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .login_bg {
    background: #fff;
    height: calc(100% - 0.9rem);

    .login {
      height: 100%;
      position: relative;

      .login-bg img {
        width: 100%;
      }
      .login_head_img {
        // text-align: center;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 10%;

        img {
          width: 2rem;
          height: 2rem;
          border-radius: 0.2rem;

        }
      }

      .login_head_title {
        position: absolute;
        top: 28%;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.32rem;
        color: #000;
      }

      .phone-btn {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 28%;
        width: 100%;
        button{
          padding-left: 48/100rem;
          width:80%;
          height:92/100rem;
          border-radius:46/100rem;
          background:linear-gradient(90deg,rgba(255,78,121,1) 0%,rgba(255,43,144,1) 100%);
          display: inline-block;
          line-height: 92/100rem;
          font-size: 0.34rem;
          font-weight:500;
          color:rgba(255,255,255,1);
          display: block;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          img{
            position: absolute;
            left:148/100rem;
            bottom: 22/100rem;
            height: 48/100rem;
            width: 48/100rem;
          }
        }
      }

      .login_btn {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 17%;
        width: 100%;
        button {
          padding-left: 48/100rem;
          width:80%;
          height:92/100rem;
          border-radius:46/100rem;
          border:1px solid rgba(0,0,0,0.4);
          font-size: 0.34rem;
          background-color: #fff;
          display: block;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          img{
            position: absolute;
            left:148/100rem;
            bottom: 22/100rem;
            height: 48/100rem;
            width: 48/100rem;
          }
        }
      }

      .login_version {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 7%;
        width: 100%;
        font-size: 0.28rem;
        color: #585858;

        span {
          display: block;
          text-align: center;
        }
      }
    }

  }

</style>
