// pages/flashSale/flashSale.js
let util = require('../../utils/util.js')
let timer = require('../../utils/wxTimer.js')
var app = getApp()
var wxTimer
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newNews: false,
    total_amout: 0,
    isShow: false,
    headImg: '',
    choseTime: 1,
    choseId: '',
    apiUrl: app.globalData.apiUrl,
    hiddenlogin: app.globalData.hiddenlogin,
    timeList: [],
    leftLength: 0,
    blocklist: [],
    saleProList: [],
    total: 0,
    saleTime: [],
    wxTimerList: {},
    timeid: '',
    page: 1,
    pagesize: 4,
    endTimes: 0,
    endShow: false,
    chose_status: '',
    status: '',
    is_iphonex: app.globalData.phoneType
  },
  golink: function (e) {
    wx.navigateTo({
      url: '../flashSalelist/flashSalelist?type=1&id=' + e.currentTarget.id + '&timeId=' + this.data.timeid + '&status=' + this.data.chose_status
    })
  },
  goPro: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  choseList: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    // if (e.currentTarget.id == this.data.firstChose) {
    //   this.data.endShow = true
    // } else {
    //   this.data.endShow = false
    // }
    if (wxTimer !== undefined) {
      wxTimer.stop()
    }
    this.setData({
      choseId: e.currentTarget.id,
      timeid: e.currentTarget.id,
      page: 1,
      pagesize: 4,
      endShow: this.data.endShow,
      chose_status: e.currentTarget.dataset.status
    })
    for (var i = 0, len = this.data.timeList.length; i < len; i++) {
      if (this.data.timeList[i].id == e.currentTarget.id) {
        this.setData({
          status: this.data.timeList[i].status,
          endTimes: this.data.timeList[i].countdown
        })
        var endtime = this.data.timeList[i].countdown
        var hour = util.timeFormat(parseInt(endtime / 3600));
        var min = util.timeFormat(parseInt(endtime % 3600 / 60));
        var sec = util.timeFormat(parseInt(endtime % 3600 % 60));
        // 获取限时促销商品列表
        wxTimer = new timer({
          beginTime: hour + ':' + min + ':' + sec,
          complete: function () {
            console.log("完成了")
          }
        })
        wxTimer.start(this);
      }
    }
    this.getTimeList()
  },
  getTimeList: function () {
    var that = this
    util.queryRequest('?m=activity&a=goods_sales_type', {
      timeid: that.data.timeid,
      page: that.data.page,
      pagesize: that.data.pagesize
    }, 'POST', function (res) {
      wx.hideLoading()
      that.setData({
        isShow: true
      })
      if (res.isSuccess) {
        wx.setNavigationBarTitle({
          title: res.data.title
        })
        that.setData({
          headImg: res.data.bgimg,
          timeList: res.data.time_list,
          blocklist: res.data.type_list.rows,
          total: res.data.type_list.total
        })
        if (that.data.choseId == '') {
          for (var i = 0, len = that.data.timeList.length; i < len; i++) {
            if (res.data.time_list[i].checked != undefined) {
              that.setData({
                choseTime: i - 1,
                firstChose: res.data.time_list[i].id,
                choseId: res.data.time_list[i].id,
                endTimes: res.data.time_list[i].countdown,
                endShow: true,
                timeid: res.data.time_list[i].id,
                status: res.data.time_list[i].status
              })
            }
          }
          if (that.data.endTimes > 0) {
            var endtime = that.data.endTimes
            var hour = util.timeFormat(parseInt(endtime / 3600));
            var min = util.timeFormat(parseInt(endtime % 3600 / 60));
            var sec = util.timeFormat(parseInt(endtime % 3600 % 60));
            // 获取限时促销商品列表
            wxTimer = new timer({
              beginTime: hour + ':' + min + ':' + sec,
              complete: function () {
                console.log("完成了")
              }
            })
            wxTimer.start(that);
          }
          if (that.data.timeList.length > 4) {
            var query = wx.createSelectorQuery()
            query.select('.sale_nav').boundingClientRect()
            query.exec(function (res) {
              that.setData({
                leftLength: that.data.choseTime * res[0].width
              })
            })
          }
        }
        that.getList()
        wx.hideLoading()
      } else {
        wx.hideLoading()
      }
    })
  },
  getList: function () {
    var that = this
    util.queryRequest('?m=activity&a=goods_sales_list', {
      timeid: that.data.choseId,
      page: that.data.page,
      pagesize: that.data.pagesize
    }, 'POST', function (res) {
      that.setData({
        isShow: true
      })
      wx.hideLoading()
      if (res.isSuccess) {
        wx.setNavigationBarTitle({
          title: res.data.title
        })
        that.setData({
          saleProList: res.data.list.rows,
          total: res.data.list.total,
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getTimeList()
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      newNews: app.globalData.news,
      total_amout: app.globalData.carNum,
      wxTimerList: {},
      is_iphonex: app.globalData.phoneType
    })
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
    var that = this
    util.queryRequest('?m=activity&a=goods_sales_list', {
      timeid: that.data.choseId,
      page: ++that.data.page,
      pagesize: that.data.pagesize
    }, 'POST', function (res) {
      if (res.isSuccess) {
        if (res.data.list.rows == null) {
          res.data.list.rows = []
        }
        that.data.saleProList = that.data.saleProList.concat(res.data.list.rows)
        that.setData({
          saleProList: that.data.saleProList,
          total: res.data.list.total
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})