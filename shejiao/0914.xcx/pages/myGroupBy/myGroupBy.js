// pages/mytryOut/mytryOut.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight: app.globalData.navHeight,
    imgPath: app.globalData.fileUrl,
    staticUrl: app.globalData.staticUrl,
    tryType: 1,
    p: 1,
    limit: 4,
    is_end: false,
    hasData: true,
    page_num: 0,
    apiUrl: app.globalData.apiUrl,
    orderList: [],
    tips: '您暂时没有团购商品，赶快去开团或拼团吧',
    total: 0,
    isShow: false
  },
  goIndex: function (e) {
    wx.reLaunch({
      url: e.currentTarget.dataset.link
    })
  },
  viewtryType: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      tryType: e.currentTarget.id,
      p: 1
    })
    this.getList()
  },
  goLink: function() {
    wx.navigateTo({
      url: '../spellGroup/spellGroup'
    })
  },
  goPro: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  goOrderDetail:function(e){
    wx.navigateTo({
      url: '../orderDetail/orderDetail?oid=' + e.currentTarget.dataset.oid+'&supplier_id=1'
    })
  },
  getList: function() {
    var that = this
    util.queryRequest('/app/userInfo/myGroupIndex', {
      status: that.data.tryType,
      page: that.data.p,
      size: that.data.limit
    }, 'GET').then(function(res) {
      that.setData({
        isShow: true
      })
      wx.hideLoading()
      if (res.code == 200) {
        if(res.data.rows!=null&&res.data.rows.length>0){
          that.setData({
            orderList: res.data.rows,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.limit),
            is_end: Math.ceil(res.data.total / that.data.limit) == that.data.p,
            hasData:true
          })
        }else{
          // if (that.data.tryType == '1') {
          //   that.data.tips = '您暂时没有团购商品，赶快去开团或拼团吧！'
          // } else if (that.data.tryType == '3') {
          //   that.data.tips = '您暂时没有拼团成功的商品，赶快去开团或拼团吧！'
          // } else if (that.data.tryType == '4') {
          //   that.data.tips = '您暂时没有拼团失败的商品，赶快去开团或拼团吧！'
          // } else {
          //   that.data.tips = '您暂时没有拼团中的商品，赶快去开团或拼团吧！'
          // }
          that.setData({
            orderList: [],
            total: 0,
            hasData: false
          })
        }
      } else {
        // if (that.data.tryType == '1') {
        //   that.data.tips = '您暂时没有团购商品，赶快去开团或拼团吧！'
        // } else if (that.data.tryType == '3') {
        //   that.data.tips = '您暂时没有拼团成功的商品，赶快去开团或拼团吧！'
        // } else if (that.data.tryType == '4') {
        //   that.data.tips = '您暂时没有拼团失败的商品，赶快去开团或拼团吧！'
        // } else {
        //   that.data.tips = '您暂时没有拼团中的商品，赶快去开团或拼团吧！'
        // }
        that.setData({
          orderList: [],
          total: 0,
          hasData: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getList()
    wx.setNavigationBarTitle({
      title: '我的拼团'
    })
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: '#ff4e79',
    // })
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
  loadMore:function(){
    var that = this
    util.queryRequest('app/groupbuy/myGroupIndex', {
      status: that.data.tryType,
      page: ++that.data.p,
      size: that.data.limit
    }, 'GET').then(function(res) {
      if (res.code == 200) {
        if (res.data.rows == null) {
          res.data.rows = []
        }
        that.data.orderList = that.data.orderList.concat(res.data.rows)
        that.setData({
          orderList: that.data.orderList,
          total: res.data.total,
          is_end: that.data.page_num == that.data.p
        })
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.is_end == false) {
      this.loadMore()
    } else {
      console.log("加载完了")
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})