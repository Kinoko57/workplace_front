// pages/proSale/proSale.js
var app=getApp()
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product_id:'',
    goods_id:'',
    sale_type:'',
    showSkeleton:true,
    staticUrl: app.globalData.staticUrl,
    is_show:false,
    filePath: app.globalData.fileUrl,
    proObj:{},
    oid:'',
    supplier:'',
  },
  getProSale(){
    const that=this
    let obj={
      order_id:that.data.oid,
      product_id:that.data.product_id,
      goods_id:that.data.goods_id,
    }
    util.queryRequest('/app/after/afterGoods', obj, 'POST').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        // 判断是整单售后还是单个商品售后
         that.setData({
          showSkeleton:false,
          proObj:res.data
         })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        console.log(res.msg)
      }
    })
  },
  goSale(e){
    console.log(e)
    if(e.currentTarget.dataset.status==1){
      wx.redirectTo({
        url:e.currentTarget.dataset.link+'&order_id='+this.data.oid+'&product_id='+this.data.product_id+'&goods_id='+this.data.goods_id+'&sale_type='+this.data.sale_type,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    console.log(options,options.product_id)
    this.setData({
      supplier:options.supplierid,
      oid:options.oid,
      sale_type:options.order_type,
      product_id:options.product_id!=undefined?options.product_id:"",
      goods_id:options.goods_id!=undefined?options.goods_id:"",
    })
    wx.setNavigationBarTitle({
      title: '商品售后',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    this.getProSale()
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
    if(wx.getStorageSync('sale_address')!=undefined&&wx.getStorageSync('sale_address')!=''){
      wx.removeStorageSync('sale_address')
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