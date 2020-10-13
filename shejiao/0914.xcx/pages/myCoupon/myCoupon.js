// pages/myCoupon/myCoupon.js
let app = getApp()
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight: app.globalData.navHeight,
    staticUrl: app.globalData.staticUrl,
    couponList:[{id:'unuse',name:'未使用'},{id:'use',name:'已使用'},{id:'due',name:'已失效'}],
    choseId: 'unuse',
    scrollHeight:0,
    hasData:true,
    showSkeleton:false,
    page: 1,
    size: 6,
    couList: [],
    page_num: 0,
    is_end:false,
    hasData:false,
    total: 0
  },
  goLink: util.throttle(function (event) {
    console.log(event)
    if(event[0].currentTarget.dataset.status!=0){
      console.log("优惠券已过期或者已使用")
    }else{
      wx.navigateTo({
        url: event[0].currentTarget.dataset.link
      })
    }
  }),
  choseNavId:util.throttle(function(e){
    if(e[0].currentTarget.dataset.id!=this.data.choseId){
      this.setData({
        page: 1,
        couList: [],
        choseId:e[0].currentTarget.dataset.id
      })
      this.getList()
    }else{
      console.log("点击了相同的")
    }
  },500),
  getList:function(){
    let that = this
    let info = {}
    info = {
      page: this.data.page,
      size: this.data.size,
      type: this.data.choseId
    }
    util.queryRequest('/app/coupon/couponIndex', info, 'GET').then(function(res) {
      if (res.code == 200) {
        if (res.data.rows.length > 0){
          that.setData({
            couList: res.data.rows,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
        }
        else{
          that.setData({
            hasData: false,
            is_end: true
          })
        }
      }
    })
  },
  loadMore:function(){
    let that = this
    let info = {}
    info = {
      page: ++this.data.page,
      size: this.data.size,
      type: this.data.choseId
    }
    util.queryRequest('/app/coupon/couponIndex', info, 'GET').then(function(res) {
      wx.hideLoading()
      if (res.code == 200) {
        if (res.data.rows.length > 0){
          that.data.couList = that.data.couList.concat(res.data.rows)
          that.setData({
            couList: that.data.couList,
            is_end: that.data.page_num == that.data.page,
          })
        }else{
          that.setData({
            is_end: true
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    // that.setData({
    //   scrollHeight: app.globalData.useWindowHeight-56
    // })
    this.getList()
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
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
    if (this.data.is_end==false){
      this.loadMore()
    }else{
      console.log("加载完了")

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})