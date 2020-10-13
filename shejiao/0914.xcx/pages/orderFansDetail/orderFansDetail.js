// pages/orderDetail/orderDetail.js
var app = getApp()
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    lin_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    scrollHeight:0,
    orderInfo:{},
    time:'',
    detailshow:true,
    animation:{},
    saleTime: [],
    endtime:0,
    filePath: app.globalData.fileUrl,
    options:{},
    address_id:'',
    is_iphonex: app.globalData.isiPhoneX,
    showModel: false,
    showSend: false,
    choseInfo: {},
    companyList: [],
    index: '',
    track_number: '',
  },
  goLink(e){
    console.log(e)
    wx.navigateTo({
      url: e.currentTarget.dataset.link+'?oid='+e.currentTarget.dataset.oid
    })
  },
  goSales(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  // 显示清单列表
  showdisc: function () {
    const that = this
    // this.setData({
    //   detailshow: false,
    // })
    // var animation = wx.createAnimation({
    //   duration: 500,
    //   timingFunction: 'ease-out',
    // })
    // this.animation = animation
    // var querys = wx.createSelectorQuery()
    // querys.select('.pro_disc_detail').boundingClientRect()
    // querys.exec(function (res) {
    //   console.log(res)
    //   that.animation.translateY(-res[0].height).step()
    //   that.setData({
    //     animation: that.animation.export()
    //   })
    // })
  },
  // 关闭清单列表
  closedisc: function () {
    this.animation.translateY(0).step()
    this.setData({
      animation: this.animation.export(),
      detailshow: true,
    })
  },
  getDetail(){
    const that=this
    let obj={}
    console.log(that.data.options)
    obj = {
      oid: that.data.options.oid,
    }
    util.queryRequest('/app/orders/getDetail',obj, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          orderInfo: res.data
        })
        if (res.data.public.status == 0||res.data.public.status == 2||res.data.public.status==6||res.data.public.status == 3||res.data.public.is_modif==1||res.data.public.is_after==1) {
            that.setData({
              scrollHeight: app.globalData.useWindowHeight - 60
            })
        }else{
          that.setData({
            scrollHeight: app.globalData.useWindowHeight
          })
        }
        let flag=true
        if(res.data.public.status == 0&&res.data.public.cancel_second!=undefined&&res.data.public.cancel_second>0){
            var secTime = util.countDown(res.data.public.cancel_second)
            that.setData({
              saleTime: secTime,
              endtime: res.data.public.cancel_second
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
                clearInterval(that.data.time)
                flag=false
                that.setData({
                  endtime: 0,
                })
                that.getDetail()
              }
            }.bind(that), 1000)
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
  // 修改地址
  changeAdress(){
    console.log(this.data.public)
    if(this.data.orderInfo.public.status==0){
      wx.navigateTo({
        url: '../myAdress/myAdress?type=choseOrder&order_id='+this.data.orderInfo.public.oid+'&status='+this.data.orderInfo.public.status,
      })
    }else{
      wx.navigateTo({
        url: '../myAdress/myAdress?type=choseOrder&order_id='+this.data.orderInfo.public.oid+'&status='+this.data.orderInfo.public.status,
      })
    }
  },
  // 复制订单
  copyOrd(e){
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.id,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1000
        });
      }
    });
  },
  // 立即支付
  buyBtn() {
    const that=this
    wx.navigateTo({
      url: '../payOrder/payOrder?pay_id='+ that.data.orderInfo.public.order_pay_id+'&pay_price='+ that.data.orderInfo.public.price+'&time='+that.data.orderInfo.public.cancel_second,
    })
  },
  // 确认收货
  sureBtn() {
    const that=this
    wx.showModal({
      title: '提示',
      content: '要确认收货吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '确认中...',
            mask: true
          })
          util.queryRequest('/app/orders/confirmOrder', {
            oid: that.data.orderInfo.public.oid,
          }, 'POST').then(function (res) {
            if (res.code === 200 || res.code === '200') {
              wx.hideLoading()
              wx.showToast({
                title: '确认收货成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
              })
              console.log(res.msg)
              console.log('提交错误')
            }
          })
        } else if (res.cancel) {

          console.log('用户点击取消')
        }
      }
    })
  },
  sendOrder: util.throttle(function (e){
    this.setData({
      showModel: true,
      showSend: true
    })
  }),
  hidenModel() {
    this.setData({
      showModel: false,
      showSend: false,
    })
  },
    // 获取快递信息
    getLogInfo() {
      const that = this
      util.queryRequest('/app/after/getLogiNameCode', {}, 'GET').then(function (res) {
        if (res.code === 200 || res.code === '200') {
          that.setData({
            companyList: res.data,
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
          console.log(res.msg)
        }
      })
    },
    //选择快递
    bindPickerChange(e) {
      this.setData({
        index: e.detail.value,
      })
    },
    saveTrackNumber(e) {
      this.setData({
        track_number: e.detail.value
      })
    },
    viewTrack:util.throttle(function(e){
      console.log(e[0].currentTarget.id)
      console.log(e[0].currentTarget.dataset.oid)
      wx.navigateTo({
        url: '/pages/findLog/findLog?oid='+e[0].currentTarget.dataset.oid
      })
    }),
    // 物流信息提交
    submitTrack: util.throttle(function (e) {
      const that = this
      if (that.data.index !== '') {
        if (that.data.track_number != '') {
          let obj = {
            oid: that.data.orderInfo.public.oid,
            logi_no: that.data.track_number,
            logi_code: that.data.companyList[that.data.index].id,
          }
          util.queryRequest('/app/orders/orderDelivery', obj, 'POST').then(function (res) {
            wx.hideLoading()
            if (res.code === 200 || res.code === '200') {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(() => {
                that.hidenModel()
                that.getDetail()
              }, 1000)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
              })
              console.log(res.msg)
            }
          })
        } else {
          wx.showToast({
            title: '物流单号不能为空',
            icon: 'none',
            duration: 1000
          })
        }
      } else {
        wx.showToast({
          title: '请选择快递公司',
          icon: 'none',
          duration: 1000
        })
      }
  
    }),
  // 取消订单
  cancelBtn() {
    const that=this
    wx.showModal({
      title: '提示',
      content: '确认要取消订单吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '确认中...',
            mask: true
          })
          util.queryRequest('/app/pay/cancel', {
            pay_id:that.data.orderInfo.public.order_pay_id,
          }, 'POST').then(function (res) {
            if (res.code === 200 || res.code === '200') {
              wx.hideLoading()
              wx.showToast({
                title: '订单已取消',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
              })
              console.log(res.msg)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    this.setData({
      options: options
    })
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false,
      })
    }, 500)
    wx.setNavigationBarTitle({
      title: '订单详情',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
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
    if (wx.getStorageSync('choseAdd') != undefined) {
      this.setData({
        address_id: wx.getStorageSync('choseAdd')
      })
    }
    this.getLogInfo()
    this.getDetail()
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
    clearInterval(this.data.time)
    wx.removeStorageSync('choseAdd')
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