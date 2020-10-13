// pages/accountSecurity/accountSecurity.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    accountSecurity:{},
    showSkeleton:true
  },
  goLink(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  goRealName(e){
    if(this.data.accountSecurity.auth==0){
      wx.navigateTo({
        url: '../realName/realName',
      })
    }else{
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  getInfo: function () {
    var that = this
    // 账户安全信息
    util.queryRequest('/app/personalCenter/security', {}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          accountSecurity: res.data,
          showSkeleton: false,
        })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
    wx.setNavigationBarTitle({
      title: '账户安全',
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
    this.getInfo()
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