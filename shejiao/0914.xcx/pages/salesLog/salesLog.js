// pages/findLog/findLog.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSkeleton:true,
    staticUrl: app.globalData.staticUrl,
    options:{},
    list:[
    ]
  },
  getList: function () {
    var that = this
    // 查看物流
    let obj={
      id:that.data.options.id,
    }
    util.queryRequest('/app/after/log', obj, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          list:res.data,
          showSkeleton: false,
        })
        console.log(that.data.list)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        console.log(res.msg)
      }
    })

  },
  // 复制
  copyOrd(e){
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.id,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1000
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    options:options
  })
  this.getList()
   setTimeout(()=>{
    this.setData({
      showSkeleton:false
    })
   },500)
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