// pages/findLog/findLog.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSkeleton:true,
    staticUrl: app.globalData.staticUrl,
    options:{},
    logObj:{
      goods_image: '',
      nums: 1
    },
    list:[
    ]
  },
  getList: function () {
    var that = this
    // 查看物流
    let obj={
      oid:that.data.options.oid,
    }
    util.queryRequest('/app/orders/getOrderLogistics', obj, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        if(res.data.goodsInfo!=''&&res.data.goodsInfo!=null&&res.data.goodsInfo!='null'&&res.data.goodsInfo!=undefined){
          that.data.logObj = res.data.goodsInfo
        }
        that.setData({
          logObj:that.data.logObj,
          list:res.data.trackData,
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
  // 复制
  copyOrd(e){
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.id,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1000
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    options:options
  })
  if(options.img!=undefined){
    this.data.logObj.goods_image = options.img
    this.setData({
      logObj: this.data.logObj
    })
    console.log(this.data.logObj)
  }
  this.getList()
   setTimeout(()=>{
    this.setData({
      showSkeleton:false
    })
   },500)
    wx.setNavigationBarTitle({
      title:'查看物流',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
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