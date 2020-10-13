// pages/conformOrder/conformOrder.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSkeleton:true,
    conformInfo:{},
    staticUrl: app.globalData.staticUrl,
  },
  goHome(){
    wx.redirectTo({
      url: '../index/index',
    })
  },
  goDetail(){
    wx.redirectTo({
      url: '../orderManage/orderManage?status=type_1',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    // 珍选优品网
    //  wx.requestSubscribeMessage({
    //   tmplIds:['toEXHDLh1ajo-bblEj63i8Bx3VwxuXc0b6gPzMzBbl4','XUkS6AMnyOynbRM2jSWTso8_vMwJ-SSXVRnDS-iR-iM'],
    //   success(res) {
    //     console.log(res)
    //   },
    //   complete(res) {
    //     console.log(res)
    //   },
    // })
       // 溪秀
      //  wx.requestSubscribeMessage({
      //   tmplIds: ['lH8gHiZi50_L6ob94zgeYiJDfVXlo_Qam_-HebKa4Hw','dllFIy32SmgY3yhAWQdsUVDEAysnsHn6TLbEk3hjxE8'],
      //   success(res) {
      //     console.log(res)
      //   },
      //   complete(res) {
      //     console.log(res)
      //   },
      // })
    that.setData({
      conformInfo:wx.getStorageSync('comformInfo')
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