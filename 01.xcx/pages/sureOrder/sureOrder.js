// pages/sureOrder/sureOrder.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    try_id: '', // 试用id
    allowbind: true,
    specNum: 1,
    ispayStep: false,
    pid: null,
    isFree: '',
    proDetail: [],
    couList: [],
    addList: [],
    payType: [],
    trackList: [],
    viewTrack: [],
    trackName: '选择物流',
    trackId: '',
    payId: 0,
    addType: 0, //直接下单3,购物车下单0,团购下单2
    addrId: 0,
    apiUrl: app.globalData.apiUrl,
    order_memo: '',
    staticAdd: [],
    static_freight: '',
    chooseAdd: 0,
    couInfo: '选择优惠券',
    couValue: -1,
    couCode: '',
    couId:'',
    orderDetail: {
      total_price: 0,
      total_score: 0,
      freight: 0
    },
    hiddenCou: false,
    orderType: '', //促销商品	flash 兑换商品	point 拼团商品	group	试用商品	try 抽奖兑换exchange
    order_pid: '',
    default_cou: '',
    is_iphonex: app.globalData.phoneType,
    scanLottery:false,
    selfPrice:0,
  },
  addInfo: function(e) {
    this.setData({
      order_memo: e.detail.value
    })
  },
  choseAdd: function() {
    if (this.data.orderType == 'try' || this.data.orderType == 'scantry') {
      this.data.addType = 4
    } else if (this.data.orderType == 'point') {
      this.data.addType = 5
    } else if (this.data.orderType == 'birthday') {
      this.data.addType = 5
    } else if (this.data.orderType == 'scan') {
      this.data.addType = 3
    }
    wx.navigateTo({
      url: '../editInfo/editInfo?code=address&codename=我的地址&isInput=1&type=choose&pid=' + this.data.pid
    })
  },
  payOver: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
    if (this.data.staticAdd.length <= 0) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.allowbind) {
      wx.showLoading({
        title: '提交中',
        mask: true
      })
      this.data.allowbind = false
      var that = this
      if (that.data.orderType == 'try' || that.data.orderType == 'scantry') {
        that.data.addType = 4
      } else if (that.data.orderType == 'point') {
        that.data.addType = 5
      } else if (that.data.orderType == 'birthday') {
        that.data.addType = 5
      } else if (that.data.orderType == 'scan') {
        that.data.addType = 3
      }
      if (that.data.orderType == 'group') {
        wx.setStorageSync("chosePro", '');
        util.queryRequest('?m=cart&a=checkout_submit3', {
          order_memo: that.data.order_memo,
          cart_type: that.data.addType,
          address_id: that.data.staticAdd[0].id,
          shipmethod_id: that.data.trackId,
          form_id: e.detail.formId
        }, 'POST', function(req) {
          wx.hideLoading()
          if (that.data.orderDetail.total_price <= 0) {
            wx.redirectTo({
              url: '../groupResult/groupResult?type=pay&orderId=' + req.order_id
            })
          } else {
            if (req.isSuccess) {
              wx.login({
                success: function(success_res) {
                  that.setData({
                    ispayStep: true
                  })
                  if (success_res.code) {
                    util.queryRequest('?m=order&a=pay', {
                      id: req.order_id,
                      pay_id: that.data.payId,
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
                            that.data.allowbind = true
                            console.log('跳转团购')
                            wx.redirectTo({
                              url: '../groupResult/groupResult?type=pay&orderId=' + req.order_id
                            })
                          },
                          'fail': function(res) {
                            that.data.allowbind = true
                            wx.redirectTo({
                              url: '../myOrder/myOrder?tid=1&id=type1'
                            })
                            // wx.showToast({
                            //   title: res,
                            //   icon: 'none',
                            //   duration: 1000
                            // })
                          },
                          'complete': function(res) {
                            // wx.showToast({
                            //   title: res,
                            //   icon: 'none',
                            //   duration: 1000
                            // })
                          }
                        })
                      }
                    })
                  } else {
                    that.data.allowbind = true
                    wx.showToast({
                      title: '微信接口异常',
                      icon: 'none',
                      duration: 1000
                    })
                  }

                },
                fail: fail_res => {
                  that.data.allowbind = true
                  console.log('login接口')
                  console.log(fail_res)
                  wx.showToast({
                    title: '微信接口异常',
                    icon: 'none',
                    duration: 1000
                  })
                }
              })
            } else {
              that.data.allowbind = true
              wx.showToast({
                title: req.msg,
                icon: 'none',
                duration: 1000
              })
            }
          }

        })
      } else {
        wx.setStorageSync("chosePro", '');
        if (that.data.couCode.indexOf('c=') == -1) {
          that.data.couCode = 'c=' + that.data.couCode
        }
        console.log(that.data.trackId)
        util.queryRequest('?m=cart&a=checkout_submit', {
          checked: that.data.pid,
          order_memo: that.data.order_memo,
          is_point: 0,
          print_freeze: 0,
          total_amount: that.data.orderDetail.total_price,
          cart_type: that.data.addType,
          type: that.data.orderType,
          cart_params: that.data.couCode,
          coupon_id: that.data.couId,
          address_id: that.data.staticAdd[0].id,
          shipmethod_id: that.data.trackId,
          form_id: e.detail.formId,
          try_id: that.data.try_id
        }, 'POST', function(res) {
          if (res.isSuccess) {
            wx.hideLoading()
            if (that.data.orderDetail.total_price <= 0) {
              wx.redirectTo({
                url: '../paySuccess/paySuccess?addrId=' + that.data.staticAdd[0].id
              })
            } else {
              wx.login({
                success: function(success_res) {
                  that.setData({
                    ispayStep: true
                  })
                  if (success_res.code) {
                    util.queryRequest('?m=order&a=pay', {
                      id: res.order_id,
                      payment_id: res.payment_id,
                      pay_id: that.data.payId,
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
                            that.data.allowbind = true
                            wx.redirectTo({
                              url: '../paySuccess/paySuccess?addrId=' + that.data.staticAdd[0].id
                            })
                          },
                          'fail': function(res) {
                            that.data.allowbind = true
                            wx.redirectTo({
                              url: '../myOrder/myOrder?tid=1&id=type1'
                            })
                          },
                          'complete': function(res) {

                          }
                        })
                      }
                    })
                  } else {
                    that.data.allowbind = true
                    wx.showToast({
                      title: '微信接口异常',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                },
                fail: fail_res => {
                  that.data.allowbind = true
                  console.log('login接口')
                  console.log(fail_res)
                  wx.showToast({
                    title: '微信接口异常',
                    icon: 'none',
                    duration: 1000
                  })
                }
              })
            }
          } else {
            that.data.allowbind = true
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
  addNum: function(event) {
    let id = event.target.id;
    let value = parseInt(this.data.specNum);
    value++;
    this.setData({
      specNum: value
    })
  },
  lessNum: function(event) {
    let id = event.target.id;
    let value = parseInt(this.data.specNum);
    if (value <= 0) {
      this.setData({
        specNum: 0
      })
    } else {
      value--;
    }
    this.setData({
      specNum: value
    })
  },
  golink: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url + '?pid=' + this.data.order_pid
    })
  },
  getOrder: function() {
    var that = this
    var url = ''
    that.data.staticAdd = []
    if (that.data.addType == '0') {
      //购物车下单确认订单页
      util.queryRequest('?m=cart&a=checkout', {
        checked: that.data.pid,
        cart_params: that.data.couCode,
        selfPrice: that.data.selfPrice
      }, 'POST', function(res) {
        wx.hideLoading()
        if (res.isSuccess) {
          that.data.orderDetail = {
            total_price: res.amount,
            total_score: res.point_use,
            freight: res.cost_freight
          }
          if (res.row_address != null) {
            that.data.chooseAdd = 0
            that.data.staticAdd.push(res.row_address)
          } else {
            that.data.chooseAdd = -1
          }
          if (res.coupon_code.indexOf('c=') == -1) {
            res.coupon_code = 'c=' + res.coupon_code
          }
          if (res.coupon_discount > 0) {
            that.data.couInfo = '已减' + res.coupon_discount + '元'
          }
          that.setData({
            couCount: res.coupon_discount,
            proDetail: res.rows_product,
            payType: res.rows_payments,
            payId: res.payment_id,
            orderDetail: that.data.orderDetail,
            couList: res.xianjinquans,
            addList: res.rows_address,
            staticAdd: that.data.staticAdd,
            couInfo: that.data.couInfo,
            addrId: res.address_id,
            chooseAdd: that.data.chooseAdd,
            default_cou: res.coupon_code,
            couCode: res.coupon_code,
            couId: res.coupon_id,
            trackList: res.rows_shipmethod,
            static_freight: res.cost_freight,
            isFree: res.free_freight
          })
          // viewTrack
          var arr = []
          console.log(that.data.proDetail)
          for (var i = 0; i < that.data.proDetail.length; i++) {
            for (var j = 0; j < that.data.proDetail[i].rows_product.length;j++){
              arr.push(that.data.proDetail[i].rows_product[j].product_id)
            }
          }
          var list = []
          for (var i = 0; i < res.rows_shipmethod.length; i++) {
            list.push(res.rows_shipmethod[i].row.name)
          }
          that.setData({
            order_pid: arr.join(','),
            viewTrack: list,
            trackName: res.rows_shipmethod[0].row.name,
            trackId: res.rows_shipmethod[0].row.id,
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }.bind(that), 1000)
        }
      })
    } else if (that.data.addType == '3') {
      //直接下单
      if (that.data.orderType == 'exchange' || that.data.orderType == 'try' || that.data.orderType == 'point' || that.data.orderType == 'birthday' || that.data.orderType == 'scan' || that.data.orderType == 'super' || that.data.orderType == 'scantry') {
        //兑换确认订单页
        // 改变上一个页面的数据
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2] //上一个页面
        prevPage.setData({
          allowbind: true
        })
        util.queryRequest('?m=cart&a=checkout5', {
          checked: that.data.pid,
          type: that.data.orderType,
        }, 'GET', function(res) {
          wx.hideLoading()
          if (res.isSuccess) {
            that.data.orderDetail = {
              total_price: res.amount,
              total_score: res.point_use,
              freight: res.cost_freight
            }
            if (res.row_address != null) {
              that.data.chooseAdd = 0
              that.data.staticAdd.push(res.row_address)
            } else {
              that.data.chooseAdd = -1
            }
            that.setData({
              proDetail: res.rows_product,
              payType: res.rows_payments,
              payId: res.payment_id,
              orderDetail: that.data.orderDetail,
              couList: res.xianjinquans,
              addList: res.rows_address,
              staticAdd: that.data.staticAdd,
              addrId: res.address_id,
              chooseAdd: that.data.chooseAdd,
              trackList: res.rows_shipmethod,
              static_freight: res.cost_freight,
              isFree: res.free_freight
            })
            var list = []
            for (var i = 0; i < res.rows_shipmethod.length; i++) {
              list.push(res.rows_shipmethod[i].row.name)
            }
            that.setData({
              viewTrack: list,
              trackName: res.rows_shipmethod[0].row.name,
              trackId: res.rows_shipmethod[0].row.id,
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }.bind(that), 1000)
          }
        })
      } else {
        let type ='normal'
        if (that.data.orderType == 'fruits'){
          type = 'fruits'
        }
        //直接下单确认订单页
        util.queryRequest('?m=cart&a=checkout4', {
          checked: that.data.pid,
          cart_params: that.data.couCode,
          type: type
        }, 'POST', function(res) {
          wx.hideLoading()
          if (res.isSuccess) {
            that.data.orderDetail = {
              total_price: res.amount,
              total_score: res.point_use,
              freight: res.cost_freight
            }
            if (res.coupon_discount > 0) {
              that.setData({
                couValue: res.coupon_discount
              })
            }
            if (res.row_address != null) {
              that.data.chooseAdd = 0
              that.data.staticAdd.push(res.row_address)
            } else {
              that.data.chooseAdd = -1
            }
            if (that.data.couValue != -1) {
              if (res.coupon_code.indexOf('c=') == -1) {
                res.coupon_code = 'c=' + res.coupon_code
              }
              that.data.couInfo = '已减' + that.data.couValue + '元'
            }
            that.setData({
              couCount: res.coupon_discount,
              proDetail: res.rows_product,
              payType: res.rows_payments,
              payId: res.payment_id,
              orderDetail: that.data.orderDetail,
              couList: res.xianjinquans,
              addList: res.rows_address,
              staticAdd: that.data.staticAdd,
              couInfo: that.data.couInfo,
              addrId: res.address_id,
              chooseAdd: that.data.chooseAdd,
              default_cou: res.coupon_code,
              couCode: res.coupon_code,
              couId: res.coupon_id,
              trackList: res.rows_shipmethod,
              static_freight: res.cost_freight
            })
            var arr = []
            for (var i = 0; i < that.data.proDetail.length; i++) {
              for (var j = 0; j < that.data.proDetail[i].rows_product.length; j++) {
                arr.push(that.data.proDetail[i].rows_product[j].product_id)
              }
            }
            var list = []
            for (var i = 0; i < res.rows_shipmethod.length; i++) {
              list.push(res.rows_shipmethod[i].row.name)
            }
            that.setData({
              order_pid: arr.join(','),
              viewTrack: list,
              trackName: res.rows_shipmethod[0].row.name,
              trackId: res.rows_shipmethod[0].row.id,
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }.bind(that), 1000)
          }
        })
      }
    } else if (that.data.addType == '2') {
      //团购下单确认订单页
      util.queryRequest('?m=cart&a=checkout3', {
        // checked: that.data.pid,
        // type: 'exchange',
      }, 'GET', function(res) {
        wx.hideLoading()
        if (res.isSuccess) {
          that.data.orderDetail = {
            total_price: res.amount,
            total_score: res.point_use,
            freight: res.cost_freight
          }
          if (res.row_address != null) {
            that.data.chooseAdd = 0
            that.data.staticAdd.push(res.row_address)
          } else {
            that.data.chooseAdd = -1
          }
          that.setData({
            proDetail: res.rows_product,
            payType: res.rows_payments,
            payId: res.payment_id,
            orderDetail: that.data.orderDetail,
            couList: res.xianjinquans,
            addList: res.rows_address,
            staticAdd: that.data.staticAdd,
            addrId: res.address_id,
            chooseAdd: that.data.chooseAdd,
            trackList: res.rows_shipmethod,
            static_freight: res.cost_freight,
            isFree: res.free_freight
          })
          var list = []
          for (var i = 0; i < res.rows_shipmethod.length; i++) {
            list.push(res.rows_shipmethod[i].row.name)
          }
          that.setData({
            viewTrack: list,
            trackName: res.rows_shipmethod[0].row.name,
            trackId: res.rows_shipmethod[0].row.id,
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }.bind(that), 1000)
        }
      })
    }
  },
  bindPickerChange: function(e) {
    var that = this
    for (var i = 0; i < this.data.trackList.length; i++) {
      if (i == e.detail.value) {
        this.setData({
          trackName: this.data.trackList[i].row.name,
          trackId: this.data.trackList[i].row.id,
          static_freight: this.data.trackList[i].cost
        })
      }
    }
    if (that.data.couCode.indexOf('c=') != -1) {
      that.data.couCode = that.data.couCode.substring(2)
    }
    if (that.data.orderType == 'try' || that.data.orderType == 'scantry') {
      that.data.addType = 4
    } else if (that.data.orderType == 'point') {
      that.data.addType = 5
    } else if (that.data.orderType == 'birthday') {
      that.data.addType = 5
    } else if (that.data.orderType == 'scan') {
      that.data.addType = 3
    }
    var add_id = ''
    if (that.data.staticAdd.length > 0) {
      add_id = that.data.staticAdd[0].id
    } else {
      add_id = ''
    }
    util.queryRequest('?m=cart&a=add_cashcoupon_code', {
      shipmethod_id: that.data.trackId,
      coupon_code: that.data.couCode,
      coupon_id: that.data.couId,
      checked: that.data.pid,
      cart_type: that.data.addType,
      type: that.data.orderType,
      address_id: add_id,
    }, 'GET', function(res) {
      if (res.isSuccess) {
        that.data.orderDetail.total_price = res.amount
        that.setData({
          orderDetail: that.data.orderDetail,
          static_freight: res.cost_freight
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    console.log(options)
    // this.dialog = this.selectComponent("#reload");
    var pages = getCurrentPages();
    console.log(options.selfPrice)
    this.setData({
      pid: options.id,
      addType: options.addType,
      orderType: pages[pages.length - 2].data.proType,
      selfPrice: options.selfPrice
    })
    console.log(this.data.orderType)
    if (options.try_id != undefined) {
      this.setData({
        try_id: options.try_id
      })
    }
    if (options.group_normal != undefined) {
      if (options.group_normal == 0) {
        this.setData({
          orderType: 'normal',
          hiddenCou: true
        })
      } else {
        this.setData({
          orderType: 'normal'
        })
      }
    }
    if (options.genre != undefined){
      if (this.data.orderType == 'exchange' && options.genre == 2){
        this.setData({
          orderType: 'super'
        })
      }
    }
    wx.setNavigationBarTitle({
      title: '确认订单'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f2f2f2',
    })
    this.getOrder()
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
      couList: this.data.couList
    })
    this.data.allowbind = true
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