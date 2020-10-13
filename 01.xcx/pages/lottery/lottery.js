// pages/lottery/lottery.js
let util = require('../../utils/util.js')
var app = getApp()
const viewWidth = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_bg_top: '',
    list_bg_middle: '',
    list_bg_bottom: '',
    allowbind: true,
    height: 0,
    top: 0,
    isShow: false,
    isScroll: true,
    awardsList: {},
    apiUrl: app.globalData.apiUrl,
    animationData: {},
    btnDisabled: '',
    total_people: 0,
    img: '',
    modelShow: true,
    myWinList: [],
    times: 0,
    winList: [],
    prizeList: [],
    page: 1,
    limit: 15,
    proType: 'exchange',
    winId: '',
    lotteryId:'',
    msg: '',
    top: 0,
  },
  scroll: function(e) {
    this.setData({
      top: e.detail.scrollTop
    })
  },
  goIndex: function(e) {
    if (this.data.btnDisabled == '') {
      wx.switchTab({
        url: e.currentTarget.dataset.link
      })
    }
  },
  viewWinlist: function() {
    var that = this
    var query = wx.createSelectorQuery()
    query.select('.win_list').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      wx.pageScrollTo({
        scrollTop: that.data.top + res[0].top,
        duration: 300
      })
    })

  },
  goLink: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f2f2f2',
    })

  },
  gowinList: function() {
    if (this.data.btnDisabled == '') {
      this.setData({
        isScroll: false
      })
      //获取当前滚动距离
      var that = this
      util.queryRequest('?m=lottery&a=info', {
        page: that.data.page,
        type: 0,
        limit: 20,
        genre: 1 //0：全部中奖列表  1：大转盘    2超级转盘 
      }, 'GET', function(res) {
        if (res.isSuccess) {
          for (var i = 0; i < res.data.rows.length; i++) {
            res.data.rows[i].createtime = util.formatTime(res.data.rows[i].createtime)
          }
          that.setData({
            myWinList: res.data.rows,
            modelShow: false
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            isScroll: true
          })
        }
      })
    }
  },

  close_model: function() {
    this.setData({
      modelShow: true,
      isScroll: true
    })
  },
  winPro: function(e) {
    console.log(e)
    var that = this
    if (this.data.allowbind) {
      this.setData({
        allowbind: false
      })
      var id = ''
      var lid = ''
      if (e != undefined) {
        id = e.currentTarget.id
        lid = e.currentTarget.dataset.lid
      } else {
        id = this.data.winId
        lid= this.data.lotteryId
      }
      util.queryRequest('?m=listexchange&a=add', {
        pid: id,
        num: 1,
        type: 'exchange',
        lottery_id:lid,
        genre: 1
      }, 'GET', function(res) {
        if (res.isSuccess) {
          wx.navigateTo({
            url: '../sureOrder/sureOrder?id=' + id + '&addType=3&genre=1'
          })
        } else {
          that.setData({
            allowbind: true
          })
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  getLottery: function() {
    var that = this
    if (that.data.btnDisabled == '') {
      that.data.btnDisabled = 'disabled'
      if (util.isLogin()) {
        if (wx.getStorageSync("isbind")) {
          util.queryRequest('?m=lottery&a=cj', {}, 'GET', function(res) {
            if (res.isSuccess) {
              that.setData({
                msg: res.msg
              })
              if (res.product_id != 0) {
                that.setData({
                  winId: res.product_id,
                  lotteryId:res.id
                })
              }
              // var awardIndex = Math.random() * 6 >>> 0;
              var awardIndex = res.prize_id - 1; //设置本地中奖物品（若从1开始，值减一）
              // if (awardIndex < 2) app.awardsConfig.chance = false
              // 获取奖品配置
              var awardsConfig = app.awardsConfig
              // 旋转抽奖
              var animationRun = wx.createAnimation({
                duration: 4000,
                timingFunction: 'ease'
              })
              that.animationRun = animationRun;
              animationRun.rotate(360 * 8 - awardIndex * (360 / 8)).step()
              that.setData({
                animationData: animationRun.export(),
              })
              // 中奖提示
              setTimeout(function() {
                var win = false
                var winName = '确定'
                if (that.data.winId != '') {
                  win = true
                  winName = '前往领取'
                }
                wx.showModal({
                  title: '恭喜您',
                  content: that.data.msg,
                  showCancel: win,
                  confirmText: winName,
                  success: function(res) {
                    if (res.confirm) {
                      if (win) {
                        that.winPro()
                      } else {
                        var animationRun = wx.createAnimation({
                          duration: 1
                        })
                        that.animationRun = animationRun;
                        animationRun.rotate(360 - awardIndex * (360 / 8)).step();
                        if (that.data.times <= 0) {
                          that.data.times = 0
                        } else {
                          that.data.times = that.data.times - 1
                        }
                        that.setData({
                          animationData: animationRun.export(),
                          times: that.data.times,
                          winId: '',
                          lotteryId:'',
                        })
                      }
                    } else if (res.cancel) {
                      var animationRun = wx.createAnimation({
                        duration: 1
                      })
                      that.animationRun = animationRun;
                      animationRun.rotate(360 - awardIndex * (360 / 8)).step();
                      if (that.data.times <= 0) {
                        that.data.times = 0
                      } else {
                        that.data.times = that.data.times - 1
                      }
                      that.setData({
                        animationData: animationRun.export(),
                        times: that.data.times,
                        winId: ''
                      })
                    }
                    if (awardsConfig.chance) {
                      that.setData({
                        btnDisabled: '',
                        winId: ''
                      })
                    }
                  }
                })
              }, 4000);
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
              setTimeout(function() {
                that.setData({
                  btnDisabled: ''
                })
              }, 2000)
            }
          })
        } else {
          that.setData({
            btnDisabled: ''
          })
          wx.reLaunch({
            url: '../bind/bind?visit=6' // 已授权未绑定手机号跳转到绑定手机号后跳转回来
          })
        }
      } else {
        that.setData({
          btnDisabled: ''
        })
      }
    }
  },
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
    // this.dialog = this.selectComponent("#reload");
    this.setData({
      isScroll: true
    })
    var that = this
    util.queryRequest('?m=activity&a=lottery_index', '', 'POST', function(res) {
      if (res.isSuccess) {
        wx.setNavigationBarTitle({
          title: res.data.title
        })
        wx.hideLoading()
        that.setData({
          isShow: true
        })
        that.setData({
          prizeList: res.data.disk.rows,
          total_people: res.data.total_times,
          img: res.data.background_image,
          times: Number(res.data.left_times),
          list_bg_top: res.data.background_image1,
          list_bg_middle: res.data.background_image2,
          list_bg_bottom: res.data.background_image3,

        })
        app.awardsConfig = {
          chance: true,
          awards: that.data.prizeList
        }
        var awardsConfig = app.awardsConfig.awards,
          len = awardsConfig.length,
          html = [],
          turnNum = 360 / len // 文字旋转 turn 值
        // var ctx = wx.createCanvasContext()
        for (var i = 0; i < len; i++) {
          // 奖项列表
          html.push({
            turn: i * turnNum + 'deg',
            award: awardsConfig[i].name,
            imgUrl: awardsConfig[i].image
          });
        }
        that.setData({
          awardsList: html
        });
      } else {
        wx.showToast({
          title: '活动未开启！',
          icon: 'none',
          duration: 1000
        })
        setTimeout(function() {
          wx.switchTab({
            url: '../index/index'
          })
        }, 1000)

      }
    })
    // var that = this;
    util.queryRequest('?m=activity&a=winning', {
      limit: that.data.limit
    }, 'GET', function(res) {
      if (res.isSuccess) {
        that.setData({
          winList: res.data
        })
      }
    })
    // 初始化 rotate
    var animationRun = wx.createAnimation({
      duration: 1
    })
    this.animationRun = animationRun;
    animationRun.rotate(0).step()
    this.setData({
      animationData: animationRun.export()
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      modelShow: true
    })
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