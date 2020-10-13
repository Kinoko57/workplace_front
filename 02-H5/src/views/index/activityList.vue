<template>
  <div>
    <common-header :h_title="h_title" :bgcolor='head_color'></common-header>
    <div class='activity' v-if="isShow">
      <div class='red_body' >
        <!-- 返回顶部按钮 -->
        <return-top @returnTop='goTop'></return-top>
        <div class='sale_height' id='activity'></div>
        <div class='activity_banner'>
          <img :src="headbg" />
          <div :class="show_icon?'activity_content overflow_text':'activity_content'" v-if="content!=''">
            <!--animation="animation" -->
            <div :class=" isopen?'content_info show_content':'content_info hidden_content'">{{content}}</div>
            <div class="open_icon" @click='openText' v-if="show_icon">
              <span v-if="isopen">收起</span>
              <span v-else>展开</span>
              <i :class="isopen==false?'iconfont icon-jiantou-copy-copy':'iconfont icon-jiantou-copy-copy-copy'">
              </i>
            </div>
          </div>
        </div>
         <!-- v-infinite-scroll="loadMore" infinite-scroll-disabled="is_load" infinite-scroll-distance="30" -->
        <div class='red_list' v-if="hasData" :style="{background:bgColor}">
          <div class="res_list_block" v-for="(listblock,blockindex) in redShowList" :key="blockindex">
            <div class='red_pro' v-for="(item,index) in listblock" :key="index" @click="goPro('normal',item.goods_id)">
              <div class='pro_img'>
                <img :src="item.gimg" />
              </div>
              <div class='pro_info'>
                <div class='pro_title'>
                  <div class='pro_level' v-if="item.promotion==1">
                    <img :src="imgPath+'member/cu.png'" mode='aspectFit' />
                    <span>限时购</span>
                  </div>
                  {{item.name}}
                </div>
                <div class='pro_spec'>
                  <div class='pro_price'>
                    <div style='display:flex;align-items:center;line-height:0.48rem;' v-if="activity_id!=2">
                      <span class='peo_nowprice' v-if="item.deal_type==1||item.deal_type==3">￥{{item.price_sell}}<span
                          style="color:#ff4e79;font-size:0.23rem" v-if="isMember"> / 赚{{item.back_rebate}}</span></span>
                      <span class='peo_nowprice' v-if="item.deal_type>=4">￥{{item.price_sell}}<span
                          style="color:#ff4e79;font-size:0.23rem" v-if="isMember"> / 赚{{item.back_rebate}}</span></span>
                      <span class='pro_integral' v-if="item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3">+</span>
                      <div class='pro_inter_img' v-if="item.deal_type!=1&&item.deal_type!=3">
                        <i class='iconfont icon-jifen1'></i>
                      </div>
                      <span class='pro_integral' v-if="item.deal_type==2">{{item.point}}</span>
                      <span class='pro_integral'
                        v-if="item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3">{{item.point}}</span>
                    </div>
                    <div style='display:flex;align-items:center;line-height:0.48rem;' v-if="activity_id==2">
                      <div class='pro_inter_img'>
                        <i class='iconfont icon-jifen1'></i>
                      </div>
                      <span class='pro_integral'>{{item.point}}</span>
                    </div>
                    <div style='display:flex;align-items:center;justify-content:space-between;'>
                      <div style='display:inline-flex;align-items:center;'>
                        <span class='pro_orig pro_bg'>{{item.price_market_from}}</span>
                        <span class='pro_orig line'>￥{{item.price_market}}</span>
                      </div>
                      <div class='pro_count'>销量:{{item.buy_count}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class='more_load' v-if='!is_load'>
          <mt-spinner type="fading-circle"></mt-spinner>
        </div>
        <div class='red_list_null' v-if="!hasData">
          <img :src="imgPath+'pro/null_1.png'" />
          <!-- <span>暂无数据</span> -->
        </div>
        <div class='list_bottom' v-if='hasData&&is_end'>—————— 我是有底线的 ——————</div>
        <!-- <div :class="is_iphonex?'null_height null_height_iphonex':'null_height'"></div> -->
        <div class='null_height'></div>
      </div>
      <!-- <include src="../footerTab/footerTab.wxml" /> -->
      <!-- <div class='goTop' hidden="isSign" @click='returnTop'>
        <i class='iconfont icon-huidaodingbu'></i>
      </div> -->
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import {
  InfiniteScroll,
  Indicator,
  Swipe,
  SwipeItem,
  Lazyload,
  Toast
} from 'mint-ui'
import returnTop from '@/components/return-top'
import {
  getActivityListInfo
} from '@/api/index'
export default {
  name: 'ActivityList',
  components: {
    commonHeader,
    Swipe,
    SwipeItem,
    returnTop,
    Lazyload,
    Toast,
    InfiniteScroll,
    Indicator
  },
  data() {
    return {
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      h_title: '活动列表',
      imgPath: process.env.FilE_URL,
      isMember: this.$store.state.home.is_member,
      isShare: this.$store.state.home.is_share,
      content_height: 0,
      show_icon: true,
      isopen: true,
      isShow: false,
      headbg: '',
      content: '',
      bgColor: '#fff',
      title: '',
      activity_id: '',
      newNews: false,
      total_amout: 0,
      topNum: 0,
      redShowList: [],
      redList: [],
      height: '',
      allowScorll: true,
      isSign: true,
      total: 0,
      page: 0,
      limit: 6,
      is_end: false,
      top: 0,
      hasData: true,
      is_load: false
    //   is_iphonex: app.globalData.phoneType
    }
  },
  mounted() {
    console.log(this.$route.query)
    this.activity_id = this.$route.query.id
    this.redShowList = []
    this.isMember = this.$store.state.home.is_member
    this.isShare = this.$store.state.home.is_share
    Indicator.open('加载中...')
    this.redShowList = []
    this.redList = []
    this.page = 0
    this.is_load = true
    this.getList()
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USERINFO',
      setInviter: 'SET_INVITER',
      setMember: 'SET_MEMBER',
      setShare: 'SET_SHARE'
    }),
    goPro(type, id) {
    //   wx.navigateTo({
    //     url: e.currentTarget.dataset.link
    //   })
      this.$router.togo({
        path: '/proDetail?type=' + type + '&id=' + id
      })
    },
    goTop() {
      console.log('回到顶部')
      document.getElementById('activity').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    openText: function(e) {
      console.log(e)
      const that = this
      if (this.isopen) {
      // that.animation.height(70).step()
        that.isopen = false
      } else {
        console.log(that.content_height)
        // that.animation.height(that.content_height).step()
        // that.setData({
        //   animation: that.animation.export()
        // })
        setTimeout(function() {
          that.isopen = true
        }, 400)
      }
    },
    getList: function() {
      var that = this
      getActivityListInfo(that.activity_id).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          that.h_title = res.data.moudule.title
          //   wx.setNavigationBarTitle({
          //     title: res.data.moudule.title
          //   })
          that.headbg = res.data.moudule.list_img
          that.content = res.data.moudule.content
          that.title = res.data.moudule.title
          that.bgColor = res.data.moudule.color
          that.isShow = true
          //   if (res.data.moudule.content != '') {
          //     if (that.content_height > 70) {
          //       that.show_icon = true
          //       that.isopen = false
          //     } else {
          //       var query = wx.createSelectorQuery()
          //       query.select('.content_info').boundingClientRect()
          //       query.exec(function (res) {
          //         that.setData({
          //           content_height: res[0].height
          //         })
          //         console.log(res[0].height)
          //         if (res[0].height <= 80) {
          //           that.setData({
          //             show_icon: false,
          //             isopen: false
          //           })
          //         } else {
          //           that.setData({
          //             show_icon: true,
          //             isopen: false
          //           })
          //         }
          //       })
          //     }
          //   }
          if (res.data.list.rows !== undefined && res.data.list.rows.length > 0) {
            // let currentpage = that.page
            that.redList = res.data.list.rows
            that.redShowList = res.data.list.rows
            // if (currentpage === 0) {
            //   that.redShowList = []
            // }
            // that.redShowList[currentpage] = res.data.list.rows[currentpage]
            // that.total = res.data.list.total
            // that.limit = res.data.list.limit
            // that.hasData = true
            // that.is_end = false

            // that.setData({
            //   ['redShowList[' + currentpage + ']']: res.data.list.rows[currentpage],
            //   total: res.data.list.total,
            //   limit: res.data.list.limit,
            //   hasData: true,
            //   is_end: false,
            //   isShow: true
            // })
            // 如果一页加载数据等于总条数
            // if (res.data.list.rows[currentpage].length < res.data.list.limit || res.data.list.rows.length === 1) {
            that.is_load = true
            that.hasData = true
            that.is_end = true
            that.isShow = true
            // }
          } else {
            that.is_load = true
            that.hasData = false
            that.is_end = true
          }
        }
      })
    }
    // loadMore: function() {
    //   var that = this
    //   console.log('加载下一页')
    //   this.is_load = true
    //   console.log(that.redList)
    //   console.log(that.page)
    //   console.log(that.redList.length)
    //   if (that.page < that.redList.length - 1) {
    //     ++that.page
    //     let currentpage = that.page
    //     that.redShowList[currentpage] = that.redList[currentpage]
    //     that.is_end = false
    //     that.is_load = false
    //     //   that.setData({
    //     //     ['redShowList[' + currentpage + ']']: that.redList[currentpage],
    //     //     is_end: false,
    //     //     is_load: true
    //     //   })
    //     console.log(that.redList[currentpage].length)
    //     console.log(that.limit)
    //     if (that.redList[currentpage].length < that.limit || currentpage == that.redList.length) {
    //       that.is_end = true
    //       that.is_load = true
    //       that.hasData = true
    //       // that.setData({
    //       //   is_load: false,
    //       //   hasData: true,
    //       //   is_end: true
    //       // })
    //     }
    //   } else {
    //     that.is_end = true
    //     that.is_load = true
    //     that.hasData = true
    //     //   that.setData({
    //     //     is_load: false,
    //     //     hasData: true,
    //     //     is_end: true
    //     //   })
    //   }
    //   console.log(this.redShowList)
    // }
  },
  activated() {
    console.log(window.localStorage.getItem('backDetail'))
    if (window.localStorage.getItem('backDetail') == 'false' || window.localStorage.getItem('backDetail') == false) {
      console.log(this.$route.query)
      this.activity_id = this.$route.query.id
      this.redShowList = []
      this.isMember = this.$store.state.home.is_member
      this.isShare = this.$store.state.home.is_share
      Indicator.open('加载中...')
      this.redShowList = []
      this.redList = []
      this.page = 0
      this.is_load = true
      this.getList()
    } else {
      window.localStorage.setItem('backDetail', false)
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
.sale_height {
    height: 0.9rem;
}
.activity .activity_banner{
  width: 750/100rem;
}
.activity .activity_banner img {
  width: 7.5rem;
  min-height:500/100rem;
  display: block;
}

.activity .activity_content {
  font-size: 24/100rem;
  color: #888;
  padding: 20/100rem;
  background: #fff;
  margin-bottom: 10/100rem;
  line-height: 2;
  text-indent: 43/100rem;
  position: relative;
}
.activity .overflow_text{
  /* padding-bottom: 46/100rem; */
  min-height: 160/100rem;
}
.activity .activity_content .open_icon{
  position: absolute;
  left: 49%;
  transform: translateX(-50%);
  bottom: 0;
  color: #333;
}
.activity .show_content{
  margin-bottom: 30/100rem;
}
.activity .hidden_content{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  /* height: 140/100rem; */
  /* transition: all 5s; */
}
.open_icon icon{
  font-size:24/100rem;
  margin-left:-35/100rem;
}
.red_body {
  height: 100%;
}

.red_list {
  overflow: hidden;
  padding: 0 20/100rem;
  background: #fff;
  padding-bottom: 24/100rem;
}

.red_list_null {
  text-align: center;
  font-size: 30/100rem;
  /* font-weight: bold; */
  padding: 70/100rem 0;
}
.red_list_null img{
  display: inline-block;
  width: 750/100rem;
  height: 357/100rem;
}

.red_list .chose_date {
  color: #686868;
  font-size: 28/100rem;
  margin-left: 26/100rem;
  font-family: 'DIN';
}

/* 订单商品信息 */
.res_list_block{
  width: 100%;
  overflow: hidden;
}
.red_list .red_pro {
  /* width: 346/100rem;
  background: #fff;
  text-align: center;
  float: left;
  margin-bottom: 24/100rem; */
  width: 346/100rem;
  float: left;
  background: #fff;
  /* margin-bottom: 24/100rem; */
  margin-top: 24/100rem;
  position: relative;
  min-height: 506/100rem;
}

.red_list .red_pro:nth-child(odd) {
  float: left;
}

.red_list .red_pro:nth-child(even) {
  float: right;
}

/* .red_pro .pro_img {
  float: left;
  margin-left: 18/100rem;
  margin-right: 30/100rem;
  position: relative;
} */
.pro_img{
  width: 3.46rem;
  height: 3.46rem;
}
.pro_img img {
  width: 3.46rem;
  height: 3.46rem;
}

.red_pro .pro_info {
  width: 100%;
}

.pro_info .pro_title {
  font-size: 26/100rem;
  color: #333;
  margin-top: 10/100rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  height: 70/100rem;
  padding: 0 10/100rem;
}

.pro_info .pro_title  img {
  width: 0.68rem;
  height: 0.24rem;
}

.pro_title  .pro_level {
  width: 68/100rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 24/100rem;
}

.pro_title  .pro_level span {
  font-size: 16/100rem;
  color: #fefefe;
  position: absolute;
  left: 46%;
  top: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}

.pro_level .iconfont {
  color: #ff4e79;
  display: inline-flex;
}

.pro_level span {
  color: #fff;
  font-size: 22/100rem;
}

.pro_info .pro_spec {
  /* padding: 0 26/100rem; */
  text-align: left;
  /* padding-bottom: 10/100rem; */
  margin-top: 10/100rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pro_spec .pro_price {
  font-family: 'DIN';
  width: 100%;
  padding: 10/100rem;
  /* display: flex;
  align-items: center; */
}

.pro_price .peo_nowprice {
  color: #ff4e79;
  font-size: 32/100rem;
  font-weight: bold;
}

.pro_price .pro_integral {
  font-size: 32/100rem;
  font-weight: bold;
  color: #ff4e79;
  /* font-weight: bold; *//* margin-left: 8/100rem; */
}

.pro_price .pro_inter_img {
  display: inline-flex;
  align-items: flex-end;
  /* margin-left: 9/100rem; *//* margin-right: 30/100rem; */
}

.pro_price .pro_inter_img .iconfont {
  font-size: 32/100rem;
  font-weight: bold;
  color: #ff4e79;
  display: inline-flex;
}

.pro_price .pro_orig {
  font-size: 24/100rem;
  color: #888;
}

.pro_price .pro_bg {
  background: #ff4e79;
  color: #fff;
  border-radius: 8/100rem;
  text-align: center;
  font-size: 20/100rem;
  margin-right: 10/100rem;
  /* width: 100/100rem; */
  padding: 0 8/100rem;
}

.pro_price .line {
  text-decoration: line-through;
  /* margin-left: 14/100rem; */
}

.pro_price .pro_count {
  font-size: 23/100rem;
  color: #888;
}

.pro_spec .pro_btn {
  margin-right: 4/100rem;
  display: flex;
  border-radius: 6/100rem;
}

.pro_other {
  display: flex;
  justify-content: space-between;
  font-size: 23/100rem;
  color: #999;
  padding: 0 26/100rem;
  padding-bottom: 10/100rem;
}

.pro_btn button {
  width: 170/100rem;
  height: 52/100rem;
  background: #ff4e79;
  color: #fff;
  font-size: 26/100rem;
  padding: 0/100rem 20/100rem;
  line-height: 52/100rem;
  border-radius: 50/100rem;
}

.pro_btn button::after {
  border: none;
}

.order-red {
  height: 84/100rem;
  line-height: 84/100rem;
  /* background: #fff; */
  text-align: center;
  background: #f2f2f2;
}

.order-red span {
  font-size: 23.97/100rem;
  color: #bebebe;
}
  .more_load {
    display: flex;
    justify-content: center;
  }

  .list_bottom {
    height: 84/100rem;
    line-height: 84/100rem;
    text-align: center;
    background: #f2f2f2;
    font-size: 23.97/100rem;
    color: #bebebe;
  }

  /* 空白的块，解决底部导航占领高度 */

  .null_height {
    height: 100/100rem;
    background: #f2f2f2;
  }
</style>
