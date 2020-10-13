// pages/myVip/myVip.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    navNtn: 2,
    hiddenlogin: app.globalData.hiddenlogin,
    apiUrl: app.globalData.apiUrl,
    page: 1,
    pagesize: 100,
    vipList: [],
    vipBg: null,
    // type: 'member', 
    type: 'birthday',
  },
  goIndex: function(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.link
    })
  },
  getList: function() {
    var that = this
    util.queryRequest('?m=activity&a=goods_birthday', {
      type: that.data.type,
      page: that.data.page,
      pagesize: that.data.pagesize
    }, 'POST', function(res) {
      that.setData({
        isShow: true
      })
      wx.hideLoading()
      if (res.isSuccess) {
        wx.setNavigationBarTitle({
          title: res.data.title
        })
        that.setData({
          vipList: res.data.list.rows,
          vipBg: res.data.birthday_bgimg
        })
      }
    })
  },
  goPro: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    if (util.isLogin()) {
      this.getList()
    }
    // wx.setNavigationBarTitle({
    //   title: '生日特权'
    // })
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
    var that = this
    util.queryRequest('?m=activity&a=goods_birthday', {
      type: that.data.type,
      page: ++that.data.page,
      pagesize: that.data.pagesize
    }, 'POST', function(res) {
      if (res.isSuccess) {
        if (res.data.list.rows == null) {
          res.data.list.rows = []
        }
        that.data.vipList = that.data.vipList.concat(res.data.list.rows)
        that.setData({
          vipList: that.data.vipList,
          vipBg: res.data.birthday_bgimg
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})