// pages/balanceDetails/balanceDetails.js

let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSkeleton:true,
    isiPhoneX: app.globalData.isiPhoneX,
    scrollHeight:0,
    cashList:[],
    total:0,
    page:1,
    size:20,
    page_num:0,
    hasData: true,
    is_end: false,
    isTop: true,
    topNum:0,
  },
  returnTop: function () {
    this.setData({
      topNum: 0,
    })
  },
  scroll: function (e) {
    if (e.detail.scrollTop >= 680) {
      if (this.data.isTop) {
        this.setData({
          isTop: false
        })
      }
    } else {
      if (this.data.isTop == false) {
        this.setData({
          isTop: true
        })
      }
    }
  },
  getList(){
    const that = this
    util.queryRequest('/app/wallet/balanceDetails', {
       page:that.data.page,
       size:that.data.size,
    }, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        if (res.data.rows.length > 0) {
          let currentpage = that.data.page - 1
          that.data.page_num=Math.ceil(res.data.total / that.data.size)
          that.setData({
            ['cashList[' + currentpage + ']']: res.data.rows,
            total: res.data.total,
            showSkeleton:false,
            // page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
        }else {
          that.setData({
            hasData: false,
            showSkeleton:false,
            is_end: true
          })
        }
      }
    })
  },
  loadMore() {
    let that = this
    let status = ''
    if (this.data.is_end == false) {
      let info = {
        page: ++this.data.page,
        size: this.data.size,
      }
      util.queryRequest('/app/wallet/balanceDetails', info, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          console.log(res)
          let currentpage = that.data.page - 1
          that.setData({
            ['cashList[' + currentpage + ']']: res.data.rows,
            is_end: that.data.page_num == that.data.page
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
    } else {
      console.log("加载完了")
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    wx.setNavigationBarTitle({
      title: '余额明细',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    that.setData({
      scrollHeight: app.globalData.useWindowHeight-1
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
    this.getList()
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