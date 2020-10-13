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
    page:1,
    size:10,
    choseId:'0',
    scrollHeight:0,
    saleList:[],
    topNum: 0,
    is_end: false,
    hasData: true,
    isTop: true,
    page_num: 0,
    navList:[
      { id: '0', name: '全部' },
      { id: '1', name: '售后' },
      { id: '2', name: '已完成' },
      { id: '3', name: '已取消' },
      ],
  },

  goDetail:util.throttle(function (e){
    console.log()
    wx.navigateTo({
      url: '../afterDetail/afterDetail?id='+e[0].currentTarget.dataset.id,
    })
  }),
  choseNavId(e){
    this.setData({
      choseId: e.currentTarget.id,
      saleList:[],
      page:1,
      topNum: 0,
      is_end: false,
      hasData: true,
      isTop: true,
      page_num: 0,
    })
    this.getList()
  },
  getList(){
    const that = this
    util.queryRequest('/app/after/afterList', {
       type: that.data.choseId,
       page:that.data.page,
       size:that.data.size
    }, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        wx.setStorageSync('sale_opertion', '')
        if (res.data.rows.length > 0) {
          let currentpage = that.data.page - 1
          that.setData({
            ['saleList[' + currentpage + ']']: res.data.rows,
            total: res.data.total,
            showSkeleton:false,
            billObj:res.data.billData,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
          console.log(that.data.saleList,"shuzi")
        }else {
          that.setData({
            host_url:res.data.host_url,
            hasData: false,
            showSkeleton:false,
            is_end: true
          })
        }
      }
    })
  },
  loadMore() {
    let that = this
    if (this.data.is_end == false) {
      util.queryRequest('/app/after/afterList', {
        type: that.data.choseId,
        page:++that.data.page,
        size:that.data.size
     }, 'GET').then(function (res) {
       if (res.code === 200 || res.code === '200') {
        let currentpage = that.data.page - 1
        that.setData({
          ['saleList[' + currentpage + ']']: res.data.rows,
          is_end: that.data.page_num == that.data.page
        })
       }
     })
    } else {
      console.log("加载完了")
    }

  },
  returnTop: function () {
    this.setData({
      topNum: 0,
    })
  },
  scroll: function (e) {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    that.setData({
      scrollHeight: app.globalData.useWindowHeight-55,
      choseId:options.status
    })
    wx.setNavigationBarTitle({
      title:'售后订单',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(wx.getStorageSync('sale_opertion')!=undefined&&wx.getStorageSync('sale_opertion')!=''){
      this.setData({
        choseId:'0',
        saleList:[],
        page:1,
        topNum: 0,
        is_end: false,
        hasData: true,
        isTop: true,
        page_num: 0,
      })
      this.getList()
    }
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