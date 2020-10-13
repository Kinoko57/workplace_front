// pages/userAuz/userAuz.js
let util = require('../../utils/util.js')

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatar: '',
      nickname: '',
      username: '',
      isShow: 0
    },
    refuse: false
  },
  wx_login: function(e) {
    var that = this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            hiddenlogin: true
          })
          wx.login({
            success: function(res) {
              // 登录
              let req = e.detail
              console.log(e.detail)
              // wx.getUserInfo({
              //   success: function(req) {
              //     if (res.code) {
              //       //发起网络请求
                    util.queryRequest('?m=login&a=dologin', {
                      code: res.code,
                      signature: req.signature,
                      encryptedData: req.encryptedData,
                      iv: req.iv,
                      source: 'wxxcx',
                      prize: app.globalData.winId
                    }, 'POST', function(res) {
                      console.log(res)
                      if (res.isSuccess == true) {
                        var data = 'member[uid]=' + res.uid +
                          ';member[username]=' + res.username +
                          ';member[rank]=' + res.rank +
                          ';member[token]=' + res.token +
                          ';member[source]=' + res.source +
                          ';sessionid=' + res.sessionid
                        wx.setStorageSync("cookie", data);
                        app.globalData.userInfo.nickname = res.nickname
                        app.globalData.userInfo.username = res.username
                        app.globalData.userInfo.level = res.rankname
                        app.globalData.userInfo.isbind = res.bindPhone
                        app.globalData.userInfo.avatar = res.image
                        app.globalData.userInfo.isShow = 1
                        wx.setStorageSync("userInfo", app.globalData.userInfo);
                        wx.setStorageSync("score", res.point);
                        wx.setStorageSync("isbind", res.bindPhone);
                        that.setData({
                          userInfo: app.globalData.userInfo
                        })
                        if (!res.bindPhone) {
                          wx.reLaunch({
                            url: '../bind/bind?visit=0'
                          })
                        } else {
                          if (getApp().globalData.backUrl.indexOf('scanCode') != -1) {
                            wx.navigateTo({
                              url: '../myGift/myGift'
                            })
                          } else if (getApp().globalData.backUrl.indexOf('memberCenter') != -1) {
                            wx.switchTab({
                              url: '../memberCenter/memberCenter'
                            })
                          } else {
                            wx.redirectTo({
                              url: '/' + getApp().globalData.backUrl
                            })
                            wx.switchTab({
                              url: '/' + getApp().globalData.backUrl
                            })
                            // wx.navigateBack({
                            //   delta: 1
                            // })
                          }
                        }
                      }
                    })
              //     } else {
              //       console.log('登录失败！' + res.errMsg)
              //     }
              //   },
              //   fail: res => {
              //     console.log('getUserInfo接口')
              //     console.log(res)
              //     wx.showToast({
              //       title: '微信接口异常',
              //       icon: 'none',
              //       duration: 1000
              //     })
              //   }
              // })
            },
            fail: res => {
              console.log('login接口')
              console.log(res)
              wx.showToast({
                title: '微信接口异常',
                icon: 'none',
                duration: 1000
              })
            }
          })
        } else {
          that.setData({
            refuse: true
          })
        }
      }
    })
  },
  // wx_login:function(){
  //   wx.login({
  //     success: function (res) {
  //       console.log(res.code)
  //       // 登录
  //       wx.getUserInfo({
  //         success: function (req) {
  //           console.log(req)
  //           if (res.code) {
  //             console.log(app.globalData.winId)
  //             //发起网络请求
  //             util.queryRequest('?m=login&a=dologin', {
  //               code: res.code,
  //               signature: req.signature,
  //               encryptedData: req.encryptedData,
  //               iv: req.iv,
  //               source: 'wxxcx',
  //               prize: app.globalData.winId
  //             }, 'POST', function (res) {
  //               console.log(res)
  //               if (res.isSuccess == true) {
  //                 var data = 'member[uid]=' + res.uid +
  //                   ';member[username]=' + res.username +
  //                   ';member[rank]=' + res.rank +
  //                   ';member[token]=' + res.token +
  //                   ';member[source]=' + res.source +
  //                   ';sessionid=' + res.sessionid
  //                 wx.setStorageSync("cookie", data);
  //                 app.globalData.userInfo.nickname = res.nickname
  //                 app.globalData.userInfo.username = res.username
  //                 app.globalData.userInfo.level = res.rankname
  //                 app.globalData.userInfo.isbind = res.bindPhone
  //                 app.globalData.userInfo.avatar = res.image
  //                 app.globalData.userInfo.isShow = 1
  //                 wx.setStorageSync("userInfo", app.globalData.userInfo);
  //                 wx.setStorageSync("score", res.point);
  //                 wx.setStorageSync("isbind", res.bindPhone);
  //                 that.setData({
  //                   userInfo: app.globalData.userInfo
  //                 })
  //                 if (!res.bindPhone) {
  //                   wx.reLaunch({
  //                     url: '../bind/bind?visit=0'
  //                   })
  //                 } else {
  //                   wx.navigateBack({
  //                     delta: 1
  //                   })
  //                 }
  //               }
  //             })
  //           } else {
  //             console.log('登录失败！' + res.errMsg)
  //           }
  //         }
  //       })
  //     }
  //   })
  // },
  refuse_login: function(res) {
    if (res.authSetting['scope.userInfo']) {
      wx.getUserInfo({
        success: function(req) {
          // 登录
          wx.login({
            success: function(res) {
              if (res.code) {
                //发起网络请求
                util.queryRequest('?m=login&a=dologin', {
                  code: res.code,
                  signature: req.signature,
                  encryptedData: req.encryptedData,
                  iv: req.iv,
                  source: 'wxxcx'
                }, 'POST', function(res) {
                  if (res.isSuccess == true) {
                    var data = 'member[uid]=' + res.uid +
                      ';member[username]=' + res.username +
                      ';member[rank]=' + res.rank +
                      ';member[token]=' + res.token +
                      ';member[source]=' + res.source +
                      ';sessionid=' + res.sessionid
                    wx.setStorageSync("cookie", data);
                    app.globalData.userInfo.nickname = res.nickname
                    app.globalData.userInfo.level = res.rankname
                    app.globalData.userInfo.isbind = res.bindPhone
                    app.globalData.userInfo.avatar = res.image
                    app.globalData.userInfo.isShow = 1
                    wx.setStorageSync("userInfo", app.globalData.userInfo);
                    wx.setStorageSync("score", res.point);
                    wx.setStorageSync("isbind", res.bindPhone);
                    that.setData({
                      userInfo: app.globalData.userInfo
                    })
                    if (!res.bindPhone) {
                      wx.reLaunch({
                        url: '../bind/bind?visit=0'
                      })
                    } else {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '微信授权页'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f2f2f2',
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