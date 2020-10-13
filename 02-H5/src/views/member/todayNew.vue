<template>
  <div>
    <common-header :h_title="h_title" :bgcolor='head_color'></common-header>
    <div class="todayNews_bg" v-if="showlevel">
      <div id='todayNews_bg' style="height:0.9rem"></div>
      <return-top @returnTop='goTop'></return-top>
      <div class="todayNews_fixed">
        <div class="todayNews_title">
          <div :class="type === '1' ? 'showColor todayNews_title_l' : 'todayNews_title_l'" @click="showList('1')">
            会员 （{{mem_fansNum}}）
          </div>
          <div :class="type === '0' ? 'showColor todayNews_title_r' : 'todayNews_title_r'" @click="showList('0')">
            粉丝 （{{normal_fansNum}}）
          </div>
        </div>
      </div>
       <div style="height:0.96rem"></div>
      <div class="todayNews_info" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
        infinite-scroll-distance="30" infinite-scroll-immediate-check='autoOpen'>
        <div class="todayNews_info_list" v-for="(item,index) in FansList" :key="index" @click="goLink(item.uid)">
          <div class="info_list_img">
            <img :src="item.image" alt="">
          </div>
          <div class="info_list_content">
            <div class="list_content_title">
              <span class="img_box" v-if="item.level_id>0">
                <img v-if="item.level_id==1" :src="bronzeIcon" alt="">
                <img v-if="item.level_id==2" :src="silverIcon" alt="">
                <img v-if="item.level_id>=3" :src="goldIcon" alt="">
              </span>
              <p>
                <span v-if="item.remark!=null&&item.remark!=''">{{item.remark}}</span>
                <span v-else>{{item.nickname}}</span>
              </p>
            </div>
            <p class="list_content_info">
              <span>{{item.inviter_time}}</span>
              <span>累计下单{{item.total_order}}单</span>
              <span>贡献佣金<span class="order_money">￥{{item.commission}}</span></span>
            </p>
          </div>
          <div class="info_list_icon" v-if="item.is_true==true">
            <i class="iconfont icon-iconfontjiantou5"></i>
          </div>
        </div>
        <div class="margin_bottom">
          <div class='more_load' v-if='!loading'>
            <mt-spinner type="fading-circle"></mt-spinner>
          </div>
          <div class='list_bottom' v-if='total==FansList.length&&total>0'>—————— 我是有底线的 ——————</div>
          <div class='center' v-if='hasData==false'>
            <!-- <img :src='imgPath+"pro/No_find.png"'/> -->
            <img :src='nullImg' />
            <span>没有发现任何数据哦~</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import returnTop from '@/components/return-top'
import bronze from '@/assets/img/bronze.png'
import silver from '@/assets/img/silver.png'
import gold from '@/assets/img/gold.png'
import userImg from '@/assets/img/login.png'
import nullImg from '@/assets/img/null/fans_null.png'
import {
  addFansListInfo
} from '@/api/share'
import {
  InfiniteScroll,
  Indicator
} from 'mint-ui'
export default {
  name: 'TodayNew',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    returnTop
  },
  data() {
    return {
      h_title: '今日新增',
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      showlevel: false,
      page: 1,
      bronzeIcon: bronze,
      silverIcon: silver,
      goldIcon: gold,
      mem_fansNum: 0,
      normal_fansNum: 0,
      isShowColor: false,
      headPic: userImg,
      nullImg: nullImg,
      type: '1',
      typeDay: 'today',
      loading: true,
      hasData: true,
      imgPath: process.env.FilE_URL,
      total: 0,
      limit: 10,
      FansList: []
    }
  },
  mounted() {
    const that = this
    var option = this.$route.query
    this.typeDay = option.type
    if (option.type === 'today') {
      that.h_title = '今日新增'
    } else {
      that.h_title = '列表'
    }
    var storage = window.localStorage
    this.type = storage.getItem('type')
    this.getList()
  },
  methods: {
    goTop() {
      document.getElementById('todayNews_bg').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    getList() {
      const that = this
      var obj = {
        page: 1,
        days: this.typeDay,
        type: this.type,
        size: this.limit
      }
      Indicator.open('加载中...')
      addFansListInfo(obj).then(res => {
        if (res.isSuccess) {
          Indicator.close()
          that.showlevel = true
          that.mem_fansNum = res.data.mem_new
          that.normal_fansNum = res.data.fans_new
          that.total = res.data.fans_list.total
          if (res.data.fans_list.rows !== undefined && res.data.fans_list.rows.length > 0 && res.data.fans_list.rows != false) {
            that.FansList = res.data.fans_list.rows
            that.hasData = true
            that.loading = false
            var storage = window.localStorage
            storage.setItem('type', '1')
            if (res.data.fans_list.rows.length < that.limit) {
              that.loading = true
            }
          } else {
            that.hasData = false
            that.loading = true
          }
        }
      })
    },
    showList(type) {
      if (type != this.type) {
        this.type = type
        this.loading = true
        this.hasData = true
        this.FansList = []
        document.getElementById('todayNews_bg').scrollIntoView(false)
        this.page = 1
        this.getList()
      } else {
        console.log('点击不刷新')
      }
    },
    loadMore() {
      this.loading = true
      var that = this
      let info = {
        days: this.typeDay,
        type: this.type,
        page: ++that.page,
        size: this.limit
      }
      addFansListInfo(info).then(res => {
        if (res.isSuccess) {
          Indicator.close()
          that.total = res.data.fans_list.total
          if (res.data.fans_list.rows.length > 0) {
            that.loading = false
            that.FansList = that.FansList.concat(res.data.fans_list.rows)
            if (res.data.fans_list.rows.length < that.limit) {
              that.loading = true
            }
          } else {

          }
        } else {
          that.total = 0
          that.FansList = []
          that.loading = true
        }
      })
    },
    goLink(id) {
      this.$router.togo({
        path: '/customerDetail?uid=' + id + '&type=' + this.type
      })
    }
  }
}

