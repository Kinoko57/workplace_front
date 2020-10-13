<template>
  <div>
    <common-header :h_title="h_title" :showback="false" :bgcolor='head_color'></common-header>
    <div class='pro_type'>
      <div id='pro_type' style='height:0.9rem'></div>
      <return-top @returnTop='goTop'></return-top>
      <div class="pro_wrap" v-if="typeList">
        <div class='pro_body'>
          <div class="search-wrap">
            <div class="search-container" @click='searchHis'>
              <img class="search-icon" :src="imgPath+'kind/search.png'" />
              <span class="search-text">搜索你喜欢的商品</span>
            </div>
          </div>
          <div class='pro_navlist'>
            <div v-for='(item,index) in NameList' :key='index' class="pro_nav_f" :class="nowchose==item.id ?'active':''"
              @click='choseNav(index,item.id)'>
              <div class="line" v-if="nowchose == item.id"></div>
              <span :class="nowchose==item.id?'text_active':''">{{item.name}}</span>
            </div>
            <div style="height:0.98rem"></div>
          </div>
          <div class='pro_nav_more'>
            <img :src='subList.bannerUrl' class="banner-image"
              @click="handleBanner(subList.hrefId,subList.hrefType,subList.hrefUrl)" id='pro_typeList' />
            <div class='pro_block' v-for='(item,index) in subList.childList' :key='index'>
              <div class='pro_typeName'>
                <span>{{item.name}}</span>
              </div>
              <div class='pro_typeList'>
                <div class='pro_type_blcok' v-for='(item,index) in item._child' :key='index'
                  @click='handleKindClick(item.name, item.id)'>
                  <img :src='item.icon' class="kind-image">
                  <span>{{item.name}}</span>
                </div>
              </div>
            </div>
            <div style="height:0.98rem"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getTypeListmenu
} from '@/api/share'
import {
  getCarList,
  getNewsRead
} from '@/api/index'
import commonHeader from 'common/common-header'
import returnTop from '@/components/return-top'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import {
  Indicator

} from 'mint-ui'
export default {
  name: 'TypeList',
  components: {
    commonHeader,
    returnTop,
    Indicator
  },
  data() {
    return {
      h_title: '商品分类',
      head_color: {
        color: '#333',
        background: '#FAFAFC'
      },
      typeList: false,
      imgPath: process.env.FilE_URL,
      nowchose: 1,
      // is_iphonex: app.globalData.phoneType,
      navNtn: 2,
      navNtnTab: 'type',
      isMember: false,
      newNews: false,
      isShare: 0,
      NameList: [],
      subList: {
        bannerUrl: '',
        childList: []
      }
    }
  },
  mounted() {
    Indicator.open('加载中...')
    this.getKindList()
    var storage = window.localStorage
    if (storage.getItem('isLogin') === true || storage.getItem('isLogin') === 'true') {
      this.isShare = this.$store.state.home.is_share
      this.isMember = this.$store.state.home.is_member
      this.getAlways()
    }
  },
  methods: {
    ...mapMutations({
      setCarnum: 'SET_CARNUM',
      setNews: 'SET_NEWS'
    }),
    goTop() {
      console.log('回到顶部')
      document.getElementById('pro_type').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    choseNav(index, key) {
      let NameList = this.NameList
      let subList = {
        bannerUrl: NameList[index].img,
        hrefType: NameList[index].href_type,
        hrefId: NameList[index].href_id,
        hrefUrl: NameList[index].href_url,
        childList: NameList[index]._child
      }
      this.nowchose = key
      this.subList = subList
      document.getElementById('pro_typeList').scrollIntoView(false)
      // document.getElementById('pro_typeList').scrollIntoView({
      //   block: 'start',
      //   behavior: 'smooth'
      // })
    },
    handleBanner(hrefId, hrefType, hrefUrl) {
      let type = hrefType
      if (type === '1') {

      } else if (type === '2') {
        this.$router.togo({
          path: '/proDetail?type=normal&id=' + hrefId
        })
      } else if (type === '3') {
        console.log(hrefUrl, '11111')
        var url = hrefUrl.split('/')
        var linkUrl = '/' + url[url.length - 1]
        console.log(url, '222')
        this.$router.togo({
          path: linkUrl
        })
      }
    },
    handleKindClick(name, id) {
      window.localStorage.setItem('backDetail', false)
      this.$router.togo({
        path: '/proList?type=key&price=asc&value=' + name + '&virtual_id=' + id
      })
    },
    getKindList() {
      let that = this
      Indicator.open('加载中...')
      getTypeListmenu().then(res => {
        if (res.isSuccess) {
          Indicator.close()
          that.typeList = true
          let subList = {
            bannerUrl: res.data[0].img,
            hrefType: res.data[0].href_type,
            hrefId: res.data[0].href_id,
            hrefUrl: res.data[0].href_url,
            childList: res.data[0]._child
          }
          that.NameList = res.data
          that.subList = subList
          that.nowchose = res.data[0].id
        }
      })
    },
    searchHis: function () {
      this.$router.togo({
        path: '/search'
      })
    },
    getAlways: function () {
      var that = this
      // 查询购物车数量
      Indicator.open('加载中...')
      getCarList().then(res => {
        if (res.isSuccess) {
          Indicator.close()
          that.total_amout = res.data.rows_total
          that.setCarnum(res.data.rows_total)
          // if (wx.setTabBarBadge) {
          //   wx.setTabBarBadge({
          //     index: 3,
          //     text: res.data.rows_total
          //   })
          // }
          // if (res.data.rows_total == 0) {
          //   if (wx.removeTabBarBadge) {
          //     wx.removeTabBarBadge({
          //       index: 3
          //     })
          //   }
          // }
        }
      })
      // 查询是否有新消息
      getNewsRead().then(res => {
        if (res.isSuccess) {
          // 判断是否签到
          if (res.data.is_sign === 1) {
            that.isSign = true
          } else {
            that.isSign = false
          }
          // 判断是否生日
          if (res.data.is_birthday === 1) {
            that.is_birthday = true
            that.birthday_img = res.data.birthday_img
          } else {
            that.birthday_img = ''
          }
          // 判断是否有新消息
          if (res.data.num > 0) {
            that.newNews = true
            that.news_num = res.data.num
            that.setNews(true)
            // if (wx.showTabBarRedDot) {
            //   wx.showTabBarRedDot({
            //     index: 4
            //   })
            // }
          } else {
            that.newNews = false
            that.news_num = 0
            that.setNews(false)
            // if (wx.hideTabBarRedDot) {
            //   wx.hideTabBarRedDot({
            //     index: 4
            //   })
            // }
          }
          that.newNews = that.newNews
          that.news_num = that.news_num
          that.isSign = that.isSign
          that.is_birthday = that.is_birthday
          that.birthday_img = that.birthday_img
        }
      })
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
<style lang="less" scoped>
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .pro_type {
    font-family: SimHei;
    background: #FAFAFC;
    overflow-x: hidden;
  }

  .pro_type .search-wrap {
    height: 68/100rem;
    padding: 0 40/100rem;
    margin-bottom: 30/100rem;
    background: #FAFAFC;
  }

  .search-wrap .search-container {
    width: 100%;
    height: 100%;
    border-radius: 34/100rem;
    background: rgba(202, 204, 218, 0.25);
  }

  .search-wrap .search-icon {
    float: left;
    width: 36/100rem;
    height: 36/100rem;
    margin: 16/100rem 12/100rem 0 30/100rem;
  }

  .search-wrap .search-text {
    float: left;
    font-size: 24/100rem;
    color: rgba(0, 0, 0, 0.4);
    line-height: 68/100rem;
  }

  .pro_wrap {
    height: calc(100vh - 0.98rem);
    // overflow: hidden;
    box-sizing: border-box;
    // padding-bottom:98/100rem;
  }

  .pro_body {
    height: calc(100vh - 0.98rem);
    // overflow-y: scroll
  }

  .pro_body .pro_navlist {
    width: 162/100rem;
    background: #fff;
    float: left;
    height: calc(100vh - 1.96rem);
    overflow-y: scroll
  }

  .pro_navlist .pro_nav_f {
    position: relative;
    height: 100/100rem;
    line-height: 100/100rem;
    text-align: center;
  }

  .pro_nav_f.active {
    background: #FAFAFC;
  }

  .pro_nav_f.active .line {
    position: absolute;
    left: 0;
    top: 24/100rem;
    height: 52/100rem;
    width: 6/100rem;
    border-radius: 4/100rem;
    background: linear-gradient(180deg, rgba(255, 78, 121, 0.2) 0%, rgba(255, 78, 121, 1) 100%);
  }

  .pro_nav_f .chose_nav {
    width: 18/100rem;
    height: 40/100rem;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .pro_nav_f span {
    font-size: 28/100rem;
    color: rgba(0, 0, 0, 1);
    font-weight: 400;
    text-align: left;
  }

  .pro_nav_f .text_active {
    color: #FF4E79;
  }

  .pro_nav_more {
    width: 588/100rem;
    float: left;
    padding: 0 40/100rem 0 28/100rem;
    background: #FAFAFC;
    height: calc(100vh - 1.96rem);
    box-sizing: border-box;
    overflow-y: scroll
  }

  .pro_nav_more .banner-image {
    display: block;
    width: 520/100rem;
    height: 140/100rem;
    margin: 24/100rem 0 30/100rem 0;
    border-radius: 8/100rem;
  }

  .pro_block {
    margin-bottom: 40/100rem;
  }

  .pro_block .pro_typeName {
    font-size: 28/100rem;
    margin-bottom: 20/100rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 40/100rem;
  }

  .pro_block .pro_typeList {
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    border-radius: 24/100rem;
    padding: 34/100rem 10/100rem 4/100rem 10/100rem;
  }

  .pro_typeList .pro_type_blcok {
    text-align: center;
    width: 33.333%;
    margin-bottom: 30/100rem;
  }

  .pro_type_blcok .kind-image {
    display: block;
    width: 140/100rem;
    height: 140/100rem;
    padding: 0;
    margin: 0 auto;
  }

  .pro_type_blcok span {
    display: block;
    color: rgba(0, 0, 0, 0.5);
    font-size: 24/100rem;
    line-height: 34/100rem;
    margin-top: 8/100rem;
    text-align: center
  }

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    // color: transparent;
  }

</style>
