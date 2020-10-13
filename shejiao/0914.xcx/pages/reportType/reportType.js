// pages/reportType/reportType.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    reportList:[],
    showSkeleton:true,
    scene:1,
  },
  goLink:util.throttle(function (e){
     wx.navigateTo({
       url: e[0].currentTarget.dataset.link+'&id='+this.data.id+'&scene='+this.data.scene
     })   
  }),
  getList(){
    const that=this
    util.queryRequest('/app/complain/complainType', {}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          reportList: res.data,
          showSkeleton:false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"options")
    this.setData({
      id:options.id,
      scene:options.scene
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