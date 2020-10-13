// pages/paymentGuide/paymentGuide.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_iphonex: app.globalData.isiPhoneX,
    pay_link:'',
    show_pay:'1',//显示第几张图
  },
    // 复制支付宝链接
    copyOrd(e){
      var that = this;
      wx.setClipboardData({
        //准备复制的数据
        data:that.data.pay_link,
        success: function (res) {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 1000
          });
          that.setData({
            show_pay:'2'
          })
          wx.setStorageSync('showAlipay', false)
        }
      });
    },
    // 第二部
    nex_step(){
      this.setData({
        show_pay:'3'
      })
    },
    // 结束
    step_end(){
      wx.navigateBack({
        delta: 1
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
      pay_link:decodeURIComponent(options.link)
     })
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