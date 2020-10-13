// pages/flashSale/flashSale.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_iphonex: app.globalData.isiPhoneX,
    staticUrl: app.globalData.staticUrl,
    showSkeleton: true, //骨架屏显示隐藏
    choseId: 1,
    line_bg_color:'linear-gradient(-90deg,rgba(248,45,45,1) 0%,rgba(254,153,153,1) 100%)',
    checkchose:0,
    filePath: app.globalData.fileUrl,
    scrollHeight: 0, // 促销滚动高度
    integralList:[],
    integralObj:{},
    page: 1,
    size: 10,
    total: 0,
    page_num: 0,
    hasData: true,
    is_end: false,
    is_load: false,
    showSkeleton:true,
    isTop: true,
  },
  checkChose(){},
  returnTop:function(){
    this.setData({
      topNum: 0,
    })
  },
  goLink(event) {
    wx.navigateTo({
      url: event.currentTarget.dataset.link
    })
  },
  getList(){
    const that=this
    let obj={
      page:that.data.page,
      size:that.data.size
    }
    util.queryRequest('/app/integral/index',obj, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        if(res.data.rows.length>0){
          let currentpage = that.data.page - 1
          that.setData({
            ['integralList['+currentpage+']']:res.data.rows,
            showSkeleton: false,
            integralObj:res.data.confing,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
          console.log(that.data.integralList)
        }else{
          that.setData({
            hasData: false,
            integralObj:res.data.public,
            is_end: true,
            showSkeleton: false,
          })
        }
      }
    })
  },
  loadMore:function(){
    const that=this
    if(this.data.is_end == false){
      let that = this
      let info = {
        page: ++that.data.page,
        size: that.data.size,
      }
      util.queryRequest('/app/integral/index', info, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log(res)
          if (res.data.rows.length > 0) {
            let currentpage = that.data.page - 1
            that.setData({
              ['integralList[' + currentpage + ']']: res.data.rows,
              is_end: that.data.page_num == that.data.page
            })
          } else {
            that.setData({
              is_end: true,
            })
          }
        }
      })
    }
  },
  scroll: function (e) {
    if (e.detail.scrollTop >= 680) {
      if (this.data.isTop){
        this.setData({
          isTop: false
        })
      }
    } else {
      if (!this.data.isTop) {
        this.setData({
          isTop: true
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that=this
      that.setData({
        scrollHeight: app.globalData.useWindowHeight
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    console.log("触底了")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})