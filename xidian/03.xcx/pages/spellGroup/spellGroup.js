// pages/spellGroup/spellGroup.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTop:true,
    page: 1,
    size:10,
    hasData: true,
    is_end: false,
    is_load: false,
    topNum:0,
    showSkeleton:true,
    scrollHeight:0,
    choseId:'2',
    navList:[
      { id: '3', name: '已结束' },
      { id: '2', name: '拼团进行时' },
      { id: '1', name: '即将开团' },
      ],
    groupList:[]
  },
  returnTop: function () {
    this.setData({
      topNum: 0,
    })
  },
  choseNavId(e){
    this.setData({
      choseId: e.currentTarget.id,
      groupList: [],
      page: 1,
    })
    this.getList()
  },
  getList:function(){
    const that=this
    util.queryRequest('app/groupbuy/index', {
      status: that.data.choseId,
      page: that.data.page,
      size: that.data.size,
    }, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200'){
        that.setData({
          showSkeleton: false,
        })
        console.log(app.globalData.useWindowHeight,that.data.scrollHeight)
        if (res.data.rows.length>0){
          that.setData({
            groupList: res.data.rows,
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
  goLink: util.throttle(function (event) {
    console.log(event)
    wx.navigateTo({
      url: event[0].currentTarget.dataset.link
    })
  }),
  loadMore:function(){
    const that=this
    console.log
    if(that.data.is_load){
      let info = {
        status: that.data.choseId,
        page: ++that.data.page,
        size: that.data.size
      }
      util.queryRequest('app/groupbuy/index', info, 'GET').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          if (res.data.rows.length > 0) {
            that.data.groupList = that.data.groupList.concat(res.data.rows)
            that.setData({
              groupList: that.data.groupList,
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
  onLoad: function (options) {
    const that=this
    wx.setNavigationBarTitle({
      title: '优惠拼团'
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight - 55
        })
      },
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
      // let query1 = wx.createSelectorQuery()
      // query1.select('.group_nav').boundingClientRect()
      // query1.exec(function (res) {
      //   that.setData({
      //     scrollHeight: app.globalData.useWindowHeight - res[0].height
      //   })
      // })
    }, 500)
    that.getList()
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
  // onShareAppMessage: function () {

  // }
})