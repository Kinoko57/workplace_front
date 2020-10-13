// pages/myGiftList/myGiftList.js
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
    proType: 'exchange',
  },
  getList: function() {
    var that = this
    util.queryRequest('?m=lottery&a=info', {
      page: that.data.page,
      type: that.data.giftType,
      limit: that.data.limit,
      genre: 0
      // ,limit: that.data.limit
    }, 'GET', function(res) {
      wx.hideLoading()
      if (res.isSuccess) {
        for (var i = 0; i < res.data.rows.length; i++) {
          res.data.rows[i].createtime = util.formatTime(res.data.rows[i].createtime)
        }
        that.setData({
          giftList: res.data.rows,
          total: res.data.total
        })
      } else {
        that.data.giftList = null
        that.setData({
          giftList: that.data.giftList
        })
        // wx.showToast({
        //   title: res.msg,
        //   icon: 'none',
        //   duration: 2000
        // })
      }
    })
    // util.queryRequest('?m=scanlottery&a=my_prize', {
    //   p: that.data.page,
    //   limit: that.data.limit,
    //   type: that.data.giftType
    // }, 'POST', function(res) {
    //   if (res.isSuccess) {
    //     that.setData({
    //       giftList: res.data,
    //       total: res.total
    //     })

    //   }
    // })
  },
  goLink: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
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
  winPro: function(e) {
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
      var that = this
      if (this.data.allowbind) {
        this.setData({
          allowbind: false
        })
        var id = e.currentTarget.id
        util.queryRequest('?m=listexchange&a=add', {
          pid: id,
          num: 1,
          type: 'exchange',
          lottery_id: e.currentTarget.dataset.lid,
          genre: e.currentTarget.dataset.type
        }, 'GET', function(res) {
          if (res.isSuccess) {
            wx.navigateTo({
              url: '../sureOrder/sureOrder?id=' + id + '&addType=3&genre=' + e.currentTarget.dataset.type
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
      title: '我的奖品列表'
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
    util.queryRequest('?m=lottery&a=info', {
      page: ++that.data.page,
      type: that.data.giftType,
      limit: that.data.limit,
      genre: 0 //0：全部中奖列表  1：大转盘    2超级转盘 
      // ,limit: that.data.limit
    }, 'GET', function(res) {
      if (res.isSuccess) {
        if (res.data.rows != '' && res.data.rows != null) {
          for (var i = 0; i < res.data.rows.length; i++) {
            res.data.rows[i].createtime = util.formatTime(res.data.rows[i].createtime)
          }
          that.data.giftList = that.data.giftList.concat(res.data.rows)
        }
        that.setData({
          giftList: that.data.giftList
        })
      } else {
        that.data.giftList = null
        that.setData({
          giftList: that.data.giftList
        })
        // wx.showToast({
        //   title: res.msg,
        //   icon: 'none',
        //   duration: 2000
        // })
      }
    })
    // util.queryRequest('?m=scanlottery&a=my_prize', {
    //   p: ++that.data.page,
    //   limit: that.data.limit,
    //   type: that.data.giftType
    // }, 'POST', function(res) {
    //   if (res.isSuccess) {
    //     if (res.data != '' && res.data != null) {
    //       that.data.giftList = that.data.giftList.concat(res.data)
    //     }
    //     that.setData({
    //       giftList: that.data.giftList
    //     })

    //   }
    // })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})