<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <return-top @returnTop='goTop'></return-top>
    <div style='height:0.9rem' id='sureorder'></div>
    <div class='sure_order'>
      <div class='sure_body'>
        <div class='sure_head'>
          <div class='sure_addr' @click='choseAdd' v-for='(item,index) in staticAdd' :key='index'>
            <div class='sure_addr_info'>
              <i class='iconfont icon-address'></i>
              <div style='margin-left:0.2rem;width: 92%;'>
                <span class='add_more'>{{item.ship_name}}</span>
                <span style='margin-left:0.3rem;'>{{item.ship_mobile}}</span>
                <span class='static' v-if="item.is_default=='1'">默认</span>
                <div style="word-wrap: break-word;">
                  <span style='margin-right:0.1rem'>{{item.ship_area}}</span>{{item.ship_addr}}</div>
              </div>
            </div>
            <i class='iconfont icon-youjiantou1'></i>
          </div>
          <div class='sure_addr' @click='choseAdd' v-if='chooseAdd==-1'>
            <i class='iconfont icon-address' :hidden='chooseAdd==-1'></i>
            <span class='add_tips'>选择收货地址</span>
            <i class='iconfont icon-youjiantou1'></i>
          </div>
          <img :src="imgPath+'sale/s_bg.jpg'" />
        </div>
        <div class='sure_pro' v-for='(order,index) in proDetail' :key='index'>
          <div class="sure_pro_title">
            <span v-if="order.third_id!=0" class="third_title">{{order.third_name}}</span>
            <span v-if="order.third_id==0" class="third_title">平台自营</span>
            <span v-if="order.third_id!=0" class="order_tag">包邮</span>
            <span v-if="order.third_id==0&&static_freight<=0" class="order_tag">包邮</span>
          </div>
          <div class="order_pro" v-for="(item,index) in order.rows_product" :key='index'>
            <div class='car_pro'>
              <div class='pro_img'>
                <img :src='item.goods.img' />
              </div>
              <div class='pro_info'>
                <div class='pro_title'>{{item.name}}</div>
                <div class='pro_spec'>
                  <div class='pro_weight' v-if="item.title!=''">
                    <span>规格:{{item.title}}</span>
                  </div>
                  <div class='pro_price'>
                    <div style='display:flex;align-items:center;'>
                      <div class='pro_inter_img' v-if='item.deal_type!=1'>
                        <i class='iconfont icon-jifen1'></i>
                      </div>
                      <span class='pro_integral' v-if='item.deal_type==2||item.deal_type==3'>{{item.point}}</span>
                      <span class='pro_integral' v-if='item.deal_type>=4'>{{item.point}}</span>
                      <span class='pro_integral_add' v-if='item.deal_type>=4'>+</span>
                      <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_sell}}</span>
                      <span class='peo_nowprice' v-if='item.deal_type==1'>￥{{item.price_sell}}</span>
                    </div>
                    <div class='pro_icon' style='display:inline-flex;align-items:center;'>
                      <span>x{{item.quantity}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pro_block">
            <span>商品总额</span>
            <div class='pro_tips'>
              <span>￥{{order.total_amount}}</span>
            </div>
          </div>
          <div class="pro_block" v-if="order.third_id==0">
            <span>积分总额</span>
            <div class='pro_tips'>
              <span>{{order.total_point}}</span>
            </div>
          </div>
          <div class="pro_block">
            <span>商品运费</span>
            <div class='pro_tips'>
              <span v-if="order.third_id!=0">￥{{order.cost_freight}}</span>
              <span v-if="order.third_id==0&&static_freight>0">￥{{static_freight}}</span>
              <span v-if="order.third_id==0&&static_freight<=0">￥0.00</span>
            </div>
          </div>
        </div>
        <div class='sure_other'>
          <div class='other_blcok' v-if="orderType=='normal'&&hiddenCou==false&&isgift==0">
            <div class='type'>
              <span>优惠券</span>
            </div>
            <div @click='golink'>
              <span>{{couInfo}}</span>
              <i class='iconfont icon-youjiantou1'></i>
            </div>
          </div>
          <!-- <div class='other_blcok' v-if='!isFree'>
            <div class='type'>
              <span>配送物流</span>
            </div>
            <div style='display:inline-flex;'>
              <div class="picker" @click="showModel('track')" style="font-size:0.24rem;color:#555;font-family:'DIN';">
                {{trackName}}
              </div>
              <i class='iconfont icon-youjiantou1'></i>
            </div>
          </div> -->
          <div class='other_blcok'>
            <div class='type'>
              <span>运费</span>
            </div>
            <div>
              <span v-if='static_freight>0'>￥{{static_freight}}</span>
              <span v-if='static_freight==0||static_freight==undefined'>免运费</span>
            </div>
          </div>
          <div class='other_blcok'>
            <div class='type'>
              <span>支付方式</span>
            </div>
            <div style='display:inline-flex;align-items: center;'>
              <!-- @click="showModel('pay')" -->
              <div class="picker" style="font-size:0.24rem;color:#555;font-family:'DIN';">
                <img :src="imgPath+'sale/wx_pay.png'" style='width:1.48rem;height:0.53rem;vertical-align:middle;'
                  v-if="payId=='2'" />
                <img :src="imgPath+'sale/ali_pay.png'" style='width:1.48rem;height:0.5rem;vertical-align:middle;'
                  v-else />
              </div>
              <!-- <i class='iconfont icon-youjiantou1'></i> -->
            </div>
            <!-- <div>
              <img :src="imgPath+'sale/s_pay.jpg'" style='width:1.55rem;height:0.48rem;vertical-align:middle;' />
            </div> -->
          </div>
          <div class='other_blcok'
            v-if="orderDetail.total_score!=null&&orderDetail.total_score>0||orderType=='birthday'">
            <div class='type'>
              <span>应付积分</span>
            </div>
            <div>
              <span class='sure_score'>{{orderDetail.total_score}}积分</span>
            </div>
          </div>
          <div class='other_blcok'>
            <div class='type'>
              <span>应付总额</span>
            </div>
            <div>
              <span class='sure_price'>￥{{orderDetail.total_price}}</span>
            </div>
          </div>
          <!-- <div class='other_blcok'>
            <div class='type'>
              <span>买家留言：</span>
            </div>
            <div style='width:5rem;'>
              <input v-model='order_memo' placeholder="选填：填写内容已与卖家确认" style='width: 100%;outline: none;border: none;' />
            </div>
          </div> -->
        </div>
      </div>
      <div class='null_height'></div>
      <!-- <form bindsubmit="payOver" report-submit="true"> -->
      <div class='sure_btn'>
        <mt-button size="large" @click='payOver'>确认支付</mt-button>
      </div>
      <!-- </form> -->
    </div>
    <div class='model_bg' v-if='hiddenModel' @click="hideModel"></div>
    <div class='model' v-if='hiddenModel'>
      <div class='model_head'>
        <span @click="hideModel">取消</span>
        <span @click="choseModel">确认</span>
      </div>
      <!-- @change="onValuesChange" -->
      <div class='model_picker'>
        <mt-picker :slots="trackslots" @change="onValuesChange"></mt-picker>
      </div>
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

    <div class="model_stock_bg" v-if='showStock'></div>
    <div class="model_stock" v-if='showStock'>
      <div class="model_tips" v-if="allMissing">抱歉，本单购买的商品全部无法发货！</div>
      <div class="model_tips" v-if="!allMissing">抱歉，本单购买的商品暂时无法发货！</div>
      <div class="model_list">
        <div class="stock_pro" v-for="(item,index) in stokePro" :key='index'>
          <div class="pro_img">
            <img :src='item.img' class="pro" />
          </div>
          <div class="pro_info">
            <p class="title">{{item.name}}</p>
            <p class="num">数量：{{item.quantity}}</p>
          </div>
        </div>
      </div>
      <div class="model_btn">
        <button class="return_car btn_fullwidth" v-if="allMissing" @click="returnBack">返回修改</button>
        <button class="return_car btn_width" v-if="!allMissing" @click="returnBack">返回修改</button>
        <button class="remove_car btn_width" v-if="!allMissing" @click="removePro">移除无货商品</button>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  Toast,
  Picker
} from 'mint-ui'
import {
  getOrderByCar,
  getOrderByExchange,
  getOrderByBuy,
  getOrderByGroup,
  getPriceByTrack,
  submitOrder,
  submitGroupOrder,
  wxPay,
  checkSubmit
  //, isPayOk
} from '@/api/index'
import {
  mapMutations,
  mapGetters
} from 'vuex'
  // import {
  //   countDown
  // } from '@/store/pubilc.js'
  // import {
  //   parseTime
  // } from '@/store/pubilc.js'
  // import {
  //   setToken,
  //   getToken
  // } from '@/store/auth'
