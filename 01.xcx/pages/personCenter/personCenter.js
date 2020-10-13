// pages/personCenter/personCenter.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "../../static/img/com/pc_avatar.png",
    hiddenavatar: true,
    personInfo: [],
    apiUrl: app.globalData.apiUrl,

  },
  editavatat: function() {
    this.setData({
      hiddenavatar: !this.data.hiddenavatar
    })
  },
  edit: function(e) {
    if (e.currentTarget.id == 'birthday') {
      if (this.data.personInfo.birthday == null || this.data.personInfo.birthday == '') {
        wx.navigateTo({
          url: e.currentTarget.dataset.url + "&sex=" + this.data.personInfo.sex + '&birthday=' + this.data.personInfo.birthday
        })
      }
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }

  },
  choseAlbum: function() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0])
        wx.uploadFile({
          url: that.data.apiUrl + '?m=myinfo&a=head_portrait', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": wx.getStorageSync("cookie")
          },
          name: 'pic',
          formData: {},
          success: function(res) {
            if (JSON.parse(res.data).isSuccess) {
              that.getInfo()
            }
          }
        })
      }
    })
  },
  choseCra: function() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: that.data.apiUrl + '?m=myinfo&a=head_portrait', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": wx.getStorageSync("cookie")
          },
          name: 'pic',
          formData: {},
          success: function(res) {
            if (JSON.parse(res.data).isSuccess) {
              that.getInfo()
            }
          }
        })
      }
    })
  },
  hiddenModel: function() {
    this.setData({
      hiddenavatar: true
    })
  },
  getInfo: function() {
    var that = this
    // 查看个人信息列表
    util.queryRequest('?m=myinfo&a=userinfo', '', 'POST', function(res) {
      wx.hideLoading()
      if (res.isSuccess) {
        if (res.data.birthday != null) {
          res.data.birthday = util.formatDate(res.data.birthday)
        }
        that.setData({
          personInfo: res.data,
          hiddenavatar: true
        })
        // app.globalData.userInfo.username = app.globalData.userInfo.username
        if (that.data.personInfo.image.indexOf('http') == -1) {
          app.globalData.userInfo.avatar = that.data.apiUrl + that.data.personInfo.image
        } else {
          app.globalData.userInfo.avatar = that.data.personInfo.image
        }
        app.globalData.userInfo.level = that.data.personInfo.rankName
        app.globalData.userInfo.isShow = 1
        app.globalData.userInfo.nickname = that.data.personInfo.nickname
        if (that.data.personInfo.mobile != '' && that.data.personInfo.mobile != null) {
          wx.setStorageSync("isbind", true);
        }
        wx.setStorageSync("userInfo", app.globalData.userInfo);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中'
    })
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff8d97',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showLoading({
      title: '加载中'
    })
    this.getInfo()
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