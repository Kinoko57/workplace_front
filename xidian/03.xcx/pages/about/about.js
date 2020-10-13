// pages/about/about.js
let util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    aboutList: [{
        id: 1,
        name: '平台简介',
      link: '../protocol/protocol?type=1'
      },
      {
        id: 2,
        name: '隐私政策',
        link: '../protocol/protocol?type=2'
      },
      {
        id: 3,
        name: '用户协议',
        link: '../protocol/protocol?type=3'
      },
    ],
  },
 gonLink(e){
   wx.navigateTo({
     url: e.currentTarget.dataset.link,
   })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '关于西点'
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