// pages/Interested/Interested.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visited: 0,
    apiUrl: app.globalData.apiUrl,
    list: [],
    select: []
  },
  checkLike: function(e) {
    this.setData({
      select: e.detail.value
    })
  },
  goInfo: function() {
    if (this.data.select.length >= 4) {
      var obj = {
        'tag_ids': this.data.select.join(",")
      }
      var arr = []
      arr.push(obj)
      var that = this
      util.queryRequest('?m=myinfo&a=usersave', {
        data: JSON.stringify(arr)
      }, 'POST', function(res) {
        if (res.isSuccess) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function() {
            var pages = getCurrentPages()
            if (this.data.visited == 0) {
              wx.redirectTo({
                url: '../memberCenter/memberCenter'
              })
            } else {
              //调用接口保存感兴趣的内容，
              wx.navigateBack({
                delta: 1
              })
            }
          }.bind(that), 1000)
        }
      })
    } else {
      wx.showToast({
        title: '至少选择四个',
        icon: 'none',
        duration: 1000
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.data.select = []
    util.queryRequest('?m=myinfo&a=hobby_type', {}, 'POST', function(res) {
      if (res.isSuccess) {
        for (var i = 0; i < res.data.rows.length; i++) {
          if (res.data.rows[i].selected == true) {
            that.data.select.push(res.data.rows[i].id)
          }
        }
        that.setData({
          list: res.data.rows,
          select: that.data.select
        })
      }
    })
    this.setData({
      visited: options.visit
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
  // onShareAppMessage: function () {

  // }
})