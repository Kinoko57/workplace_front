<template>
  <div>
    <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header>
    <div class="sales_order_bg" v-if="showSaleOrder">
      <return-top @returnTop='goTop'></return-top>
      <div style='height:0.9rem' id="sale_order_body"></div>
      <div class="sale_order_body">
        <ly-tab v-model="selectId" :items="orderType" :options="options" @change='choseOrder' class='order_type'>
        </ly-tab>
        <div style='height:0.9rem'></div>
        <div class="order_null" v-if="saleOrderList.length==0">
          <img :src="imgUrl" alt="" srcset="">
          <p v-if="isShowType=='1'">暂无商品佣金哦~</p>
          <p v-else-if="isShowType=='2'">暂无礼包佣金哦~</p>
          <p v-else-if="isShowType=='3'">暂无推广佣金哦~</p>
          <p v-else-if="isShowType=='4'">暂无平台奖励哦~</p>
          <p v-else>还没发现你有订单哦～</p>
        </div>
        <div class="order" v-else  v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30" infinite-scroll-immediate-check='autoOpen'>
          <div class="order_list">
            <div class="order_block" v-for="(blockitem,blockindex) of saleOrderList" :key="blockindex">
              <div class="order_head">
                <p class="order_user" v-if="isShowUid">
                  <span class="user_img">
                    <img :src="blockitem.buyer.image" alt="" v-if="blockitem.buyer!=null&&blockitem.buyer.image!=''&&blockitem.buyer.image!=null">
                    <img :src="avatarUrl" alt="" v-else>
                    <span class="user_name" v-if="blockitem.remark!=null&&blockitem.remark!=''">{{blockitem.remark[0].remark}}</span>
                    <span class="user_name" v-if="blockitem.buyer!=null&&blockitem.buyer.nickname!=''&&blockitem.buyer.nickname!=null&&(blockitem.remark==null||blockitem.remark=='')">{{blockitem.buyer.nickname}}</span>
                  </span>
                  <span class="user_tag" v-if="blockitem.status==2">全额退款</span>
                  <span class="user_tag" v-if="blockitem.status==3">降级返还</span>
                  <span class="user_tag" v-if="blockitem.status==4">部分退款</span>
                </p>
                <!-- <p class="order_title">
                  <span class="order_time">{{blockitem.paytime}}</span>
                  <span class="order_code">订单编号：{{blockitem.order_id}}</span>
                </p> -->
              </div>
              <div class="order_content" v-for="(blockOrder,index) in blockitem.order" :key="index">
                <div class="order_content_title">
                  <span class="order_time">{{blockitem.createtime}}</span>
                  <span class="order_code">{{blockOrder.order_id}}<i v-if="blockOrder.pay_status==4">退款</i></span>
                </div>
                <div class="order_pro_block" v-for="(item,index) of blockOrder.order_item" :key="index">
                  <div class="pro_img">
                    <img :src="imgPath+'pro/static.png'" alt="" srcset="" v-if="item.pic==''||item.pic==null">
                    <img :src="item.pic" alt="" srcset="" v-else>
                  </div>
                  <div class="pro_info">
                    <p>
                      <span class="pro_title">{{item.name}}</span>
                      <!-- <span class="pro_income">赚40</span> -->
                    </p>
                    <p>
                      <span class="pro_spec">规格:{{item.title}}</span>
                      <span class="pro_num">x{{item.nums}}</span>
                    </p>
                    <p>
                      <span class="pro_price">￥{{item.price}}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="order_amount">
                <span v-if="isShowType=='3'||isShowType=='4'">为你贡献:</span>
                <span v-else>赚:</span>
                <span class="sales_money">¥{{blockitem.money}}</span>
              </div>
            </div>
          </div>
           <div class="margin_bottom">
            <div class='more_load' v-if='!loading'>
              <mt-spinner type="fading-circle"></mt-spinner>
            </div>
            <div class='list_bottom' v-if='total==saleOrderList.length&&total>0'>—————— 我是有底线的 ——————</div>
            <div class='center' v-if='hasData==false'>
              <!-- <img :src='imgPath+"pro/No_find.png"'/> -->
              <img :src='nullImg' />
              <span>没有发现任何数据哦~</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import nullImg from '@/assets/img/null/sale_order_null.png'
