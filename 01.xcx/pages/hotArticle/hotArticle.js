// pages/hotArticle/hotArticle.js
let util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSign: true,
    listShow: false,
    articleInfo: {},
    noScroll: false,
    is_iphonex: app.globalData.phoneType,
  },
  goPro: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  returnTop: function() {
    this.setData({
      isSign: true
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  goIndex: function(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.link
    })
  },
  showList: function() {
    this.setData({
      listShow: true,
      noScroll: true
    })
  },
  hideList: function() {
    this.setData({
      listShow: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.globalData.firstHot = 1
    // this.dialog = this.selectComponent("#reload");
    wx.setNavigationBarTitle({
      title: options.name
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f2f2f2',
    })
    var that = this
    util.queryRequest('?app=b2c&m=goodsarticle&a=item', {
      id: options.id
    }, 'GET', function(res) {
      if (res.isSuccess) {
        res.data.updatetime = util.formatDate(res.data.updatetime)
        that.setData({
          articleInfo: res.data
        })
        var richList = that.data.articleInfo
        var proDetail = []
        var k = 0;
        for (var i = 0, len = richList.content.length; i < len; i++) {
          if (richList.content[i].type == 1) {
            WxParse.wxParse('content' + k, 'html', richList.content[i].content, that, 10)

          } else {
            WxParse.wxParse('content' + k, 'html', '', that)
          }
          ++k
        }
        WxParse.wxParseTemArray("proDetail", 'content', k, that)
        for (var i = 0, len = richList.content.length; i < len; i++) {
          richList.content[i]['html'] = that.data.proDetail[i];
        }
        that.setData({
          articleInfo: richList
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  // showDialog() {
  //   this.dialog.showReload()
  // },
  // _relaod() {
  //   util.loadPage(this)
  //   console.log('触发relaod')
  // },
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
  onShareAppMessage: function() {

  }
})