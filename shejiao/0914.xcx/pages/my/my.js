// pages/my/my.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toBg:'transparent',
    staticUrl: app.globalData.staticUrl,
    zan_height:258-app.globalData.navHeight,
    navHeight:app.globalData.navHeight,
    showSkeleton: true, //骨架屏显示隐藏
    userInfo: {
      collect_num: 0,
      track_num: 0,
      discount_num: 0,
      unread_num: 0
    },
    isLogin: false,
    orderType: [{
        type: 'type_0',
        width:'45rpx',
        icon: app.globalData.staticUrl + 'my/order1.png',
        name: '待付款',
        link:'../orderManage/orderManage',
        num: 0,
      },
      {
        type: 'type_1',
        width:'47rpx',
        icon: app.globalData.staticUrl + 'my/order2.png',
        name: '待发货',
        link:'../orderManage/orderManage',
        num: 0
      },
      {
        type: 'type_2',
        width:'45rpx',
        icon: app.globalData.staticUrl + 'my/order3.png',
        name: '待收货',
        link:'../orderManage/orderManage',
        num: 0
      },
      {
        type: 'type_3',
        width:'41rpx',
        icon: app.globalData.staticUrl + 'my/order4.png',
        name: '评价',
        link:'../orderManage/orderManage',
        status: 0
      },
      {
        type: '1',
        icon: app.globalData.staticUrl + 'my/order5.png',
        name: '退款/售后',
        width:'41rpx',
        link:'../saleList/saleList',
        num: 0
      },
    ],
    useList: [{
        img: app.globalData.staticUrl + 'my/basic1.png',
        name: '基础资料',
        height:'72rpx',
        padding_top:'16rpx',
        link: '../myCenter/myCenter',
        status: '0'
      },
      {
        img: app.globalData.staticUrl + 'my/basic2.png',
        name: '账户安全',
        padding_top:'10rpx',
        link: '../accountSecurity/accountSecurity',
        height:'75rpx',
        status: '0'
      },
      {
        img: app.globalData.staticUrl + 'my/basic4.png',
        name: '收货地址',
        height:'72rpx',
        padding_top:'16rpx',
        link: '../myAdress/myAdress',
        status: '0'
      },
      {
        img: app.globalData.staticUrl + 'my/basic5.png',
        name: '消息中心',
        height:'72rpx',
        padding_top:'16rpx',
        link: '../messageCenter/messageCenter',
        status: '1'
      },
      {
        img: app.globalData.staticUrl + 'my/basic9.png',
        name: '我的奖品',
        height:'72rpx',
        padding_top:'16rpx',
        link: '../myGifts/myGifts',
        status: '0'
      },
      {
        img: app.globalData.staticUrl + 'my/basic9.png',
        name: '我的拼团',
        height:'72rpx',
        padding_top:'16rpx',
        link: '../myGroupBy/myGroupBy',
        status: '0'
      },
      {
        img: app.globalData.staticUrl + 'my/basic10.png',
        name: '直播活动',
        height:'72rpx',
        padding_top:'16rpx',
        link: '../liveActivity/liveActivity',
        status: '0'
      },
      {
        img: app.globalData.staticUrl + 'my/basic11.png',
        name: '粉丝订单',
        height:'72rpx',
        padding_top:'16rpx',
        link: '../orderFansManage/orderFansManage?status=type_-1',
        status: '0'
      },
      {
        img: app.globalData.staticUrl + 'my/basic7.png',
        name: '关于夷购',
        link: '../protocol/protocol?type=about',
        padding_top:'12rpx',
        height:'74rpx',
        status: '0'
      },
      {
        img: app.globalData.staticUrl + 'my/basic8.png',
        name: '版本信息',
        height:'72rpx',
        padding_top:'16rpx',
        link: '../copyright/copyright',
        status: '0'
      }
    ]
  },
  getMyInfo: function () {
    var that = this
    // 查看个人信息列表
    util.queryRequest('/app/personalCenter/index', {}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.data.orderType[0].num = res.data.unpaid_num
        that.data.orderType[1].num = res.data.undelivered_num
        that.data.orderType[2].num = res.data.unreceived_num
        that.data.orderType[3].num = res.data.unevaluated_num
        that.setData({
          userInfo: res.data,
          orderType: that.data.orderType,
          showSkeleton: false,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        console.log(res.msg)
      }
    })

  },
  goOrder(e) {
    if (util.isLogin()){
      wx.navigateTo({
        url:e.currentTarget.dataset.link+'?status=' + e.currentTarget.dataset.type
      })
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
 
  },
  goLink: function (e) {
    if (util.isLogin()){
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  onPageScroll(e){
    if (e.scrollTop <= 1) {
        this.setData({
          toBg: 'transparent',
        })
    }else{
      this.setData({
        toBg:'#BF1323'
      })
    }
    console.log(this.data.topBg)
  },
  goLogin() {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    
    if (wx.getStorageSync("token") != '' && wx.getStorageSync("token") != undefined) {
      this.setData({
        isLogin: true,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
    this.getTabBar()) {
    this.getTabBar().setData({
      selected: 4
    })
  }
    if (this.data.isLogin) {
      // 如果用户登录就获取用户信息
      this.getMyInfo()
    } else {
      setTimeout(() => {
        this.setData({
          showSkeleton: false,
        })
      }, 100)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})