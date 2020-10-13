// pages/myWallet/myWallet.js
var app = getApp()
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    walletObj:{},
    showSkeleton:true,
    is_auth:0,
  },
  goLink(e) {
    if(this.data.walletObj.card_type==1){
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }else{
      wx.navigateTo({
        url: '../realName/realName',
      })
    }
  },
  getInfo: function () {
    var that = this
    // 查看个人信息列表
    util.queryRequest('/app/wallet/wallet', {}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          walletObj:res.data,
          showSkeleton:false
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
    wx.setNavigationBarTitle({
      title: '钱包',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    setTimeout(()=>{
      that.setData({
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