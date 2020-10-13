// pages/improveInfo/improveInfo.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    imgPath: app.globalData.fileUrl,
    visited: 0,
    sex: '1',
    birthday: null,
    endDate:''
  },
  bindDateChange: function(e) {
    console.log(e)
    this.setData({
      birthday: e.detail.value
    })
  },
  radioChange: function(e) {
    this.setData({
      sex: e.detail.value
    })
  },
  formSubmit: util.throttle(function () {
    var that = this
    var arr ={};
    if (this.data.birthday != null) {
      wx.showModal({
        title: '提示',
        content: '生日，性别一旦保存不能修改',
        success: function(res) {
          if (res.confirm) {
            arr = {
              sex: that.data.sex,
              birth: Date.parse(new Date(that.data.birthday)) / 1000
            }
            util.queryRequest('app/member/edit', arr, 'POST').then(function (res) {
              if (res.code === 200 || res.code === '200') {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 1000
                })
                wx.setStorageSync('isChange', true)
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 3000
                })
                console.log(res.msg)
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showToast({
        title: '请选择生日',
        icon: 'none',
        duration: 1000
      })
    }
  }),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.birth == 'null' || options.birth == undefined || options.birth ==0) {
      this.setData({
        sex: options.sex,
        birthday: null
      })
    } else {
      let date=util.formatDate(options.birth)
      this.setData({
        sex: options.sex,
        birthday: date
      })
    }
    wx.setNavigationBarTitle({
      title: '个人信息',
    })
    this.setData({
      visited: options.visit,
      endDate: util.formatDate(parseInt(new Date().getTime()/1000))
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