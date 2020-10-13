<template>
  <div class="headbar">
    <!-- <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" /> -->
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <div class="head_content">
      <div class="left_logo">
        <img :src="logoLeft" class="img_left">
        <span class="line" />
        <img :src="logoRight" class="img_right">
        <span class="right_level">V2.0</span>
      </div>
      <div class="top_menu_wraper">
        <top-menu class="top_menu" />
      </div>
      <div class="right-menu">
        <!-- erweima -->
        <el-dropdown class="avatar-container right-menu-item" trigger="hover">
          <div class="avatar-wrapper">
            <svg-icon icon-class="ren" />
            <span>{{ userInfo.account }}</span>
          </div>
          <el-dropdown-menu slot="dropdown" class="drop_info">
            <el-dropdown-item disabled>
              <div class="acc_info">
                <div class="info_head">
                  <span>账户信息</span>
                </div>
                <div class="info_body">
                  <ul>
                    <li>
                      <i class="li_radio"/>
                      <span>所在部门：</span>
                      <span class="li_info">{{ userInfo.org }}</span>
                    </li>
                    <li>
                      <i class="li_radio"/>
                      <span>真实姓名：</span>
                      <span class="li_info">{{ userInfo.username }}   &nbsp;&nbsp;&nbsp;     {{ userInfo.sex }}</span>
                    </li>
                    <li>
                      <i class="li_radio"/>
                      <span>登录地址：</span>
                      <span class="li_info">{{ userInfo.ip }}</span>
                    </li>
                    <li>
                      <i class="li_radio"/>
                      <span>上次登录：</span>
                      <span class="li_info">{{ userInfo.last }}</span>
                    </li>
                  </ul>
                </div>
                <div class="info_btn router_link">
                  <router-link to="/usercenter/editprofile">
                    <span>修改资料</span>
                  </router-link>
                  <router-link to="/usercenter/changepassword">
                    <span>修改密码</span>
                  </router-link>
                </div>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="head_icon_group" style="margin: 0;" @click="goLink">
          <!-- <el-tooltip class="item" effect="light" content="站内信" title="站内信" placement="top"> -->
          <span title="站内信">
            <el-badge :value="unReads" :hidden="unReads==0" :max="99" class="item">
              <svg-icon icon-class="tongzhi" />
            </el-badge>
          </span>
          <!-- </el-tooltip> -->
        </div>
        <a v-if="dockingShow==true" :href="fileUrl" target="_blank" class="head_icon_group" style="margin: 0;">
          <span title="事务对接表">
            <svg-icon style="color:#fff;font-size:16px;" icon-class="shiwu1" />
          </span>
        </a>
        <a v-if="helpShow==true" :href="helpUrl" target="_blank" class="head_icon_group">
          <span title="帮助文档">
            <svg-icon style="color:#fff;font-size:18px;" icon-class="help1" />
          </span>
        </a>
        <!-- v-if="$route.path=='/dashboard/index'" -->
        <el-dropdown trigger="hover">
          <div class="head_icon_group">
            <svg-icon icon-class="erweima" style="cursor:pointer"/>
          </div>
          <el-dropdown-menu slot="dropdown" class="drop_info">
            <el-dropdown-item disabled>
              <div class="acc_code">
                <div class="code_head">
                  关注企业微信
                </div>
                <div class="code_body">
                  <img src="@/assets/wx.jpg" alt="">
                </div>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="head_icon_group" @click="logout">
          <!-- <el-tooltip class="item" effect="light" content="退出" placement="top"> -->
          <span title="退出">
            <svg-icon icon-class="signOut" />
          </span>
          <!-- </el-tooltip> -->
        </div>
        <!-- <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <img :src="avatar" class="user-avatar">
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="headbar_drop">
            <el-dropdown-item>
              <span :title="'欢迎，' + wholeName" class="user_name">欢迎，<i>{{ name }}</i></span>
            </el-dropdown-item>
            <router-link to="/usercenter/editprofile">
              <el-dropdown-item divided>
                <span>修改资料</span>
              </el-dropdown-item>
            </router-link>
            <router-link to="/usercenter/changepassword">
              <el-dropdown-item divided>
                <span>修改密码</span>
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </div>
    </div>

  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import store from '@/store/index'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import logoLeft from '@/assets/logo_left.png'
