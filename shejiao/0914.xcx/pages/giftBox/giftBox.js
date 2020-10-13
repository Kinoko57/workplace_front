// pages/giftBox/giftBox.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSkeleton:true,
    line_bg_color:'linear-gradient(90deg,rgba(238,221,188,1) 0%,rgba(219,182,121,1) 100%)',
    staticUrl: app.globalData.staticUrl,
    scrollHeight:0,
    activityList: [],
    isTop:true,
    page: 1,
    size:10,
    hasData: true,
    is_end: false,
    is_load: false,
    topNum:0,
  },
  goLink:util.throttle(function (event){
      wx.navigateTo({
        url: event[0].currentTarget.dataset.link+'&type=3'
      })
  }),
  returnTop: function () {
    this.setData({
      topNum: 0,
    })
  },
  scroll(e){
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
  getList:function(){
    const that=this
    util.queryRequest('/app/giftActivity/index', {
      page: that.data.page,
      type: '1',
      size: that.data.size,
    }, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200'){
        that.setData({
          showSkeleton: false,
          scrollHeight: app.globalData.useWindowHeight
        })
        if (res.data.rows.length>0){
          that.setData({
            activityList: res.data.rows,
            hasData: true,
            is_load:true
          })
          if (res.data.rows.length<that.data.size){
            that.setData({
              is_end:true,
              is_load: false
            })
          }
        }else{
          that.setData({
            hasData:false,
            is_load: false,
            is_load:false
          })
        }
      }
    })
  },
  loadMore:function(){
    const that=this
    console.log
    if(that.data.is_load){
      let info = {
        type: '1',
        page: ++that.data.page,
        size: that.data.size
      }
      util.queryRequest('/app/giftActivity/index', info, 'GET').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          if (res.data.rows.length > 0) {
            that.data.activityList = that.data.activityList.concat(res.data.rows)
            that.setData({
              activityList: that.data.activityList,
              is_end: false,
              is_load: true,
            })
            if (res.data.rows.length < that.data.size) {
              that.setData({
                is_end: true,
                is_load: false,
              })
            }
          } else {
            that.setData({
              is_end: true,
              is_load: false,
            })
          }
        }
      })

    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
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