<template>
  <div>
    <common-header :h_title="h_title"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem' id='order'></div>
    <div class='myOrder' v-if='isShow'>
      <return-top @returnTop='goTop'></return-top>
      <div class='order_body'>
        <ly-tab v-model="selectId" :items="orderType" :options="options" @change='choseOrder' class='order_type'>
        </ly-tab>
        <div style='height:0.9rem'></div>
        <div class='order_list' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
          infinite-scroll-distance="30">
          <div class='order_single' v-for='(order,index) in orderList' :key='index' v-show="orderList.length>0">
            <div class='order_head'>
              <div class='order_code'>
                <span v-if="order.t_type==1">订单号：</span>
                <span v-if="order.third_id>0&&order.t_type!=1" class="order_tag">{{order.third_name}}</span>
                <span v-if="order.third_id==0&&order.t_type!=1" class="order_tag">平台自营</span>
                <span>{{order.order_id}}</span>
              </div>
              <div class='order_states' v-if='orderStatusCode!=7'>
                <div
                  v-if='(order.t_type==1&&order.countdown!=undefined&&order.countdown>0)||(endTimeList.length>0&&order.t_type==1&&order.countdown>0)'>
                  等待付款</div>
                <div v-if='order.t_type==5'>买家已付款</div>
                <div v-if='order.t_type==2'>待收货</div>
                <div v-if='order.t_type==6'>交易成功</div>
                <div v-if='order.t_type==3'>交易完成</div>
                <div v-if='(order.t_type==1&&endTimeList.length<=0&&order.countdown!=undefined&&order.countdown<=0)||(order.t_type==4)'>
                  已取消</div>
                <!-- <div v-if='order.t_type==7'>交易关闭</div> -->
              </div>
              <div class='order_states' v-else>
                <div v-if="order.after_type=='refunds'">退款订单</div>
                <div v-if="order.after_type=='reship'">退货订单</div>
                <div v-if="order.after_type=='barter'">换货订单</div>
              </div>
            </div>
            <div class="order_child" v-for='(child,index) in order.rows' :key='index' v-show="order.rows.length>0">
              <div class="order_child_head">
                <div class='order_code' v-if="order.t_type==1">
                  <span>{{child.order_id}}</span>
                </div>
              </div>
              <div class='order_pro_info' v-for='(item,index) in child.order_items' :key='index'
                @click='goPro(child.order_id,item)' v-show="child.order_items.length>0">
                <div class='pro_img'>
                  <img :src='item.product_img_src' v-if="item.product_img_src!=null&&item.product_img_src!=''" />
                  <img :src='imgPath+"pro/static.png"' v-else />
                </div>
                <div class='pro_info'>
                  <div class='pro_title'>
                      <span class='title_icon' v-if="child.order_refer=='tuangou'">拼购</span>
                      <span class='title_icon' v-if="child.order_refer=='qianggou'||child.order_refer=='qianggou'">促销</span>
                      <span class='title_icon' v-if="child.order_refer=='exchange'">抽奖</span>
                      <span class='title_icon' v-if="child.order_refer=='super'">超级转盘</span>
                      <span class='title_icon' v-if="child.order_refer=='try'">试用</span>
                      <span class='title_icon' v-if="child.order_refer=='scantry'">扫码试用</span>
                      <span class='title_icon' v-if="child.order_refer=='point'">兑换</span>
                      <span class='title_icon' v-if="child.order_refer=='birthday'">生日兑换</span>
                      <span class='title_icon' v-if="child.order_refer=='scan'">扫码抽奖</span>
                      <span class='title_icon' v-if="child.order_refer=='fruits'">水果</span>
                      <span class='title_icon' v-if="child.order_refer=='newpeople'">新人专享</span>
                    <span>{{item.name}}</span>
                  </div>
                  <div class='pro_color' v-if="item.title!=''&&item.title!=null">规格：{{item.title}}</div>
                  <div class='pro_spec'>
                    <div class='pro_price'>
                      <span class='peo_nowprice' v-if='item.price>0'>￥{{item.price}} </span>
                      <span class='pro_integral' v-if='item.point>0&&item.price>0'>+</span>
                      <div class='pro_inter_img' v-if='item.point>0'>
                        <i class='iconfont icon-jifen1'></i>
                      </div>
                      <span class='pro_integral' v-if='item.point>0'>{{item.point}}</span>

                    </div>
                    <div class='pro_num'>数量：{{item.nums}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class='order_info'>
              共{{order.goods_num}}件商品 合计：
              <span>￥{{order.total_price}}</span>
              <span v-if='order.point_use>0'>+{{order.point_use}}积分</span>
              （含运费￥{{order.cost_freight}}）
            </div>
            <div :class="order.t_type == 1&&orderStatusCode!=7 ? 'order_oper':'view_hidden'">
              <div v-if="orderStatusCode==1&&order.countdown>0" class='countdown'>
                <i class='iconfont icon-jinriqianggou'></i>
                <span>支付剩余</span>
                <span>{{saleTimeList[index].hou}}:{{saleTimeList[index].min}}:{{saleTimeList[index].sec}}</span>
              </div>
              <mt-button size="small" @click="cancelOrders(order.order_id,order.payment_id)" v-if="order.countdown>0">
                取消订单</mt-button>
              <mt-button size="small" class='btn_red' @click='showPayType(order.order_id,order.pay_id,order.payment_id)'
                v-if="order.countdown>0">立即支付</mt-button>
              <mt-button size="small" v-if="order.countdown<=0">已取消</mt-button>
            </div>
            <div :class="order.t_type == 5&&orderStatusCode!=7 ? 'order_oper':'view_hidden'">
              <mt-button size="small" :class="order.remind==1?'':'btn_red'"
                @click='remind(order.order_id,order.remind)'>提醒发货</mt-button>
            </div>
            <div :class="order.t_type == 2&&orderStatusCode!=7 ? 'order_oper':'view_hidden'">
              <mt-button size="small" @click='viewtrack(order.order_id)'>查看物流</mt-button>
              <mt-button size="small" class='btn_red' @click='sureOrder(order.order_id)'>确认收货</mt-button>
            </div>
            <div :class="order.t_type == 6&&orderStatusCode!=7 ? 'order_oper':'view_hidden'">
              <mt-button size="small" @click='viewtrack(order.order_id)'>查看物流</mt-button>
              <mt-button size="small" class='btn_red' @click='goComm(order.order_id,order.goods_num)'>立即评价
              </mt-button>
            </div>
            <div :class="order.t_type == 3&&orderStatusCode!=7 ? 'order_oper':'view_hidden'">
              <mt-button size="small" @click='viewtrack(order.order_id)'>查看物流</mt-button>
            </div>
            <div :class="order.t_type == 4&&orderStatusCode!=7 ? 'order_oper':'view_hidden'">
              <mt-button size="small">已取消</mt-button>
            </div>
            <div :class="order.t_type == 7&&orderStatusCode!=7 ? 'order_oper':'view_hidden'">
              <mt-button size="small">售后完成</mt-button>
            </div>
          </div>
          <div class='order_list_null' v-if='total==0'>
            <span>当前类别下暂无订单，快去选购吧~</span>
            <mt-button class='btn_red' @click='goIndex'>去首页看看</mt-button>
          </div>
          <div class='more_load' v-if='!loading'>
            <mt-spinner type="fading-circle"></mt-spinner>
          </div>
          <div class='list_bottom' v-if='orderList.length==total&&loading&&total>0'>—————— 我是有底线的 ——————</div>
        </div>
      </div>
      <!-- </mt-loadmore> -->
    </div>
    <div class='model_pay_bg' v-if='hiddenPay' @click="hidePayModel"></div>
    <div class='model_pay' v-if='hiddenPay'>
      <div class='model_head'>
        <span @click="hidePayModel">取消</span>
        <span @click="chosePayModel">确认</span>
      </div>
      <div class='model_picker'>
        <mt-picker :slots="payslots" @change="onPayChange"></mt-picker>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {
  InfiniteScroll,
  Indicator,
  Search,
  Button,
  Lazyload,
  MessageBox,
  Toast,
  Loadmore
} from 'mint-ui'
import LyTab from '@/components/LyTab/index'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import {
  getOrderList,
  getCarList,
  cancelOrder,
  getOrderTrack,
  remindShip,
  confirmReceipt,
  wxPay,
  isPayOk
} from '@/api/index'
import {
  countDownList
} from '@/store/pubilc.js'
import returnTop from '@/components/return-top'
export default {
  name: 'Order',
  components: {
    commonHeader,
    Search,
    LyTab,
    returnTop,
    InfiniteScroll,
    Lazyload,
    Button,
    MessageBox,
    Toast,
    Loadmore
  },
  data() {
    return {
      // head_color: {
      //   background: '#f9f9f9',
      //   color: '#000'
      // },
      h_title: '我的订单',
      options: {
        activeColor: '#ff4e79',
        labelKey: 'name'
      },
      payId: 2, // 1是小程序微信支付，2是app微信支付，3是app支付宝支付
      orderId: '',
      paymenId: '',
      active_type_id: 'type0',
      isShow: false,
      newNews: false,
      total_amout: 0,
      orderstatus: '等待付款',
      selectId: 0,
      orderStatusCode: 0,
      loading: true,
      time: '', // 定时器
      endTime: '', // 倒计时秒数
      saleTime: {}, // 倒计时时分秒数组
      saleTimeList: [{
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }],
      page: 1,
      limit: 10,
      orderList: [],
      endTimeList: [],
      total: 0,
      orderNum: false,
      after_tips: '',
      leftLength: 0,
      allowbind: true,
      imgPath: process.env.FilE_URL,
      payslots: [{
        defaultIndex: 0,
        values: ['微信支付', '支付宝支付']
      }],
      orderType: [{
        id: 0,
        tid: 0,
        name: '全部'
      },
      {
        id: 1,
        tid: 1,
        name: '待付款'
      },
      {
        id: 2,
        tid: 5,
        name: '待发货'
      },
      {
        id: 3,
        tid: 2,
        name: '待收货'
      },
      {
        id: 4,
        tid: 7,
        name: '退换/售后'
      },
      {
        id: 5,
        tid: 6,
        name: '待评价'
      },
      {
        id: 6,
        tid: 3,
        name: '已完成'
      },
      {
        id: 7,
        tid: 4,
        name: '已取消'
      }
      ],
      channels: '',
      hiddenPay: false,
      paytype: 'wxPay'
    }
  },
  mounted() {
    if (this.time != '') {
      clearInterval(this.time)
    }
    this.saleTimeList = [{
      day: '00',
      hou: '00',
      min: '00',
      sec: '00'
    }]
    this.endTimeList = []
    Indicator.open('加载中...')
    console.log(this.$route.params)
    var storage = window.localStorage
    if (this.$route.params.id !== undefined) {
      this.selectId = this.$route.params.id
      this.orderStatusCode = this.$route.params.tid
      storage.setItem('selectId', this.selectId)
      storage.setItem('orderStatusCode', this.orderStatusCode)
    } else {
      this.selectId = parseInt(storage.getItem('selectId'))
      this.orderStatusCode = parseInt(storage.getItem('orderStatusCode'))
    }
    this.getList()
    let that = this
    let System = window.plus
    console.log(System)
    if (System != undefined) {
      System.payment.getChannels(function (s) {
        that.channels = s
      }, function (e) {
        console.log('获取支付通道列表失败：' + e.message)
      })
    }
  },
  activated() {
    console.log(this.time)
    if (this.time != '') {
      clearInterval(this.time)
    }
    this.saleTimeList = [{
      day: '00',
      hou: '00',
      min: '00',
      sec: '00'
    }]
    this.endTimeList = []
    Indicator.open('加载中...')
    console.log(this.$route.params)
    var storage = window.localStorage
    if (this.$route.params.id !== undefined) {
      this.selectId = this.$route.params.id
      this.orderStatusCode = this.$route.params.tid
      storage.setItem('selectId', this.selectId)
      storage.setItem('orderStatusCode', this.orderStatusCode)
    } else {
      this.selectId = parseInt(storage.getItem('selectId'))
      this.orderStatusCode = parseInt(storage.getItem('orderStatusCode'))
    }
    this.page = 1
    this.total = 0
    this.orderList = []
    this.getList()
    let that = this
    let System = window.plus
    console.log(System)
    if (System != undefined) {
      System.payment.getChannels(function (s) {
        that.channels = s
      }, function (e) {
        console.log('获取支付通道列表失败：' + e.message)
      })
    }
  },
  methods: {
    ...mapMutations({
      setCarnum: 'SET_CARNUM'
    }),
    goTop() {
      console.log('回到顶部')
      document.getElementById('order').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goComm(orderId, num) {
      this.$router.togo({
        path: '/addComment' + '?num=' + num + '&orderId=' + orderId
      })
    },
    goPro(orderno, event) {
      if (this.orderStatusCode === '7') {
        if (event.flag <= 0) {
          this.$router.togo({
            path: '/saleAfter?pid=' + event.id + '&orderId=' + orderno + '&order_type=7'
          })
        } else {
          this.$router.togo({
            path: '/afterDetail?pid=' + event.id + '&orderId=' + orderno
          })
        }
      } else {
        this.$router.togo({
          path: '/orderDetail?id=' + orderno
        })
      }
    },
    goIndex(e) {
      this.$router.replace({
        path: '/index'
      })
    },
    choseOrder(e) {
      var storage = window.localStorage
      Indicator.open('加载中...')
      console.log(e)
      this.orderStatusCode = e.tid
      this.selectId = e.id
      storage.setItem('selectId', this.selectId)
      storage.setItem('orderStatusCode', this.orderStatusCode)
      this.page = 1
      this.total = 0
      this.orderList = []
      document.getElementById('order').scrollIntoView(false)
      this.getList()
    },
    cancelOrders(id, payId) {
      var that = this
      let plus = window.plus
      if (window.plus) {
        plus.nativeUI.confirm('确定取消当前订单？订单一经取消不可恢复！', function (e) {
          console.log('Close confirm: ' + e.index)
          if (e.index === 0 || e.index === '0') {
            let info = {
              id: id,
              payment_id: payId
            }
            cancelOrder(info).then(res => {
              if (res.isSuccess) {
                Toast({
                  message: res.msg,
                  iconClass: 'iconfont icon-dui1',
                  duration: 1000
                })
                setTimeout(function () {
                  clearInterval(that.time)
                  that.orderList = []
                  that.saleTimeList = []
                  that.endTimeList = []
                  that.total = 0
                  that.page = 1
                  that.getList()
                }, 1000)
              } else {
                Toast({
                  message: res.msg,
                  duration: 1000
                })
              }
            })
          } else {
            console.log('用户点击取消')
          }
        }, {
          'title': '提示',
          'buttons': ['确定', '取消'],
          'verticalAlign': 'center'
        })
      } else {
        MessageBox({
          title: '提示',
          message: '确定取消当前订单？订单一经取消不可恢复！',
          showCancelButton: true,
          closeOnClickModal: false
        }).then(res => {
          if (res === 'confirm') {
            let info = {
              id: id,
              payment_id: payId
            }
            cancelOrder(info).then(res => {
              if (res.isSuccess) {
                Toast({
                  message: res.msg,
                  iconClass: 'iconfont icon-dui1',
                  duration: 1000
                })
                setTimeout(function () {
                  clearInterval(that.time)
                  that.orderList = []
                  that.saleTimeList = []
                  that.endTimeList = []
                  that.total = 0
                  that.page = 1
                  that.getList()
                }, 1000)
              } else {
                Toast({
                  message: res.msg,
                  duration: 1000
                })
              }
            })
          } else {
            console.log('用户点击取消')
          }
        })
      }
    },
    getList() {
      if (this.time != '') {
        clearInterval(this.time)
      }
      this.saleTimeList = [{
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }]
      this.endTimeList = []
      var info = {
        id: this.orderStatusCode,
        page: this.page,
        limit: this.limit
      }
      getCarList().then(res => {
        if (res.isSuccess) {
          // that.total_amout = res.data.rows_total
          that.setCarnum(res.data.rows_total)
        }
      })
      console.log(this.page)
      var that = this
      getOrderList(info).then(res => {
        Indicator.close()
        this.isShow = true
        if (res.isSuccess) {
          if (that.orderStatusCode === 7) {
            if (res.rows != null) {
              for (var i = 0; i < res.rows.length; i++) {
                var afterList = []
                for (var k = 0; k < res.rows[i].rows.length; k++) {
                  for (var j = 0; j < res.rows[i].rows[k].order_items.length; j++) {
                    afterList.push(res.rows[i].rows[k].order_items[j].type)
                  }
                }
                var afterStr = afterList.join(',')
                if (afterStr.indexOf('barter') !== -1) {
                  res.rows[i].after_type = 'barter'
                } else if (afterStr.indexOf('reship') !== -1) {
                  res.rows[i].after_type = 'reship'
                } else {
                  res.rows[i].after_type = 'refunds'
                }
              }
            }
          }
          if (that.orderStatusCode === 1) {
            if (res.rows != null) {
              var timearr = []
              for (let i = 0; i < res.rows.length; i++) {
                timearr.push(res.rows[i].countdown)
              }
              that.endTimeList = timearr
              var sectimeList = countDownList(timearr)
              that.saleTimeList = sectimeList
              that.time = setInterval(function () {
                for (var k = 0; k < timearr.length; k++) {
                  if (timearr[k] > 0) {
                    timearr[k] = --timearr[k]
                  } else {
                    timearr[k] = 0
                  }
                }
                that.endTimeList = timearr
                sectimeList = countDownList(timearr)
                that.saleTimeList = sectimeList
              }, 1000)
            }
          }
          if (res.rows.length > 0) {
            that.orderList = res.rows
            that.total = res.total
            that.orderNum = true
            that.loading = false
            if (res.rows.length < that.limit) {
              that.loading = true
            }
          } else {
            that.orderList = []
            that.orderNum = false
            that.loading = true
          }

          // setTimeout(function () {
          //   if ((parseInt(that.total) === parseInt(that.orderList.length) && parseInt(that.total) > 0) ||
          //       parseInt(that.total) === 0) {
          //     document.querySelector('.mint-loadmore-bottom').style.marginBottom = -50 + 'px'
          //   } else {
          //     document.querySelector('.mint-loadmore-bottom').style.marginBottom = 0 + 'px'
          //   }
          // }, 100)
        }
      })
    },
    loadMore() {
      this.loading = true
      // 加载更多数据
      this.page = ++this.page
      var info = {
        id: this.orderStatusCode,
        page: this.page,
        limit: this.limit
      }
      var that = this
      getOrderList(info).then(res => {
        if (res.isSuccess) {
          if (res.rows.length > 0) {
            that.orderList = that.orderList.concat(res.rows)
            that.total = res.total
            that.orderNum = true
            that.loading = false
            if (res.rows.length < that.limit) {
              that.loading = true
            }
          } else {
            that.orderNum = false
            that.loading = true
          }
          console.log(that.orderList)
        }
      })
    },
    viewtrack(id) {
      var that = this
      that.$router.togo({
        path: '/orderTrack?orderId=' + id
      })
      // getOrderTrack(id).then(res => {
      //   if (res.isSuccess) {
      //     that.$router.togo({
      //       path: '/orderTrack?orderId=' + id
      //     })
      //   } else {
      //     Toast({
      //       message: res.msg,
      //       duration: 1000
      //     })
      //   }
      // })
    },
    sureOrder(orderId) {
      var that = this
      let plus = window.plus
      if (window.plus) {
        plus.nativeUI.confirm('请确定已收到货品！', function (e) {
          console.log('Close confirm: ' + e.index)
          if (e.index === 0 || e.index === '0') {
            confirmReceipt(orderId).then(res => {
              if (res.isSuccess) {
                Toast({
                  message: '成功',
                  iconClass: 'iconfont icon-dui1',
                  duration: 1000
                })
                setTimeout(function () {
                  that.page = 1
                  that.orderList = []
                  that.getList()
                }, 1000)
              } else {
                Toast({
                  message: res.msg,
                  duration: 1000
                })
              }
            })
          } else {
            console.log('用户点击取消')
          }
        }, {
          'title': '提示',
          'buttons': ['确定', '取消'],
          'verticalAlign': 'center'
        })
      } else {
        MessageBox({
          title: '提示',
          message: '请确定已收到货品',
          showCancelButton: true,
          closeOnClickModal: false
        }).then(res => {
          if (res === 'confirm') {
            confirmReceipt(orderId).then(res => {
              if (res.isSuccess) {
                Toast({
                  message: '成功',
                  iconClass: 'iconfont icon-dui1',
                  duration: 1000
                })
                setTimeout(function () {
                  that.page = 1
                  that.orderList = []
                  that.getList()
                }, 1000)
              } else {
                Toast({
                  message: res.msg,
                  duration: 1000
                })
              }
            })
          } else {
            console.log('用户点击取消')
          }
        })
      }
    },
    onPayChange(picker, values) {
      if (values[0] == '微信支付') {
        this.paytype = 'wxPay'
      } else {
        this.paytype = 'aliPay'
      }
    },
    hidePayModel() {
      this.hiddenPay = false
    },
    chosePayModel() {
      console.log(this.paytype)
      if (this.paytype == 'wxPay') {
        this.payId = 2
      } else {
        this.payId = 3
      }
      this.hiddenPay = false
      this.payOver()
    },
    showPayType(orderId, payId, paymenId) {
      this.orderId = orderId
      this.payId = payId
      this.paymenId = paymenId
      // this.hiddenPay = true
      this.payId = 2
      this.payOver()
    },
    payOver() {
      var that = this
      if (that.channels[0].serviceReady == true) {
        if (that.allowbind) {
          that.allowbind = false
          let info = {}
          if (that.payId == 2) {
            console.log('微信支付')
            // 微信支付
            info = {
              id: that.orderId,
              pay_id: that.payId,
              payment_id: that.paymenId,
              pay_payment: 'wechatapp'
            }
          }
          if (that.payId == 3) {
            console.log('支付宝支付')
            // 支付宝支付
            info = {
              id: that.orderId,
              pay_id: that.payId,
              payment_id: that.paymenId,
              pay_payment: 'alipayapp'
            }
          }
          that.wxPayment(info)
        } else {
          console.log('不允许重复点击')
          Toast({
            message: '操作过于频繁，请1秒后重试',
            duration: 1000
          })
          setTimeout(() => {
            that.allowbind = true
          }, 1000)
        }
      } else {
        Toast({
          message: '当前没有安装微信，请到应用商店下载',
          duration: 1000
        })
      }
    },
    wxPayment(info) {
      console.log('支付前传值')
      console.log(info)
      let that = this
      wxPay(info).then(res => {
        if (res.isSuccess) {
          console.log(res.data)
          console.log('支付通道')
          console.log(that.channels)
          let System = window.plus
          let param1 = {}
          let payInfo = that.channels[0]
          if (that.payId == 2) {
            payInfo = that.channels[0]
            param1 = {
              appid: res.data.appId,
              noncestr: res.data.nonceStr,
              package: res.data.package,
              partnerid: res.data.partnerid,
              prepayid: res.data.prepayid,
              timestamp: res.data.timeStamp,
              sign: res.data.paySign
            }
          }
          if (that.payId == 3) {
            payInfo = that.channels[1]
            param1 = res.data.orderstr
          }
          console.log('最终选择付款方式')
          console.log(payInfo)
          console.log(param1)
          System.payment.request(payInfo, param1, function () {
            // isPayOk({payment_id: info.payment_id}).then(payReq => {
            //   if (payReq.isSuccess) {
            //     Toast({
            //       message: '支付成功',
            //       iconClass: 'iconfont icon-dui1',
            //       duration: 1000
            //     })
            //     setTimeout(() => {
            //       that.allowbind = true
            //     }, 1000)
            //   } else {
            //     console.log('支付完成回调失败')
            //     Toast({
            //       message: '支付成功',
            //       iconClass: 'iconfont icon-dui1',
            //       duration: 1000
            //     })
            //     setTimeout(() => {
            //       that.allowbind = true
            //     }, 1000)
            //   }
            // })
            that.allowbind = true
            Toast({
              message: '支付成功',
              iconClass: 'iconfont icon-dui1',
              duration: 1000
            })
            that.$router.replace({
              path: '/paySuccess?addrId=' + that.staticAdd[0].id
            })
          }, function (e) {
            console.log(e.message)
            that.allowbind = true
            // that.$router.replace({
            //   path: '/order',
            //   name: 'Order',
            //   params: {
            //     id: 1,
            //     tid: 1
            //   }
            // })
          })
        } else {
          Toast({
            message: res.msg,
            duration: 1000
          })
        }
      }).catch(req => {
        console.log(req)
        that.allowbind = true
      })
    },
    remind(orderId, isRemind) {
      var that = this
      if (isRemind === 0 || isRemind === '0') {
        remindShip(orderId).then(res => {
          if (res.isSuccess) {
            Toast({
              message: '已提醒',
              iconClass: 'iconfont icon-dui1',
              duration: 1000
            })
            setTimeout(function () {
              for (var i = 0; i < that.orderList.length; i++) {
                if (that.orderList[i].order_id === orderId) {
                  that.orderList[i].remind = 1
                  break
                }
              }
            }, 1000)
          } else {
            Toast({
              message: res.msg,
              duration: 1000
            })
          }
        })
      } else {
        Toast({
          message: '请勿重复提醒',
          duration: 1000
        })
      }
    },
    beforeDestroy() {
      clearInterval(this.time)
    }
  },
  computed: {
    ...mapGetters([])
  }
}

</script>

<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .myOrder {
    overflow-x: hidden;
  }

  .order_header {
    text-align: center;
    background: #ff4e79;
    height: 94/100rem;
    line-height: 94/100rem;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 50;
  }

  .order_header icon {
    float: left;
    padding-left: 13px;
    color: #fff;
  }

  .order_header span {
    color: #fff;
    font-size: 38/100rem;
    margin-left: -26/100rem;
  }

  .order_body {
    height: 100%;
    margin-bottom: 98/100rem;
  }

  .order_type {
    height: 88/100rem;
    background: #fff;
    border-top: 1px solid transparent;
    // border-bottom: 1px solid #dadada;
    width: 100%;
    white-space: nowrap;
    position: fixed;
    /* top: 94/100rem; */
    z-index: 50;
  }

  .order_type span {
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #444;
    margin: 0 21/100rem;
    height: 80/100rem;
    line-height: 80/100rem;
    /* width: 104/100rem; */
    display: inline-block;
    text-align: center;
    border-bottom: 5/100rem solid transparent;
    border-top: 5/100rem solid transparent;
  }

  .order_type .text_active {
    border-bottom: 5/100rem solid #ff4e79;
  }

  .order_list {
    // height: 100%;
    height: calc(100vh - 2.78rem);
    overflow-y: scroll;
    // padding-top: 94/100rem;
  }

  .order_list_null {
    // height: 100%;
    padding-top: 140/100rem;
    text-align: center;
  }

  .order_list_null span {
    font-size: 28/100rem;
    color: #555;
    display: block;
    text-align: center;
  }

  .order_list_null .btn_red {
    margin-top: 20/100rem;
    display: inline-flex;
    height: 66/100rem;
    line-height: 66/100rem;
    border: none;
    background: #ff4e79;
    color: #fff;
    outline: none;
    font-size: 32/100rem;
    border-radius: 20/100rem;
  }

  .order_list .order_single {
    /* height: 520/100rem; */
    background: #fff;
    margin-bottom: 22/100rem;
  }

  /* 单个订单的订单号和订单状态 */

  .order_single .order_head {
    height: 27/100rem;
    margin: 0 24/100rem;
    padding-top: 35/100rem;
    padding-bottom: 18/100rem;
  }

  .order_head .order_code {
    color: #515151;
    font-size: 24/100rem;
    float: left;
  }
  // .order_head .order_code .line_table{
  //   display: inline-flex;
  //   align-items: center;
  // }

  .order_head .order_code .order_tag {
    // display: table-cell;
    // vertical-align: middle;
    // height: 30/100rem;
    // line-height: 30/100rem;
    border: 2/100rem solid #ff4e79;
    font-size: 20/100rem;
    color: #ff4e79;
    border-radius: 5/100rem;
    text-align: center;
    padding: 2/100rem 6/100rem;
    margin-right: 8/100rem;
  }

  .order_head .order_code span {
    font-family: "DIN";
  }

  .order_head .order_states {
    color: #ff4e79;
    font-size: 30/100rem;
    /* font-weight: bold; */
    float: right;
  }

  .order_states span {
    color: #dfdfdf;
  }

  .order_states div {
    float: left;
    padding: 0 20/100rem;
  }

  .order_states .delOrder {
    float: left;
  }

  .order_states .delOrder img {
    width: 34/100rem;
    height: 30/100rem;
  }

  /* 订单商品信息 */
  .order_single .order_child {
    background: #f8f8f8;
    font-size: 22/100rem;
    padding: 10/100rem 24/100rem;
  }

  .order_single .order_pro_info {
    /* height: 252/100rem;
  background: #f8f8f8; */
    background: #f8f8f8;
    display: flex;
    align-items: center;
    padding: 30/100rem;
  }

  .order_pro_info .pro_img {
    float: left;
    /* margin-top: 40/100rem; */
    margin-left: 18/100rem;
    margin-right: 30/100rem;
  }

  .order_pro_info .pro_img img {
    width: 190/100rem;
    height: 190/100rem;
  }

  .order_pro_info .pro_info {
    float: left;
    width: 440/100rem;
  }

  .pro_info .pro_title {
    /* width: 400/100rem; */
    font-size: 24/100rem;
    color: #444;
    /* margin-top: 50/100rem; */
    border-radius: 10/100rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .pro_info .title_icon {
    // display: table-cell;
    // vertical-align: middle;
    background: #ff4e79;
    // height: 30/100rem;
    // line-height: 30/100rem;
    padding: 2/100rem 8/100rem;
    font-size: 20/100rem;
    color: #fff;
    border-radius: 8/100rem;
    text-align: center;
    margin-right: 10/100rem;
  }

  .pro_info .pro_color {
    /* width: 400/100rem; */
    font-size: 20/100rem;
    color: #999;
    margin: 10/100rem 0;
  }

  .pro_info .pro_spec {
    /* width: 490/100rem; */
    overflow: hidden;
    /* margin-top: 30/100rem; */
    height: 50/100rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pro_spec .pro_price {
    font-family: "DIN";
    width: 280/100rem;
    display: flex;
    align-items: center;
  }

  .pro_price .peo_nowprice {
    color: #ff4e79;
    font-size: 30/100rem;
    font-weight: bold;
  }

  .pro_price .pro_integral {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff4e79;
    /* font-weight: bold; */
    /* margin-left: 8/100rem; */
  }

  .pro_price .pro_inter_img {
    display: flex;
    align-items: flex-end;
    /* margin-left: 10/100rem; */
  }

  .pro_price .pro_inter_img .iconfont {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff4e79;
    display: inline-flex;
  }

  /* .pro_price .pro_inter_img img {
  width: 24/100rem;
  height: 20/100rem;
} */

  .pro_price .pro_orig {
    font-size: 22/100rem;
    color: #7c7c7c;
    text-decoration: line-through;
  }

  .pro_spec .pro_num {
    font-size: 20/100rem;
    color: #999;
    margin-right: 8/100rem;
  }

  .order_single .order_info {
    color: #555;
    font-size: 24/100rem;
    text-align: right;
    margin-top: 34/100rem;
    padding-bottom: 24/100rem;
    border-bottom: 1px solid #eaeaea;
  }

  .order_info span {
    color: #ff4e79;
    font-weight: bold;
    font-size: 30/100rem;
    font-family: "DIN";
  }

  .order_single .order_oper {
    /* margin-top: 25/100rem; */
    text-align: right;
    padding: 24/100rem 0;
  }

  .order_single .order_oper .countdown {
    font-size: 26/100rem;
    float: left;
    margin-left: 16/100rem;
    color: #f06b90;
    display: inline-flex;
    align-items: center;
    height: 0.66rem;
  }

  .order_single .order_oper .countdown .iconfont {
    margin-right: 4/100rem;
    color: #f06b90;
  }

  .order_single .order_oper .countdown span {
    margin-right: 4/100rem;
  }

  .order_oper button {
    margin-right: 16/100rem;
    border: 1px solid #808080;
    color: #808080;
    background: transparent;
    border-radius: 50/100rem;
    font-size: 26/100rem;
    width: 180/100rem;
    padding: 4/100rem 26/100rem;
  }

  .order_oper .btn_red {
    border-color: #f06b90;
    color: #f06b90;
  }

  .order-foot {
    height: 84/100rem;
    line-height: 84/100rem;
    /* background: #fff; */
    text-align: center;
    margin-top: -22/100rem;
  }

  .order-foot span {
    font-size: 23.97/100rem;
    color: #bebebe;
  }

  .view_hidden {
    display: none;
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

  .model_pay_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 202;

  }

  .model_pay {
    width: 100%;
    height: 30vh;
    background: #fff;
    position: fixed;
    bottom: 0;
    z-index: 203;

    .model_head {
      display: flex;
      justify-content: space-between;
      padding: 0 0.26rem;
      height: 0.8rem;
      align-items: center;
    }

    .model_picker {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

</style>
