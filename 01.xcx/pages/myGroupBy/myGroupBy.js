// pages/myGroupBy/myGroupBy.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newNews: false,
    total_amout: 0,
    isShow: false,
    hiddenlogin: app.globalData.hiddenlogin,
    timeList: [],
    saleProList: [],
    apiUrl: app.globalData.apiUrl,
    typeList: [],
    typeId: '',
    page: 1,
    pagesize: 10,
    total: 0,
    headbg: '',
    isSign: true,
    is_iphonex: app.globalData.phoneType
  },
  onPageScroll: function(e) { // 获取滚动条当前位置
    if (e.scrollTop > 900) {
      if (this.data.isSign) {
        this.setData({
          isSign: false
        })
      }
    } else {
      if (!this.data.isSign) {
        this.setData({
          isSign: true
        })
      }
    }
  },
  returnTop: function() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  goPro: function(e) {
    // if (e.currentTarget.id != '') {
    //   util.queryRequest('?m=item', {
    //     id: e.currentTarget.id
    //   }, 'GET', function(res) {
    //     if (res.isSuccess == false) {
    //       wx.showToast({
    //         title: res.msg,
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     } else {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
    //     }
    //   })
    // }
  },
  choseType: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      typeId: e.currentTarget.id,
      page: 1,
      total: '0'
    })
    this.getList()
  },
  getList: function() {
    var that = this
    util.queryRequest('?m=activity&a=goods_time_group', {
      typeid: '',
      page: that.data.page,
      pagesize: that.data.pagesize
    }, 'POST', function(res) {
      wx.hideLoading()
      if (res.isSuccess) {
        wx.setNavigationBarTitle({
          title: res.data.title
        })
        that.setData({
          headbg: res.data.group_bgimg,
          // typeList: res.data.type_list,
          saleProList: res.data.group_list.rows,
          total: res.data.group_list.total,
          isShow: true
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
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f2f2f2',
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
    this.setData({
      newNews: app.globalData.news,
      total_amout: app.globalData.carNum,
      is_iphonex: app.globalData.phoneType
    })
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
    var that = this
    util.queryRequest('?m=activity&a=goods_time_group', {
      typeid: '',
      page: ++that.data.page,
      pagesize: that.data.pagesize
    }, 'POST', function(res) {
      if (res.isSuccess) {
        if (res.data.group_list.rows == null) {
          res.data.group_list.rows = []
        }
        that.data.saleProList = that.data.saleProList.concat(res.data.group_list.rows)
        that.setData({
          headbg: res.data.group_bgimg,
          // choseTime: res.data.typeid,
          saleProList: that.data.saleProList,
          total: res.data.group_list.total
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})