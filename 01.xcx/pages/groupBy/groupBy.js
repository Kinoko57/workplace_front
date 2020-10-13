// pages/mytryOut/mytryOut.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tryType: 0,
    p: 1,
    limit: 4,
    apiUrl: app.globalData.apiUrl,
    orderList: [],
    tips: '您暂时没有团购商品，赶快去开团或拼团吧',
    total: 0,
    isShow: false
  },
  goIndex: function (e) {
    wx.switchTab({
      url: e.currentTarget.dataset.link
    })
  },
  viewtryType: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      tryType: e.currentTarget.id,
      p: 1
    })
    this.getList()
  },
  goLink: function() {
    wx.navigateTo({
      url: '../myGroupBy/myGroupBy'
    })
  },
  goPro: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  getList: function() {
    var that = this
    util.queryRequest('?m=grouppurchase&a=my_group', {
      status: that.data.tryType,
      p: that.data.p,
      limit: that.data.limit
    }, 'GET', function(res) {
      that.setData({
        isShow: true
      })
      wx.hideLoading()
      if (res.isSuccess) {
        that.setData({
          orderList: res.data,
          total: res.total
        })
      } else {
        if (that.data.tryType == '0') {
          that.data.tips = '您暂时没有团购商品，赶快去开团或拼团吧！'
        } else if (that.data.tryType == '2') {
          that.data.tips = '您暂时没有拼团成功的商品，赶快去开团或拼团吧！'
        } else if (that.data.tryType == '-1') {
          that.data.tips = '您暂时没有拼团失败的商品，赶快去开团或拼团吧！'
        } else {
          that.data.tips = '您暂时没有拼团中的商品，赶快去开团或拼团吧！'
        }
        that.setData({
          orderList: '',
          total: 0,
          tips: that.data.tips
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getList()
    wx.setNavigationBarTitle({
      title: '我的拼团'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff8d97',
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
    var that = this
    util.queryRequest('?m=grouppurchase&a=my_group', {
      status: that.data.tryType,
      p: ++that.data.p,
      limit: that.data.limit
    }, 'GET', function(res) {
      if (res.isSuccess) {
        if (res.data == null) {
          res.data = []
        }
        that.data.orderList = that.data.orderList.concat(res.data)
        that.setData({
          orderList: that.data.orderList,
          total: res.total
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})