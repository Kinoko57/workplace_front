<template>
  <!--pages/giftPackage/giftPackage.wxml-->
<div v-if="showGift">
  <common-header :h_title="h_title" :showback="true" :bgcolor="head_color"></common-header>
  <div style='height:0.9rem' id="card"></div>
  <div class='g_package'>
    <div>
      <div class='g_package_t'>
        <img :src='gift_bg'/>
      </div>
      <div class="g_package_title">
        <span>礼包专区</span>
      </div>
      <div class="g_package_tip"></div>
      <div class='g_package_area'>
        <div class='g_package_area_con'>
          <div v-for="(item, index) in giftArea" :key="index" class='g_package_area_con_wraper'>
            <!-- data-link='../newPeopleDetail/newPeopleDetail?type=normal&id={{item.goods_id}}' -->
            <div class='listcontent' @click="goNow('normal', item.goods_id)">
              <img :src='item.img' class='wraper_l'/>
              <div class='wraper_r'>
                  <div class='wraper_r_top'>
                    <div class='wraper_r_top_title'>
                      <span>{{item.name}}</span>
                    </div>
                  </div>
                  <div class='wraper_r_bot'>
                    <div class='wraper_r_bot_l'>
                      <div class="actual-price">
                        <span>￥{{item.price_sell}}</span>
                      </div>
                      <div class="original-price">
                        <span>市场价：￥{{item.price_market}}</span>
                      </div>
                    </div>
                    <!-- data-link='../newPeopleDetail/newPeopleDetail?type=normal&id={{item.goods_id}}' id='{{item.goods_id}}' -->
                    <div @click="goNow('normal', item.goods_id)" class='wraper_r_bot_r'><span>一键升级</span></div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='order-red'>
        <span>—————— 我是有底线的 ——————</span>
      </div>
      <!-- {{is_iphonex?'null_gift_iphonex':''}} -->
      <div class="null_gift"></div>
    </div>
  </div>
</div>
</template>

<script>
import {
  getGiftList
} from '@/api/member-new'
import commonHeader from 'common/common-header'
import {
  InfiniteScroll,
  Indicator,
  Search,
  Lazyload,
  Toast
} from 'mint-ui'
export default {
  name: 'GiftPackage',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Search,
    Lazyload,
    Toast
  },
  data() {
    return {
      head_color: {
        background: '#ffffff',
        color: '#000000'
      },
      h_title: '礼包专区',
      imgPath: process.env.FilE_URL,
      gift_bg: '',
      // is_iphonex: app.globalData.phoneType,
      hasData: true,
      is_end: false,
      is_load: true,
      isTop: true,
      height: '',
      topNum: 0,
      giftArea: [],
      uchoseList: [],
      giftList: [],
      limit: 10,
      page: 0,
      showGift: true
    }
  },
  mounted() {
    document.getElementById('card').scrollIntoView(false)
    // 自选专区
    this.getList()
  },
  methods: {
    // 出现回到顶部按钮
    // scroll(e) {
    //   if (e.detail.scrollTop >= 980) {
    //     this.isTop = false
    //   } else {
    //     this.isTop = true
    //   }
    // },
    // 马上领跳到详情页
    goNow(type, id) {
      this.$router.togo({
        path: '/newPeopleDetail?type=' + type + '&id=' + id
      })
    },
    // goIndex(e) {
    //   // wx.navigateTo({
    //   //   url: e.currentTarget.dataset.link,
    //   // })
    // },
    // 获取自选专区列表
    getList() {
      const that = this
      Indicator.open('加载中...')
      getGiftList().then(res => {
        if (res.isSuccess) {
          Indicator.close()
          console.log(res, 'getpacklist')
          that.giftList = res.data.direct
          that.giftArea = res.data.gift[0]
          that.showGift = true
          that.gift_bg = res.data.list_img
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
/* pages/giftPackage/giftPackage.wxss */
.g_package{
  width: 100%;
  background:#FAFAFC;
  height: calc(100% - 0.9rem);
}
.g_package .g_package_t img{
  width: 100%;
  // height: 376/100rem;
}
.g_package_title{
  position: relative;
  width: 100%;
  height: 92/100rem;
  line-height: 92/100rem;
  text-align: center;
  background: #ffffff;
}

.g_package_title:after{
  content: ' ';
  position: absolute;
  width:48/100rem;
  height:4/100rem;
  background:rgba(232,193,146,1);
  border-radius:2/100rem;
  left: 50%;
  margin-left: -24/100rem;
  top:76/100rem;
}

.g_package_title span{
  font-size:32/100rem;
  font-weight:500;
  color:rgba(0,0,0,0.85);
}

.g_package_tip{
  height: 72/100rem;
  width: 100%;
  background-image: url('http://share.gongzhugou.com/static/image/xcx_img/giftPackage/tip.png');
  background-size: cover;
}

/*礼包专区*/
.g_package_area{
  padding:28/100rem 40/100rem 0;
}

.g_package_area_con_wraper .listcontent{
  display: flex;
  width: 100%;
  height: 240/100rem;
  background: #fff;
  overflow: hidden;
  padding: 30/100rem;
  border-radius: 8/100rem;
  margin-bottom: 30/100rem;
  box-sizing: border-box;
  box-shadow:0px 2px 10px 0px rgba(202,204,218,0.25);
}
.g_package_area_con_wraper .listcontent .wraper_l{
  width: 180/100rem;
  height: 180/100rem;
}
.g_package_area_con_wraper .listcontent .wraper_r{
  position: relative;
  width: 430/100rem;
  padding-left: 20/100rem;
  box-sizing: border-box;
}

.wraper_r_top{
  margin-bottom: 48/100rem;
}

.wraper_r_top_title{
  font-size:28/100rem;
  font-weight:400;
  color:rgba(0,0,0,0.85);
  line-height:40/100rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actual-price{
  font-size:36/100rem;
  color:rgba(255,67,67,1);
  line-height:44/100rem;
  margin-bottom: 10/100rem;
}

.original-price{
  font-size:24/100rem;
  font-weight:300;
  color:rgba(0,0,0,0.5);
  line-height:34/100rem;
  text-decoration:line-through;
}

.wraper_r_bot_r{
  position: absolute;
  bottom: 0;
  right: 0;
  width:184/100rem;
  height:52/100rem;
  line-height: 52/100rem;
  background:linear-gradient(90deg,rgba(250,224,193,1) 0%,rgba(232,193,146,1) 100%);
  border-radius:26/100rem;
  text-align: center;
  font-size:28/100rem;
  font-weight:400;
  color:rgba(79,43,0,1);
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
</style>
