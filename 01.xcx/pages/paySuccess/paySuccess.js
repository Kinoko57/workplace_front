// pages/paySuccess/paySuccess.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenlogin: app.globalData.hiddenlogin,
    addrInfo: {},
    payImg: app.globalData.apiUrl +'/static/image/payad.jpg'
  },
  showOrder: function() {
    wx.navigateTo({
      url: '../myOrder/myOrder?tid=0&id=type0'
    })
  },
  buy: function() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log(options.addrId)
    util.queryRequest('?m=member&a=myaddress', {}, 'GET', function(res) {
      if (res.isSuccess == true) {
        for (var i = 0; i < res.rows.length; i++) {
          if (options.addrId == res.rows[i].id) {
            that.setData({
              addrInfo: res.rows[i],
              payImg: res.bgimg
            })
          }
        }
      }
    })
    wx.setNavigationBarTitle({
      title: '支付成功'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f7f7f7',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})