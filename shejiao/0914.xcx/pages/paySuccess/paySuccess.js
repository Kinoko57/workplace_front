// pages/paySuccess/paySuccess.js
var app = getApp()
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSkeleton:true,
    pay_price:'',
    staticUrl: app.globalData.staticUrl,
    filePath: app.globalData.fileUrl,
    staticUrl: app.globalData.staticUrl,
    zan_height:270-app.globalData.navHeight,
    navHeight:app.globalData.navHeight,
    is_iphonex: app.globalData.isiPhoneX,
    scrollHeight:0,
    blocklist:[
    ],
    page: 1,
    size: 6,
    hasData: false,
    is_end: false,
    page_num: 0,
    total: 0
  },
  findOrder(){
    wx.redirectTo({
      url: '../orderManage/orderManage?status=type_1',
    })
  },
  backIndex(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  goProDetail: util.throttle(function (e) {
    console.log(e[0])
    let type = e[0].currentTarget.dataset.type
    let id = e[0].currentTarget.id
    if (type == 0) {
      wx.navigateTo({
        url: '/pages/proDetail/proDetail?id=' + id
      })
    } else {
      wx.navigateTo({
        url: '/pages/flashDetail/flashDetail?id=' + id + '&type=' + type
      })
    }
  }),
  getList:function(){
    let that = this
    let info = {
      page: this.data.page,
      size: this.data.size
    }
    util.queryRequest('/app/pay/recommend', info, "GET").then(function (res) {
      console.log(res)
      if (res.code == 200) {
        console.log(res.data)
        that.setData({
          recommendList: res.data.rows.rows,
          total: res.data.total,
          page_num: Math.ceil(res.data.total / that.data.size),
          is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
          hasData: true,
        })
      } else {
      }
    })
  },
  loadMore() {
    let that = this
    let info = {}
    if (this.data.is_end == false) {
      console.log('加载更多')
      info = {
        page: ++this.data.page,
        size: this.data.size
      }
      console.log(info)
      util.queryRequest('/app/pay/recommend', info, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log(res.data)
          if (res.data.rows.length > 0) {
            that.data.recommendList = that.data.recommendList.concat(res.data.rows.rows,)
            that.setData({
              recommendList: that.data.recommendList,
              is_end: that.data.page_num == that.data.page
            })
          } else {
            that.setData({
              is_end: true
            })
          }
        }
      })
    } else {
      console.log("加载完了")
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scrollHeight:app.globalData.useWindowHeight - this.data.zan_height-56,
      pay_price:options.pay_price
    })
    this.getList()
     setTimeout(()=>{
       this.setData({
         showSkeleton:false
       })
     },500)
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