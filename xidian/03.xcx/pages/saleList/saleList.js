// pages/saleList/saleList.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    showSkeleton:true,
    choseId:'0',
    scrollHeight:0,
    page:1,
    size:10,
    page_num:0,
    hasData: true,
    is_end: false,
    isTop: true,
    topNum:0,
    navList:[
      { id: '0', name: '全部' },
      { id: '1', name: '售后' }, 
      { id: '2', name: '已完成' },
      // { id: '5', name: '已驳回' },
      { id: '3', name: '已取消' },
      ],
    saleList:[]
  },
  choseNavId:util.throttle(function (e){
    if(this.data.choseId!=e[0].currentTarget.id){
      this.setData({
        choseId: e[0].currentTarget.id,
        page:1,
        size:10,
        page_num:0,
        hasData: true,
        saleList:[],
        is_end: false,
      })
      this.getList()
    }
  },500),
  goDetail(e){
    wx.navigateTo({
      url: '../afterDetail/afterDetail?id='+e.currentTarget.dataset.id,
    })
    // if(e.currentTarget.dataset.status==1){
    //    wx.navi
    // }else{
    // }
  },
  getList(){
    const that = this
    console.log(this.data.size,"尺寸")
    util.queryRequest('app/after/index', {
       page:that.data.page,
       size:that.data.size,
       status: that.data.choseId,
    }, 'GET').then(function (res) {
      console.log(res,"售后")
      if (res.code === 200 || res.code === '200') {
        if (res.data.rows.length > 0) {
          let currentpage = that.data.page - 1
            that.setData({
              showSkeleton: false,
              ['saleList[' + currentpage + ']']: res.data.rows,
              total: res.data.total,
              page_num: Math.ceil(res.data.total / that.data.size),
              is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
              hasData: true
            })
        }else {
          that.setData({
            showSkeleton: false,
            hasData: false,
            is_end: true
          })
        }
      }
    })
  },
  loadMore() {
    let that = this
    if (this.data.is_end == false) {
      let info = {
        page: ++this.data.page,
        size: this.data.size,
        status: that.data.choseId,
      }
      util.queryRequest('app/after/index', info, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          console.log(res)
          let currentpage = that.data.page - 1
          that.setData({
            ['saleList[' + currentpage + ']']: res.data.rows,
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
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight-55
        })
      },
    })
    this.setData({
      choseId:options.status
    })
    wx.setNavigationBarTitle({
      title: '售后列表'
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
    this.setData({
      page:1,
      page_num:0,
      hasData: true,
      saleList:[],
      is_end: false,
    })
    this.getList()
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
  // onShareAppMessage: function () {

  // }
})