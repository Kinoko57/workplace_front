// pages/login/login.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,.8) 0%,rgba(255,80,83,.8) 100%)',
    windowHeight: '',
    lin_bg_color:'',
    isButton:true
  },
  goRead:util.throttle(function(e){
    wx.navigateTo({
      url: e[0].currentTarget.dataset.link
    })
  }),
  wx_login(){
    const that=this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.showLoading({
            title: '正在登录中...',
            mask: true
          })
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              wx.setStorageSync('userfirstInfo', res.userInfo)
            }
          })
          console.log(res)
          wx.login({
            success: function (res) {
              wx.hideLoading()
              console.log(res.code)
              wx.request({
                url: app.globalData.apiUrl + '/app/auth/xcxLogin', //仅为示例，并非真实的接口地址
                data: {
                  wxCode: res.code,
                  open_type:1
                },
                method: 'GET',
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success(res) {
                  if (res.data.code == 200) {
                    // register true代表没有绑定手机 false 绑定手机号
                    wx.showToast({
                      title: '登录成功',
                      icon: 'success',
                      duration: 1000,
                    })
                    if (res.data.data.register == true) {
                      wx.navigateTo({
                        url: '../bindPhone/bindPhone?type=regist'
                      })
                    } else{
                      wx.setStorageSync("token", res.data.data.access_token)
                      wx.setStorageSync("is_token", 1)
                      wx.setStorageSync("userfirstInfo", '')
                      wx.setStorageSync('im_account', res.data.data.anchor_user)
                      getApp().globalData.isLogin=true
                      util.queryRequest('/app/userInfo/get', {}, 'GET').then(function (res) {
                        if (res.code === 200 || res.code === '200') {
                          wx.setStorageSync("userInfo", res.data)
                          // util.loginIMRoom()
                          console.log(app.globalData.authorUrl,app.globalData.authorUrl.replace('/',''),"路径路径路径")
                          if(app.globalData.authorUrl.indexOf('login')!=-1||app.globalData.authorUrl.replace('/','')!=''){
                            wx.switchTab({
                              url: '/pages/index/index',
                            })
                          }else{
                            wx.reLaunch({
                              url: app.globalData.authorUrl
                            })
                            console.log(app.globalData.authorUrl,"app.globalData.authorUrl")
                          }
                        } else {
                          wx.showToast({
                            title: res.msg,
                            icon: 'none',
                            duration: 3000
                          })
                          if(app.globalData.authorUrl.indexOf('login')!=-1){
                            wx.switchTab({
                              url: '/pages/index/index',
                            })
                          }else{
                            wx.reLaunch({
                              url: app.globalData.authorUrl
                            })
                          }
                          console.log(res.msg)
                        }
                      })

                    }
                  }else {
                    wx.showModal({
                      title: '提示',
                      content: '授权失败，请重试',
                      success(res) {
                        if (res.confirm) {
                          console.log("用户点击确定")
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowHeight: app.globalData.useWindowHeight
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})