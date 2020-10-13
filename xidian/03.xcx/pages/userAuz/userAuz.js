// pages/userAuz/userAuz.js
let util = require('../../utils/util.js')
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    oklogin:true,
  },
  wx_login: function (e) {
    var that = this
    if (that.data.oklogin){
      that.setData({
        oklogin: false,
      })
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
            wx.login({
              success: function (res) {
                console.log(res.code)
                wx.hideLoading()
                that.setData({
                  oklogin: true
                })
                wx.request({
                  url: app.globalData.apiUrl + 'app/auth/login', //仅为示例，并非真实的接口地址
                  data: {
                    wxCode: res.code,
                  },
                  method:'GET',
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success(res) {
                    if (res.data.code==200){
                      wx.hideLoading()
                      wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 1000,
                      })
                      getApp().globalData.showDia = true
                      clearTimeout(timeOut)
                      var timeOut=setTimeout(function () {
                        if (res.data.data.register==true){
                          if (wx.getStorageSync('share_invite') != undefined && wx.getStorageSync('share_invite') != '') {
                            util.queryRequest('app/member/memberInvite', {
                              share_invite_code: wx.getStorageSync('share_invite'),
                            }, 'GET').then(function (req) {
                              if (req.code == 200) {
                                console.log("登录的时候邀请码保存成功",wx.getStorageSync('share_invite'))
                                let info = wx.getStorageSync('userInfo')
                                info.share_invite_code = req.data.share_invite_code
                                wx.setStorageSync('userInfo', info)
                                wx.setStorageSync('share_invite', res.data.share_invite_code)
                                console.log("最新的用户信息",info)
                              }
                            })
                          }
                          wx.reLaunch({
                            url: '../bindPhone/bindPhone'
                          })
                        }else{
                          wx.setStorageSync("token", res.data.data.token)
                          util.queryRequest('app/member/get', {}, 'GET').then(function (res) {
                            if (res.code === 200 || res.code === '200') {
                              wx.setStorageSync('userInfo', res.data)
                              if(wx.getStorageSync('share_invite')!=''&&wx.getStorageSync('share_invite')!=undefined&&wx.getStorageSync('share_invite')!=null){
                                console.log('本地缓存的邀请码',wx.getStorageSync('share_invite'))
                              }else{
                                wx.setStorageSync('share_invite', res.data.share_invite_code)
                                console.log('用户信息里分享邀请码',res.data.share_invite_code)
                              }
                              console.log("用户登录获取用户信息",wx.getStorageSync('userInfo'))
                              if (wx.getStorageSync('share_invite') != undefined && wx.getStorageSync('share_invite') != '' && wx.getStorageSync('userInfo').invite_code == '') {
                                util.queryRequest('app/member/memberInvite', {
                                  share_invite_code: wx.getStorageSync('share_invite'),
                                }, 'GET').then(function (req) {
                                  if (req.code == 200) {
                                    console.log("登录的时候邀请码保存成功",wx.getStorageSync('share_invite'))
                                    let info = wx.getStorageSync('userInfo')
                                    info.share_invite_code = req.data.share_invite_code
                                    wx.setStorageSync('userInfo', info)
                                    wx.setStorageSync('share_invite', res.data.share_invite_code)
                                    console.log("最新的用户信息",info)

                                  }
                                })
                              }
                            }
                          })
                          console.log(app.globalData.authorUrl,'缓存的路径')
                          if(app.globalData.authorUrl.indexOf('userAuz')!=-1){
                            wx.switchTab({
                              url: '../index/index',
                            })
                          }else{
                            wx.reLaunch({
                              url: app.globalData.authorUrl
                            })
                          }
                        }
                        that.setData({
                          oklogin: true,
                        })
                      }, 1000)
                    } else if (res.data.code == 10400){
                      that.setData({
                        oklogin: true,
                      })
                      wx.hideLoading()
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1000,
                      })
                    }else{
                      that.setData({
                        oklogin: true,
                      })
                      wx.hideLoading()
                      wx.showToast({
                        title:'授权失败，请重试',
                        icon: 'none',
                        duration: 1000,
                      })
                    }
                  }
                })
              }
            })
          } else {
            that.setData({
              oklogin: true,
            })
          }
        }
      })
    }
  },
  goRead(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    wx.setNavigationBarTitle({
      title: '登录'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#0d8d37',
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height:res.windowHeight
        })
      },
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
  // onShareAppMessage: function() {

  // }
})