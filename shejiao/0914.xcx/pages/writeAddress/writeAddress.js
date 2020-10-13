// pages/payment/payment.js
var app = getApp()
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    bg_color:'linear-gradient(90deg,rgba(70,70,70,1) 0%,rgba(47,47,47,1) 100%)',
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
    messages:'',
    orderInfo:{},
    address:'',
    address_id:'',
    options:{},
    showErrContent:'',
    showErr:false
  },
  // 跳转到收货地址列表
  choseAddress(){
    let that = this
    if(that.data.options.type=='confirm'){
      wx.navigateTo({
        url: '../myAdress/myAdress?type=chose',
      })
    }else{
      if(this.data.orderInfo.can_modify_address==1){
      // 查看详情，根据接口返回字段判断是否可以更改
      wx.navigateTo({
        url: '../myAdress/myAdress?type=change_chose&order_id='+that.data.options.win_id,
      })
      }
    }
  },
  // 获取确认订单信息
  getOrderInfo(){
    const that=this
    let url=''
    let obj={
      oid: that.data.options.win_id,
      address_id: that.data.address_id
    }
    if(that.data.options.type=='confirm'){
      url = '/app/lotteryOrder/confirm'
      util.queryRequest(url, obj, 'POST').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          that.setData({
            orderInfo: res.data,
            address: res.data.address,
            address_id: res.data.address== null ? '' : res.data.address.id,
            showSkeleton: false,
            scrollHeight: app.globalData.useWindowHeight
          })
        } else {
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
    }else{
      url = '/app/lotteryOrder/orderDetail'
      util.queryRequest(url, obj, 'GET').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          let address = {}
          that.setData({
            orderInfo: res.data,
            address: res.data.address,
            address_id: res.data.address== null ? '' : res.data.address.id,
            showSkeleton: false,
            scrollHeight: app.globalData.useWindowHeight
          })
        } else {
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
    }

  },
  // 提交订单
  subOrder:function(){
    const that=this
    console.log(that.data.address_id,"asfljasdf")
    if (that.data.address_id!=''&&that.data.address_id!=undefined){
      let type = that.data.options.type
      let url = ''
      let obj = {
        oid: that.data.options.win_id,
        address_id: that.data.address_id,
      }
      url = '/app/lotteryOrder/submitOrder'
       wx.showLoading({
        title: '订单提交中...',
      })
      util.queryRequest(url,obj, 'POST').then(function (req) {
        if (req.code === 200 || req.code === '200') {
          wx.hideLoading()
          if(req.data){
            wx.showToast({
              title: '提交成功~',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function(){
              wx.navigateBack({
                detal:1
              })
            },1000)
          }else{
            wx.showToast({
              title: req.msg,
              icon: 'none',
              duration: 2000
            })
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
    })
    wx.setNavigationBarTitle({
      title: options.type=='confirm'?'选择地址':'查看详情',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
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