// pages/tryOut/tryOut.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time_id: '',
    newNews: false,
    total: 0,
    total_amout: 0,
    isShow: false,
    active_type_id: '',
    timeList: [],
    tryList: [],
    boostList: [],
    endTime: null,
    apiUrl: app.globalData.apiUrl,
    tryImg: null,
    hiddenlogin: app.globalData.hiddenlogin,
    saleTime: [],
    page: 1,
    pagesize: 10,
    time: null,
    isSign: true,
    choseId: '',
    is_iphonex: app.globalData.phoneType
  },
  choseList: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      choseId: e.currentTarget.dataset.tid,
      time_id: e.currentTarget.dataset.tid,
      active_type_id: e.currentTarget.id
    })
    this.getList()
  },
  onPageScroll: function(e) { // 获取滚动条当前位置
    if (e.scrollTop > 900) {
      if (this.data.isSign) {
        this.setData({
          isSign: false
        })
      }
    } else {
      if (!this.data.isSign) {
        this.setData({
          isSign: true
        })
      }
    }
  },
  returnTop: function() {
    this.setData({
      isSign: true
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  showDetail: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '../tryOutdetail/tryOutdetail?id=' + e.currentTarget.id + '&form_share=0&help_id=null'
    })
  },
  getList: function() {
    var that = this
    // util.queryRequest('?m=activity&a=goods_time_try', {
    util.queryRequest('?m=activity&a=goods_date_try', {
      time_id: that.data.time_id
    }, 'POST', function(res) {
      if (res.isSuccess) {
        wx.setNavigationBarTitle({
          title: res.data.title
        })
        for (var i = 0; i < res.data.sales_type.length; i++) {
          res.data.sales_type[i].time_id = 'time' + res.data.sales_type[i].id
          if (res.data.sales_type[i].checked == 1) {}
        }
        that.setData({
          tryImg: res.data.try_bgimg,
          timeList: res.data.sales_type
        })
        if (that.data.choseId == '') {
          for (var i = 0; i < res.data.sales_type.length; i++) {
            if (res.data.sales_type[i].check == 1) {
              that.setData({
                choseId: res.data.sales_type[i].id,
                active_type_id: res.data.sales_type[i].time_id
              })
            }
          }
        }
        that.setData({
          isShow: true,
          tryList: res.data.try_list,
          boostList: res.data.help_list
        })
        wx.hideLoading()
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index'
          })
        }, 1000)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.dialog = this.selectComponent("#reload");
    wx.showLoading({
      title: '加载中',
    })
    this.getList()
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f2f2f2',
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  // showDialog() {
  //   this.dialog.showReload()
  // },
  // _relaod() {
  //   util.loadPage(this)
  //   console.log('触发relaod')
  // },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      newNews: app.globalData.news,
      total_amout: app.globalData.carNum,
      is_iphonex: app.globalData.phoneType
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // clearInterval(this.data.time);
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
    // var that = this
    // util.queryRequest('?m=activity&a=goods_try', {
    //   page: ++that.data.page,
    //   pagesize: that.data.pagesize
    // }, 'POST', function (res) {
    //   if (res.isSuccess) {
    //     if (res.data.try_list.rows == null) {
    //       res.data.try_list.rows = []
    //     }
    //     that.setData({
    //       isShow: true,
    //       tryImg: res.data.try_bgimg
    //     })
    //     that.data.tryList = that.data.tryList.concat(res.data.try_list.rows)
    //     that.setData({
    //       tryList: that.data.tryList,
    //       total: res.data.try_list.total
    //     })
    //   }
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})