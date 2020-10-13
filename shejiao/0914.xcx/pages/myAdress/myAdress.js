// pages/clientList/clientList.js
let util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    showClientDress: false,
    line_bg_color:'linear-gradient(-90deg,rgba(221,44,47,1) 0%,rgba(255,80,83,1) 100%)',
    bg_color:'linear-gradient(90deg,rgba(70,70,70,1) 0%,rgba(47,47,47,1) 100%)',
    color:'#fff',
    is_iphonex: app.globalData.isiPhoneX,
    addrList: [],
    addType:'',
    showSkeleton:true,
    scrollHeight: '',
    hasData: true,
    is_end: false,
    is_load: false,
    fromType: '',
    form: '',
    closeDia: false,
    order_id: '',
    status:'',
    showSearch: false,
    newContent: '刷新数据',
    timer: 5,
    showContent: true,
    loading: false,
    timerOut: null,
    total: '',
    findcustmus: '',
    page:1,
    size:10,
    is_iphonex: app.globalData.phoneType,
  },
  editAdd: function (e) {
    wx.navigateTo({
      url: '../editAdress/editAdress?type=' + e.currentTarget.dataset.type + '&id=' + e.currentTarget.dataset.id
    })
  },
  getList: function () {
    const that = this
    util.queryRequest('/app/address/index',{}, 'GET').then(function (res) {
      if (res.code === 200 || res.code === '200') {
        that.setData({
          addrList: res.data,
          showSkeleton: false
        })
      }
    })
  },
  chosAdd:util.throttle(function (e){
    const that=this
    if(that.data.addType!=''&&that.data.addType!=undefined){
      if (that.data.addType =='chose'){
        wx.setStorageSync('choseAdd', e[0].currentTarget.id)
        wx.navigateBack({
          delta: 1
        })
      }else if(that.data.addType =='sale_chose'){
        wx.setStorageSync('sale_address', e[0].currentTarget.dataset.info)
        wx.navigateBack({
          delta: 1
        })
      }else if(that.data.addType =='change_chose'){
        let obj={}
        obj={
          address_id:e.currentTarget.id,
          oid:that.data.order_id,
        }
        util.queryRequest('/app/lotteryOrder/modifyAddress',obj, 'POST').then(function (res) {
          if (res.code === 200 || res.code === '200') {
            wx.showToast({
              title: '地址修改成功',
              icon:'success',
              duration:1000
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1000)
          }else{
            wx.showToast({
              title: '地址修改失败',
              icon:'none',
              duration:1000
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1000)
          }
        })
      }else{
        let obj={}
        obj={
          address_id:e[0].currentTarget.id,
          oid:that.data.order_id,
        }
        util.queryRequest('/app/orders/modifOrderAddress',obj, 'POST').then(function (res) {
          if (res.code === 200 || res.code === '200') {
            wx.showToast({
              title: '地址修改成功',
              icon:'success',
              duration:1000
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1000)
          }else{
            wx.showToast({
              title: '地址修改失败',
              icon:'none',
              duration:1000
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1000)
          }
        })
      }
    }
  },1000),
  delAdd: function (e) {
    // if (this.data.addrList.length <= 1) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '必须保留一条地址哦~',
    //     showCancel: false,
    //     confirmText: '我知道了',
    //     success(res) {
    //       if (res.confirm) {
    //         // wx.navigateBack({
    //         //   delta: 1
    //         // })
    //         console.log("用户点击了确定")
    //       }
    //     }
    //   })
    // } else {
    //   var that = this
    //   wx.showModal({
    //     title: '提示',
    //     content: '是否删除当前地址',
    //     success: function (res) {
    //       if (res.confirm) {
    //         util.queryRequest('app/info/remove', {
    //           id: e.currentTarget.id
    //         }, 'GET', function (res) {
    //           console.log(res)
    //           if (res.code == 200) {
    //             wx.showToast({
    //               title: '删除成功',
    //               icon: 'success',
    //               duration: 1000
    //             })
    //             setTimeout(function () {
    //               util.queryRequest('app/info/indexAddr', {}, 'GET', function (res) {
    //                 if (res.code == 200) {
    //                   that.setData({
    //                     addrList: res.data
    //                   })
    //                 }
    //               })
    //             }, 1000)
    //           } else {
    //             wx.showModal({
    //               title: '提示',
    //               content: res.msg,
    //               showCancel: false,
    //               confirmText: '我知道了',
    //               success(res) {
    //                 if (res.confirm) {
    //                   console.log("用户点击了确定")
    //                 }
    //               }
    //             })
    //           }
    //         })
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    console.log(options)
    if (options!=undefined){
      that.setData({
        addType: options.type,
        order_id:options.order_id,
        status:options.status,
      })
    }
    this.setData({
      scrollHeight: app.globalData.useWindowHeight - 61
    })
    wx.setNavigationBarTitle({
      title: '我的收货地址',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#e13816',
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
    this.getList()
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