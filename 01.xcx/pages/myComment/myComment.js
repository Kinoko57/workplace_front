// pages/myComment/myComment.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showImg: false,
    comList: [],
    userInfo: {
      avatar: '',
      nickname: '',
      username: '',
      isShow: 0,
    },
    commOrder:[],
    apiUrl: app.globalData.apiUrl,
    page: 1,
    limit: 10,
    total: 0,
    order_total: 0
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
  getList: function() {
    var that = this
    //获取我的评价
    util.queryRequest('?m=member&a=mycomment', {
      page: that.data.page,
      limit: that.data.limit
    }, 'POST', function(res) {
      if (res.isSuccess) {
        that.setData({
          comList: res.data.rows,
          total: res.data.total
        })
        for (var i = 0; i < that.data.comList.length; i++) {
          that.data.comList[i].createtime = util.formatTime(that.data.comList[i].createtime)
        }
        that.setData({
          comList: that.data.comList
        })
      }
    })
    //获取未评价订单
    util.queryRequest('?m=member&a=getOrders', {
      id: 6,
      page: 1
    }, 'GET', function(res) {
      if (res.isSuccess) {
        if (res.rows != null) {
          that.setData({
            commOrder: res.rows,
            order_total: res.total
          })
        }
      }
    })
  },
  goComm: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url + '?num=' + e.currentTarget.dataset.num + '&orderId=' + e.currentTarget.id
    })
  },
  previewImg: function(e) {
    this.setData({
      showImg: true
    })
    var imgs = [];
    for (var i = 0; i < this.data.comList.length; i++) {
      if (this.data.comList[i].id == e.currentTarget.dataset.comid) {
        imgs = this.data.comList[i].pic
      }
    }
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.setNavigationBarTitle({
      title: '我的评价'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff8d97',
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
    // this.dialog = this.selectComponent("#reload");
    if (this.data.showImg == false) {
      this.setData({
        userInfo: wx.getStorageSync("userInfo"),
        page: 1
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
      // 查看评价列表
      this.getList()
    }
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
    // var that = this
    // that.setData({
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
    util.queryRequest('?m=member&a=mycomment', {
      page: ++that.data.page,
      limit: that.data.limit
    }, 'POST', function(res) {
      if (res.isSuccess) {
        for (var i = 0; i < res.data.rows.length; i++) {
          res.data.rows[i].createtime = util.formatTime(res.data.rows[i].createtime)
        }
        that.data.comList = that.data.comList.concat(res.data.rows)
        that.setData({
          comList: that.data.comList
        })
        console.log(that.data.comList.length)
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})