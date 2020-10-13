// pages/search/search.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    imgPath: app.globalData.fileUrl,
    hot_page: 1,
    hot_total: 0,
    hotNum: 0,
    hotSearch: [],
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
    util.queryRequest('app/index/hotList', {
      page: that.data.hot_page,
    }, 'GET').then(function(res) {
      if (res.code == 200) {
        that.setData({
          hotSearch: res.data.rows,
          hot_total: res.data.total,
          hotNum: Math.ceil(res.data.total / 8)
        })
      }
      console.log(res.data)
      console.log(that.data.hotNum)
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
      searchkey: e.detail.value.trim()
    })
  },
  clearSearch: function() {
    console.log('2')
    this.setData({
      searchkey: '',
    })
  },
  searchList: function() {
    var self = this;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    if (re.test(this.data.searchkey)){
      this.data.searchkey = ''
    }
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
      url: '../searchList/searchList?type=key&virtual_id=&value=' + this.data.searchkey
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
      frontColor: '#ffffff',
      backgroundColor: '#0d8d37',
    })


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
    this.searchHis()
    this.openLocationsercher();
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
    this.setData({
      searchkey: ''
    })
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