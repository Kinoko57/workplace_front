// pages/flashSale/flashSale.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg_color:'#e13816',
    line_bg_color:'linear-gradient(-90deg,rgba(248,45,45,1) 0%,rgba(254,153,153,1) 100%)',
    is_iphonex: app.globalData.isiPhoneX,
    staticUrl: app.globalData.staticUrl,
    showSkeleton: true, //骨架屏显示隐藏
    choseId: 1,
    checkchose:0,
    filePath: app.globalData.fileUrl,
    choseType: 1,
    timeList: [{
        id: 2,
        text: '历史体验',
        status: 2
      },
      {
        id: 1,
        text: '体验进行中',
        status: 1
      },
      {
        id: 3,
        text: '体验预告',
        status: 3
      }
    ],
    scrollHeight: 0, // 促销滚动高度
    activityList: [],
    isTop:true,
    page: 1,
    size:10,
    hasData: true,
    is_end: false,
    is_load: false,
    topNum:0,
  },
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  goLink:util.throttle(function (event){
      wx.navigateTo({
        url: event[0].currentTarget.dataset.link
      })
  }),
  choseActivity(event) {
    const that = this;
    if(event.currentTarget.dataset.id!=that.data.choseId){
      that.setData({
        hasData: true,
        is_end: false,
        is_load: false,
        page: 1,
        size: 10,
        activityList: [],
        choseId: event.currentTarget.dataset.id,
        choseType: event.currentTarget.dataset.status
      })
      this.getList()
    }
  },
  getList:function(){
    const that=this
    util.queryRequest('/app/expe/index', {
      type: that.data.choseId,
      page: that.data.page,
      size: that.data.size,
    }, 'GET').then(function (res) {
      wx.stopPullDownRefresh()
      if (res.code === 200 || res.code === '200'){
        that.setData({
          showSkeleton: false,
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
    if(that.data.is_load){
      let info = {
        type: that.data.choseId,
        page: ++that.data.page,
        size: that.data.size
      }
      util.queryRequest('/app/expe/index', info, 'GET').then(function (res) {
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
  // 页面滚动控制顶部栏显示与否
  onPageScroll: function (e) {
    if (e.scrollTop > 540) {
      if (this.data.isTop == true) {
        this.setData({
          isTop: false
        })
      }
    }
    if (e.scrollTop <= 540) {
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
  onLoad: function(options) {
    const that=this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight-55
        })
      },
    })
    wx.setNavigationBarTitle({
      title:'体验专区',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
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
    const that=this
    that.setData({
      hasData: true,
      is_end: false,
      is_load: false,
      page: 1,
      size: 10,
      activityList: [],
      choseId: that.data.choseId,
      choseType: that.data.choseType
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadMore()
    console.log("触底了")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
  }
})