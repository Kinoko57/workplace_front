// pages/payOrder/payOrder.js
var app = getApp()
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_iphonex: app.globalData.isiPhoneX,
    modeList: [{
      name: '微信支付',
      id: 1
    }, {
      name: '支付宝支付',
      id: 6
    }],
    choseId: 1,
    showSubmit: true,
    pay_link: '',
    showAlipay: false, //支付宝弹框
    template_id: '', //模板id
    showSkeleton: true,
    order_id: '',
    time: '',
    endtime: 0,
    saleTime: [],
    paytime: '',
    pay_endtime: 0,
    payTime: [],
    scrollHeight: 0,
    type: 1, //1代表首次支付，2代表支付尾款
    isShow_pay: true, //是否显示支付方式。当选择支付宝支付，点击复制链接时，隐藏
    orderInfo: {}
  },
  chose(e) {
    console.log(e)
    this.setData({
      choseId: e.detail.value
    })
  },
  rePay() {
    // 重新支付就是显示支付
    this.setData({
      isShow_pay: true,
      choseId: 0,
    })
  },
  paycomplete:util.throttle(function(e){
    {
      // 团购跳到团购详情，普通商品跳到普通商品详情
      const that = this
      console.log(that.data.orderInfo)
      // 判断接口状态
      let obj = {
        order_id: that.data.orderInfo.order_id
      }
      util.queryRequest('app/order/orderStatus', obj, 'GET').then(function (res) {
        if (res.code == 200 || res.code == '200') {
          console.log(res.data)
          // 判断订单状态是否支付完成
          if (res.data.status == 1 || res.data.status == 3) {
            if(res.data.status == 1&&that.data.orderInfo.rush_purchase_id<=0){
              // 部分付款未支付尾款
              wx.showToast({
                title: '您的尾款未完成支付~',
                icon: 'none',
                duration: 3000
              })
            }else{
              if (that.data.orderInfo.rush_purchase_id > 0) {
                // 团购已支付，跳转到团购详情
                wx.redirectTo({
                  url: '../groupResult/groupResult?group_id=' + that.data.orderInfo.rush_purchase_id + '&team_id=' + that.data.orderInfo.team_id,
                })
              } else {
                wx.redirectTo({
                  url: '../orderDetail/orderDetail?order_id=' + that.data.orderInfo.order_id,
                })
              }
            }

          }else if(res.data.status == 0){
            wx.showToast({
              title: '您的订单未完成支付~',
              icon: 'none',
              duration: 3000
            })
          } else {
            wx.redirectTo({
              url: '../orderDetail/orderDetail?order_id=' + that.data.orderInfo.order_id,
            })
          }
        } else {
          wx.redirectTo({
            url: '../orderDetail/orderDetail?order_id=' + that.data.orderInfo.order_id,
          })
        }
      })
    }
  }),
  // 关闭支付弹框
  closeAlipay() {
    this.setData({
      showAlipay: false
    })
  },
  getDetail() {
    const that = this
    let obj = {}
    obj = {
      order_id: that.data.order_id,
      version: app.globalData.version // 为了审核正式版本做的后手，传v1则代表接口回传不显示支付宝，
    }
    util.queryRequest('app/orderList/get', obj, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        console.log(res.data)
        if(res.data.status==5){
          // wx.navigateBack({
          //   delta: 1
          // })
          // 判断来源,在下单流程里下的，进入订单详情，从订单详情支付的，后退返回订单详情，从订单列表点支付的，进入订单详情
          if(wx.getStorageSync('source')=='create'){
            wx.redirectTo({
              url: '../orderDetail/orderDetail?order_id=' + res.data.order_id,
            })
          }else{
            wx.navigateBack({
              delta: 1
            })
          }
        }else {
          if(res.data.status==1){
            console.log("判断是不是团购orderInfo.rush_purchase_id")
            if(res.data.rush_purchase_id>0){
              // 团购，跳到团购详情
              wx.redirectTo({
                url: '../groupResult/groupResult?group_id=' + res.data.rush_purchase_id + '&team_id=' + res.data.team_id,
              })
            }else{
              if(that.data.type==1){
                wx.redirectTo({
                  url: '../orderDetail/orderDetail?order_id=' + res.data.order_id,
                })
              }else{
                console.log("点击付尾款进来的，不跳转")
              }
            }
          }else if(res.data.status==3){
            wx.redirectTo({
              url: '../orderDetail/orderDetail?order_id=' + res.data.order_id,
            })
          }
          if (res.data.rush_purchase_id > 0) {
            res.data.paygroup_price = res.data.total_amount - res.data.total_front_money - res.data.discount_price
            if (res.data.paygroup_price <= 0) {
              res.data.paygroup_price = 0
            }
          }
          res.data.related_name = res.data.item[0].related_name
          that.setData({
            orderInfo: res.data,
            template_id: res.data.template_id,
            showSkeleton: false,
          })
          let flag = true
          if (res.data.time != false && flag) {
            var secTime = util.countDown(res.data.time)
            that.setData({
              saleTime: secTime,
              endtime: res.data.time
            })
            clearInterval(that.data.time)
            that.data.time = setInterval(function () {
              if (that.data.endtime > 0) {
                secTime = util.countDown(--that.data.endtime)
                that.setData({
                  saleTime: secTime,
                  endtime: that.data.endtime
                })
              } else {
                // 倒计时结束判断当前订单的状态
                clearInterval(that.data.time)
                flag = false
                that.setData({
                  endtime: 0,
                })
                // let obj = {
                //   order_id: that.data.orderInfo.order_id
                // }
                // let linkGo = false
                // util.queryRequest('app/orderList/get', obj, 'GET').then(function (req) {
                //   if (req.code == 200 || req.code == '200') {
                //     console.log(req.data)
                //     linkGo = true
                //     if(req.data.status==5){
                //       if(wx.getStorageSync('source')=='create'){
                //         wx.redirectTo({
                //           url: '../orderDetail/orderDetail?order_id=' + req.data.order_id,
                //         })
                //       }else{
                //         wx.navigateBack({
                //           delta: 1
                //         })
                //       }
                //     }else{
                //       if (that.data.orderInfo.rush_purchase_id > 0) {
                //         // 团购判断订单状态paycomplete
                //         if (req.data.status == 1 || req.data.status == 3) {
                //           wx.redirectTo({
                //             url: '../groupResult/groupResult?group_id=' + that.data.orderInfo.rush_purchase_id + '&team_id=' + that.data.orderInfo.team_id,
                //           })
                //         } else {
                //           wx.redirectTo({
                //             url: '../orderDetail/orderDetail?order_id=' + that.data.orderInfo.order_id,
                //           })
                //         }
                //       }else{
                //         wx.redirectTo({
                //           url: '../orderDetail/orderDetail?order_id=' + that.data.orderInfo.order_id,
                //         })
                //       }
                //     }
                //   } else {
                //     linkGo = true
                //     wx.redirectTo({
                //       url: '../orderDetail/orderDetail?order_id=' + that.data.orderInfo.order_id,
                //     })
                //   }
                // })
                // setTimeout(()=>{
                //   if(!linkGo){
                //     // 7秒之后走到这一步，说明接口请求失效
                //     wx.redirectTo({
                //       url: '../orderDetail/orderDetail?order_id=' + that.data.orderInfo.order_id,
                //     })
                //   }
                // },7000)
                // // 倒计时结束返回上一页
                // clearInterval(that.data.time)
                // flag = false
                // that.setData({
                //   endtime: 0,
                // })
                // wx.navigateBack({
                //   delta: 1
                // })
                // if (wx.getStorageSync('showAlipay') != '' && wx.getStorageSync('showAlipay') != undefined) {
                //   // 点击复制支付宝链接后回到此页面
                //   wx.redirectTo({
                //     url: '../orderDetail/orderDetail?order_id=' + that.data.order_id
                //   })
                //   clearInterval(that.data.time)
                //   flag = false
                //   // that.data.orderInfo.status=5
                //   that.setData({
                //     endtime: 0,
                //     // orderInfo:that.data.orderInfo
                //   })
                // } else {
                //   // 未复制支付宝链接一直停留
                //   clearInterval(that.data.time)
                //   flag = false
                //   // that.data.orderInfo.status=5
                //   that.setData({
                //     endtime: 0,
                //     // orderInfo:that.data.orderInfo
                //   })
                //   wx.navigateBack({
                //     delta: 1
                //   })
                // }
              }
            }.bind(that), 1000)
          }
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 3000
        })
        console.log(res.msg)
      }
    })
  },
  surePay: util.throttle(function (e) {
    const that = this
    if(that.data.pay_endtime>0){
      console.log("倒计时限制中")
    }else{
      if (that.data.showSubmit) {
        that.setData({
          showSubmit: false
        })
        if (that.data.choseId != 0) {
          let url = ''
          if (that.data.type == 1) {
            url = 'app/orderList/getOrderPayId'
          }
          if (that.data.type == 2) {
            url = 'app/order/payTail'
          }
          util.queryRequest(url, {
            order_id: that.data.order_id
          }, 'GET').then(function (req) {
            if (req.code === 200 || req.code === '200') {
              let pay_id = ''
              // 立即支付
              if (that.data.type == 1) {
                pay_id = req.data
              }
              //  尾款支付
              if (that.data.type == 2) {
                pay_id = req.data.pay_id
              }
              util.queryRequest('app/pay/pay', {
                pay_id: pay_id,
                payment_type: that.data.choseId
              }, 'POST').then(function (res) {
                console.log(res)
                if (res.code === 200 || res.code === '200') {
                  if (that.data.choseId == 1) {
                    if (res.data == true) {
                      wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 1000
                      })
                      setTimeout(() => {
                        // 团购支付成功跳转
                        if (that.data.orderInfo.rush_purchase_id > 0) {
                          // 团购待支付，跳转到团购详情
                          wx.redirectTo({
                            url: '../groupResult/groupResult?group_id=' + that.data.orderInfo.rush_purchase_id + '&team_id=' + that.data.orderInfo.team_id,
                          })
                        } else {
                          wx.redirectTo({
                            url: '../orderManage/orderManage?status=type_2',
                          })
                        }
                        that.setData({
                          showSubmit: true
                        })
                      }, 1000)
                    } else {
                      wx.requestPayment({
                        'timeStamp': res.data.timeStamp,
                        'nonceStr': res.data.nonceStr,
                        'package': res.data.package,
                        'signType': res.data.signType,
                        'paySign': res.data.paySign,
                        'success': function (res) {
                          wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 1000
                          })
                          if (that.data.type == 1) {
                            wx.requestSubscribeMessage({
                              tmplIds: [that.data.template_id],
                              success(res) {
                                console.log(res, "成功")
                              },
                              complete(res) {
                                if (res[that.data.template_id] == "reject") {
                                  wx.showModal({
                                    title: '订阅通知被拒绝',
                                    content: '如果勾选了"总是保持以上选择",打开消息订阅开关后请勾选要通知的消息',
                                    success(res) {
                                      if (res.confirm) {
                                        wx.openSetting({
                                          success(res) {
                                            res.subscriptionsSetting = {
                                              withSubscriptions: true
                                            }
                                          }
                                        })
                                        console.log('用户点击确定')
                                      } else if (res.cancel) {
                                        console.log('用户点击取消')
                                      }
                                    }
                                  })
                                } else {
                                  console.log(res, "用户点击允许")
                                }
                                console.log(res['dzKrSTTDeWdQ033WxVacCEar9HINRPKj6fXOvQwWS0c'], "complete")
                              },
                            })
                          }
                          setTimeout(function () {
                            // 团购支付成功跳转
                            if (that.data.orderInfo.rush_purchase_id > 0) {
                              // 团购待支付，跳转到团购详情
                              wx.redirectTo({
                                url: '../groupResult/groupResult?group_id=' + that.data.orderInfo.rush_purchase_id + '&team_id=' + that.data.orderInfo.team_id,
                              })
                            } else {
                              wx.redirectTo({
                                url: '../orderManage/orderManage?status=type_2',
                              })
                            }
                            that.setData({
                              showSubmit: true
                            })
                          }, 1000)
                        },
                        'fail': function (res) {
                          // 监听支付失败
                          util.queryRequest('app/pay/payFail', {
                            pay_id: pay_id,
                          }, 'POST').then(function (rew) {
                            if (res.rew === 200 || res.rew === '200') {
                              console.log('监听失败')
                            }
                          })
                          that.setData({
                            showSubmit: true
                          })
                          console.log("支付取消或失败", res)
                        },
                        'complete': function (res) {
                          console.log("支付complete", res)
                        }
                      })
                    }
                  } else {
                    wx.navigateTo({
                      url: '../paymentGuide/paymentGuide?link=' + encodeURIComponent(res.data.alipay),
                    })
                    that.setData({
                      // showAlipay:true,
                      showSubmit: true,
                      //  pay_link:res.data.alipay
                    })
                  }
                } else {
                  that.setData({
                    showSubmit: true
                  })
                  wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
            }else if(req.code == 49000){
              wx.showToast({
                title: '已有支付请求中，请稍后再试',
                icon: 'none',
                duration: 2000
              })
              console.log(req.msg)
              // 支付倒计时展示
              that.setData({
                showSubmit: true
              })
              var secTime = util.countDown(parseInt(req.msg))
              that.setData({
                payTime: secTime,
                pay_endtime: parseInt(req.msg)
              })
              clearInterval(that.data.paytime)
              that.data.paytime = setInterval(function () {
                if (that.data.pay_endtime > 0) {
                  secTime = util.countDown(--that.data.pay_endtime)
                  that.setData({
                    payTime: secTime,
                    pay_endtime: that.data.pay_endtime
                  })
                } else {
                  // 倒计时结束判断当前订单的状态
                  clearInterval(that.data.paytime)
                  that.setData({
                    pay_endtime: 0,
                    showSubmit:true
                  })
                }
              }.bind(that), 1000)
            } else {
              that.setData({
                showSubmit: true
              })
              wx.showToast({
                title: req.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
          setTimeout(()=>{
            that.setData({
              showSubmit: true
            })
          }, 5000)
        } else {
          wx.showToast({
            title: '请选择支付方式',
            icon: 'none',
            duration: 1000
          })
          that.setData({
            showSubmit: true
          })
        }
      }
    }

  }),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    this.setData({
      order_id: options.order_id,
      type: options.type
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
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
    // 删除缓存学员信息
    wx.removeStorageSync('sure_add')
    // 获取支付宝链接是否复制
    // console.log(wx.getStorageSync('showAlipay'),"zhi")
    if (wx.getStorageSync('showAlipay') !== '' && wx.getStorageSync('showAlipay') != undefined) {
      this.setData({
        isShow_pay: wx.getStorageSync('showAlipay')
      })
    }
    console.log("支付宝链接是否复制")
    console.log(this.data.isShow_pay)
    this.getDetail()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("销毁定时器")
    // 页面销毁
    // clearInterval(this.data.time)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("销毁定时器")
    // 页面销毁
    clearInterval(this.data.time)
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
  // onShareAppMessage: function () {

  // }
})