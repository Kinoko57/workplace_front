// pages/myCoupon/myCoupon.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couList: [],
    viewList: [],
    page: 1,
    pagesize: 10,
    couType: '1',
    couTotal: 0,
    total: 0,
    useTotal: 0
  },
  goIndex: function(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.link
    })
  },
  viewCouType: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    if (e.currentTarget.id == "0") {
      this.setData({
        couType: '1'
      })
    } else if (e.currentTarget.id == "1") {
      this.setData({
        couType: '2'
      })
    } else if (e.currentTarget.id == "2") {
      this.setData({
        couType: '3'
      })
    }
    this.setData({
      page: 1
    })
    this.getList()
  },
  getList: function() {
    var that = this
    util.queryRequest('?m=myinfo&a=my_discount', {
      page: that.data.page,
      pagesize: that.data.pagesize,
      type: that.data.couType
    }, 'POST', function(res) {
      wx.hideLoading()

      if (res.isSuccess) {
        that.setData({
          couList: res.data.rows
        })
        for (var i = 0; i < that.data.couList.length; i++) {
          that.data.couList[i].totime = util.formatDate(that.data.couList[i].totime)
          that.data.couList[i].createtime = util.formatDate(that.data.couList[i].createtime)
          if (that.data.couList[i].usetime != null) {
            that.data.couList[i].usetime = util.formatDate(that.data.couList[i].usetime)
          }
        }
        that.setData({
          couList: that.data.couList
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
    //获取优惠券列表
    this.getList()
    wx.setNavigationBarTitle({
      title: '优惠券'
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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    util.queryRequest('?m=myinfo&a=my_discount', {
      page: ++that.data.page,
      pagesize: that.data.pagesize,
      type: that.data.couType
    }, 'POST', function(res) {
      if (res.isSuccess == true) {
        for (var i = 0; i < res.data.rows.length; i++) {
          res.data.rows[i].createtime = util.formatTime(res.data.rows[i].createtime)
          res.data.rows[i].totime = util.formatDate(res.data.rows[i].totime)
        }
        that.data.couList = that.data.couList.concat(res.data.rows)
        that.setData({
          couList: that.data.couList
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