// pages/improveInfo/improveInfo.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // date: '仅自己可见',
    visited: 0,
    sex: 'male',
    birthday: null,
    endDate:''
  },
  bindDateChange: function(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  radioChange: function(e) {
    this.setData({
      sex: e.detail.value
    })
  },
  formSubmit: function() {
    var that = this
    var arr = [];
    if (this.data.birthday != null) {
      wx.showModal({
        title: '提示',
        content: '生日，性别一旦保存不能修改',
        success: function(res) {
          if (res.confirm) {
            arr = [{
              sex: that.data.sex,
              birthday: Date.parse(new Date(that.data.birthday)) / 1000
            }]
            util.queryRequest('?m=myinfo&a=usersave', {
              data: JSON.stringify(arr)
            }, 'POST', function(res) {
              if (res.isSuccess) {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function() {
                  console.log(getApp().globalData.backUrl)
                  if (that.data.visited == '0') {
                    if (app.globalData.winId != '') {
                      wx.redirectTo({
                        url: '../myGift/myGift'
                      })
                    } else {
                      if (getApp().globalData.backUrl.indexOf('memberCenter') != -1) {
                        wx.switchTab({
                          url: '../memberCenter/memberCenter'
                        })
                      } else if (getApp().globalData.backUrl.indexOf('index') != -1) {
                        console.log('index')
                        wx.switchTab({
                          url: '../index/index'
                        })
                      } else if (getApp().globalData.backUrl.indexOf('myVip') != -1) {
                        console.log('myVip')
                        wx.switchTab({
                          url: '../myVip/myVip'
                        })
                      } else {
                        console.log(getApp().globalData.backUrl)
                        wx.redirectTo({
                          url: '/' + getApp().globalData.backUrl
                        })
                      }
                    }
                  } else if (that.data.visited == '3') {
                    wx.switchTab({
                      url: '../memberCenter/memberCenter'
                    })
                  } else if (that.data.visited == '1') {
                    var pages = getCurrentPages()
                    if (pages.length == 1) {
                      wx.switchTab({
                        url: '../memberCenter/memberCenter'
                      })
                    } else {
                      //个人信息修改
                      wx.navigateBack({
                        delta: 1
                      })
                    }

                  } else {
                    wx.switchTab({
                      url: '../memberCenter/memberCenter'
                    })
                  }
                }.bind(that), 1000)
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 1000
                })
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
  },
  goNext: function() {
    wx.redirectTo({
      url: '../Interested/Interested?visit=0'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      endDate: util.formatDate(new Date().getTime() / 1000)
    })
    console.log(this.data.endDate)
    console.log(options)
    if (options.birthday == 'null' || options.birthday == undefined) {
      this.setData({
        sex: 'male',
        birthday: null
      })
    } else {
      this.setData({
        sex: options.sex,
        birthday: options.birthday
      })
    }
    this.setData({
      visited: options.visit
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