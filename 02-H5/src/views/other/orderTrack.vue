<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop="goTop"></return-top>
    <div style="height:0.9rem" id="track"></div>
    <div class="orderTrack" v-if="isShow">
      <div class="o_t_body">
        <div class="order_info">
          <div>
            <!-- 运单号： -->
            运单号：
            <span>{{orderNo}}</span>
          </div>
          <div>
            国内承运人：
            <span>{{name}}</span>
          </div>
        </div>
        <div class="track_infos" v-if="list.length>0">
          <div class="track_infos_info" v-for="(item,index) in list" :key="index">
            <div class="track_time">
              <span>{{item.AcceptTime}}</span>
            </div>
            <div class="track_status">
              <!-- <image src='{{imgPath}}com/s_top1.png' class='t_states'></image> -->
              <!-- <div class='track_border'></div> -->
              <img :src="imgPath+'com/s_top1.png'" class="t_states" />
              <div class="track_location">
                <span>{{item.AcceptStation}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="track_infos_null" v-else>
          <span>对不起，暂无物流信息</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import { InfiniteScroll, Indicator, Button, Lazyload, Toast } from 'mint-ui'
import { getOrderTrack } from '@/api/index'
export default {
  name: 'OrderTrack',
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
      h_title: '物流详情',
      list: [],
      name: '',
      orderNo: '',
      imgPath: process.env.FilE_URL,
      isShow: false
    }
  },
  mounted() {
    Indicator.open('加载中...')
    console.log(this.$route.query)
    let options = this.$route.query
    this.orderNo = options.orderId
    this.getDetail()
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('track').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    getDetail() {
      var that = this
      getOrderTrack(this.orderNo).then(res => {
        Indicator.close()
        that.isShow = true
        if (res.isSuccess) {
          that.orderNo = res.LogisticCode
          that.list = res.Traces
          that.name = res.ShipperName
        } else {
          that.list = []
          that.orderNo = res.LogisticCode
          that.name = res.ShipperName
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "~styles/index.less";
@import "~styles/variable.less";
.orderTrack {
  /* padding: 0 26/100rem; */
  /* font-family: SimHei; */
  background: #f2f2f2;
  overflow-x: hidden;
}

.o_t_body {
  /* background: #fff; */
}

.order_info {
  background: #fff;
  padding: 44/100rem 26/100rem;
}

.order_info div {
  color: #999;
  font-size: 28/100rem;
  margin: 18/100rem 0;
}

.order_info div span {
  color: #444;
  /* font-weight: bold; */
}
.track_infos_null{
  background: #fff;
  margin-top: 20/100rem;
  padding: 44/100rem 26/100rem;
  font-size: 25/100rem;
  color: #999;
}
.track_infos {
  background: #fff;
  margin-top: 20/100rem;
  padding: 92/100rem 26/100rem;
  /* display: flex;
  align-items: flex-start; */
}

.track_infos .track_infos_info {
  min-height: 112/100rem;
  width: 702/100rem;
  display: flex;
  align-items: flex-start;
}

.track_infos_info .track_time {
  /* width: 80/100rem; */
  width: 124/100rem;
  font-size: 18/100rem;
  color: #757575;
  font-weight: bold;
  /* font-family: Arial; */
  float: left;
  text-align: right;
}

.track_infos_info .track_time .track_date {
  width: 80/100rem;
  font-family: "DIN";
  display: block;
}

.track_infos_info .track_time .big_date {
  font-size: 28/100rem;
}

.track_infos_info .track_status {
  width: 5.4rem;
  color: #ccc;
  float: left;
  min-height: 1rem;
  position: relative;
  border-left: 0.04rem solid;
  margin-left: 0.3rem;
  padding-left: 0.3rem;
  padding-bottom: 0.3rem;
}
.track_infos_info .track_status .t_states {
  width: 0.24rem;
  height: 0.24rem;
}

.track_status .track_border {
  width: 4/100rem;
  height: 112/100rem;
  background: #ccc;
  margin: 0 auto;
}

.track_status img {
  position: absolute;
  left: -0.01rem;
  top: -0.04rem;
  transform: translateX(-50%);
}

.track_status .t_states {
  width: 24/100rem;
  height: 24/100rem;
}

.track_status .t_active {
  width: 38/100rem;
  height: 38/100rem;
}

.track_status .t_hide {
  display: none;
}

.track_status .t_show {
  display: block;
}

.track_infos_info:last-child .track_border {
  display: none;
}
.track_infos_info:last-child .track_status{
  border-left: none;
}
.track_infos_info .track_location {
  // width: 490/100rem;
  font-size: 25/100rem;
  color: #858585;
  float: left;
}

.track_location .track_oprea {
  font-size: 28/100rem;
  display: block;
}
</style>