export default {
  name: 'SureOrder',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Toast,
    Picker
  },
  data() {
    return {
      imgPath: process.env.FilE_URL,
      h_title: '确认支付',
      try_id: '', // 试用id
      allowbind: true,
      orderSuccess: false,
      specNum: 1,
      ispayStep: false,
      pid: null,
      isFree: '',
      proDetail: [],
      couList: [],
      addList: [],
      payType: [],
      trackList: [],
      payslots: [{
        defaultIndex: 0,
        values: ['微信支付', '支付宝支付']
      }],
      trackslots: [{
        defaultIndex: 0,
        values: []
      }],
      channels: '',
      //   viewTrack: [],
      trackName: '选择物流',
      trackId: '',
      payId: 2, // 1是小程序微信支付，2是app微信支付，3是app支付宝支付
      addType: 0, // 直接下单3,购物车下单0,团购下单2
      addrId: 0,
      order_memo: '',
      staticAdd: [],
      static_freight: 0,
      chooseAdd: 0,
      couInfo: '选择优惠券',
      couId: '',
      couValue: -1,
      couCode: '',
      couRevise: false,
      addRevise: false,
      orderDetail: {
        total_price: 0,
        total_score: 0,
        freight: 0
      },
      hiddenCou: false,
      orderType: '', // 促销商品 flash 兑换商品point 拼团商品group 试用商try 抽奖兑换exchange
      order_pid: '',
      default_cou: '',
      hiddenModel: false,
      hiddenPay: false,
      paytype: 'wxPay',
      isgift: 0,
      showStock: false,
      allMissing: false
    }
  },
  mounted() {

  },
  activated() {
    console.log()
    if (document.getElementById('sureorder') != null) {
      document.getElementById('sureorder').scrollIntoView(false)
    }
    Indicator.open('加载中...')
    let options = this.$route.query
    // var pages = getCurrentPages()
    this.allowbind = true
    this.pid = options.id
    this.addType = options.addType
    if (options.try_id !== undefined) {
      this.try_id = options.try_id
    }
    if (options.proType !== undefined) {
      this.orderType = options.proType
    }
    if (options.group_normal !== undefined) {
      if (options.group_normal === 0 || options.group_normal === '0') {
        this.orderType = 'normal'
        this.hiddenCou = true
      } else {
        this.orderType = 'normal'
      }
    }
    if (options.genre != undefined) {
      if (this.orderType == 'exchange' && options.genre == 2) {
        this.orderType = 'super'
      }
    }
    console.log(this.hiddenCou)
    this.checkOrder()
    this.getOrder()
    if (window.localStorage.getItem('neworder') === 'true') {
      window.localStorage.setItem('memo', '')
      let data = {
        chooseAdd: 0,
        couInfo: '',
        couId: '',
        couCode: '',
        couList: [],
        default_cou: '',
        choseId: '',
        ship_id: '',
        addType: '',
        orderType: '',
        staticAdd: [],
        amount: '',
        static_freight: 0,
        couisrevise: false,
        addisRevise: false
      }
      this.setChoseAddr(data)
    }
    if (window.localStorage.getItem('memo') !== '') {
      this.order_memo = window.localStorage.getItem('memo')
    }
    let that = this
    let System = window.plus
    System.payment.getChannels(function (s) {
      that.channels = s
    }, function (e) {
      console.log('获取支付通道列表失败：' + e.message)
    })
  },
  methods: {
    ...mapMutations({
      setCarPro: 'SET_CARPRO',
      setChoseAddr: 'SET_CHOSEADDR'
    }),
    returnBack() {
      this.$router.goBack()
    },
    removePro() {
      console.log(this.stokePro)
      console.log(this.pid)
      let arr = this.pid.split(',')
      for (let j = 0; j < this.stokePro.length; j++) {
        arr.splice(arr.indexOf(this.stokePro[j].product_id), 1)
      }
      console.log(arr)
      console.log(arr)
      console.log(arr.join(','))
      this.$router.replace({
        path: '/sureOrder?addType=0&proType=normal&id=' + arr.join(',')
      })
    },
    goTop() {
      console.log('回到顶部')
      document.getElementById('sureorder').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    showModel(type) {
      if (type === 'track') {
        this.hiddenModel = true
      }
      if (type == 'pay') {
        this.hiddenPay = true
      }
    },
    hideModel() {
      this.hiddenModel = false
    },
    hidePayModel() {
      this.hiddenPay = false
    },
    onValuesChange(picker, values) {
      this.trackName = values[0]
    },
    onPayChange(picker, values) {
      if (values[0] == '微信支付') {
        this.paytype = 'wxPay'
      } else {
        this.paytype = 'aliPay'
      }
    },
    chosePayModel() {
      if (this.paytype == 'wxPay') {
        this.payId = 2
      } else {
        this.payId = 3
      }
      this.hiddenPay = false
    },
    choseModel() {
      for (var i = 0; i < this.trackList.length; i++) {
        if (this.trackList[i].row.name === this.trackName) {
          this.trackName = this.trackList[i].row.name
          this.trackslots[0].defaultIndex = i
          this.trackId = this.trackList[i].row.id
          this.static_freight = this.trackList[i].cost
        }
      }
      var that = this
      if (that.couCode.indexOf('c=') !== -1) {
        that.couCode = that.couCode.substring(2)
      }
      if (that.orderType === 'try' || that.orderType == 'scantry') {
        that.addType = 4
      } else if (that.orderType === 'point') {
        that.addType = 5
      } else if (that.orderType === 'birthday') {
        that.addType = 5
      } else if (that.orderType === 'scan') {
        that.addType = 3
      } else if (this.orderType == 'newpeople') {
        this.addType = 6
      }
      let addId = ''
      if (that.staticAdd.length > 0) {
        addId = that.staticAdd[0].id
      } else {
        addId = ''
      }
      let info = {
        shipmethod_id: that.trackId,
        coupon_code: that.couCode,
        coupon_id: that.couId,
        checked: that.pid,
        cart_type: that.addType,
        type: that.orderType,
        address_id: addId
      }
      getPriceByTrack(info).then(res => {
        if (res.isSuccess) {
          that.orderDetail.total_price = res.amount
          that.static_freight = res.cost_freight
          that.hiddenModel = false
        }
      })
    },
    golink: function (e) {
      let data = {
        couisrevise: false,
        addisRevise: false,
        chooseAdd: '',
        couInfo: '',
        couList: [],
        default_cou: '',
        static_freight: 0,
        choseId: '',
        ship_id: '',
        addType: '',
        orderType: '',
        staticAdd: [],
        amount: '',
        couCode: ''
      }
      this.setChoseAddr(data)
      if (this.couCode.indexOf('c=') !== -1) {
        data.choseId = this.couCode.substring(2)
      }
      data.couisrevise = this.couRevise
      data.addisRevise = this.addRevise
      data.couCode = this.couCode
      data.couList = this.couList
      data.couId = this.couId
      data.chooseAdd = this.chooseAdd
      data.couInfo = this.couInfo
      data.default_cou = this.default_cou
      data.ship_id = this.trackId
      data.addType = this.addType
      data.staticAdd = this.staticAdd
      data.orderType = this.orderType
      data.amount = this.orderDetail.total_price
      data.static_freight = this.static_freight
      if (this.order_memo !== '') {
        window.localStorage.setItem('memo', this.order_memo)
      }
      this.setChoseAddr(data)
      this.$router.togo({
        path: '/useCoupon?pid=' + this.order_pid
      })
      // wx.navigateTo({
      //   url: e.currentTarget.dataset.url + '?pid=' + this.order_pid
      // })
    },
    choseAdd: function () {
      if (this.orderType === 'try' || this.orderType == 'scantry') {
        this.addType = 4
      } else if (this.orderType === 'point') {
        this.addType = 5
      } else if (this.orderType === 'birthday') {
        this.addType = 5
      } else if (this.orderType === 'scan') {
        this.addType = 3
      } else if (this.orderType == 'newpeople') {
        this.addType = 6
      }
      let data = {
        chooseAdd: 0,
        couInfo: '',
        couId: '',
        couCode: '',
        couList: [],
        default_cou: '',
        choseId: '',
        ship_id: '',
        addType: '',
        orderType: '',
        staticAdd: [],
        amount: '',
        static_freight: 0,
        couisrevise: false,
        addisRevise: false
      }
      this.setChoseAddr(data)
      console.log(this.couCode)
      if (this.couCode.indexOf('c=') !== -1) {
        data.choseId = this.couCode.substring(2)
      }
      data.couisrevise = this.couRevise
      data.addisRevise = this.addRevise
      data.couCode = this.couCode
      data.chooseAdd = this.chooseAdd
      // data.couId = this.couList
      data.couInfo = this.couInfo
      data.couId = this.couId
      data.couList = this.couList
      data.default_cou = this.default_cou
      data.ship_id = this.trackId
      data.addType = this.addType
      data.staticAdd = this.staticAdd
      data.orderType = this.orderType
      data.static_freight = this.static_freight
      data.amount = this.orderDetail.total_price
      if (this.order_memo !== '') {
        window.localStorage.setItem('memo', this.order_memo)
      }
      this.setChoseAddr(data)
      // window.localStorage.setItem('neworder', false)
      this.$router.togo({
        path: '/editInfo?code=address&codename=我的地址&isInput=1&type=choose&pid=' + this.pid
      })
    },
    payOver: function (e) {
      console.log(this.couId)
      if (this.staticAdd.length <= 0) {
        Toast({
          message: '请选择收货地址',
          duration: 1000
        })
      } else if (this.allowbind) {
        var that = this
        if (that.channels[0].serviceReady == true) {
          this.allowbind = false
          Indicator.open('提交中...')
          let info = {
            checked: this.pid,
            cart_params: ''
          }
          console.log(that.channels)
          checkSubmit(info).then(e => {
            if (e.isSuccess) {
              if (that.orderType === 'try' || that.orderType == 'scantry') {
                that.addType = 4
              } else if (that.orderType === 'point') {
                that.addType = 5
              } else if (that.orderType === 'birthday') {
                that.addType = 5
              } else if (that.orderType === 'scan') {
                that.addType = 3
              } else if (that.orderType == 'newpeople') {
                that.addType = 6
              }
              console.log(that.orderType)
              if (that.orderType === 'group') {
                // wx.setStorageSync('chosePro', '')
                if (that.orderSuccess == false) {
                  let info = {
                    order_memo: that.order_memo,
                    cart_type: that.addType,
                    address_id: that.staticAdd[0].id,
                    shipmethod_id: that.trackId
                  // form_id: e.detail.formId
                  }
                  submitGroupOrder(info).then(req => {
                    Indicator.close()
                    that.orderSuccess = true
                    if (that.orderDetail.total_price <= 0) {
                      window.localStorage.setItem('memo', '')
                      that.$router.replace({
                        path: '/groupResult?type=pay&orderId=' + req.order_id
                      })
                    } else {
                      if (req.isSuccess) {
                        if (that.payId == 2) {
                          console.log('微信支付')
                          // 微信支付
                          info = {
                            id: req.order_id,
                            pay_id: that.payId,
                            pay_payment: 'wechatapp',
                            payment_id: req.payment_id
                          }
                        }
                        if (that.payId == 3) {
                          console.log('支付宝支付')
                          // 支付宝支付
                          info = {
                            id: req.order_id,
                            pay_id: that.payId,
                            pay_payment: 'alipayapp',
                            payment_id: req.payment_id
                          }
                        }
                        that.wxPayment(info)
                      } else {
                        that.allowbind = true
                        Toast({
                          message: req.msg,
                          duration: 1000
                        })
                      }
                    }
                  })
                } else {
                  that.allowbind = true
                  that.$router.replace({
                    path: '/order',
                    name: 'Order',
                    params: {
                      id: 1,
                      tid: 1
                    }
                  })
                }
              } else {
                if (that.orderSuccess == false) {
                  if (that.couCode.indexOf('c=') === -1) {
                    that.couCode = 'c=' + that.couCode
                  }
                  console.log('优惠券Code' + that.couCode)
                  console.log('优惠券id' + that.couId)
                  let info = {
                    checked: that.pid,
                    order_memo: that.order_memo,
                    is_point: 0,
                    print_freeze: 0,
                    total_amount: that.orderDetail.total_price,
                    cart_type: that.addType,
                    type: that.orderType,
                    cart_params: that.couCode,
                    address_id: that.staticAdd[0].id,
                    shipmethod_id: that.trackId,
                    coupon_id: that.couId,
                    // form_id: e.detail.formId,
                    try_id: that.try_id
                  }
                  submitOrder(info).then(res => {
                    if (res.isSuccess) {
                      console.log(res)
                      that.setCarPro([])
                      Indicator.close()
                      that.orderSuccess = true
                      if (that.orderDetail.total_price <= 0) {
                        window.localStorage.setItem('memo', '')
                        that.$router.replace({
                          path: '/paySuccess?addrId=' + that.staticAdd[0].id
                        })
                      } else {
                        let info = {}
                        if (that.payId == 2) {
                          console.log('微信支付')
                          // 微信支付
                          info = {
                            id: res.order_id,
                            pay_id: that.payId,
                            pay_payment: 'wechatapp',
                            payment_id: res.payment_id
                          }
                        }
                        if (that.payId == 3) {
                          console.log('支付宝支付')
                          // 支付宝支付
                          info = {
                            id: res.order_id,
                            pay_id: that.payId,
                            pay_payment: 'alipayapp',
                            payment_id: res.payment_id
                          }
                        }
                        Indicator.close()
                        that.wxPayment(info)
                      }
                    } else {
                      Indicator.close()
                      that.allowbind = true
                      Toast({
                        message: res.msg,
                        duration: 1000
                      })
                    }
                  })
                } else {
                  that.allowbind = true
                  that.$router.replace({
                    path: '/order',
                    name: 'Order',
                    params: {
                      id: 1,
                      tid: 1
                    }
                  })
                }
              }
            } else {
              Indicator.close()
              let arr = that.pid.split(',')
              if (e.data.length == arr.length) {
                that.allMissing = true
              }
              that.stokePro = e.data
              that.showStock = true
            }
          })
        } else {
          Toast({
            message: '当前没有安装微信，请到应用商店下载',
            duration: 1000
          })
        }
      } else {
        Toast({
          message: '操作过于频繁，请稍后重试',
          duration: 1000
        })
        setTimeout(() => {
          that.allowbind = true
        }, 1000)
        console.log('不允许重复点击')
      }
    },
    wxPayment(info) {
      let that = this
      console.log(info)
      wxPay(info).then(res => {
        console.log(res)
        if (res.isSuccess) {
          console.log(res.data)
          console.log('支付通道')
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
            console.log('验证支付回调是否成功')
            if (that.orderType === 'group') {
              window.localStorage.setItem('memo', '')
              that.$router.replace({
                path: '/groupResult?type=pay&orderId=' + info.id
              })
              that.allowbind = true
            } else {
              window.localStorage.setItem('memo', '')
              that.$router.replace({
                path: '/paySuccess?addrId=' + that.staticAdd[0].id
              })
            }
            // isPayOk({payment_id: info.payment_id}).then(payReq => {
            //   if (payReq.isSuccess) {
            //     if (that.orderType === 'group') {
            //       window.localStorage.setItem('memo', '')
            //       that.$router.replace({
            //         path: '/groupResult?type=pay&orderId=' + info.id
            //       })
            //       that.allowbind = true
            //     } else {
            //       window.localStorage.setItem('memo', '')
            //       that.$router.replace({
            //         path: '/paySuccess?addrId=' + that.staticAdd[0].id
            //       })
            //     }
            //   } else {
            //     console.log('支付完成回调失败')
            //     if (that.orderType === 'group') {
            //       window.localStorage.setItem('memo', '')
            //       that.$router.replace({
            //         path: '/groupResult?type=pay&orderId=' + info.id
            //       })
            //       that.allowbind = true
            //     } else {
            //       window.localStorage.setItem('memo', '')
            //       that.$router.replace({
            //         path: '/paySuccess?addrId=' + that.staticAdd[0].id
            //       })
            //     }
            //   }
            // })
          }, function (e) {
            console.log(e.message)
            that.allowbind = true
            that.$router.replace({
              path: '/order',
              name: 'Order',
              params: {
                id: 1,
                tid: 1
              }
            })
          })
          // setTimeout(() => {
          //   that.allowbind = true
          // }, 1000)
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
    checkOrder() {
      let info = {
        checked: this.pid,
        cart_params: ''
      }
      let that = this
      checkSubmit(info).then(res => {
        if (res.isSuccess) {
          that.stokePro = []
          that.showStock = false
        } else {
          Indicator.close()
          let arr = that.pid.split(',')
          if (res.data.length == arr.length) {
            that.allMissing = true
          }
          that.stokePro = res.data
          that.showStock = true
          that.allMissing = that.allMissing
        }
      })
    },
    getOrder() {
      var that = this
      //   var url = ''
      that.staticAdd = []
      console.log(that.addType)
      if (that.addType === '0') {
        // 购物车下单确认订单页
        let info = {
          checked: that.pid,
          cart_params: ''
        }
        getOrderByCar(info).then(res => {
          Indicator.close()
          if (res.isSuccess) {
            that.orderDetail = {
              total_price: res.amount,
              total_score: res.point_use,
              freight: res.cost_freight
            }
            if (res.row_address != null) {
              that.chooseAdd = 0
              that.staticAdd.push(res.row_address)
            } else {
              that.chooseAdd = -1
            }
            if (res.coupon_code.indexOf('c=') === -1) {
              res.coupon_code = 'c=' + res.coupon_code
            }
            if (res.coupon_discount > 0) {
              that.couValue = res.coupon_discount
              that.couInfo = '已减' + res.coupon_discount + '元'
            }
            that.couCount = res.coupon_discount
            that.proDetail = res.rows_product
            that.payType = res.rows_payments
            // that.payId = res.payment_id
            // that.orderDetail = that.orderDetail
            that.couList = res.xianjinquans
            that.addList = res.rows_address
            that.staticAdd = that.staticAdd
            that.couInfo = that.couInfo
            that.addrId = res.address_id
            that.chooseAdd = that.chooseAdd
            that.default_cou = res.coupon_code
            that.couCode = res.coupon_code
            that.couId = res.coupon_id
            that.trackList = res.rows_shipmethod
            that.static_freight = res.cost_freight
            console.log('运费' + that.static_freight)
            that.isFree = res.free_freight
            var arr = []
            for (var i = 0; i < that.proDetail.length; i++) {
              for (var j = 0; j < that.proDetail[i].rows_product.length; j++) {
                arr.push(that.proDetail[i].rows_product[j].product_id)
              }
            }
            var list = []
            for (let i = 0; i < res.rows_shipmethod.length; i++) {
              list.push(res.rows_shipmethod[i].row.name)
            }
            that.order_pid = arr.join(',')
            that.trackslots[0].values = list
            that.trackName = res.rows_shipmethod[0].row.name
            that.trackId = res.rows_shipmethod[0].row.id
            console.log(window.localStorage.getItem('neworder') === 'false')
            if (window.localStorage.getItem('neworder') === 'false') {
              // 选择完地址或者优惠券，或者物流回传的信息
              let afterInfo = that.$store.state.home.choseAddr
              console.log(afterInfo)
              if (afterInfo.couInfo !== undefined) {
                that.couInfo = afterInfo.couInfo
                that.couValue = afterInfo.couValue
                that.couCode = afterInfo.couCode
                that.couId = afterInfo.couId
                that.orderDetail.total_price = afterInfo.amount
                let choseadd = ''
                let staticadd = ''
                let listcou = []
                that.addRevise = afterInfo.addisRevise
                // 选择优惠券不一定传递了地址
                console.log('是否更换了地址' + afterInfo.addisRevise)
                if (that.addRevise !== undefined) {
                  choseadd = afterInfo.chooseAdd
                  staticadd = afterInfo.staticAdd
                } else {
                  choseadd = that.chooseAdd
                  staticadd = that.staticAdd
                }
                that.couRevise = afterInfo.couisrevise
                // 状态管理器存在优惠券列表说明被更改过，传递更改后的值
                console.log('是否更换过优惠券' + afterInfo.couisrevise)
                if (that.couRevise) {
                  listcou = afterInfo.couList
                } else {
                  listcou = that.couList
                }
                console.log(listcou)
                that.chooseAdd = choseadd
                that.staticAdd = staticadd
                that.couList = listcou
                console.log('运费' + afterInfo.static_freight)
                that.static_freight = afterInfo.static_freight
                if (that.couValue === null) {
                  that.couInfo = '选择优惠券'
                }
              }
              if (window.localStorage.getItem('sure_add') == 0) {
                that.staticAdd = []
                that.chooseAdd = -1
              }
              console.log(that.orderDetail)
            } else {
              console.log('从商品详情进来')
              let data = {
                chooseAdd: 0,
                couInfo: '',
                couId: '',
                couCode: '',
                couList: [],
                default_cou: '',
                choseId: '',
                ship_id: '',
                addType: '',
                orderType: '',
                staticAdd: [],
                amount: '',
                static_freight: 0,
                couisrevise: false,
                addisRevise: false
              }
              console.log(that.couValue)
              if (that.couValue === null || that.couValue == 0 || that.couValue == undefined) {
                that.couInfo = '选择优惠券'
              }
              this.setChoseAddr(data)
            }
          } else {
            Toast({
              message: res.msg,
              duration: 1000
            })
            setTimeout(function () {
              that.$router.back()
            }, 1000)
          }
        })
      } else if (that.addType === '3') {
        console.log(that.orderType)
        // 直接下单
        if (that.orderType === 'exchange' || that.orderType === 'super' || that.orderType === 'try' || that.orderType === 'point' || that
          .orderType === 'birthday' || that.orderType === 'scan' || that.orderType === 'scantry' || that.orderType === 'newpeople') {
          // 兑换确认订单页
          // 改变上一个页面的数据
          //   var pages = getCurrentPages()
          //   var prevPage = pages[pages.length - 2] // 上一个页面
          //   prevPage.setData({
          //     allowbind: true
          //   })
          let info = {
            checked: that.pid,
            type: that.orderType
          }
          getOrderByExchange(info).then(res => {
            Indicator.close()
            if (res.isSuccess) {
              that.orderDetail = {
                total_price: res.amount,
                total_score: res.point_use,
                freight: res.cost_freight
              }
              if (res.row_address != null) {
                that.chooseAdd = 0
                that.staticAdd.push(res.row_address)
              } else {
                that.chooseAdd = -1
              }
              that.proDetail = res.rows_product
              that.payType = res.rows_payments
              // that.payId = res.payment_id
              that.orderDetail = that.orderDetail
              that.couList = res.xianjinquans
              that.addList = res.rows_address
              that.staticAdd = that.staticAdd
              that.addrId = res.address_id
              that.chooseAdd = that.chooseAdd
              that.trackList = res.rows_shipmethod
              that.static_freight = res.cost_freight
              that.isFree = res.free_freight
              let list = []
              for (let i = 0; i < res.rows_shipmethod.length; i++) {
                list.push(res.rows_shipmethod[i].row.name)
              }
              that.trackslots[0].values = list
              that.trackName = res.rows_shipmethod[0].row.name
              that.trackId = res.rows_shipmethod[0].row.id
              console.log(that.$store.state.home.choseAddr)
              if (window.localStorage.getItem('neworder') === 'false') {
                // 选择完地址或者优惠券，或者物流回传的信息
                let afterInfo = that.$store.state.home.choseAddr
                console.log(afterInfo)
                if (afterInfo.couInfo !== undefined) {
                  that.couInfo = afterInfo.couInfo
                  that.couValue = afterInfo.couValue
                  that.couCode = afterInfo.couCode
                  that.couId = afterInfo.couId
                  that.orderDetail.total_price = afterInfo.amount
                  let choseadd = ''
                  let staticadd = ''
                  let listcou = []
                  that.addRevise = afterInfo.addisRevise
                  // 选择优惠券不一定传递了地址
                  console.log('是否更换了地址' + afterInfo.addisRevise)
                  if (that.addRevise !== undefined) {
                    choseadd = afterInfo.chooseAdd
                    staticadd = afterInfo.staticAdd
                  } else {
                    choseadd = that.chooseAdd
                    staticadd = that.staticAdd
                  }
                  that.couRevise = afterInfo.couisrevise
                  // 状态管理器存在优惠券列表说明被更改过，传递更改后的值
                  console.log('是否更换过优惠券' + afterInfo.couisrevise)
                  if (that.couRevise) {
                    listcou = afterInfo.couList
                  } else {
                    listcou = that.couList
                  }
                  that.chooseAdd = choseadd
                  that.staticAdd = staticadd
                  that.couList = listcou
                  console.log('运费' + afterInfo.static_freight)
                  that.static_freight = afterInfo.static_freight
                  if (that.couValue === null) {
                    that.couInfo = '选择优惠券'
                  }
                }
                if (window.localStorage.getItem('sure_add') == 0) {
                  that.staticAdd = []
                  that.chooseAdd = -1
                }
                console.log(that.orderDetail)
              } else {
                console.log('从商品详情进来')
                let data = {
                  chooseAdd: 0,
                  couInfo: '',
                  couId: '',
                  couCode: '',
                  couList: [],
                  default_cou: '',
                  choseId: '',
                  ship_id: '',
                  addType: '',
                  orderType: '',
                  staticAdd: [],
                  amount: '',
                  static_freight: 0,
                  couisrevise: false,
                  addisRevise: false
                }
                console.log(that.couValue)
                if (that.couValue === null || that.couValue == 0 || that.couValue == undefined) {
                  that.couInfo = '选择优惠券'
                }
                this.setChoseAddr(data)
              }
            } else {
              Toast({
                message: res.msg,
                duration: 1000
              })
              setTimeout(function () {
                that.$router.back()
              }, 1000)
            }
          })
        } else {
          // 直接下单确认订单页
          let info = {
            checked: that.pid,
            cart_params: '',
            type: 'normal'
          }
          getOrderByBuy(info).then(res => {
            Indicator.close()
            if (res.isSuccess) {
              that.orderDetail = {
                total_price: res.amount,
                total_score: res.point_use,
                freight: res.cost_freight
              }
              that.isgift = res.rows_product[0].is_gift
              console.log(that.isgift)
              console.log(res.rows_product[0].is_gift)
              if (res.coupon_discount > 0) {
                that.couValue = res.coupon_discount
              }
              if (res.row_address != null) {
                that.chooseAdd = 0
                that.staticAdd.push(res.row_address)
              } else {
                that.chooseAdd = -1
              }
              if (that.couValue !== -1) {
                if (res.coupon_code.indexOf('c=') === -1) {
                  res.coupon_code = 'c=' + res.coupon_code
                }
                that.couInfo = '已减' + that.couValue + '元'
              }

              that.setDatacouCount = res.coupon_discount
              that.proDetail = res.rows_product
              that.payType = res.rows_payments
              // that.payId = res.payment_id
              that.orderDetail = that.orderDetail
              that.couList = res.xianjinquans
              that.addList = res.rows_address
              that.staticAdd = that.staticAdd
              that.couInfo = that.couInfo
              that.addrId = res.address_id
              that.chooseAdd = that.chooseAdd
              that.default_cou = res.coupon_code
              that.couCode = res.coupon_code
              that.couId = res.coupon_id
              that.trackList = res.rows_shipmethod
              that.static_freight = res.cost_freight
              let arr = []
              for (var i = 0; i < that.proDetail.length; i++) {
                for (var j = 0; j < that.proDetail[i].rows_product.length; j++) {
                  arr.push(that.proDetail[i].rows_product[j].product_id)
                }
              }
              let list = []
              for (let i = 0; i < res.rows_shipmethod.length; i++) {
                list.push(res.rows_shipmethod[i].row.name)
              }
              that.order_pid = arr.join(',')
              that.trackslots[0].values = list
              that.trackName = res.rows_shipmethod[0].row.name
              that.trackId = res.rows_shipmethod[0].row.id
              console.log(that.$store.state.home.choseAddr)
              if (window.localStorage.getItem('neworder') === 'false') {
                // 选择完地址或者优惠券，或者物流回传的信息
                let afterInfo = that.$store.state.home.choseAddr
                console.log(afterInfo)
                console.log(afterInfo.couInfo)
                if (afterInfo.couInfo !== undefined) {
                  that.couInfo = afterInfo.couInfo
                  that.couValue = afterInfo.couValue
                  that.couCode = afterInfo.couCode
                  that.couId = afterInfo.couId
                  that.orderDetail.total_price = afterInfo.amount
                  let choseadd = ''
                  let staticadd = ''
                  let listcou = []
                  that.addRevise = afterInfo.addisRevise
                  // 选择优惠券不一定传递了地址
                  console.log('是否更换了地址' + afterInfo.addisRevise)
                  if (that.addRevise !== undefined) {
                    choseadd = afterInfo.chooseAdd
                    staticadd = afterInfo.staticAdd
                  } else {
                    choseadd = that.chooseAdd
                    staticadd = that.staticAdd
                  }
                  that.couRevise = afterInfo.couisrevise
                  // 状态管理器存在优惠券列表说明被更改过，传递更改后的值
                  console.log('是否更换过优惠券' + afterInfo.couisrevise)
                  if (that.couRevise) {
                    listcou = afterInfo.couList
                  } else {
                    listcou = that.couList
                  }
                  that.chooseAdd = choseadd
                  that.staticAdd = staticadd
                  that.couList = listcou
                  console.log('运费' + afterInfo.static_freight)
                  that.static_freight = afterInfo.static_freight
                  if (that.couValue === null) {
                    that.couInfo = '选择优惠券'
                  }
                }
                if (window.localStorage.getItem('sure_add') == 0) {
                  that.staticAdd = []
                  that.chooseAdd = -1
                }
                console.log(that.orderDetail)
              } else {
                console.log('从商品详情进来')
                let data = {
                  chooseAdd: 0,
                  couInfo: '',
                  couId: '',
                  couCode: '',
                  couList: [],
                  default_cou: '',
                  choseId: '',
                  ship_id: '',
                  addType: '',
                  orderType: '',
                  staticAdd: [],
                  amount: '',
                  static_freight: 0,
                  couisrevise: false,
                  addisRevise: false
                }
                console.log(that.couValue)
                if (that.couValue === null || that.couValue == 0 || that.couValue == undefined) {
                  that.couInfo = '选择优惠券'
                }
                this.setChoseAddr(data)
              }
            } else {
              Toast({
                message: res.msg,
                duration: 1000
              })
              setTimeout(function () {
                that.$router.back()
              }, 1000)
            }
          })
        }
      } else if (that.addType === '2') {
        // 团购下单确认订单页
        let info = {}
        getOrderByGroup(info).then(res => {
          Indicator.close()
          if (res.isSuccess) {
            that.orderDetail = {
              total_price: res.amount,
              total_score: res.point_use,
              freight: res.cost_freight
            }
            if (res.row_address != null) {
              that.chooseAdd = 0
              that.staticAdd.push(res.row_address)
            } else {
              that.chooseAdd = -1
            }
            that.proDetail = res.rows_product
            that.payType = res.rows_payments
            // that.payId = res.payment_id
            that.orderDetail = that.orderDetail
            that.couList = res.xianjinquans
            that.addList = res.rows_address
            that.staticAdd = that.staticAdd
            that.addrId = res.address_id
            that.chooseAdd = that.chooseAdd
            that.trackList = res.rows_shipmethod
            that.static_freight = res.cost_freight
            that.isFree = res.free_freight
            let list = []
            for (let i = 0; i < res.rows_shipmethod.length; i++) {
              list.push(res.rows_shipmethod[i].row.name)
            }
            that.trackslots[0].values = list
            that.trackName = res.rows_shipmethod[0].row.name
            that.trackId = res.rows_shipmethod[0].row.id
            console.log(that.$store.state.home.choseAddr)
            if (window.localStorage.getItem('neworder') === 'false') {
              // 选择完地址或者优惠券，或者物流回传的信息
              let afterInfo = that.$store.state.home.choseAddr
              console.log(afterInfo)
              if (afterInfo.couInfo !== undefined) {
                that.couInfo = afterInfo.couInfo
                that.couValue = afterInfo.couValue
                that.couCode = afterInfo.couCode
                that.couId = afterInfo.couId
                that.orderDetail.total_price = afterInfo.amount
                let choseadd = ''
                let staticadd = ''
                let listcou = []
                that.addRevise = afterInfo.addisRevise
                // 选择优惠券不一定传递了地址
                console.log('是否更换了地址' + afterInfo.addisRevise)
                if (that.addRevise !== undefined) {
                  choseadd = afterInfo.chooseAdd
                  staticadd = afterInfo.staticAdd
                } else {
                  choseadd = that.chooseAdd
                  staticadd = that.staticAdd
                }
                that.couRevise = afterInfo.couisrevise
                // 状态管理器存在优惠券列表说明被更改过，传递更改后的值
                console.log('是否更换过优惠券' + afterInfo.couisrevise)
                if (that.couRevise) {
                  listcou = afterInfo.couList
                } else {
                  listcou = that.couList
                }
                that.chooseAdd = choseadd
                that.staticAdd = staticadd
                that.couList = listcou
                console.log('运费' + afterInfo.static_freight)
                that.static_freight = afterInfo.static_freight
                if (that.couValue === null) {
                  that.couInfo = '选择优惠券'
                }
              }
              if (window.localStorage.getItem('sure_add') == 0) {
                that.staticAdd = []
                that.chooseAdd = -1
              }
              console.log(that.orderDetail)
            } else {
              console.log('从商品详情进来')
              let data = {
                chooseAdd: 0,
                couInfo: '',
                couId: '',
                couCode: '',
                couList: [],
                default_cou: '',
                choseId: '',
                ship_id: '',
                addType: '',
                orderType: '',
                staticAdd: [],
                amount: '',
                static_freight: 0,
                couisrevise: false,
                addisRevise: false
              }
              console.log(that.couValue)
              if (that.couValue === null || that.couValue == 0 || that.couValue == undefined) {
                that.couInfo = '选择优惠券'
              }
              this.setChoseAddr(data)
            }
          } else {
            Toast({
              message: res.msg,
              duration: 1000
            })
            setTimeout(function () {
              that.$router.back()
            }, 1000)
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters(['number', 'carnum', 'isbind', 'score', 'news', 'newsnum', 'issign'])
  },
  beforeDestroy() {
    if (window.localStorage.getItem('neworder') === 'true') {
      window.localStorage.setItem('memo', '')
    }
  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .sure_order {
    /* font-family: SimHei; */
    background: #f2f2f2;
    overflow-x: hidden;
  }

  .sure_body {
    background: #f2f2f2;
  }

  .sure_body .sure_head {
    /* height: 160/100rem; */
    position: relative;
    margin-bottom: 12/100rem;
  }

  .sure_head .sure_addr {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 152/100rem;
    padding: 16/100rem 24/100rem;
    background: #fff;
  }

  .add_tips {
    font-size: 32/100rem;
    color: #555;
    font-family: 'DIN';
  }

  .sure_addr .sure_addr_info {
    font-size: 24/100rem;
    color: #888;
    font-family: 'DIN';
    display: flex;
    align-items: center;
    width: 98%;
  }

  .sure_addr_info div .add_more {
    font-size: 28/100rem;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 3rem;
    display: inline-block;
  }

  .sure_addr_info div .static {
    width: 56/100rem;
    height: 24/100rem;
    line-height: 24/100rem;
    border: 2/100rem solid #ff4e79;
    font-size: 20/100rem;
    color: #ff4e79;
    border-radius: 5/100rem;
    display: inline-block;
    text-align: center;
    margin-left: 52/100rem;
  }

  .sure_head img {
    position: absolute;
    width: 100%;
    height: 8/100rem;
    bottom: 0;
  }

  .sure_pro {
    // height: 358/100rem;
    background: #fff;
    margin-bottom: 12/100rem;
  }

  .sure_pro .sure_pro_title {
    font-size: 30/100rem;
    padding: 0 26/100rem;
    height: 86/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ebebeb;
  }

  .sure_pro .sure_pro_title .third_title {
    color: #444;
    font-weight: bold;
  }

  .sure_pro .sure_pro_title .order_tag {
    background: #ff4e79;
    height: 28/100rem;
    padding: 0 8/100rem;
    font-size: 20/100rem;
    color: #fff;
    border-radius: 8/100rem;
    line-height: 28/100rem;
    text-align: center;
    display: inline-block;
    margin-right: 10/100rem;
  }

  .pro_block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 26/100rem;
    height: 86/100rem;
    border-bottom: 1px dashed #ebebeb;
  }

  .pro_block:last-child {
    border-bottom: none;
  }

  .pro_block span {
    color: #999;
    font-size: 24/100rem;
  }

  .pro_block .pro_tips {
    margin-right: 4/100rem;
    display: flex;
  }

  .sure_pro .car_pro {
    padding: 0.26rem;
    min-height: 2.62rem;
    background: #fff;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    align-items: center;
  }

  .car_pro .pro_img {
    float: left;
    /* margin-left: 18/100rem; */
    margin-right: 30/100rem;
    position: relative;
  }

  .pro_img img {
    width: 190/100rem;
    height: 186/100rem;
  }

  .pro_img .pro_tips {
    width: 190/100rem;
    height: 52/100rem;
    background: rgba(0, 0, 0, 0.6);
    line-height: 52/100rem;
    text-align: center;
    position: absolute;
    bottom: 0;
  }

  .pro_tips span {
    // color: #fff;
    font-size: 24/100rem;
  }

  .car_pro .pro_info {
    width: 100%;
  }

  .pro_info .pro_title {
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #444;
    /* margin-top: 30/100rem; */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .pro_info .pro_spec {
    overflow: hidden;
    /* height: 64/100rem; */
    /* display: flex;
  align-items: center;
  justify-content: space-between; */
  }

  .pro_spec .pro_price {
    font-family: 'DIN';
    width: 240/100rem;
  }

  .pro_price .peo_nowprice {
    color: #ff4e79;
    font-size: 30/100rem;
    font-weight: bold;
    /* margin-right: 8/100rem; */
  }

  .pro_price .pro_integral {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff4e79;
    /* margin-left: 8/100rem; */
  }

  .pro_price .pro_integral_add {
    color: #ff4e79;
    font-size: 30/100rem;
    font-weight: bold;
  }

  .pro_price .pro_inter_img {
    display: inline-flex;
    align-items: flex-end;
  }

  .pro_price .pro_inter_img .iconfont {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff4e79;
    display: inline-flex;
  }

  .pro_price .pro_inter_img img {
    width: 24/100rem;
    height: 20/100rem;
  }

  .pro_price .pro_orig {
    font-size: 24/100rem;
    color: #b8b8b8;
    text-decoration: line-through;
  }

  .pro_price .pro_icon {
    color: #888;
    font-size: 28/100rem;
  }

  .pro_weight span {
    font-size: 28/100rem;
    color: #888;
    font-weight: 'DIN';
  }

  .pro_num {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 26/100rem;
    height: 86/100rem;
  }

  .pro_num span {
    color: #999;
    font-size: 24/100rem;
  }

  .pro_num .pro_icon {
    margin-right: 4/100rem;
    display: flex;
    /* border: 1px solid #ccc;
  border-radius: 6/100rem; */
  }

  .pro_num .pro_icon span {
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #565656;
  }

  .pro_num .pro_icon button {
    width: 44/100rem;
    height: 44/100rem;
    line-height: 42/100rem;
    padding: 0 22/100rem;
    margin: 0;
    color: #9f9f9f;
    font-size: 38/100rem;
    display: flex;
    justify-content: center;
    border-radius: 0;
    background: #f3f3f3;
  }

  .pro_num .pro_icon button::after {
    border: none;
  }

  .pro_num .pro_icon input {
    width: 70/100rem;
    height: 44/100rem;
    min-height: 44/100rem;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 0;
    font-size: 30/100rem;
    //   font-weight: bold;
    color: #565656;
    text-align: center;
    display: flex;
    align-items: center;
    font-family: 'DIN';
  }

  .sure_other {
    background: #fff;
  }

  .sure_other .other_blcok {
    padding: 0 26/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100/100rem;
    line-height: 100/100rem;
    border-bottom: 2/100rem solid #e0e0e0;
    color: #999;
    font-size: 24/100rem;
  }

  .other_blcok .type span {
    color: #999;
    font-size: 24/100rem;
  }

  .other_blcok div span {
    color: #555;
    font-size: 24/100rem;
    font-family: 'DIN';
  }

  .other_blcok div icon {
    margin-left: 30/100rem;
  }

  .other_blcok div .sure_score {
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #666;
    /* margin-right: 30/100rem; */
  }

  .other_blcok div .sure_price {
    font-size: 50/100rem;
    color: #ff4e79;
  }

  /* 空白的块，解决底部导航占领高度 */

  .null_height {
    height: 100/100rem;
  }

  .sure_btn {
    box-shadow: 0 8/100rem 20/100rem 16/100rem #dadada;
    position: fixed;
    bottom: 0;
    //   height: 100/100rem;
    width: 100%;
    z-index: 100;
  }

  .sure_btn button {
    background: #ff4e79;
    color: #fff;
    font-size: 40/100rem;
    border-radius: 0;
  }

  .surecountdown {
    position: absolute;
    color: #fff;
    top: 16/100rem;
    right: 26/100rem;
  }

  .surecountdown i {
    margin-right: 6/100rem;
  }

  .model_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 202;

  }

  .model {
    width: 100%;
    height: 60vh;
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

  .model_stock_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 202;
  }

  .model_stock {
    width: 6.4rem;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 203;
    min-height: 4.8rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.26rem;

    .model_tips {
      width: 4.32rem;
      height: 0.82rem;
      font-size: 0.36rem;
      font-weight: 600;
      color: rgba(0, 0, 0, 1);
      opacity: 0.85;
      margin: 0 auto;
      margin-top: 0.52rem;
      text-align: center;
    }

    .model_list {
      margin: 0.42rem 0.28rem;
      max-height: 3.8rem;
      overflow-y: scroll;

      .stock_pro {
        display: flex;
        align-content: center;
        margin-bottom: 0.34rem;

        .pro_img {
          width: 1.28rem;
          height: 1.28rem;
          margin-right: 0.26rem;

          .pro {
            width: 100%;
            height: 100%;
            vertical-align: middle;
            font-size: 0
          }
        }

        .pro_info {
          p {}

          .title {
            width: 4.18rem;
            font-size: 0.28rem;
            font-family: PingFang SC;
            color: rgba(0, 0, 0, 1);
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            display: -webkit-box;
          }

          .num {
            margin-top: 0.16rem;
            font-size: 0.26rem;
            font-weight: 600;
            color: rgba(0, 0, 0, 1);
            opacity: 0.5;
          }
        }
      }

      .stock_pro:last-child {
        margin-bottom: 0;
      }
    }

    .model_btn {
      margin: 0.36rem 0;
      text-align: center;

      button {
        outline: none;
        background: transparent;
        box-shadow: none;
        border: none;
        border-radius: 0.36rem;
        font-size: 0.3rem;
        padding: 0;
        margin: 0;
      }

      .btn_width {
        width: 2.2rem;
        height: 0.72rem;
      }

      .return_car {
        background: rgba(232, 232, 232, 1);
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
        opacity: 0.5;
        // margin-left: 0.96rem;
      }

      .remove_car {
        background: rgba(0, 0, 0, 1);
        opacity: 0.85;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        margin-left: 0.32rem;
      }

      .btn_fullwidth {
        width: 578/100rem;
        height: 72/100rem;
        background: rgba(0, 0, 0, 1);
        opacity: 0.85;
        font-size: 30/100rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        margin: 0 auto;
      }

    }
  }

</style>
