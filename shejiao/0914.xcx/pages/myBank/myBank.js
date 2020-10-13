// pages/mycard/mycard.js
var app=getApp();
let util = require('../../utils/util.js')
// app.slideupshow(this, 'slide_up1', -200, 1)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    showSkeleton:true,
    hasCard:true,
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    is_iphonex: app.globalData.isiPhoneX,
    cardList:[],
    scrollHeight:0,
    staticUrl: app.globalData.staticUrl,
    is_auth:0,
    animationData:{},
    brandHeight: 0,
  },
  addMyCard:function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.link,
    })
  },
  getList: function () {
    const that = this
    util.queryRequest('/app/wallet/memberBankList',{}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          cardList: res.data,
          showSkeleton: false
        })
        console.log(res.data,"asdl;ka")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的银行卡',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    if(this.data.is_iphonex){
      this.setData({
        scrollHeight: app.globalData.useWindowHeight-118
      })
    }else{
      this.setData({
        scrollHeight: app.globalData.useWindowHeight-84
      })
    }
    setTimeout(() => { //3S后隐藏骨架屏
      this.setData({
        showSkeleton: false
      })
    }, 500)
    // var app = getApp()
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
    this.setData({
      is_auth:wx.getStorageSync('userInfo').card_type
    })
    this.getList()
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