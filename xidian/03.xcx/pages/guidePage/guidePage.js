// pages/guidePage/guidePage.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: false,
    isShow: false,
    interval: 1000,
    duration: 500,
    imgUrls: []
  },
  imgLink: function(e) {
    if (e.currentTarget.dataset.type) {
      wx.switchTab({
        url: '../index/index',
      })
    }
  },
  //获取引导页信息
  getGuidInfo: function() {
    const that = this
    console.log(wx.getStorageSync('guidePage'))
    if(wx.getStorageSync('guidePage')==0){
      util.queryRequest('app/index/getImageList', {
        type: 2
      }, "GET").then(function(res) {
        console.log("获取引导页信息")
        if (res.code === 200||res.code === '200') {
          if (res.data.length > 0) {
            let arr = res.data
            for (let i = 0; i < arr.length; i++) {
              arr[i].ischose = false
            }
            arr[arr.length - 1].ischose = true
            wx.setStorageSync('guidePage', '1')
            console.log(arr)
            that.setData({
              imgUrls: arr,
            })
          } else {
            console.log("没有引导页图片，跳转到首页")
            wx.switchTab({
              url: '../index/index'
            })
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }else{
      console.log('引导页已经显示过')
      wx.switchTab({
        url: '../index/index'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('引导页被访问')
    wx.setNavigationBarTitle({
      title: '西点好习惯军事夏令营',
    })
    // if (app.globalData.guideImg.length>0){
    //   let arr = app.globalData.guideImg
    //   for (let i = 0; i < arr.length; i++) {
    //     arr[i].ischose = false
    //   }
    //   console.log(arr)
    //   arr[arr.length - 1].ischose = true
    //   wx.setStorageSync('guidePage', '1')
    //   console.log(arr)
    //   this.setData({
    //     imgUrls: arr,
    //   })
    // }
    this.getGuidInfo()
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
    console.log(this.data.time)
    clearInterval(this.data.time);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.time);
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