// pages/scanCode/scanCode.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allowbind: true,
    // scantype: 'reset',
    isShow: false, //是否展示数据
    showPro: {},
    winId: '',
    winType: '',
    winName: '',
    winValue: '',
    winhidden: false,
    hiddenlogin: app.globalData.hiddenlogin,
    apiUrl: app.globalData.apiUrl,
    is_iphonex: app.globalData.phoneType
  },
  login: function() {
    this.setData({
      hiddenlogin: false
    })
  },
  exitLogin: function() {
    this.setData({
      hiddenlogin: true
    })
  },
  scan: function() {
    wx.scanCode({
      success: (res) => {
        wx.navigateTo({
          url: '../scanCode/scanCode?type=' + res.result
        })
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  goScore: function() {
    if (util.isLogin()) {
      wx.redirectTo({
        url: '../myGift/myGift'
      })
    }
  },
  goLink: function() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  goCou: function() {
    if (util.isLogin()) {
      wx.redirectTo({
        url: '../myGift/myGift'
      })
    }
  },
  hiddenWin: function() {
    this.setData({
      winhidden: false
    })
    console.log(this.data.winhidden)
  },
  openWin: function() {
    this.setData({
      winhidden: true
    })
    console.log(this.data.winhidden)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var obj = options.q ? decodeURIComponent(options.q) : options.type
    var index = obj.lastIndexOf("code/");
    var obj_short = obj.substring(index + 5, obj.length)
    var last = obj.split("/b2c")[1]
    var last_obj = this.data.apiUrl + 'b2c' + last
    wx.login({
      success: function (event) {
        if (event.code) {
          last_obj = last_obj + '?wx_code=' + event.code
        } else {
          console.log('登录失败！' + res.errMsg)
        }
        util.queryRequest('?m=scanlottery&a=info', {
          code: decodeURI(obj_short)
        }, 'POST', function (res) {
          console.log(res)
          wx.hideLoading()
          if (res.isSuccess) {
            console.log(res)
            that.setData({
              isShow: true,
              showPro: res.data
            })
            wx.request({
              url: last_obj , //仅为示例，并非真实的接口地址
              method: 'GET',
              header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": wx.getStorageSync("cookie")
              },
              success: function (req) {
                console.log(req.data)
                if (req.data.isSuccess) {
                  that.setData({
                    winId: req.data.data,
                    winName: req.data.name,
                    winType: req.data.type,
                    winValue: req.data.worth,
                    winhidden: true
                  })
                  app.globalData.winId = that.data.winId
                } else {
                  that.setData({
                    winType: -1,
                    winhidden: false
                  })
                }
              },
              fail: function (res) {
                console.log(res)
              }
            })
          } else {
            // 错误的二维码
            wx.redirectTo({
              url: '../errPage/errPage?text=' + res.msg
            })
          }
        })
      }
    })

    wx.setNavigationBarTitle({
      title: '公主购'
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
    var circleCount = 0;
    // 心跳的外框动画
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 500, // 以毫秒为单位
      /**
       * http://cubic-bezier.com/#0,0,.58,1  
       *  linear  动画一直较为均匀
       *  ease    从匀速到加速在到匀速
       *  ease-in 缓慢到匀速
       *  ease-in-out 从缓慢到匀速再到缓慢
       * 
       *  http://www.tuicool.com/articles/neqMVr
       *  step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
       *  step-end   保持 0% 的样式直到动画持续时间结束        一闪而过
       */
      timingFunction: 'linear',
      transformOrigin: '50% 50%',
      success: function(res) {}
    });
    setInterval(function() {
      if (circleCount % 2 == 0) {
        this.animationMiddleHeaderItem.scale(1.15).step();
      } else {
        this.animationMiddleHeaderItem.scale(1.0).step();
      }
      this.setData({
        animationMiddleHeaderItem: this.animationMiddleHeaderItem.export()
      });

      circleCount++;
      if (circleCount == 1000) {
        circleCount = 0;
      }
    }.bind(this), 500);

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.setData({
    //   winType: -1,
    //   winhidden: false
    // })
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