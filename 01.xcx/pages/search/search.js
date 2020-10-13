// pages/search/search.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hot_page: 1,
    hot_limit: 10,
    hot_total: 0,
    hotNum: 0,
    hotSearch: [],
    istrue: false,
    searchkey: '',
    keylist: [],

  },
  goLink: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  searchHis: function() {
    var that = this;
    // 获取热门搜索列表
    util.queryRequest('?m=index&a=gethotword', {
      page: that.data.hot_page,
      pagesize: that.data.hot_limit
    }, 'POST', function(res) {
      if (res.isSuccess == true) {
        that.setData({
          hotSearch: res.data.rows,
          hot_total: res.data.total,
          istrue: true,
          hotNum: Math.ceil(res.data.total / that.data.hot_limit)
        })
      }
    })
  },
  changeList: function() {
    if (this.data.hot_page == this.data.hotNum) {
      this.data.hot_page = 0
    }
    this.setData({
      hot_page: ++this.data.hot_page
    })
    this.searchHis()
  },
  searchHidden: function() {
    this.setData({
      s_history: false
    })
  },
  searchInput: function(e) {
    this.setData({
      searchkey: e.detail.value
    })
  },
  clearSearch: function() {
    this.setData({
      searchkey: '',
      istrue: true,
    })
  },
  searchList: function() {
    var self = this;
    if (this.data.searchkey != '') {
      //将搜索记录更新到缓存
      var searchData = self.data.keylist;
      if (searchData.length > 8) {
        searchData.pop()
      }
      var arr = [{
        id: searchData.length,
        name: self.data.searchkey
      }]
      searchData = arr.concat(searchData)
      wx.setStorageSync('searchData', searchData);
    }
    wx.navigateTo({
      url: '../proList/proList?type=key&value=' + this.data.searchkey
    })
  },
  //清除缓存历史
  clearSearchStorage: function() {
    wx.removeStorageSync('searchData')
    this.setData({
      keylist: []
    })
  },
  //打开历史记录列表
  openLocationsercher: function() {
    this.setData({
      keylist: wx.getStorageSync('searchData') || []
    })
    console.log(this.data.keylist)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '搜索'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f2f2f2',
    })
    this.searchHis()
    this.openLocationsercher();

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
    this.setData({
      searchkey: ''
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})