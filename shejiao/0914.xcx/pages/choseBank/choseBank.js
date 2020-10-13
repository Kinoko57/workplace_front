// pages/choseBank/choseBank.js
var app=getApp();
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSkeleton: true,
    scrollHeight:0,
    staticUrl: app.globalData.staticUrl,
    bankList:[],
    choseId:'-1',
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
  },
  addBank:function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.link,
    })
  },
  getList: function () {
    const that = this
    util.queryRequest('/app/wallet/memberBankList',{}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          bankList: res.data,
          showSkeleton: false
        })
      }
    })
  },
  sureBank(e){
    console.log(e)
    setTimeout(()=>{
      wx.navigateBack({
        delta:1
      })
    },100)
    wx.setStorageSync('bank_Card', e.currentTarget.dataset.bank_card)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    that.setData({
      scrollHeight:app.globalData.useWindowHeight-69
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
    wx.setNavigationBarTitle({
      title:'选择银行卡',
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