</script>

<style lang="less" scoped>
  .todayNews_bg {
    width: 100%;
    position: relative;
    height: 100%;
    //  height: 100vh;
    //  overflow: scroll;
    overflow-x: hidden;
    background: rgba(250, 250, 252, 1);
    .todayNews_fixed{
      position: fixed;
      width: 100%;
      height:96/100rem;
      position: fixed;
        z-index: 50;
      .todayNews_title {
        width: 750/100rem;
        height: 96/100rem;
        background: rgba(255, 255, 255, 1);
        display: flex;
        margin-bottom: 20/100rem;

        .todayNews_title_l,
        .todayNews_title_r {
          flex: 1;
          text-align: center;
          line-height: 96/100rem;
          font-size: 28/100rem;
          border-bottom: 4/100rem solid transparent;
          box-sizing: border-box;
        }

        .showColor {
          border-bottom: 4/100rem solid #E8C192;
          color: rgba(232, 193, 146, 1);
        }
      }
    }

    .todayNews_info {
       height: calc(100vh  - 2.01rem);
       overflow-y: scroll;
       margin-top: 0.15rem;
      .todayNews_info_list {
        width: 100%;
        height: 140/100rem;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 2px 0px rgba(202, 204, 218, 0.25);
        padding: 28/100rem 62/100rem 28/100rem 34/100rem;
        display: flex;
        box-sizing: border-box;
        position: relative;
        margin-bottom: 0.04rem;

        .info_list_icon {
          position: absolute;
          height: 84/100rem;
          width: 32/100rem;
          padding-top: 23/100rem;
          top: 28/100rem;
          right: 30/100rem;
        }
      }

      .info_list_img {
        width: 84/100rem;
        height: 84/100rem;
        border-radius: 50%;
        margin-right: 16/100rem;

        img {
          width: 84/100rem;
          height: 84/100rem;
          border-radius: 50%;
        }
      }

      .info_list_content {
        width: 100%;
        height: 84/100rem;

        .list_content_title {
          font-size: 28/100rem;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
          line-height: 40/100rem;
          margin-bottom: 4/100rem;
          display: flex;
          p{
            width: 5.2rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis
          }
          .img_box {
            display: block;
            width: 32/100rem;
            height: 32/100rem;
            margin-top: 4/100rem;

            img {
              width: 32/100rem;
              height: 32/100rem;
            }
          }
        }

        .list_content_info {
          font-size: 24/100rem;
          color: rgba(0, 0, 0, 0.4);
          font-weight: 400;

          span {
            display: inline-block;
            padding-right: 0.1rem;

            .order_money {
              color: #CAA24F;
              font-size: 28/100rem;
            }
          }
        }
      }
    }
  }

  // 底部样式
  .more_load {
    display: flex;
    justify-content: center;
  }

  .list_bottom {
    height: 84/100rem;
    line-height: 84/100rem;
    text-align: center;
    font-size: 23.97/100rem;
    color: #bebebe;
  }

  .center {
    text-align: center;
    width: 100%;
    padding-top: 0.8rem;
  }

  .center img {
    display: inline-block;
    width: 400/100rem;
    height: 400/100rem;
  }

  .center span {
    width: 100%;
    display: inline-block;
    text-align: center;
    padding-top: 0.1rem;
    color: #999;
    font-size: 0.28rem;
  }

</style>
