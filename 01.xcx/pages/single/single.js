// pages/single/single.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    topNum: 0,
    brandHeight: 0,
    allowScorll: true,
    isShow: false,
    hiddenFixed: true,
    vipDetail: 0,
    navNtn: 2,
    hiddenlogin: app.globalData.hiddenlogin,
    apiUrl: app.globalData.apiUrl,
    page: 1,
    pagesize: 6,
    vipList: [],
    vipBg: null,
    isSign: true,
    total: 0,
    top: 0,
    amount: 0.00,
    difference: 0.00,
    full_amount: 0.00,
    is_load: true,
    is_iphonex: app.globalData.phoneType
  },

  goPro: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  goCar: function(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.link
    })
  },
  scroll: function(e) {
    if (e.detail.scrollTop >= 98) {
      this.setData({
        isScroll: true,
        top: e.detail.scrollTop
      })
      if (e.detail.scrollTop >= 980) {
        this.setData({
          isSign: false,
          top: e.detail.scrollTop
        })
      }
    } else {
      this.setData({
        isScroll: false,
        isSign: true,
        top: e.detail.scrollTop
      })
    }
  },
  returnTop: function() {
    this.setData({
      isSign: true
    })
    if (this.data.topNum == 0) {
      this.setData({
        topNum: 1
      })
    } else {
      this.setData({
        topNum: 0
      })
    }
  },
  addCar: function(e) {
    var that = this
    util.queryRequest('?m=cart&a=add', {
      pid: e.currentTarget.id,
      quantity: 1,
      checked: 0,
      deal_type: e.currentTarget.dataset.type
    }, 'GET', function(res) {
      if (res.isSuccess) {
        if (wx.getStorageSync("chosePro") == '') {
          wx.setStorageSync("chosePro", [e.currentTarget.id])
        } else {
          var carList = wx.getStorageSync("chosePro")
          for (var i = 0; i < carList.length; i++) {
            if (carList[i] == e.currentTarget.id) {
              console.log(1)
              break;
            }
          }
          if (i >= carList.length) {
            carList.push(e.currentTarget.id)
          }
          wx.setStorageSync("chosePro", carList)
        }
        that.data.amount = that.data.amount * 1000 + e.currentTarget.dataset.price * 1000
        that.data.difference = that.data.difference * 1000 - e.currentTarget.dataset.price * 1000
        that.setData({
          amount: (that.data.amount / 1000).toFixed(2),
          difference: (that.data.difference / 1000).toFixed(2)
        })
        wx.setStorageSync('carAmount', that.data.amount)
        wx.setStorageSync('difference', that.data.difference)
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success'
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  getList: function() {
    var that = this
    //查询购物车推荐商品
    util.queryRequest('?m=list&a=cart_recommend', {
      p: that.data.page,
      limit: that.data.pagesize,
      type: 0
    }, 'GET', function(res) {
      that.setData({
        isShow: true
      })
      wx.hideLoading()
      if (res.isSuccess) {
        console.log(res)
        that.setData({
          vipList: res.data,
          total: res.total
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight,
          amount: wx.getStorageSync('carAmount'),
          difference: wx.getStorageSync('difference'),
          full_amount: wx.getStorageSync('fullAmount')
        })
      }
    })
    wx.setNavigationBarTitle({
      title: '凑单列表'
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
    this.animation = wx.createAnimation({
      duration: 400
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showLoading({
      title: '加载中',
    })
    if (util.isLogin()) {
      this.data.searchFifter = [{
        price: '',
        point: '',
        brand: '',
        deal_type: '',
        price_range: ''
      }]
      this.setData({
        searchFifter: this.data.searchFifter
      })
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

  },
  // 上拉加载更多
  loadMore: function() {
    var that = this
    // if (this.data.is_load) {
    //   this.data.is_load = false;
    //   util.queryRequest('?m=list&a=cart_recommend', {
    //     page: ++that.data.page,
    //     pagesize: that.data.pagesize,
    //     type: 0
    //   }, 'GET', function(res) {
    //     if (res.isSuccess) {
    //       that.data.vipList = that.data.vipList.concat(res.data.list.rows)
    //       that.setData({
    //         vipList: that.data.vipList,
    //         vipBg: res.data.bgimg,
    //         total: res.data.list.total
    //       })
    //     }
    //   })
    // } else {
    //   that.setData({
    //     is_load: false
    //   })
    // }

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})