import {
  getOrderInfo
} from '@/api/share'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  Toast
} from 'mint-ui'
export default {
  name: 'SaleOrder',
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
      h_title: '销售订单',
      showSaleOrder: false,
      options: {
        activeColor: '#E8C192',
        labelKey: 'name'
      },
      head_color: {
        background: '#fff',
        color: '#000'
      },
      loading: true,
      hasData: true,
      imgUrl: nullImg,
      orderType: [{
        id: 0,
        tid: '',
        name: '全部'
      },
      {
        id: 1,
        tid: 0,
        name: '未结算'
      },
      {
        id: 2,
        tid: 2,
        name: '已退款'
      },
      {
        id: 3,
        tid: 1,
        name: '已结算'
      }
      ],
      isShowType: '',
      isShowUid: true,
      imgPath: process.env.FilE_URL,
      selectId: 0,
      status: '',
      total: 0,
      uid: '',
      page: 1,
      limit: 10,
      saleOrderList: [],
      avatarUrl: process.env.FilE_URL + 'member/avatar.png'
    }
  },
  mounted() {
    const that = this
    var options = this.$route.query
    that.isShowType = options.type
    console.log(options.type, '哈哈哈哈')
    if (options.type === '1' || options.type === 1) {
      that.h_title = '商品佣金'
    } else if (options.type === '2' || options.type === 2) {
      that.h_title = '礼包佣金'
    } else if (options.type === '3' || options.type === 3) {
      that.h_title = '推广佣金'
    } else if (options.type === '4' || options.type === 4) {
      that.h_title = '平台奖励'
    } else {
      if (options.type !== '') {
        that.isShowUid = false
        that.uid = options.type
        that.isShowType = ''
        that.h_title = '订单记录'
      } else {
        that.isShowType = ''
        that.h_title = '销售订单'
      }
    }
    this.getOrderInfo()
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('sale_order_body').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    getOrderInfo() {
      const that = this
      Indicator.open('加载中...')
      var obj = {
        type: that.isShowType,
        status: that.status,
        buy_uid: that.uid,
        page: that.page,
        limit: that.limit
      }
      getOrderInfo(obj).then(res => {
        if (res.isSuccess) {
          Indicator.close()
          that.showSaleOrder = true
          that.saleOrderList = res.data.rows
          that.total = res.data.total
          that.loading = false
          if (res.data.rows.length < that.limit) {
            that.loading = true
          }
          console.log(that.saleOrderList)
        }
      })
    },
    loadMore() {
      this.loading = true
      var that = this
      let info = {
        type: that.isShowType,
        status: that.status,
        buy_uid: that.uid,
        limit: that.limit,
        page: ++that.page
      }
      console.log('kasjdlasfj')
      getOrderInfo(info).then(res => {
        if (res.isSuccess) {
          Indicator.close()
          that.total = res.data.total
          if (res.data.rows.length > 0) {
            that.loading = false
            that.saleOrderList = that.saleOrderList.concat(res.data.rows)
            if (res.data.rows.length < that.limit) {
              that.loading = true
            }
          } else {

          }
        } else {
          that.total = 0
          that.saleOrderList = []
          that.loading = true
        }
      })
    },
    choseOrder(e) {
      Indicator.open('加载中...')
      this.total = 0
      this.saleOrderList = []
      this.status = e.tid
      this.page = 1
      this.loading = true
      this.hasData = true
      this.selectId = e.id
      document.getElementById('sale_order_body').scrollIntoView(false)
      this.getOrderInfo()
    }
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .sales_order_bg {
    .sale_order_body {
      .order_type {
        border-top: 1px solid #eee;
        position: fixed;
        z-index: 50;
        width: 100%;
      }

      .order_null {
        margin: 0 auto;
        margin-top: 1.1rem;
        text-align: center;

        img {
          width: 4rem;
          height: 4rem;
        }

        p {
          font-size: 0.28rem;
          font-weight: 300;
          color: rgba(0, 0, 0, 0.3);
        }
      }

      .order {
        margin-top: 0.16rem;
        height: calc(100vh - 2rem);
        overflow-y: scroll;
        .order_list {
          .order_block {
            // min-height: 4.08rem;
            margin-bottom: 0.26rem;
            background: #fff;
            overflow: hidden;
            .order_head {
              border-bottom: 0.02rem solid #E8E8E8;
              .order_user {
                height: 0.8rem;
                display: flex;
                align-items: center;
                height: 0.8rem;
                justify-content: space-between;

                .user_img {
                  height: 0.8rem;
                  padding-left: 0.3rem;
                  display: inline-flex;
                  align-items: center;
                  font-size: 0.28rem;
                  font-weight: 400;
                  color: rgba(0, 0, 0, 0.5);

                  img {
                    width: 0.44rem;
                    height: 0.44rem;
                    border-radius: 50%;
                    margin-right: 0.12rem;
                  }
                  .user_name{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: inline-block;
                    width: 4rem;
                  }
                }

                .user_tag {
                  width: 1.48rem;
                  height: 0.48rem;
                  line-height: 0.48rem;
                  background: rgba(232, 193, 146, 1);
                  border-radius: 0.24rem;
                  font-size: 0.28rem;
                  font-weight: 500;
                  color: rgba(255, 255, 255, 1);
                  border-top-right-radius: 0;
                  border-bottom-right-radius: 0;
                  text-align: center;
                }
              }
              // .order_title {
                
              //   display: flex;
              //   align-items: center;
              //   justify-content: space-between;
              //   padding: 0.18rem 0.42rem;

              //   span {
              //     font-size: 0.24rem;
              //     font-weight: 400;
              //     color: rgba(0, 0, 0, 0.5);
              //   }
              // }
            }

            .order_content {
              padding: 0 0.36rem;
              border-bottom: 1px solid #E8E8E8;
              .order_content_title {
                // border-top: 0.02rem solid #E8E8E8;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.18rem 0;

                span {
                  font-size: 0.24rem;
                  font-weight: 400;
                  color: rgba(0, 0, 0, 0.5);
                }
                .order_code{
                  i{
                    font-style: normal;
                    border-radius:0.04rem;
                    border:1px solid rgba(223,174,115,1);
                    padding: 0.02rem;
                    color: rgba(223,174,115,1);
                    margin-left: 0.04rem;
                  }
                }
              }
              .order_pro_block {
                display: flex;
                align-items: center;
                padding: 0.2rem 0;
                border-bottom: 1px dashed #E8E8E8;

                .pro_img {
                  height: 1.5rem;
                  width: 1.5rem;
                  margin-right: 0.2rem;

                  img {
                    width: 100%;
                    height: 100%;
                  }
                }

                .pro_info {
                  width: 5.2rem;

                  p {
                    .pro_title {
                      width: 260px;
                      font-size: 0.28rem;
                      font-weight: 400;
                      color: rgba(0, 0, 0, 0.85);
                    }

                    .pro_income {
                      font-size: 0.28rem;
                      font-weight: 400;
                      color: rgba(223, 174, 115, 1);
                      float: right;
                    }

                    .pro_spec {
                      font-size: 0.24rem;
                      font-weight: 400;
                      color: rgba(0, 0, 0, 0.4);
                    }

                    .pro_num {
                      font-size: 0.28rem;
                      font-weight: 400;
                      color: rgba(0, 0, 0, 0.85);
                      float: right;
                    }

                    .pro_price {
                      font-size: 0.32rem;
                      font-weight: bold;
                      color: rgba(0, 0, 0, 0.85);
                    }
                  }
                }
              }

              .order_pro_block:last-child {
                border-bottom: none;
              }
            }

            .order_amount {
              font-size: 0.28rem;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.85);
              float: right;
              margin-right: 0.3rem;
              margin-top: 0.14rem;
              margin-bottom: 0.34rem;

              .sales_money {
                font-size: 0.36rem;
                font-weight: bold;
                color: rgba(255, 78, 121, 1);
              }
            }

          }
          .order_block:last-child{
            margin-bottom: 0;
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
