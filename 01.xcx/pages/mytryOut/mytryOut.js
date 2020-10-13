// pages/myflashSale/myflashSale.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    couList: [],
    orderList: [],
    apiUrl: app.globalData.apiUrl,
    tips: '您暂时没有申请试用商品，赶快去申请吧',
    page: 1,
    pagesize: 6,
    flashType: '1',
    couTotal: 0,
    total: 0,
    proType: 'try',
    is_iphonex: app.globalData.phoneType
  },
  goIndex: function(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.link
    })
  },
  goLink: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  goOrder: function(e) {
    if (!wx.getStorageSync("isbind")) {
      var pages = getCurrentPages() //获取加载的页面
      var currentPage = pages[pages.length - 1] //获取当前页面的对象
      var url = currentPage.route //当前页面url
      var options = currentPage.options
      //拼接url的参数
      if (JSON.stringify(options) != "{}") {
        var urlWithArgs = url + '?'
        for (var key in options) {
          var value = options[key]
          urlWithArgs += key + '=' + value + '&'
        }
      } else {
        urlWithArgs = url
      }
      getApp().globalData.backUrl = urlWithArgs
      wx.reLaunch({
        url: '../bind/bind?visit=4'
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      })
    }
  },
  showDetail: function(e) {
    wx.navigateTo({
      url: '../tryOutdetail/tryOutdetail?id=' + e.currentTarget.id
    })
  },
  viewflashType: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      flashType: e.currentTarget.id,
      tips: this.data.tips,
      page: 1,
    })
    this.getList()
  },
  getList: function() {
    var that = this
    util.queryRequest('?m=myinfo&a=my_trygoods', {
      type: that.data.flashType,
      page: that.data.page,
      pagesize: that.data.pagesize
    }, 'POST', function(res) {
      that.setData({
        isShow: true
      })
      wx.hideLoading()
      if (res.isSuccess) {
        if (res.data.rows.length > 0) {
          for (var i = 0; i < res.data.rows.length; i++) {
            res.data.rows[i].createtime = util.formatTime(res.data.rows[i].createtime)
          }
          that.setData({
            orderList: res.data.rows,
            total: res.data.total
          })
        } else {
          if (that.data.flashType == 'all') {
            that.data.tips = '您暂时没有申请试用商品，赶快去申请吧！'
          } else if (that.data.flashType == 1) {
            that.data.tips = '您暂时没有申请成功的试用商品，赶快去申请吧！'
          } else if (that.data.flashType == 3) {
            that.data.tips = '您暂时没有进行中的助力试用商品，赶快去申请吧！'
          } else {
            that.data.tips = '您暂时没有已取消的试用商品，赶快去申请吧！'
          }
          that.setData({
            orderList: [],
            tips: that.data.tips,
            total: res.data.total
          })
        }

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
    wx.setNavigationBarTitle({
      title: '我的试用'
    })
    this.getList()

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff8d97',
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
  onShow: function() {},

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
    // this.setData({
    //   page: 1
    // })
    // that.getList()
    // wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    util.queryRequest('?m=myinfo&a=my_trygoods', {
      type: that.data.flashType,
      page: ++that.data.page,
      pagesize: that.data.pagesize
    }, 'POST', function(res) {
      if (res.isSuccess) {
        if (that.data.orderList.length == 0) {
          if (that.data.flashType == 'all') {
            that.data.tips = '您暂时没有申请试用商品，赶快去申请吧！'
          } else if (that.data.flashType == 1) {
            that.data.tips = '您暂时没有申请成功的试用商品，赶快去申请吧！'
          } else {
            that.data.tips = '您暂时没有申请失败的试用商品，赶快去申请吧！'
          }
          that.setData({
            orderList: [],
            tips: that.data.tips,
            total: res.data.total
          })
        } else {
          if (res.data.rows.length > 0) {
            for (var i = 0; i < res.data.rows.length; i++) {
              res.data.rows[i].createtime = util.formatTime(res.data.rows[i].createtime)
            }
            that.data.orderList = that.data.orderList.concat(res.data.rows)
            that.setData({
              orderList: that.data.orderList,
              total: res.data.total
            })
          }
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})