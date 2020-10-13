// pages/sureOrder/sureOrder.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    changeAddr: false, // 修改地址
    order_id: '',
    proList: [],
    order: {},
    staticAdd: {},
    apiUrl: app.globalData.apiUrl,
    orderType: '',
    time: null,
    saleTime: [],
    after_tips: '',
    is_sale: '',
    allowbind: true,
    after_sale_states: 0, // 0是退款，1是退货，2是换货
    is_iphonex: app.globalData.phoneType,
    split_order: false,
    userInfo: app.globalData.userInfo,
    params: {}
  },
  copyBtn: function(e) {
    console.log(e)
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.id,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  addInfo: function(e) {
    this.setData({
      order_memo: e.detail.value
    })
  },
  goComm: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url + '?num=' + e.currentTarget.dataset.num + '&orderId=' + e.currentTarget.id
    })
  },
  golink: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url + '?pid=' + this.data.order_pid
    })
  },
  goPro: function(e) {
    if (e.currentTarget.dataset.type != null) {
      if (e.currentTarget.dataset.ordertype == 'fruits') {
        wx.navigateTo({
          url: '../fruitDetail/fruitDetail?type=fruits&&id=' + e.currentTarget.id
        })
      } else {
        if (e.currentTarget.dataset.ordertype != 'birthday' && e.currentTarget.dataset.ordertype != 'super' && e.currentTarget.dataset.ordertype != 'scantry' && e.currentTarget.dataset.ordertype != 'exchange' && e.currentTarget.dataset.ordertype != 'scan') {
          wx.navigateTo({
            url: e.currentTarget.dataset.link
          })
        }
      }

    } else {
      wx.showToast({
        title: '该商品不存在~',
        icon: 'none',
        duration: 1000
      })
    }
  },
  changeAdd: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  getOrder: function() {
    var that = this
    util.queryRequest('?m=order&a=order_details', {
      id: that.data.order_id,
      is_sale: that.data.is_sale
    }, 'GET', function(res) {
      if (res.isSuccess) {
        
        res.row_order.createtime = util.formatTime(res.row_order.createtime)
        if (res.row_order.pay_time != null) {
          res.row_order.pay_time = util.formatTime(res.row_order.pay_time)
        }
        that.setData({
          proList: res.order_items,
          order: res.row_order,
          split_order: res.is_group
        })
        if (that.data.order.order_refer == 'tuangou') {
          that.data.orderType = 'group'
        } else if (that.data.order.order_refer == 'qianggou') {
          that.data.orderType = 'flash'
        } else if (that.data.order.order_refer == 'local') {
          that.data.orderType = 'normal'
        } else {
          that.data.orderType = that.data.order.order_refer
        }
        that.setData({
          orderType: that.data.orderType
        })
      }
    })
    //获取售后提示文字
    // var that = this
    // util.queryRequest('?m=index&a=after_sale', {}, 'GET', function(res) {
    //   if (res.isSuccess) {
    //     that.setData({
    //       after_tips: res.explain
    //     })
    //   }
    // })
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
  cancelOrder: function(e) {
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
                that.getOrder()
              }, 1000)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  afterSale: function(e) {
    console.log(e.currentTarget.dataset.child)
    if (e.currentTarget.dataset.flag == 0) {
      wx.navigateTo({
        url: '../saleAfter/saleAfter?pid=' + e.currentTarget.id + '&orderId=' + e.currentTarget.dataset.orderid + '&order_type=' + e.currentTarget.dataset.ordertype + '&is_child=' + e.currentTarget.dataset.child
      })
    } else {
      wx.navigateTo({
        url: '../afterDetail/afterDetail?pid=' + e.currentTarget.id + '&orderId=' + e.currentTarget.dataset.orderid + '&order_type=' + e.currentTarget.dataset.ordertype + '&is_child=' + e.currentTarget.dataset.child
      })
    }
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
                that.getOrder()
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
    if (that.data.allowbind) {
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
                that.data.allowbind = true
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
            that.data.order.remind = 1
            that.setData({
              order: that.data.order,
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
  goIndex: function(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.link
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.dialog = this.selectComponent("#reload");
    console.log(options)
    if (options.is_sale != undefined) {
      this.setData({
        is_sale: options.is_sale
      })
    }
    var pages = getCurrentPages();
    this.setData({
      order_id: options.id
    })
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f2f2f2',
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
    this.setData({
      allowbind: true
    })
    this.getOrder()
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