// pages/myGift/myGift.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allowbind: true,
    giftType: '2',
    page: 1,
    limit: 10,
    total: 0,
    giftList: [],
    proType: 'scan',
  },
  getList: function() {
    var that = this
    util.queryRequest('?m=scanlottery&a=my_prize', {
      p: that.data.page,
      limit: that.data.limit,
      type: that.data.giftType
    }, 'POST', function(res) {
      wx.hideLoading()
      if (res.isSuccess) {
        that.setData({
          giftList: res.data,
          total: res.total
        })

      }
    })
  },
  goIndex: function(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.link
    })
  },
  viewGift: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      giftType: e.currentTarget.id,
      page: 1
    })
    this.getList()
  },
  usegift: function(e) {
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
      if (this.data.allowbind) {
        var that = this
        that.setData({
          allowbind: false
        })
        if (e.currentTarget.dataset.type == 1) {
          // 实物领取
          util.queryRequest('?m=listexchange&a=add', {
            pid: e.currentTarget.dataset.pid,
            num: 1,
            type: 'scan'
          }, 'GET', function(res) {
            if (res.isSuccess) {
              wx.navigateTo({
                url: '../sureOrder/sureOrder?id=' + e.currentTarget.dataset.pid + '&addType=3'
              })
            } else {
              that.setData({
                allowbind: true
              })
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
              })
            }
          })
        } else {
          util.queryRequest('?m=scanlottery&a=get_prize', {
            code_id: e.currentTarget.id
          }, 'GET', function(res) {
            if (res.isSuccess) {
              wx.showToast({
                title: res.msg,
                icon: 'success',
                duration: 1000
              })
              setTimeout(function() {
                that.setData({
                  page: 1,
                  allowbind: true
                })
                that.getList()
              }.bind(that), 1000)
            } else {
              that.setData({
                allowbind: true
              })
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
              })
            }
          })
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.setNavigationBarTitle({
      title: '我的赠品'
    })
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
  onShow: function() {
    this.setData({
      page: 1
    })
    this.getList()
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
    util.queryRequest('?m=scanlottery&a=my_prize', {
      p: ++that.data.page,
      limit: that.data.limit,
      type: that.data.giftType
    }, 'POST', function(res) {
      if (res.isSuccess) {
        if (res.data != '' && res.data != null) {
          that.data.giftList = that.data.giftList.concat(res.data)
        }
        that.setData({
          giftList: that.data.giftList
        })

      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})