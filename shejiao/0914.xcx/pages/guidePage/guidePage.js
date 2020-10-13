// pages/guidePage/guidePage.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTop:true,
    navHeight:app.globalData.navHeight,
    imgPath: app.globalData.fileUrl,
    showSkeleton: true,
    showImg: '',
    sec_num:3,
    time: null
  },
  goLink(){
    wx.reLaunch({
      url: '/pages/index/index'
    })
    clearInterval(this.data.time)
  },
  getGuidImage(){
    const that=this
    util.queryRequest('/app/auth/launch', {
    }, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200'){
        if (res.data.image != '' && res.data.status == 1) {
          wx.setStorageSync('guidPage', 1)
          that.setData({
            showSkeleton: false,
            showImg: res.data.image,
            sec_num:res.data.timer
          })
          wx.setStorageSync('guidPage', 1)
          clearInterval(that.data.time)
          that.data.time=setInterval(() => {
            if(that.data.sec_num>0){
              that.data.sec_num=that.data.sec_num-1
              that.setData({
                sec_num:that.data.sec_num
              })
            }else{
              that.setData({
                sec_num:0
              })
              wx.reLaunch({
                url: '/pages/index/index'
              })
             clearInterval(that.data.time)
            }
          }, 1000);
        } else {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that=this
    console.log(wx.getStorageSync("guidPage"),"引导页")
    if(wx.getStorageSync("guidPage")==0){
      this.getGuidImage()
    }else{
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('引导页被访问')
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