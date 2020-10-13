// pages/groupResult/groupResult.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allowbind: true,
    orderId: '',
    id: '',
    apiUrl: app.globalData.apiUrl,
    GroupOrder: {},
    groupPeople: [],
    endTime: null,
    saleTime: [],
    time: null,
  },
  getInfo: function() {
    var that = this
    util.queryRequest('?m=grouppurchase&a=my_newest_group', {
      order_id: that.data.orderId,
      id: that.data.id
    }, 'GET', function(res) {
      if (res.isSuccess) {
        console.log(res)
        var secTime = util.countDown(res.data.countdown)
        that.setData({
          endTime: res.data.countdown,
          saleTime: secTime,
          GroupOrder: res.data,
          groupPeople: res.customer,
          id: res.data.id
        })
        that.data.time = setInterval(function() {
          secTime = util.countDown(--that.data.endTime)
          that.setData({
            saleTime: secTime
          })
        }.bind(that), 1000)
        that.setData({
          time: that.data.time
        })
      }
    })
  },
  golink: function(e) {
    if (util.isLogin()) {
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      })
    }
  },
  goindex: function(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.link
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.type == 'pay') {
      this.setData({
        orderId: options.orderId,
        id: ''
      })
    } else {
      this.setData({
        orderId: '',
        id: options.orderId
      })
    }
    console.log(options)
    this.getInfo()
    wx.setNavigationBarTitle({
      title: '拼购详情'
    })
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
    return {
      path: '/pages/groupResult/groupResult?type=payshare&orderId=' + this.data.id // 路径，传递参数到指定页面。 + '&id=' + this.data.id 
    }
  }
})