// pages/myOrder/myOrder.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active_type_id: 'type0',
    isShow: false,
    newNews: false,
    total_amout: 0,
    orderstatus: '等待付款',
    orderStatusCode: '1',
    page: 1,
    orderList: [],
    apiUrl: app.globalData.apiUrl,
    total: 0,
    orderNum: false,
    after_tips: '',
    leftLength: 0,
    allowbind: true,
    time: null,
    endTimeList: [],
    saleTimeList: [],
    is_iphonex: app.globalData.phoneType
  },
  goComm: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url + '?num=' + e.currentTarget.dataset.num + '&orderId=' + e.currentTarget.id
    })
  },
  goPro: function(e) {
    console.log(e)
    if (this.data.orderStatusCode == '7') {
      if (e.currentTarget.dataset.flag == 0) {
        wx.navigateTo({
          url: '../saleAfter/saleAfter?pid=' + e.currentTarget.id + '&orderId=' + e.currentTarget.dataset.orderid + '&order_type=7'
        })
      } else {
        wx.navigateTo({
          url: '../afterDetail/afterDetail?pid=' + e.currentTarget.id + '&orderId=' + e.currentTarget.dataset.orderid + '&order_type=' + e.currentTarget.dataset.type
        })
      }
      // wx.navigateTo({
      //   url: e.currentTarget.dataset.link + '&is_sale=1'
      // })
    } else {
      wx.navigateTo({
        url: '../orderDetail/orderDetail?id=' + e.currentTarget.dataset.orderid
      })
    }
  },
  goIndex: function(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.link
    })
  },
  choseOrder: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    // 向后台发起请求，更新数据，以下为模拟数据
    this.setData({
      orderStatusCode: e.currentTarget.dataset.tid,
      page: 1,
      active_type_id: e.target.id
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 1
    })
    this.getList()
    // switch (e.target.id) {
    //   case '1':
    //     this.setData({
    //       orderstatus: '等待付款'
    //     });
    //     break;
    //   case '5':
    //     this.setData({
    //       orderstatus: '买家已付款'
    //     });
    //     break;
    //   case '2':
    //     this.setData({
    //       orderstatus: '待收货'
    //     });
    //     break;
    //   case '6':
    //     this.setData({
    //       orderstatus: '待评价'
    //     });
    //     break;
    //   case '3':
    //     this.setData({
    //       orderstatus: '已完成'
    //     });
    //     break;
    //   case '7':
    //     this.setData({
    //       orderstatus: '交易关闭'
    //     });
    //     break;
    // }
  },
  cancelOrder: function(e) {
    console.log(e)
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定取消当前订单？订单一经取消不可恢复！',
      success: function(res) {
        if (res.confirm) {
          util.queryRequest('?m=order&a=order_cancel', {
            id: e.currentTarget.id,
            payment_id: e.currentTarget.dataset.paymentid
          }, 'GET', function(res) {
            if (res.isSuccess) {
              wx.showToast({
                title: res.msg,
                icon: 'success',
                duration: 1000
              })
              setTimeout(function() {
                clearInterval(that.data.time)
                that.setData({
                  page: 1,
                  time: null
                })
                that.getList()
              }, 1000)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  afterSale: function() {
    wx.showModal({
      title: '提示',
      content: this.data.after_tips,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getList: function() {
    var that = this
    util.queryRequest('?m=member&a=getOrders', {
      id: that.data.orderStatusCode,
      page: that.data.page
    }, 'GET', function(res) {
      that.setData({
        isShow: true
      })
      wx.hideLoading()
      if (res.isSuccess) {
        if (that.data.orderStatusCode == 7) {
          if (res.rows != null) {
            for (var i = 0; i < res.rows.length; i++) {
              var after_list = []
              for (var k = 0; k < res.rows[i].rows.length;k++){
                for (var j = 0; j < res.rows[i].rows[k].order_items.length; j++) {
                  after_list.push(res.rows[i].rows[k].order_items[j].type)
                }
              }
              var after_str = after_list.join(',')
              console.log(after_str)
              if (after_str.indexOf('barter') != -1) {
                res.rows[i].after_type = 'barter'
              } else if (after_str.indexOf('reship') != -1) {
                res.rows[i].after_type = 'reship'
              } else {
                res.rows[i].after_type = 'refunds'
              }
            }
          }
          console.log(res.rows)
        }
        if (that.data.orderStatusCode == 1) {
          if (res.rows != null) {
            var timearr = []
            for (var i = 0; i < res.rows.length; i++) {
              timearr.push(res.rows[i].countdown)
            }
            that.setData({
              endTimeList: timearr
            })
            var sectimeList = util.countDownList(timearr)
            that.setData({
              saleTimeList: sectimeList
            })
            that.data.time = setInterval(function() {
              for (var k = 0; k < timearr.length; k++) {
                if (timearr[k] > 0) {
                  timearr[k] = --timearr[k]
                } else {
                  timearr[k] = 0
                }
              }
              that.setData({
                endTimeList: timearr,
              })
              sectimeList = util.countDownList(timearr)
              that.setData({
                saleTimeList: sectimeList
              })
            }.bind(that), 1000)
            that.setData({
              time: that.data.time
            })
          }
        }
        if (res.rows != null) {
          that.setData({
            orderList: res.rows,
            total: res.total,
            orderNum: true
          })
        } else {
          that.setData({
            orderNum: false
          })
        }
      }
    })

  },
  viewtrack: function(e) {
    var that = this
    util.queryRequest('?m=order&a=express', {
      id: e.currentTarget.id,
    }, 'GET', function(res) {
      if (res.isSuccess) {
        wx.navigateTo({
          url: '../orderTrack/orderTrack?orderId=' + e.currentTarget.id
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })

  },
  sureOrder: function(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '请确定已收到货品',
      success: function(res) {
        if (res.confirm) {
          util.queryRequest('?m=order&a=order_finish', {
            order_id: e.currentTarget.id
          }, 'GET', function(res) {
            if (res.isSuccess) {
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function() {
                that.setData({
                  page: 1
                })
                that.getList()
              }.bind(that), 1000)
            } else {
              wx.showToast({
                title: '失败',
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

  },
  wxPay: function(e) {
    var that = this
    if (this.data.allowbind) {
      that.data.allowbind = false
      wx.login({
        success: function(success_res) {
          if (success_res.code) {
            util.queryRequest('?m=order&a=pay', {
              id: e.currentTarget.id,
              pay_id: e.currentTarget.dataset.payid,
              payment_id: e.currentTarget.dataset.paymentid,
              pay_payment: 'xcxpay',
              code: success_res.code
            }, 'GET', function(res) {
              if (res.isSuccess) {
                wx.requestPayment({
                  'timeStamp': res.data.timeStamp,
                  'nonceStr': res.data.nonceStr,
                  'package': res.data.package,
                  'signType': res.data.signType,
                  'paySign': res.data.paySign,
                  'success': function(res) {
                    wx.showToast({
                      title: '支付成功',
                      icon: 'Success',
                      duration: 1000
                    })
                    that.data.allowbind = true
                    // wx.navigateTo({
                    //   url: '../paySuccess/paySuccess?addrId=' + that.data.addrId
                    // })
                  },
                  'fail': function(res) {
                    console.log(res)
                    that.data.allowbind = true
                    // wx.showToast({
                    //   title: res.errMsg,
                    //   icon: 'none',
                    //   duration: 2000
                    // })
                  },
                  'complete': function(res) {
                    // wx.showToast({
                    //   title: res.errMsg,
                    //   icon: 'none',
                    //   duration: 2000
                    // })
                  }
                })
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          } else {
            wx.showToast({
              title: '微信接口异常',
              icon: 'none',
              duration: 1000
            })
          }
        },
        fail: fail_res => {
          that.data.allowbind = true
          console.log(fail_res)
          wx.showToast({
            title: '微信接口异常',
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
  },
  remind: function(e) {
    console.log()
    var that = this
    if (e.currentTarget.dataset.isremind == 0) {
      util.queryRequest('?m=order&a=remind_send', {
        order_id: e.currentTarget.id,
      }, 'GET', function(res) {
        if (res.isSuccess) {
          wx.showToast({
            title: '已提醒',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function() {
            for (var i = 0; i < that.data.orderList.length; i++) {
              if (that.data.orderList[i].order_id == e.currentTarget.id) {
                that.data.orderList[i].remind = 1
                break;
              }
            }
            that.setData({
              orderList: that.data.orderList,
            })
          }.bind(that), 1000)

        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请勿重复提醒',
        icon: 'none',
        duration: 1000
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.dialog = this.selectComponent("#reload");
    this.setData({
      orderStatusCode: options.tid,
      active_type_id: options.id
    })
    // this.getList()
    wx.setNavigationBarTitle({
      title: '我的订单'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff8d97',
    })
    //获取售后提示文字
    var that = this
    util.queryRequest('?m=index&a=after_sale', {}, 'GET', function(res) {
      if (res.isSuccess) {
        that.setData({
          after_tips: res.explain
        })
      }
    })
    // 查询购物车数量
    util.queryRequest('?m=cart&a=cart', {}, 'GET', function(res) {
      if (res.isSuccess) {
        that.setData({
          total_amout: res.data.rows_total
        })
        app.globalData.carNum = res.data.rows_total
        wx.setTabBarBadge({
          index: 3,
          text: res.data.rows_total
        })
        if (res.data.rows_total == 0) {
          wx.removeTabBarBadge({
            index: 3
          })
        }
      }
    })
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
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      page: 1
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 1
    })
    this.getList()
    this.setData({
      newNews: app.globalData.news,
      total_amout: app.globalData.carNum,
      allowbind: true,
      is_iphonex: app.globalData.phoneType
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.data.time)
    this.setData({
      time: null
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
    var that = this
    util.queryRequest('?m=member&a=getOrders', {
      id: that.data.orderStatusCode,
      page: ++that.data.page
    }, 'GET', function(res) {
      if (res.isSuccess) {
        if (res.rows == null) {
          res.rows = []
        }
        that.data.orderList = that.data.orderList.concat(res.rows)
        that.setData({
          orderList: that.data.orderList,
          total: res.total,
          orderNum: true
        })
        // if (that.data.orderStatusCode == 7) {
        //   if (res.rows != null) {
        //     for (var i = 0; i < that.data.orderList.length; i++) {
        //       var after_list = []
        //       for (var j = 0; j < that.data.orderList[i].order_items.length; j++) {
        //         after_list.push(that.data.orderList[i].order_items[j].type)
        //       }
        //       var after_str = after_list.join(',')
        //       if (after_str.indexOf('barter') != -1) {
        //         that.data.orderList[i].after_type = 'barter'
        //       } else if (after_str.indexOf('reship') != -1) {
        //         that.data.orderList[i].after_type = 'reship'
        //       } else {
        //         that.data.orderList[i].after_type = 'refunds'
        //       }
        //     }
        //   }
        // }
        // if (that.data.orderStatusCode == 1) {
        //   if (res.rows != null) {
        //     clearInterval(that.data.time)
        //     that.setData({
        //       saleTimeList: []
        //     })
        //     var timearr = []
        //     for (var i = 0; i < that.data.orderList.length; i++) {
        //       timearr.push(that.data.orderList[i].countdown)
        //     }
        //     that.setData({
        //       endTimeList: timearr
        //     })
        //     var sectimeList = util.countDownList(timearr)
        //     that.setData({
        //       saleTimeList: sectimeList
        //     })
        //     that.data.time = setInterval(function () {
        //       for (var k = 0; k < timearr.length; k++) {
        //         if (timearr[k] > 0) {
        //           timearr[k] = --timearr[k]
        //         } else {
        //           timearr[k] = 0
        //         }
        //       }
        //       that.setData({
        //         endTimeList: timearr,
        //       })
        //       sectimeList = util.countDownList(timearr)
        //       that.setData({
        //         saleTimeList: sectimeList
        //       })
        //     }.bind(that), 1000)
        //     that.setData({
        //       time: that.data.time
        //     })
        //   }
        // }
      } else {
        that.setData({
          orderNum: false
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})