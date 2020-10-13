<template>
    <div>
        <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header>
        <div v-if="showNewpeople">
            <div class='newPeople' :style='{background:bg_color}'>
                <return-top @returnTop='goTop'></return-top>
                <div id='newPeople' style='height:0.9rem'></div>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="is_load" infinite-scroll-distance="30" class="scroll">
                    <div class='newPeopel_top' :style='{background:bg_color}'>
                        <div class='newhome'>
                        <img :src="shareInfo.image"/>
                        <span>{{shareInfo.nickname}}</span>
                        </div>
                        <div class='newtitle'>
                        <div class='newtitle_bg'>
                            <span>Hi,{{nicName}},{{newtitle}}</span>
                        </div>
                        <span class='sanjia'></span>
                        </div>
                    </div>
                    <div class='newPeople_center'>
                        <img :src='gift_bg' class='giftbg' mode='widthFix'/>
                    </div>
                    <div class='newpeople_list' :style='{background:bg_color}'>
                        <div class='newpeople_list_content'  v-if="hasData">
                        <div class='new_listInfo'>
                            <div class="new_pro_block" v-for="(listblock,index) in newShowList" :key="index">
                            <div class='new_pro' v-for="(item,index) in listblock" :key="index" @click="goNewDetail('newpeople',item.goods_id)">
                                <div class='pro_img'>
                                    <img :src='item.img'/>
                                <!-- <div class='new_dz'>
                                    新人专享
                                </div> -->
                                </div>
                                <div>
                                    <span class='new_span'>{{item.name}}</span>
                                    <span class='new_price'>￥{{item.sale}}<span style="color:#ff4e79;font-size:0.23rem" v-if="isMember"> / 赚{{item.back_rebate}}</span></span>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div class="mar_bottom">
                            <div class='more_load' v-if='!is_load'>
                                <mt-spinner type="fading-circle"></mt-spinner>
                            </div>
                            <div class='s_fans_bottom' v-if='!hasData'>
                                <img :src="imgPath+'pro/null.png'" mode='widthFix'/>
                            </div>
                            <div class='order-foot' v-if="hasData&&is_end">
                                <span>—————— 我是有底线的 ——————</span>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="null_new_height"></div> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import commonHeader from 'common/common-header'
