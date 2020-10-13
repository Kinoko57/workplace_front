// pages/footer/footer.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenlogin: true,
    newNews: false,
    total_amout: 0,
    is_iphonex: app.globalData.phoneType
  },
  login: function() {
    this.setData({
      hiddenlogin: false
    })
  },
  exitLogin: function() {
    this.setData({
      hiddenlogin: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 查询是否有新消息
    util.queryRequest('?m=myinfo&a=check_unread', {}, 'POST', function(res) {
      if (res.isSuccess) {
        that.setData({
          newNews: true
        })
      } else {
        that.setData({
          newNews: false
        })
      }
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