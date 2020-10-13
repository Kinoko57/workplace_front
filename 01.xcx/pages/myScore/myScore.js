// pages/myScore/myScore.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_bg: '../../static/img/member/m_header_bg.png',
    avatar: "../../static/img/member/avatar.png",
    userInfo: {
      avatar: '',
      nickname: '',
      username: '',
      isShow: 0
    },
    score: 0,
    page: 1,
    pagesize: 10,
    scoreList: []
  },
  goIndex: function (e) {
    wx.switchTab({
      url: e.currentTarget.dataset.link
    })
  },
  goSign: function() {
    wx.navigateTo({
      url: '../mySignIn/mySignIn'
    })
  },
  getList: function() {
    var that = this
    util.queryRequest('?m=member&a=point', {
      page: that.data.page,
      pagesize: that.data.pagesize
    }, 'POST', function(res) {
      wx.hideLoading()
      if (res.isSuccess == true) {
        that.setData({
          scoreList: res.data.rows
        })
        wx.setStorageSync("score", res.data.point);
        for (var i = 0; i < that.data.scoreList.length; i++) {
          that.data.scoreList[i].createtime = util.formatTime(that.data.scoreList[i].createtime)
        }
        that.setData({
          scoreList: that.data.scoreList
        })
      }
    })
  },
  scoreShow() {
    if (wx.getStorageSync("score") > 0) {
      this.setData({
        score: wx.getStorageSync("score")
      })
    } else {
      this.setData({
        score: 0
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getList()
    if (wx.getStorageSync("cookie")) {
      this.setData({
        userInfo: wx.getStorageSync("userInfo")
      })
      this.scoreShow()
    }
    wx.setNavigationBarTitle({
      title: '我的积分'
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
    // var that = this
    // that.setData({
    //   page: 1
    // })
    // that.getList()
    // wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    util.queryRequest('?m=member&a=point', {
      page: ++that.data.page,
      pagesize: that.data.pagesize
    }, 'POST', function(res) {
      if (res.isSuccess == true) {
        if (res.data.rows.length > 0) {
          for (var i = 0; i < res.data.rows.length; i++) {
            res.data.rows[i].createtime = util.formatTime(res.data.rows[i].createtime)
          }
        }
        that.data.scoreList = that.data.scoreList.concat(res.data.rows)
        that.setData({
          scoreList: that.data.scoreList
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