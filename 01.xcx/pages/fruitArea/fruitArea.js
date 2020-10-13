// pages/fruitArea/fruitArea.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadMore: true,
    imgUrls: [],
    fruitProList: [],
    total: 0,
    isShow:false,
    page:1,
    pagesize:4,
  },
  goPro:function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  imgLink: function (e) {
    var that = this
    util.queryRequest('?m=activity&a=banner_click', {
      id: e.currentTarget.dataset.imgid
    }, 'GET', function (res) {
      if (res.isSuccess) {
        console.log(res)
      }
    })
    var pageLink = ''
    console.log(e.currentTarget.dataset.type)
    switch (e.currentTarget.dataset.type) {
      //1 商品，3是试用，4是团购，5 文章，6 大转盘
      case '1':
        pageLink = '../proDetail/proDetail?type=normal&id=' + e.currentTarget.id;
        break;
      case '3':
        pageLink = '../tryOutdetail/tryOutdetail?id=' + e.currentTarget.dataset.activityid;
        break;
      case '4':
        pageLink = '../proDetail/proDetail?type=group&id=' + e.currentTarget.dataset.activityid + '&goods_id=' + e.currentTarget.id;
        break;
      case '5':
        pageLink = '../hotArticle/hotArticle?id=' + e.currentTarget.id + '&name=文章详情';
        break;
      case '6':
        pageLink = '../lottery/lottery';
        break;
      case '7':
        pageLink = '../fruitDetail/fruitDetail?type=fruits&id=' + e.currentTarget.id;
        break;
    }
    if (e.currentTarget.dataset.type == '6') {
      wx.redirectTo({
        url: pageLink
      })
    } else {
      wx.navigateTo({
        url: pageLink
      })
    }

  },
  //获取首页轮播
  getBanner: function() {
    var that = this
    util.queryRequest('?m=activity&a=banner', {
      type: 1
    }, 'GET', function(res) {
      wx.hideLoading()
      if (res.isSuccess) {
        that.setData({
          imgUrls: res.data.rows,
          isShow: true
        })
      } else {
        that.setData({
          isShow: true
        })
      }
    })
  },
  getList: function() {
    var that = this
    util.queryRequest('/?m=list&a=fruits_list', {
      page: that.data.page,
      pagesize: that.data.pagesize
    }, 'GET', function(res) {
      that.setData({
        isShow: true
      })
      wx.hideLoading()
      if (res.isSuccess) {
        that.setData({
          fruitProList: res.data.rows,
          total: res.data.total,
        })
        wx.setNavigationBarTitle({
          title: res.data.title
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBanner()
    this.getList()
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: '#ff8d97',
    // })
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
    if (this.data.loadMore){
      let that = this
      util.queryRequest('/?m=list&a=fruits_list', {
        page: ++that.data.page,
        pagesize: that.data.pagesize
      }, 'GET', function (res) {
        if (res.isSuccess) {
          if (res.data.rows.length == 0) {
            that.setData({
              loadMore: false
            })
          }
          that.data.fruitProList = that.data.fruitProList.concat(res.data.rows)
          that.setData({
            fruitProList: that.data.fruitProList,
            total: res.data.total,
          })
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})