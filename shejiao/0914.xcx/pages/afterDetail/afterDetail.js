// pages/saleAfter/saleAfter.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page_name: '',
    bgColor: 'transparent',
    navHeight: app.globalData.navHeight, // 导航栏高度
    statusBarHeight: app.globalData.statusBarHeight, // 状态栏高度
    staticUrl: app.globalData.staticUrl,
    filePath: app.globalData.fileUrl,
    showSkeleton:true,
    options:{},
    afterDeatil:{},
  },
  goLink:util.throttle(function (e){
    wx.navigateTo({
      url: e[0].currentTarget.dataset.link+'?id='+this.data.options.id,
    })
  },500),
   // 填写物流
  goSales:util.throttle(function (e){
    wx.navigateTo({
      url: e[0].currentTarget.dataset.link,
    })
  }),
  // 服务详情信息
  getSaleInfo(){
    const that = this
    util.queryRequest('/app/after/afterDetails', {
      id:that.data.options.id,
    }, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          afterDeatil:res.data,
          showSkeleton:false
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        }) 
      }
    })
  },
  // 取消售后
  cancelSales(){
      const that=this
      wx.showModal({
        title: '提示',
        content: '确认要取消售后吗？',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '取消中...',
              mask: true
            })
            util.queryRequest('/app/after/cancelAfter', {
              id:that.data.options.id,
            }, 'POST').then(function (res) {
              if (res.code === 200 || res.code === '200') {
                wx.setStorageSync('sale_opertion', '1')
                wx.hideLoading()
                wx.showToast({
                  title: '售后取消成功',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 1000
                })
                console.log(res.msg)
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    that.setData({
      options:options
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
    wx.setNavigationBarTitle({
      title: '服务单详情',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    this.getSaleInfo()
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