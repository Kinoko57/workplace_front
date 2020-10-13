// pages/index/index.js
let util = require('../../utils/util.js')
let timer = require('../../utils/wxTimer.js')
var app = getApp()
var wxTimer
var saleTimes
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeout: '',
    isloading: true,
    dataCopy: false,
    boxType: '',
    lotteryImg: '',
    isUp: true,
    news_num: 0,
    isShow: false,
    top: false,
    s_history: false,
    redInfo: [],
    red_show: true,
    navChose: 1,
    isTop: true,
    isSign: true,
    navNtn: 1,
    typeId: '',
    page: 1,
    limit: 10,
    wxTimerList: {}, // saleTime: ['00', '00', '00'],
    time: null,
    typeList: [],
    isSale: false,
    // downList: [],
    remProList: {}, // 列表总数据
    loadingNew: 0,
    loadingPoint: 0,
    loadingActivity: 0,
    remPro_requst: false,// 是否加载过积分专区和本周上新
    new_loading: false,
    redeem_loading: false,
    newList: { module: { view_type: 3 }, list: [] }, // 本周上新
    redeemList: { module: { view_type: 3 }, list: [] }, // 积分专区
    activityList: [], // 活动专区全部数据
    activityShowList: [],
    acticity_requst: false, // 是否加载过活动列表数据
    activity_page: 0,
    recomShowList: [], // 推荐商品显示瀑布流
    recomList: [], // 推荐商品瀑布流
    recom_title: '',
    recom_color: '',
    recom_page: 1,
    recom_total: 0,
    recom_limit: 10,
    recom_img: '',
    recom_request: false,
    proList: [],
    haswinList: false,
    winList: [],
    sale_img: '',
    saleList: [],
    headImg: '',
    comNav: [],
    fruitImg: '',
    showWin: false,
    showFruit: false,
    get_cou: true
  },
  //广告位跳转
  goUrl: function (e) {
    if (e.currentTarget.dataset.type == 1) {
      // 商品详情
      wx.navigateTo({
        url: '../proDetail/proDetail?type=normal&id=' + e.currentTarget.id
      })
    } else {
      // 跳转分类
      if (e.currentTarget.id != 0) {
        app.globalData.firstForm = 1
        app.globalData.choseNav = e.currentTarget.id
        wx.switchTab({
          url: '../proType/proType'
        })
      }
    }
  },
  goProtype: function () {
    app.globalData.firstForm = 1
    app.globalData.choseNav = -1
    wx.switchTab({
      url: '../proType/proType'
    })
  },
  goTypeList: function (e) {
    app.globalData.firstForm = 1
    app.globalData.choseNav = e.currentTarget.id
    wx.switchTab({
      url: '../proType/proType'
    })
  },
  goLink: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  goLottery: function (e) {
    this.setData({
      red_show: true
    })
    wx.redirectTo({
      url: e.currentTarget.dataset.link
    })
  },
  //跳转到列表页
  goProList: function (e) {
    // 跳转
    wx.navigateTo({
      url: '../proList/proList?type=menu&value=' + e.currentTarget.id
    })
  },
  goActivityList: function (e) {
    // 跳转
    wx.navigateTo({
      url: '../activityList/activityList?id=' + e.currentTarget.id
    })
  },
  goNav: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
    util.queryRequest('?m=myinfo&a=formid_save', {
      form_id: e.detail.formId
    }, 'POST', function (res) {
      if (res.isSuccess) {
        console.log('成功传递form_id')
      }
    })
    let path = e.currentTarget.dataset.href
    if (path.indexOf('hotPush') != -1 || path.indexOf('index') != -1 || path.indexOf('myCar') != -1 || path.indexOf('proType') != -1 || path.indexOf('memberCenter') != -1) {
      // 跳转底部栏
      wx.reLaunch({
        url: path
      })
    } else if (path.indexOf('lottery') != -1) {
      // 抽奖页不需要返回
      wx.redirectTo({
        url: path
      })
    } else {
      wx.navigateTo({
        url: path
      })
    }
  },
  goSign: function (e) {
    if (util.isLogin()) {
      var that = this
      util.queryRequest('?m=myinfo&a=userinfo', '', 'POST', function (res) {
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
          }
          if (!wx.getStorageSync("isbind")) {
            wx.reLaunch({
              url: '../bind/bind?visit=3'
            })
          } else {
            that.setData({
              isSign: true
            })
            wx.navigateTo({
              url: e.currentTarget.dataset.link
            })
          }
        }
      })
    }
  },
  imgLink: function (e) {
    var that = this
    util.queryRequest('?m=activity&a=banner_click', {
      id: e.currentTarget.dataset.imgid
    }, 'GET', function (res) {
      if (res.isSuccess) {
        console.log(res)
      }
    })
    var pageLink = ''
    console.log(e.currentTarget.dataset.type)
    switch (e.currentTarget.dataset.type) {
      //1 商品，3是试用，4是团购，5 文章，6 大转盘 7 水果专区 8 自定义路径
      case '1':
        pageLink = '../proDetail/proDetail?type=normal&id=' + e.currentTarget.id;
        break;
      case '3':
        pageLink = '../tryOutdetail/tryOutdetail?id=' + e.currentTarget.dataset.activityid;
        break;
      case '4':
        pageLink = '../proDetail/proDetail?type=group&id=' + e.currentTarget.dataset.activityid + '&goods_id=' + e.currentTarget.id;
        break;
      case '5':
        pageLink = '../hotArticle/hotArticle?id=' + e.currentTarget.id + '&name=文章详情';
        break;
      case '6':
        pageLink = '../lottery/lottery';
        break;
      case '7':
        pageLink = '../fruitDetail/fruitDetail?type=fruits&id=' + e.currentTarget.id;
        break;
    }
    if (e.currentTarget.dataset.type == '6') {
      wx.redirectTo({
        url: pageLink
      })
    } else if (e.currentTarget.dataset.type == '8') {
      let path = e.currentTarget.dataset.href
      if (path.indexOf('hotPush') != -1 || path.indexOf('index') != -1 || path.indexOf('myCar') != -1 || path.indexOf('proType') != -1 || path.indexOf('memberCenter') != -1) {
        wx.switchTab({
          url: path,
        })
      } else if (path.indexOf('lottery') != -1) {
        wx.redirectTo({
          url: path
        })
      } else {
        wx.navigateTo({
          url: path
        })
      }
    }
    else {
      wx.navigateTo({
        url: pageLink
      })
    }

  },
  catchTouchMove: function (res) {
    return false
  },
  goPro: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  choseNav: function (e) {
    wx.reLaunch({
      url: '../menuPage/menuPage?id=' + e.currentTarget.id + '&img=' + e.currentTarget.dataset.img
    })
  },
  choseNavRight: function () {
    this.setData({
      navChose: 2
    })
  },
  choseNavLeft: function () {
    this.setData({
      navChose: 1
    })
  },
  scan: function () {
    console.log(10)
    wx.scanCode({
      success: (res) => {
        console.log(res)
        if (res.scanType == 'QR_CODE') {
          wx.navigateTo({
            url: '../scanCode/scanCode?type=' + res.result
          })
        } else {
          console.log(res.path)
          wx.navigateTo({
            url: '/' + res.path
          })
        }

      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  close_model: function () {
    this.setData({
      red_show: true
    })
  },
  onPageScroll: function (e) { // 获取滚动条当前位置
    if (e.scrollTop > 0) {
      if (!this.data.top) {
        this.setData({
          top: true
        })
      }
      if (e.scrollTop > 900) {
        if (this.data.isTop) {
          this.setData({
            isTop: false
          })
        }
        // 如果15个活动商品已经请求完毕请求猜你喜欢，精品分类
        if (this.data.dataCopy == false && this.data.acticity_requst == true) {
          this.data.dataCopy = true
          // // 获取精品分类
          // this.getTypeList()
        }
      } else {
        if (!this.data.isTop) {
          this.setData({
            isTop: true
          })
        }
      }
    } else {
      if (this.data.top) {
        this.setData({
          top: false
        })
      }
    }
  },
  getCou: function (e) {
    if (this.data.get_cou) {
      this.data.get_cou = false
      if (e.currentTarget.dataset.isget == false) {
        var that = this
        util.queryRequest('?m=myinfo&a=get_discount', {
          id: e.currentTarget.id
        }, 'GET', function (res) {
          if (res.isSuccess) {
            wx.showToast({
              title: '领取成功',
              icon: 'success',
              duration: 1000
            })
            for (var i = 0; i < that.data.redInfo.length; i++) {
              if (that.data.redInfo[i].id == e.currentTarget.id) {
                that.data.redInfo[i].isget = true
              }
            }
            setTimeout(function () {
              that.data.get_cou = true
            }, 1000)
            // that.setData({
            // })
            // wx.navigateTo({
            //   url: '../myCoupon/myCoupon'
            // })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
          setTimeout(function () {
            that.data.get_cou = true
            that.setData({
              redInfo: that.data.redInfo
              // red_show: true,
            })
          }.bind(that), 1000)
        })
      }
    }

  },
  searchHis: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  //获取首页轮播
  getBanner: function () {
    var that = this
    util.queryRequest('?m=activity&a=banner', '', 'GET', function (res) {
      wx.hideLoading()
      if (res.isSuccess) {
        that.setData({
          imgUrls: res.data.rows,
          isShow: true,
          showWin: res.data.fitter.is_lottery,
          comNav: res.data.icon,
          loadingNew: res.data.is_new,// 是否显示本周上新
          loadingPoint: res.data.is_point,// 是否显示积分专区
          loadingActivity: res.data.is_module,// 是否显示活动列表
        })
        // 如果显示水果专区在赋值
        if (res.data.fitter.is_fruits) {
          that.setData({
            showFruit: res.data.fitter.is_fruits,
            fruitImg: res.data.fitter.fruits_adv_img
          })
        }
        // 显示中奖轮播再请求接口
        if (res.data.fitter.is_lottery == 'true') {
          that.getwinList()
        }
      } else {
        that.setData({
          isShow: true
        })
      }
    })
  },
  //获取首页商品列表
  getList: function () {
    var that = this;
    util.queryRequest('?m=list&a=new_point_module', '', 'GET', function (res) {
      wx.hideLoading()
      if (res.isSuccess) {
        that.data.remProList = {}
        that.data.remProList = res.data
        that.data.remPro_requst = true
        console.log(that.data.loadingNew)
        console.log(that.data.loadingPoint)
        if (that.data.loadingNew == 1) {
          that.data.new_loading = true
          that.setData({
            newList: res.data.new, // 本周上新
            isShow: true
          })
        } else if (that.data.loadingPoint == 1) {
          that.data.redeem_loading = true
          that.setData({
            redeemList: res.data.point, // 积分专区
            isShow: true
          })
        } else {

        }
      } else {
        that.setData({
          isShow: true
        })
      }
    })
  },
  // 获取活动的全部数据
  getActivity: function () {
    var that = this;
    util.queryRequest('?m=list&a=schemeList', {}, 'GET', function (res) {
      wx.hideLoading()
      that.data.acticity_requst = true
      if (res.isSuccess) {
        if (res.data.length > 0) {
          that.data.activityList = []
          that.data.activityList = res.data
          for (let i = 0; i < that.data.activityList.length; i++) {
            if (that.data.activityList[i].module.view_type != 3) {
              that.data.activity_page = i
              that.setData({
                ['activityShowList[' + i + ']']: [that.data.activityList[i]],
                activity_page: i
              })
              break;
            }
          }

        } else {
          that.data.activityList = []
        }
      } else {
        console.log('活动列表请求出错')
      }
    })
  },
  // 获取热门推荐瀑布流
  getRecomList: function () {
    var that = this;
    util.queryRequest('?m=list&a=getHotGoods', {}, 'GET', function (res) {
      wx.hideLoading()
      if (res.isSuccess) {
        that.data.recomList = []
        if (res.data.rows.length > 0) {
          that.data.recomList = res.data.rows
          that.data.recom_total = res.data.total
          that.data.recom_limit = res.data.limit
          that.setData({
            recom_img: res.data.title_img,
            ['recomShowList[' + that.data.recom_page + ']']: that.data.recomList[0]
          })
          that.data.recom_request = true
        } else {
          that.setData({
            isloading: false
          })
        }
      } else {
        console.log('活动列表请求出错')
      }
    })
  },
  // 获取首页促销商品列表
  getFlash: function () {
    if (this.data.time == null) {
      var that = this
      util.queryRequest('?m=activity&a=type_promotion_goods', '', 'GET', function (res) {
        wx.hideLoading()
        if (res.isSuccess) {
          if (res.data != null) {
            if (res.countdown > 0) {
              var secTime = util.countDown(res.countdown)
              wxTimer = new timer({
                beginTime: secTime.hou + ':' + secTime.min + ':' + secTime.sec,
                complete: function () {
                  console.log('倒计时结束')
                  // that.getFlash()
                }
              })
              wxTimer.start(that);
              that.setData({
                saleList: res.data,
                isSale: true,
                isShow: true,
                sale_img: res.title_img
              })
            } else {
              that.setData({
                isSale: false,
                isShow: true
              })
            }
          } else {
            that.setData({
              isSale: false,
              isShow: true
            })
          }
        } else {
          that.setData({
            isShow: true
          })
        }
      })
    }
  },
  // 获取顶部分类
  // getTypeList: function() {
  //   var that = this
  //   util.queryRequest('?m=menu', '', 'GET', function(res) {
  //     that.setData({
  //       downList: res.top
  //     })
  //     wx.setNavigationBarTitle({
  //       title: res.title
  //     })
  //   })
  // },
  // 获取中奖列表
  getwinList: function () {
    var that = this
    //获取中奖列表
    util.queryRequest('?m=activity&a=winning', {
      limit: 8
    }, 'GET', function (res) {
      if (res.isSuccess) {
        var list = []
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].createtime = util.formatDate(res.data[i].createtime)
          list.push(res.data[i])
          if ((i + 1) % 4 == 0) {
            that.data.winList.push({
              'list': list
            })
            list = []
          }
        }
        if (res.data.length < 4) {
          that.data.winList.push({
            'list': res.data
          })
        }
        that.setData({
          winList: that.data.winList,
          haswinList: true
        })
      } else {
        that.setData({
          haswinList: false
        })
      }
    })
  },
  getAlways: function () {
    var that = this
    //获取首页弹框
    util.queryRequest('?m=activity&a=index_coupon', {}, 'GET', function (res) {
      if (res.isSuccess) {
        if (res.data.lottery != '' && res.data.lottery != undefined) {
          that.setData({
            boxType: 'lottery',
            red_show: false,
            lotteryImg: res.data.lottery
          })
        } else {
          if (res.data.coupon.length > 0) {
            for (var i = 0; i < res.data.coupon.length; i++) {
              res.data.coupon[i].isget = false
            }
            that.setData({
              boxType: 'cou',
              red_show: false,
              redInfo: res.data.coupon
            })
          } else {
            that.setData({
              red_show: true
            })
          }
        }
      }
    })
    //查询购物车数量
    util.queryRequest('?m=cart&a=cart', {}, 'GET', function (res) {
      if (res.isSuccess) {
        app.globalData.carNum = res.data.rows_total
        if (wx.setTabBarBadge) {
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
      } else {

      }
    })
  },
  getNews: function () {
    var that = this
    util.queryRequest('?m=myinfo&a=check_unread', {}, 'POST', function (res) {
      // app.globalData.redNews = 0
      if (res.isSuccess) {
        // 判断是否签到
        if (res.data.is_sign == 1) {
          that.data.isSign = true
        } else {
          that.data.isSign = false
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
          if (wx.hideTabBarRedDot) {
            wx.hideTabBarRedDot({
              index: 4
            })
          }

        }
        that.setData({
          newNews: that.data.newNews,
          news_num: that.data.news_num,
          isSign: that.data.isSign
        })
      }
    })
  },
  returnTop: function () {
    this.setData({
      isTop: true
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    // 获取banner图
    this.getBanner()
    // 获取首页弹框
    this.getAlways()
    wx.showTabBar();
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
    if (this.data.top > 240) {
      this.setData({
        isTop: false
      })
    } else {
      this.setData({
        isTop: true
      })
    }
    // 获取促销商品
    this.getFlash()
    this.getNews()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    saleTimes = ['00', '00', '00']
    if (wxTimer != undefined) {
      wxTimer.stop()
    }
    this.setData({
      isTop: true
    })
    clearTimeout(this.data.timeout)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(this.data.timeout)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    saleTimes = ['00', '00', '00']
    if (wxTimer != undefined) {
      wxTimer.stop()
    }
    this.data.remProList = {}
    this.data.dataCopy = false
    this.setData({
      newList: { module: { view_type: 3 }, list: [] },
      redeemList: { module: { view_type: 3 }, list: [] },
      activityShowList: [],
      recomShowList: [],
      remPro_requst: false,
      new_loading: false,
      redeem_loading: false,
      acticity_requst: false,
      activity_page: 0,
      recom_page: 0,
      timeout: '',
    })
    this.getBanner()
    this.getFlash()
    this.getNews()
    this.getAlways()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that = this
    this.data.timeout = setTimeout(function () {
      console.log('延时300秒')
      if ((this.data.loadingNew == 1 || this.data.loadingPoint == 1) && this.data.remPro_requst == false) {
        // 获取本周上新，积分专区
        this.getList()
      } else {
        console.log(this.data.loadingNew)
        console.log(this.data.loadingPoint)
        console.log(this.data.redeem_loading)
        if (this.data.loadingNew == 1 && that.data.redeem_loading == false) {
          that.data.redeem_loading = true
          that.setData({
            redeemList: that.data.remProList.point, // 积分专区
          })
        }
        // 如果本周上新等有数据并且活动列表为空
        if (this.data.loadingActivity == 1 && this.data.acticity_requst == false) {
          // 获取15个商品
          this.getActivity()
        } else {
          if (this.data.loadingActivity == 1 && that.data.activityList.length > 0) {
            if (that.data.activity_page < that.data.activityList.length - 1) {
              ++that.data.activity_page
              for (let i = that.data.activity_page; i < that.data.activityList.length; i++) {
                if (that.data.activityList[i].module.view_type != 3) {
                  that.setData({
                    ['activityShowList[' + i + ']']: [that.data.activityList[i]],
                    activity_page: i
                  })
                  break;
                }
              }
              console.log(that.data.activityShowList)
            } else {
              if (this.data.recom_request == false) {
                // 加载热门推荐
                this.getRecomList()
              } else {
                if (that.data.recom_page < that.data.recomList.length - 1) {
                  ++that.data.recom_page
                  that.setData({
                    ['recomShowList[' + that.data.recom_page + ']']: that.data.recomList[that.data.recom_page]
                  })
                  // 判断最后一次商品数量是不是和limit一样大，小就说明是最后一条
                  if (that.data.recomList[that.data.recom_page].length < that.data.recom_limit) {
                    that.setData({
                      isloading: false
                    })
                  }
                } else {
                  that.setData({
                    isloading: false
                  })
                }
              }
            }
          } else {
            if (this.data.recom_request == false) {
              // 加载热门推荐
              this.getRecomList()
            } else {
              if (that.data.recom_page < that.data.recomList.length - 1) {
                ++that.data.recom_page
                that.setData({
                  ['recomShowList[' + that.data.recom_page + ']']: that.data.recomList[that.data.recom_page]
                })
                // 判断最后一次商品数量是不是和limit一样大，小就说明是最后一条
                if (that.data.recomList[that.data.recom_page].length < that.data.recom_limit) {
                  that.setData({
                    isloading: false
                  })
                }
              } else {
                that.setData({
                  isloading: false
                })
              }
            }
          }
        }
      }
    }.bind(this), 300)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})