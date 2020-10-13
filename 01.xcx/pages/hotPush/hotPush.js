// pages/hotPush/hotPush.js
let util = require('../../utils/util.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    hotList: [],
    page: 1,
    limit: 3,
    isSign: true
  },
  viewDetail: function(e) {
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
  getList() {
    var that = this
    util.queryRequest('?app=b2c&m=goodsarticle&a=index', {
      limit: this.data.limit,
      page: this.data.page
    }, 'POST', function(res) {
      wx.hideLoading()
      if (res.isSuccess) {
        console.log(res)
        for (var i = 0; i < res.rows.length; i++) {
          res.rows[i].time = res.rows[i].createtime.split('-');
        }
        that.setData({
          hotList: res.rows,
          isShow: true
        })
      }
    })
  },
  onPageScroll: function(e) { // 获取滚动条当前位置
    if (e.scrollTop > 0) {
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
    } else {
      this.setData({
        top: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.dialog = this.selectComponent("#reload");
    wx.showLoading({
      title: '加载中',
    })
    wx.setNavigationBarTitle({
      title: '推荐精选'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f2f2f2',
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
    if (app.globalData.firstHot==0){
      this.setData({
        page:1
      })
      wx.pageScrollTo({
        scrollTop: 0,
      })
      this.getList()
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    app.globalData.firstHot = 0
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
    util.queryRequest('?app=b2c&m=goodsarticle&a=index', {
      page: ++that.data.page,
      limit: that.data.limit
    }, 'POST', function(res) {
      if (res.isSuccess) {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            res.rows[i].time = res.rows[i].createtime.split('-');
          }
          that.data.hotList = that.data.hotList.concat(res.rows)
          that.setData({
            hotList: that.data.hotList
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})