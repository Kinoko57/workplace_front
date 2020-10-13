<template>
  <div class="login_container">
    <img :src="loginBg" alt="" class="login_bg">
    <!-- <el-image
      :src="loginBg"
      fit="cover"
      class="login_bg"/> -->
    <!-- <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login_form"
      auto-complete="on"
      label-position="left">

      <div class="title_container">
        <div class="login_icon">
          <img :src="logoLeft" class="img_left">
          <span class="line" />
          <img :src="logoRight" class="img_right">
          <span class="right_level">V1.0</span>
        </div>
        <h3 class="title">登录界面</h3>
      </div>
      <el-form-item prop="account">
        <el-input
          v-model="loginForm.account"
          placeholder="请输入用户名"
          name="account"
          type="text"
          auto-complete="on"
          style="width:335px"
          clearable>
          <svg-icon slot="prefix" icon-class="user" />
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          :type="passwordType"
          v-model="loginForm.password"
          placeholder="请输入密码"
          name="password"
          auto-complete="on"
          clearable
          style="width:335px"
          @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="password" />
        </el-input>
        <span class="show_pwd" @click="showPwd">
          <svg-icon v-if="passwordType=='password'" icon-class="eye_close" />
          <svg-icon v-else icon-class="eye_open" />
        </span>
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="remember" label="下次自动登录"/>
      </el-form-item>

      <el-form-item>
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin">{{
          $t('login.logIn') }}</el-button>
      </el-form-item>
    </el-form> -->
    <div class="login_form_block">
      <div class="login_block">
        <div class="login_head">
          <div class="head_img">
            <img :src="logoLeft" class="img_left">
          </div>
          <div class="head_title">
            <p class="title">CRM客户管理系统</p>
            <p class="tips">Customer Relationship Management </p>
          </div>
        </div>
        <el-form
          ref="loginForm"
          :inline="true"
          :model="loginForm"
          :rules="loginRules"
          class="login_body"
          auto-complete="on"
          label-position="left">
          <el-form-item prop="account">
            <el-input
              v-model="loginForm.account"
              placeholder="请输入用户名"
              name="account"
              type="text"
              auto-complete="on"
              clearable>
              <svg-icon slot="prefix" icon-class="user" />
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              :type="passwordType"
              v-model="loginForm.password"
              placeholder="请输入密码"
              name="password"
              auto-complete="on">
              <svg-icon slot="prefix" icon-class="password" />
            </el-input>
            <span class="show_pwd" @click="showPwd">
              <svg-icon v-if="passwordType=='password'" icon-class="eye_close" />
              <svg-icon v-else icon-class="eye_open" />
            </span>
          </el-form-item>

          <el-form-item prop="verify">
            <el-input
              v-model="loginForm.verify"
              type="text"
              placeholder="请输入验证码"
              name="verify"
              auto-complete="on"
              @keyup.enter.native="handleLogin">
              <svg-icon slot="prefix" icon-class="code" />
            </el-input>
            <span class="show_pwd" style="top:10px;right:6px">
              <img :src="imgUrl" style="width:70px;height:30px;" title="点击刷新验证码" @click="reloadCode">
            </span>
            <!-- <span class="show_pwd" @click="showPwd">
              <svg-icon v-if="passwordType=='password'" icon-class="eye_close" />
              <svg-icon v-else icon-class="eye_open" />
            </span> -->
          </el-form-item>

          <div class="login_btn" @click="handleLogin">
            <img :src="loginBtn" alt="">
          </div>
        </el-form>
      </div>

    </div>

  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialsignin'
