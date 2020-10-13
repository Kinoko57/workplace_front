<template>
  <div class="page">
    <keep-alive :include="['Index','index','ProList','ActivityList','Member','Car','Shoper','MyOrder']">>
      <router-view></router-view>
    </keep-alive>

    <!-- 底部导航栏 -->
    <div class="nav-footer" v-if="showFooter">
      <footer>
        <router-link :to="{ path: '/index' }" v-bind:class="{'active':activeRoute == '/index'}">
          <div class="tab-0"></div>
          <p v-text="'首页'"></p>
        </router-link>
        <router-link :to="{ path: '/typeList' }" v-bind:class="{'active':activeRoute == '/typeList'}">
          <div class="tab-2"></div>
          <p v-text="'分类'"></p>
        </router-link>
        <router-link :to="{ path: '/hotPush' }" v-bind:class="{'active':activeRoute == '/hotPush'}" v-if="$store.state.home.is_share==0">
          <div class="tab-1 no_share"></div>
          <p v-text="'发现'"></p>
        </router-link>
        <router-link :to="{ path: '/asShoper' }" v-bind:class="{'active':activeRoute == '/asShoper'}" v-if="!$store.state.home.is_member&&$store.state.home.is_share==1">
          <div class="tab-1"></div>
          <p v-text="'升级会员'"></p>
        </router-link>
        <router-link :to="{ path: '/shoper' }" v-bind:class="{'active':activeRoute == '/shoper'}" v-if="$store.state.home.is_member&&$store.state.home.is_share==1">
          <div class="tab-1"></div>
          <p v-text="'会员'"></p>
        </router-link>
        <router-link :to="{ path: '/car' }" v-bind:class="{'active':activeRoute == '/car'}">
          <div class='badge' v-if="$store.state.home.carnum>0">
            <span v-if="$store.state.home.carnum<99">{{$store.state.home.carnum}}</span>
            <span v-else>···</span>
          </div>
          <div class="tab-3"></div>
          <p v-text="'购物车'"></p>
        </router-link>
        <router-link :to="{ path: '/member' }" v-bind:class="{'active':activeRoute == '/member'}">
          <div class='radios' v-if="$store.state.home.news"></div>
          <div class="tab-4"></div>
          <p v-text="'我的'"></p>
        </router-link>
      </footer>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
// import { Badge } from 'mint-ui'
export default {
  name: 'IndexRoute',
  // components: {
  //   Badge
  // },
  data() {
    return {
      isMember: this.$store.state.home.is_member,
      isShare: this.$store.state.home.is_share,
      showFooter: window.localStorage.getItem('showFooter'),
      navList: [{
        path: '/index',
        name: '首页',
        type: ''
      },
      {
        path: '/hotPush',
        name: '发现',
        type: ''
      },
      {
        path: '/type',
        name: '分类',
        type: ''
      },
      {
        path: '/car',
        name: '购物车',
        type: 'num'
      },
      {
        path: '/member',
        name: '我的',
        type: 'radio'
      }
      ]
    }
  },
  computed: {
    ...mapGetters(['number', 'carnum', 'isbind', 'score']),
    activeRoute() {
      return this.$route.path
    }
  },
  mounted() {
    console.log('触发了吗')
    console.log(this.isMember)
    console.log(this.isShare)
    this.showFooter = window.localStorage.getItem('showFooter')
  },
  methods: {
    // goPage(url, active) {
    //   if (url.indexOf(active) == -1) {
    //     window.localStorage.setItem('showFooter', false)
    //     window.localStorage.setItem('showPage', false)
    //     this.$router.toReplace({
    //       path: url
    //     })
    //   }
    // }
  },
  watch: {
    $route(val) {
      // console.log(val)
    },
    isMember(val) {
      console.log('监听是否是会员' + val)
    },
    isShare(val) {
      console.log('监听是否显示分享功能' + val)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .nav-footer {
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 0.98rem;
    background: #ffffff;
    // background: @tab-general-bg-color;
    display: block;
    z-index: 100;

    footer {
      font-size: 0;
      // border-top: 1px solid #e7e7e7;
      box-shadow: 0 0.14rem 0.2rem 0.1rem #dadada;
      border-bottom: 1px solid #f8f8f8;
      padding-top: 0.1rem;
      line-height: 1.2;
      width: 100%;
      height: 0.98rem;
      display: flex;
// .menu
       a{
        text-decoration: none;
        // color: @base-font-color;
        color: #000000;
        -webkit-box-flex: 1;
        -moz-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        text-align: center;
        box-sizing: border-box;
        display: block;
        font-size: 0.22rem;
        position: relative;

        .badge {
          position: absolute;
          margin: 0;
          top: -0.05rem;
          right: 0.3rem;
          padding: 0.03rem;
          text-align: center;
          width: 0.3rem;
          height: 0.3rem;
          border-radius: 50%;
          background: #f43530;

          span {
            font-size: 0.18rem;
            color: #fff;
            // font-weight: bold;
            text-align: center;
          }
        }

        .radios {
          position: absolute;
          margin: 0;
          top: -0.05rem;
          right: 0.5rem;
          line-height: 0.2rem;
          text-align: center;
          width: 0.2rem;
          height: 0.2rem;
          border-radius: 50%;
          background: #f43530;
        }

        .tab-0,
        .tab-1,
        .tab-2,
        .tab-3,
        .tab-4 {
          display: inline-block;
          height: 0.5rem;
          width: 0.5rem;
          background-size: cover;
        }

        .tab-0 {
          background-image: url("../assets/img/tab/home.png");
        }

        .tab-1 {
          background-image: url("../assets/img/tab/vip.png");
        }

        .tab-2 {
          background-image: url("../assets/img/tab/type.png");
        }

        .tab-3 {
          background-image: url("../assets/img/tab/car.png");
        }

        .tab-4 {
          background-image: url("../assets/img/tab/my.png");
        }
        .is_member{
          background-image: url("../assets/img/tab/vip.png");
          height: 0.74rem;
          width: 0.84rem;
        }
        .no_share{
          background-image: url("../assets/img/tab/search.png");
        }

        &:hover {
          text-decoration: none;
        }

        &.router-link-active.active {
          // color: #fff;
          color: #FF4E79;
          p{
            opacity: 1;
          }
          .tab-0 {
            background-image: url("../assets/img/tab/home_c.png");
          }

          .tab-1 {
            background-image: url("../assets/img/tab/vip_c.png");
          }

          .tab-2 {
            background-image: url("../assets/img/tab/type_c.png");
          }

          .tab-3 {
            background-image: url("../assets/img/tab/car_c.png");
          }

          .tab-4 {
            background-image: url("../assets/img/tab/my_c.png");
          }
          .no_share{
            background-image: url("../assets/img/tab/search_c.png");
          }
          .is_member{
            // color: #fff;
            background-image: url("../assets/img/tab/vip.png");
            height: 0.74rem;
            width: 0.84rem;

          }
        }

        .is_member_text{
            background: -webkit-linear-gradient(top,#ddad45,#fae896);
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            text-transform: uppercase;
        }
      }
      .asMember{
          top: -33%;
      }

      p {
        margin: 0;
        opacity: 0.4;
      }
    }
  }

</style>
