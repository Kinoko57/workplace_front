// pages/orderDetail/orderDetail.js
var app = getApp()
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    scrollHeight: app.globalData.useWindowHeight,
    orderInfo:{},
    time:'',
    detailshow:true,
    showSkeleton:true,
    saleTime: [],
    showAlipay:false,
    index:0,
    modeList: [{ name: '微信支付', id: 1 }, { name: '支付宝支付', id: 6 }],
    endtime:0,
    options:{},
    address_id:'',
    is_iphonex: app.globalData.isiPhoneX,
  },
  visitImg:util.throttle(function(e){
    if(e[0].currentTarget.dataset.after_status==0&&this.data.orderInfo.status!=0&&this.data.orderInfo.status!=5){
      console.log(e[0])
      let name = e[0].currentTarget.dataset.name
      let time = e[0].currentTarget.dataset.time
      let barrack = e[0].currentTarget.dataset.barrack
      wx.navigateTo({
        url: '../viewImage/viewImage?name=' + name + '&time=' + time + '&barrack=' + barrack,
      })
    }
  }),
  goSales(e){
    console.log(e)
    wx.navigateTo({
      url: '../saleAfter/saleAfter?order_id='+e.currentTarget.dataset.order_id+'&from=orderDetail',
    })
  },
  getDetail(){
    const that=this
    let obj={}
    console.log(that.data.options)
      obj = {
        order_id: that.data.options.order_id,
      }
    util.queryRequest('app/orderList/get',obj, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
       if(res.data.rush_purchase_id>0){
        res.data.paygroup_price=res.data.total_amount-res.data.total_front_money-res.data.discount_free_price
          if(res.data.paygroup_price<=0){
            res.data.paygroup_price=0
          }
       }
      //  分班要求信息分割
       if(res.data.item[0].related_name!=''){
         let arr=JSON.parse(res.data.item[0].related_name)
         let related_name=[]
         for(let i=0;i<arr.length;i++){
          related_name.push(arr[i].name)
         }
         res.data.related_name=related_name.join(',')
       }else{
        res.data.related_name=res.data.item[0].related_name
       }
        that.setData({
          orderInfo: res.data,
          showSkeleton: false,
        })
        let flag=true
        if (res.data.time!=false&&flag){
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
              clearInterval(that.data.time)
              flag=false
              that.data.orderInfo.status=5
              that.setData({
                endtime: 0,
                orderInfo:that.data.orderInfo
              })
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
  // 复制订单号
  copyOrd(e){
    var that = this;
    console.log(e)
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
  // 复制教官码
  copyInviter(e){
    var that = this;
    console.log(e)
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
  // 支付尾款跳转
  bindPickerpaySurplus(e){
    console.log(e)
    wx.setStorageSync('source', 'detail')
    wx.navigateTo({
      url: '../payOrder/payOrder?order_id='+ e.currentTarget.dataset.order_id+'&type=2',
    })
  },
  // 立即支付跳转
  bindPickerpay(e){
    console.log(e)
    wx.setStorageSync('source', 'detail')
    wx.navigateTo({
      url: '../payOrder/payOrder?order_id='+ e.currentTarget.dataset.order_id+'&type=1',
    })
  },
  // 取消订单
  cancelBtn(e) {
    const that=this
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确认要取消订单吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '确认中...',
            mask: true
          })
          util.queryRequest('app/orderList/cancelOrder', {
            order_id:e.currentTarget.dataset.order_id,
          }, 'GET').then(function (res) {
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
            } else if(res.code == 49000){
              let msg = '已有支付请求中，请在'+ res.msg + '秒后尝试取消'
              wx.showToast({
                title: msg,
                icon: 'none',
                duration: 2000
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
    // 删除缓存支付宝
    wx.removeStorageSync('showAlipay')
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
  // onShareAppMessage: function () {

  // }
})