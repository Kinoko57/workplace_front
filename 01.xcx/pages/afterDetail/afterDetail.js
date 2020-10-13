// pages/afterDetail/afterDetail.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    procomm: '',
    track_name: '',
    track_number: '',
    uploadimg: [],
    uploadOk: false,
    tempFilePaths: [],
    apiUrl: app.globalData.apiUrl,
    imgs: [],
    ischose: '',
    pid: '',
    order_Id: '',
    orderInfo: '',
    flag: 0,
    order_type:''
  },
  getInfo: function() {
    var that = this
    util.queryRequest('?m=member&a=refund', {
      order_id: that.data.order_Id,
      product_id: that.data.pid
    }, 'POST', function(res) {
      if (res.isSuccess) {
        that.setData({
          orderInfo: res.data,
          ischose: res.data.refund_info.type == undefined ? '' : res.data.refund_info.type,
          procomm: res.data.refund_info.content == undefined ? '' : res.data.refund_info.content,
          imgs: res.data.refund_info.imgs == undefined ? [] : res.data.refund_info.imgs,
          flag: res.data.flag,
          track_name: res.data.refund_info.express == undefined ? '' : res.data.refund_info.express,
          track_number: res.data.refund_info.express_no == undefined ? '' : res.data.refund_info.express_no
        })
      }
    })
  },
  afterSale: function(e) {
    wx.navigateTo({
      url: '../saleAfter/saleAfter?pid=' + e.currentTarget.id + '&orderId=' + e.currentTarget.dataset.orderid + '&order_type=' + this.data.order_type
    })
  },
  afterCancel: function(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确定取消当前售后申请？',
      success: function(res) {
        if (res.confirm) {
          util.queryRequest('?m=member&a=cancel_refund', {
            order_id: e.currentTarget.dataset.orderid,
            product_id: e.currentTarget.id
          }, 'POST', function(res) {
            if (res.isSuccess) {
              wx.showToast({
                title: '成功取消',
                icon: 'success',
                duration: 1000,
                mask: true
              })
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1
                })
              }.bind(that), 1000)
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
  onLoad: function(options) {
    // this.dialog = this.selectComponent("#reload");
    this.setData({
      pid: options.pid,
      order_Id: options.orderId,
      order_type: options.order_type
    })
    wx.setNavigationBarTitle({
      title: '售后订单详情'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff8d97',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },
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
    this.getInfo()
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
  // onShareAppMessage: function() {

  // }
})