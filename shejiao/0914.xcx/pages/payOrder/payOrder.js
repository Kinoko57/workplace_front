// pages/payOrder/payOrder.js
var app = getApp()
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg_color:'#FF0000',//背景颜色
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',//渐变背景颜色
    showSkeleton:true,
    payList:[
      {id:1,name:'微信支付',image:app.globalData.staticUrl+'common/wx.png'},
      // {id:2,name:'钱包余额（￥22.00）',image:app.globalData.staticUrl+'common/cash.png'},
      
    ],
    bankList:[
      // {id:1,name:'中国民生银行（尾号2562）'},{id:2,name:'中国工商银行（尾号2562）'}
    ],//银行卡列表
    time:'',// 倒计时
    end_time:'',//倒计时结束
    // downTime:'',
    saleTime: [],
    choseId:1,
    pay_id:'',//支付单号
    pay_price:'',//支付价格
  },
  // 选择支付方式
  chose(e) {
    console.log(e)
    this.setData({
      choseId: e.detail.value
    })
  },
  topayMent:util.throttle(function (e){
    const that=this
      wx.showLoading({
        title: '支付中...',
      })
     util.queryRequest('/app/pay/pay',{
      pay_id: that.data.pay_id,
      payment_type:1
    }, 'POST').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        wx.hideLoading()
        wx.removeStorageSync('choseAdd')
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
              // 用户订阅信息提示框
              wx.requestSubscribeMessage({
                tmplIds: ['lH8gHiZi50_L6ob94zgeYiJDfVXlo_Qam_-HebKa4Hw','dllFIy32SmgY3yhAWQdsUVDEAysnsHn6TLbEk3hjxE8'],
                success(res) {
                  console.log(res,"成功")
                },
                complete(res) {
                  if(res['lH8gHiZi50_L6ob94zgeYiJDfVXlo_Qam_-HebKa4Hw']=="reject"){
                    wx.showModal({
                      title: '订阅通知被拒绝',
                      content: '如果勾选了"总是保持以上选择",打开消息订阅开关后请勾选要通知的消息',
                      success (res) {
                        if (res.confirm) {
                          wx.openSetting({
                            success (res) {
                              res.subscriptionsSetting={
                                withSubscriptions:true
                              }
                            }
                          })
                          console.log('用户点击确定')
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                  }else{
                    console.log(res,"用户点击允许")
                  }
                  console.log(res['lH8gHiZi50_L6ob94zgeYiJDfVXlo_Qam_-HebKa4Hw'],"complete")
                },
              })
              setTimeout(function(){
                wx.redirectTo({
                  url: '../paySuccess/paySuccess?pay_price='+that.data.pay_price,
                })
              },1000)
            },
            'fail': function (res) {
              wx.redirectTo({
                url: '../orderManage/orderManage?status=type_0',
              })
              console.log("支付取消或失败", res)

            },
            'complete': function (res) {
              console.log("支付complete", res)
            }
          })
      }else{
        wx.hideLoading()
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    that.setData({
      end_time:options.time,
      pay_id:options.pay_id,
      pay_price:options.pay_price
    })
    // let newTime = Math.round(new Date().getTime()/1000)
    // let downTime=that.data.end_time-newTime
    var secTime = util.countDown(that.data.end_time)
    that.setData({
      saleTime: secTime,
      downTime: that.data.end_time
    })
    clearInterval(that.data.time)
    that.data.time = setInterval(function () {
      if (that.data.downTime > 0) {
        secTime = util.countDown(--that.data.downTime)
        that.setData({
          saleTime: secTime,
          downTime: that.data.downTime
        })
      } else {
        clearInterval(that.data.time)
        that.setData({
          downTime:0
        })
      }
    }.bind(that), 1000)
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
    }, 500)
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
    const that=this

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
  onShareAppMessage: function () {

  }
})