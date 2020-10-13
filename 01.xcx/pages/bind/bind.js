// pages/bind/bind.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visited: 0,
    mobile: '',
    code: '',
    text: '获取验证码',
    currentTime: 61,
    isDisabled: false,
    color: '#ff8d97',
    canclick: false,
    is_success: false
  },
  skipBind: function() {
    var that = this
    if (that.data.visited == '3') {
      // 已注册未绑定手机
      wx.switchTab({
        url: '../index/index'
      })
    } else if (that.data.visited == '0') {
      // 扫码领赠品
      if (getApp().globalData.winId != '') {
        wx.redirectTo({
          url: '../myGift/myGift'
        })
      } else {
        wx.switchTab({
          url: '/' + getApp().globalData.backUrl
        })
        wx.redirectTo({
          url: '/' + getApp().globalData.backUrl
        })
      }
    } else if (that.data.visited == '4') {
      // 在商品购买页已注册未绑定手机
      wx.redirectTo({
        url: '/' + getApp().globalData.backUrl
      })
      wx.switchTab({
        url: '/' + getApp().globalData.backUrl
      })
    } else if (that.data.visited == '1') {
      // 个人信息修改手机号码
      setTimeout(function() {
        wx.navigateBack({
          delta: 1
        })
      }, 500)
    } else if (that.data.visited == '5') {
      // 个人中心点登陆,或者签到
      wx.switchTab({
        url: '/pages/memberCenter/memberCenter'
      })
    } else if (that.data.visited == '6') {
      // 抽奖页未绑定手机
      wx.redirectTo({
        url: '../lottery/lottery'
      })
    } 
    else if (that.data.visited == '7') {
      // 扫码抽奖页未绑定手机
      wx.redirectTo({
        url: '/' + getApp().globalData.backUrl
      })
    } else {
      // 返回上一页
      wx.navigateBack({
        delta: 1
      })
    }
  },
  getMobile: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  getCode: function(e) {
    this.setData({
      canclick: false,
      code: e.detail.value
    })
  },
  sendCode: function() {
    var that = this
    that.setData({
      isDisabled: true, //只要点击了按钮就让按钮禁用 （避免正常情况下多次触发定时器事件）
      color: '#ccc',
    })
    var phone = that.data.mobile;
    var currentTime = that.data.currentTime
    var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空

    if (phone == '') {
      warn = "号码不能为空";
    } else if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
      warn = "手机号格式不正确";
    } else {
      wx.showLoading({
        title: '发送中',
      })
      //当手机号正确的时候提示用户短信验证码已经发送,并后台请求短信
      util.queryRequest('?m=member&a=send_veriftcode', {
        phone: that.data.mobile
      }, 'POST', function(res) {
        wx.hideLoading()
        //设置一分钟的倒计时
        var interval = setInterval(function() {
          currentTime--; //每执行一次让倒计时秒数减一
          that.setData({
            color: '#ccc',
            text: currentTime + 's', //按钮文字变成倒计时对应秒数
          })
          if (currentTime <= 0) {
            clearInterval(interval)
            that.setData({
              text: '重新发送',
              currentTime: 61,
              isDisabled: false,
              color: '#ff8d97'
            })
          }
        }, 1000);
        if (res.isSuccess == true) {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        } else {
          clearInterval(interval)
          that.setData({
            isDisabled: false,
            color: '#ff8d97'
          })
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })

    }
    //判断 当提示错误信息文字不为空 即手机号输入有问题时提示用户错误信息 并且提示完之后一定要让按钮为可用状态 因为点击按钮时设置了只要点击了按钮就让按钮禁用的情况
    if (warn != null) {
      wx.showModal({
        title: '提示',
        content: warn
      })

      that.setData({
        isDisabled: false,
        color: '#ff8d97'
      })
      return;
    }
  },
  formSubmit: function() {
    if (this.data.mobile == '') {
      if (this.data.mobile.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 1000
        })
      }
      // wx.showToast({
      //   title: '手机号不能为空',
      //   icon: 'none',
      //   duration: 1000
      // })
    } else if (this.data.code == '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.showLoading({
        title: '提交中'
      })
      if (!this.data.is_success) {
        var that = this
        //保存手机号 接口
        util.queryRequest('?m=member&a=bind_phonenum', {
          // data: SON.stringify(data),
          phone: that.data.mobile,
          code: that.data.code
        }, 'POST', function(res) {
          if (res.isSuccess) {
            that.setData({
              is_success: true
            })
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 500
            })
            wx.setStorageSync("isbind", true);
            console.log(getApp().globalData.backUrl)
            if (that.data.visited == '3') {
              // 签到已注册未绑定手机
              wx.redirectTo({
                url: '../mySignIn/mySignIn'
              })
            } else if (that.data.visited == '0') {
              // 扫码中奖前往领取
              if (getApp().globalData.winId != '') {
                wx.redirectTo({
                  url: '../myGift/myGift'
                })
              } else {
                wx.switchTab({
                  url: '/' + getApp().globalData.backUrl
                })
                wx.redirectTo({
                  url: '/' + getApp().globalData.backUrl
                })
              }
            } else if (that.data.visited == '4') {
              // 在商品购买页，试用页面，我的赠品，我的奖品，我的试用已注册未绑定手机
              wx.redirectTo({
                url: '/' + getApp().globalData.backUrl
              })
              wx.switchTab({
                url: '/' + getApp().globalData.backUrl
              })
            } else if (that.data.visited == '1') {
              // 个人信息修改手机号码
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1
                })
              }, 500)
            } else if (that.data.visited == '5') {
              // 个人中心点登陆,或者签到
              wx.switchTab({
                url: '/pages/memberCenter/memberCenter'
              })
            } else if (that.data.visited == '6') {
              // 抽奖页未绑定手机
              wx.redirectTo({
                url: '../lottery/lottery'
              })
            } else if (that.data.visited == '7') {
              // 扫码抽奖页未绑定手机
              wx.redirectTo({
                url: '/' + getApp().globalData.backUrl
              })
            } else {
              // 返回上一页
              wx.navigateBack({
                delta: 1
              })
            }
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.dialog = this.selectComponent("#reload");
    this.setData({
      visited: options.visit
    })
    wx.setNavigationBarTitle({
      title: '绑定手机'
    })
    if (this.data.visited == 1) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ff8d97',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '绑定手机'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  // showDialog() {
  //   this.dialog.showReload()
  // },
  // _relaod() {
  //   util.loadPage(this)
  //   console.log('触发relaod')
  // },

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