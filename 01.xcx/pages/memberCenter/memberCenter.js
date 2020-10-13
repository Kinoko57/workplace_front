// pages/memberCenter/memberCenter.js
let util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navNtn: 5,
    header_bg: '../../static/img/member/m_header_bg.png',
    msg: '../../static/img/member/msg.png',
    sets: '../../static/img/member/set.png',
    avatarUrl: "../../static/img/member/avatar.png",
    score: 0,
    newNews: false,
    news_num: 0,
    refuse: false,
    vipTitle: '',
    orderNav: [{
        typeId: '1',
        imgUrl: '../../static/img/member/pay.png',
        link: '../myOrder/myOrder?tid=1&id=type1',
        name: '待付款',
        num: 0
      },
      {
        typeId: '5',
        imgUrl: '../../static/img/member/ship.png',
        link: '../myOrder/myOrder?tid=5&id=type5',
        name: '待发货',
        num: 0
      },
      {
        typeId: '2',
        imgUrl: '../../static/img/member/receipt.png',
        link: '../myOrder/myOrder?tid=2&id=type2',
        name: '待收货',
        num: 0
      },
      {
        typeId: '6',
        imgUrl: '../../static/img/member/eval.png',
        link: '../myOrder/myOrder?tid=6&id=type6',
        name: '待评价',
        num: 0
      },
      {
        typeId: '4',
        imgUrl: '../../static/img/member/after_sale.png',
        link: '../myOrder/myOrder?tid=7&id=type7',
        name: '退换/售后',
        num: 0
      }
    ],
    vipShow: false,
    userInfo: {
      avatar: '',
      nickname: '',
      username: '',
      isShow: 0
    },
    apiUrl: app.globalData.apiUrl,
    hiddenlogin: app.globalData.hiddenlogin,
    orderList: [{
      imgurl: '',
      orderStates: '',
      id: ''
    }],
    is_birthday: false,
    birthday_img:''
  },
  linkGo: function(e) {
    if (util.isLogin()) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }
  },
  goSign: function(e) {
    if (util.isLogin()) {
      if (!wx.getStorageSync("isbind")) {
        wx.reLaunch({
          url: '../bind/bind?visit=5'
        })
      } else {
        wx.navigateTo({
          url: e.currentTarget.dataset.url
        })
      }
    }
  },
  exitLogin: function() {
    this.setData({
      hiddenlogin: true
    })
  },
  wx_login: function(e) {
    console.log(1)
    var that = this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            hiddenlogin: true
          })
          wx.login({
            success: function(res) {
              let req  = e.detail
              console.log(e)
              console.log(e.detail.errMsg)
              console.log(e.detail.userInfo)
              console.log(e.detail.rawData)
              // 登录
              // wx.getUserInfo({
              //   success: function(req) {
              //     console.log(req)
              //     if (res.code) {
              //       //发起网络请求
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
                        app.globalData.userInfo.username = res.username
                        app.globalData.userInfo.level = res.rankname
                        app.globalData.userInfo.isbind = res.bindPhone
                        app.globalData.userInfo.avatar = res.image
                        app.globalData.userInfo.isShow = 1
                        wx.setStorageSync("userInfo", app.globalData.userInfo);
                        wx.setStorageSync("score", res.point);
                        wx.setStorageSync("isbind", res.bindPhone);
                        that.scoreShow()
                        that.setData({
                          userInfo: app.globalData.userInfo
                        })
                        if (!res.bindPhone) {
                          wx.reLaunch({
                            url: '../bind/bind?visit=5'
                          })
                        }
                      }else{
                        wx.showToast({
                          title:  res.msg,
                          icon: 'none',
                          duration: 1000
                        })
                      }
                    })
              //     } else {
              //       console.log('登录失败！' + res.errMsg)
              //       wx.showToast({
              //         title: '微信接口异常' + res.errMsg,
              //         icon: 'none',
              //         duration: 1000
              //       })
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
      },
      fail:res=>{
        console.log(res)
      }
    })
  },
  refuse_login: function(res) {
    if (res.detail.authSetting['scope.userInfo']) {
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
                    // app.globalData.userInfo.username = res.username
                    app.globalData.userInfo.avatar = res.image
                    app.globalData.userInfo.isShow = 1
                    app.globalData.userInfo.isbind = res.bindPhone
                    wx.setStorageSync("userInfo", app.globalData.userInfo);
                    wx.setStorageSync("score", res.point);
                    wx.setStorageSync("isbind", res.bindPhone);
                    that.setData({
                      userInfo: app.globalData.userInfo
                    })
                    that.scoreShow()
                    if (!res.bindPhone) {
                      wx.reLaunch({
                        url: '../bind/bind?visit=5'
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
  showLevel: function() {
    var that = this
    this.setData({
      vipShow: true
    })
    util.queryRequest('?m=index&a=member_rule', {}, 'GET', function(res) {
      if (res.isSuccess) {
        var proDetail = res.member_rule;
        WxParse.wxParse('proDetail', 'html', proDetail, that, 10);
        that.setData({
          vipTitle: res.member_rule
        })
      }
    })
  },
  hiddenVip: function() {
    this.setData({
      vipShow: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中'
    })
    // wx.showTabBar();
    if (wx.setNavigationBarColor){
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ff8d97',
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  scoreShow() {
    if (wx.getStorageSync("score") > 0) {
      this.setData({
        score: wx.getStorageSync("score")
      })
    } else {
      this.setData({
        score: 0
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    util.queryRequest('?m=myinfo&a=userinfo', '', 'POST', function(res) {
      wx.hideLoading()
      if (res.isSuccess) {
        app.globalData.userInfo.avatar = res.data.image
        app.globalData.userInfo.level = res.data.rankName
        app.globalData.userInfo.isShow = 1
        app.globalData.userInfo.nickname = res.data.nickname
        wx.setStorageSync("userInfo", app.globalData.userInfo);
        wx.setStorageSync("score", res.data.point)
        if (res.data.mobile != '' && res.data.mobile != null) {
          wx.setStorageSync("isbind", true);
        } else {
          wx.setStorageSync("isbind", false);
        }
        if (wx.getStorageSync("cookie")) {
          that.setData({
            userInfo: wx.getStorageSync("userInfo")
          })
          that.scoreShow()
        }
      }
    })
    for (var j = 0; j < that.data.orderNav.length; j++) {
      that.data.orderNav[j].num = 0
    }
    // 查询订单数量
    util.queryRequest('?m=order&a=get_orderstatus_num', {}, 'GET', function(res) {
      if (res.isSuccess) {
        for (var i = 0; i < res.data.length; i++) {
          for (var j = 0; j < that.data.orderNav.length; j++) {
            if (res.data[i].type == that.data.orderNav[j].typeId) {
              that.data.orderNav[j].num = res.data[i].num
            }
          }
        }
        that.setData({
          orderNav: that.data.orderNav
        })
      } else {
        for (var j = 0; j < that.data.orderNav.length; j++) {
          that.data.orderNav[j].num = 0
        }
        that.setData({
          orderNav: that.data.orderNav
        })
      }
    })
    //查询购物车数量
    util.queryRequest('?m=cart&a=cart', {}, 'GET', function(res) {
      if (res.isSuccess) {
        that.setData({
          total_amout: res.data.rows_total
        })
        app.globalData.carNum = res.data.rows_total
        if (wx.setTabBarBadge){
          wx.setTabBarBadge({
            index: 3,
            text: res.data.rows_total
          })
        }
        if (res.data.rows_total == 0) {
          if (wx.removeTabBarBadge) {
            wx.removeTabBarBadge({
              index: 3
            })
          }

        }
      }
    })
    // 查询是否有新消息
    util.queryRequest('?m=myinfo&a=check_unread', {}, 'POST', function(res) {
      if (res.isSuccess) {
        // 判断是否签到
        if (res.data.is_sign == 1) {
          that.data.isSign = true
        } else {
          that.data.isSign = false
        }
        // 判断是否生日
        if (res.data.is_birthday==1){
          that.data.is_birthday = true
          that.data.birthday_img = res.data.birthday_img
        }else{
          that.data.birthday_img=''
        }
        // 判断是否有新消息
        if (res.data.num > 0) {
          that.data.newNews = true
          that.data.news_num = res.data.num
          app.globalData.news = true
          if (wx.showTabBarRedDot) {
            wx.showTabBarRedDot({
              index: 4
            })
          }
        } else {
          that.data.newNews = false
          that.data.news_num = 0
          app.globalData.news = false
          if (wx.hideTabBarRedDot){
            wx.hideTabBarRedDot({
              index: 4
            })
          }
        }
        that.setData({
          newNews: that.data.newNews,
          news_num: that.data.news_num,
          isSign: that.data.isSign,
          is_birthday: that.data.is_birthday,
          birthday_img: that.data.birthday_img
        })
      }
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
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})