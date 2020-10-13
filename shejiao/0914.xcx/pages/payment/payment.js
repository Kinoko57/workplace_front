// pages/payment/payment.js
var app = getApp()
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    staticUrl: app.globalData.staticUrl,
    filePath: app.globalData.fileUrl,
    is_iphonex: app.globalData.isiPhoneX,
    detailshow:true,
    animation:{},
    couList: [],//优惠劵列表
    showModel: false,
    discountShow: false, // 优惠信息
    showSkeleton:true,
    team_id:0,
    messages:{},
    show_type:'pro',
    pro_allNum:0,//所有清单数字
    orderInfo:{},
    address:'',
    address_id:'',
    options:{},
    showErrContent:'',
    showErr:false
  },
  bindinput(e){
    this.data.orderInfo.suppliers[e.currentTarget.dataset.index].message=e.detail.value
    this.setData({
      orderInfo:this.data.orderInfo
    })
  },
  bindblur(e){
    const that=this
    if(e.detail.value!=''){
      let arr={}
      for(let i=0;i<that.data.orderInfo.suppliers.length;i++){
        arr[that.data.orderInfo.suppliers[i].id] = that.data.orderInfo.suppliers[i].message
      }
      that.data.messages=arr
      this.getOrderInfo()
    }
  },
  // 跳转到收货地址列表
  choseAddress(){
    wx.navigateTo({
      url: '../myAdress/myAdress?type=chose',
    })
  },
  showDiscount() {
    this.setData({
      showModel: true,
      discountShow: true,
    })
  },
  hidenModel() {
    this.setData({
      showModel: false,
      discountShow: false,
    })
  },
  // 获取商品相关的优惠券
  getCoupon(){
    let that = this
    util.queryRequest('/app/coupon/getGoodsCouponShop', {
      goods_id: '135,136,137,95',
    }, 'GET').then(function (res) {
      if (res.code == 200) {
        console.log("获取商品详情的优惠券")
        console.log(res.data.coupon)
        for(let i = 0;i<res.data.coupon.length;i++){
          res.data.coupon[i].is_get = 0
        }
        that.setData({
          couList: res.data.coupon,
        })
      }
    }).catch(function (res) {})
  },
  // 领取优惠券
  getCou:util.throttle(function(e){
    let that = this
    if(e[0].currentTarget.dataset.get==1){
      wx.showToast({
        title: '您已经领过啦~',
        icon: 'none',
        duration: 1000
      })
    }else{
      console.log(e[0].currentTarget.id)
      let info ={
        coupon_id: e[0].currentTarget.id
      }
      let index = e[0].currentTarget.dataset.index
      that.data.couList[index].is_get = 1
      util.queryRequest('/app/coupon/couponReceive',info,'GET').then(function(res){
        if(res.code == 200){
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 1000
          })
          that.setData({
            couList: that.data.couList
          })
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
    }

  }),
  // 显示清单列表
  showdisc: function (e) {
    const that = this
    this.setData({
      detailshow: false,
      show_type:e.currentTarget.dataset.type
    })
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out',
    })
    this.animation = animation
    var querys = wx.createSelectorQuery()
    querys.select('.pro_disc_detail').boundingClientRect()
    querys.exec(function (res) {
      console.log(res)
      that.animation.translateY(-res[0].height).step()
      that.setData({
        animation: that.animation.export()
      })
    })
  },
  // 关闭清单列表
  closedisc: function () {
    this.animation.translateY(0).step()
    this.setData({
      animation: this.animation.export(),
      detailshow: true,
    })
  },
  // 获取确认订单信息
  getOrderInfo(){
    const that=this
    let type = that.data.options.type
    let url=''
    let obj={}
    //普通商品下单0 1 限时抢购 2体验专区, 3 限量礼盒（已没有）,4每日秒杀, 5拼团, 6晋升专区,8新人专享,100 自定义专题活动
    if(type == -1){
      // 购物车下单
      url = '/app/confirm/cartBuy'
      obj = {
        cart_id: that.data.options.cart_id,
        address_id: that.data.address_id,
        messages:JSON.stringify(that.data.messages),
        invoice: '',
        coupoun_id: '',
      }
    }else if(type != -1){
      url = '/app/confirm/confirm'
      obj = {
        act_type:that.data.options.type,
        goods_id: that.data.options.goods_id,
        product_id: that.data.options.product_id,
        num: that.data.options.num,
        act_id: that.data.options.act_id,
        messages: JSON.stringify(that.data.messages),
        address_id: that.data.address_id,
        invoice: '',
        coupoun_id: '',
        team_id:that.data.team_id!=undefined?that.data.team_id:'',
      }
    }
    console.log(that.data.messages)
    util.queryRequest(url, obj, 'POST').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          orderInfo: res.data,
          pro_allNum:res.data.detail_list_num,
          address: res.data.address!=null?res.data.address:'',
          address_id: res.data.address== null ? '' : res.data.address.id,
          showSkeleton: false,
          scrollHeight: app.globalData.useWindowHeight
        })
      } else {
        // wx.showToast({
        //   title: res.msg,
        //   icon: 'none',
        //   duration: 1000000
        // })
        that.setData({
          showErrContent:res.msg,
          showErr:true
        })
        setTimeout(function(){
          wx.navigateBack({
            detal:1
          })
        },1000)
        console.log(res.msg)
      }
    })
  },
  // 提交订单
  subOrder:function(){
    const that=this
    console.log(that.data.address_id)
    if (that.data.address_id!=''&&that.data.address_id!=undefined){
      let type = that.data.options.type
      let url = ''
      let obj = {}
     //普通商品下单0 1 限时抢购 2体验专区, 3 限量礼盒（已没有）4,每日秒杀5拼团6晋升专区,8新人专享 100 自定义专题活动
      if(type == -1){
        // 购物车下单
        url = '/app/createOrder/cartBuy'
        obj = {
          cart_id: that.data.options.cart_id,
          address_id: that.data.address_id,
          messages:JSON.stringify(that.data.messages),
          invoice: '',
          coupoun_id: '',
        }
      }else if(type != -1){
        url = '/app/createOrder/createOrder'
        obj = {
          act_type:that.data.options.type,
          goods_id: that.data.options.goods_id,
          product_id: that.data.options.product_id,
          num: that.data.options.num,
          act_id: that.data.options.act_id,
          messages: JSON.stringify(that.data.messages),
          address_id: that.data.address_id,
          invoice: '',
          coupoun_id: '',
          team_id:that.data.team_id!=undefined?that.data.team_id:'',
        }
      }
       wx.showLoading({
        title: '订单提交中...',
      })
      console.log(that.data.orderInfo,that.data.address,"值")
      util.queryRequest(url,obj, 'POST').then(function (req) {
        if (req.code === 200 || req.code === '200') {
          wx.hideLoading()
          if(req.data==true){
            wx.showToast({
              title: '已为你支付成功',
              icon: 'success',
              duration: 1000
            })
            let obj={
              price:that.data.orderInfo.price,
            } 
            // wx.setStorageSync('comformInfo', obj)
            setTimeout(function(){
              // wx.redirectTo({
              //   url: '../conformOrder/conformOrder',
              // })
              wx.redirectTo({
                url: '../paySuccess/paySuccess?pay_price='+that.data.orderInfo.price,
              })
            },1000)
          }else{
            let pay_id = req.data.pay_id
            let time=req.data.differ_time
            wx.showToast({
              title: '订单提交成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(() => {
              wx.setStorageSync('source', 'create')
              wx.redirectTo({
                url: '../payOrder/payOrder?pay_id='+ pay_id+'&pay_price='+that.data.orderInfo.price+'&time='+time,
              })
            }, 1000)
          }
        }else{
          wx.hideLoading()
          wx.showToast({
            title: req.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }else{
      wx.showToast({
        title: '请增加收货地址',
        icon: 'none',
        duration: 1000
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    that.setData({
      options: options,
      team_id:options.team_id!=undefined?options.team_id:0
    })
    console.log(options.team_id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('choseAdd')!=undefined&&wx.getStorageSync('choseAdd')!=''){
      this.setData({
        address_id: wx.getStorageSync('choseAdd')
      })
    }
    this.getCoupon()
    this.getOrderInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('choseAdd')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})