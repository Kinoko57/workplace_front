// pages/personCenter/personCenter.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    showSkeleton: true, //骨架屏显示隐藏
    hiddenavatar: true,
    isChange:false,
    personInfo:{},
    filePath: app.globalData.fileUrl,
    apiUrl: app.globalData.apiUrl,

  },
  copy(e){
    console.log(e)
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.id,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          title: '复制成功',
          icon: 'success',
          duration: 1000
        });
      }
    });
  },
  editavatat: function() {
    
  },
  edit: util.throttle(function (e) {
    wx.navigateTo({
      url: e[0].currentTarget.dataset.url
    })
  }),
  editBirth:util.throttle(function (e) {
    // if(!this.data.isChange){
      wx.navigateTo({
        url: e[0].currentTarget.dataset.url
      })
    // }
  }),
  choseAlbum: function() {
    
  },
  choseCra: function() {
    var that = this
    
  },
  hiddenModel: function() {
   
  },
  getInfo: function() {
    var that = this
    // 查看个人信息列表
    util.queryRequest('/app/userInfo/get', {}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          personInfo:res.data,
          showSkeleton:false
        })
        wx.setStorageSync('userInfo', res.data)
      }
    })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (wx.getStorageSync('isChange')!=undefined){
      this.setData({
        isChange: wx.getStorageSync('isChange')
      })
    }
    console.log(this.data.isChange, "asldjksdf", wx.getStorageSync('isChange'))
    this.getInfo()
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