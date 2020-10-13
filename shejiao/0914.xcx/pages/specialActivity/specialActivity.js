// pages/specialActivity/specialActivity.js
let util = require('../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    showDisc:true,
    specialList:[],
    specialObj:{},
    page: 1,
    size: 10,
    total: 0,
    act_id: '',
    page_num: 0,
    hasData: true,
    is_end: false,
    is_load: false,
    showSkeleton:true,
    isTop: true,
    skeleton:true,
  },
  goLink: util.throttle(function (e) {
    wx.navigateTo({
      url: '../proDetail/proDetail?act_id=' + this.data.act_id +"&type=activity&act_type=100&id=" + e[0].currentTarget.id,
    })
  }),
  getList(){
    const that=this
    let obj={
      page:that.data.page,
      act_id: that.data.act_id,
      size:that.data.size
    }
    util.queryRequest('/app/specialActivity/get',obj, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        if(res.data.rows.length>0){
          let currentpage = that.data.page - 1
          that.setData({
            specialList:res.data.rows,
            showSkeleton: false,
            specialObj:res.data.public,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
          console.log(that.data.specialList)
          // 设置页面标题 specialObj.title
          wx.setNavigationBarTitle({
            title: that.data.specialObj.title
          })
        }else{
          that.setData({
            hasData: false,
            specialObj:res.data.activity_info,
            is_end: true,
            showSkeleton: false,
          })
        }
      }
    })
  },
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    this.setData({
      act_id: options.id
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
    wx.setNavigationBarTitle({
      title: '专题活动列表'
    })
    this.getList()
  },
  // 页面滚动控制顶部栏显示与否
  onPageScroll: function (e) {
    if (e.scrollTop > 500) {
      if (this.data.isTop == true) {
        this.setData({
          isTop: false
        })
      }
    }
    if (e.scrollTop <= 500) {
      if (this.data.isTop == false) {
        this.setData({
          isTop: true
        })
      }
    }
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
    if(this.data.is_end == false){
      let that = this
      let info = {
        act_id: that.data.act_id,
        page: ++that.data.page,
        size: that.data.size,
      }
      util.queryRequest('/app/specialActivity/index', info, 'GET').then(function (res) {
        if (res.code == 200) {
          console.log(res)
          if (res.data.rows.length > 0) {
            let currentpage = that.data.page - 1
            that.data.specialList = that.data.specialList.concat(res.data.rows)
            that.setData({
              specialList: that.data.specialList,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})