import {
  setToken,
  setCookie
} from '@/utils/auth' // getToken from cookie
import {
  loginByUsername
} from '@/api/login'
import logoLeft from '@/assets/logo_left.png'
import logoRight from '@/assets/logo_right.png'
// import loginBg from '@/assets/login_bg.png'
import loginBg from '@/assets/login.jpg'
import loginBtn from '@/assets/login_btn.png'
import {
  mapMutations
} from 'vuex'
import store from '@/store/index'
import {
  removeToken,
  removeCookie
} from '@/utils/auth'
export default {
  name: 'Login',
  components: {
    LangSelect,
    SocialSign
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入六位数以上的密码'))
      } else {
        callback()
      }
    }
    return {
      linkUrl: '',
      imgUrl: '',
      loginBg: loginBg,
      loginBtn: loginBtn,
      logoLeft: logoLeft,
      logoRight: logoRight,
      remember: false,
      loginForm: {
        account: '',
        password: '',
        verify: ''
      },
      loginRules: {
        account: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword
        }],
        verify: [{
          required: true,
          trigger: 'blur',
          message: '请输入验证码'
        }, { max: 4, message: '验证码不能超过4位', trigger: 'blur' }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }

  },
  created() {
    this.linkUrl = process.env.BASE_API + 'sys/index-verify'
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  mounted() {
    this.imgUrl = this.linkUrl + '?' + Math.random()
    this.loginForm.verify = ''
    // console.log(this.$route.query.initiative)
    // console.log(window.localStorage.getItem('accountInfo'))
    // console.log(window.localStorage.getItem('remember'))
    // if (window.localStorage.getItem('accountInfo') !== '' && window.localStorage.getItem('accountInfo') !== null) {
    //   const info = JSON.parse(window.localStorage.getItem('accountInfo'))
    //   this.loginForm = {
    //     account: info.account,
    //     password: info.password
    //   }
    //   this.remember = true
    //   // initiative为1时是用户主动退出，且限制不登陆 remember为1为记住密码
    //   if (window.localStorage.getItem('remember') === '1' && this.$route.query.initiative === undefined) {
    //     loginByUsername(this.loginForm).then(res => {
    //       if (res.code === 200) {
    //         this.loading = false
    //         this.$message({
    //           type: 'success',
    //           message: '登录成功'
    //         })
    //         setToken('admin')
    //         setCookie('crm_token', res.data.user.token)
    //         setCookie('crm_account', res.data.user.account)
    //         setCookie('crm_from', 'pc')
    //         window.localStorage.setItem('changePwd', res.data.user.changePwd)
    //         window.localStorage.setItem('logout', 0)
    //         if (this.remember) {
    //           window.localStorage.setItem('remember', 1)
    //           window.localStorage.setItem('accountInfo', JSON.stringify(this.loginForm))
    //         } else {
    //           window.localStorage.setItem('remember', 0)
    //           window.localStorage.setItem('accountInfo', '')
    //         }
    //         if (res.data.user.realname === '') {
    //           window.localStorage.setItem('username', '')
    //         } else {
    //           window.localStorage.setItem('username', res.data.user.realname)
    //         }
    //         const roles = []
    //         window.localStorage.setItem('userinfo', JSON.stringify(res.data.user))
    //         const list = res.data.user.rights
    //         for (const first in list) {
    //           for (const second in list[first]) {
    //             roles.push(first + '_' + second)
    //           }
    //         }
    //         window.localStorage.setItem('reload', 1)
    //         window.localStorage.setItem('roleList', JSON.stringify(roles))
    //         this.$router.push({
    //           path: '/'
    //         })
    //       } else {
    //         console.log(res)
    //         this.loading = false
    //         this.$message({
    //           type: 'error',
    //           message: res.data.msg
    //         })
    //       }
    //     })
    //   }
    // }
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USERINFO'
    }),
    reloadCode() {
      this.imgUrl = this.linkUrl + '?' + Math.random()
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      const that = this
      // setToken('admin')
      // setCookie('crm_token', '766a9cbc297426d994208fc97d4f9bba')
      // setCookie('crm_account', 'yinyujiao')
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          loginByUsername(this.loginForm).then(res => {
            removeCookie('crm_token')
            removeCookie('crm_account')
            window.localStorage.removeItem('changePwd')
            window.localStorage.removeItem('roleList')
            window.localStorage.removeItem('username')
            removeToken()
            store.commit('SET_ROUTERS', undefined)
            if (res.code === 200) {
              this.loading = false
              this.$message({
                type: 'success',
                message: '登录成功'
              })
              setToken('admin')
              setCookie('crm_token', res.data.user.token)
              setCookie('crm_account', res.data.user.account)
              window.localStorage.setItem('changePwd', res.data.user.changePwd)
              window.localStorage.setItem('logout', 0)
              if (that.remember) {
                window.localStorage.setItem('remember', 1)
                window.localStorage.setItem('accountInfo', JSON.stringify(this.loginForm))
              } else {
                window.localStorage.setItem('remember', 0)
                window.localStorage.setItem('accountInfo', '')
              }
              if (res.data.user.realname === '') {
                window.localStorage.setItem('username', '')
              } else {
                window.localStorage.setItem('username', res.data.user.realname)
              }
              const roles = []
              window.localStorage.setItem('userinfo', JSON.stringify(res.data.user))
              const list = res.data.user.rights
              for (const first in list) {
                for (const second in list[first]) {
                  roles.push(first + '_' + second)
                }
              }
              window.localStorage.setItem('roleList', JSON.stringify(roles))
              // getUnRead().then(res=>{
              //   console.log()
              // })
              window.localStorage.setItem('reload', 1)
              this.$router.push({
                path: '/'
              })
              // this.$router.push({ path: this.redirect || '/' })
            } else {
              console.log(res)
              this.loading = false
              this.$message({
                type: 'error',
                message: res.data.msg
              })
              this.reloadCode()
            }
          })
        } else {
          console.log('error submit!!')
          // this.$message.warning('信息填写不完整或者信息填写有误！')
          this.$nextTick(() => {
            this.checkFormErr()
          })
          return false
        }
      })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login_container .el-input input {
      color: rgb(153, 153, 153);

      &::first-line {
        color: rgb(153, 153, 153);
      }
    }
  }

  /* reset element-ui css */
  // .login_container {
  //   .el-input {
  //     display: inline-flex;
  //     align-items: center;
  //     width: 85%;

  //     input {
  //       height: 39px;

  //       &:-webkit-autofill {
  //         -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
  //         -webkit-text-fill-color: rgb(153, 153, 153) !important;
  //       }
  //     }

  //     .el-input__prefix {
  //       display: inline-flex;
  //       align-items: center;
  //       padding-left: 5px;
  //     }

  //     .el-input__suffix {
  //       right: 26px;
  //     }
  //   }

  //   .el-form-item {
  //     border: 1px solid rgba(255, 255, 255, 0.1);
  //     background: #fff;
  //     color: rgb(153, 153, 153);
  //     padding-top: 22px;
  //     width: 335px;
  //     margin: 0 auto;
  //     margin-bottom: 10px
  //   }
  // }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login_container {
    position: fixed;
    height: 100%;
    width: 100%;

    // background-color: $bg;
    .login_bg {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    // .login_form {
    //   position: absolute;
    //   left: 0;
    //   right: 0;
    //   top: 50%;
    //   transform: translateY(-50%);
    //   width: 380px;
    //   max-width: 100%;
    //   background: #fff;
    //   margin: 0px auto;
    //   border-radius: 10px;
    //   border-bottom-right-radius: 0px;
    //   border-bottom-left-radius: 0px;
    //   box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.0980392156862745);
    // }

    .login_form_block {
      height: 300px;
      background: rgba(0, 0, 0, .46);
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .login_block {
        min-width: 1000px;
        .login_head {
          display: flex;
          align-items: center;

          .head_img {
            width: 90px;
            margin-right: 10px;

            img {
              width: 100%;
              height: 100%;
              vertical-align: middle;
            }
          }

          .head_title {
            color: #fff;
            margin-left: 4px;

            p {
              margin: 0;
              padding: 0;
            }

            .title {
              font-family: '微软雅黑 Bold', '微软雅黑';
              font-weight: 700;
              font-size: 44px;
            }

            .tips {
              font-family: '微软雅黑 Regular', '微软雅黑';
              font-weight: 410;
              font-size: 20px;
              padding-top: 6px;
            }
          }
        }

        .login_body {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 22px;
          .el-form-item {
            color: rgb(153, 153, 153);
            width: 300px;
            height: 50px;
            margin-bottom: 10px;
            .svg-icon{
              font-size: 24px;
              color: rgb(153,153,153);
            }
            /deep/.el-form-item--medium{
              line-height:50px;
            }
            /deep/ .el-input__inner{
                line-height:50px;
                height: 50px;
                padding: 0 40px;
                width: 300px;
              }
            /deep/ .el-input__prefix{
              display: inline-flex;
              align-items: center;
              left:10px;
            }
          }

          .login_btn {
            display: inline-flex;
            align-items: center;
            margin-bottom: 10px;
            margin-left: 16px;
            cursor: pointer;
            img{
              vertical-align: middle;
            }
            // .svg-icon {
            //   font-size: 40px;
            //   color: #fff;
            // }
          }
        }
      }

    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg_container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title_container {
      position: relative;
      background: #409eFF;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 56px;
      border-radius: 10px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;

      .login_icon {
        position: relative;
        width: 122px;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        img {
          vertical-align: middle;
        }

        .img_left {
          width: 36px;
          height: 30px;
        }

        .line {
          height: 24px;
          width: 1px;
          background: #fff;
          margin: 0 10px;
        }

        .img_right {
          width: 29px;
          height: 29px;
        }

        .right_level {
          position: absolute;
          top: -16%;
          right: 0;
          display: inline-flex;
          color: #fff;
          font-size: 12px;
        }
      }

      .title {
        font-size: 18px;
        color: #fff;
        text-align: center;
        font-family: 'Arial Normal', 'Arial';
        font-style: normal;
        font-weight: 400;
        margin-left: 20px;
      }

      .set_language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }

    .show_pwd {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty_button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }

</style>