import logoRight from '@/assets/logo_right.png'
import avatar from '@/assets/avatar.png'
import {
  removeToken,
  removeCookie
} from '@/utils/auth'
import {
  TopMenu
} from '@/views/layout/components'
import {
  getUnRead
} from '@/api/public'
import {
  getHelpWord,
  getTransaction
} from '@/api/common'
export default {
  components: {
    TopMenu,
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    ThemePicker,
    LangSelect
  },
  data() {
    return {
      logoLeft: logoLeft,
      logoRight: logoRight,
      avatar: avatar,
      num: 0,
      wholeName: '',
      name: '',
      helpUrl: '',
      fileUrl: '',
      helpWorld: 'false',
      userInfo: {}
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'unReads', 'dockingShow', 'helpShow', 'device'])
  },
  mounted() {
    this.helpUrl = process.env.BASE_API + 'helpWord/helpword.html'
    this.fileUrl = process.env.BASE_API + 'transaction/transaction.html'
    const info = JSON.parse(window.localStorage.getItem('userinfo'))
    this.userInfo = {
      account: info.account,
      username: info.realname,
      org: info.dept,
      sex: info.gender,
      ip: info.ip,
      last: info.last
    }
    // if (window.localStorage.getItem('username') !== '') {
    //   let str = window.localStorage.getItem('username')
    //   this.wholeName = window.localStorage.getItem('username')
    //   if (str.length > 4) {
    //     console.log(str)
    //     str = str.substring(0, 4)
    //     str += '...'
    //   }
    //   console.log(str)
    //   this.name = str
    // }
    // 获取帮助文档
    this.getHelpWold()
    // 获取事务对接表
    this.getTransaction()
    this.getNews()
    // this.helpWorld = window.localStorage.getItem('helpWorld')
  },
  methods: {
    getHelpWold() {
      getHelpWord().then(res => {
        if (res.code === 200 || res.code === '200') {
          console.log(typeof JSON.stringify(false))
          if (res.data.document[0] === false) {
            store.commit('SET_HELPSHOW', false)
          } else {
            store.commit('SET_HELPSHOW', true)
          }
        }
      })
    },
    getTransaction() {
      getTransaction().then(res => {
        if (res.code === 200 || res.code === '200') {
          console.log(typeof JSON.stringify(false))
          if (res.data.docking[0] === false) {
            store.commit('SET_DOCKINGSHOW', false)
          } else {
            store.commit('SET_DOCKINGSHOW', true)
          }
        }
      })
    },
    getNews() {
      const that = this
      getUnRead().then(res => {
        console.log(res)
        if (res.code === 200) {
          that.num = parseInt(res.data.unread)
          store.commit('SET_UNREADS', this.num)
        }
      })
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    goLink() {
      console.log(1)
      this.$router.push({
        path: '/usercenter/mail',
        name: 'Mail'
      })
    },
    logout() {
      this.$confirm('确定退出当前系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.localStorage.setItem('logout', 1)
        console.log('tabbar' + window.localStorage.getItem('logout'))
        // this.$store.dispatch('LogOut').then(() => {
        //   console.log(11111)
        removeCookie('crm_token')
        removeCookie('crm_account')
        window.localStorage.removeItem('changePwd')
        window.localStorage.removeItem('roleList')
        window.localStorage.removeItem('username')
        removeToken()
        store.commit('SET_ROUTERS', undefined)
        this.$router.push({
          path: '/login'
        })
      })
        .catch(() => {
          console.log('用户点击了取消')
        })
    },
    goDelitWord() {
      this.$router.push({
        path: '/helpWord/helpWord',
        name: 'helpWord'
      })
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '@/styles/variables.scss';
  .headbar {
    height: 70px;
    // line-height: 70px;
    border-radius: 0px !important;
    // background: #409eff;
    background: $mainColor;
    position: fixed;
    top: 0;
    width: 100%;
    min-width: 1024px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 100px;
    z-index: 2000;

    .head_content {
      width: 100%;
      display: flex;
      align-items: center;
      // justify-content: space-between;
    }
    .top_menu_wraper{
      width: 100%;
      margin-left: 15px;
    }
    .left_logo {
      position: relative;
      min-width: 140px;
      height: 70px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      float: left;

      img {
        vertical-align: middle;
      }

      .img_left {
        width: 49px;
        height: 41px;
      }

      .line {
        height: 30px;
        width: 1px;
        background: #fff;
        margin: 0 10px;
      }

      .img_right {
        width: 39px;
        height: 39px;
      }

      .right_level {
        position: absolute;
        top: 17px;
        right: -10px;
        display: inline-flex;
        color: #fff;
        font-size: 12px;
      }
    }

    .right-menu {
      float: right;
      // height: 70px;
      height: 100%;
      display: inline-flex;
      margin-right: 10px;
      // justify-content: space-around;
      // width: 20%;
      .head_icon_group {
        display: flex;
        align-items: center;
        height: 70px;
        margin-right: 10px;
        // margin-right: 10px;

        // .help-ico{
        //   color:#fff;
        // }
        .svg-icon {
          font-size: 16px;
          color: #fff;
        }

        span {
          display: inline-flex;
          margin: 0 8px;
          cursor: pointer;
          color: #fff;
          .el-badge {
            display: inline-flex;

          }
        }
      }

      .avatar-container {
        // height: 50px;
        // margin-right: 30px;
        margin-right: -10px;

        .avatar-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          height: 70px;
          cursor: pointer;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .avatar_bg {
            width: 40px;
            height: 40px;
            cursor: pointer;
            border-radius: 50%;
            background: rgba(64, 158, 255, .5);
            border: 2px solid #fff;
            text-align: center;
            line-height: 36px;
            color: #fff;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 30px;
            font-size: 12px;
          }
          .svg-icon{
            font-size: 16px;
          }
          span{
            color: #fff;
            display: inline-block;
            width: 50px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: -6px;
            margin-left: 4px;
          }
        }
      }
    }
  }

</style>
