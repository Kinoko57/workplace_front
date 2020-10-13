// pages/member/member.js
let util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight:app.globalData.navHeight,
    allnavHeight:app.globalData.navHeight+166,
    topNavHeight:app.globalData.navHeight+90,
    topBg: 'transparent',
    line_bg_color:'linear-gradient(to right,rgba(238,221,188,1) 0%,rgba(219,182,121,1) 100%)',
    line_bg_color2:'linear-gradient(90deg,rgba(70,70,70,1) 0%,rgba(47,47,47,1) 100%)',
    color:'#E5CB9D',
    showSkeleton: true,
    topHeight:0,
    is_iphonex: app.globalData.isiPhoneX,
    staticUrl: app.globalData.staticUrl,
    signList:[
      {name:'已签',status:'0',data:'04.11'},
      { name: '已签', status: '0', data: '04.12' },
      { name: '已签', status: '0', data: '04.13' },
      { name: '已签', status: '0', data: '04.14' },
      { name: '未签', status: '1', data: '今天' },
      { name: '未签', status: '1', data: '明天' },
      { name: '未签', status: '1', data: '04.17'},
    ]
  },
  onPageScroll(e){
  if (e.scrollTop <= 1) {
      this.setData({
        topBg: 'transparent',
      })
  }else{
    console.log("555")
    this.setData({
      topBg:'#ffffff'
    })
  }
  },
  goLink(e){
   wx.navigateTo({
     url: e.currentTarget.dataset.url,
   }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    that.setData({
      topHeight: app.globalData.useWindowHeight - app.globalData.tabbarHeight
    })
    
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
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