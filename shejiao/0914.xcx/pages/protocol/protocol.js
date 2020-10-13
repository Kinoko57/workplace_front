// pages/protocol/protocol.js
let util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    content: '',
    type: 'about',
    pageTitle: '服务协议'
  },
  getInfo:function(){
    let that = this
    util.queryRequest('/app/user/protocol',{},'GET').then(function(res){
      console.log(res)
      var proDetail = '';
      if(that.data.type=='about'){
        proDetail = res.data.intro
      }else if(that.data.type=='service'){
        proDetail = res.data.user_protocol
      }else{
        proDetail = res.data.privacy
      }
      WxParse.wxParse('proDetail', 'html', proDetail, that, 10);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      pageTitle:options.type=='about'?'关于我们':(options.type=='service'?'服务协议':'隐私政策')
    })
    wx.setNavigationBarTitle({
      title:this.data.pageTitle,
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    this.getInfo()
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