import returnTop from '@/components/return-top'
import {
  Indicator,
  InfiniteScroll
} from 'mint-ui'
import {
  getNewList, getInviteInfo
} from '@/api/share'
export default {
  name: 'NewPeople',
  data() {
    return {
      h_title: '新人特惠',
      head_color: {
        background: '#ffffff',
        color: '#000'
      },
      isShare: 0,
      isMember: false,
      showNewpeople: false,
      imgPath: process.env.FilE_URL,
      // is_iphonex: app.globalData.phoneType,
      is_load: false,
      total: 0,
      hasData: true,
      is_end: false,
      isSign: true,
      allowScorll: true,
      topNum: 0,
      bg_color: '#740c0b',
      height: '',
      page: 0,
      limit: 10,
      shareInfo: {nickname: '', image: ''},
      nicName: '',
      gift_bg: '',
      newtitle: '',
      // is_iphonex: app.globalData.phoneType,
      homesrc: process.env.FilE_URL + 'pro/member_title.png',
      titlesrc: process.env.FilE_URL + 'pro/member_title.png',
      newList: [],
      newShowList: []
    }
  },
  components: {
    Indicator,
    InfiniteScroll,
    commonHeader,
    returnTop
  },
  mounted() {
    console.log(document.getElementById('newPeople'))
    if (document.getElementById('newPeople') != null) {
      document.getElementById('newPeople').scrollIntoView(false)
    }
    const that = this
    Indicator.open('加载中...')
    this.nicName = this.$store.state.home.userInfo.nickname
    // 判断本地缓存有没有邀请人信息，没有请求接口获取
    let storage = window.localStorage
    console.log(that.$store.state.home.userInfo.inviter)
    if (that.$store.state.home.userInfo.inviter === -1 || that.$store.state.home.userInfo.inviter === '-1') {
      // 直邀用户，不需要上级
      let info = { image: process.env.FilE_URL + 'member/new_people_static.png', nickname: '公主购' }
      storage.setItem('share', JSON.stringify(info))
      that.shareInfo = info
      that.getList()
    } else if (that.$store.state.home.userInfo.inviter !== 0 && that.$store.state.home.userInfo.inviter !== '0') {
      // 请求接口返回邀请人的信息,个人姓名，我需要传invite_id，code,重新保存邀请人信息。
      // var obj = {
      //   uid: that.$store.state.home.userInfo.inviter
      // }
      getInviteInfo().then(res => {
        if (res.isSuccess === true || res.isSuccess === 'true') {
          that.shareInfo = res.data
          storage.setItem('share', JSON.stringify(res.data.share))
          that.getList()
        }
      })
    } else {
      // 测试，不需要上级
      let info = { image: process.env.FilE_URL + 'member/new_people_static.png', nickname: '公主购' }
      that.shareInfo = info
      storage.setItem('share', JSON.stringify(info))
      that.getList()
    }
    this.isMember = this.$store.state.home.is_member
    this.isShare = this.$store.state.home.is_share
    this.newNews = this.$store.state.home.news
    this.total_amout = this.$store.state.home.carNum
  },
  methods: {
    goNewDetail(type, id) {
      this.$router.togo({
        path: '/newPeopleDetail?type=' + type + '&id=' + id
      })
    },
    // 回到顶部
    goTop() {
      console.log('回到顶部')
      document.getElementById('newPeople').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    // 获取新人列表信息
    getList: function() {
      const that = this
      Indicator.open('加载中...')
      getNewList().then(res => {
        if (res.isSuccess === true || res.isSuccess === 'true') {
          Indicator.close()
          that.newList = res.data.goods
          if (res.data.goods.length > 0) {
            that.newShowList[that.page] = that.newList[that.page]
            that.is_load = false
            that.hasData = true
            that.is_end = false
            that.limit = res.data.size
            that.gift_bg = res.data.list_img
            that.newtitle = res.data.list_content
            that.showNewpeople = true
            that.bg_color = res.data.bgcolor
            if (res.data.goods[that.page].length < that.limit || res.data.goods.length === 1) {
              that.is_load = true
              that.hasData = true
              that.is_end = true
              //   that.isShow = true
              console.log(that.newShowList, '111')
            }
          } else {
            this.hasData = false
            that.is_load = true
          }
        }
      })
    },
    // 上拉加载更多
    loadMore: function () {
      var that = this
      console.log('加载下一页')
      this.is_load = true
      console.log(that.page)
      if (that.page < that.newList.length - 1) {
        ++that.page
        let currentpage = that.page
        that.newShowList[currentpage] = that.newList[currentpage]
        that.is_end = false
        that.is_load = false
        console.log(that.newShowList, 'more111')
        if (that.newList[currentpage].length < that.limit || that.page === that.newList.length - 1) {
          that.is_end = true
          that.is_load = true
          that.hasData = true
        }
      } else {
        that.is_end = true
        that.is_load = true
        that.hasData = true
      }
      console.log(this.newList)
    }
  },
  activated() {
    console.log(window.localStorage.getItem('backDetail'))
    if (window.localStorage.getItem('backDetail') == 'false' || window.localStorage.getItem('backDetail') == false) {
      console.log(document.getElementById('newPeople'))
      if (document.getElementById('newPeople') != null) {
        document.getElementById('newPeople').scrollIntoView(false)
      }
      const that = this
      Indicator.open('加载中...')
      this.nicName = this.$store.state.home.userInfo.nickname
      // 判断本地缓存有没有邀请人信息，没有请求接口获取
      let storage = window.localStorage
      console.log(that.$store.state.home.userInfo.inviter)
      if (that.$store.state.home.userInfo.inviter === -1 || that.$store.state.home.userInfo.inviter === '-1') {
      // 直邀用户，不需要上级
        let info = { image: process.env.FilE_URL + 'member/new_people_static.png', nickname: '公主购' }
        storage.setItem('share', JSON.stringify(info))
        that.shareInfo = info
        that.getList()
      } else if (that.$store.state.home.userInfo.inviter !== 0 && that.$store.state.home.userInfo.inviter !== '0') {
      // 请求接口返回邀请人的信息,个人姓名，我需要传invite_id，code,重新保存邀请人信息。
      // var obj = {
      //   uid: that.$store.state.home.userInfo.inviter
      // }
        getInviteInfo().then(res => {
          if (res.isSuccess === true || res.isSuccess === 'true') {
            that.shareInfo = res.data
            storage.setItem('share', JSON.stringify(res.data.share))
            that.getList()
          }
        })
      } else {
      // 测试，不需要上级
        let info = { image: process.env.FilE_URL + 'member/new_people_static.png', nickname: '公主购' }
        that.shareInfo = info
        storage.setItem('share', JSON.stringify(info))
        that.getList()
      }
      this.isMember = this.$store.state.home.is_member
      this.isShare = this.$store.state.home.is_share
      this.newNews = this.$store.state.home.news
      this.total_amout = this.$store.state.home.carNum
    //       this.is_iphonex= app.globalData.phoneType
    } else {
      window.localStorage.setItem('backDetail', false)
    }
  }
}
</script>
<style lang="less" scoped>
    @import "~styles/index.less";
    @import "~styles/variable.less";
.fixed_top {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}
.i_header {
  padding: 10/100rem 26/100rem;
  /* height: 90/100rem; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* position: absolute; */
  background: #f9f9f9;
  /* border-bottom: 2/100rem solid #e0e0e0; *//* top: 0; */
  width: 93%;
  z-index: 50;
}
.i_header .serach {
  width: 100%;
  /* width: 580/100rem; */
  height: 60/100rem;
  line-height: 60/100rem;
  border-radius: 50/100rem;
  background: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 26/100rem;
}
.i_header .serach icon {
  color: #333;
  font-size: 40/100rem;
  float: left;
  display: flex;
}
.i_header .serach .close {
  color: #7c7c7c;
  font-size: 30/100rem;
  font-weight: bold;
  float: right;
}
.i_header .serach input {
  font-size: 24/100rem;
  /* width: 500/100rem; */
  width: 90%;
  height: 60/100rem;
  display: inline-flex;
  padding-left: 16/100rem;
}
/* .people_bg{
  width:100%;
  height: 100%;
  position: fixed;
} */
.newPeopel_top{
  /* position: relative; */
  display: flex;
  align-items: center;
  justify-content:flex-start;
  height:163/100rem;
  background:#fa7873;
  border-top:1px solid #ececec;
  z-index: 2;
}
.newPeopel_top .newhome{
   /* width:140/100rem; */
   text-align: center;
   width: 120/100rem;
}
.newPeopel_top .newtitle{
  /* padding-right: 35/100rem; */
  position: relative;
  left:10/100rem;
  max-width: 560/100rem;
  /* height: 128/100rem; */
}
.newtitle_bg{
  position: relative;
  left: 0;
  background: #fff;
  padding: 10/100rem 15/100rem 10/100rem 10/100rem;
  border-radius: 10/100rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.newPeopel_top .newhome img{
  display: block;
  width:64/100rem;
  height:64/100rem;
  margin: 0 auto;
  border-radius: 50%;
}
.newPeopel_top .newhome span{
  font-size: 30/100rem;
  font-family: '黑体';
  color: #fff;
  display: block;
  width: 120/100rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align:center;
}
.newPeopel_top .newtitle .newtitle_bg text:nth-child(1){
  display: block;
  font-size: 28/100rem;
  line-height: 48/100rem;
  color:#333333;
}
.sanjia{
  position: absolute;
  border-left:0/100rem solid transparent;
  border-right:18/100rem solid transparent;
  border-top:22/100rem solid #fff;
  bottom:-14/100rem;
  left: 0/100rem;
}
.newPeople{
  position: relative;
  background:#fa7873;
  height: 100%;
}
.newPeople_bottom{
  /* margin-bottom: 178/100rem; */
}
.newPeople_center{
 width: 100%;
}

.newPeople_center .giftbg{
 width: 100%;
  position:relative;
}
.newpeople_list{
  /* padding-top:42/100rem; */
  position: relative;
  top:0;
  background: #fa7873;
}

.newpeople_list_content{
  position: relative;
  bottom: 0;
  margin: 0 15/100rem;
  background: #fff;
  height: 100%;
  padding: 40/100rem 15/100rem;
}
.new_listInfo{
    overflow: hidden;
}
.change{
  /* position: relative; */
  margin:35/100rem 0 60/100rem 0;
  text-align: center;
  z-index: 5;
}
.change_bottom{
  margin-bottom:148/100rem;
}
.change img{
   width: 264/100rem;
  height: 54/100rem;
}
.new_pro {
  position: relative;
  width: 340/100rem;
  margin-bottom: 28/100rem;
  height:482/100rem;
}

.new_pro:nth-child(odd) {
  float: left;
}
.new_pro:nth-child(even) {
  float: right;
}
.new_pro .pro_img{
  width: 340/100rem;
  height: 340/100rem;
  position: relative;
}
.new_pro .pro_img img{
  position: relative;
  width: 340/100rem;
  height: 340/100rem;
  border-radius: 10/100rem;
}
.new_pro .pro_img .new_dz{
  position: absolute;
  right:0;
  bottom: 0;
  text-align: center;
  z-index: 3;
  width:164/100rem;
  height:36/100rem;
  background:#fd8586;
  border-radius: 10/100rem 0 0 0;
  line-height: 36/100rem;
  font-size: 21/100rem;
  color:#ffffff;
}
.new_pro .new_span{
  padding-left:10/100rem;
  font-size: 28/100rem;
  line-height: 46/100rem;
  height: 92/100rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient: vertical;
  /* height: 92/100rem; */
}
.new_pro .new_price{
 color:#ff4e79;
 font-size: 30/100rem;
 font-weight: bold;
 line-height: 42/100rem;
}
.null_new_height{
  height: 68/100rem;
}
.null_height_new_iphonex{
  height: 136/100rem;
}
.mar_bottom{
  margin-bottom: 20/100rem;
//   height:200/100rem;
}
/deep/.more_load{
   border:none;
//    font-size:20/100rem;
   text-align: center;
   margin-top: 0.05rem
}
.s_fans_bottom {
  text-align: center;
  font-size: 30/100rem;
  /* font-weight: bold; */
  padding-top:100/100rem;
}
.s_fans_bottom img{
  display: inline-block;
  width: 246/100rem;
  height: 368/100rem;
}
.order-foot {
  height:84/100rem;
  line-height:84/100rem;
  text-align: center;
  font-size: 24/100rem;
  color: #bebebe;
  margin-bottom: 10/100rem;
}
.order-foot span {
  display: inline-block;
  font-size: 23.97/100rem;
  color: #bebebe;
}
</style>
