// pages/mytryOut/mytryOut.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.fileUrl,
    tryType: 1,
    p: 1,
    limit: 4,
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
    console.log(e.currentTarget.dataset.gid)
    let groupOrderList = []
    for(let i =0;i<this.data.orderList.length;i++){
      if(this.data.orderList[i].team_id==e.currentTarget.dataset.gid){
        groupOrderList = this.data.orderList[i].order_id
      }
    }
    console.log(groupOrderList)
    if(groupOrderList.length==1){
      wx.navigateTo({
        url: '../orderDetail/orderDetail?order_id=' + groupOrderList[0]
      })
    }else{
      wx.showActionSheet({
        itemList: groupOrderList,
        success (res) {
          console.log(res.tapIndex)
          wx.navigateTo({
            url: '../orderDetail/orderDetail?order_id=' + groupOrderList[res.tapIndex]
          })
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  getList: function() {
    var that = this
    util.queryRequest('app/groupbuy/myGroupIndex', {
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
            total: res.data.total
          })
        }else{
          if (that.data.tryType == '1') {
            that.data.tips = '您暂时没有团购商品，赶快去开团或拼团吧！'
          } else if (that.data.tryType == '3') {
            that.data.tips = '您暂时没有拼团成功的商品，赶快去开团或拼团吧！'
          } else if (that.data.tryType == '4') {
            that.data.tips = '您暂时没有拼团失败的商品，赶快去开团或拼团吧！'
          } else {
            that.data.tips = '您暂时没有拼团中的商品，赶快去开团或拼团吧！'
          }
          that.setData({
            orderList: [],
            total: 0,
            tips: that.data.tips
          })
        }

      } else {
        if (that.data.tryType == '1') {
          that.data.tips = '您暂时没有团购商品，赶快去开团或拼团吧！'
        } else if (that.data.tryType == '3') {
          that.data.tips = '您暂时没有拼团成功的商品，赶快去开团或拼团吧！'
        } else if (that.data.tryType == '4') {
          that.data.tips = '您暂时没有拼团失败的商品，赶快去开团或拼团吧！'
        } else {
          that.data.tips = '您暂时没有拼团中的商品，赶快去开团或拼团吧！'
        }
        that.setData({
          orderList: '',
          total: 0,
          tips: that.data.tips
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
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
          total: res.data.total
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