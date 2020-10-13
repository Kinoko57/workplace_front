// pages/protocol/protocol.js
let util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '1',
    staticUrl: app.globalData.staticUrl,
    isTop:true,
  },
  getInfo:function(){
    let that = this
    util.queryRequest('app/index/protocol',{},'GET').then(function(res){
      console.log(res)
      if(res.code == 200){
        let proDetail = ''
        if(that.data.type==1){
          proDetail = res.data.intro
        }else if(that.data.type==2){
          proDetail = res.data.privacy
        }else{
          proDetail = res.data.user_protocol
        }
        WxParse.wxParse('proDetail', 'html', proDetail, that, 10);
      }
    })
  },
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    wx.setNavigationBarTitle({
      title: options.type=='1'?'平台简介':options.type=='2'?'隐私政策':'用户协议'
    })
    this.getInfo()
  },
  // 页面滚动控制顶部栏显示与否
  onPageScroll: function (e) {
    if (e.scrollTop > 140) {
      if (this.data.isTop == true) {
        this.setData({
          isTop: false
        })
      }
    }
    if (e.scrollTop <= 140) {
      if (this.data.isTop==false) {
        this.setData({
          isTop: true
        })
      }
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
  // onShareAppMessage: function () {

  // }
})